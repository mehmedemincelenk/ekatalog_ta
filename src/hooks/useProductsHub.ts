import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Product, NewProductPayload, CompanySettings } from '../types';
import { reorderArray, smartSearch } from '../utils/core';
import { useStore } from '../store';
import { TECH, sortCategories } from '../data/config';


/**
 * PRODUCTS & CATALOG HUB (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Unified orchestrator for all product-related operations:
 * 1. Data Fetching (Query)
 * 2. Mutations (Add, Update, Delete, Bulk)
 * 3. Catalog Engine (Grouping, Filtering, Sorting)
 * 4. Storage Service (Visual Asset Management)
 */

// --- 0. STORAGE SERVICE (Internal Asset Management) ---

async function uploadProductVisual(targetProduct: Product, visualFile: File) {
  try {
    const { processDualQualityVisuals } = await import('../utils/image');
    const { hq: highQualityAsset, lq: previewAsset } =
      await processDualQualityVisuals(visualFile);

    // Hygiene: Remove legacy assets
    if (targetProduct.image_url) {
      try {
        const assetUrl = new URL(targetProduct.image_url);
        const legacyFileName = assetUrl.pathname.split('/').pop();
        if (legacyFileName && !legacyFileName.includes('placeholder')) {
          await supabase.storage.from(TECH.storage.bucket).remove([
            `${TECH.storage.lqFolder}/${legacyFileName}`,
            `${TECH.storage.hqFolder}/${legacyFileName}`,
          ]);
        }
      } catch { /* ignore */ }
    }

    // SEO Naming
    const turkishCharMap: Record<string, string> = { ç:'c', ğ:'g', ı:'i', ö:'o', ş:'s', ü:'u', Ç:'C', Ğ:'G', İ:'I', Ö:'O', Ş:'S', Ü:'U' };
    const sanitizedName = targetProduct.name.replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => turkishCharMap[c]).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').substring(0, TECH.products.maxFileNameLength);
    const uniqueSuffix = Math.random().toString(36).substring(2, 2 + TECH.products.uniqueIdSuffixLength);
    const storageFileName = `${sanitizedName}-${targetProduct.id.substring(0, 4)}-${uniqueSuffix}.jpg`;

    const lqPath = `${TECH.storage.lqFolder}/${storageFileName}`;
    const hqPath = `${TECH.storage.hqFolder}/${storageFileName}`;

    const [lqRes, hqRes] = await Promise.all([
      supabase.storage.from(TECH.storage.bucket).upload(lqPath, previewAsset, { upsert: true, cacheControl: TECH.storage.cacheControl }),
      supabase.storage.from(TECH.storage.bucket).upload(hqPath, highQualityAsset, { upsert: true, cacheControl: TECH.storage.cacheControl }),
    ]);

    if (lqRes.error) throw lqRes.error;
    if (hqRes.error) throw hqRes.error;

    const { data: { publicUrl } } = supabase.storage.from(TECH.storage.bucket).getPublicUrl(lqPath);
    return `${publicUrl}?t=${Date.now()}`;
  } catch (err) {
    console.error('Storage failed:', err);
    throw err;
  }
}


// --- 1. QUERY HOOK (Data Layer) ---

