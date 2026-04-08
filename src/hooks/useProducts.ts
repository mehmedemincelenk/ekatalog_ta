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
  const THRESHOLD = 9999;
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

  // Verileri Çek
  useEffect(() => {
    if (!SHEET_URL) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Bağlantı hatası');
        
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = (results.data as Record<string, any>[]).map(mapToProduct);
            
            // EĞER lokalde zaten ürünler varsa ve sayıları aynıysa (reorder durumu), 
            // Sheets'ten gelen eski sıralamayı hemen kabul etme.
            setProducts(prev => {
              if (prev.length > 0 && prev.length === parsedData.length) {
                return prev; // Lokal sıralamayı koru
              }
              localStorage.setItem(CACHE_KEY, JSON.stringify(parsedData));
              return parsedData;
            });
            
            setError(null);
            setLoading(false);
          },
        });
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, [mapToProduct]);

  // Sayısal Sıralama Değiştirme (Hook Seviyesinde - Tüm ürünler üzerinde)
  const reorderProductsInCategory = useCallback(async (productId: string, newPosition: number) => {
    setProducts(prev => {
      const productToMove = prev.find(p => p.id === productId);
      if (!productToMove) return prev;

      const categoryName = productToMove.category || 'KATEGORİSİZ / DİĞER';
      const categoryProductIndices: number[] = [];
      const categoryProducts: Product[] = [];
      
      prev.forEach((p, idx) => {
        if ((p.category || 'KATEGORİSİZ / DİĞER') === categoryName) {
          categoryProductIndices.push(idx);
          categoryProducts.push(p);
        }
      });

      const updatedCategoryProducts = [...categoryProducts];
      const oldIdxInCat = updatedCategoryProducts.findIndex(p => p.id === productId);
      updatedCategoryProducts.splice(oldIdxInCat, 1);
      updatedCategoryProducts.splice(newPosition - 1, 0, productToMove);

      const newProducts = [...prev];
      categoryProductIndices.forEach((globalIdx, i) => {
        newProducts[globalIdx] = updatedCategoryProducts[i];
      });

      // Cache'i anında güncelle ki Sheets'ten gelen eski veri geri yüklemesin
      localStorage.setItem(CACHE_KEY, JSON.stringify(newProducts));
      
      // Sheets'e gönder
      const idList = newProducts.map(p => p.id);
      syncWithSheet('UPDATE_PRODUCT_ORDER', { idList });

      return newProducts;
    });
  }, [syncWithSheet]);

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

  const paginatedProducts = useMemo(() => {
    return filteredProducts;
  }, [filteredProducts]);

  const existingCategories = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return sortCategories(unique, categoryOrder);
  }, [products, categoryOrder]);

  const addProduct = async (product: Omit<Product, 'id' | 'inStock' | 'is_archived'>) => {
    const newId = String(Date.now());
    const fullProduct: Product = { ...product, id: newId, inStock: true, is_archived: false };
    setProducts(prev => {
      const updated = [fullProduct, ...prev];
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
    await syncWithSheet('ADD', { product: fullProduct });
  };

  const removeProduct = async (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
    await syncWithSheet('DELETE', { id });
  };

  const updateProduct = async (id: string, changes: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...changes } : p);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
    await syncWithSheet('UPDATE', { id, changes });
  };

  const renameCategory = async (oldName: string, newName: string) => {
    if (!oldName || !newName || oldName === newName) return;
    setProducts(prev => {
      const updated = prev.map(p => p.category === oldName ? { ...p, category: newName } : p);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
    setCategoryOrder(prev => prev.map(c => c === oldName ? newName : c));
    await syncWithSheet('RENAME_CATEGORY', { oldName, newName });
  };

  const removeCategoryFromProducts = async (catName: string) => {
    setProducts(prev => {
      const updated = prev.map(p => p.category === catName ? { ...p, category: '' } : p);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
    setCategoryOrder(prev => prev.filter(c => c !== catName));
    await syncWithSheet('DELETE_CATEGORY', { catName });
  };

  const updateCategoryOrder = async (newOrder: string[]) => {
    setCategoryOrder(newOrder);
    const uniqueCats = [...new Set(products.map(p => p.category).filter(Boolean))];
    const filteredOrder = newOrder.filter(name => uniqueCats.includes(name));
    const orderList = filteredOrder.map((name, idx) => ({ name, order: idx + 1 }));
    await syncWithSheet('UPDATE_CATEGORY_ORDER', { orderList });
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
    reorderProductsInCategory,
    hasMore: false,
    loadMore: () => {},
  };
}
