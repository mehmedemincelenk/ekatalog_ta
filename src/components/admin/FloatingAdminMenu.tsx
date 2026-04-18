import { THEME } from '../../data/config';
import Button from '../ui/Button';
import { useFloatingMenu } from '../../hooks/ui/useFloatingMenu';

/**
 * FLOATING ADMIN MENU COMPONENT
 * -----------------------------------------------------------
 * AssistiveTouch-style management hub.
 * Icons are centrally managed in THEME.icons for better SRP.
 */

interface FloatingAdminMenuProps {
  onProductAddTrigger: () => void;
  onBulkUpdateTrigger?: () => void;
  editMode: 'modal' | 'inline';
  onToggleEditMode: () => void;
}

export default function FloatingAdminMenu({ 
  onProductAddTrigger,
  onBulkUpdateTrigger,
  editMode,
  onToggleEditMode
}: FloatingAdminMenuProps) {
  const {
    isMenuExpanded,
    menuContainerRef,
    toggleMenu,
    wrapAction
  } = useFloatingMenu();

  const menuTheme = THEME.floatingAdminMenu;
  const icons = THEME.icons;

  return (
    <div className={menuTheme.wrapper} ref={menuContainerRef as React.RefObject<HTMLDivElement>}>
      <div className={menuTheme.container}>
        
        {/* EXPANDABLE ACTION AREA */}
        <div className={`
          ${menuTheme.innerActions} 
          ${isMenuExpanded ? menuTheme.actionsActive : menuTheme.actionsInactive}
        `}>
          
          {/* EDIT MODE TOGGLE */}
          <Button 
            onClick={() => wrapAction(onToggleEditMode)}
            icon={editMode === 'modal' ? icons.editCursor : icons.editWindow}
            variant="secondary"
            size="sm"
            mode="circle"
          />

          {/* BULK UPDATE TRIGGER */}
          {onBulkUpdateTrigger && (
            <Button 
              onClick={() => wrapAction(onBulkUpdateTrigger)}
              icon={icons.priceMove}
              variant="secondary"
              size="sm"
              mode="circle"
              aria-label="Bulk Update Prices"
            />
          )}

          {/* ADD PRODUCT TRIGGER */}
          <Button 
            onClick={() => wrapAction(onProductAddTrigger)}
            icon={icons.plus}
            variant="primary"
            size="sm"
            mode="circle"
            aria-label="Add New Product"
          />
        </div>

        {/* MAIN TOGGLE CONTROL */}
        <Button 
          onClick={toggleMenu}
          icon={isMenuExpanded ? icons.close : icons.adminLayout}
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
