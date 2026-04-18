import { useState, memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { ActiveDiscount } from '../../../hooks/catalog/useDiscount';
import { ProductQuickView } from './ProductQuickView';
import { useProductPricing } from '../../../hooks/catalog/useProductPricing';
import { useScrollToClose } from '../../../hooks/ui/useScrollToClose';
import { useProductCardActions } from '../../../hooks/catalog/useProductCardActions';

// Sub-components (Now Local)
import { ProductCardImage } from './ProductCardImage';
import { ProductCardInfo } from './ProductCardInfo';
import { ProductCardAdminLayer } from './ProductCardAdminLayer';
import { ProductCardBadges } from './ProductCardBadges';

/**
 * PRODUCT CARD COMPONENT
 * -----------------------------------------------------------
 * Represents an individual product in the grid.
 * Refactored to modular location: product/card/
 */

interface ProductCardProps {
  product: Product;
  categories: string[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onOrderChange?: (id: string, newPosition: number) => void;
  onImageUpload?: (id: string, file: File) => Promise<void>;
  orderIndex?: number;
  itemsInCategory?: number;
  activeDiscount?: ActiveDiscount | null;
  isPriority?: boolean;
}

const ProductCard = memo((props: ProductCardProps) => {
  const [isZoomDetailOpen, setIsZoomDetailOpen] = useState(false);
  const theme = THEME.productCard;

  // 1. Business Logic Hooks
  const { isPromotionActive, originalPriceLabel, discountedPriceLabel } = useProductPricing(props.product, props.activeDiscount);
  const { isUploading, handleImageUpload, handleDataUpdate } = useProductCardActions(props);
  useScrollToClose(isZoomDetailOpen, () => setIsZoomDetailOpen(false));

  return (
    <>
      <article 
        data-product-id={props.product.id} 
        className={`${theme.container} ${THEME.radius.card} ${props.product.inStock === false ? theme.outOfStockBorder : theme.activeBorder} ${theme.shadow}`}
      >
        <ProductCardImage 
          product={props.product}
          isAdmin={props.isAdmin}
          isUploading={isUploading}
          isPriority={props.isPriority}
          onZoom={() => setIsZoomDetailOpen(true)}
          onUpload={handleImageUpload}
        />

        <ProductCardInfo 
          product={props.product}
          isAdmin={props.isAdmin}
          isPromotionActive={isPromotionActive}
          originalPriceLabel={originalPriceLabel}
          discountedPriceLabel={discountedPriceLabel}
          onUpdate={handleDataUpdate}
        />

        {props.isAdmin && (
          <ProductCardAdminLayer 
            product={props.product}
            categories={props.categories}
            orderIndex={props.orderIndex || 1}
            itemsInCategory={props.itemsInCategory || 1}
            onOrderChange={(newPos) => props.onOrderChange?.(props.product.id, newPos)}
            onDelete={props.onDelete}
            onUpdate={props.onUpdate}
          />
        )}

        <ProductCardBadges product={props.product} />
      </article>

      <ProductQuickView 
        product={props.product} 
        isOpen={isZoomDetailOpen} 
        onClose={() => setIsZoomDetailOpen(false)} 
        activeDiscount={props.activeDiscount}
      />
    </>
  );
});

export default ProductCard;
