import { useState, useEffect } from 'react';

export const PRICING_PHRASES = [
  "aylık bir koli bandı fiyatına",
  "aylık büyük boy çay fiyatına ",
  "aylık sadece 5L süt fiyatına ",
  "aylık bi bardak kahve fiyatına"
];

export function usePricingRotation(phrases: string[] = PRICING_PHRASES) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [phrases]);

  return {
    currentPhrase: phrases[index] || ''
  };
}
