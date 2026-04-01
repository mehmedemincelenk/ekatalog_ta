---
trigger: always_on
---

---
name: interaction-rules
description: Admin etkileşimleri ve yerinde düzenleme kuralları.
---
# ETKİLEŞİM VE UI KURALLARI

## 1. Hızlı Düzenleme (In-place Edit)
- Admin modunda bir ürünün **Adına, Fiyatına veya Kategori Etiketine** tıklandığında alan doğrudan düzenlenebilir hale gelmelidir (`contentEditable`).
- Resme tıklandığında cihazın yerel dosya seçicisi açılır. Seçilen görsel sıkıştırılarak (downscale) base64'e çevrilir.

## 2. Silme ve Aksiyonlar (Üç-Nokta Popover Menüsü)
- Ürün kartı üzerindeki 3-nokta (⋯) ikonu, silme ve diğer admin aksiyonlarının tetikçisidir.
- `window.confirm` ile onay alınır.
- **NOT:** Uygulamamızda "çift tıklayarak silme" (double-tap/double-click) özelliği YOKTUR ve EKLENMEMELIDIR. Bu gereksiz bir UX karmaşıklığıdır.

## 3. Dinamik Kategoriler
- Ürünlerden taranan benzersiz (unique) kategoriler, `config.js` içindeki `CATEGORY_ORDER` dizisine göre sıralanarak filtrelerde gösterilir.
- "Tümü" filtresi her zaman ilk sıradadır.

## 4. Filtre Davranışı
- Filtreler çoklu seçime izin verir (birden fazla kategori aynı anda aktif olabilir).
- Filtre menüsü; PC'de arama kutusunun yanında yatay flex-wrap olarak, mobilde aynı şekilde arama kutusunun altında flex-wrap olarak görünür.
- Filtre menüsü kullanıcı açıkça kapatana kadar (X butonu veya dış alana tıklama) kapanmaz.