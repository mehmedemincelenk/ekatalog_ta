import { useRef, useState, useEffect, memo } from 'react';
import { LABELS, THEME } from '../data/config';
import { Product } from '../types';
import { resolveVisualAssetUrl, PLACEHOLDER_VISUAL_SYMBOL } from '../utils/image';
import { calculatePromotionalPrice } from '../utils/price';
import Button from './Button';
import { AdminActionMenu } from './AdminActionMenu';
import { MarqueeText } from './MarqueeText';
import { ActiveDiscount } from '../hooks/useDiscount';

/**
 * PRODUCT CARD COMPONENT (100% Tokenized & Professional English)
 * -----------------------------------------------------------
 * Managed via central THEME config. Orchestrates sub-components.
 */

interface ProductCardProps {
  product: Product;
  categories: string[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onOrderChange?: (id: string, newPosition: number) => void;
  onImageUpload?: (id: string, file: File) => Promise<void>;
  orderIndex?: number;
  itemsInCategory?: number;
  activeDiscount?: ActiveDiscount | null;
  isPriority?: boolean;
}

const ProductCard = memo(({
  product, 
  categories = [], 
  isAdmin, 
  onDelete, 
  onUpdate, 
  onOrderChange, 
  onImageUpload, 
  orderIndex = 1, 
  itemsInCategory = 1, 
  activeDiscount,
  isPriority = false
}: ProductCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardContainerRef = useRef<HTMLElement>(null);

  const [hasImageError, setHasImageError] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [optimisticImagePreview, setOptimisticImagePreview] = useState<string | null>(null);
  const [isZoomDetailOpen, setIsZoomDetailOpen] = useState(false);

  const theme = THEME.productCard;
  const adminLabels = LABELS.adminActions;

  // Apple-style scroll to close behavior
  useEffect(() => {
    if (!isZoomDetailOpen) return;
    const handleScrollClose = () => setIsZoomDetailOpen(false);
    window.addEventListener('scroll', handleScrollClose, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollClose);
  }, [isZoomDetailOpen]);

  // Reset optimistic preview when real image arrives
  useEffect(() => {
    if (product.image && optimisticImagePreview) setOptimisticImagePreview(null);
  }, [product.image, optimisticImagePreview]);

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !onImageUpload) return;
    
    const localPreviewUrl = URL.createObjectURL(selectedFile);
    setOptimisticImagePreview(localPreviewUrl);
    setIsUploadingImage(true);
    setHasImageError(false);
    
    try { 
      await onImageUpload(product.id, selectedFile); 
    } catch { 
      alert(LABELS.saveError); 
      setOptimisticImagePreview(null); 
    } finally { 
      setIsUploadingImage(false); 
      event.target.value = ''; 
    }
  };

  const handleDataFieldUpdate = (fieldName: keyof Product, newValue: string | boolean | null) => {
    if (newValue !== (product[fieldName] || '')) {
      onUpdate(product.id, { [fieldName]: newValue });
    }
  };

  // DISCOUNT CALCULATION
  const isPromotionActive = activeDiscount && (!activeDiscount.category || activeDiscount.category === product.category);
  const originalPriceLabel = product.price.includes('₺') ? product.price : `${product.price} ₺`;
  const discountedPriceValue = isPromotionActive ? calculatePromotionalPrice(product.price, activeDiscount.rate) : null;
  const discountedPriceLabel = discountedPriceValue ? (discountedPriceValue.includes('₺') ? discountedPriceValue : `${discountedPriceValue} ₺`) : null;

  const primaryImageSource = optimisticImagePreview || (product.image ? resolveVisualAssetUrl(product.image) : null);
  const highDefinitionImageSource = product.image ? resolveVisualAssetUrl(product.image.replace('/lq/', '/hq/').split('?')[0]) : null;

