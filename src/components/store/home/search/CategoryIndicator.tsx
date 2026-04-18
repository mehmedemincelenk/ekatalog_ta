import { memo } from 'react';
import { THEME } from '../../../../data/config';
import OrderSelector from '../../../ui/OrderSelector';

interface CategoryIndicatorProps {
  isAdminMode: boolean;
  productCount: number;
  currentOrder: number;
  totalCategories: number;
  onOrderChange: (newPosition: number) => void;
  isItemSelected: boolean;
}

/**
 * CATEGORY INDICATOR
 * -----------------------------------------------------------
 * Specialized smart indicator within a CategoryFilterChip.
 * Shows product count for users and OrderSelector for admins.
 */
const CategoryIndicator = memo(({ 
  isAdminMode, 
  productCount, 
  currentOrder, 
  totalCategories, 
  onOrderChange,
  isItemSelected
}: CategoryIndicatorProps) => {
  const { counter } = THEME.searchFilter.categoryList.chip;

  if (isAdminMode) {
    return (
      <OrderSelector 
        currentOrder={currentOrder}
        totalCount={totalCategories}
        onChange={onOrderChange}
        className={`${counter.base} ${counter.inactive} ${counter.admin}`}
      />
    );
  }

  const badgeStyles = `${counter.base} ${
    isItemSelected ? counter.active : counter.inactive
  }`;

  return (
    <span className={badgeStyles}>
      {productCount}
    </span>
  );
});

export default CategoryIndicator;
