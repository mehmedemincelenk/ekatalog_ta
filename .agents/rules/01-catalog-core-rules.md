---
trigger: always_on
---

---
name: catalog-core-rules
description: B2B Katalog mimarisi ve Google Sheets veri yönetim kuralları.
---
# B2B KATALOG ANAYASASI

## 1. Veri Yönetimi (Google Sheets Integration)
- **Ana Veritabanı:** Google Sheets kullanılır.
- **Okuma:** `.env` dosyasındaki `VITE_SHEET_URL` (CSV) üzerinden yapılır.
- **Yazma:** `.env` dosyasındaki `VITE_SHEET_SCRIPT_URL` (Google Apps Script) üzerinden yapılır.
- **Performans:** Resimler `base64` formatına dönüştürülmeden **önce** mutlaka `250px` (ürünler) veya `1200px` (hero) boyutuna sıkıştırılmalıdır.
- **Cache:** Veriler `localStorage` üzerinde `data_cache` anahtarıyla saklanır. Sheets'ten eski veri gelse bile lokal sıralama korunur.

## 2. Teknik Standartlar (TypeScript)
- **Dil:** Proje tamamen TypeScript (TSX) ile yazılmalıdır.
- **Tip Güvenliği:** `any` kullanımı yasaktır. Tüm modeller `src/types/index.ts` içindeki interfaceleri kullanır.
- **Hooks:** İş mantığı `useProducts`, `useAdminMode`, `useDiscount` gibi özel kancalarla yönetilir.

## 3. Admin ve Güvenlik
- **Giriş:** Footer logosuna 7 kez tıklanarak aktif edilir.
- **Çıkış:** Sağ altta bulunan yüzen (fixed) admin kapatma butonu ile mod sonlandırılır.
- **Güvenlik:** Admin paneli bileşenleri (Modal, Editörler) sadece `isAdmin` true ise DOM'a yüklenir.

## 4. UI/UX ve Tasarım (K.I.S.S.)
- **Renk Paleti:** Kraft (Toprak), Beyaz ve Siyah. 
- **Sıralama:** Sürükle-bırak yerine **Sayısal Dropdown (Select)** sistemi kullanılır.
- **Sayfalama (Sequential):** Kategoriler başlangıçta 3 reyon olarak gösterilir, her "Daha Fazla" tıkında +1 kategori açılır.
- **Arama:** Arama veya kategori seçimi yapıldığında sayfalama sınırı otomatik kalkar, tüm sonuçlar listelenir.

## 5. Menü Mimarisi (Hybrid)
- **3-Nokta Menüsü:** Masaüstünde profesyonel custom menü, mobilde ise sistemin orijinal (native) dropdown'ı kullanılır.
