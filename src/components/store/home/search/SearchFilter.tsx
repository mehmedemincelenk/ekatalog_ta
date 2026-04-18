import { Product } from '../../../../types';
import { THEME } from '../../../../data/config';
import { useSearchFilterLogic } from '../../../../hooks/catalog/useSearchFilterLogic';
import SearchBar from './SearchBar';
import CategoryList from './CategoryList';
import InputModal from '../../../ui/InputModal';

/**
 * SEARCH FILTER (Orchestrator)
 * -----------------------------------------------------------
 * Smart hybrid interface for product discovery.
 */

interface SearchFilterProps {
  products: Product[];
  categoryOrder: string[];
  onCategoryOrderChange: (categoryName: string, newPosition: number) => void;
  search: string;
  onSearchChange: (val: string) => void;
  activeCategories?: string[];
  onCategoryToggle: (categoryName: string) => void;
  isAdmin: boolean;
  renameCategory: (oldName: string, newName: string) => void;
}

export default function SearchFilter({ 
  products = [], 
  categoryOrder = [], 
  search, 
  onSearchChange, 
  activeCategories = [], 
  onCategoryToggle, 
  isAdmin, 
  renameCategory, 
  onCategoryOrderChange
}: SearchFilterProps) {

  const {
    internalSearch,
    setInternalSearch,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    visibleListPC, // This is the already sliced list for desktop
    hasMorePC,     // This tells us if we need the "+ Daha Fazla" button
    sortedList,    // This is the full list for mobile
    stats,
    loadMorePC,
    renameModal
  } = useSearchFilterLogic(products, categoryOrder, search, onSearchChange);

  const theme = THEME.searchFilter;

  return (
    <div className={theme.layout}>
      <div className={theme.container}>
        
        {/* ACTION: Search and Mobile Toggle */}
        <SearchBar 
          value={internalSearch}
          onChange={setInternalSearch}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* ADAPTIVE CATEGORY LIST: Fully responsive and logic-aware */}
        <CategoryList 
          isOpen={isMobileMenuOpen}
          categories={sortedList}
          visibleCategoriesPC={visibleListPC}
          hasMorePC={hasMorePC}
          activeCategories={activeCategories}
          onToggle={onCategoryToggle}
          isAdmin={isAdmin}
          stats={stats}
          onRename={renameModal.open}
          onOrderChange={onCategoryOrderChange}
          onLoadMorePC={loadMorePC}
        />

        {/* RENAME MODAL: Apple-style replacement for window.prompt */}
        {renameModal.isOpen && (
          <InputModal 
            title="Reyon Adını Düzenle"
            initialValue={renameModal.oldName}
            onConfirm={(newName: string) => {
              renameCategory(renameModal.oldName, newName);
              renameModal.close();
            }}
            onCancel={renameModal.close}
          />
        )}

      </div>
    </div>
  );
}
