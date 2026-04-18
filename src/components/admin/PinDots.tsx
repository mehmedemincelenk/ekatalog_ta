import { memo } from 'react';
import { THEME } from '../../data/config';

interface PinDotsProps {
  currentLength: number;
  hasError: boolean;
  isLocked: boolean;
}

/**
 * PIN DOTS
 * -----------------------------------------------------------
 * Visual indicators for PIN entry progress.
 */
const PinDots = memo(({ currentLength, hasError, isLocked }: PinDotsProps) => {
  const theme = THEME.pinModal;

  return (
    <div className={theme.dotsWrapper}>
      {[0, 1, 2, 3].map(index => (
        <div 
          key={index}
          className={`
            ${theme.dotBase} 
            ${currentLength > index ? theme.dotActive : theme.dotInactive} 
            ${hasError || isLocked ? theme.dotError : ''}
          `}
        />
      ))}
    </div>
  );
});

export default PinDots;
