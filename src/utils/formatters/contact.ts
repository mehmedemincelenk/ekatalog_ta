/**
 * Formats a raw phone string into a valid WhatsApp URL.
 * Removes spaces and adds the wa.me prefix.
 */
export const formatWhatsAppUrl = (phone: string, message?: string) => {
  const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
  const baseUrl = `https://wa.me/${cleanPhone}`;
  
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  
  return baseUrl;
};
