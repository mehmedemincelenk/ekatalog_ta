import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import StatusToggle from '../StatusToggle';

describe('StatusToggle Component (Diamond Standard)', () => {
  it('should render off state correctly and match snapshot', () => {
    const { asFragment } = render(
      <StatusToggle
        label="Duyuru Çubuğu"
        value={false}
        onChange={vi.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render on state correctly and match snapshot', () => {
    const { asFragment } = render(
      <StatusToggle
        label="Duyuru Çubuğu"
        value={true}
        onChange={vi.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should call onChange on toggle click', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <StatusToggle
        label="Açık/Kapalı"
        value={false}
        onChange={handleChange}
      />
    );

    const toggle = container.querySelector('.relative.w-\\[44px\\]');
    if (toggle) fireEvent.click(toggle);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not call onChange when disabled', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <StatusToggle
        label="Kilitli"
        value={true}
        onChange={handleChange}
        disabled={true}
      />
    );

    const toggle = container.querySelector('.relative.w-\\[44px\\]');
    if (toggle) fireEvent.click(toggle);

    expect(handleChange).not.toHaveBeenCalled();
  });
});
