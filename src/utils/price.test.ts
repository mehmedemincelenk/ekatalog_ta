import { describe, it, expect } from 'vitest';
import { parsePrice, formatPrice, calculateDiscount } from './price';

describe('Price Utils', () => {
  describe('parsePrice', () => {
    it('should parse "₺150,50" correctly', () => {
      expect(parsePrice('₺150,50')).toBe(150.5);
    });

    it('should parse "150.50 ₺" correctly', () => {
      expect(parsePrice('150.50 ₺')).toBe(150.5);
    });

    it('should return 0 for empty string', () => {
      expect(parsePrice('')).toBe(0);
    });

    it('should handle comma as decimal separator', () => {
      expect(parsePrice('100,5')).toBe(100.5);
    });
  });

  describe('formatPrice', () => {
    it('should format 150.5 correctly', () => {
      const formatted = formatPrice(150.5);
      // Hem "₺150,50" hem de "150,50 ₺" varyasyonlarını ve boşluk tiplerini kapsar
      expect(formatted).toMatch(/₺?\s?150,50\s?₺?/);
    });
  });

  describe('calculateDiscount', () => {
    it('should apply 10% discount correctly', () => {
      const discounted = calculateDiscount('₺100,00', 0.1);
      expect(discounted).toMatch(/₺?\s?90,00\s?₺?/);
    });

    it('should return original if price is 0', () => {
      expect(calculateDiscount('₺0,00', 0.1)).toBe('₺0,00');
    });
  });
});
