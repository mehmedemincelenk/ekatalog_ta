import { memo, useState } from 'react';
import { LABELS, THEME } from '../../data/config';
import { Product } from '../../types';
import { downloadHighQualityImage } from '../../utils/media/image';
import Button from '../ui/Button';

interface ProductMenuProps {
  product: Product;
  categories: string[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
}

/**
 * PRODUCT MENU COMPONENT
 * -----------------------------------------------------------
 * Product management interface. Provides quick actions and reyon assignment.
 * Uses a clean overlay for actions and native select for category switching.
 */
export const ProductMenu = memo(({ 
  product, categories, onClose, onDelete, onUpdate 
}: ProductMenuProps) => {
  const adminLabels = LABELS.adminActions;
  const theme = THEME.productCard.adminMenu;
  const icons = THEME.icons;

  const handleDownload = async () => {
    if (product.image) {
      try {
        await downloadHighQualityImage(product.image, product.name);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const menuItems = [
    { 
      label: product.inStock ? adminLabels.outOfStock : adminLabels.inStock, 
      icon: product.inStock ? icons.close : icons.plus, 
      action: () => onUpdate(product.id, { inStock: !product.inStock }),
      variant: 'secondary' as const
    },
    { 
      label: product.is_archived ? adminLabels.publish : adminLabels.archive, 
      icon: product.is_archived ? icons.plus : icons.close, 
      action: () => onUpdate(product.id, { is_archived: !product.is_archived }),
      variant: 'secondary' as const
    },
    { 
      label: 'HQ İNDİR', 
      icon: icons.download, 
      action: handleDownload,
      variant: 'secondary' as const,
      hidden: !product.image
    },
    { 
      label: adminLabels.delete, 
      icon: icons.close, 
      action: () => onDelete(product.id),
      variant: 'danger' as const
    },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center p-4 sm:p-0 sm:items-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`${theme.dropdown} w-full max-w-xs sm:relative sm:mb-0`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* SECTION 1: ACTIONS */}
        <div className="p-2 space-y-1">
          {menuItems.filter(item => !item.hidden).map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.action(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors text-left"
            >
              <span className={`w-5 h-5 flex items-center justify-center ${item.variant === 'danger' ? 'text-red-600' : 'text-stone-600'}`}>
                {item.icon}
              </span>
              <span className={`text-[11px] font-black uppercase tracking-widest ${item.variant === 'danger' ? 'text-red-600' : 'text-stone-900'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* SECTION 2: CATEGORY CHANGE */}
        <div className="border-t border-stone-100 p-2">
          <div className="relative group">
            <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 group-hover:bg-stone-100 transition-colors">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-stone-400 uppercase tracking-tighter">Reyon Değiştir</span>
                <span className="text-[10px] font-black text-stone-900 uppercase truncate max-w-[120px]">{product.category}</span>
              </div>
              <div className="w-4 h-4 text-stone-400">{icons.chevronDown}</div>
            </div>
            
            <select 
              value={product.category}
              onChange={(e) => { onUpdate(product.id, { category: e.target.value }); onClose(); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 3: CLOSE */}
        <div className="p-2 sm:hidden">
          <button 
            onClick={onClose}
            className="w-full py-4 text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
});

