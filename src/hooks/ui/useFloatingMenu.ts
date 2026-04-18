import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useFloatingMenu: Logic hook for expandable floating menus.
 * Handles auto-close on inactivity and click-outside detection.
 */
export function useFloatingMenu() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const toggleMenu = useCallback(() => {
    clearAutoCloseTimer();
    setIsMenuExpanded(prev => !prev);
  }, [clearAutoCloseTimer]);

  const closeMenu = useCallback(() => {
    setIsMenuExpanded(false);
  }, []);

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuExpanded) {
      document.addEventListener('pointerdown', handlePointerDownOutside);
      clearAutoCloseTimer();
      // Auto-close after 3 seconds of inactivity
      autoCloseTimerRef.current = setTimeout(() => closeMenu(), 3000);
    } else {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      clearAutoCloseTimer();
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      clearAutoCloseTimer();
    };
  }, [isMenuExpanded, clearAutoCloseTimer, closeMenu]);

  const wrapAction = useCallback((actionCallback: () => void) => {
    clearAutoCloseTimer();
    actionCallback();
    closeMenu();
  }, [clearAutoCloseTimer, closeMenu]);

  return {
    isMenuExpanded,
    menuContainerRef,
    toggleMenu,
    closeMenu,
    wrapAction
  };
}
