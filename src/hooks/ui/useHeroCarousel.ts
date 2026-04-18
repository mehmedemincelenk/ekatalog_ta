import { useState, useCallback, useEffect } from 'react';
import { TECH } from '../../data/config';
import { useSwipe } from './useSwipe';

/**
 * useHeroCarousel: Logic hook for carousel navigation.
 * Now delegates touch mathematics to useSwipe hook.
 */
export function useHeroCarousel(slidesCount: number, isDisabled: boolean = false) {
  const [currentlyActiveSlideIndex, setCurrentlyActiveSlideIndex] = useState(0);

  const navigateToNextSlide = useCallback(() => {
    if (slidesCount === 0) return;
    setCurrentlyActiveSlideIndex((previousIndex) => (previousIndex + 1) % slidesCount);
  }, [slidesCount]);

  const navigateToPreviousSlide = useCallback(() => {
    if (slidesCount === 0) return;
    setCurrentlyActiveSlideIndex((previousIndex) => (previousIndex - 1 + slidesCount) % slidesCount);
  }, [slidesCount]);

  // Decoupled touch management
  const touchHandlers = useSwipe({
    onSwipeLeft: navigateToNextSlide,
    onSwipeRight: navigateToPreviousSlide,
    threshold: TECH.carousel.swipeThreshold
  });

  // Automatic slide rotation
  useEffect(() => {
    if (isDisabled || slidesCount <= 1) return;
    const rotationInterval = setInterval(navigateToNextSlide, TECH.carousel.intervalMs);
    return () => clearInterval(rotationInterval);
  }, [navigateToNextSlide, isDisabled, slidesCount]);

  return {
    currentlyActiveSlideIndex,
    setCurrentlyActiveSlideIndex,
    navigateToNextSlide,
    navigateToPreviousSlide,
    touchHandlers
  };
}
