import { memo } from 'react';
import { THEME } from '../../../../data/config';
import { useLongPress } from '../../../../hooks/ui/useLongPress';
import CategoryBadge from './CategoryBadge';

interface CategoryFilterChipProps {
  categoryName: string;
  isItemSelected: boolean;
  isAdminMode: boolean;
  productCount?: number; // Optional now
  showBadge?: boolean;   // New control prop
  onSelect: (categoryName: string) => void;
  onRename: (name: string) => void;
  onOrderChange: (categoryName: string, newPosition: number) => void;
  currentOrder: number;
  totalCategories: number;
}

/**
 * CATEGORY FILTER CHIP
 * -----------------------------------------------------------
 * An interactive button for category selection.
 * Pure layout coordinator for its sub-components.
 */
const CategoryFilterChip = memo(({ 
  categoryName, 
  isItemSelected, 
  isAdminMode, 
  productCount = 0,
  showBadge = true,
  onSelect, 
  onRename, 
  onOrderChange, 
  currentOrder, 
  totalCategories
}: CategoryFilterChipProps) => {
  const chipTheme = THEME.searchFilter.categoryList.chip;

  // Unified Admin Gesture: Long press to rename
  const longPressActions = useLongPress(() => {
    if (!isAdminMode) return;
    onRename(categoryName);
  });

  // --- STYLE ABSTRACTION (DRY) ---
  
  // 1. Root Container: Unified classes and conditional active/inactive states
  const containerStyles = [
    chipTheme.container,
    THEME.radius.chip,
    "items-center shrink-0 select-none cursor-pointer transition-all active:scale-95",
    isItemSelected ? chipTheme.active : chipTheme.inactive,
    !showBadge && !isAdminMode ? "px-5 py-2.5" : "" // Extra padding if no badge
  ].join(" ");

  // 2. Text Wrapper: Dynamic padding based on admin mode
  const textWrapperStyles = [
    chipTheme.textButton,
    isAdminMode ? 'pl-2' : (showBadge ? 'pl-4' : 'pl-0'),
    "pr-4 pointer-events-none"
  ].join(" ");

  // 3. Label: Color state
  const labelStyles = isItemSelected ? chipTheme.activeText : chipTheme.inactiveText;

  return (
    <div 
      className={containerStyles}
      {...longPressActions}
      onClick={() => onSelect(categoryName)}
    >
      {/* 1. Specialized Counter/Order Indicator (Conditional) */}
      {(showBadge || isAdminMode) && (
        <CategoryBadge 
          isAdminMode={isAdminMode}
          productCount={productCount}
          currentOrder={currentOrder}
          totalCategories={totalCategories}
          onOrderChange={(newPos) => onOrderChange(categoryName, newPos)}
          isItemSelected={isItemSelected}
        />
      )}

      {/* 2. Textual Label */}
      <div className={textWrapperStyles}>
        <span className={labelStyles}>
          {categoryName}
        </span>
      </div>
    </div>
  );
});

export default CategoryFilterChip;
