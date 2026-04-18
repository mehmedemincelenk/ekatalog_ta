import { memo } from 'react';
import { THEME, LABELS } from '../../../data/config';

interface CategoryHeaderProps {
  title: string;
  count: number;
}

/**
 * ATOM: CategoryHeader
 * -----------------------------------------------------------
 * Renders the category title and product count indicator.
 */
export const CategoryHeader = memo(({ title, count }: CategoryHeaderProps) => {
  const theme = THEME.productGrid.header;

  return (
    <div className={theme.wrapper}>
      <h2 className={theme.title}>{title}</h2>
      <div className={theme.line}></div>
      <span className={theme.count}>
        {count} {LABELS.productCountSuffix}
      </span>
    </div>
  );
});