  return (
    <>
      <article 
        ref={cardContainerRef} 
        data-product-id={product.id} 
        className={`${theme.container} ${THEME.radius.card} ${product.inStock === false ? theme.outOfStockBorder : theme.activeBorder} ${theme.shadow}`}
      >
        {/* IMAGE VISUAL SECTION */}
        <div 
          className={`${theme.image.wrapper} ${theme.image.aspect} ${theme.image.bg} ${THEME.radius.image} ${!isAdmin ? theme.image.cursorUser : theme.image.cursorAdmin}`} 
          onClick={() => { 
            if (isAdmin && !isUploadingImage) fileInputRef.current?.click(); 
            else if (!isAdmin && primaryImageSource) setIsZoomDetailOpen(true); 
          }}
        >
          {primaryImageSource && !hasImageError ? (
            <img 
              src={primaryImageSource} 
              alt={product.name} 
              onError={() => setHasImageError(true)} 
              className={`w-full h-full ${theme.image.fit} ${THEME.radius.image} ${theme.image.transition} ${product.inStock === false ? theme.image.outOfStock : ''} ${isUploadingImage ? theme.image.uploading : ''}`} 
              draggable={false} 
              loading={isPriority || isZoomDetailOpen ? "eager" : "lazy"} 
              {...(isPriority ? { fetchpriority: "high" } : {})}
            />
          ) : (
            <div className={`${theme.image.placeholderIcon} absolute inset-0 flex items-center justify-center`}>
              <span>{PLACEHOLDER_VISUAL_SYMBOL}</span>
            </div>
          )}
          
          {isAdmin && primaryImageSource && !isUploadingImage && (
            <div className={theme.image.overlay} />
          )}

          {isUploadingImage && (
            <div className={theme.uploadOverlay.wrapper}>
              <div className={theme.uploadOverlay.spinner}></div>
              <span className={theme.uploadOverlay.label}>YÜKLENİYOR</span>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
        </div>

        {/* TEXTUAL CONTENT SECTION */}
        <div className={`${theme.padding} ${theme.innerLayout.contentWrapper}`}>
          <MarqueeText 
            text={product.name} 
            textClass={`${theme.typography.name} ${theme.typography.nameTransition} ${product.inStock === false ? theme.typography.nameOutOfStock : ''}`} 
            isAdmin={isAdmin} 
            editableProps={isAdmin ? { 
              contentEditable: true, 
              suppressContentEditableWarning: true, 
              onBlur: (event: React.FocusEvent<HTMLDivElement>) => handleDataFieldUpdate('name', event.currentTarget.textContent?.trim() || ''), 
              onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => event.key === 'Enter' && (event.preventDefault(), event.currentTarget.blur()), 
              className: `${theme.typography.editable} ${theme.adminMenu.editHighlight} ${theme.adminMenu.editPadding} ${THEME.radius.input}` 
            } : {}} 
          />
          
          <div className={theme.innerLayout.descriptionWrapper}>
            {isAdmin ? (
              <div onClick={(event) => event.stopPropagation()} className={theme.adminMenu.textareaBase}>
                <textarea 
                  defaultValue={product.description || ''} 
                  onBlur={(event) => handleDataFieldUpdate('description', event.target.value.trim())} 
                  className={`${theme.typography.description} ${theme.adminMenu.editHighlight} border ${theme.adminMenu.editBorder} ${THEME.radius.input} ${theme.adminMenu.editPadding} ${theme.adminMenu.textareaBase}`} 
                  placeholder={adminLabels.addDescription}
                />
              </div>
            ) : (
              product.description && <p className={`${theme.typography.description} ${theme.typography.descriptionClamp}`}>{product.description}</p>
            )}
          </div>

          {/* PRICE AREA: ORIGINAL (GRAY/STRIKE) + NEW (GREEN) */}
          <div className={theme.innerLayout.footerWrapper}>
            <div className="flex flex-wrap items-center gap-1.5 min-h-[20px]">
              {isPromotionActive && !isAdmin ? (
                <>
                  <span className={`${theme.typography.price} text-stone-400 line-through text-[10px] sm:text-[11px]`}>
                    {originalPriceLabel}
                  </span>
                  <span className={`${theme.typography.price} text-green-600`}>
                    {discountedPriceLabel}
                  </span>
                </>
              ) : (
                <div 
                  contentEditable={isAdmin} 
                  suppressContentEditableWarning 
                  onBlur={(event: React.FocusEvent<HTMLDivElement>) => { 
                    let inputPrice = event.currentTarget.textContent?.trim() || ''; 
                    if (inputPrice && !inputPrice.startsWith('₺')) inputPrice = '₺' + inputPrice; 
                    handleDataFieldUpdate('price', inputPrice); 
                  }} 
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => event.key === 'Enter' && (event.preventDefault(), event.currentTarget.blur())} 
                  className={`${theme.typography.price} ${isAdmin ? `${theme.typography.editable} ${theme.adminMenu.editHighlight} ${theme.adminMenu.editPadding} ${THEME.radius.input}` : 'text-stone-900'} ${product.inStock === false && !isAdmin ? theme.typography.priceOutOfStock : ''}`}
                >
                  {originalPriceLabel}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ADMIN TOOLS */}
        {isAdmin && (
          <>
            <div className="absolute top-2 left-2 z-30">
              <div className={`${theme.orderSelect.wrapper} ${THEME.radius.badge} shadow-xl`}>
                <select 
                  value={orderIndex} 
                  onChange={(e) => onOrderChange?.(product.id, parseInt(e.target.value, 10))} 
                  className={theme.orderSelect.select}
                >
                  {Array.from({ length: itemsInCategory }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="absolute top-2 right-2 z-30">
              <div className="shadow-xl rounded-full bg-white/90 backdrop-blur-md">
                <AdminActionMenu product={product} categories={categories} onDelete={onDelete} onUpdate={onUpdate} />
              </div>
            </div>
          </>
        )}

        {/* STATUS BADGES */}
        <div className={theme.status.wrapper}>
          {!product.inStock && (
            <div className={theme.status.outOfStockLabel}>
              TÜKENDİ
            </div>
          )}
          {product.is_archived && (<div className={theme.status.badge}>📦</div>)}
        </div>
      </article>

      {/* QUICK VIEW MODAL (Apple-Style Minimalism) */}
      {isZoomDetailOpen && highDefinitionImageSource && (
        <div className={THEME.modal.overlay} onClick={() => setIsZoomDetailOpen(false)}>
          <div className="absolute top-4 right-4 z-[210]">
            <Button onClick={() => setIsZoomDetailOpen(false)} icon={THEME.icons.close} variant="secondary" size="md" mode="rectangle" className="!rounded-full shadow-2xl" />
          </div>
          
          <div className="bg-white w-full max-w-lg mx-auto overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500 rounded-3xl" onClick={e => e.stopPropagation()}>
            {/* PRODUCT VISUAL */}
            <div className="relative aspect-[4/3] bg-stone-50">
              <img src={highDefinitionImageSource} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className="bg-black/5 backdrop-blur-md text-stone-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {product.category}
                </span>
              </div>
            </div>

            {/* PRODUCT INFO & ACTIONS */}
            <div className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tighter leading-none">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-stone-500 text-xs sm:text-sm font-medium leading-relaxed max-w-[90%] mx-auto">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="pt-4 flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  {isPromotionActive ? (
                    <div className="flex items-center gap-3">
                      <span className="text-stone-300 line-through text-sm font-bold">{originalPriceLabel}</span>
                      <span className="text-green-600 text-2xl font-black tracking-tighter">{discountedPriceLabel}</span>
                    </div>
                  ) : (
                    <span className="text-stone-900 text-2xl font-black tracking-tighter">{originalPriceLabel}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ProductCard;
