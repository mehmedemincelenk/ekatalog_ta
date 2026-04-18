import { useState, useMemo, useEffect } from 'react';
import { TECH, sortCategories } from '../../data/config';
import { Product } from '../../types';

/**
 * useSearchFilterLogic: Logic hook for searching, filtering and category management.
 */
export function useSearchFilterLogic(
  products: Product[],
  categoryOrder: string[],
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

  // 2. Compute Category Stats & Sorting
  const { sortedList, stats } = useMemo(() => {
    const foundInProducts = [...new Set(products.map(p => p.category).filter(Boolean))];
    const consolidated = [...new Set([...categoryOrder, ...foundInProducts])];
    
    const statsObj: Record<string, number> = {};
    products.forEach(p => { 
      if (p.category) statsObj[p.category] = (statsObj[p.category] || 0) + 1; 
    });

    return { 
      sortedList: sortCategories(consolidated, categoryOrder), 
      stats: statsObj 
    };
  }, [products, categoryOrder]);

  const openRenameModal = (name: string) => setRenameModalState({ isOpen: true, oldName: name });
  const closeRenameModal = () => setRenameModalState({ isOpen: false, oldName: '' });

  return {
    internalSearch,
    setInternalSearch,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    visibleLimitPC,
    sortedList,
    visibleListPC: sortedList.slice(0, visibleLimitPC),
    hasMorePC: sortedList.length > visibleLimitPC,
    stats,
    loadMorePC: () => setVisibleLimitPC(prev => prev + 4),
    renameModal: {
      ...renameModalState,
      open: openRenameModal,
      close: closeRenameModal
    }
  };
}
