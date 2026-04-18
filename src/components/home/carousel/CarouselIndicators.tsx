import { memo } from 'react';
import { THEME, LABELS } from '../../../data/config';

interface CarouselIndicatorsProps {
  slidesCount: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

/**
 * CAROUSEL INDICATORS
 * -----------------------------------------------------------
 * Renders the pagination dots to track current slide position.
 */
const CarouselIndicators = memo(({ slidesCount, currentIndex, onDotClick }: CarouselIndicatorsProps) => {
  const theme = THEME.heroCarousel;

  return (
    <div className={theme.navigation.dotsWrapper}>
      {Array.from({ length: slidesCount }).map((_, dotIndex) => (
        <button 
          key={dotIndex} 
          onClick={() => onDotClick(dotIndex)} 
          className={`
            ${theme.navigation.dotBase} 
            ${dotIndex === currentIndex ? theme.navigation.dotActive : theme.navigation.dotInactive}
          `} 
          aria-label={LABELS.carousel.dotAria(dotIndex)}
        />
      ))}
    </div>
  );
});

export default CarouselIndicators;

