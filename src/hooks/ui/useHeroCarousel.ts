import { useState, useCallback, useEffect } from 'react';
import { TECH } from '../../data/config';

/**
 * useHeroCarousel: Logic hook for carousel navigation and interactions.
 * Handles indexing, auto-rotation, and touch-based swiping.
 */
export function useHeroCarousel(slidesCount: number, isDisabled: boolean = false) {
  const [currentlyActiveSlideIndex, setCurrentlyActiveSlideIndex] = useState(0);
  const [swipeTouchStart, setSwipeTouchStart] = useState(0);
  const [swipeTouchEnd, setSwipeTouchEnd] = useState(0);

  const navigateToNextSlide = useCallback(() => {
    if (slidesCount === 0) return;
    setCurrentlyActiveSlideIndex((previousIndex) => (previousIndex + 1) % slidesCount);
  }, [slidesCount]);

  const navigateToPreviousSlide = useCallback(() => {
    if (slidesCount === 0) return;
    setCurrentlyActiveSlideIndex((previousIndex) => (previousIndex - 1 + slidesCount) % slidesCount);
  }, [slidesCount]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    setSwipeTouchStart(event.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    setSwipeTouchEnd(event.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!swipeTouchStart || !swipeTouchEnd) return;
    const distanceSwiped = swipeTouchStart - swipeTouchEnd;
    
    if (distanceSwiped > TECH.carousel.swipeThreshold) navigateToNextSlide();
    if (distanceSwiped < -TECH.carousel.swipeThreshold) navigateToPreviousSlide();
    
    setSwipeTouchStart(0); 
    setSwipeTouchEnd(0);
  }, [swipeTouchStart, swipeTouchEnd, navigateToNextSlide, navigateToPreviousSlide]);

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
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}
