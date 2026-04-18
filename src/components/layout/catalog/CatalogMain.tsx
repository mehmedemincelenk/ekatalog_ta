import { memo } from 'react';
import HeroCarousel from '../../home/carousel/HeroCarousel';
import SearchFilter from '../../home/search/SearchFilter';
import ProductGrid from '../../product/grid/ProductGrid';
import References from '../../home/References';

interface CatalogMainProps {
  isAdmin: boolean;
  allProducts: any[];
  filteredProducts: any[];
  categoryOrder: string[];
  activeCategories: string[];
  search: string;
  visibleCategoryLimit: number;
  actions: any;
  setSearch: (val: string) => void;
  setIsAddModalOpen: (val: boolean) => void;
  activeReferences: any[];
  activeDiscount: any;
}

/**
 * CATALOG MAIN CONTENT
 * -----------------------------------------------------------
 * Groups the primary scrollable sections of the catalog.
 */
export const CatalogMain = memo(({
  isAdmin,
  allProducts,
  filteredProducts,
  categoryOrder,
  activeCategories,
  search,
  visibleCategoryLimit,
  actions,
  setSearch,
  setIsAddModalOpen,
  activeReferences,
  activeDiscount
}: CatalogMainProps) => (
  <main>
    <HeroCarousel isAdminModeActive={isAdmin} />
    
    <SearchFilter 
      products={allProducts} 
      categoryOrder={categoryOrder} 
      onCategoryOrderChange={actions.reorderCategory}
      search={search} 
      onSearchChange={setSearch} 
      activeCategories={activeCategories} 
      onCategoryToggle={actions.toggleCategory}
      isAdmin={isAdmin} 
      renameCategory={actions.renameCategory} 
    />

    <ProductGrid 
      products={filteredProducts} 
      categoryOrder={categoryOrder} 
      isAdmin={isAdmin}
      onDelete={actions.deleteProduct} 
      onUpdate={actions.updateProduct} 
      onOrderUpdate={actions.reorderProducts}
      onImageUpload={async (id, file) => { await actions.uploadImage(id, file); }}
      activeDiscount={activeDiscount} 
      visibleCategoryLimit={visibleCategoryLimit}
      onLoadMore={actions.loadMoreCategories}
      activeCategories={activeCategories} 
      onAddClick={() => setIsAddModalOpen(true)}
    />

    <References 
      references={activeReferences} 
      isAdmin={isAdmin} 
      onUpdate={async (id, file) => { await actions.updateReferenceLogo(id, file); }}
    />
  </main>
));
