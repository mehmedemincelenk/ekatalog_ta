import { THEME } from '../../data/config';
import Button from '../ui/Button';
import { useFloatingMenu } from '../../hooks/ui/useFloatingMenu';

/**
 * FLOATING ADMIN MENU COMPONENT
 * -----------------------------------------------------------
 * AssistiveTouch-style management hub. 
 * Logic is encapsulated in the useFloatingMenu hook.
 */

interface FloatingAdminMenuProps {
  onProductAddTrigger: () => void;
  onBulkUpdateTrigger?: () => void;
}

export default function FloatingAdminMenu({ 
  onProductAddTrigger,
  onBulkUpdateTrigger
}: FloatingAdminMenuProps) {
  const {
    isMenuExpanded,
    menuContainerRef,
    toggleMenu,
    wrapAction
  } = useFloatingMenu();

  const menuTheme = THEME.floatingAdminMenu;
  const globalIcons = THEME.icons;

  return (
    <div className={menuTheme.wrapper} ref={menuContainerRef}>
      <div className={menuTheme.container}>
        
        {/* EXPANDABLE ACTION AREA */}
        <div className={`
          ${menuTheme.innerActions} 
          ${isMenuExpanded ? menuTheme.actionsActive : menuTheme.actionsInactive}
        `}>
          {onBulkUpdateTrigger && (
            <Button 
              onClick={() => wrapAction(onBulkUpdateTrigger)}
              icon="+-"
              variant="secondary"
              size="sm"
              mode="circle"
              aria-label="Bulk Update Prices"
            />
          )}

          <Button 
            onClick={() => wrapAction(onProductAddTrigger)}
            icon={globalIcons.plus}
            variant="primary"
            size="sm"
            mode="circle"
            aria-label="Add New Product"
          />
        </div>

        {/* MAIN TOGGLE CONTROL */}
        <Button 
          onClick={toggleMenu}
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
