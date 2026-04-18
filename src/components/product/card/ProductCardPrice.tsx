import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { EditableField } from '../../ui/EditableField';
import { ensureCurrencySymbol } from '../../../utils/formatters/price';

interface ProductCardPriceProps {
  product: Product;
  isAdmin: boolean;
  editMode: 'modal' | 'inline';
  openEditor: (title: string, value: string, onConfirm: (val: string) => Promise<void> | void) => void;
  isPromotionActive: boolean;
  originalPriceLabel: string;
  discountedPriceLabel: string | null;
  onUpdate: (field: keyof Product, value: string | boolean | null) => void;
}

/**
 * ATOM: ProductCardPrice
 * -----------------------------------------------------------
 * Uses global EditableField for pricing, with support for promotional displays.
 */
export const ProductCardPrice = memo(({ 
  product, 
  isAdmin, 
  editMode,
  openEditor,
  isPromotionActive, 
  originalPriceLabel, 
  discountedPriceLabel, 
  onUpdate 
}: ProductCardPriceProps) => {
  const theme = THEME.productCard;

  // USER VIEW (With Promotions)
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

  // ADMIN OR REGULAR VIEW
  return (
    <div className={theme.innerLayout.footerWrapper}>
      <EditableField 
        value={product.price}
        title="Ürün Fiyatı"
        isAdmin={isAdmin}
        editMode={editMode}
        openModal={openEditor}
        onConfirm={(val) => onUpdate('price', ensureCurrencySymbol(val))}
        type="number"
        className={`
          ${theme.typography.price} 
          ${!isAdmin ? 'text-stone-900' : ''}
          ${product.inStock === false && !isAdmin ? theme.typography.priceOutOfStock : ''}
        `}
      />
    </div>
  );
});
