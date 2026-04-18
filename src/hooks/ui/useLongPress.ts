import { useCallback, useRef } from 'react';

interface LongPressOptions {
  threshold?: number;      // Duration to trigger (ms)
  haptic?: boolean;         // Subtle vibration on success
  sequenceMode?: boolean;   // Requires a previous tap (Tap then Hold)
  sequenceGap?: number;     // Allowed time between tap and hold (ms)
}

/**
 * useLongPress: Pro-grade gesture hook.
 * Optimized to use Pointer Events to prevent touch/mouse conflicts.
 */
export function useLongPress(callback: () => void, options: LongPressOptions = {}) {
  const { 
    threshold = 600, 
    haptic = true, 
    sequenceMode = false,
    sequenceGap = 1000 
  } = options;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isWaitingForHold = useRef(false);

  const triggerHaptic = useCallback(() => {
    if (haptic && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, [haptic]);

  const start = useCallback(() => {
    // Prevent default only for long press logic, but keep it light
    if (sequenceMode && !isWaitingForHold.current) {
      isWaitingForHold.current = true;
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = setTimeout(() => {
        isWaitingForHold.current = false;
      }, sequenceGap);
      return;
    }

    if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    
    timerRef.current = setTimeout(() => {
      triggerHaptic();
      callback();
      isWaitingForHold.current = false;
    }, threshold);
  }, [callback, threshold, triggerHaptic, sequenceMode, sequenceGap]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    // Note: Touch events omitted in favor of unified Pointer Events to prevent bubbling conflicts
  };
}
