---
name: admin_portal
description: Gizli admin modunu, ürün CRUD işlemlerini ve iOS uyumlu görsel yüklemeyi yönetir.
---
# Admin Portal Becerisi

## 1. Gizli Admin Giriş/Çıkış
- **Giriş:** Footer logosuna 2 saniye içinde 7 ardışık tıklama (`useAdminMode` hook'u yönetir).
- **Çıkış:** Admin modundayken footer logosuna 1 kez tıklama.
- Admin modu aktifken sayfada sarı bir "🔓 Admin Modu Aktif" rozeti görünür.

## 2. Yeni Ürün Modalı (AddProductModal)
Sağ alt köşedeki "+" FAB butonu şu alanları içeren modalı açar:
- **Ürün Adı** (Text) — Sadece öz isim ("Hışır", "Ketçap")
- **Açıklama** (Textarea) — Miktar, gramaj, ebat detayları, her satır ayrı bilgi
- **Fiyat** (Text) — "₺75" veya "Fiyat Sorunuz" formatında
- **Kategori** (Select + Text) — Mevcut kategorileri listeler; yeni isim girilirse listeye eklenir
- **Ürün Görseli** (File Upload)

Modal onaylandığında ürün anında listeye dahil edilir ve `localStorage` güncellenir.

## 3. ⚠️ KRİTİK: iOS Görsel Yükleme & LocalStorage Limiti
iPhone/Safari cihazlarda ham fotoğraf yüklemek uygulamayı **tamamen çökertir** (beyaz ekran). Nedeni: LocalStorage'ın 5MB sınırı.

**Asla şöyle yapma:**
```js
reader.onload = (e) => setImage(e.target.result); // YANLIŞ - Ham base64 = 5MB aşımı
```

**Her zaman şöyle yap (Downscale Pipeline):**
```js
// 1. Canvas ile max 800px'e küçült
// 2. JPEG kalitesi 0.7'ye düşür
// 3. Sonucu base64'e çevir
// 4. try/catch ile QuotaExceededError'u yakala ve kullanıcıyı bilgilendir
```

Bu sıkıştırma (`compressImage` util fonksiyonu `src/utils/image.js`'dedir) her görsel değişiminde çağrılmalıdır.

## 4. In-Place Editing
- Admin modunda ürün adı, fiyatı veya kategori etiketi tıklandığında `contentEditable` devreye girer.
- Odak kaybedildiğinde (`onBlur`) değişiklik `updateProduct` hook'uyla kaydedilir.
- Görsel alanına tıklandığında input[type=file] tetiklenir, Downscale pipeline çalışır.