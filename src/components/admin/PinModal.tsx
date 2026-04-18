import { THEME } from '../../data/config';
import { usePinAuth } from '../../hooks/auth/usePinAuth';
import PinDots from './PinDots';
import PinKeypad from './PinKeypad';
import ModalBase from '../ui/ModalBase';

/**
 * PIN MODAL COMPONENT (UI Layer)
 * -----------------------------------------------------------
 * Uses ModalBase for consistent overlay behavior.
 * Logic is delegated to the usePinAuth hook.
 */

interface PinModalProps {
  authorizedPinCode: string;
  onAuthenticationSuccess: () => void;
  onModalClose: () => void;
}

export default function PinModal({ 
  authorizedPinCode, 
  onAuthenticationSuccess, 
  onModalClose 
}: PinModalProps) {
  const {
    currentPinAttempt,
    hasAuthError,
    lockoutTimeLeft,
    enterDigit,
    deleteDigit
  } = usePinAuth(authorizedPinCode, onAuthenticationSuccess);

  const theme = THEME.pinModal;
  const globalIcons = THEME.icons;

  return (
    <ModalBase 
      onClose={onModalClose} 
      className={`${hasAuthError ? theme.animations.shake : ''} ${theme.modalBaseOverride}`}
      overlayClass="!backdrop-blur-xl"
    >
      <div className="flex flex-col items-center select-none w-full">
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

        {/* PIN INDICATORS */}
        <PinDots 
          currentLength={currentPinAttempt.length} 
          hasError={hasAuthError} 
          isLocked={lockoutTimeLeft > 0} 
        />

        {/* SECURE KEYPAD */}
        <PinKeypad 
          onDigit={enterDigit} 
          onDelete={deleteDigit} 
          onCancel={onModalClose} 
          isLocked={lockoutTimeLeft > 0} 
        />
      </div>
    </ModalBase>
  );
}
