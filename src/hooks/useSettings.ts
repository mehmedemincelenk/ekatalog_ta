import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_COMPANY, STORAGE } from '../data/config';

export interface CompanySettings {
  whatsapp: string;
  address: string;
  instagram: string;
  title: string;
  subtitle: string;
}

export function useSettings(isAdmin: boolean) {
  const [settings, setSettings] = useState<CompanySettings>({
    whatsapp: DEFAULT_COMPANY.phone,
    address: DEFAULT_COMPANY.address,
    instagram: DEFAULT_COMPANY.instagramUrl,
    title: DEFAULT_COMPANY.name,
    subtitle: DEFAULT_COMPANY.tagline,
  });
  
  const [loading, setLoading] = useState(true);

  // Uygulama açılışında ayarları çek (Cache ile hızlandır)
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE.productsCache + '_settings');
    if (cached) {
      try { setSettings(JSON.parse(cached)); } catch (e) {}
    }

    const fetchSettings = async () => {
      const url = import.meta.env.VITE_SHEET_SCRIPT_URL;
      if (!url) return;
      try {
        const res = await fetch(url, {
          method: 'POST',
          mode: 'no-cors', // Google Script CORS workaround
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'GET_SETTINGS' }),
        });
        
        // no-cors modunda response.body okunamadığı için, scriptin bu veriyi döndürmesi zor olabilir.
        // Aslında daha önce fetch().then(res => res.text()) şeklinde başarılı olmuştuk.
        // Eğer no-cors sorun olursa, fetch(url + "?action=GET_SETTINGS") şeklinde GET isteği veya jsonp kullanılabilir.
        // Veya daha önce denediğimiz text/plain POST metodu işe yarıyor olabilir. 
      } catch (err) {
        console.error('[ERR] Settings fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    // Google script no-cors ile JSON okuyamayacağımız için 
    // Ayarları Products datasıyla birlikte veya GET ile çekmemiz lazım.
    // Ancak Apps Script'i sadece POST için yazmıştık.
    // Aslında no-cors ile response texti de boş gelir. 
    // O yüzden ayarlamaları ürün datası csv'sinden alamıyoruz.
    // Bunu geçici olarak LocalStorage'dan yöneteceğiz, 
    // veya tam entegrasyon için bir GET endpoint eklenecek.
  }, []);

  const updateSetting = useCallback(async (key: keyof CompanySettings, value: string) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE.productsCache + '_settings', JSON.stringify(next));
      return next;
    });

    if (isAdmin) {
      const url = import.meta.env.VITE_SHEET_SCRIPT_URL;
      if (!url) return;
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'UPDATE_SETTINGS', key, value }),
        });
      } catch (e) {
        console.error('Update setting error', e);
      }
    }
  }, [isAdmin]);

  return { settings, updateSetting, loading };
}
