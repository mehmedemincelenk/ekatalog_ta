import { useState, useMemo, useEffect } from 'react';
import { TECH, sortCategories } from '../../data/config';
import { Product } from '../../types';

/**
 * useSearchFilterLogic: Logic hook for searching, filtering and category management.
 */
export function useSearchFilterLogic(
  sortedCategories: string[],
  stats: Record<string, number>,
  search: string,
  onSearchChange: (val: string) => void
) {
  const [internalSearch, setInternalSearch] = useState(search);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleLimitPC, setVisibleLimitPC] = useState(6);

  // New: Modal Management for Renaming
  const [renameModalState, setRenameModalState] = useState<{ isOpen: boolean, oldName: string }>({
    isOpen: false,
    oldName: ''
  });

  // 1. Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(internalSearch), TECH.searchDebounceMs);
    return () => clearTimeout(timer);
  }, [internalSearch, onSearchChange]);

  const openRenameModal = (name: string) => setRenameModalState({ isOpen: true, oldName: name });
  const closeRenameModal = () => setRenameModalState({ isOpen: false, oldName: '' });

  return {
    internalSearch,
    setInternalSearch,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    visibleLimitPC,
    sortedList: sortedCategories,
    visibleListPC: sortedCategories.slice(0, visibleLimitPC),
    hasMorePC: sortedCategories.length > visibleLimitPC,
    stats,
    loadMorePC: () => setVisibleLimitPC(prev => prev + 4),
    renameModal: {
      ...renameModalState,
      open: openRenameModal,
      close: closeRenameModal
    }
  };
}
