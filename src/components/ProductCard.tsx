import { useRef, useState, useEffect, memo } from 'react';
<<<<<<< HEAD
import { LABELS, THEME } from '../data/config';
import { Product } from '../types';
import { resolveVisualAssetUrl, PLACEHOLDER_VISUAL_SYMBOL } from '../utils/image';
import { calculatePromotionalPrice } from '../utils/price';
=======
import { motion, AnimatePresence } from 'framer-motion';
import { LABELS, THEME } from '../data/config';
import { Product } from '../types';
import { resolveVisualAssetUrl, PLACEHOLDER_VISUAL_SYMBOL } from '../utils/image';
import { calculatePromotionalPrice, standardizePriceInput } from '../utils/price';
>>>>>>> master
import Button from './Button';
import { AdminActionMenu } from './AdminActionMenu';
import { MarqueeText } from './MarqueeText';
import { ActiveDiscount } from '../hooks/useDiscount';
<<<<<<< HEAD
=======
import OrderSelector from './OrderSelector';
>>>>>>> master

/**
 * PRODUCT CARD COMPONENT (100% Tokenized & Professional English)
 * -----------------------------------------------------------
 * Managed via central THEME config. Orchestrates sub-components.
 */

interface ProductCardProps {
  product: Product;
  categories: string[];
  isAdmin: boolean;
<<<<<<< HEAD
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onOrderChange?: (id: string, newPosition: number) => void;
  onImageUpload?: (id: string, file: File) => Promise<void>;
=======
  isInlineEnabled: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onOrderChange?: (id: string, newPosition: number) => void;
  onImageUpload?: (id: string, file: File) => Promise<string | undefined>;
>>>>>>> master
  orderIndex?: number;
  itemsInCategory?: number;
  activeDiscount?: ActiveDiscount | null;
  isPriority?: boolean;
<<<<<<< HEAD
=======
  activeAdminProductId?: string | null;
  setActiveAdminProductId?: (id: string | null) => void;
>>>>>>> master
}

