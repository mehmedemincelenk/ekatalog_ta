import { useState, useCallback, useRef, useEffect } from 'react';
import { TECH, STORAGE } from '../data/config';
import { supabase } from '../lib/supabase';
import { getActiveStoreSlug } from '../utils/store';

const STORE_SLUG = getActiveStoreSlug();

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(STORAGE.adminSession) === TECH.auth.sessionActiveValue;
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  
  // UX PREFERENCE: Local state for editing mode (Inline vs Modal)
  const [isInlineEnabled, setIsInlineEnabled] = useState(() => {
    const saved = localStorage.getItem('ekatalog_inline_edit_v1');
    // Default to true (it's the signature 'vibe coding' experience)
    return saved !== null ? saved === 'true' : true;
  });

  const toggleInlineEdit = useCallback(() => {
    setIsInlineEnabled(prev => {
      const newVal = !prev;
      localStorage.setItem('ekatalog_inline_edit_v1', String(newVal));
      return newVal;
    });
  }, []);
  
  // SECURITY: The PIN is verified directly via Supabase query filters
  // to ensure it never leaks to the client-side state.
  const verifyPinWithServer = useCallback(async (pin: string) => {
    if (STORE_SLUG === 'main-site') return false;
    
    const { data, error } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', STORE_SLUG)
      .eq('admin_pin', pin)
      .single();
    
    return !!data && !error;
  }, []);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimer = useRef<NodeJS.Timeout | null>(null);

  // 2. LOGOUT
  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem(STORAGE.adminSession);
    if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
  }, []);

  // 3. TIMEOUT (Session Security)
  const resetTimeout = useCallback(() => {
    if (!isAdmin) return;
    if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    timeoutTimer.current = setTimeout(logout, TECH.auth.timeoutMs);
  }, [isAdmin, logout]);

  useEffect(() => {
    if (!isAdmin) return;
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimeout();
    events.forEach(name => document.addEventListener(name, handleActivity));
    resetTimeout();
    return () => {
      events.forEach(name => document.removeEventListener(name, handleActivity));
      if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    };
  }, [isAdmin, resetTimeout]);

  // 4. TRIGGER: 2 Seconds Long Press for both Login & Logout
  const handleLogoPointerDown = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    
    longPressTimer.current = setTimeout(() => {
      if (isAdmin) {
        logout();
      } else {
        setIsPinModalOpen(true);
      }
    }, 2000); // 2 second hold for a "hidden" feel
  }, [isAdmin, logout]);

  const handleLogoPointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const onPinSuccess = useCallback(() => {
    setIsAdmin(true);
    sessionStorage.setItem(STORAGE.adminSession, TECH.auth.sessionActiveValue);
    setIsPinModalOpen(false);
  }, []);

  return { 
    isAdmin, 
    handleLogoPointerDown, 
    handleLogoPointerUp,
    logout, 
    isPinModalOpen, 
    setIsPinModalOpen, 
    verifyPinWithServer, 
    onPinSuccess,
    isInlineEnabled,
    toggleInlineEdit
  };
}
