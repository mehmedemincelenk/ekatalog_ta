import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  LABELS,
  TECH,
} from '../../data/config';
import { Product } from '../../types';
import { useSettings } from '../store/useSettings';
import { useProductStorage } from '../storage/useProductStorage';
import { getActiveStoreSlug } from '../../utils/helpers/store';

const REPOSITORY_TABLE = 'prods';

/**
 * USE PRODUCTS HOOK (INVENTORY & CATALOG ENGINE)
 * -----------------------------------------------------------
 * Manages product lifecycle and inventory sync.
 * Delegates storage concerns to useProductStorage.
 */
export function useProducts(
  currentSearchQuery = '',
  activeFilterCategories: string[] = [],
  isAdministrativeModeActive = false,
) {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const { settings: storeSettings, loading: isSettingsLoading } = useSettings(isAdministrativeModeActive);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  
  const { uploadImage: uploadToStorage, deleteImage: removeFromStorage } = useProductStorage();

  const synchronizeInventory = useCallback(async (isSilent = false) => {
    const currentSlug = getActiveStoreSlug();
    if (currentSlug === 'main-site' || !storeSettings.id) {
      if (currentSlug === 'main-site' && !isSilent) setIsInventoryLoading(false);
      return;
    }
    
    if (!isSilent) setIsInventoryLoading(true);
    
    const { data: repositoryData, error: fetchError } = await supabase
      .from(REPOSITORY_TABLE)
      .select('*')
      .eq('store_id', storeSettings.id)
      .order('sort_order', { ascending: true });
    
    if (fetchError) {
      console.error('Inventory sync failed:', fetchError);
    } else if (repositoryData) {
      setCatalogProducts(repositoryData.map((record: any) => ({
        id: record.id,
        name: record.name,
        category: record.category,
        price: record.price,
        image: record.image_url,
        description: record.description || '',
        inStock: !record.out_of_stock,
        is_archived: record.is_archived,
        sort_order: record.sort_order || 0
      })));
    }
    setIsInventoryLoading(false);
  }, [storeSettings.id]);

  useEffect(() => { synchronizeInventory(); }, [synchronizeInventory]);

  const modifyProductRecord = useCallback(async (productId: string, dataChanges: Partial<Product>) => {
    if (!dataChanges.image) {
      setCatalogProducts(previous => {
        const updated = previous.map(p => p.id === productId ? { ...p, ...dataChanges } : p);
        return dataChanges.sort_order !== undefined 
          ? [...updated].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          : updated;
      });
    }

    const updatePayload: Record<string, string | number | boolean | undefined> = {};
    if (dataChanges.name !== undefined) updatePayload.name = dataChanges.name;
    if (dataChanges.category !== undefined) updatePayload.category = dataChanges.category;
    if (dataChanges.price !== undefined) updatePayload.price = dataChanges.price;
    if (dataChanges.image !== undefined) updatePayload.image_url = dataChanges.image || undefined;
    if (dataChanges.description !== undefined) updatePayload.description = dataChanges.description;
    if (dataChanges.inStock !== undefined) updatePayload.out_of_stock = !dataChanges.inStock;
    if (dataChanges.is_archived !== undefined) updatePayload.is_archived = dataChanges.is_archived;
    if (dataChanges.sort_order !== undefined) updatePayload.sort_order = dataChanges.sort_order;

    const { error } = await supabase
      .from(REPOSITORY_TABLE)
      .update(updatePayload)
      .eq('id', productId)
      .eq('store_id', storeSettings.id);
    
    if (error) {
      console.error('Update failed:', error);
      synchronizeInventory(true);
    } else if (dataChanges.sort_order !== undefined || dataChanges.image) {
      synchronizeInventory(true);
    }
  }, [synchronizeInventory, storeSettings.id]);

  const uploadProductVisualAsset = useCallback(async (productId: string, visualFile: File) => {
    const targetProduct = catalogProducts.find(p => p.id === productId);
    if (!targetProduct) throw new Error('Product not found');

    try {
      const finalizedUrl = await uploadToStorage(targetProduct, visualFile);
      await modifyProductRecord(productId, { image: finalizedUrl });
      return finalizedUrl;
    } catch (e) {
      alert(LABELS.saveError);
      throw e;
    }
  }, [catalogProducts, uploadToStorage, modifyProductRecord]);

  const addNewProductRecord = useCallback(async (productData: Omit<Product, 'id' | 'is_archived'>, initialImage?: File) => {
    const peerProducts = catalogProducts.filter(p => p.category === productData.category);
    const maxPos = peerProducts.length > 0 ? Math.max(...peerProducts.map(p => p.sort_order || 0)) : 0;
    
    const { data: newRecord, error } = await supabase.from(REPOSITORY_TABLE).insert([{
      store_id: storeSettings.id,
      name: productData.name,
      category: productData.category,
      price: productData.price,
      description: productData.description,
      out_of_stock: !productData.inStock,
      is_archived: false,
      sort_order: maxPos + 1
    }]).select().single();

    if (newRecord && !error) {
      if (initialImage) await uploadProductVisualAsset(newRecord.id, initialImage);
      else synchronizeInventory(true);
    }
  }, [uploadProductVisualAsset, synchronizeInventory, catalogProducts, storeSettings.id]);

  const deleteProductRecord = useCallback(async (productId: string) => {
    if (!window.confirm(LABELS.deleteConfirm)) return;
    
    const targetProduct = catalogProducts.find(p => p.id === productId);
    setCatalogProducts(prev => prev.filter(p => p.id !== productId));
    
    const { error } = await supabase
      .from(REPOSITORY_TABLE)
      .delete()
      .eq('id', productId)
      .eq('store_id', storeSettings.id);
    
    if (!error) {
      if (targetProduct?.image) await removeFromStorage(targetProduct.image);
      synchronizeInventory(true);
    } else {
      synchronizeInventory(); 
    }
  }, [catalogProducts, synchronizeInventory, storeSettings.id, removeFromStorage]);

  const filteredCatalog = useMemo(() => {
    const searchToken = currentSearchQuery.toLowerCase().trim();
    return catalogProducts.filter(product => {
      if (!isAdministrativeModeActive && product.is_archived) return false;
      const matchesSearch = !searchToken || 
        product.name.toLowerCase().includes(searchToken) || 
        (product.description || '').toLowerCase().includes(searchToken);
      const matchesCategory = activeFilterCategories.length === 0 || 
        activeFilterCategories.includes(product.category);
      return matchesSearch && matchesCategory;
    });
  }, [catalogProducts, currentSearchQuery, activeFilterCategories, isAdministrativeModeActive]);

  return {
    products: filteredCatalog,
    allProducts: catalogProducts,
    totalCount: filteredCatalog.length,
    categoryOrder: storeSettings.categoryOrder,
    loading: isInventoryLoading || isSettingsLoading,
    updateProduct: modifyProductRecord,
    deleteProduct: deleteProductRecord,
    addProduct: addNewProductRecord,
    reorderCategory: (_cat: string, _pos: number) => {
      // Logic placeholder for reordering categories if needed in the future
    },
    reorderProductsInCategory: async (productId: string, targetPos: number) => {
      const targetProduct = catalogProducts.find(p => p.id === productId);
      if (!targetProduct) return;

      const peers = catalogProducts
        .filter(p => p.category === targetProduct.category)
        .sort((a, b) => ((a.sort_order || 0) - (b.sort_order || 0)) || a.id.localeCompare(b.id));

      const otherPeers = peers.filter(p => p.id !== productId);
      const newOrder = [...otherPeers.slice(0, targetPos - 1), targetProduct, ...otherPeers.slice(targetPos - 1)];

      setCatalogProducts(prev => {
        const updated = prev.map(p => {
          const idx = newOrder.findIndex(no => no.id === p.id);
          return idx !== -1 ? { ...p, sort_order: idx + 1 } : p;
        });
        return [...updated].sort((a, b) => ((a.sort_order || 0) - (b.sort_order || 0)) || a.id.localeCompare(b.id));
      });

      try {
        await Promise.all(newOrder.map((p, i) => 
          supabase.from(REPOSITORY_TABLE).update({ sort_order: i + 1 }).eq('id', p.id).eq('store_id', storeSettings.id)
        ));
      } catch (err) { synchronizeInventory(); }
    },
    renameCategory: async (oldName: string, newName: string) => {
      if (!newName || oldName === newName) return;
      const { error } = await supabase.from(REPOSITORY_TABLE).update({ category: newName }).eq('category', oldName).eq('store_id', storeSettings.id);
      if (!error) {
        // synchronizeInventory(true);
      }
    },
    removeCategoryFromProducts: async (target: string) => {
      const fallback = TECH.products.fallbackCategory;
      const { error } = await supabase.from(REPOSITORY_TABLE).update({ category: fallback }).eq('category', target).eq('store_id', storeSettings.id);
      if (!error) {
        // synchronizeInventory(true);
      }
    },
    uploadImage: uploadProductVisualAsset,
    bulkUpdatePrices: async (targetCats: string[], amount: number, isPerc: boolean, isInc: boolean) => {
      const items = catalogProducts.filter(p => targetCats.length === 0 || targetCats.includes(p.category));
      if (items.length === 0) return;

      const { transformCurrencyStringToNumber, formatNumberToCurrency } = await import('../../utils/formatters/price');
      const updates = items.map(p => {
        const current = transformCurrencyStringToNumber(p.price);
        const adj = isPerc ? current * (amount / 100) : amount;
        const next = Math.max(0, isInc ? current + adj : current - adj);
        return { id: p.id, price: formatNumberToCurrency(next) };
      });

      try {
        setIsInventoryLoading(true);
        await Promise.all(updates.map(u => supabase.from(REPOSITORY_TABLE).update({ price: u.price }).eq('id', u.id).eq('store_id', storeSettings.id)));
        await synchronizeInventory(true);
      } catch (err) { synchronizeInventory(); }
      finally { setIsInventoryLoading(false); }
    },
  };
}
