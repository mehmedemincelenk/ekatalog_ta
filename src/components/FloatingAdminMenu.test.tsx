import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FloatingAdminMenu from './FloatingAdminMenu';

vi.mock('../store', () => ({
  useStore: () => ({
    settings: {
      activeCurrency: 'TRY',
    },
    updateSetting: vi.fn(),
  }),
}));

describe('FloatingAdminMenu (Diamond Snapshot)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('admin menüsü kilitli tasarım snapshotu ile eşleşmeli', () => {
    const { asFragment } = render(
      <FloatingAdminMenu 
        onProductAddTrigger={vi.fn()}
        onBulkUpdateTrigger={vi.fn()}
        onSettingsTrigger={vi.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('admin menüsü açıldığında butonlar doğru görünmeli', () => {
    const { asFragment, getByLabelText } = render(
      <FloatingAdminMenu 
        onProductAddTrigger={vi.fn()}
        onBulkUpdateTrigger={vi.fn()}
        onSettingsTrigger={vi.fn()}
      />
    );
    
    const toggle = getByLabelText('Menüyü Aç');
    act(() => {
      fireEvent.click(toggle);
    });
    
    // Timer'ları ilerletmeye gerek yok çünkü isExpanded state değişimi anında olur, 
    // ama timer hata çıkarıyorsa bu blok korur.
    act(() => {
      vi.runAllTimers();
    });
    
    expect(asFragment()).toMatchSnapshot();
  });
});
