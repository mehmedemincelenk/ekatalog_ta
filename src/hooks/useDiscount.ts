import { useState, useCallback } from 'react';

export type ActiveDiscount = {
  code: string;
  rate: number;
};

/**
 * useDiscount Hook
 * Dinamik Kupon Mantığı: Kodun sonundaki sayıyı direkt indirim oranı kabul eder.
 * Örnek: KOD25 -> %25, OZEL10 -> %10, ABC5 -> %5
 */
export function useDiscount() {
  const [activeDiscount, setActiveDiscount] = useState<ActiveDiscount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyCode = useCallback((input: string) => {
    const code = input.toUpperCase().trim();

    if (!code) {
      setActiveDiscount(null);
      setError(null);
      return;
    }

    // Regex: Metnin sonundaki tüm rakamları yakala
    const match = code.match(/(\d+)$/);

    if (match && match[1]) {
      const discountPercent = parseInt(match[1], 10);

      // Makul bir indirim oranı kontrolü (%1 - %99)
      if (discountPercent > 0 && discountPercent <= 99) {
        setActiveDiscount({
          code: code,
          rate: discountPercent / 100
        });
        setError(null);
      } else {
        setActiveDiscount(null);
        setError('Geçersiz indirim oranı!');
        setTimeout(() => setError(null), 3000);
      }
    } else {
      setActiveDiscount(null);
      setError('Geçersiz kod!');
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  return { activeDiscount, applyCode, error };
}
