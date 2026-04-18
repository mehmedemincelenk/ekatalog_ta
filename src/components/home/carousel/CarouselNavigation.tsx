import { memo } from 'react';
import { THEME, LABELS } from '../../../data/config';
import Button from '../../ui/Button';

interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

/**
 * CAROUSEL NAVIGATION
 * -----------------------------------------------------------
 * Renders the interactive arrow buttons for slide transition.
 */
const CarouselNavigation = memo(({ onPrev, onNext }: CarouselNavigationProps) => {
  const theme = THEME.heroCarousel;
  const icons = THEME.icons;

  return (
    <>
      <Button 
        onClick={onPrev} 
        icon={icons.chevronLeft}
        variant="glass"
        size="md"
        className={`${theme.navigation.navBtnStyle} ${theme.navigation.prevPos}`} 
        aria-label={LABELS.carousel.prevAria}
      />
      <Button 
        onClick={onNext} 
        icon={icons.chevronRight}
        variant="glass"
        size="md"
        className={`${theme.navigation.navBtnStyle} ${theme.navigation.nextPos}`} 
        aria-label={LABELS.carousel.nextAria}
      />
    </>
  );
});

export default CarouselNavigation;

