import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

/**
 * MAIN.TSX (PROJE ATEŞLEME NOKTASI)
 * --------------------------------
 * Bir kurucu olarak bu dosya senin "Ana Şalterin"dir.
 * 
 * 1. Hayata Geçiş: Yazdığımız binlerce satır kodun, internet tarayıcısındaki o boş beyaz 
 *    sayfaya (index.html) ilk temas ettiği ve canlandığı yer burasıdır.
 * 2. Sistemsel Koruma (StrictMode): Uygulamanı sürekli denetleyen görünmez bir "Kalite Kontrolcü" 
 *    devreye sokar. Hatalı bir kod yazıldığında seni uyarır.
 * 3. Tek Giriş İlkesi: Uygulamanın tüm karmaşıklığı burada 'App' bileşeni altında toplanır 
 *    ve tarayıcıya "Bunu göster" talimatı verilir.
 */

// PWA: Register Service Worker for home screen installation and updates
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
