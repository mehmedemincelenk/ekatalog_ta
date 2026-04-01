---
trigger: always_on
---

---
name: catalog-core-rules
description: B2B Katalog mimarisi ve temel UI/UX kuralları.
---
# B2B KATALOG ANAYASASI

## 1. Veri Yönetimi (No-DB Policy)
- Veritabanı kurulumu KESİNLİKLE YASAKTIR.
- Tüm veriler `localStorage` üzerinde bir JSON dizisi olarak tutulacaktır.
- Resimler, Base64 formatına dönüştürülmeden **önce** mutlaka client-side sıkıştırma (downscale) işlemine tabi tutulacaktır.
- iOS/Safari cihazlar için 5MB sınırı kritik eşiktir; bu sınır asla aşılmayacak şekilde savunmacı bir `try/catch` mekanizması kullanılacaktır.

## 2. Merkezi Konfigürasyon (Centralized Config)
- Telefon, adres, marka ismi, renk kodları ve para birimi gibi tüm statik veriler `src/data/config.js` dosyasındaki merkezi `CONFIG` objelerinde tutulur.
- Kod içinde hiçbir "hard-coded" sayısal veya metin sabiti bırakılamaz.

## 3. Admin Toggle Mantığı
- Giriş: Footer logosuna 2 saniye içinde 7 kez ardışık tıklama.
- Çıkış: Admin modu açıkken footer logosuna 1 kez tıklama.

## 4. Tasarım Dili ve Renk Paleti (Zorunlu)
- **Renk Paleti:** Karton Rengi (Kraft/Bej/Toprak tonları), Beyaz ve Siyah.
- **Para Birimi:** Fiyat değerlerinin yanına otomatik `₺` simgesi eklenmelidir.

## 5. Sabit UI Bileşenleri (Zorunlu)
- **Navbar:** Logo, WhatsApp ikonu, Telefon Numarası ve Adres.
- **Header:** Otomatik geçişli Carousel ve vizyon metni.
- **Kategoriler:** `config.js` içindeki `CATEGORY_ORDER` dizisine (Gıda & Sos → Temizlik → Ambalaj → … → Özel Setler) göre sıralanır. Alfabetik sıra **yasaktır**.
- **Ürün Kartları:** Her kartın bir görseli, adı, açıklaması (description) ve fiyatı vardır. Kategori etiketi sadece Admin modunda görünür.

## 6. Ürün Veri Semantiği
- Ürün adı (name): Sadece ürünün öz adını içerir (ör: "Hışır", "Alüminyum Kap").
- Açıklama (description): Miktar, gramaj, ebat, renk gibi tüm teknik detaylar buradadır.
- Aynı üründen farklı gramajlar varsa, her biri ayrı bir satır kaydı olarak tutulur.

## 7. SEO ve Dil
- Tüm UI etiketleri ve placeholder'lar yüksek kaliteli Türkçe olmalıdır.