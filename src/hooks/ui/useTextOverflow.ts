import { useState, useEffect, RefObject } from 'react';

/**
 * HOOK: useTextOverflow
 * -----------------------------------------------------------
 * Detects if a text element's content exceeds its visible container width.
 * Uses ResizeObserver for real-time tracking of layout changes.
 */
export function useTextOverflow(
  ref: RefObject<HTMLElement>,
  dependency: any // Usually the text content itself
) {
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkOverflow = () => {
      // 2px threshold to account for sub-pixel rendering fluctuations
      setHasOverflow(element.scrollWidth > element.clientWidth + 2);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, dependency]);

  return hasOverflow;
}
