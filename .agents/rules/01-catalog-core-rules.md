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
- Resimler, `base64` formatına dönüştürülerek JSON içinde saklanacaktır.

## 2. Merkezi Konfigürasyon (Centralized Config)
- Telefon, adres, marka ismi, renk kodları ve para birimi sembolü gibi tüm statik veriler kodun en başında merkezi bir `CONFIG` objesi içerisinde tutulmalı ve tüm uygulama boyunca bu değişkenler kullanılmalıdır.

## 3. Admin Toggle Mantığı
- Giriş: Footer logosuna 2 saniye içinde 7 kez ardışık tıklama.
- Çıkış: Admin modu açıkken footer logosuna 1 kez tıklama.

## 4. Tasarım Dili ve Renk Paleti (Zorunlu)
- **Renk Paleti:** Karton Rengi (Kraft/Bej/Toprak tonları), Beyaz ve Siyah. 
- **Para Birimi:** Fiyat değerlerinin yanına otomatik "₺" simgesi eklenmelidir.

## 5. Sabit UI Bileşenleri (Zorunlu)
- **Navbar:** Logo, WhatsApp ikonu, Telefon Numarası ve Adres.
- **Header:** 3 saniyelik Carousel ve vizyon metni.
- **Kategoriler:** "Tümü" hariç tüm kategoriler alfabetik olarak sıralanmalıdır.

## 6. SEO ve Dil
- Tüm UI etiketleri ve placeholder'lar yüksek kaliteli Türkçe olmalıdır.