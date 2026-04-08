import { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import {
  sortCategories,
  STORAGE_KEY,
  CATEGORY_ORDER as DEFAULT_ORDER,
} from '../data/config';
import { Product } from '../types';
import { useLocalStorage } from './useLocalStorage';

const SHEET_URL = import.meta.env.VITE_SHEET_URL || '';
const APPS_SCRIPT_URL = import.meta.env.VITE_SHEET_SCRIPT_URL || '';
const ORDER_KEY = STORAGE_KEY + '_order';
const CACHE_KEY = STORAGE_KEY + '_data_cache';

/**
 * useProducts Hook — Ürün verilerini yönetir, filtreler ve senkronize eder.
 */
export function useProducts(
  search = '',
  activeCategories: string[] = [],
  isAdmin = false,
) {
  const THRESHOLD = 9999; // Sayfalamayı App.tsx kategori bazlı yöneteceği için burada devre dışı bırakıyoruz
  const [isExpanded, setIsExpanded] = useState(false);

  // İlk değeri cache'den alarak başlatıyoruz
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [categoryOrder, setCategoryOrder] = useLocalStorage<string[]>(ORDER_KEY, DEFAULT_ORDER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Arama veya kategori değiştiğinde görünümü daralt
  useEffect(() => {
    setIsExpanded(false);
  }, [search, activeCategories]);

  // Veri Dönüştürücü (Mapper) — Functional Programming yaklaşımı
  const mapToProduct = useCallback((raw: Record<string, any>): Product => {
    return {
      id: String(raw.id || Date.now()),
      name: String(raw.name || ''),
      category: String(raw.category || 'Diğer'),
      price: String(raw.price || '0'),
      image: raw.image || null,
      description: String(raw.description || ''),
      inStock: String(raw.inStock).toLowerCase() !== 'false',
      is_archived: String(raw.is_archived).toLowerCase() === 'true',
    };
  }, []);

  // Sync İşlemleri — Daha güvenli fetch
  const syncWithSheet = useCallback(
    async (action: string, payload: Record<string, any>) => {
      if (!APPS_SCRIPT_URL) return false;
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, ...payload }),
        });
        return true;
      } catch (err) {
        console.error(`[Sync Error] ${action}:`, err);
        return false;
      }
    },
    [],
  );

  // 1. Verileri Çek
  useEffect(() => {
    if (!SHEET_URL) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Bağlantı hatası');
        
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = (results.data as Record<string, any>[]).map(mapToProduct);
            setProducts(parsedData);
            // Başarılı yüklemede cache'i güncelle
            localStorage.setItem(CACHE_KEY, JSON.stringify(parsedData));
            setError(null);
            setLoading(false);
          },
          error: (err) => {
            console.error('PapaParse Error:', err);
            setError('Veri ayrıştırma hatası');
            setLoading(false);
          },
        });
      } catch (err) {
        console.error('Fetch Error:', err);
        if (products.length === 0) {
          setError('Katalog şu an çevrimdışı (Google Sheets hatası).');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [mapToProduct, products.length]);

  // 2. Arama Loglama (Google Sheets'e Yazma)
  const logSearch = useCallback(
    async (term: string) => {
      if (!term || term.length < 3) return;
      await syncWithSheet('LOG_SEARCH', { term });
    },
    [syncWithSheet],
  );

  // Debounce Search Log
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) logSearch(search);
    }, 2000);
    return () => clearTimeout(timer);
  }, [search, logSearch]);

  // Yeni bir kategori eklendiğinde sıralamaya dahil et
  useEffect(() => {
    if (products.length === 0) return;
    const uniqueCats = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    const missingCats = uniqueCats.filter((c) => !categoryOrder.includes(c));
    if (missingCats.length > 0) {
      setTimeout(
        () => setCategoryOrder((prev) => [...prev, ...missingCats]),
        0,
      );
    }
  }, [products, categoryOrder, setCategoryOrder]);

  // Filtreleme Mantığı
  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();
    return products.filter((p) => {
      if (!isAdmin && p.is_archived) return false;
      const matchSearch = !term || p.name.toLowerCase().includes(term);
      const matchCategory =
        activeCategories.length === 0 || activeCategories.includes(p.category);
      return matchSearch && matchCategory;
    });
  }, [products, search, activeCategories, isAdmin]);

  // Sayfalanmış Ürünler: Admin değilse ve genişletilmemişse ilk 40'ı göster
  const paginatedProducts = useMemo(() => {
    if (isAdmin || isExpanded || filteredProducts.length <= THRESHOLD) {
      return filteredProducts;
    }
    return filteredProducts.slice(0, THRESHOLD);
  }, [filteredProducts, isExpanded, isAdmin, THRESHOLD]);

  const hasMore = !isAdmin && !isExpanded && filteredProducts.length > THRESHOLD;

  const loadMore = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const existingCategories = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return sortCategories(unique, categoryOrder);
  }, [products, categoryOrder]);

  const addProduct = async (
    product: Omit<Product, 'id' | 'inStock' | 'is_archived'>,
  ) => {
    const newId = String(Date.now());
    const fullProduct: Product = {
      ...product,
      id: newId,
      inStock: true,
      is_archived: false,
    };
    setProducts((prev) => [fullProduct, ...prev]);
    await syncWithSheet('ADD', { product: fullProduct });
  };

  const removeProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await syncWithSheet('DELETE', { id });
  };

  const updateProduct = async (id: string, changes: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );
    await syncWithSheet('UPDATE', { id, changes });
  };

  const renameCategory = async (oldName: string, newName: string) => {
    if (!oldName || !newName || oldName === newName) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.category === oldName ? { ...p, category: newName } : p,
      ),
    );
    setCategoryOrder((prev) => prev.map((c) => (c === oldName ? newName : c)));
    await syncWithSheet('RENAME_CATEGORY', { oldName, newName });
  };

  const removeCategoryFromProducts = async (catName: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.category === catName ? { ...p, category: '' } : p)),
    );
    setCategoryOrder((prev) => prev.filter((c) => c !== catName));
    await syncWithSheet('DELETE_CATEGORY', { catName });
  };

  const updateCategoryOrder = async (newOrder: string[]) => {
    setCategoryOrder(newOrder);
    const uniqueCats = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    const filteredOrder = newOrder.filter((name) => uniqueCats.includes(name));
    const orderList = filteredOrder.map((name, idx) => ({
      name,
      order: idx + 1,
    }));
    await syncWithSheet('UPDATE_CATEGORY_ORDER', { orderList });
  };

  const reorderProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    const idList = newProducts.map((p) => p.id);
    await syncWithSheet('UPDATE_PRODUCT_ORDER', { idList });
  };

  return {
    products: paginatedProducts,
    totalCount: filteredProducts.length,
    allProducts: products,
    existingCategories,
    categoryOrder,
    loading,
    error,
    updateProduct,
    removeProduct,
    addProduct,
    renameCategory,
    removeCategoryFromProducts,
    updateCategoryOrder,
    reorderProducts,
    hasMore,
    loadMore,
  };
}
