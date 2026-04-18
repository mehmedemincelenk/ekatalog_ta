import { useState, useCallback, useRef, useEffect } from 'react';
import { TECH, STORAGE } from '../../data/config';
import { supabase } from '../../lib/supabase';
import { getActiveStoreSlug } from '../../utils/helpers/store';
import { useLongPress } from '../ui/useLongPress';

const STORE_SLUG = getActiveStoreSlug();

/**
 * useAdminMode: Manages the administrative session and hidden access triggers.
 */
export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(STORAGE.adminSession) === TECH.auth.sessionActiveValue;
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [correctPin, setCorrectPin] = useState('');
  const timeoutTimer = useRef<NodeJS.Timeout | null>(null);

  // 1. PIN PRELOAD
  useEffect(() => {
    if (STORE_SLUG === 'main-site') return;
    async function preload() {
      try {
        const { data } = await supabase.from('stores').select('admin_pin').eq('slug', STORE_SLUG).single();
        if (data?.admin_pin) setCorrectPin(data.admin_pin);
      } catch (e) {
        console.error("PIN preload error:", e);
      }
    }
    preload();
  }, []);

  // 2. LOGOUT & TIMEOUT
  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem(STORAGE.adminSession);
    if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
  }, []);

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

  // 3. SECURE TRIGGER: Tap then Hold on Logo
  const logoGestureActions = useLongPress(() => {
    if (!isAdmin) setIsPinModalOpen(true);
  }, { 
    sequenceMode: true, 
    threshold: 1000, 
    haptic: true 
  });

  const onPinSuccess = useCallback(() => {
    setIsAdmin(true);
    sessionStorage.setItem(STORAGE.adminSession, TECH.auth.sessionActiveValue);
    setIsPinModalOpen(false);
  }, []);

  return { 
    isAdmin, 
    logoGestureActions,
    logout, 
    isPinModalOpen, 
    setIsPinModalOpen, 
    correctPin, 
    onPinSuccess 
  };
}
