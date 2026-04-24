import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TECH, commerce } from '../data/config';
import { ExchangeRates, Product } from '../types';

/**
 * CORE UTILITIES (DIAMOND ENGINE)
 * -----------------------------------------------------------
 * The unified nerve center for UI merging, price logic, 
 * store resolution, and text normalization.
 */

// --- 0. DATA CONVERTERS ---

/**
 * fileToBase64: Universal converter for files/blobs.
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
}

/**
 * base64ToBlob: Reconstructs images from API responses.
 */
export function base64ToBlob(base64: string, mime: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

// --- 1. UI HELPERS ---

/**
 * cn: Class Name Merger - Intelligently merges Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 2. STORE & CONTACT UTILS ---

/**
 * getActiveStoreSlug: Resolves the active store slug from URL or Environment.
 */
export const getActiveStoreSlug = (): string => {
  if (typeof window === 'undefined') return 'main-site';

  const hostname = window.location.hostname.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get('main') === '1') return 'main-site';

  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('172.') ||
    hostname.startsWith('10.') ||
    (import.meta.env && import.meta.env.DEV)
  ) {
    let envSlug = import.meta.env.VITE_STORE_SLUG;
    if (envSlug) envSlug = envSlug.replace(/-/g, '');
    return envSlug && envSlug !== 'mainsite' ? envSlug : 'toptanambalajcim';
  }

  const parts = hostname.split('.');
  if (parts.length <= 2 || (parts.length === 3 && parts[0] === 'www')) {
    return 'main-site';
  }

  return parts[0];
};

/**
 * generateWhatsAppLink: Creates a professional encoded WhatsApp API link.
 */
export const generateWhatsAppLink = (
  number: string,
  message?: string,
): string => {
  const cleanNumber = (number || '').replace(/\D/g, '');
  const encodedText = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${encodedText ? `?text=${encodedText}` : ''}`;
};

/**
 * reorderArray: Moves an item within an array (Immutable).
 */
export const reorderArray = <T>(
  array: T[],
  oldIndex: number,
  newIndex: number,
): T[] => {
  const result = Array.from(array);
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);
  return result;
};

// --- 3. PRICE & CURRENCY UTILS ---

const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/TRY';

/**
 * fetchCurrentRates: Fetches real-time exchange rates.
 */
export async function fetchCurrentRates(): Promise<ExchangeRates | null> {
  try {
    const response = await fetch(EXCHANGE_API_URL);
    if (!response.ok) throw new Error('Currency API error');
    const data = await response.json();
    return {
      usd: parseFloat((1 / data.rates.USD).toFixed(4)),
      eur: parseFloat((1 / data.rates.EUR).toFixed(4)),
      lastUpdate: data.time_last_updated,
    };
  } catch (error) {
    console.error('Failed to fetch currency rates:', error);
    return null;
  }
}

/**
 * transformCurrencyStringToNumber: Converts localized price strings into numbers.
 */
export const transformCurrencyStringToNumber = (
  localizedPrice: string | number,
): number => {
  if (typeof localizedPrice === 'number') return localizedPrice;
  if (!localizedPrice) return 0;

  let cleanValue = localizedPrice.toString().replace(/[^\d.,]/g, '');
  const lastDotIndex = cleanValue.lastIndexOf('.');
  const lastCommaIndex = cleanValue.lastIndexOf(',');

  if (lastDotIndex > lastCommaIndex) {
    cleanValue = cleanValue.replace(/,/g, '');
  } else if (lastCommaIndex > lastDotIndex) {
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  } else {
    cleanValue = cleanValue.replace(',', '.');
  }

  const result = parseFloat(cleanValue);
  return isNaN(result) ? 0 : result;
};

/**
 * formatNumberToCurrency: Localized currency formatting.
 */
export const formatNumberToCurrency = (
  numericalAmount: number,
  targetCurrency: 'TRY' | 'USD' | 'EUR' = 'TRY',
  exchangeRates?: { usd: number; eur: number },
): string => {
  let convertedAmount = numericalAmount;
  let activeCurrencyCode = TECH.commerce.currency;

  if (targetCurrency !== 'TRY' && exchangeRates) {
    if (targetCurrency === 'USD' && exchangeRates.usd > 0) {
      convertedAmount = numericalAmount / exchangeRates.usd;
      activeCurrencyCode = 'USD';
    } else if (targetCurrency === 'EUR' && exchangeRates.eur > 0) {
      convertedAmount = numericalAmount / exchangeRates.eur;
      activeCurrencyCode = 'EUR';
    }
  }

  return new Intl.NumberFormat(TECH.commerce.locale, {
    style: 'currency',
    currency: activeCurrencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount);
};

/**
 * calculatePromotionalPrice: Applies discount to a price string.
 */
export const calculatePromotionalPrice = (
  originalPriceString: string,
  discountRate: number,
): string => {
  const mathematicalBasePrice = transformCurrencyStringToNumber(originalPriceString);
  if (mathematicalBasePrice === 0) return originalPriceString;
  const finalizedDiscountedPrice = mathematicalBasePrice * (1 - discountRate);
  return formatNumberToCurrency(finalizedDiscountedPrice);
};

/**
 * standardizePriceInput: Ensures standard "₺1.250" format.
 */
export const standardizePriceInput = (input: string): string => {
  let cleanValue = (input || '').trim();
  if (!cleanValue) return '';
  if (!cleanValue.startsWith('₺') && !isNaN(transformCurrencyStringToNumber(cleanValue))) {
    cleanValue = '₺' + cleanValue;
  }
  return cleanValue;
};

// --- 4. TEXT & SEARCH UTILS ---

/**
 * normalizeText: Professional Turkish-aware text normalization.
 */
export const normalizeText = (text: string): string => {
  return (text || '')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
};

/**
 * smartSearch: Professional fuzzy search with weighted scoring.
 */
export const smartSearch = (query: string, products: Product[]): Product[] => {
  if (!query) return products;
  const q = normalizeText(query);
  const words = q.split(/\s+/).filter(Boolean);

  return products.map(p => {
    const name = normalizeText(p.name || '');
    const desc = normalizeText(p.description || '');
    const cat = normalizeText(p.category || '');
    let score = 0;
    if (name === q) score += 1000;
    if (name.startsWith(q)) score += 500;
    words.forEach(w => {
      if (name.includes(w)) score += 100;
      if (desc.includes(w)) score += 20;
      if (cat.includes(w)) score += 50;
    });
    return { p, score };
  }).filter(i => i.score > 0).sort((a, b) => b.score - a.score).map(i => i.p);
};
