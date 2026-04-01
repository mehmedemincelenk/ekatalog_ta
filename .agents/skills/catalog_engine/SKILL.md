---
name: catalog_engine
description: Ürün CRUD işlemlerini, kategori yönetimini ve reyon bazlı görünümü yönetir.
---
# Ürün Yönetim Motoru

## 1. Veri Akışı
- Tüm ürünler `localStorage`'dan `useProducts` hook'u ile okunur/yazılır.
- Ürünler düz bir dizi (flat array) olarak saklanır. Gruplama **sadece render sırasında** yapılır.
- Storage anahtarı versiyonlanır: `toptanambalaj_products_vX`. Veri yapısı değiştiğinde `X` artırılır.

## 2. Kategori Yönetimi
- Kategoriler ürünlerden dinamik olarak türetilir (`[...new Set(products.map(p => p.category))]`).
- Sıralama **kesinlikle alfabetik değildir**. `config.js` içindeki `CATEGORY_ORDER` dizisi ve `sortCategories()` fonksiyonu kullanılır.
- Kategoriler sırası: Gıda & Sos → Temizlik & Kağıt → Ambalaj → Poşet → Alüminyum → Streç & Folyo → Baskılı Ürünler → Özel Setler.
- Yeni eklenen kategori bu listenin dışındaysa en sona düşer (index 999).

## 3. Reyon Bazlı Görünüm (ProductGrid)
- `ProductGrid` ürünleri category'ye göre `reduce` ile gruplar.
- Her grup üst başlık (reyon adı) + kart grid'i şeklinde render edilir.
- Başlık stili `config.js > GRID.headerClass` değişkeninden alınır.
- `ProductGrid` dışarıdan `categories` prop'u **almaz**; kendi içinde hesaplar.

## 4. Ürün Kartı (ProductCard)
- Admin modunda: Kategori etiketi görünür (tıklanabilir, düzenlenebilir). 3-nokta aksiyon menüsü aktiftir.
- Müşteri modunda: Kategori etiketi gizlenir. Sadece görsel, ad, açıklama, fiyat görünür.
- Açıklama (description) satır bazlı gösterilir (`\n` karakteri ile ayrılır).