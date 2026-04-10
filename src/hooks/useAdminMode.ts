import { useState, useCallback, useRef } from 'react';
import { TECH, STORAGE } from '../data/config';

/**
 * USE ADMIN MODE HOOK (GÜVENLİK VE YETKİ)
 * --------------------------------------
 * Bir girişimci olarak bu dosya senin "Dijital Anahtarındır".
 * 
 * 1. Gizli Giriş: Şifre ekranı yerine, logonun üzerine belirlenen sayıda (Config: TECH.adminTriggerClicks) 
 *    tıklayarak mağaza yönetimini açmanı sağlar.
 * 2. Oturum Hafızası: Admin modunu bir kez açtığında, tarayıcıyı kapatsan bile 'STORAGE.adminSession' 
 *    sayesinde sistem seni tanımaya devam eder.
 * 3. Akıllı Sıfırlama: Tıklamalar arasında çok uzun süre geçerse (Config: TECH.adminResetDelay), 
 *    mağaza güvenliği için sayacı otomatik sıfırlar.
 */
export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(() => {
    const session = localStorage.getItem(STORAGE.adminSession);
    return !!session;
  });

  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * handleLogoClick (GİZLİ KAPI):
   * Her logoya tıklandığında tetiklenir.
   */
  const handleLogoClick = useCallback(() => {
    // Varsa eski sıfırlama zamanlayıcısını iptal et.
    if (timerRef.current) clearTimeout(timerRef.current);

    clickCountRef.current += 1;

    // Hedef tıklama sayısına ulaşıldı mı?
    if (clickCountRef.current >= TECH.adminTriggerClicks) {
      setIsAdmin(true);
      // Hafızaya "Admin içeride" notu düş.
      localStorage.setItem(STORAGE.adminSession, 'active_' + Date.now());
      clickCountRef.current = 0;
    }

    // Belirlenen süre içinde tekrar tıklanmazsa sayacı temizle (Güvenlik Kuralı).
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, TECH.adminResetDelay);
  }, []);

  /**
   * logout (KİLİTLEME):
   * Admin modunu kapatır ve anahtarı çöpe atar.
   */
  const logout = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAdmin(false);
    localStorage.removeItem(STORAGE.adminSession);
    clickCountRef.current = 0;
  }, []);

  return { isAdmin, handleLogoClick, logout };
}
