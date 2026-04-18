import { useState, memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import Button from '../../ui/Button';
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
 * COMPONENT: ProductCardAdminLayer
 * -----------------------------------------------------------
 * Orchestrates administrative actions for a specific product card.
 * Uses standardized OrderSelector and Button atoms.
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = THEME.productCard;
  const globalIcons = THEME.icons;

  return (
    <>
      {/* 1. ORDER SELECTOR (Top Right) */}
      <div className={theme.orderSelect.container}>
        <OrderSelector 
          currentOrder={orderIndex}
          totalCount={itemsInCategory}
          onChange={onOrderChange}
          variant="floating"
          isAdmin={true}
        />
      </div>

      {/* 2. PRODUCT ACTIONS MENU (Bottom Right) */}
      <div className={theme.adminMenu.container}>
        <Button 
          onClick={() => setIsMenuOpen(true)}
          icon={globalIcons.dots}
          variant="secondary"
          size="xs"
          mode="circle"
          className={theme.adminMenu.toggleButton}
          aria-label="Product Actions"
        />

        {isMenuOpen && (
          <ProductMenu 
            product={product}
            categories={categories}
            onClose={() => setIsMenuOpen(false)}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </>
  );
});
