import { useState, useEffect, useCallback, useRef } from 'react';
import { THEME, LABELS } from '../data/config';

/**
 * PIN MODAL COMPONENT (Brute-Force Protected)
 * -----------------------------------------------------------
 * Apple-style secure entry interface with progressive lockout logic.
 */

interface PinModalProps {
  isModalOpen: boolean;
  authorizedPinCode: string;
  onAuthenticationSuccess: () => void;
  onModalClose: () => void;
}

export default function PinModal({ 
  isModalOpen, 
  authorizedPinCode, 
  onAuthenticationSuccess, 
  onModalClose 
}: PinModalProps) {
  const [currentPinAttempt, setCurrentPinAttempt] = useState('');
  const [hasAuthError, setHasAuthError] = useState(false);
  
  // SECURITY STATE
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const theme = THEME.pinModal;
  const globalIcons = THEME.icons;

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
  const processPinEntry = useCallback((pin: string) => {
    if (pin === authorizedPinCode) {
      onAuthenticationSuccess();
      setCurrentPinAttempt('');
      setFailedAttempts(0);
    } else {
      const newFailedCount = failedAttempts + 1;
      setFailedAttempts(newFailedCount);
      setHasAuthError(true);

      // LOCKOUT LOGIC:
      // 3 failed tries = 30s lockout
      // 5+ failed tries = 5min lockout
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
  }, [authorizedPinCode, onAuthenticationSuccess, failedAttempts]);

  const handleDigitEntry = useCallback((digit: string) => {
    if (lockoutTimeLeft > 0) return;
    if (currentPinAttempt.length < 4 && !hasAuthError) {
      const nextPin = currentPinAttempt + digit;
      setCurrentPinAttempt(nextPin);
      
      if (nextPin.length === 4) {
        processPinEntry(nextPin);
      }
    }
  }, [currentPinAttempt, hasAuthError, lockoutTimeLeft, processPinEntry]);

  const handleDeleteDigit = useCallback(() => {
    if (lockoutTimeLeft > 0) return;
    if (!hasAuthError) {
      setCurrentPinAttempt(previousPin => previousPin.slice(0, -1));
    }
  }, [hasAuthError, lockoutTimeLeft]);

  if (!isModalOpen) return null;

  return (
    <div className={theme.overlay} role="dialog">
      <div className="absolute inset-0" onClick={onModalClose} />

      <div 
        className={`${theme.container} ${hasAuthError ? theme.animations.shake : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        
        {/* HEADER SECTION */}
        <div className={theme.headerWrapper}>
          <div className={theme.headerIconWrapper}>
            <div className={theme.headerIconSize}>
              {lockoutTimeLeft > 0 ? '⏳' : globalIcons.lock}
            </div>
          </div>
          <h2 className={theme.typography.title}>
            {lockoutTimeLeft > 0 ? 'Güvenlik Kilidi' : 'Giriş Yapın'}
          </h2>
          <p className={theme.typography.subtitle}>
            {lockoutTimeLeft > 0 
              ? `${lockoutTimeLeft} saniye sonra tekrar deneyin` 
              : 'Mağaza yönetim şifrenizi girin'}
          </p>
        </div>

        {/* PIN STATUS INDICATORS */}
        <div className={theme.dotsWrapper}>
          {[0, 1, 2, 3].map(index => (
            <div 
              key={index}
              className={`
                ${theme.dotBase} 
                ${currentPinAttempt.length > index ? theme.dotActive : theme.dotInactive} 
                ${hasAuthError || lockoutTimeLeft > 0 ? theme.dotError : ''}
              `}
            />
          ))}
        </div>

        {/* SECURE NUMBER PAD */}
        <div className={`transition-opacity duration-300 ${lockoutTimeLeft > 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <div className={theme.keyboardGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
              <button key={number} onClick={() => handleDigitEntry(String(number))} className={theme.keyButton}>
                <span className={theme.typography.keyText}>{number}</span>
              </button>
            ))}
            
            <button onClick={onModalClose} className={theme.cancelButton}>
              {LABELS.pinModal.cancelLabel}
            </button>

            <button onClick={() => handleDigitEntry('0')} className={theme.keyButton}>
              <span className={theme.typography.keyText}>0</span>
            </button>

            <button onClick={handleDeleteDigit} className={theme.deleteButton}>
              <div className={theme.deleteIconSize}>{globalIcons.backspace}</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
