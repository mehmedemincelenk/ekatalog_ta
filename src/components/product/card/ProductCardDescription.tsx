import { memo } from 'react';
import { THEME, LABELS } from '../../../data/config';
import { Product } from '../../../types';

interface ProductCardDescriptionProps {
  product: Product;
  isAdmin: boolean;
  onUpdate: (field: keyof Product, value: string | boolean | null) => void;
}

/**
 * ATOM: ProductCardDescription
 * -----------------------------------------------------------
 * Handles description display and admin editing.
 */
export const ProductCardDescription = memo(({ product, isAdmin, onUpdate }: ProductCardDescriptionProps) => {
  const theme = THEME.productCard;
  const adminLabels = LABELS.adminActions;

  return (
    <div className={theme.innerLayout.descriptionWrapper}>
      {isAdmin ? (
        <textarea 
          defaultValue={product.description || ''} 
          onBlur={(e) => onUpdate('description', e.target.value.trim())} 
          className={`${theme.typography.description} ${theme.adminMenu.editHighlight} border ${theme.adminMenu.editBorder} ${THEME.radius.input} ${theme.adminMenu.editPadding} ${theme.adminMenu.textareaBase}`} 
          placeholder={adminLabels.addDescription}
        />
      ) : (
        product.description && (
          <p className={`${theme.typography.description} ${theme.typography.descriptionClamp}`}>
            {product.description}
          </p>
        )
      )}
    </div>
  );
});
