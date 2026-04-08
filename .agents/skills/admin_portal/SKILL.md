---
name: admin_portal
description: Google Sheets senkronizasyonlu admin modunu ve görsel yönetimini yönetir.
---
# Admin Portal Becerisi

## 1. Giriş ve Görünüm
- **Aktivasyon:** Footer logosuna 7 tık.
- **Toggle:** Sağ altta sabit duran "On-Off" butonu ile admin modundan çıkış yapılır.
- **Hızlı Erişim:** Liste başında tam genişlikte "+" (Yeni Ürün Yükle) çubuğu belirir.

## 2. Sıralama ve Yönetim (Hassas)
- **Sayısal Sıralama:** Ürün ve kategoriler için dropdown tabanlı sıralama sistemi kullanılır.
- **Kategori-Safe:** Sıralama değişimlerinde ürünler sadece kendi kategorileri içinde yer değiştirir.
- **Hibrit Menü:** PC'de custom, mobilde native 3-nokta menüsü ile `STOK`, `ARŞİV` ve `KATEGORİ` yönetilir.

## 3. Google Sheets Senkronizasyonu
- **Anlık Güncelleme:** `ADD`, `UPDATE`, `DELETE`, `RENAME_CATEGORY` ve `UPDATE_PRODUCT_ORDER` aksiyonları anlık çalışır.
- **Sıralama Kaydı:** `UPDATE_PRODUCT_ORDER` aksiyonu tüm ID listesini yeni sırasıyla Sheets'e basar.

## 4. Görsel Optimizasyonu
- **Sıkıştırma:** Ürün resimleri `250px`, Hero resimleri `1200px` olarak işlenir.
- **Base64:** Sheets hücre sınırı için `quality: 0.6` standardı zorunludur.
