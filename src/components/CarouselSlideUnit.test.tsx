import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import CarouselSlideUnit from './CarouselSlideUnit';

// Mocking dependencies to ensure stable snapshots
vi.mock('../utils/image', () => ({
  resolveVisualAssetUrl: (url: string) => url,
}));

describe('CarouselSlideUnit (Diamond Snapshot)', () => {
  const mockSlide = {
    id: 1,
    src: 'https://example.com/slide1.jpg',
    bg: 'bg-stone-200',
    label: 'Test Başlığı',
    sub: 'Test Açıklaması',
  };

  it('Aktif slide görünümü snapshot ile eşleşmeli', () => {
    const { asFragment } = render(
      <CarouselSlideUnit
        slideData={mockSlide}
        isCurrentlyActive={true}
        isAdmin={false}
        isCurrentlyUploading={false}
        currentIndex={1}
        totalSlides={3}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Pasif (Ghost) slide görünümü snapshot ile eşleşmeli', () => {
    const { asFragment } = render(
      <CarouselSlideUnit
        slideData={mockSlide}
        isCurrentlyActive={false}
        isAdmin={false}
        isCurrentlyUploading={false}
        currentIndex={1}
        totalSlides={3}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Admin modunda aktif slide görünümü snapshot ile eşleşmeli', () => {
    const { asFragment } = render(
      <CarouselSlideUnit
        slideData={mockSlide}
        isCurrentlyActive={true}
        isAdmin={true}
        isCurrentlyUploading={false}
        currentIndex={1}
        totalSlides={3}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