export function useProductsQuery(storeId?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('prods')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// --- 2. ACTIONS HOOK (Mutation Layer) ---

export function useProductsActions() {
  const queryClient = useQueryClient();
  const { settings } = useStore();
  const queryKey = ['products', settings?.id];

  const updateMutation = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<Product> }) => {
      const { error } = await supabase.from('prods').update(changes).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('prods').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const reorderCategoryMutation = useMutation({
    mutationFn: async (newOrder: string[]) => {
      const { error } = await supabase
        .from('stores')
        .update({ category_order: newOrder })
        .eq('id', settings?.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const renameCategoryMutation = useMutation({
    mutationFn: async ({ oldName, newName }: { oldName: string; newName: string }) => {
      if (!settings?.id) throw new Error('Mağaza ID bulunamadı');
      const { error } = await supabase
        .from('prods')
        .update({ category: newName })
        .eq('category', oldName)
        .eq('store_id', settings.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const reorderProductsMutation = useMutation({
    mutationFn: async ({ id, newSortOrder }: { id: string; newSortOrder: number }) => {
      const { error } = await supabase
        .from('prods')
        .update({ sort_order: newSortOrder })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const addMutation = useMutation({
    mutationFn: async (newProduct: NewProductPayload) => {
      if (!settings?.id) throw new Error('Mağaza ID bulunamadı');
      const { data, error } = await supabase.from('prods').insert([{
        ...newProduct,
        store_id: settings.id,
        out_of_stock: false,
        is_archived: false,
        sort_order: 0,
      }]).select('id').single();
      if (error) throw error;
      return data?.id as string;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });


  const uploadImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const cachedProducts = queryClient.getQueryData<Product[]>(queryKey);
      const targetProduct = cachedProducts?.find((p) => p.id === id);
      if (!targetProduct) throw new Error('Ürün bulunamadı');
      const finalizedUrl = await uploadProductVisual(targetProduct, file);
      if (finalizedUrl) {
        const { error } = await supabase.from('prods').update({
          image_url: finalizedUrl,
          is_polished_pending: false,
        }).eq('id', id);
        if (error) throw error;
      }
      return finalizedUrl;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (
      actions: {
        productId: string;
        newPrice?: number;
        newSortOrder?: number;
        category?: string;
        delete?: boolean;
        out_of_stock?: boolean;
        is_archived?: boolean;
      }[],
    ) => {
      if (!actions.length) return;

      const deleteIds = actions.filter((a) => a.delete).map((a) => a.productId);
      const updates = actions.filter((a) => !a.delete);

      // 1. ATOMIC DELETE: Tek seferde tüm silmeleri yap
      const deletePromise = deleteIds.length
        ? supabase.from('prods').delete().in('id', deleteIds)
        : Promise.resolve({ error: null });

      // 2. PARALLEL UPDATES: Güncellemeleri paralel koştur (Promise.all)
      const updatePromises = updates.map(async (action) => {
        const update: Partial<Product> = {};
        if (action.newPrice !== undefined) {
          const { formatNumberToCurrency } = await import('../utils/core');
          update.price = formatNumberToCurrency(action.newPrice);
        }
        if (action.newSortOrder !== undefined) update.sort_order = action.newSortOrder;
        if (action.category !== undefined) update.category = action.category;
        if (action.out_of_stock !== undefined)
          update.out_of_stock = action.out_of_stock;
        if (action.is_archived !== undefined)
          update.is_archived = action.is_archived;

        if (Object.keys(update).length > 0) {
          return supabase.from('prods').update(update).eq('id', action.productId);
        }
        return Promise.resolve({ error: null });
      });

      const [deleteRes, ...updateResults] = await Promise.all([
        deletePromise,
        ...updatePromises,
      ]);

      if (deleteRes.error) throw deleteRes.error;
      const firstUpdateError = updateResults.find((r) => r.error);
      if (firstUpdateError?.error) throw firstUpdateError.error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    addProduct: addMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    reorderCategories: reorderCategoryMutation.mutateAsync,
    renameCategory: renameCategoryMutation.mutateAsync,
    reorderProduct: reorderProductsMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
    executeGranularBulkActions: bulkActionMutation.mutateAsync,
    isMutating:
      updateMutation.isPending ||
      deleteMutation.isPending ||
      addMutation.isPending ||
      uploadImageMutation.isPending ||
      bulkActionMutation.isPending ||
      reorderCategoryMutation.isPending ||
      renameCategoryMutation.isPending ||
      reorderProductsMutation.isPending,
  };
}

// --- 3. CATALOG ENGINE (Logic Layer) ---

export function useCatalogEngine(products: Product[], categoryOrder: string[], activeCategories: string[], isAdmin: boolean) {
  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || TECH.products.fallbackCategory;
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);

  const { sortedList, stats } = useMemo(() => {
    const foundInProducts = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    const consolidated = [...new Set([...categoryOrder, ...foundInProducts])];
    const statsObj: Record<string, number> = {};

    products.forEach((p) => {
      if (p.category) statsObj[p.category] = (statsObj[p.category] || 0) + 1;
    });

    return {
      sortedList: sortCategories(consolidated, categoryOrder),
      stats: statsObj,
    };
  }, [products, categoryOrder]);

  const displayCategories = useMemo(() => {
    const allCategories = sortedList;
    const filtered = activeCategories.length > 0 ? allCategories.filter(cat => activeCategories.includes(cat)) : allCategories;
    
    if (isAdmin) return filtered;
    return filtered.filter(cat => (groupedProducts[cat] || []).length > 0 || activeCategories.includes(cat));
  }, [groupedProducts, sortedList, activeCategories, isAdmin]);

  return { groupedProducts, displayCategories, sortedList, stats };
}

// --- 4. COORDINATOR HOOK (Main Entry) ---

export function useProducts(searchQuery: string, activeCategories: string[], isAdmin: boolean, settings: CompanySettings | null) {
  const { data: allProducts = [], isLoading: productsLoading } = useProductsQuery(settings?.id);
  const actions = useProductsActions();

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (!isAdmin) result = result.filter((p) => !p.is_archived);
    if (activeCategories.length > 0) result = result.filter((p) => activeCategories.includes(p.category));
    if (searchQuery) result = smartSearch(searchQuery, result);
    return result;
  }, [allProducts, searchQuery, activeCategories, isAdmin]);

  const categoryOrder = useMemo(() => settings?.categoryOrder || [], [settings?.categoryOrder]);
  const { sortedList, stats } = useCatalogEngine(allProducts, categoryOrder, activeCategories, isAdmin);

  return {
    products: filteredProducts,
    allProducts,
    categoryOrder,
    sortedList,
    stats,
    loading: productsLoading,
    addProduct: actions.addProduct,
    updateProduct: actions.updateProduct,
    deleteProduct: actions.deleteProduct,
    uploadImage: actions.uploadImage,
    renameCategory: actions.renameCategory,
    reorderCategories: actions.reorderCategories,
    executeGranularBulkActions: actions.executeGranularBulkActions,
    reorderCategory: async (categoryName: string, newPosition: number) => {
      const oldIndex = categoryOrder.indexOf(categoryName);
      if (oldIndex === -1) return;
      const updatedOrder = reorderArray(categoryOrder, oldIndex, newPosition - 1);
      await actions.reorderCategories(updatedOrder);
    },
    reorderProductsInCategory: async (id: string, newPosition: number) => {
      const targetProduct = allProducts.find(p => p.id === id);
      if (!targetProduct) return;

      const categoryProducts = allProducts
        .filter(p => p.category === targetProduct.category)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      const oldIndex = categoryProducts.findIndex(p => p.id === id);
      if (oldIndex === -1) return;

      const reordered = reorderArray(categoryProducts, oldIndex, newPosition - 1);
      
      const bulkActions = reordered.map((p, idx) => ({
        productId: p.id,
        newSortOrder: idx + 1
      }));

      // Map to executeGranularBulkActions format
      await actions.executeGranularBulkActions(bulkActions);
    },
    addCategory: async (name: string) => {
      if (!settings?.id) return;
      
      // 1. Create a placeholder product
      await actions.addProduct({
        name: 'Yeni Kategori Ürünü',
        category: name,
        price: '0',
        description: 'Bu ürün kategoriyi oluşturmak için otomatik eklenmiştir.',
        image_url: null,
        store_id: settings.id,
        out_of_stock: false,
        is_archived: true,
      });

      // 2. Persist to category_order list in DB
      const currentOrder = settings.categoryOrder || [];
      if (!currentOrder.includes(name)) {
        const updatedOrder = [...currentOrder, name];
        await actions.reorderCategories(updatedOrder);
      }
    },
  };
}
