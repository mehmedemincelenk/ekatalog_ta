import { useMemo } from 'react';
import { calculatePromotionalPrice, formatNumberToCurrency, transformCurrencyStringToNumber } from '../../utils/formatters/price';
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
    
    // Standardize original price display
    const originalPriceLabel = formatNumberToCurrency(transformCurrencyStringToNumber(product.price));
    
    const discountedPriceLabel = isPromotionActive && activeDiscount 
      ? calculatePromotionalPrice(product.price, activeDiscount.rate) 
      : null;

    return {
      isPromotionActive,
      originalPriceLabel,
      discountedPriceLabel
    };
  }, [product.price, product.category, activeDiscount]);
}
