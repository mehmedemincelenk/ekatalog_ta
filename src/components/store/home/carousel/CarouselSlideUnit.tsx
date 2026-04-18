import { memo } from 'react';
import { THEME } from '../../../../data/config';
import { Slide } from '../../../../hooks/catalog/useCarousel';
import SmartImage from '../../../ui/SmartImage';
import ImageActionWrapper from '../../../admin/ImageActionWrapper';

interface CarouselSlideUnitProps {
  slideData: Slide;
  isCurrentlyActive: boolean;
  isAdmin: boolean;
  isCurrentlyUploading: boolean;
  editingTargetSlideId: number | null;
  onImageUpdateTrigger: (id: number, file: File) => void;
}

/**
 * CAROUSEL SLIDE UNIT
 * -----------------------------------------------------------
 * Renders a single slide using SmartImage and ImageActionWrapper.
 */
const CarouselSlideUnit = memo(({ 
  slideData, isCurrentlyActive, isAdmin, isCurrentlyUploading, editingTargetSlideId, onImageUpdateTrigger
}: CarouselSlideUnitProps) => {
  const carouselTheme = THEME.heroCarousel;
  const isThisSlideUploading = isCurrentlyUploading && editingTargetSlideId === slideData.id;

  return (
    <div className={`
      ${carouselTheme.slide.base} 
      ${isCurrentlyActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'} 
      ${slideData.bg}
    `}>
      <ImageActionWrapper
        isAdmin={isAdmin}
        isUploading={isThisSlideUploading}
        onFileSelect={(file) => onImageUpdateTrigger(slideData.id, file)}
        className="w-full h-full"
      >
        <SmartImage 
          src={slideData.src} 
          alt={slideData.label} 
          isPriority={isCurrentlyActive}
          className={`${carouselTheme.slide.image} ${isThisSlideUploading ? carouselTheme.slide.loadingBlur : ''}`}
          wrapperClass="w-full h-full"
          fallbackSymbol="📸"
        />
      </ImageActionWrapper>
    </div>
  );
});

export default CarouselSlideUnit;

