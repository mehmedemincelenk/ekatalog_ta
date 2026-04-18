import { THEME } from '../../../../data/config';
import { useCarousel, type Slide } from '../../../../hooks/catalog/useCarousel';
import { useHeroCarousel } from '../../../../hooks/ui/useHeroCarousel';
import Button from '../../../ui/Button';
import CarouselSlideUnit from './CarouselSlideUnit';
import CarouselNavigation from './CarouselNavigation';
import CarouselIndicators from './CarouselIndicators';
import CarouselEmptyState from './CarouselEmptyState';
import ImageActionWrapper from '../../../admin/ImageActionWrapper';

/**
 * HERO CAROUSEL (Coordinator)
 * -----------------------------------------------------------
 * Final Modular State. Minimal logic, maximum composition.
 */
export default function HeroCarousel({ isAdminModeActive }: { isAdminModeActive: boolean }) {
  const { 
    slides, uploadHeroImage, addSlide, loading, isUploading, activeUploadId 
  } = useCarousel(isAdminModeActive);

  const {
    currentlyActiveSlideIndex,
    setCurrentlyActiveSlideIndex,
    navigateToNextSlide,
    navigateToPreviousSlide,
    touchHandlers
  } = useHeroCarousel(slides.length, isAdminModeActive || isUploading);

  const theme = THEME.heroCarousel;

  if (loading && slides.length === 0) return null;

  // --- VIEW 1: Empty State ---
  if (slides.length === 0 && isAdminModeActive) {
    return <CarouselEmptyState onAdd={addSlide} isUploading={isUploading} />;
  }

  // --- VIEW 2: Standard Carousel ---
  return (
    <div className={`${theme.layout} ${theme.container}`}>
      
      {/* ADMIN: ADD SLIDE BUTTON */}
      {isAdminModeActive && (
        <div className="absolute top-4 left-4 z-[100]">
          <ImageActionWrapper 
            isAdmin={true} 
            isUploading={isUploading && activeUploadId === null} 
            onFileSelect={addSlide}
            className="w-10 h-10"
          >
            <Button 
              icon={THEME.icons.plus}
              variant="glass"
              size="sm"
              className="!rounded-full shadow-2xl bg-white/90 w-full h-full"
            />
          </ImageActionWrapper>
        </div>
      )}

      <div 
        className={`relative w-full h-full overflow-hidden ${THEME.radius.carousel}`} 
        {...touchHandlers}
      >
        {/* SLIDE DEPLOYMENT */}
        {slides.map((slide: Slide, index: number) => (
          <CarouselSlideUnit 
            key={slide.id} 
            slideData={slide} 
            isCurrentlyActive={index === currentlyActiveSlideIndex} 
            isAdmin={isAdminModeActive} 
            isCurrentlyUploading={isUploading} 
            editingTargetSlideId={activeUploadId} 
            onImageUpdateTrigger={uploadHeroImage} 
          />
        ))}

        {/* INTERACTIVE OVERLAYS */}
        {!isAdminModeActive && slides.length > 1 && (
          <CarouselNavigation onPrev={navigateToPreviousSlide} onNext={navigateToNextSlide} />
        )}

        {slides.length > 1 && (
          <CarouselIndicators 
            slidesCount={slides.length} 
            currentIndex={currentlyActiveSlideIndex} 
            onDotClick={setCurrentlyActiveSlideIndex} 
          />
        )}
      </div>
    </div>
  );
}

