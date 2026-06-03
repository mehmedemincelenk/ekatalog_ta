import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useDebounce } from './useCommon';

/**
 * SEARCH FILTER FLOW ENGINE (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Orchestrator hook for category filtering, searching, and panel controls.
 */
export function useSearchFilterFlow() {
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

  const debouncedSearch = useDebounce(internalSearch, 400);

  // Sync debounced search to global search state
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  // Sync global search back to internal state
  useEffect(() => {
    setInternalSearch(search);
  }, [search]);

  return {
    isAdmin,
    settings,
    search,
    activeCategories,
    onCategoryToggle,
    internalSearch,
    setInternalSearch,
    isPanelOpen,
    setIsPanelOpen,
    isAddingCategory,
    setIsAddingCategory,
  };
}
