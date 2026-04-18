/**
 * CONTACT FORMATTERS
 * -----------------------------------------------------------
 * Tools for formatting phone numbers, WhatsApp URLs, and social media handles.
 */

/**
 * formatWhatsAppUrl: Converts a raw phone string into a direct WhatsApp chat link.
 */
export const formatWhatsAppUrl = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}`;
};

/**
 * cleanSocialHandle: Removes '@' prefix or full URLs to return a pure username.
 * Useful for Instagram, Twitter, etc.
 * Input Examples: "@username", "https://instagram.com/username", "username"
 */
export const cleanSocialHandle = (input: string): string => {
  if (!input) return '';
  return input
    .trim()
    .replace(/^@/, '') // Remove leading @
    .replace(/https?:\/\/(www\.)?instagram\.com\//, '') // Remove IG URL
    .replace(/https?:\/\/(www\.)?twitter\.com\//, '')   // Remove Twitter URL
    .replace(/\/$/, ''); // Remove trailing slash if any
};
