import { memo } from 'react';
import Button from './Button';
import { THEME, LABELS } from '../data/config';

interface CategoryChipSelectorProps {
  categories: string[];
  selectedCategory: string;
  customCategoryName?: string;
  onCategorySelect: (category: string) => void;
  onCustomCategoryChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  allowCustom?: boolean;
  className?: string;
}

const CategoryChipSelector = memo(({
  categories,
  selectedCategory,
  customCategoryName = '',
  onCategorySelect,
  onCustomCategoryChange,
  allowCustom = true,
  className = ''
}: CategoryChipSelectorProps) => {
  const theme = THEME.addProductModal;

  return (
    <div className={`space-y-4 ${className}`}>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => onCategorySelect(category)}
              variant={
                selectedCategory === category && (!allowCustom || !customCategoryName)
                  ? 'primary'
                  : 'secondary'
              }
              mode="rectangle"
              size="sm"
              className={`!text-[10px] !py-2 !px-4 !rounded-xl font-black tracking-widest uppercase ${
                selectedCategory === category && (!allowCustom || !customCategoryName)
                  ? '!bg-stone-900 !text-white'
                  : ''
              }`}
              showFingerprint={true}
            >
              {category}
            </Button>
          ))}
        </div>
      )}
      
      {allowCustom && onCustomCategoryChange && (
        <input
          name="customCategoryName"
          type="text"
          value={customCategoryName}
          onChange={onCustomCategoryChange}
          placeholder={LABELS.form.newCategoryPlaceholder}
          className={`${theme.inputField} italic text-sm`}
        />
      )}
    </div>
  );
});

CategoryChipSelector.displayName = 'CategoryChipSelector';

export default CategoryChipSelector;
