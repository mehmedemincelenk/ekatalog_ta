import { Product } from '../types';
import BaseModal from './BaseModal';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  isPromotionActive: boolean;
  originalPriceLabel: string;
  discountedPriceLabel: string | null;
  highDefinitionImageSource: string | null;
  isStatic?: boolean;
}

/**
 * PRODUCT DETAIL MODAL (Diamond Standard)
 * -----------------------------------------------------------
 * Extracted from ProductCard to provide a standalone detail view.
 * Focuses on high-definition visuals and clear CTAs.
 */
export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  isPromotionActive,
  originalPriceLabel,
  discountedPriceLabel,
  highDefinitionImageSource,
  isStatic = false,
}: ProductDetailModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      className="!p-0"
      hideCloseButton={false}
      isStatic={isStatic}
    >
      <div className="flex flex-col relative bg-white">
        {highDefinitionImageSource && (
          <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
            <img
              src={highDefinitionImageSource}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* PRODUCT INFO & ACTIONS - LEFT ALIGNED */}
        <div className="p-8 pb-20 space-y-6">
          <div className="space-y-2 text-left">
            <div className="mb-3">
              <span className="bg-stone-100 text-stone-500 px-3 py-1.5 rounded-full text-[0.625rem] font-black uppercase tracking-widest inline-block border border-stone-200">
                {product.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tighter leading-none">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-stone-500 text-xs sm:text-sm font-medium leading-relaxed max-w-full">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* PRICE - PINNED TO BOTTOM LEFT */}
        <div className="absolute bottom-8 left-8 pointer-events-none">
          <div className="flex flex-col items-start">
            {isPromotionActive ? (
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1 rounded-lg">
                <span className="text-stone-300 line-through text-sm font-bold">
                  {originalPriceLabel}
                </span>
                <span className="text-green-600 text-2xl font-black tracking-tighter">
                  {discountedPriceLabel}
                </span>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-md p-1 rounded-lg">
                <span className="text-stone-900 text-2xl font-black tracking-tighter">
                  {originalPriceLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
