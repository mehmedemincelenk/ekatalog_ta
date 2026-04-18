import { useCallback, useRef } from 'react';

interface LongPressOptions {
  threshold?: number;      // Duration to trigger (ms)
  haptic?: boolean;         // Subtle vibration on success
  sequenceMode?: boolean;   // Requires a previous tap (Tap then Hold)
  sequenceGap?: number;     // Allowed time between tap and hold (ms)
}

/**
 * useLongPress: Pro-grade gesture hook.
 * Supports standard long press and advanced "Tap-then-Hold" patterns
 * with integrated haptic feedback.
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
      navigator.vibrate(10); // Apple-style subtle tick
    }
  }, [haptic]);

  const start = useCallback(() => {
    if (sequenceMode && !isWaitingForHold.current) {
      // Step 1: Handle first tap
      isWaitingForHold.current = true;
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = setTimeout(() => {
        isWaitingForHold.current = false;
      }, sequenceGap);
      return;
    }

    // Step 2: Handle the actual hold
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
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
