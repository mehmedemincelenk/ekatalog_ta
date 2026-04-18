import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { ProductCardName } from './ProductCardName';
import { ProductCardDescription } from './ProductCardDescription';
import { ProductCardPrice } from './ProductCardPrice';

interface ProductCardInfoProps {
  product: Product;
  isAdmin: boolean;
  isPromotionActive: boolean;
  originalPriceLabel: string;
  discountedPriceLabel: string | null;
  onUpdate: (field: keyof Product, value: string | boolean | null) => void;
}

/**
 * SUB-COMPONENT: ProductCardInfo
 * -----------------------------------------------------------
 * Orchestrator for product text content.
 * Now 100% atomized: Name, Description, and Price are decoupled.
 */
export const ProductCardInfo = memo(({ 
  product, 
  isAdmin, 
  isPromotionActive, 
  originalPriceLabel, 
  discountedPriceLabel, 
  onUpdate 
}: ProductCardInfoProps) => {
  const theme = THEME.productCard;

  return (
    <div className={`${theme.padding} ${theme.innerLayout.contentWrapper}`}>
      {/* 1. NAME (Atomized) */}
      <ProductCardName 
        product={product} 
        isAdmin={isAdmin} 
        onUpdate={onUpdate} 
      />
      
      {/* 2. DESCRIPTION (Atomized) */}
      <ProductCardDescription 
        product={product} 
        isAdmin={isAdmin} 
        onUpdate={onUpdate} 
      />

      {/* 3. PRICE SECTION (Atomized) */}
      <ProductCardPrice 
        product={product} 
        isAdmin={isAdmin} 
        isPromotionActive={isPromotionActive} 
        originalPriceLabel={originalPriceLabel} 
        discountedPriceLabel={discountedPriceLabel} 
        onUpdate={onUpdate} 
      />
    </div>
  );
});
