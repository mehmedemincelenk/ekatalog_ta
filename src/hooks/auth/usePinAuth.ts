import { useState, useEffect, useCallback, useRef } from 'react';
import { getActiveStoreSlug } from '../../utils/helpers/store';
import { verifyStorePin } from '../../utils/helpers/auth';
import { TECH } from '../../data/config';

/**
 * usePinAuth: Logic hook for PIN-based authentication.
 * Handles digit entry, server-side verification, and brute-force protection.
 */
export function usePinAuth(onSuccess: () => void) {
  const [currentPinAttempt, setCurrentPinAttempt] = useState('');
  const [hasAuthError, setHasAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // SECURITY STATE
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const STORE_SLUG = getActiveStoreSlug();
  const { auth } = TECH;

  // Handle Lockout Countdown
  useEffect(() => {
    if (lockoutTimeLeft > 0) {
      lockoutTimerRef.current = setInterval(() => {
        setLockoutTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    }
    return () => { if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current); };
  }, [lockoutTimeLeft]);

  // Process PIN Verification (Server-Side)
  const verifyPin = useCallback(async (pin: string) => {
    setIsVerifying(true);
    
    const isValid = await verifyStorePin(STORE_SLUG, pin);

    if (isValid) {
      onSuccess();
      setCurrentPinAttempt('');
      setFailedAttempts(0);
    } else {
      const newFailedCount = failedAttempts + 1;
      setFailedAttempts(newFailedCount);
      setHasAuthError(true);

      // LOCKOUT LOGIC: Using Tech Config
      if (newFailedCount >= auth.attemptLimitLong) {
        setLockoutTimeLeft(auth.lockoutDurationLong); 
      } else if (newFailedCount >= auth.attemptLimitShort) {
        setLockoutTimeLeft(auth.lockoutDurationShort);
      }

      setTimeout(() => {
        setHasAuthError(false);
        setCurrentPinAttempt('');
      }, 500);
    }
    setIsVerifying(false);
  }, [STORE_SLUG, onSuccess, failedAttempts, auth]);

  const enterDigit = useCallback((digit: string) => {
    if (lockoutTimeLeft > 0 || isVerifying) return;
    
    if (currentPinAttempt.length < auth.pinLength && !hasAuthError) {
      const nextPin = currentPinAttempt + digit;
      setCurrentPinAttempt(nextPin);
      
      if (nextPin.length === auth.pinLength) {
        verifyPin(nextPin);
      }
    }
  }, [currentPinAttempt, hasAuthError, lockoutTimeLeft, isVerifying, verifyPin, auth.pinLength]);

  const deleteDigit = useCallback(() => {
    if (lockoutTimeLeft > 0 || isVerifying) return;
    if (!hasAuthError) {
      setCurrentPinAttempt(previousPin => previousPin.slice(0, -1));
    }
  }, [hasAuthError, lockoutTimeLeft, isVerifying]);

  const resetAuth = useCallback(() => {
    setCurrentPinAttempt('');
    setHasAuthError(false);
  }, []);

  return {
    currentPinAttempt,
    hasAuthError,
    lockoutTimeLeft,
    isVerifying,
    enterDigit,
    deleteDigit,
    resetAuth
  };
}
