/**
 * parsePrice
 * "₺150,50" veya "150.50 ₺" gibi metinleri sayıya (150.5) çevirir.
 */
export const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  // Sadece rakam, virgül ve noktayı tut
  const cleaned = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

/**
 * formatPrice
 * Sayıyı tekrar "₺150,00" formatına çevirir.
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * calculateDiscount
 * İndirim oranını uygular.
 */
export const calculateDiscount = (price: string, rate: number): string => {
  const original = parsePrice(price);
  if (original === 0) return price;
  const discounted = original * (1 - rate);
  return formatPrice(discounted);
};
