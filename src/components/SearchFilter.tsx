import React, { useState, useMemo, memo, useEffect, useRef, useCallback } from 'react';
import { THEME, LABELS, TECH, sortCategories } from '../data/config';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SEARCH FILTER COMPONENT (Pure Minimalist Version - Production Ready)
 * -----------------------------------------------------------
 * Optimized for performance and stability. Zero unrelated changes.
 */

interface SearchFilterProps {
  products: Product[];
  categoryOrder: string[];
  onCategoryOrderChange: (categoryName: string, newPosition: number) => void;
  search: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
  activeCategories?: string[];
  onCategoryToggle: (categoryName: string) => void;
  isAdmin: boolean;
  renameCategory: (oldName: string, newName: string) => void;
  removeCategoryFromProducts: (categoryName: string) => void;
  addCategory: (newName: string) => void;
}

interface CategoryFilterChipProps {
  categoryName: string;
  isItemSelected: boolean;
  isAdminMode: boolean;
  productCount: number;
  onSelect: (categoryName: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onOrderChange: (categoryName: string, newPosition: number) => void;
  currentOrder: number;
  totalCategories: number;
}

const CategoryFilterChip = memo(({ 
  categoryName, 
  isItemSelected, 
  isAdminMode, 
  productCount, 
  onSelect, 
  onRename, 
  onOrderChange, 
  currentOrder, 
  totalCategories
}: CategoryFilterChipProps) => {
  const chipTheme = THEME.searchFilter.categoryList.chip;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressActive = useRef(false);

  const handlePointerDown = useCallback(() => {
    if (!isAdminMode) return;
    isLongPressActive.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPressActive.current = true;
      const newName = window.prompt("Reyon adını değiştir:", categoryName);
      if (newName && newName.trim() && newName !== categoryName) {
        onRename(categoryName, newName.trim());
      }
    }, 600);
  }, [isAdminMode, categoryName, onRename]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isLongPressActive.current) {
      isLongPressActive.current = false;
      return;
    }
    onSelect(categoryName);
  }, [categoryName, onSelect]);

  return (
    <motion.div 
      layout
      className={`
        ${chipTheme.container} ${THEME.radius.chip} items-center shrink-0 select-none cursor-pointer
        ${isItemSelected ? chipTheme.active : chipTheme.inactive}
      `}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
    >
      <div className="relative h-full shrink-0 overflow-hidden flex items-center">
        {isAdminMode ? (
          <div className="relative group px-1">
            <span className={`${chipTheme.counter.base} ${chipTheme.counter.inactive} !w-7 !h-7 sm:!w-8 sm:!h-8 flex items-center justify-center text-[10px] font-black border-r border-stone-100`}>
              {currentOrder}.
            </span>
            <select 
              value={currentOrder}
              onChange={(e) => onOrderChange?.(categoryName, parseInt(e.target.value, 10))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {Array.from({ length: totalCategories }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        ) : (
          <span className={`${chipTheme.counter.base} ${isItemSelected ? chipTheme.counter.active : chipTheme.counter.inactive}`}>
            {productCount}
          </span>
        )}
      </div>
      <div className={`${chipTheme.textButton} ${isAdminMode ? 'pl-2' : 'pl-4'} pr-4 pointer-events-none`}>
        <span className={isItemSelected ? chipTheme.activeText : chipTheme.inactiveText}>{categoryName}</span>
      </div>
    </motion.div>
  );
});
export default function SearchFilter({ 
  products = [], 
  categoryOrder = [], 
  search, 
  onSearchChange, 
  activeCategories = [], 
  onCategoryToggle, 
  isAdmin, 
  renameCategory, 
  removeCategoryFromProducts, 
  onCategoryOrderChange
}: SearchFilterProps) {

  const [isReyonOpen, setIsReyonOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState(search);
  
  const filterTheme = THEME.searchFilter;
  const globalIcons = THEME.icons;

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(internalSearch), TECH.searchDebounceMs);
    return () => clearTimeout(timer);
  }, [internalSearch, onSearchChange]);

  const { sortedList, stats } = useMemo(() => {
    const foundInProducts = [...new Set(products.map(p => p.category).filter(Boolean))];
    const consolidated = [...new Set([...categoryOrder, ...foundInProducts])];
    const statsObj: Record<string, number> = {};
    products.forEach(p => { if (p.category) statsObj[p.category] = (statsObj[p.category] || 0) + 1; });
    return { sortedList: sortCategories(consolidated, categoryOrder), stats: statsObj };
  }, [products, categoryOrder]);

  const handleAllCategories = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onCategoryToggle(LABELS.filter.allCategories);
  }, [onCategoryToggle]);

  return (
    <div className="w-full bg-white border-b border-stone-100 py-3">
      <div className={filterTheme.container}>
        <div className={filterTheme.searchArea.wrapper}>
          <div className={`${filterTheme.searchArea.inputWrapper} ${THEME.radius.input}`}>
            <div className={filterTheme.searchArea.iconSize}>{globalIcons.search}</div>
            <input 
              type="text" value={internalSearch} 
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder={LABELS.filter.searchPlaceholder}
              className={`${filterTheme.searchArea.input} ${THEME.radius.input}`}
            />
          </div>
          <button onClick={() => setIsReyonOpen(!isReyonOpen)} className={`${filterTheme.searchArea.mobileToggle} ${THEME.radius.button}`}>
            {LABELS.filter.categoryBtn}
          </button>
        </div>

        <AnimatePresence>
          {(isReyonOpen || (typeof window !== 'undefined' && window.innerWidth >= 640)) && (
            <motion.div 
              initial={isReyonOpen ? { height: 0, opacity: 0 } : {}}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 pt-2 pb-1 w-full overflow-hidden"
            >
              <button 
                onClick={handleAllCategories}
                className={`${filterTheme.categoryList.chip.container} ${THEME.radius.chip} px-5 py-2 ${THEME.font.xs} font-black uppercase tracking-widest ${activeCategories.length === 0 ? filterTheme.categoryList.chip.active : filterTheme.categoryList.chip.inactive}`}
              >
                {LABELS.filter.allCategories}
              </button>

              {sortedList.map((cat) => (
                <CategoryFilterChip 
                  key={cat} 
                  categoryName={cat} 
                  isItemSelected={activeCategories.includes(cat)} 
                  isAdminMode={isAdmin} 
                  productCount={stats[cat] || 0}
                  onSelect={onCategoryToggle}
                  onRename={renameCategory}
                  onOrderChange={onCategoryOrderChange}
                  currentOrder={sortedList.indexOf(cat) + 1}
                  totalCategories={sortedList.length}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
