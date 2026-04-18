import { useEffect } from 'react';

/**
 * HOOK: useScrollToClose
 * -----------------------------------------------------------
 * Automatically triggers a callback when the window is scrolled.
 * Useful for closing floating menus or lightboxes.
 */
export function useScrollToClose(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => onClose();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, onClose]);
}
