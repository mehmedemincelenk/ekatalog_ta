import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { useProducts } from './catalog/useProducts';
import { useAdminMode } from './auth/useAdminMode';
import { useDiscount } from './catalog/useDiscount';
import { useSettings, CompanySettings } from './store/useSettings';
import { REFERENCES } from '../data/config';
import { Product } from '../types';
import { ActiveDiscount } from './catalog/useDiscount';

export interface CatalogLogic {
  admin: ReturnType<typeof useAdminMode>;
  settings: CompanySettings;
  search: string;
  activeCategories: string[];
  visibleCategoryLimit: number;
  isAddModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isLoading: boolean;
  filteredProducts: Product[];
  allProducts: Product[];
  categoryOrder: string[];
  activeDiscount: ActiveDiscount | null;
  discountError: string | null;
  activeReferences: any[];
  setSearch: Dispatch<SetStateAction<string>>;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsBulkUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    close: () => void;
    variant?: 'danger' | 'primary';
  };
  actions: {
    addProduct: (productData: Omit<Product, 'id' | 'is_archived'>, initialImage?: File) => Promise<void>;
    updateProduct: (productId: string, dataChanges: Partial<Product>) => Promise<void>;
    deleteProduct: (productId: string) => void; // Changed to void as it now triggers a modal
    reorderCategory: (categoryName: string, targetPosition: number) => void;
    reorderProducts: (productId: string, targetPos: number) => Promise<void>;
    renameCategory: (legacyName: string, updatedName: string) => Promise<void>;
    removeCategory: (targetCategory: string) => Promise<void>;
    bulkUpdatePrices: (targetCategories: string[], amount: number, isPercentage: boolean, isIncrease: boolean) => Promise<void>;
    uploadImage: (productId: string, visualFile: File) => Promise<string>;
    uploadLogo: (visualFile: File) => Promise<string | undefined>;
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
  const { settings, loading: settingsLoading, uploadLogo, updateReferenceLogo } = useSettings(admin.isAdmin);

  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [visibleCategoryLimit, setVisibleCategoryLimit] = useState(2);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);

  // New: Global Confirmation State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  const productController = useProducts(search, activeCategories, admin.isAdmin);
  const discount = useDiscount();

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

  const toggleCategory = (cat: string) => {
    if (cat === 'Tüm Ürünler') setActiveCategories([]);
    else setActiveCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const requestConfirmation = (options: { title: string, message: string, onConfirm: () => void, variant?: 'danger' | 'primary' }) => {
    setConfirmState({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: options.onConfirm,
      variant: options.variant
    });
  };

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  return {
    admin,
    settings,
    search,
    activeCategories,
    visibleCategoryLimit,
    isAddModalOpen,
    isBulkUpdateModalOpen,
    isLoading,
    filteredProducts,
    allProducts: productController.allProducts,
    categoryOrder: productController.categoryOrder,
    activeDiscount: discount.activeDiscount,
    discountError: discount.error,
    activeReferences,
    setSearch,
    setIsAddModalOpen,
    setIsBulkUpdateModalOpen,
    confirmModal: {
      ...confirmState,
      close: closeConfirm
    },
    actions: {
      addProduct: productController.addProduct,
      updateProduct: productController.updateProduct,
      deleteProduct: (id: string) => {
        requestConfirmation({
          title: "Ürünü Sil",
          message: "Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?",
          variant: 'danger',
          onConfirm: () => {
            productController.deleteProduct(id);
            closeConfirm();
          }
        });
      },
      reorderCategory: productController.reorderCategory,
      reorderProducts: productController.reorderProductsInCategory,
      renameCategory: productController.renameCategory,
      removeCategory: productController.removeCategoryFromProducts,
      bulkUpdatePrices: productController.bulkUpdatePrices,
      uploadImage: productController.uploadImage,
      uploadLogo: (file: File) => uploadLogo(file) as Promise<string | undefined>,
      updateReferenceLogo: (id: number, file: File) => updateReferenceLogo(id, file) as Promise<string>,
      applyDiscount: discount.applyCode,
      toggleCategory,
      loadMoreCategories: () => setVisibleCategoryLimit(prev => prev + 3),
      requestConfirmation
    }
  };
}
