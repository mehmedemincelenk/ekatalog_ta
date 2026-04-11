---
name: mobile-first
description: Mobil öncelikli (Mobile-First) ve duyarlı (Responsive) tasarım prensiplerini yönetir. Kullanıcının hem mobil cihazlarda hem de masaüstünde kusursuz, performanslı ve Apple standartlarında bir deneyim yaşamasını sağlar.
---

# Mobile-First & Responsive Tasarım Rehberi

Bu beceri, uygulamanın arayüzünü en küçük ekrandan (mobil) başlayarak en büyük ekrana (PC) kadar kusursuz bir hiyerarşiyle inşa etmeni sağlar.

## 1. Temel Prensipler

### Mobil Öncelikli Zihin Yapısı (Mobile-First)
- **İçerik Odaklılık:** En küçük ekranda sadece en önemli içeriği göster. PC'ye doğru genişledikçe detayları ekle.
- **Performans:** Mobil ağlar daha yavaştır. Resimleri optimize et (LQ/HQ), gereksiz kütüphanelerden kaçın.
- **Kademeli Geliştirme (Progressive Enhancement):** Temel fonksiyon mobil de çalışsın, masaüstünde ek özellikler kazansın.

### Responsive (Duyarlı) Dinamikler
- **Esnek Yapılar:** `px` yerine `%`, `rem`, `vw/vh` kullan.
- **Izgara (Grid) Sistemi:** Mobilde tek sütun, masaüstünde 2, 3 veya 4 sütun yapısını koru.
- **Medya Sorguları (Media Queries):** 
  - `sm`: 640px (Geniş telefonlar)
  - `md`: 768px (Tabletler)
  - `lg`: 1024px (Masaüstü)
  - `xl`: 1280px (Geniş Ekranlar)

## 2. Tasarım ve Etkileşim Kuralları

### Dokunmatik Hedefler (Apple Standartları)
- **Parmak Dostu:** Tıklanabilir her alan en az **44x44px** olmalıdır.
- **Aralıklar:** Butonlar ve linkler arasında kazara tıklamaları önleyecek boşluklar bırak.
- **Geri Bildirim:** Tıklama anında görsel tepki (scale-95, renk değişimi) sağla.

### Tipografi ve Okunabilirlik
- **Hiyerarşi:** Başlıklar (H1, H2) net, gövde metni ferah olsun.
- **Dinamik Font:** `clamp(1rem, 2vw, 1.5rem)` gibi fonksiyonlarla ekran büyüdükçe fontun akıllıca büyümesini sağla.
- **Satır Aralığı:** Okunabilirlik için `leading-relaxed` (1.5 - 1.6) tercih et.

### Görsel Estetik (Apple Sadeliği)
- **Whitespace (Beyaz Boşluk):** Öğeleri birbirine sıkıştırma. Boşluk bir tasarım öğesidir.
- **Yumuşak Köşeler:** `rounded-2xl` veya `rounded-3xl` kullanarak modern bir hava kat.
- **Bulanıklık (Blur):** `backdrop-blur-xl` ile derinlik ve katman hissi oluştur.

## 3. Uygulama Stratejisi

### Grid Yapısı Örneği (Tailwind)
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- İçerik mobilde tek, tabletde iki, PC'de üç sütun olur -->
</div>
```

### Görsel Yönetimi
- **Lazy Loading:** Ekranın altında kalan resimleri sadece görünür olunca yükle.
- **Aspect Ratio:** Resimlerin yüklenirken mizanpajı kaydırmaması için `aspect-square` veya `aspect-video` kullan.

### Navigasyon
- **Mobilde:** Alt bar veya "Hamburger" menü.
- **Masaüstünde:** Yatay üst bar.
- **Başparmak Alanı:** Önemli butonları ekranın alt yarısında (başparmağın rahat ulaştığı yer) tut.
