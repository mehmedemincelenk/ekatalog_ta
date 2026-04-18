import { useEffect, useRef } from 'react';

/**
 * HOOK: useClickOutside
 * -----------------------------------------------------------
 * Triggers a callback when a click/pointer event occurs outside the referenced element.
 * Perfect for Modals, Dropdowns, and Menus.
 */
export function useClickOutside(
  handler: () => void,
  enabled: boolean = true
) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [handler, enabled]);

  return containerRef;
}
