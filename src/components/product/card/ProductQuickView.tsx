import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { resolveVisualAssetUrl } from '../../../utils/media/image';
import { ActiveDiscount } from '../../../hooks/catalog/useDiscount';
import { useProductPricing } from '../../../hooks/catalog/useProductPricing';
import ModalBase from '../../ui/ModalBase';
import SmartImage from '../../ui/SmartImage';
import Button from '../../ui/Button';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  activeDiscount?: ActiveDiscount | null;
}

/**
 * PRODUCT QUICK VIEW MODAL
 * -----------------------------------------------------------
 * Refactored to modular location: product/card/
 */
export const ProductQuickView = memo(({ product, isOpen, onClose, activeDiscount }: ProductQuickViewProps) => {
  if (!isOpen) return null;

  const { isPromotionActive, originalPriceLabel, discountedPriceLabel } = useProductPricing(product, activeDiscount);
  
  const hqImageSource = product.image 
    ? resolveVisualAssetUrl(product.image.replace('/lq/', '/hq/').split('?')[0]) 
    : null;

  return (
    <ModalBase onClose={onClose} className="!max-w-lg !rounded-3xl">
      <div className="absolute top-4 right-4 z-[210]">
        <Button 
          onClick={onClose} 
          icon={THEME.icons.close} 
          variant="secondary" 
          size="md" 
          mode="rectangle" 
          className="!rounded-full shadow-2xl" 
        />
      </div>

      <div className="relative aspect-[4/3]">
        <SmartImage src={hqImageSource} alt={product.name} isPriority wrapperClass="w-full h-full" />
        <div className="absolute top-4 left-4">
          <span className="bg-black/5 backdrop-blur-md text-stone-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-6 text-center">
        <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tighter leading-none">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-stone-500 text-xs sm:text-sm font-medium leading-relaxed max-w-[90%] mx-auto">
            {product.description}
          </p>
        )}

        <div className="pt-4 flex flex-col items-center gap-1">
           {isPromotionActive ? (
             <>
               <span className="text-stone-400 line-through text-sm font-bold">{originalPriceLabel}</span>
               <span className="text-stone-900 text-3xl font-black tracking-tighter">{discountedPriceLabel}</span>
             </>
           ) : (
             <span className="text-stone-900 text-3xl font-black tracking-tighter">{originalPriceLabel}</span>
           )}
        </div>
      </div>
    </ModalBase>
  );
});
