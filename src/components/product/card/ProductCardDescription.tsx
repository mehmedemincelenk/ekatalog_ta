import { memo } from 'react';
import { THEME, LABELS } from '../../../data/config';
import { Product } from '../../../types';
import { EditableField } from '../../ui/EditableField';

interface ProductCardDescriptionProps {
  product: Product;
  isAdmin: boolean;
  editMode: 'modal' | 'inline';
  openEditor: (title: string, value: string, onConfirm: (val: string) => Promise<void> | void) => void;
  onUpdate: (field: keyof Product, value: string | boolean | null) => void;
}

/**
 * ATOM: ProductCardDescription
 * -----------------------------------------------------------
 * Uses global EditableField for long-form product descriptions.
 */
export const ProductCardDescription = memo(({ product, isAdmin, editMode, openEditor, onUpdate }: ProductCardDescriptionProps) => {
  const theme = THEME.productCard;

  return (
    <div className={theme.innerLayout.descriptionWrapper}>
      <EditableField 
        value={product.description || ''}
        title="Ürün Açıklaması"
        isAdmin={isAdmin}
        editMode={editMode}
        openModal={openEditor}
        onConfirm={(val) => onUpdate('description', val)}
        type="textarea"
        multiline={true}
        className={`${theme.typography.description} ${!isAdmin ? theme.typography.descriptionClamp : 'w-full min-h-[40px]'}`}
      />
    </div>
  );
});
