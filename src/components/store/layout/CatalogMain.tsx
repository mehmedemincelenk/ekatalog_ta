import { memo } from 'react';
import HeroCarousel from '../home/carousel/HeroCarousel';
import SearchFilter from '../home/search/SearchFilter';
import ProductGrid from '../../product/grid/ProductGrid';
import References from '../home/References';
import { CatalogLogic } from '../../../hooks/useCatalogLogic';

interface CatalogMainProps {
  isAdmin: boolean;
  editMode: CatalogLogic['editMode'];
  openEditor: CatalogLogic['stringEditor']['openEditor'];
  allProducts: CatalogLogic['allProducts'];
  filteredProducts: CatalogLogic['filteredProducts'];
  categoryOrder: CatalogLogic['categoryOrder'];
  sortedCategories: CatalogLogic['sortedCategories'];
  categoryStats: CatalogLogic['categoryStats'];
  activeCategories: CatalogLogic['activeCategories'];
  search: CatalogLogic['search'];
  visibleCategoryLimit: CatalogLogic['visibleCategoryLimit'];
  carouselSlides: CatalogLogic['carouselSlides'];
  actions: CatalogLogic['actions'];
  setSearch: CatalogLogic['setSearch'];
  setIsAddModalOpen: CatalogLogic['setIsAddModalOpen'];
  activeReferences: CatalogLogic['activeReferences'];
  activeDiscount: CatalogLogic['activeDiscount'];
}

/**
 * CATALOG MAIN CONTENT
 */
export const CatalogMain = memo(({
  isAdmin,
  editMode,
  openEditor,
  allProducts,
  filteredProducts,
  categoryOrder,
  sortedCategories,
  categoryStats,
  activeCategories,
  search,
  visibleCategoryLimit,
  carouselSlides,
  actions,
  setSearch,
  setIsAddModalOpen,
  activeReferences,
  activeDiscount
}: CatalogMainProps) => (
  <main>
    <HeroCarousel 
      isAdminModeActive={isAdmin} 
      initialSlides={carouselSlides}
      onSync={actions.syncCarousel}
    />
    
    <SearchFilter 
      products={allProducts} 
      categoryOrder={categoryOrder} 
      sortedCategories={sortedCategories}
      categoryStats={categoryStats}
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
      sortedCategories={sortedCategories}
      isAdmin={isAdmin}
      editMode={editMode}
      openEditor={openEditor}
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
