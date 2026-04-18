import { memo } from 'react';
import { LABELS, THEME } from '../../data/config';
import { Product } from '../../types';
import { downloadHighQualityImage } from '../../utils/media/image';

interface ProductMenuProps {
  product: Product;
  categories: string[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
}

/**
 * PRODUCT MENU COMPONENT
 * -----------------------------------------------------------
 * Product management interface. Fully managed via THEME tokens.
 */
export const ProductMenu = memo(({ 
  product, categories, onDelete, onUpdate 
}: ProductMenuProps) => {
  const adminLabels = LABELS.adminActions;
  const theme = THEME.productCard;

  const handleNativeSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (!selectedValue) return;
    
    if (selectedValue === 'DELETE') { 
      onDelete(product.id); 
    }
    else if (selectedValue === 'ARCHIVE') onUpdate(product.id, { is_archived: !product.is_archived });
    else if (selectedValue === 'STOCK') onUpdate(product.id, { inStock: !product.inStock });
    else if (selectedValue === 'DOWNLOAD') {
      if (product.image) {
        downloadHighQualityImage(product.image, product.name).catch(err => alert(err.message));
      }
    }
    else if (selectedValue.startsWith('CAT:')) onUpdate(product.id, { category: selectedValue.replace('CAT:', '') });
    
    event.target.value = "";
  };

  return (
    <div className="relative">
      <div className={`${theme.adminMenu.mobileToggle} ${THEME.radius.badge}`}>
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${theme.adminMenu.mobileIconColor} scale-75`}>
          {THEME.icons.dots}
        </div>
        <select 
          onChange={handleNativeSelectChange} 
          value="" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
          <option value="" disabled></option>
          <optgroup label="--- İŞLEMLER ---">
            <option value="STOCK">{product.inStock ? '❌ ' + adminLabels.outOfStock : '✅ ' + adminLabels.inStock}</option>
            {product.image && <option value="DOWNLOAD">🖼️ HQ RESMİ İNDİR</option>}
            <option value="ARCHIVE">{product.is_archived ? '📤 ' + adminLabels.publish : '📦 ' + adminLabels.archive}</option>
            <option value="DELETE">🗑️ {adminLabels.delete}</option>
          </optgroup>
          <optgroup label="--- REYON DEĞİŞTİR ---">
            {categories.map(categoryName => (<option key={categoryName} value={`CAT:${categoryName}`} disabled={product.category === categoryName}>{categoryName}</option>))}
          </optgroup>
        </select>
      </div>
    </div>
  );
});

