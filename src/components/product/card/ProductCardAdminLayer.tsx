import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import OrderSelector from '../../ui/OrderSelector';
import { ProductMenu } from '../../admin/ProductMenu';

interface ProductCardAdminLayerProps {
  product: Product;
  categories: string[];
  orderIndex: number;
  itemsInCategory: number;
  onOrderChange: (newPos: number) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
}

/**
 * SUB-COMPONENT: ProductCardAdminLayer
 */
export const ProductCardAdminLayer = memo(({ 
  product, 
  categories, 
  orderIndex, 
  itemsInCategory, 
  onOrderChange, 
  onDelete, 
  onUpdate 
}: ProductCardAdminLayerProps) => {
  const theme = THEME.productCard;

  return (
    <>
      <div className="absolute top-2 left-2 z-30">
        <OrderSelector 
          currentOrder={orderIndex}
          totalCount={itemsInCategory}
          onChange={onOrderChange}
          className={`${theme.orderSelect.wrapper} ${THEME.radius.badge} shadow-xl`}
          selectClass={theme.orderSelect.select}
        />
      </div>
      <div className="absolute top-2 right-2 z-30">
        <div className="shadow-xl rounded-full bg-white/90 backdrop-blur-md">
          <ProductMenu product={product} categories={categories} onDelete={onDelete} onUpdate={onUpdate} />
        </div>
      </div>
    </>
  );
});
