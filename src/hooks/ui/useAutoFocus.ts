import { useEffect, useRef } from 'react';

/**
 * HOOK: useAutoFocus
 * -----------------------------------------------------------
 * Automatically focuses the referenced element after a short delay.
 * Ideal for modals and dynamic forms.
 */
export function useAutoFocus<T extends HTMLInputElement | HTMLTextAreaElement>(delay: number = 100) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return ref;
}
