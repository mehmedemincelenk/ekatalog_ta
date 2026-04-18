import { useState, useMemo } from 'react';
import { useProducts } from './useProducts';
import { useAdminMode } from '../auth/useAdminMode';
import { useDiscount } from './useDiscount';
import { useSettings } from '../store/useSettings';

/**
 * useCatalogLogic: The central brain of the catalog.
 * Consolidates all data, states, and filtering into a single management interface.
 */
export function useCatalogLogic() {
  // 1. Admin & Settings
  const admin = useAdminMode();
  const { settings, loading: settingsLoading } = useSettings(admin.isAdmin);

  // 2. Product Management
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [visibleCategoryLimit, setVisibleCategoryLimit] = useState(2);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const productController = useProducts(search, activeCategories, admin.isAdmin);
  
  // 3. Discount Logic
  const discount = useDiscount();

  // 4. Filtering Logic (The Computation Engine)
  const filteredProducts = useMemo(() => {
    return productController.products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           (p.description?.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(p.category);
      const isVisible = !p.is_archived || admin.isAdmin;
      return matchesSearch && matchesCategory && isVisible;
    });
  }, [productController.products, search, activeCategories, admin.isAdmin]);

  const isLoading = settingsLoading || productController.loading;

  // 5. Actions/Handlers
  const toggleCategory = (cat: string) => {
    if (cat === 'Tüm Ürünler') setActiveCategories([]);
    else setActiveCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const loadMoreCategories = () => setVisibleCategoryLimit(prev => prev + 3);

  return {
    // State
    admin,
    settings,
    search,
    activeCategories,
    visibleCategoryLimit,
    isAddModalOpen,
    isLoading,
    
    // Data
    filteredProducts,
    allProducts: productController.allProducts,
    categoryOrder: productController.categoryOrder,
    activeDiscount: discount.activeDiscount,
    discountError: discount.error,
    
    // Setters
    setSearch,
    setIsAddModalOpen,
    
    // Controllers (Passthrough functions)
    actions: {
      addProduct: productController.addProduct,
      updateProduct: productController.updateProduct,
      deleteProduct: productController.deleteProduct,
      reorderCategory: productController.reorderCategory,
      reorderProducts: productController.reorderProductsInCategory,
      renameCategory: productController.renameCategory,
      removeCategory: productController.removeCategoryFromProducts,
      bulkUpdatePrices: productController.bulkUpdatePrices,
      uploadImage: productController.uploadImage,
      applyDiscount: discount.applyCode,
      toggleCategory,
      loadMoreCategories
    }
  };
}
