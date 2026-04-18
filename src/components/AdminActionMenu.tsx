import { memo } from 'react';
import { LABELS, THEME } from '../data/config';
import { Product } from '../types';

interface AdminActionMenuProps {
  product: Product;
  categories: string[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
}

/**
 * ADMIN ACTION MENU COMPONENT (100% Tokenized & Professional English)
 * -----------------------------------------------------------
 * Product management interface. Fully managed via THEME tokens.
 */
export const AdminActionMenu = memo(({ 
  product, categories, onDelete, onUpdate 
}: AdminActionMenuProps) => {
  const adminLabels = LABELS.adminActions;
  const theme = THEME.productCard;

  const downloadHighQualityImage = async () => {
    if (!product.image) return;
    try {
      const highQualityUrl = product.image.replace('/lq/', '/hq/').split('?')[0];
      const response = await fetch(highQualityUrl);
      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = localUrl;
      downloadLink.download = `hq-${product.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      window.URL.revokeObjectURL(localUrl);
      document.body.removeChild(downloadLink);
    } catch (error) {
      alert('Resim indirilemedi.');
    }
  };

  const handleNativeSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (!selectedValue) return;
    
    if (selectedValue === 'DELETE') { 
      if (window.confirm(adminLabels.confirmDelete)) onDelete(product.id); 
    }
    else if (selectedValue === 'ARCHIVE') onUpdate(product.id, { is_archived: !product.is_archived });
    else if (selectedValue === 'STOCK') onUpdate(product.id, { inStock: !product.inStock });
    else if (selectedValue === 'DOWNLOAD') downloadHighQualityImage();
    else if (selectedValue.startsWith('CAT:')) onUpdate(product.id, { category: selectedValue.replace('CAT:', '') });
    
    event.target.value = "";
  };

  return (
    <div className="relative">
      <div className="w-7 h-7 rounded-md bg-white/95 backdrop-blur-md shadow-2xl border border-white/40 flex items-center justify-center cursor-pointer hover:bg-white transition-all active:scale-95 group">
        <div className={`flex items-center justify-center pointer-events-none ${theme.adminMenu.mobileIconColor} scale-75`}>
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
