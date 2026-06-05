import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilterChip from '../CategoryFilterChip';

describe('CategoryFilterChip Component (Diamond Standard)', () => {
  it('should render inactive state correctly and match snapshot', () => {
    const { asFragment } = render(
      <CategoryFilterChip
        categoryName="Ambalaj"
        isItemSelected={false}
        productCount={15}
        isAdminMode={false}
        onSelect={vi.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render active state correctly and match snapshot', () => {
    const { asFragment } = render(
      <CategoryFilterChip
        categoryName="Temizlik"
        isItemSelected={true}
        productCount={5}
        isAdminMode={false}
        onSelect={vi.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onSelect on click', () => {
    const handleSelect = vi.fn();
    render(
      <CategoryFilterChip
        categoryName="Karton Bardak"
        isItemSelected={false}
        productCount={42}
        isAdminMode={false}
        onSelect={handleSelect}
      />
    );

    const chip = screen.getByText('Karton Bardak').closest('div');
    if (chip) fireEvent.click(chip);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('Karton Bardak');
  });
});
