import { TECH } from '../data/config';

/**
 * PRICE UTILS (INVENTORY & CURRENCY CALCULATION)
 * -----------------------------------------------------------
 * Specialized arithmetic tools for handling localized currency formatting and logic.
 * Driven by central COMMERCE design tokens.
 */

const { commerce } = TECH;

/**
 * transformCurrencyStringToNumber: Converts localized price strings into pure numbers.
 * Handles: "1.250,50", "1,250.50", "1250,50", "1250.50", "₺1.250,50"
 * @param localizedPrice - The raw currency string from UI or storage.
 */
export const transformCurrencyStringToNumber = (localizedPrice: string | number): number => {
  if (typeof localizedPrice === 'number') return localizedPrice;
  if (!localizedPrice) return 0;

  // 1. Remove currency symbols and non-numeric/separator characters
  let cleanValue = localizedPrice.toString().replace(/[^\d.,]/g, '');

  // 2. Logic to determine decimal vs thousand separator:
  // We look for the LAST separator (comma or dot).
  const lastDotIndex = cleanValue.lastIndexOf('.');
  const lastCommaIndex = cleanValue.lastIndexOf(',');

  if (lastDotIndex > lastCommaIndex) {
    // Dot is likely the decimal (International style: 1,250.50)
    // Remove all commas and keep the dot
    cleanValue = cleanValue.replace(/,/g, '');
  } else if (lastCommaIndex > lastDotIndex) {
    // Comma is likely the decimal (Turkish style: 1.250,50)
    // Remove all dots and replace comma with dot for parseFloat
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  } else {
    // Only one type of separator or none at all (e.g., "1250,50" or "1250.50")
    cleanValue = cleanValue.replace(',', '.');
  }

  const result = parseFloat(cleanValue);
  return isNaN(result) ? 0 : result;
};

/**
 * formatNumberToCurrency: Converts pure numbers back into localized currency strings.
 * Uses TECH.commerce for internationalization.
 * @param numericalAmount - The mathematical value to be formatted.
 */
export const formatNumberToCurrency = (numericalAmount: number): string => {
  return new Intl.NumberFormat(commerce.locale, {
    style: 'currency',
    currency: commerce.currency,
    minimumFractionDigits: 2,
  }).format(numericalAmount);
};

/**
 * calculatePromotionalPrice: Applies a discount rate to a localized price and returns the formatted result.
 * @param originalPriceString - The baseline price label.
 * @param discountRate - The decimal percentage (e.g., 0.1 for 10%).
 */
export const calculatePromotionalPrice = (originalPriceString: string, discountRate: number): string => {
  const mathematicalBasePrice = transformCurrencyStringToNumber(originalPriceString);
  if (mathematicalBasePrice === 0) return originalPriceString;
  
  // Logic: Discounted Price = Base * (1 - Rate)
  const finalizedDiscountedPrice = mathematicalBasePrice * (1 - discountRate);
  return formatNumberToCurrency(finalizedDiscountedPrice);
};
