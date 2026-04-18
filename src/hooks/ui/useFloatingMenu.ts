import { useState, useEffect, useRef, useCallback } from 'react';
import { useClickOutside } from './useClickOutside';

/**
 * useFloatingMenu: Logic hook for expandable floating menus.
 * Handles auto-close on inactivity and click-outside detection.
 * Refactored to use useClickOutside for cleaner logic.
 */
export function useFloatingMenu() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuExpanded(false);
  }, []);

  const toggleMenu = useCallback(() => {
    clearAutoCloseTimer();
    setIsMenuExpanded(prev => !prev);
  }, [clearAutoCloseTimer]);

  // Handle outside clicks using dedicated hook
  const menuContainerRef = useClickOutside(closeMenu, isMenuExpanded);

  // Handle auto-close timer logic
  useEffect(() => {
    if (isMenuExpanded) {
      clearAutoCloseTimer();
      // Auto-close after 3 seconds of inactivity (Apple-style polish)
      autoCloseTimerRef.current = setTimeout(() => closeMenu(), 3000);
    } else {
      clearAutoCloseTimer();
    }

    return () => clearAutoCloseTimer();
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
