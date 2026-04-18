---
name: code
description: Senior seviye mühendislik standartları; temiz kod, modüler mimari, A-seviye İngilizce isimlendirme ve Design Token senkronizasyonunu yönetir.
---

# Code & Architecture Excellence (Teknik Mükemmellik Rehberi)

Bu rehber, projenin yapısal bütünlüğünü, profesyonel netliğini ve SaaS (Çoklu Mağaza) uyumluluğunu garanti altına alan en üst düzey teknik direktifleri içerir.

## 1. Mimari Bütünlük & SaaS Hazırlığı
**Felsefe:** Kod "kör" olmalı, tüm görsel ve metinsel irade `config.ts` üzerinden yönetilmelidir.
- **100% Aktif Design Tokens:** `.tsx` dosyaları içinde Tailwind sınıfları veya ham değerler (renk, boşluk) doğrudan yazılmamalıdır. Her zaman `src/data/config.ts` içindeki `THEME` objesi referans alınmalıdır.
- **Konfigürasyon Odaklılık:** Mağazanın tüm görünümü ve davranışı sadece `config.ts` değiştirilerek güncellenebilmelidir.
- **Mantık İzolesi (Hook Pattern):** Bileşenler sadece **GÖRSEL** (stateless/dumb) olmalıdır. Veri manipülasyonu, API çağrıları ve karmaşık mantık `src/hooks` içindeki özel hook'lara taşınmalıdır.

## 2. Mühendislik Standartları (Clean Code)
**Felsefe:** Sürdürülebilir, okunabilir ve test edilebilir bir kod tabanı.
- **Tek Sorumluluk Prensibi (SRP):** Her dosya sadece bir işi mükemmel yapmalıdır. Bir bileşen/dosya **150 satırı** aşıyorsa mantıksal alt parçalara bölünmelidir.
- **Strict Typing (TypeScript):** Tüm proplar ve fonksiyonlar için net `interface` tanımlanmalıdır. `any` kullanımı kesinlikle yasaktır.
- **Bileşen Hiyerarşisi:**
  - `src/components/ui`: Her yerde kullanılabilen atomik öğeler (Buton, Modal).
  - `src/components/[feature]`: Özelliğe özel modüller (Product, Admin).

## 3. İsimlendirme Mükemmelliği (A-Level English)
**Felsefe:** Kod kendi kendini belgelemelidir (Self-documenting).
- **Netlik > Kısalık:** Profesyonel İngilizce kullanılmalı, kısaltmalardan kaçınılmalıdır (`prod` -> `product`, `cat` -> `category`).
- **Standart Kalıplar:**
  - Bileşenler: `PascalCase` (Örn: `ProductGrid`)
  - Değişkenler/Fonksiyonlar: `camelCase` (Örn: `isUserAuthenticated`)
  - Hook'lar: `use` ile başlamalı (Örn: `useDiscount`)

## 4. Performans & Optimizasyon
- **Render Kontrolü:** Ağır bileşenlerde `React.memo`, gereksiz render'ları önlemek için `useCallback` ve `useMemo` stratejik olarak kullanılmalıdır.
- **Asset Yönetimi:** Resimlerde her zaman `loading="lazy"`, `aspect-ratio` ve LQIP (Low-Quality Image Placeholder) stratejisi izlenmelidir.
- **Smart Refactoring:** Fonksiyonelliği bozmadan kodu sürekli daha modern ve performanslı hale getir.

## 5. Doğrulama İş Akışı (Checklist)
1. **İsimlendirme:** Değişken ve fonksiyon isimleri profesyonel İngilizce mi?
2. **Design Tokens:** Tüm UI değerleri `THEME` objesinden mi geliyor?
3. **Modülerlik:** Dosya 150 satırı geçiyor mu? Mantık hook'a taşındı mı?
4. **Tip Güvenliği:** TypeScript tanımları eksiksiz ve `any` içermiyor mu?

---
*Kod bir araçtır, mimari ise vizyonun kalıcılığını sağlar.*
