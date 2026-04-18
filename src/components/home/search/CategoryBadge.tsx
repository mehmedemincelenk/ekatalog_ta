import { memo } from 'react';
import { THEME } from '../../../data/config';
import OrderSelector from '../../ui/OrderSelector';

interface CategoryBadgeProps {
  isAdminMode: boolean;
  productCount: number;
  currentOrder: number;
  totalCategories: number;
  onOrderChange: (newPosition: number) => void;
  isItemSelected: boolean;
}

/**
 * CATEGORY BADGE
 * -----------------------------------------------------------
 * Specialized indicator within a CategoryFilterChip.
 * Uses OrderSelector for admin reordering.
 */
const CategoryBadge = memo(({ 
  isAdminMode, 
  productCount, 
  currentOrder, 
  totalCategories, 
  onOrderChange,
  isItemSelected
}: CategoryBadgeProps) => {
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

export default CategoryBadge;
