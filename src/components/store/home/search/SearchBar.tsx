import { memo } from 'react';
import { THEME, LABELS } from '../../../../data/config';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

/**
 * SEARCH BAR
 * -----------------------------------------------------------
 * Isolated search input with a clear-action and mobile toggle.
 */
const SearchBar = memo(({ value, onChange, isMobileMenuOpen, onToggleMobileMenu }: SearchBarProps) => {
  const theme = THEME.searchFilter.searchArea;
  const icons = THEME.icons;

  // --- STYLE ABSTRACTION ---
  const inputContainerStyles = `${theme.inputWrapper} ${THEME.radius.input}`;
  const inputFieldStyles = `${theme.input} ${THEME.radius.input}`;
  const mobileBtnStyles = `${theme.mobileToggle} ${THEME.radius.button} sm:hidden flex items-center justify-center gap-2`;
  const chevronStyles = `transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`;

  return (
    <div className={theme.wrapper}>
      {/* 1. INPUT FIELD AREA */}
      <div className={inputContainerStyles}>
        <div className={theme.iconSize}>{icons.search}</div>
        
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={LABELS.filter.searchPlaceholder}
          className={inputFieldStyles}
        />

        {/* UX: Quick Clear Button */}
        {value && (
          <button 
            onClick={() => onChange('')}
            className={theme.clearButton}
            aria-label="Clear search"
          >
            {icons.close}
          </button>
        )}
      </div>
      
      {/* 2. MOBILE CATEGORY TOGGLE */}
      <button 
        onClick={onToggleMobileMenu} 
        className={mobileBtnStyles}
      >
        {LABELS.filter.categoryBtn}
        <span className={chevronStyles}>
          {icons.chevronDown}
        </span>
      </button>
    </div>
  );
});

export default SearchBar;
