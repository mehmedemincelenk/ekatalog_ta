import { useState, useEffect } from 'react';

export const PRICING_PHRASES = [
  "aylık bir koli bandı fiyatına",
  "aylık büyük boy çay fiyatına ",
  "aylık sadece 5L süt fiyatına ",
  "aylık bi bardak kahve fiyatına"
];

export function usePricingRotation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PRICING_PHRASES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    currentPhrase: PRICING_PHRASES[index]
  };
}
