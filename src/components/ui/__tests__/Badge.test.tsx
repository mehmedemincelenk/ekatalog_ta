import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component (Diamond Standard)', () => {
  it('should render children and match snapshot for default variant', () => {
    const { asFragment } = render(<Badge>Yeni</Badge>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correctly with different variants and sizes', () => {
    const { asFragment: renderSuccess } = render(
      <Badge variant="success" size="md">
        Tamamlandı
      </Badge>
    );
    expect(renderSuccess()).toMatchSnapshot();

    const { asFragment: renderDanger } = render(
      <Badge variant="danger" size="sm">
        Hata
      </Badge>
    );
    expect(renderDanger()).toMatchSnapshot();
  });

  it('should render dot and pulse effect correctly', () => {
    const { container } = render(
      <Badge showDot={true} pulse={true}>
        Canlı
      </Badge>
    );
    const dot = container.querySelector('.animate-pulse');
    expect(dot).not.toBeNull();
  });
});
