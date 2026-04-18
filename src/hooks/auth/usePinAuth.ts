import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * usePinAuth: Logic hook for PIN-based authentication.
 * Handles digit entry, backspacing, brute-force protection, and lockout timers.
 */
export function usePinAuth(authorizedPinCode: string, onSuccess: () => void) {
  const [currentPinAttempt, setCurrentPinAttempt] = useState('');
  const [hasAuthError, setHasAuthError] = useState(false);
  
  // SECURITY STATE
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Process PIN Verification
  const verifyPin = useCallback((pin: string) => {
    if (pin === authorizedPinCode) {
      onSuccess();
      setCurrentPinAttempt('');
      setFailedAttempts(0);
    } else {
      const newFailedCount = failedAttempts + 1;
      setFailedAttempts(newFailedCount);
      setHasAuthError(true);

      // LOCKOUT LOGIC:
      if (newFailedCount >= 5) {
        setLockoutTimeLeft(300); // 5 minutes
      } else if (newFailedCount >= 3) {
        setLockoutTimeLeft(30); // 30 seconds
      }

      setTimeout(() => {
        setHasAuthError(false);
        setCurrentPinAttempt('');
      }, 500);
    }
  }, [authorizedPinCode, onSuccess, failedAttempts]);

  const enterDigit = useCallback((digit: string) => {
    if (lockoutTimeLeft > 0) return;
    if (currentPinAttempt.length < 4 && !hasAuthError) {
      const nextPin = currentPinAttempt + digit;
      setCurrentPinAttempt(nextPin);
      
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  }, [currentPinAttempt, hasAuthError, lockoutTimeLeft, verifyPin]);

  const deleteDigit = useCallback(() => {
    if (lockoutTimeLeft > 0) return;
    if (!hasAuthError) {
      setCurrentPinAttempt(previousPin => previousPin.slice(0, -1));
    }
  }, [hasAuthError, lockoutTimeLeft]);

  const resetAuth = useCallback(() => {
    setCurrentPinAttempt('');
    setHasAuthError(false);
  }, []);

  return {
    currentPinAttempt,
    hasAuthError,
    lockoutTimeLeft,
    enterDigit,
    deleteDigit,
    resetAuth
  };
}
