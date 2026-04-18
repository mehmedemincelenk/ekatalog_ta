import { useState, useCallback } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

/**
 * HOOK: useSwipe
 * -----------------------------------------------------------
 * Generic touch gesture hook for detecting left and right swipes.
 * Decouples touch mathematics from component logic.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: SwipeOptions) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSignificant = Math.abs(distance) > threshold;

    if (isSignificant) {
      if (distance > 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (distance < 0 && onSwipeRight) {
        onSwipeRight();
      }
    }

    // Reset coordinates for next gesture
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
}
