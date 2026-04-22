// FILE ROLE: High-Impact Panoramic Hero Carousel (Staged View with 20% Peeks)
// DEPENDS ON: useCarousel Hook, CarouselSlideUnit, THEME config
// CONSUMED BY: CatalogLayout.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { THEME } from '../data/config';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlideUnit from './CarouselSlideUnit';
import Button from './Button';

interface HeroCarouselProps {
  isAdminModeActive: boolean;
}

/**
 * HERO CAROUSEL COMPONENT (STAGED VIEW & INFINITE)
 * -----------------------------------------------------------
 * Implements a centered 60% hero card flanked by 20% "ghost" previews.
 */
export default function HeroCarousel({ isAdminModeActive }: HeroCarouselProps) {
  const { slides, uploadHeroImage, addSlide, deleteSlide, reorderSlides, loading } = useCarousel(isAdminModeActive);
  
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAssetUploading, setIsAssetUploading] = useState(false);
  const [activeEditingSlideId, setActiveEditingSlideId] = useState<number | null>(null);
  const [isAddingNewSlide, setIsAddingNewSlide] = useState(false);

  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const intervalMs = 6000;
  const carouselTheme = THEME.heroCarousel;
  const globalIcons = THEME.icons;

  // RATIONAL CLONING: Buffer for seamless wrap-around
  const extendedSlides = slides.length > 0 ? [
    slides[slides.length - 1], // Pre-clone
    ...slides, 
    slides[0]                 // Post-clone
  ] : [];

  const handleNext = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, [slides.length]);

  const handleTransitionEnd = () => {
    if (currentIndex >= slides.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(slides.length);
    }
  };

  useEffect(() => {
    if (isAdminModeActive || isAssetUploading || slides.length <= 1) return;
    const scrollTimer = setInterval(handleNext, intervalMs);
    return () => clearInterval(scrollTimer);
  }, [handleNext, isAdminModeActive, isAssetUploading, slides.length]);

  const handleFileUploadAction = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeEditingSlideId) return;
    try {
      setIsAssetUploading(true);
      await uploadHeroImage(activeEditingSlideId, file);
      if (isAddingNewSlide) setIsAddingNewSlide(false);
    } catch (err) {
      console.error('Image deployment error:', err);
    } finally {
      setIsAssetUploading(false);
      setActiveEditingSlideId(null);
    }
  };

  const handleAddSlideTrigger = async () => {
    await addSlide();
    setIsAddingNewSlide(true);
    setCurrentIndex(slides.length + 1);
  };

  if (loading) {
    return (
      <div className={`${carouselTheme.container} animate-pulse`}>
        <div className={`${carouselTheme.layout} bg-stone-100 flex items-center justify-center`}>
          <div className={carouselTheme.slide.loadingSpinner} />
        </div>
      </div>
    );
  }

  if (slides.length === 0 && isAdminModeActive) {
    return (
      <div className={carouselTheme.container}>
        <div 
          onClick={handleAddSlideTrigger}
          className={`${carouselTheme.layout} group/add flex flex-col items-center justify-center bg-stone-50 border-2 border-dashed border-stone-200 hover:border-stone-400 cursor-pointer transition-all`}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover/add:scale-110 transition-transform text-stone-400">
            {globalIcons.plus}
          </div>
          <span className="mt-4 font-black uppercase text-xs tracking-widest text-stone-400">İlk Slider Görselini Ekle</span>
        </div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className={carouselTheme.container}>
      <div className={carouselTheme.layout}>
        
        {/* STAGED FILMSTRIP: Rasyonele Kesintisiz Kademeli Odak */}
        <div 
          className={`flex w-full h-full gap-4 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : 'transition-none'}`}
          onTransitionEnd={handleTransitionEnd}
          style={{ 
            // RATIONAL PEER MATH: (Peek: 20%) - (Slide Center: index * 60%)
            // We adjust for gap (16px) slightly in the calc
            transform: typeof window !== 'undefined' && window.innerWidth >= 640 
              ? `translateX(calc(20% - ${currentIndex * 60}% - ${currentIndex * 16}px))`
              : `translateX(-${currentIndex * 100}%)`
          }}
        >
          {extendedSlides.map((slideItem, index) => {
            const isVisible = index === currentIndex;

            return (
              <div 
                key={`${slideItem.id}-${index}`}
                className={`
                  relative w-full sm:w-[60%] h-full shrink-0 transition-all duration-700
                  ${!isVisible && typeof window !== 'undefined' && window.innerWidth >= 640 ? 'opacity-30 blur-[2px] scale-95' : 'opacity-100 blur-0 scale-100'}
                `}
              >
                <CarouselSlideUnit 
                  slideData={slideItem} 
                  isAdmin={isAdminModeActive} 
                  isCurrentlyActive={isVisible} 
                  isCurrentlyUploading={isAssetUploading} 
                  editingTargetSlideId={activeEditingSlideId} 
                  onImageUpdateTrigger={(id) => { setIsAddingNewSlide(false); setActiveEditingSlideId(id); fileUploadInputRef.current?.click(); }} 
                  onDeleteTrigger={deleteSlide}
                  onAddTrigger={handleAddSlideTrigger}
                  onReorderTrigger={reorderSlides}
                  currentIndex={index % (slides.length || 1) || slides.length}
                  totalSlides={slides.length}
                />
              </div>
            );
          })}
        </div>

        {/* NAVIGATION: Panoramic Guard */}
        {slides.length > 1 && (
          <>
            <div className={`${carouselTheme.navigation.navBtnStyle} ${carouselTheme.navigation.prevPos} absolute top-1/2 -translate-y-1/2 z-50`}>
              <Button onClick={handlePrev} variant="glass" size="md" icon={globalIcons.chevronLeft} />
            </div>
            <div className={`${carouselTheme.navigation.navBtnStyle} ${carouselTheme.navigation.nextPos} absolute top-1/2 -translate-y-1/2 z-50`}>
              <Button onClick={handleNext} variant="glass" size="md" icon={globalIcons.chevronRight} />
            </div>
          </>
        )}

        {/* PAGINATION: Circular Insight */}
        {slides.length > 1 && (
          <div className={carouselTheme.navigation.dotsWrapper}>
            {slides.map((_, dotIndex) => {
              const isActive = (currentIndex - 1 + slides.length) % slides.length === dotIndex;
              return (
                <div 
                  key={dotIndex} 
                  className={`
                    ${carouselTheme.navigation.dotBase} 
                    ${isActive ? carouselTheme.navigation.dotActive : carouselTheme.navigation.dotInactive}
                  `} 
                />
              );
            })}
          </div>
        )}

        <input 
          type="file" 
          ref={fileUploadInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileUploadAction} 
        />
      </div>
    </div>
  );
}
