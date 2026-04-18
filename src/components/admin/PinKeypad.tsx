import { memo } from 'react';
import { THEME, LABELS } from '../../data/config';

interface PinKeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  isLocked: boolean;
}

/**
 * PIN KEYPAD
 * -----------------------------------------------------------
 * Secure number pad for PIN entry.
 */
const PinKeypad = memo(({ onDigit, onDelete, onCancel, isLocked }: PinKeypadProps) => {
  const theme = THEME.pinModal;
  const globalIcons = THEME.icons;

  return (
    <div className={`transition-opacity duration-300 ${isLocked ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
      <div className={theme.keyboardGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <button key={number} onClick={() => onDigit(String(number))} className={theme.keyButton}>
            <span className={theme.typography.keyText}>{number}</span>
          </button>
        ))}
        
        <button onClick={onCancel} className={theme.cancelButton}>
          {LABELS.pinModal.cancelLabel}
        </button>

        <button onClick={() => onDigit('0')} className={theme.keyButton}>
          <span className={theme.typography.keyText}>0</span>
        </button>

        <button onClick={onDelete} className={theme.deleteButton}>
          <div className={theme.deleteIconSize}>{globalIcons.backspace}</div>
        </button>
      </div>
    </div>
  );
});

export default PinKeypad;
