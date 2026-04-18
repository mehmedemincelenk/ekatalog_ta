import { useMemo } from 'react';
import { calculatePromotionalPrice } from '../../utils/formatters/price';
import { Product } from '../../types';
import { ActiveDiscount } from './useDiscount';

/**
 * HOOK: useProductPricing
 * -----------------------------------------------------------
 * Centralizes pricing logic for products, including discounts.
 */
export function useProductPricing(product: Product, activeDiscount?: ActiveDiscount | null) {
  return useMemo(() => {
    const isPromotionActive = !!(activeDiscount && (!activeDiscount.category || activeDiscount.category === product.category));
    
    const originalPriceLabel = product.price.includes('₺') ? product.price : `${product.price} ₺`;
    
    const discountedPriceValue = isPromotionActive && activeDiscount 
      ? calculatePromotionalPrice(product.price, activeDiscount.rate) 
      : null;
      
    const discountedPriceLabel = discountedPriceValue 
      ? (discountedPriceValue.includes('₺') ? discountedPriceValue : `${discountedPriceValue} ₺`) 
      : null;

    return {
      isPromotionActive,
      originalPriceLabel,
      discountedPriceLabel
    };
  }, [product.price, product.category, activeDiscount]);
}
