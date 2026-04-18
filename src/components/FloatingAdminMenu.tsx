import { useState, useEffect, useRef, useCallback } from 'react';
import { THEME } from '../data/config';
import Button from './Button';

/**
 * FLOATING ADMIN MENU COMPONENT (100% Tokenized & Professional English)
 * -----------------------------------------------------------
 * AssistiveTouch-style management hub. Fully managed via central THEME.
 */

interface FloatingAdminMenuProps {
  onProductAddTrigger: () => void;
  onBulkUpdateTrigger?: () => void;
  isInlineEnabled: boolean;
  onToggleInline: () => void;
  onSettingsTrigger: () => void;
}

export default function FloatingAdminMenu({ 
  onProductAddTrigger,
  onBulkUpdateTrigger,
  isInlineEnabled,
  onToggleInline,
  onSettingsTrigger
}: FloatingAdminMenuProps) {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const menuTheme = THEME.floatingAdminMenu;
  const globalIcons = THEME.icons;

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setIsMenuExpanded(false);
      }
    };

    if (isMenuExpanded) {
      document.addEventListener('pointerdown', handlePointerDownOutside);
      clearAutoCloseTimer();
      // Auto-close after 3 seconds of inactivity
      autoCloseTimerRef.current = setTimeout(() => setIsMenuExpanded(false), 3000);
    } else {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      clearAutoCloseTimer();
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      clearAutoCloseTimer();
    };
  }, [isMenuExpanded, clearAutoCloseTimer]);

  const handleManagementAction = (actionCallback: () => void) => {
    clearAutoCloseTimer();
    actionCallback();
    setIsMenuExpanded(false);
  };

  return (
    <div className={menuTheme.wrapper} ref={menuContainerRef}>
      <div className={menuTheme.container}>
        
        {/* EXPANDABLE ACTION AREA */}
        <div className={`
          ${menuTheme.innerActions} 
          ${isMenuExpanded ? menuTheme.actionsActive : menuTheme.actionsInactive}
        `}>
          {/* INLINE TOGGLE SWITCH */}
          <Button 
            onClick={() => handleManagementAction(onToggleInline)}
            icon={isInlineEnabled ? "✍️" : "🧩"}
            variant="secondary"
            size="sm"
            mode="circle"
            className={`shrink-0 ${isInlineEnabled ? "!bg-stone-900 !text-white shadow-inner" : ""}`}
            aria-label={isInlineEnabled ? "Deactivate Inline Edit" : "Activate Inline Edit"}
          />

          {onBulkUpdateTrigger && (
            <Button 
              onClick={() => handleManagementAction(onBulkUpdateTrigger)}
              icon="🏷️"
              variant="secondary"
              size="sm"
              mode="circle"
              className="shrink-0"
              aria-label="Bulk Update Prices"
            />
          )}

          <Button 
            onClick={() => handleManagementAction(onProductAddTrigger)}
            icon={globalIcons.plus}
            variant="primary"
            size="sm"
            mode="circle"
            className="shrink-0"
            aria-label="Add New Product"
          />

          <Button 
            onClick={() => handleManagementAction(onSettingsTrigger)}
            icon={globalIcons.settings}
            variant="secondary"
            size="sm"
            mode="circle"
            className="shrink-0"
            aria-label="General Settings"
          />
        </div>

        {/* MAIN TOGGLE CONTROL */}
        <Button 
          onClick={() => { clearAutoCloseTimer(); setIsMenuExpanded(previousState => !previousState); }}
          icon={isMenuExpanded ? globalIcons.close : globalIcons.adminLayout}
          variant={isMenuExpanded ? 'ghost' : 'secondary'}
          size="sm"
          mode="circle"
          className={isMenuExpanded ? menuTheme.toggleActive : menuTheme.toggleInactive}
          aria-label={isMenuExpanded ? "Close Admin Menu" : "Open Admin Menu"}
        />
      </div>
    </div>
  );
}
