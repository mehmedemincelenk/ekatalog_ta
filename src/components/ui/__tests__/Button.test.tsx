import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component (Diamond Standard)', () => {
  it('should render correctly with text and match snapshot', () => {
    const { asFragment } = render(<Button>Devam</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should support different semantic variants', () => {
    const { asFragment: renderAction } = render(
      <Button variant="action">Tamam</Button>
    );
    expect(renderAction()).toMatchSnapshot();

    const { asFragment: renderDanger } = render(
      <Button variant="danger">Sil</Button>
    );
    expect(renderDanger()).toMatchSnapshot();
  });

  it('should call onClick callback on click', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Tıkla</Button>);
    
    fireEvent.click(screen.getByText('Tıkla'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Engelli</Button>);
    const btn = screen.getByText('Engelli').closest('button');
    expect(btn?.disabled).toBe(true);
  });

  it('should show loading spinner and disable button when loading is true', () => {
    render(<Button loading>Kaydediliyor</Button>);
    const btn = screen.getByText('Kaydediliyor').closest('button');
    expect(btn?.disabled).toBe(true);
    expect(btn?.querySelector('.animate-spin')).not.toBeNull();
  });

  it('should render badge correctly', () => {
    render(<Button badge="Yeni">Buton</Button>);
    expect(screen.getByText('Yeni')).not.toBeNull();
  });
});
