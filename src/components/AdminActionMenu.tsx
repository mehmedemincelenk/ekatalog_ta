import { memo } from 'react';
<<<<<<< HEAD
import { LABELS, THEME } from '../data/config';
import { Product } from '../types';
=======
import { createPortal } from 'react-dom';
import { LABELS, THEME } from '../data/config';
import { Product } from '../types';
import Button from './Button';
>>>>>>> master

interface AdminActionMenuProps {
  product: Product;
  categories: string[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
<<<<<<< HEAD
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
=======
  onImageChangeClick?: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AdminActionMenu = memo(({ 
  product, categories, onDelete, onUpdate, onImageChangeClick, isOpen, setIsOpen
}: AdminActionMenuProps) => {
  const adminLabels = LABELS.adminActions;
  const modalTheme = THEME.addProductModal; // Reuse overlay/container styles
  const globalIcons = THEME.icons;
>>>>>>> master

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
<<<<<<< HEAD
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
=======
    } catch {
      alert(LABELS.saveError);
    }
  };

  const handleAction = (type: 'DELETE' | 'ARCHIVE' | 'STOCK' | 'DOWNLOAD' | 'CATEGORY', value?: string) => {
    if (type === 'DELETE') { 
      if (window.confirm(adminLabels.confirmDelete)) {
        onDelete(product.id);
        setIsOpen(false);
      }
    }
    else if (type === 'ARCHIVE') onUpdate(product.id, { is_archived: !product.is_archived });
    else if (type === 'STOCK') onUpdate(product.id, { inStock: !product.inStock });
    else if (type === 'DOWNLOAD') downloadHighQualityImage();
    else if (type === 'CATEGORY' && value) onUpdate(product.id, { category: value });
  };

  return createPortal(
    <>
      {/* ACTION MODAL OVERLAY */}
      {isOpen && (
        <div className={modalTheme.overlay} onClick={() => setIsOpen(false)} style={{ zIndex: 1000 }}>
          <div 
            className={`${modalTheme.container} max-w-[300px] p-0 overflow-hidden animate-in zoom-in-95 duration-200`} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-stone-50 border-b border-stone-100 px-5 py-4 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-900 leading-none">Ürünü Yönet</h3>
                <span className="text-[10px] font-bold text-stone-400 mt-1 truncate max-w-[180px]">{product.name}</span>
              </div>
              <Button 
                onClick={() => setIsOpen(false)}
                icon={globalIcons.close}
                variant="ghost"
                size="sm"
                className="!p-0"
              />
            </div>

            <div className="p-4 space-y-4">
              {/* 3-COLUMN ACTION GRID (Image & Product Management) */}
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Image Change */}
                <div 
                  onClick={() => { setIsOpen(false); onImageChangeClick?.(); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-stone-100 bg-stone-50 text-stone-600 hover:bg-white hover:border-stone-200 transition-all cursor-pointer text-center group"
                >
                  <span className="text-lg mb-1">📸</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none">Değiştir</span>
                </div>

                {/* 2. Image Download */}
                <div 
                  onClick={() => product.image && handleAction('DOWNLOAD')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border border-stone-100 bg-stone-50 transition-all cursor-pointer text-center group ${!product.image ? 'opacity-30 pointer-events-none' : 'hover:bg-white hover:border-stone-200'}`}
                >
                  <span className="text-lg mb-1">🖼️</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none">İndir</span>
                </div>

                {/* 3. Clear Image (New) */}
                <div 
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border border-stone-100 bg-stone-50 transition-all cursor-pointer text-center group ${!product.image ? 'opacity-30 pointer-events-none' : 'hover:bg-red-50 hover:border-red-100 text-red-500'}`}
                  onClick={(e) => {
                    if (!product.image) return;
                    e.stopPropagation();
                    if(window.confirm('Resmi kaldırmak istediğinize emin misiniz?')) onUpdate(product.id, { image: '' });
                  }}
                >
                  <span className="text-lg mb-1">🧹</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none">Resmi Sil</span>
                </div>

                {/* 4. Stock Toggle */}
                <div 
                  onClick={() => handleAction('STOCK')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all cursor-pointer text-center group ${
                    product.inStock 
                      ? 'border-stone-900 bg-stone-900 text-white shadow-lg scale-[0.98]' 
                      : 'border-stone-100 bg-stone-50 text-stone-400'
                  }`}
                >
                  <span className="text-lg mb-1">{product.inStock ? '✅' : '❌'}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none">Stokta</span>
                </div>

                {/* 5. Archive Toggle */}
                <div 
                  onClick={() => handleAction('ARCHIVE')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all cursor-pointer text-center group ${
                    product.is_archived 
                      ? 'border-stone-900 bg-stone-900 text-white shadow-lg scale-[0.98]' 
                      : 'border-stone-100 bg-stone-50 text-stone-400'
                  }`}
                >
                  <span className="text-xl mb-1">{product.is_archived ? '📤' : '📦'}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none">Arşiv</span>
                </div>

                {/* 6. Delete Product */}
                <div 
                  onClick={() => handleAction('DELETE')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-red-50 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer text-center group active:scale-95"
                >
                  <span className="text-xl mb-1 drop-shadow-sm">🗑️</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none">Ürünü Sil</span>
                </div>
              </div>

              {/* CATEGORY SELECTOR */}
              <div className="space-y-2 border-t border-stone-100 pt-4 text-left">
                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest px-1">Reyon Değiştir</label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(categoryName => (
                    <Button 
                      key={categoryName}
                      onClick={() => handleAction('CATEGORY', categoryName)}
                      variant={product.category === categoryName ? 'primary' : 'secondary'}
                      mode="rectangle"
                      size="sm"
                      className="!text-[9px] !py-1 !px-2.5 !rounded-lg"
                      disabled={product.category === categoryName}
                    >
                      {categoryName}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 bg-stone-50 border-t border-stone-100">
              <Button 
                onClick={() => setIsOpen(false)}
                variant="primary"
                mode="rectangle"
                className="w-full !rounded-xl !py-3"
              >
                KAPAT
              </Button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
>>>>>>> master
  );
});
