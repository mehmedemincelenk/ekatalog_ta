import { memo, useMemo, useCallback } from 'react';
import { THEME, LABELS } from '../../../../data/config';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryFilterChip from './CategoryFilterChip';

interface CategoryListProps {
  isOpen: boolean;
  categories: string[];           // This is the FULL sorted list
  visibleCategoriesPC: string[];  // This is the sliced list for desktop
  hasMorePC: boolean;
  activeCategories: string[];
  onToggle: (cat: string) => void;
  isAdmin: boolean;
  stats: Record<string, number>;
  onRename: (name: string) => void;
  onOrderChange: (cat: string, pos: number) => void;
  onLoadMorePC?: () => void;
}

/**
 * CATEGORY LIST
 * -----------------------------------------------------------
 * Standardized list coordinator. 
 * Correctly maps ordering to the FULL categories list, not just visible ones.
 */
const CategoryList = memo(({ 
  isOpen, categories, visibleCategoriesPC, hasMorePC, activeCategories, onToggle, 
  isAdmin, stats, onRename, onOrderChange, onLoadMorePC 
}: CategoryListProps) => {
  const theme = THEME.searchFilter.categoryList;

  // Optimized Chip Rendering - Global list awareness is key for ordering!
  const renderChips = useCallback((listToRender: string[]) => (
    <>
      <CategoryFilterChip 
        categoryName={LABELS.filter.allCategories}
        isItemSelected={activeCategories.length === 0}
        isAdminMode={false}
        showBadge={false}
        onSelect={() => onToggle(LABELS.filter.allCategories)}
        onRename={() => {}}
        onOrderChange={() => {}}
        currentOrder={0}
        totalCategories={0}
      />

      {listToRender.map((cat: string) => {
        // CRITICAL: We find the order based on the FULL categories list
        const realOrder = categories.indexOf(cat) + 1;
        
        return (
          <CategoryFilterChip 
            key={cat} 
            categoryName={cat} 
            isItemSelected={activeCategories.includes(cat)} 
            isAdminMode={isAdmin} 
            productCount={stats[cat] || 0}
            onSelect={onToggle}
            onRename={onRename}
            onOrderChange={onOrderChange}
            currentOrder={realOrder}
            totalCategories={categories.length}
          />
        );
      })}
    </>
  ), [categories, activeCategories, isAdmin, stats, onToggle, onRename, onOrderChange]);

  const mobileContent = useMemo(() => renderChips(categories), [renderChips, categories]);
  const desktopContent = useMemo(() => renderChips(visibleCategoriesPC), [renderChips, visibleCategoriesPC]);

  return (
    <div className="w-full mt-3">
      {/* 1. MOBILE VIEW (Expandable) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 py-1">
              {mobileContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DESKTOP VIEW (Row) */}
      <div className="hidden sm:flex items-center w-full">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1 flex-1">
          {desktopContent}
          
          {hasMorePC && (
            <button 
              onClick={onLoadMorePC}
              className={theme.showMoreButton}
            >
              + DAHA FAZLA
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default CategoryList;
