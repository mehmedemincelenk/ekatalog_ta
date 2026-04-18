import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { ProductCardName } from './ProductCardName';
import { ProductCardDescription } from './ProductCardDescription';
import { ProductCardPrice } from './ProductCardPrice';

interface ProductCardInfoProps {
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
 * SUB-COMPONENT: ProductCardInfo
 */
export const ProductCardInfo = memo(({ 
  product, 
  isAdmin, 
  editMode,
  openEditor,
  isPromotionActive, 
  originalPriceLabel, 
  discountedPriceLabel, 
  onUpdate 
}: ProductCardInfoProps) => {
  const theme = THEME.productCard;

  return (
    <div className={`${theme.padding} ${theme.innerLayout.contentWrapper}`}>
      {/* 1. NAME */}
      <ProductCardName 
        product={product} 
        isAdmin={isAdmin} 
        editMode={editMode}
        openEditor={openEditor}
        onUpdate={onUpdate} 
      />
      
      {/* 2. DESCRIPTION */}
      <ProductCardDescription 
        product={product} 
        isAdmin={isAdmin} 
        editMode={editMode}
        openEditor={openEditor}
        onUpdate={onUpdate} 
      />

      {/* 3. PRICE SECTION */}
      <ProductCardPrice 
        product={product} 
        isAdmin={isAdmin} 
        editMode={editMode}
        openEditor={openEditor}
        isPromotionActive={isPromotionActive} 
        originalPriceLabel={originalPriceLabel} 
        discountedPriceLabel={discountedPriceLabel} 
        onUpdate={onUpdate} 
      />
    </div>
  );
});
