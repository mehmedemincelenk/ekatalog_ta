import { useState, memo, useEffect } from 'react';
import { THEME, LABELS } from '../data/config';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import PlusPlaceholder from './PlusPlaceholder';
import CategoryFilterChip from './CategoryFilterChip';
import QuickEditModal from './QuickEditModal';
import { useDebounce } from '../hooks/useCommon';
import { useStore } from '../store';
import { SearchFilterProps } from '../types';

/**
 * SEARCH FILTER COMPONENT (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Hybrid interaction engine for category navigation.
 * Uses centralized analytics from useCatalogEngine.
 */
const SearchFilter = memo(
  ({
    sortedList = [],
    stats = {},
    renameCategory,
    onCategoryOrderChange,
    onAddCategory,
  }: SearchFilterProps) => {
    const {
      isAdmin,
      settings,
      searchQuery: search,
      setSearchQuery: onSearchChange,
      activeCategories,
      toggleCategory: onCategoryToggle,
    } = useStore();

    const [internalSearch, setInternalSearch] = useState(search);
    const [isReyonOpen, setIsReyonOpen] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const displayConfig = settings?.displayConfig || {
      showSearch: true,
      showCategories: true,
    };
    const filterTheme = THEME.searchFilter;
    const globalIcons = THEME.icons;

    const debouncedSearch = useDebounce(internalSearch, 400);

    useEffect(() => {
      onSearchChange(debouncedSearch);
    }, [debouncedSearch, onSearchChange]);

    useEffect(() => {
      setInternalSearch(search);
    }, [search]);

    const showAll = displayConfig.showSearch || displayConfig.showCategories;
    if (!showAll && !isAdmin) return null;

    // Diamond Logic: PC shows 5 chips + "More" toggle in single line
    const pcInitialLimit = 5;
    const hasMoreThanLimit = sortedList.length > pcInitialLimit;
    const visibleList = (!isReyonOpen && hasMoreThanLimit) 
      ? sortedList.slice(0, pcInitialLimit) 
      : sortedList;

    const renderCategoryList = (list: string[]) => (
      <>
        <Button
          onClick={() => {
            onCategoryToggle(LABELS.filter.allCategories);
            setIsReyonOpen(false);
          }}
          variant={activeCategories.length === 0 ? 'primary' : 'secondary'}
          mode="rectangle"
          className="px-5 py-2.5 sm:px-[19px] sm:py-[10px] text-[10px] font-black uppercase tracking-widest shrink-0 !rounded-xl"
        >
          {LABELS.filter.allCategories}
        </Button>
        {list.map((cat) => (
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
        
        {/* PC "MORE" CHIP */}
        {!isReyonOpen && hasMoreThanLimit && (
          <Button
            onClick={() => setIsReyonOpen(true)}
            variant="secondary"
            mode="rectangle"
            className="hidden sm:flex px-5 py-2.5 sm:px-[19px] sm:py-[10px] text-[10px] font-black uppercase tracking-widest shrink-0 !rounded-xl border-stone-200 border-dashed border-2 hover:border-stone-900 transition-all text-stone-400 hover:text-stone-900"
          >
            + DAHA FAZLA
          </Button>
        )}

        {isAdmin && (
          <PlusPlaceholder
            type="CATEGORY"
            onClick={() => setIsAddingCategory(true)}
          />
        )}
      </>
    );

    return (
      <div
        className={`w-full bg-white border-b border-stone-100 py-3 relative z-40 ${!showAll ? 'opacity-50 grayscale' : ''}`}
      >
        <div className={filterTheme.container}>
          {/* INTERACTION BAR: Universal side-by-side for mobile, unified with PC chips */}
          <div className="flex items-center gap-2">
            {displayConfig.showSearch && (
              <div
                className={`${filterTheme.searchArea.inputWrapper} ${THEME.radius.input} flex-1 h-11 sm:hidden`}
              >
                <div className={filterTheme.searchArea.iconSize}>
                  {globalIcons.search}
                </div>
                <input
                  type="text"
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  placeholder={LABELS.filter.searchPlaceholder}
                  className={`${filterTheme.searchArea.input} ${THEME.radius.input} h-full`}
                />
              </div>
            )}

            {displayConfig.showCategories && (
              <div className="flex-1 sm:flex-none flex items-center gap-2 overflow-hidden">
                <Button
                  onClick={() => setIsReyonOpen(!isReyonOpen)}
                  variant="primary"
                  mode="rectangle"
                  className="sm:hidden h-11 px-6 flex-1 sm:flex-none font-black !bg-stone-900 !text-white !rounded-xl"
                >
                  {LABELS.filter.categoryBtn}
                </Button>
                
                {/* PC ONLY: Collapsed Single Line View */}
                {!isReyonOpen && (
                  <div className="hidden sm:flex flex-nowrap items-center gap-2 overflow-hidden w-full py-1">
                    {renderCategoryList(visibleList)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* EXPANDED PANEL (PC & MOBILE) */}
          {displayConfig.showCategories && (
            <AnimatePresence>
              {isReyonOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="flex flex-wrap gap-2 py-1">
                    {renderCategoryList(sortedList)}
                    
                    {/* PC "LESS" CHIP */}
                    <Button
                      onClick={() => setIsReyonOpen(false)}
                      variant="secondary"
                      mode="rectangle"
                      className="hidden sm:flex px-5 py-2.5 sm:px-[19px] sm:py-[10px] text-[10px] font-black uppercase tracking-widest shrink-0 !rounded-xl border-stone-200 border-dashed border-2 hover:border-stone-900 transition-all text-stone-400 hover:text-stone-900"
                    >
                      - DAHA AZ
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {!showAll && isAdmin && (
            <div className="text-[10px] font-black uppercase text-stone-400 text-center py-2 italic">
              Bu alan gizli (Sadece Admin Görür)
            </div>
          )}
        </div>

        <QuickEditModal
          isOpen={isAddingCategory}
          onClose={() => setIsAddingCategory(false)}
          onSave={(name) => {
            if (name.trim()) onAddCategory?.(name.trim());
          }}
          title={LABELS.filter.newCategoryPrompt.toUpperCase()}
          subtitle="Reyonun adı müşterileriniz tarafından görülecektir."
          placeholder="Reyon adı..."
          initialValue=""
        />
      </div>
    );
  },
);

export default SearchFilter;
