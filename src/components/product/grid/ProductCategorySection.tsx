import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import ProductCard from '../card/ProductCard';
import { ActiveDiscount } from '../../../hooks/catalog/useDiscount';
import { CategoryHeader } from './CategoryHeader';
import { CategoryEmptyState } from './CategoryEmptyState';

interface ProductCategorySectionProps {
  category: string;
  products: Product[];
  isAdmin: boolean;
  editMode: 'modal' | 'inline';
  openEditor: (title: string, value: string, onConfirm: (val: string) => Promise<void> | void) => void;
  categoryOrder: string[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onOrderUpdate: (id: string, newPosition: number) => void;
  onImageUpload?: (id: string, file: File) => Promise<void>;
  activeDiscount?: ActiveDiscount | null;
  onAddClick?: () => void;
  isFirstSection: boolean;
}

/**
 * COMPONENT: ProductCategorySection
 */
export const ProductCategorySection = memo(({
  category,
  products,
  isAdmin,
  editMode,
  openEditor,
  categoryOrder,
  onDelete,
  onUpdate,
  onOrderUpdate,
  onImageUpload,
  activeDiscount,
  onAddClick,
  isFirstSection
}: ProductCategorySectionProps) => {
  const theme = THEME.productGrid;

  return (
    <section className={theme.sectionSpacing}>
      <CategoryHeader title={category} count={products.length} />

      {products.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-4 sm:gap-x-6 sm:gap-y-10">
          {products.map((product, index) => {
            const isPriority = isFirstSection && index < 4;

            return (
              <ProductCard 
                key={product.id}
                product={product}
                categories={categoryOrder}
                isAdmin={isAdmin}
                editMode={editMode}
                openEditor={openEditor}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onOrderChange={onOrderUpdate}
                onImageUpload={onImageUpload}
                orderIndex={index + 1}
                itemsInCategory={products.length}
                activeDiscount={activeDiscount}
                isPriority={isPriority}
              />
            );
          })}
        </div>
      ) : (
        <CategoryEmptyState isAdmin={isAdmin} onAddClick={onAddClick} />
      )}
    </section>
  );
});
