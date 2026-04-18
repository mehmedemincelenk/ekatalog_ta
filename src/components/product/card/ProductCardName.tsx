import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { MarqueeText } from '../../ui/MarqueeText';

interface ProductCardNameProps {
  product: Product;
  isAdmin: boolean;
  onUpdate: (field: keyof Product, value: string | boolean | null) => void;
}

/**
 * ATOM: ProductCardName
 * -----------------------------------------------------------
 * Handles product name display with Marquee support and admin editing.
 */
export const ProductCardName = memo(({ product, isAdmin, onUpdate }: ProductCardNameProps) => {
  const theme = THEME.productCard;

  return (
    <MarqueeText 
      text={product.name} 
      textClass={`${theme.typography.name} ${product.inStock === false ? theme.typography.nameOutOfStock : ''}`} 
      isAdmin={isAdmin} 
      editableProps={isAdmin ? { 
        contentEditable: true, 
        suppressContentEditableWarning: true, 
        onBlur: (e: any) => onUpdate('name', e.currentTarget.textContent?.trim() || ''), 
        onKeyDown: (e: any) => e.key === 'Enter' && (e.preventDefault(), e.currentTarget.blur()), 
        className: `${theme.typography.editable} ${theme.adminMenu.editHighlight} ${theme.adminMenu.editPadding} ${THEME.radius.input}` 
      } : {}} 
    />
  );
});
