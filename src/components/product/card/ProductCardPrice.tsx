import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { ensureCurrencySymbol } from '../../../utils/formatters/price';

interface ProductCardPriceProps {
  product: Product;
  isAdmin: boolean;
  isPromotionActive: boolean;
  originalPriceLabel: string;
  discountedPriceLabel: string | null;
  onUpdate: (field: keyof Product, value: string | boolean | null) => void;
}

/**
 * ATOM: ProductCardPrice
 * -----------------------------------------------------------
 * Handles all price states: Admin editable, User discount, and Normal.
 */
export const ProductCardPrice = memo(({ 
  product, 
  isAdmin, 
  isPromotionActive, 
  originalPriceLabel, 
  discountedPriceLabel, 
  onUpdate 
}: ProductCardPriceProps) => {
  const theme = THEME.productCard;

  if (isPromotionActive && !isAdmin) {
    return (
      <div className={theme.innerLayout.footerWrapper}>
        <div className="flex flex-wrap items-center gap-1.5 min-h-[20px]">
          <span className={`${theme.typography.price} text-stone-400 line-through text-[10px]`}>
            {originalPriceLabel}
          </span>
          <span className={`${theme.typography.price} text-green-600`}>
            {discountedPriceLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={theme.innerLayout.footerWrapper}>
      <div 
        contentEditable={isAdmin} 
        suppressContentEditableWarning 
        onBlur={(e: any) => { 
          const rawValue = e.currentTarget.textContent?.trim() || ''; 
          onUpdate('price', ensureCurrencySymbol(rawValue)); 
        }} 
        className={`
          ${theme.typography.price} 
          ${isAdmin ? `${theme.typography.editable} ${theme.adminMenu.editHighlight} ${theme.adminMenu.editPadding} ${THEME.radius.input}` : 'text-stone-900'} 
          ${product.inStock === false && !isAdmin ? theme.typography.priceOutOfStock : ''}
          min-h-[20px]
        `}
      >
        {originalPriceLabel}
      </div>
    </div>
  );
});
