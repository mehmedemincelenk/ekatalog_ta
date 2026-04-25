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
    const [isPanelOpen, setIsPanelOpen] = useState(false);
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

    // Diamond Logic: On PC, always show everything. On Mobile, respect the panel toggle.
    const pcInitialLimit = 5;
    const isPC = typeof window !== 'undefined' && window.innerWidth >= 640;
    const hasMoreThanLimit = sortedList.length > pcInitialLimit;
    
    const visibleList = (isPC || isPanelOpen || !hasMoreThanLimit) 
      ? sortedList 
      : sortedList.slice(0, pcInitialLimit);

    const totalProductCount = Object.values(stats).reduce((acc, curr) => acc + curr, 0);
    const isAllSelected = activeCategories.length === 0;
    const chipTheme = THEME.searchFilter.categoryList.chip;

    const renderCategoryList = (list: string[]) => (
      <>
        {/* ADMIN: KATEGORİ EKLE CHIP (Moved to the very beginning) */}
        {isAdmin && (
          <PlusPlaceholder
            type="CATEGORY"
            onClick={() => setIsAddingCategory(true)}
            className="shrink-0 min-h-[28px] sm:min-h-[42px] !py-0"
          />
        )}

        <div
          onClick={() => {
            // "Tüm Ürünler" should clear active filters
            onCategoryToggle('ALL_PRODUCTS'); // This special key will be handled by store
          }}
          className={`
            ${chipTheme.container} ${THEME.radius.chip} items-stretch shrink-0 select-none cursor-pointer transition-all active:scale-95 min-h-[28px] sm:min-h-[42px] px-4 sm:px-6 flex
            ${isAllSelected ? chipTheme.active : chipTheme.inactive}
          `}
        >
          <div className={`${chipTheme.textButton} !py-0 w-full flex items-center justify-center pointer-events-none sm:text-[12px] min-w-[60px] sm:min-w-[100px]`}>
            <span className={isAllSelected ? chipTheme.activeText : chipTheme.inactiveText}>
              {LABELS.filter.allCategories}
            </span>
          </div>
        </div>

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
        
        {/* MOBILE ONLY "MORE" CHIP */}
        {!isPanelOpen && hasMoreThanLimit && !isPC && (
          <Button
            onClick={() => setIsPanelOpen(true)}
            variant="secondary"
            mode="rectangle"
            className="flex sm:hidden px-5 py-2.5 text-[10px] font-black uppercase tracking-widest shrink-0 !rounded-xl border-stone-200 border-dashed border-2 hover:border-stone-900 transition-all text-stone-400 hover:text-stone-900"
          >
            + DAHA FAZLA
          </Button>
        )}

      </>
    );

    return (
      <div
        className={`w-full bg-stone-50 border-b border-stone-200 sm:border-b-0 pt-3 pb-1 relative z-40 ${!showAll ? 'opacity-50 grayscale' : ''}`}
      >
        <div className={`${filterTheme.container} !flex-col !items-stretch`}>
          {/* TOP BAR: Search (Mobile Only) & Interaction */}
          <div className="flex flex-row items-center gap-2 w-full">
            {displayConfig.showSearch && (
              <div
                className={`${filterTheme.searchArea.inputWrapper} ${THEME.radius.input} flex-1 h-11 sm:hidden !max-w-none w-full flex items-center`}
              >
                <div className={filterTheme.searchArea.iconSize}>
                  {globalIcons.search}
                </div>
                <input
                  id="mobile-search-input"
                  type="text"
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  placeholder={LABELS.filter.searchPlaceholder}
                  className={`${filterTheme.searchArea.input} ${THEME.radius.input} h-full w-full flex-1`}
                />
              </div>
            )}

            {displayConfig.showCategories && (
              <div className="flex-none flex items-center justify-start gap-2 overflow-hidden sm:hidden">
                <Button
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  variant="primary"
                  mode="rectangle"
                  className="h-11 px-3 flex-none font-black !text-[10px] !bg-stone-900 !text-white !rounded-lg"
                >
                  {LABELS.filter.categoryBtn}
                </Button>
              </div>
            )}
          </div>

          {/* EXPANDED PANEL (PC & MOBILE) */}
          {displayConfig.showCategories && (
            <div className="mt-3 sm:mt-0">
              <AnimatePresence mode="wait">
                {(isPanelOpen || (typeof window !== 'undefined' && window.innerWidth >= 640)) ? (
                  <motion.div
                    key="expanded-categories"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap justify-start items-center gap-2 py-1 w-full">
                      {renderCategoryList(sortedList)}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
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
          subtitle="Kategorinin adı müşterileriniz tarafından görülecektir."
          placeholder="Kategori adı..."
          initialValue=""
        />
      </div>
    );
  },
);

export default SearchFilter;
