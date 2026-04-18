import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { EditableField } from '../../ui/EditableField';

interface ProductCardNameProps {
  product: Product;
  isAdmin: boolean;
  editMode: 'modal' | 'inline';
  openEditor: (title: string, value: string, onConfirm: (val: string) => Promise<void> | void) => void;
  onUpdate: (field: keyof Product, value: string | boolean | null) => void;
}

/**
 * ATOM: ProductCardName
 * -----------------------------------------------------------
 * Uses global EditableField to handle both inline and modal editing.
 */
export const ProductCardName = memo(({ product, isAdmin, editMode, openEditor, onUpdate }: ProductCardNameProps) => {
  const theme = THEME.productCard;

  return (
    <EditableField 
      value={product.name}
      title="Ürün Adı"
      isAdmin={isAdmin}
      editMode={editMode}
      openModal={openEditor}
      onConfirm={(val) => onUpdate('name', val)}
      className={`${theme.typography.name} ${product.inStock === false ? theme.typography.nameOutOfStock : ''}`}
    />
  );
});
