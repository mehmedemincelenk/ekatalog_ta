import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
      const visualFileName = `hero-${activeStoreSlug}-${slideId}-${Date.now()}.jpg`;
      const storagePath = `${TECH.storage.heroFolder}/${visualFileName}`;
      const { error } = await supabase.storage.from(TECH.storage.bucket).upload(storagePath, optimizedVisual, { upsert: true, cacheControl: TECH.storage.cacheControl });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(TECH.storage.bucket).getPublicUrl(storagePath);
      const finalizedUrl = `${publicUrl}?t=${Date.now()}`;
      await modifySlideContent(slideId, { src: finalizedUrl });
      return finalizedUrl;
    } catch (err) { console.error('Hero upload failed:', err); throw err; }
  }, [activeStoreSlug, modifySlideContent]);

  const addSlide = useCallback(async () => {
    setMarketingSlides((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      const newSlide: CarouselSlide = { id: nextId, src: '', bg: 'bg-stone-200', label: 'Yeni Başlık', sub: 'Açıklama metni buraya gelecek.' };
      const updated = [...prev, newSlide];
      persistCarouselData(updated);
      return updated;
    });
  }, [persistCarouselData]);

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

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAssetUploading, setIsAssetUploading] = useState(false);
  const [activeEditingSlideId, setActiveEditingSlideId] = useState<
    number | null
  >(null);
  const [isAddingNewSlide, setIsAddingNewSlide] = useState(false);
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

  // RATIONAL CLONING: Buffer for seamless wrap-around (Memoized)
  const extendedSlides = useMemo(() => {
    if (slides.length === 0) return [];
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  const handleNext = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [slides.length]);

  const handleTransitionEnd = useCallback(() => {
    if (currentIndex >= slides.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(slides.length);
    }
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (isAdminModeActive || isAssetUploading || slides.length <= 1) return;
    const scrollTimer = setInterval(handleNext, INTERVAL_MS);
    return () => clearInterval(scrollTimer);
  }, [handleNext, isAdminModeActive, isAssetUploading, slides.length]);

  const handleAddSlideTrigger = useCallback(async () => {
    await addSlide();
    setIsAddingNewSlide(true);
    setCurrentIndex(slides.length + 1);
  }, [addSlide, slides.length]);

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
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (isAdminModeActive || slides.length <= 1) return;
    if (info.offset.x < -SWIPE_THRESHOLD) handleNext();
    else if (info.offset.x > SWIPE_THRESHOLD) handlePrev();
  };

  const handleFileUploadAction = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
          drag={!isAdminModeActive && slides.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className={`flex w-full h-full gap-4 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : 'transition-none'}`}
          onTransitionEnd={handleTransitionEnd}
          style={{
            // Layout Engine: Dynamically responsive offset math
            transform: isMobile
              ? `translateX(-${currentIndex * 100}%)`
              : `translateX(calc(20% - ${currentIndex * 60}% - ${currentIndex * 16}px))`,
          }}
        >
          {extendedSlides.map((slideItem, index) => {
            const isVisible = index === currentIndex;

            return (
              <div
                key={`${slideItem.id}-${index}`}
                className="relative w-full sm:w-[60%] h-full shrink-0"
              >
                <CarouselSlideUnit
                  slideData={slideItem}
                  isAdmin={isAdminModeActive}
                  isCurrentlyActive={isVisible}
                  isCurrentlyUploading={isAssetUploading}
                  editingTargetSlideId={activeEditingSlideId}
                  onImageUpdateTrigger={(id) => {
                    setIsAddingNewSlide(false);
                    setActiveEditingSlideId(id);
                    fileUploadInputRef.current?.click();
                  }}
                  onDeleteTrigger={deleteSlide}
                  onAddTrigger={handleAddSlideTrigger}
                  onReorderTrigger={reorderSlides}
                  currentIndex={index % (slides.length || 1) || slides.length}
                  totalSlides={slides.length}
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
                size="md"
                icon={globalIcons.chevronLeft}
              />
            </div>
            <div
              className={`${carouselTheme.navigation.navBtnStyle} ${carouselTheme.navigation.nextPos} absolute top-1/2 -translate-y-1/2 z-50`}
            >
              <Button
                onClick={handleNext}
                variant="glass"
                size="md"
                icon={globalIcons.chevronRight}
              />
            </div>
          </>
        )}

        {/* PAGINATION: Circular Insight */}
        {slides.length > 1 && (
          <div className={carouselTheme.navigation.dotsWrapper}>
            {slides.map((_, dotIndex) => {
              const isActive =
                (currentIndex - 1 + slides.length) % slides.length === dotIndex;
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
