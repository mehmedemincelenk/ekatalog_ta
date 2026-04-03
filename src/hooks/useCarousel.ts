import { useState, useEffect } from 'react';
import { CAROUSEL } from '../data/config';

const STORAGE_KEY = 'toptanambalaj_carousel_v1';

interface Slide {
  id: number;
  src: string;
  bg: string;
  label: string;
  sub: string;
}

export function useCarousel() {
  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : CAROUSEL.slides;
    } catch {
      return CAROUSEL.slides;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    } catch (err) {
      console.error('Carousel Storage Hatası:', err);
      alert('Slayt görseli kaydedilemedi. Hafıza kotası dolmuş olabilir.');
    }
  }, [slides]);

  const updateSlide = (id: number, changes: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...changes } : s)),
    );
  };

  return { slides, updateSlide };
}
