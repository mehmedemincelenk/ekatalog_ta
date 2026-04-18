import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';

interface ProductCardBadgesProps {
  product: Product;
}

/**
 * SUB-COMPONENT: ProductCardBadges
 */
export const ProductCardBadges = memo(({ product }: ProductCardBadgesProps) => {
  const theme = THEME.productCard.status;

  return (
    <div className={theme.wrapper}>
      {!product.inStock && <div className={theme.outOfStockLabel}>TÜKENDİ</div>}
      {product.is_archived && <div className={theme.badge}>📦</div>}
    </div>
  );
});
