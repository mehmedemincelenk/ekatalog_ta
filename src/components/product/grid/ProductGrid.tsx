import { memo } from 'react';
import { THEME, LABELS, UI } from '../../../data/config';
import { Product } from '../../../types';
import { ActiveDiscount } from '../../../hooks/catalog/useDiscount';
import { useProductGridLogic } from '../../../hooks/catalog/useProductGridLogic';
import { ProductCategorySection } from './ProductCategorySection';

/**
 * PRODUCT GRID COMPONENT
 * -----------------------------------------------------------
 * Refactored to modular location: product/grid/
 */

interface ProductGridProps {
  products: Product[];
  categoryOrder: string[];
  sortedCategories: string[];
  isAdmin: boolean;
  editMode: 'modal' | 'inline';
  openEditor: (title: string, value: string, onConfirm: (val: string) => Promise<void> | void) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onOrderUpdate: (id: string, newPosition: number) => void;
  onOrderChange?: (id: string, newPosition: number) => void;
  onImageUpload?: (id: string, file: File) => Promise<void>;
  activeDiscount?: ActiveDiscount | null;
  visibleCategoryLimit: number;
  onLoadMore?: () => void;
  activeCategories: string[];
  onAddClick?: () => void;
}

const ProductGrid = memo(({
  products = [], 
  categoryOrder = [], 
  sortedCategories = [],
  isAdmin, 
  editMode,
  openEditor,
  onDelete, 
  onUpdate, 
  onOrderUpdate, 
  onImageUpload,
  activeDiscount, 
  visibleCategoryLimit,
  onLoadMore,
  activeCategories,
  onAddClick
}: ProductGridProps) => {
  const theme = THEME.productGrid;

  const { groupedProducts, displayCategories } = useProductGridLogic({
    products,
    sortedCategories,
    activeCategories,
    isAdmin
  });

  const visibleCategories = displayCategories.slice(0, visibleCategoryLimit);

  if (displayCategories.length === 0 && !isAdmin) {
    return (
      <div className={`${UI.layout.container} flex flex-col items-center justify-start min-h-[60vh] pt-20 w-full text-center animate-in fade-in duration-700`}>
        <div className="w-16 h-16 mb-6 opacity-20 text-stone-400">
          {THEME.icons.search}
        </div>
        <p className={`${THEME.font.base} text-stone-400 italic px-8`}>
          {LABELS.noProductsFound}
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.layout} ${UI.layout.container}`}>
      {visibleCategories.map((category, index) => (
        <ProductCategorySection 
          key={category}
          category={category}
          products={groupedProducts[category] || []}
          isAdmin={isAdmin}
          editMode={editMode}
          openEditor={openEditor}
          categoryOrder={categoryOrder}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onOrderUpdate={onOrderUpdate}
          onImageUpload={onImageUpload}
          activeDiscount={activeDiscount}
          onAddClick={onAddClick}
          isFirstSection={index === 0}
        />
      ))}

      {/* LOAD MORE BUTTON */}
      {displayCategories.length > visibleCategoryLimit && (
        <div className="flex justify-center pt-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={onLoadMore}
            className="px-12 py-4 bg-white border-2 border-stone-200 text-stone-900 font-black text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all active:scale-95 shadow-lg"
          >
            {LABELS.loadMoreBtn || "DAHA FAZLASI"}
          </button>
        </div>
      )}
    </div>
  );
});

export default ProductGrid;
