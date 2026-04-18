import { THEME } from '../../data/config';
import { usePinAuth } from '../../hooks/auth/usePinAuth';
import PinDots from './PinDots';
import PinKeypad from './PinKeypad';
import ModalBase from '../ui/ModalBase';

/**
 * PIN MODAL COMPONENT (UI Layer)
 * -----------------------------------------------------------
 * Uses ModalBase for consistent overlay behavior.
 * Now supports server-side verification with loading states.
 */

interface PinModalProps {
  onAuthenticationSuccess: () => void;
  onModalClose: () => void;
}

export default function PinModal({ 
  onAuthenticationSuccess, 
  onModalClose 
}: PinModalProps) {
  const {
    currentPinAttempt,
    hasAuthError,
    lockoutTimeLeft,
    isVerifying,
    enterDigit,
    deleteDigit
  } = usePinAuth(onAuthenticationSuccess);

  const theme = THEME.pinModal;
  const globalIcons = THEME.icons;

  return (
    <ModalBase 
      onClose={onModalClose} 
      className={`${hasAuthError ? theme.animations.shake : ''} ${theme.modalBaseOverride}`}
      overlayClass="!backdrop-blur-xl"
    >
      <div className={`flex flex-col items-center select-none w-full transition-opacity duration-300 ${isVerifying ? 'opacity-50' : 'opacity-100'}`}>
        {/* HEADER SECTION */}
        <div className={theme.headerWrapper}>
          <div className={theme.headerIconWrapper}>
            <div className={theme.headerIconSize}>
              {isVerifying ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                lockoutTimeLeft > 0 ? '⏳' : globalIcons.lock
              )}
            </div>
          </div>
          <h2 className={theme.typography.title}>
            {isVerifying ? 'Doğrulanıyor...' : (lockoutTimeLeft > 0 ? 'Güvenlik Kilidi' : 'Giriş Yapın')}
          </h2>
          <p className={theme.typography.subtitle}>
            {lockoutTimeLeft > 0 
              ? `${lockoutTimeLeft} saniye sonra tekrar deneyin` 
              : 'Mağaza yönetim şifrenizi girin'}
          </p>
        </div>

        {/* PIN INDICATORS */}
        <PinDots 
          currentLength={currentPinAttempt.length} 
          hasError={hasAuthError} 
          isLocked={lockoutTimeLeft > 0 || isVerifying} 
        />

        {/* SECURE KEYPAD */}
        <PinKeypad 
          onDigit={enterDigit} 
          onDelete={deleteDigit} 
          onCancel={onModalClose} 
          isLocked={lockoutTimeLeft > 0 || isVerifying} 
        />
      </div>
    </ModalBase>
  );
}
