import { useState, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 
 * Verileri localStorage üzerinde güvenli ve tip güvenli bir şekilde saklar.
 * Kota aşımı veya erişim hatalarını yakalar.
 * 
 * @param key - Saklanacak anahtar (key)
 * @param initialValue - Varsayılan değer
 * @returns [storedValue, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // İlk değeri al
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`LocalStorage reading error for key "${key}":`, error);
      return initialValue;
    }
  });

  // Değeri güncelle
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Fonksiyonel güncellemeyi destekle
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Kota aşımı (QuotaExceededError) kontrolü
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.error('LocalStorage doldu! Veri kaydedilemedi.');
        alert('Tarayıcı hafızası dolu olduğu için ayarlarınız kaydedilemedi. Lütfen tarayıcı verilerini temizleyin.');
      } else {
        console.error(`LocalStorage writing error for key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
