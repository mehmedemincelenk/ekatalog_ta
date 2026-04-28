import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { THEME, CAROUSEL, TECH } from '../data/config';
import { supabase } from '../supabase';
import { getActiveStoreSlug, reorderArray } from '../utils/core';
import CarouselSlideUnit from './CarouselSlideUnit';
import Button from './Button';
import PlusPlaceholder from './PlusPlaceholder';

import { HeroCarouselProps, CarouselSlide } from '../types';

const INTERVAL_MS = 6000;
const SWIPE_THRESHOLD = 50;

/**
 * HERO CAROUSEL COMPONENT (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Implements a centered 60% hero card flanked by 20% "ghost" previews.
 * Features: Infinite loop, Drag/Swipe support, Resize resilience.
 */
export default function HeroCarousel({ isAdminModeActive }: HeroCarouselProps) {
  // --- IN-SITU HOOK: CAROUSEL ENGINE ---
  const [marketingSlides, setMarketingSlides] = useState<CarouselSlide[]>(CAROUSEL.slides);
  const [loading, setLoading] = useState(true);
  const activeStoreSlug = getActiveStoreSlug();

  const persistCarouselData = useCallback(async (updatedSlides: CarouselSlide[]) => {
    if (!isAdminModeActive || activeStoreSlug === 'main-site') return;
    try {
      const { data: storeData } = await supabase.from('stores').select('carousel_data').eq('slug', activeStoreSlug).single();
      const currentCarouselData = storeData?.carousel_data || {};
      const { error } = await supabase.from('stores').update({
        carousel_data: { ...currentCarouselData, slides: updatedSlides },
      }).eq('slug', activeStoreSlug);
      if (error) throw error;
    } catch (err) { console.error('Carousel sync failed:', err); }
  }, [isAdminModeActive, activeStoreSlug]);

  const synchronizeCarouselSlides = useCallback(async () => {
    if (activeStoreSlug === 'main-site') { setLoading(false); return; }
    setLoading(true);
    const { data: storeData, error: fetchError } = await supabase.from('stores').select('carousel_data').eq('slug', activeStoreSlug).single();
    if (storeData && !fetchError && storeData.carousel_data?.slides) {
      setMarketingSlides(storeData.carousel_data.slides);
    }
    setLoading(false);
  }, [activeStoreSlug]);

  useEffect(() => { synchronizeCarouselSlides(); }, [synchronizeCarouselSlides]);

  const modifySlideContent = useCallback(async (slideId: number, contentChanges: Partial<CarouselSlide>) => {
    setMarketingSlides((prev) => {
      const updated = prev.map((s) => s.id === slideId ? { ...s, ...contentChanges } : s);
      persistCarouselData(updated);
      return updated;
    });
  }, [persistCarouselData]);

  const uploadHeroImage = useCallback(async (slideId: number, visualFile: File) => {
    try {
      const { processDualQualityVisuals } = await import('../utils/image');
      const { hq: optimizedVisual } = await processDualQualityVisuals(visualFile, TECH.storage.heroWidth);
      const visualFileName = `hero-${activeStoreSlug}-${slideId === -1 ? 'new' : slideId}-${Date.now()}.jpg`;
      const storagePath = `${TECH.storage.heroFolder}/${visualFileName}`;
      const { error } = await supabase.storage.from(TECH.storage.bucket).upload(storagePath, optimizedVisual, { upsert: true, cacheControl: TECH.storage.cacheControl });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(TECH.storage.bucket).getPublicUrl(storagePath);
      const finalizedUrl = `${publicUrl}?t=${Date.now()}`;
      
      // Only modify existing slide content if it's NOT a new slide creation flow
      if (slideId !== -1) {
        await modifySlideContent(slideId, { src: finalizedUrl });
      }
      
      return finalizedUrl;
    } catch (err) { console.error('Hero upload failed:', err); throw err; }
  }, [activeStoreSlug, modifySlideContent]);


  const deleteSlide = useCallback(async (slideId: number) => {
    setMarketingSlides((prev) => {
      const updated = prev.filter((s) => s.id !== slideId);
      persistCarouselData(updated);
      return updated;
    });
  }, [persistCarouselData]);

  const reorderSlides = useCallback(async (slideId: number, newDisplayIndex: number) => {
    setMarketingSlides((prev) => {
      const currentIndex = prev.findIndex((s) => s.id === slideId);
      if (currentIndex === -1) return prev;
      const targetedIndex = Math.max(0, Math.min(newDisplayIndex - 1, prev.length - 1));
      if (currentIndex === targetedIndex) return prev;
      const updated = reorderArray(prev, currentIndex, targetedIndex);
      persistCarouselData(updated);
      return updated;
    });
  }, [persistCarouselData]);

  const slides = marketingSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAssetUploading, setIsAssetUploading] = useState(false);
  const [activeEditingSlideId, setActiveEditingSlideId] = useState<
    number | null
  >(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  );

  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const carouselTheme = THEME.heroCarousel;
  const globalIcons = THEME.icons;

  // RESIZE RESILIENCE: Track screen size changes to adapt layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const handleNext = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);


  useEffect(() => {
    if (isAdminModeActive || isAssetUploading || slides.length <= 1) return;
    const scrollTimer = setInterval(handleNext, INTERVAL_MS);
    return () => clearInterval(scrollTimer);
  }, [handleNext, isAdminModeActive, isAssetUploading, slides.length, currentIndex]);

  const handleAddSlideTrigger = useCallback(async () => {
    setActiveEditingSlideId(-1); // Special ID for new slide
    fileUploadInputRef.current?.click();
  }, []);

  // GLOBAL SIGNAL LISTENER: Clean way to trigger slide addition from App.tsx
  useEffect(() => {
    if (!isAdminModeActive) return;
    const handleGlobalTrigger = () => handleAddSlideTrigger();
    window.addEventListener('ekatalog:add-carousel-slide', handleGlobalTrigger);
    return () =>
      window.removeEventListener(
        'ekatalog:add-carousel-slide',
        handleGlobalTrigger,
      );
  }, [isAdminModeActive, handleAddSlideTrigger]);

  // TOUCH/DRIPE LOGIC: Unified swipe handler
  // GESTURE ENGINE: Drag logic that updates index
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (isAdminModeActive || slides.length <= 1) return;
    
    const swipeDistance = info.offset.x;
    const swipeVelocity = info.velocity.x;

    if (swipeDistance < -SWIPE_THRESHOLD || swipeVelocity < -500) {
      handleNext();
    } else if (swipeDistance > SWIPE_THRESHOLD || swipeVelocity > 500) {
      handlePrev();
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev); 
    }
  };

  const triggerImageUpdate = useCallback((id: number) => {
    setActiveEditingSlideId(id);
    fileUploadInputRef.current?.click();
  }, []);

  const handleFileUploadAction = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || activeEditingSlideId === null) return;
    
    try {
      setIsAssetUploading(true);
      
      if (activeEditingSlideId === -1) {
        // FLOW: NEW SLIDE
        // 1. Upload first
        const uploadedUrl = await uploadHeroImage(-1, file); // Temp ID for upload
        
        // 2. If upload succeeded (didn't throw), create and persist the slide in ONE shot
        setMarketingSlides(prev => {
          const nextId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
          const newFullSlide: CarouselSlide = { 
            id: nextId, 
            src: uploadedUrl, 
            bg: 'bg-stone-200', 
            label: 'Yeni Başlık', 
            sub: 'Açıklama metni buraya gelecek.' 
          };
          const updated = [...prev, newFullSlide];
          persistCarouselData(updated);
          return updated;
        });

        // 3. Move to the end (new slide)
        setCurrentIndex(slides.length);
      } else {
        // FLOW: Update existing slide
        await uploadHeroImage(activeEditingSlideId, file);
      }
    } catch (err) {
      console.error('Image deployment error:', err);
    } finally {
      setIsAssetUploading(false);
      setActiveEditingSlideId(null);
      // Reset input
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className={`${carouselTheme.container} animate-pulse`}>
        <div
          className={`${carouselTheme.layout} bg-stone-100 flex items-center justify-center`}
        >
          <div className={carouselTheme.slide.loadingSpinner} />
        </div>
      </div>
    );
  }

  if (slides.length === 0 && isAdminModeActive) {
    return (
      <div className={carouselTheme.container}>
        <PlusPlaceholder type="CAROUSEL" onClick={handleAddSlideTrigger} />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className={carouselTheme.container}>
      <div className={carouselTheme.layout}>
        {/* STAGED FILMSTRIP: Rasyonele Kesintisiz Kademeli Odak */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="flex w-full h-full touch-pan-y"
          onAnimationComplete={() => setIsTransitioning(false)}
          animate={{
            x: isMobile 
              ? `-${currentIndex * 100}%` 
              : `${20 - (currentIndex * 60)}%`,
          }}
          transition={
            isTransitioning
              ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0 }
          }
        >
          {slides.map((slideItem, index) => {
            const isVisible = index === currentIndex;

            return (
              <div
                key={index}
                className={`relative w-full sm:w-[60%] h-full shrink-0 ${isMobile ? 'px-0' : 'px-2'}`}
              >
                <CarouselSlideUnit
                  slideData={slideItem}
                  isCurrentlyActive={isVisible}
                  isAdmin={isAdminModeActive}
                  isCurrentlyUploading={isAssetUploading}
                  isMobileView={isMobile}
                  editingTargetSlideId={activeEditingSlideId}
                  onImageUpdateTrigger={triggerImageUpdate}
                  onDeleteTrigger={deleteSlide}
                />
              </div>
            );
          })}
        </motion.div>

        {/* NAVIGATION: Panoramic Guard */}
        {slides.length > 1 && (
          <>
            <div
              className={`${carouselTheme.navigation.navBtnStyle} ${carouselTheme.navigation.prevPos} absolute top-1/2 -translate-y-1/2 z-50`}
            >
              <Button
                onClick={handlePrev}
                variant="glass"
                mode="circle"
                className="w-8 h-8 sm:w-14 sm:h-14 !p-0 flex items-center justify-center"
                icon={<div className="w-3 h-3 sm:w-6 sm:h-6">{globalIcons.chevronLeft}</div>}
              />
            </div>
            <div
              className={`${carouselTheme.navigation.navBtnStyle} ${carouselTheme.navigation.nextPos} absolute top-1/2 -translate-y-1/2 z-50`}
            >
              <Button
                onClick={handleNext}
                variant="glass"
                mode="circle"
                className="w-8 h-8 sm:w-14 sm:h-14 !p-0 flex items-center justify-center"
                icon={<div className="w-3 h-3 sm:w-6 sm:h-6">{globalIcons.chevronRight}</div>}
              />
            </div>
          </>
        )}

        {/* PAGINATION: Circular Insight */}
        {slides.length > 1 && (
          <div className={carouselTheme.navigation.dotsWrapper}>
            {slides.map((_, dotIndex) => {
              const isActive = currentIndex === dotIndex;
              return (
                <div
                  key={dotIndex}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(dotIndex);
                  }}
                  className={`
                    ${carouselTheme.navigation.dotBase} 
                    ${isActive ? carouselTheme.navigation.dotActive : carouselTheme.navigation.dotInactive}
                  `}
                />
              );
            })}
          </div>
        )}

        {/* GLOBAL ADD BUTTON (Admin Only) */}
        {isAdminModeActive && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[60]">
            <Button
              onClick={handleAddSlideTrigger}
              variant="glass"
              mode="circle"
              className="w-11 h-11 sm:w-12 sm:h-12 !bg-stone-900/80 !backdrop-blur-md border-2 border-white/10 shadow-none"
              icon={<div className="w-5 h-5 sm:w-5 sm:h-5 text-white">{globalIcons.plus}</div>}
              title="YENİ AFİŞ EKLE"
            />
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
