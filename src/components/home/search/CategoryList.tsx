import { memo, useMemo } from 'react';
import { THEME, LABELS } from '../../../data/config';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryFilterChip from './CategoryFilterChip';

interface CategoryListProps {
  isOpen: boolean;
  categories: string[];
  visibleCategoriesPC: string[];
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
 * Adaptive list that handles both Mobile (expandable) 
 * and Desktop (paginated row) layouts internally.
 */
const CategoryList = memo(({ 
  isOpen, categories, visibleCategoriesPC, hasMorePC, activeCategories, onToggle, 
  isAdmin, stats, onRename, onOrderChange, onLoadMorePC 
}: CategoryListProps) => {
  const theme = THEME.searchFilter.categoryList;

  // Optimized Chip Rendering (DRY)
  const renderChips = (list: string[]) => (
    <>
      <CategoryFilterChip 
        categoryName={LABELS.filter.allCategories}
        isItemSelected={activeCategories.length === 0}
        isAdminMode={false} // "All" doesn't have admin reordering
        showBadge={false}
        onSelect={() => onToggle(LABELS.filter.allCategories)}
        onRename={() => {}}
        onOrderChange={() => {}}
        currentOrder={0}
        totalCategories={0}
      />

      {list.map((cat) => (
        <CategoryFilterChip 
          key={cat} 
          categoryName={cat} 
          isItemSelected={activeCategories.includes(cat)} 
          isAdminMode={isAdmin} 
          productCount={stats[cat] || 0}
          onSelect={onToggle}
          onRename={onRename}
          onOrderChange={onOrderChange}
          currentOrder={categories.indexOf(cat) + 1}
          totalCategories={categories.length}
        />
      ))}
    </>
  );

  const mobileContent = useMemo(() => renderChips(categories), [categories, activeCategories, isAdmin, stats]);
  const desktopContent = useMemo(() => renderChips(visibleCategoriesPC), [visibleCategoriesPC, activeCategories, isAdmin, stats]);

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