const ProductCard = memo(({
  product, 
  categories = [], 
  isAdmin, 
<<<<<<< HEAD
=======
  isInlineEnabled,
>>>>>>> master
  onDelete, 
  onUpdate, 
  onOrderChange, 
  onImageUpload, 
  orderIndex = 1, 
  itemsInCategory = 1, 
  activeDiscount,
<<<<<<< HEAD
  isPriority = false
=======
  isPriority = false,
  activeAdminProductId,
  setActiveAdminProductId
>>>>>>> master
}: ProductCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardContainerRef = useRef<HTMLElement>(null);

  const [hasImageError, setHasImageError] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [optimisticImagePreview, setOptimisticImagePreview] = useState<string | null>(null);
  const [isZoomDetailOpen, setIsZoomDetailOpen] = useState(false);

<<<<<<< HEAD
=======
  const isAdminMenuOpen = activeAdminProductId === product.id;
  const setIsAdminMenuOpen = (isOpen: boolean) => {
    setActiveAdminProductId?.(isOpen ? product.id : null);
  };

>>>>>>> master
  const theme = THEME.productCard;
  const adminLabels = LABELS.adminActions;

  // Apple-style scroll to close behavior
  useEffect(() => {
    if (!isZoomDetailOpen) return;
    const handleScrollClose = () => setIsZoomDetailOpen(false);
    window.addEventListener('scroll', handleScrollClose, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollClose);
  }, [isZoomDetailOpen]);

<<<<<<< HEAD
  // Reset optimistic preview when real image arrives
  useEffect(() => {
    if (product.image && optimisticImagePreview) setOptimisticImagePreview(null);
=======
  // Reset optimistic preview when real image arrives & CLEANUP memory
  useEffect(() => {
    if (product.image && optimisticImagePreview) {
      URL.revokeObjectURL(optimisticImagePreview);
      setOptimisticImagePreview(null);
    }
    // Cleanup on unmount
    return () => {
      if (optimisticImagePreview) URL.revokeObjectURL(optimisticImagePreview);
    };
>>>>>>> master
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

<<<<<<< HEAD
=======
  const handlePromptEdit = (field: keyof Product, label: string) => {
    if (!isAdmin || isInlineEnabled) return;
    const currentVal = (product[field] as string) || '';
    const newVal = window.prompt(`${label} düzenle:`, currentVal);
    if (newVal !== null) {
      handleDataFieldUpdate(field, field === 'price' ? standardizePriceInput(newVal) : newVal);
    }
  };

>>>>>>> master
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
<<<<<<< HEAD
            if (isAdmin && !isUploadingImage) fileInputRef.current?.click(); 
=======
            if (isAdmin && !isUploadingImage) setIsAdminMenuOpen(true); 
>>>>>>> master
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
          
<<<<<<< HEAD
          {isAdmin && primaryImageSource && !isUploadingImage && (
            <div className={theme.image.overlay} />
          )}
=======
          <AnimatePresence>
            {isAdmin && primaryImageSource && !isUploadingImage && (
              <motion.div 
                initial={false} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                className={theme.image.overlay} 
              />
            )}
          </AnimatePresence>

          {/* ADMIN TOOLS: Repositioned logic */}
          <AnimatePresence>
            {isAdmin && (
              <motion.div
                initial={false}
                animate={{ opacity: 1, scale: 1, transform: 'translateZ(0)' }}
                exit={{ opacity: 0, filter: 'blur(12px)', scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-[30] pointer-events-none"
              >
                <div className="absolute top-2 right-2 z-[30] pointer-events-auto">
                  <OrderSelector 
                    currentOrder={orderIndex}
                    totalCount={itemsInCategory}
                    onChange={(newPos) => onOrderChange?.(product.id, newPos)}
                    className="shadow-xl"
                  />
                </div>
                <div className="pointer-events-auto">
                  <AdminActionMenu 
                    product={product} 
                    categories={categories} 
                    onDelete={onDelete} 
                    onUpdate={onUpdate} 
                    isOpen={isAdminMenuOpen}
                    setIsOpen={setIsAdminMenuOpen}
                    onImageChangeClick={() => fileInputRef.current?.click()}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
>>>>>>> master

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
<<<<<<< HEAD
            editableProps={isAdmin ? { 
=======
            onClick={() => handlePromptEdit('name', 'Ürün Adı')}
            editableProps={isAdmin && isInlineEnabled ? { 
>>>>>>> master
              contentEditable: true, 
              suppressContentEditableWarning: true, 
              onBlur: (event: React.FocusEvent<HTMLDivElement>) => handleDataFieldUpdate('name', event.currentTarget.textContent?.trim() || ''), 
              onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => event.key === 'Enter' && (event.preventDefault(), event.currentTarget.blur()), 
<<<<<<< HEAD
              className: `${theme.typography.editable} ${theme.adminMenu.editHighlight} ${theme.adminMenu.editPadding} ${THEME.radius.input}` 
=======
              className: `outline-none focus:ring-2 focus:ring-stone-900/10 rounded px-1 -mx-1 transition-all hover:bg-stone-100 focus:bg-stone-100 cursor-text` 
>>>>>>> master
            } : {}} 
          />
          
          <div className={theme.innerLayout.descriptionWrapper}>
<<<<<<< HEAD
            {isAdmin ? (
=======
            {isAdmin && isInlineEnabled ? (
>>>>>>> master
              <div onClick={(event) => event.stopPropagation()} className={theme.adminMenu.textareaBase}>
                <textarea 
                  defaultValue={product.description || ''} 
                  onBlur={(event) => handleDataFieldUpdate('description', event.target.value.trim())} 
<<<<<<< HEAD
                  className={`${theme.typography.description} ${theme.adminMenu.editHighlight} border ${theme.adminMenu.editBorder} ${THEME.radius.input} ${theme.adminMenu.editPadding} ${theme.adminMenu.textareaBase}`} 
                  placeholder={adminLabels.addDescription}
                />
              </div>
            ) : (
              product.description && <p className={`${theme.typography.description} ${theme.typography.descriptionClamp}`}>{product.description}</p>
=======
                  onChange={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onFocus={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  className={`${theme.typography.description} outline-none w-full px-1 -mx-1 rounded transition-all hover:bg-stone-100 focus:bg-stone-100 focus:ring-2 focus:ring-stone-900/10 border-transparent bg-transparent resize-none overflow-hidden`} 
                  placeholder={adminLabels.addDescription}
                  rows={1}
                />
              </div>
            ) : (
              (product.description || isAdmin) && (
                <p 
                  onClick={() => handlePromptEdit('description', 'Ürün Açıklaması')}
                  className={`${theme.typography.description} ${theme.typography.descriptionClamp} ${isAdmin ? `outline-none focus:ring-2 focus:ring-stone-900/10 rounded px-1 -mx-1 transition-all hover:bg-stone-100 focus:bg-stone-100 cursor-text` : ''}`}
                >
                  {product.description || (isAdmin ? adminLabels.addDescription : '')}
                </p>
              )
>>>>>>> master
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
<<<<<<< HEAD
                  contentEditable={isAdmin} 
                  suppressContentEditableWarning 
                  onBlur={(event: React.FocusEvent<HTMLDivElement>) => { 
                    let inputPrice = event.currentTarget.textContent?.trim() || ''; 
                    if (inputPrice && !inputPrice.startsWith('₺')) inputPrice = '₺' + inputPrice; 
                    handleDataFieldUpdate('price', inputPrice); 
                  }} 
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => event.key === 'Enter' && (event.preventDefault(), event.currentTarget.blur())} 
                  className={`${theme.typography.price} ${isAdmin ? `${theme.typography.editable} ${theme.adminMenu.editHighlight} ${theme.adminMenu.editPadding} ${THEME.radius.input}` : 'text-stone-900'} ${product.inStock === false && !isAdmin ? theme.typography.priceOutOfStock : ''}`}
=======
                  contentEditable={isAdmin && isInlineEnabled} 
                  suppressContentEditableWarning 
                  onBlur={(event: React.FocusEvent<HTMLDivElement>) => { 
                    const inputPrice = event.currentTarget.textContent?.trim() || ''; 
                    handleDataFieldUpdate('price', standardizePriceInput(inputPrice)); 
                  }} 
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => event.key === 'Enter' && (event.preventDefault(), event.currentTarget.blur())} 
                  onClick={() => handlePromptEdit('price', 'Ürün Fiyatı')}
                  className={`${theme.typography.price} ${isAdmin ? `outline-none focus:ring-2 focus:ring-stone-900/10 rounded px-1 -mx-1 transition-all hover:bg-stone-100 focus:bg-stone-100 cursor-text` : 'text-stone-900'} ${product.inStock === false && !isAdmin ? theme.typography.priceOutOfStock : ''}`}
>>>>>>> master
                >
                  {originalPriceLabel}
                </div>
              )}
            </div>
          </div>
        </div>

<<<<<<< HEAD
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

=======
>>>>>>> master
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
