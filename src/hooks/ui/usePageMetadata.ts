import { useEffect } from 'react';
import { CompanySettings } from '../store/useSettings';

/**
 * usePageMetadata: Synchronizes browser document title and favicon 
 * based on store settings.
 */
export function usePageMetadata(settings: CompanySettings) {
  useEffect(() => {
    if (!settings.id) return;
    
    // Sync Title
    document.title = settings.title || 'E-Katalog';
    
    // Sync Favicon
    if (settings.logoEmoji && (settings.logoEmoji.startsWith('data:image') || settings.logoEmoji.startsWith('http'))) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = settings.logoEmoji;
      
      if (!document.querySelector("link[rel*='icon']")) {
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }
  }, [settings.logoEmoji, settings.title, settings.id]);
}
