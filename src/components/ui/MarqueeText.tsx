import { useRef, memo } from 'react';
import { THEME } from '../../data/config';
import { useTextOverflow } from '../../hooks/ui/useTextOverflow';

interface MarqueeTextProps {
  text: string;
  textClass: string;
  isAdmin: boolean;
  editableProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * MARQUEE TEXT COMPONENT
 * -----------------------------------------------------------
 * Handles overflow text with a sliding animation for customers, 
 * while keeping it editable for admins. 
 * Refactored: Logic is extracted to useTextOverflow hook.
 */
export const MarqueeText = memo(({ 
  text, 
  textClass, 
  isAdmin, 
  editableProps = {} 
}: MarqueeTextProps) => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  // Logical separation: Only UI concerns remain here
  const hasTextOverflow = useTextOverflow(textContainerRef as React.RefObject<HTMLElement>, text);
  
  const { className: extraEditableClassName = '', ...remainingEditableProps } = editableProps;
  const marqueeTheme = THEME.typography.marquee;

  return (
    <div 
      ref={textContainerRef} 
      className={`
        ${isAdmin ? marqueeTheme.adminMode : marqueeTheme.container} 
        ${textClass} 
        ${extraEditableClassName}
      `} 
      {...remainingEditableProps}
    >
      {/* ANIMATED TRACK: Only active when text overflows and not in admin mode */}
      {hasTextOverflow && !isAdmin ? (
        <span className={marqueeTheme.track}>
          {text}&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;
        </span>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
});
