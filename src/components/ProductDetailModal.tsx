import { ProductDetailModalProps } from '../types';
import BaseModal from './BaseModal';
import SmartImage from './SmartImage';

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
      noPadding={true}
      isStatic={isStatic}
    >
      <div className="flex flex-col relative bg-white p-4">
        {/* IMAGE SECTION - SQUARE & PADDED */}
        <div className="relative aspect-square bg-stone-50 overflow-hidden rounded-[2rem] border border-stone-100 shadow-inner">
          <SmartImage
            src={highDefinitionImageSource}
            alt={product.name}
            aspectRatio="square"
            className="w-full h-full"
          />
        </div>

        {/* PRODUCT INFO - STRICT LEFT ALIGN */}
        <div className="pt-8 pb-24 px-4 space-y-5">
          <div className="space-y-3 text-left">
            <div>
              <span className="bg-stone-50 text-stone-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block border border-stone-100 shadow-sm">
                {product.category}
              </span>
            </div>
            <h3 className="text-2xl font-black text-stone-900 tracking-tighter leading-tight max-w-[80%] uppercase">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-stone-500 text-xs font-bold leading-relaxed max-w-[90%] uppercase">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* PRICE - PINNED TO BOTTOM LEFT */}
        <div className="absolute bottom-10 left-8 pointer-events-none">
          <div className="flex flex-col items-start">
            {isPromotionActive ? (
              <div className="flex flex-col items-start gap-1">
                <span className="text-stone-300 line-through text-sm font-bold">
                  {originalPriceLabel}
                </span>
                <span className="text-stone-900 text-3xl font-black tracking-tighter">
                  {discountedPriceLabel}
                </span>
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm">
                <span className="text-stone-900 text-3xl font-black tracking-tighter">
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
