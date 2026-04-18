import { useState, useMemo, Dispatch, SetStateAction, useCallback } from 'react';
import { useProducts } from './catalog/useProducts';
import { useAdminMode } from './auth/useAdminMode';
import { useDiscount } from './catalog/useDiscount';
import { useSettings, CompanySettings } from './store/useSettings';
import { REFERENCES } from '../data/config';
import { Product } from '../types';
import { ActiveDiscount } from './catalog/useDiscount';
import { useStringEditor } from './ui/useStringEditor';
import { useConfirmModal } from './ui/useConfirmModal';
import { sortCategories } from '../data/config/utils';

export interface CatalogLogic {
  admin: ReturnType<typeof useAdminMode>;
  settings: CompanySettings;
  stringEditor: ReturnType<typeof useStringEditor>;
  editMode: 'modal' | 'inline';
  toggleEditMode: () => void;
  search: string;
  activeCategories: string[];
  visibleCategoryLimit: number;
  isAddModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isLoading: boolean;
  filteredProducts: Product[];
  allProducts: Product[];
  categoryOrder: string[];
  sortedCategories: string[];
  categoryStats: Record<string, number>;
  carouselSlides: any[]; // Or Slide[] if imported
  activeDiscount: ActiveDiscount | null;
  discountError: string | null;
  activeReferences: any[];
  setSearch: Dispatch<SetStateAction<string>>;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsBulkUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  confirmModal: ReturnType<typeof useConfirmModal>;
  actions: {
    addProduct: (productData: Omit<Product, 'id' | 'is_archived'>, initialImage?: File) => Promise<void>;
    updateProduct: (productId: string, dataChanges: Partial<Product>) => Promise<void>;
    deleteProduct: (productId: string) => void;
    reorderCategory: (categoryName: string, targetPosition: number) => void;
    reorderProducts: (productId: string, targetPos: number) => Promise<void>;
    syncCarousel: (updatedSlides: any[]) => Promise<void>;
    renameCategory: (legacyName: string, updatedName: string) => Promise<void>;
    removeCategory: (targetCategory: string) => Promise<void>;
    bulkUpdatePrices: (targetCategories: string[], amount: number, isPercentage: boolean, isIncrease: boolean) => Promise<void>;
    uploadImage: (productId: string, visualFile: File) => Promise<string>;
    uploadLogo: (visualFile: File) => Promise<string | undefined>;
    updateSetting: (key: keyof CompanySettings, value: any) => Promise<void>;
    updateReferenceLogo: (referenceId: number, visualFile: File) => Promise<string>;
    applyDiscount: (rawInput: string) => void;
    toggleCategory: (cat: string) => void;
    loadMoreCategories: () => void;
    requestConfirmation: (options: { title: string, message: string, onConfirm: () => void, variant?: 'danger' | 'primary' }) => void;
  };
}

/**
 * useCatalogLogic: The central brain of the catalog.
 */
export function useCatalogLogic(): CatalogLogic {
  const admin = useAdminMode();
  const { settings, loading: settingsLoading, uploadLogo, updateReferenceLogo, updateSetting } = useSettings(admin.isAdmin);
  const stringEditor = useStringEditor();
  const confirmModal = useConfirmModal();

  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [visibleCategoryLimit, setVisibleCategoryLimit] = useState(2);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);

  // Edit Mode Preference (Modal vs Inline)
  const [editMode, setEditMode] = useState<'modal' | 'inline'>(() => {
    return (localStorage.getItem('admin_edit_preference') as 'modal' | 'inline') || 'modal';
  });

  const toggleEditMode = useCallback(() => {
    const nextMode = editMode === 'modal' ? 'inline' : 'modal';
    setEditMode(nextMode);
    localStorage.setItem('admin_edit_preference', nextMode);
  }, [editMode]);

  const productController = useProducts(search, activeCategories, admin.isAdmin, settings);
  const discount = useDiscount();

  // --- CENTRALIZED CATEGORY ENGINE ---
  const { sortedCategories, categoryStats } = useMemo(() => {
    const products = productController.allProducts;
    const order = settings.categoryOrder;
    
    // 1. Extract and count
    const stats: Record<string, number> = {};
    const foundInProducts: string[] = [];
    
    products.forEach(p => {
      if (!p.category) return;
      if (!foundInProducts.includes(p.category)) foundInProducts.push(p.category);
      stats[p.category] = (stats[p.category] || 0) + 1;
    });

    // 2. Consolidate and sort
    const allUnique = [...new Set([...order, ...foundInProducts])];
    
    return {
      sortedCategories: sortCategories(allUnique, order),
      categoryStats: stats
    };
  }, [productController.allProducts, settings.categoryOrder]);

  const filteredProducts = useMemo(() => {
    return productController.products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           (p.description?.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(p.category);
      const isVisible = !p.is_archived || admin.isAdmin;
      return matchesSearch && matchesCategory && isVisible;
    });
  }, [productController.products, search, activeCategories, admin.isAdmin]);

  const activeReferences = useMemo(() => {
    return settings.referencesData && settings.referencesData.length > 0 
      ? settings.referencesData 
      : REFERENCES;
  }, [settings.referencesData]);

  const isLoading = settingsLoading || productController.loading;

  const toggleCategory = useCallback((cat: string) => {
    if (cat === 'Tüm Ürünler') setActiveCategories([]);
    else setActiveCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }, []);

  const reorderCategory = useCallback((categoryName: string, targetPosition: number) => {
    // We already have sortedCategories computed
    const currentList = sortedCategories.filter(c => c !== categoryName);
    const newOrder = [
      ...currentList.slice(0, targetPosition - 1),
      categoryName,
      ...currentList.slice(targetPosition - 1)
    ];
    updateSetting('categoryOrder', newOrder);
  }, [sortedCategories, updateSetting]);

  return {
    admin,
    settings,
    stringEditor,
    editMode,
    toggleEditMode,
    search,
    activeCategories,
    visibleCategoryLimit,
    isAddModalOpen,
    isBulkUpdateModalOpen,
    isLoading,
    filteredProducts,
    allProducts: productController.allProducts,
    categoryOrder: settings.categoryOrder,
    sortedCategories,
    categoryStats,
    carouselSlides: settings.carouselData.slides,
    activeDiscount: discount.activeDiscount,
    discountError: discount.error,
    activeReferences,
    setSearch,
    setIsAddModalOpen,
    setIsBulkUpdateModalOpen,
    confirmModal,
    actions: {
      addProduct: productController.addProduct,
      updateProduct: productController.updateProduct,
      deleteProduct: (id: string) => {
        confirmModal.requestConfirmation({
          title: "Ürünü Sil",
          message: "Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?",
          variant: 'danger',
          onConfirm: () => {
            productController.deleteProduct(id);
            confirmModal.close();
          }
        });
      },
      reorderCategory: reorderCategory,
      reorderProducts: productController.reorderProductsInCategory,
      syncCarousel: (updatedSlides: any[]) => updateSetting('carouselData', { slides: updatedSlides }),
      renameCategory: productController.renameCategory,
      removeCategory: productController.removeCategoryFromProducts,
      bulkUpdatePrices: productController.bulkUpdatePrices,
      uploadImage: productController.uploadImage,
      uploadLogo: (file: File) => uploadLogo(file) as Promise<string | undefined>,
      updateSetting: (key: keyof CompanySettings, value: any) => updateSetting(key, value),
      updateReferenceLogo: (id: number, file: File) => updateReferenceLogo(id, file) as Promise<string>,
      applyDiscount: discount.applyCode,
      toggleCategory,
      loadMoreCategories: () => setVisibleCategoryLimit(prev => prev + 3),
      requestConfirmation: confirmModal.requestConfirmation
    }
  };
}
