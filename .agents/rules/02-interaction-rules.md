---
trigger: always_on
---

---
name: interaction-rules
description: Admin etkileşimleri ve Google Sheets senkronizasyon kuralları.
---
# ETKİLEŞİM VE UI KURALLARI

## 1. Hızlı Düzenleme (In-place Edit)
- **Metinler:** Ürün Adı ve Fiyat alanları `contentEditable` ile anında düzenlenir. 
- **Kategori:** Ürünün kategorisi 3-nokta menüsü içindeki sistem seçicisi üzerinden değiştirilir.
- **Resimler:** Resme tıklandığında dosya seçicisi açılır, `compressImage` (250px) sonrası Sheets'e gönderilir.

## 2. Sıralama Sistemi (Numeric Order)
- **Ürünler:** Kart üzerindeki sayısal kutucuktan (1, 2, 3...) sıra değiştirilir. İşlem kategori-güvenlidir (sadece o reyon içindeki ürünler kayar).
- **Kategoriler:** Üst menüdeki butonların solundaki rakam kutucuğundan reyon sırası belirlenir.
- **Güvenlik:** Tüm sıralama işlemleri anlık olarak `localStorage` cache'ine yazılır ve `UPDATE_PRODUCT_ORDER` aksiyonunu tetikler.

## 3. Menü ve Aksiyonlar
- **3-Nokta Menüsü:** `TÜKENDİ`, `STOKTA`, `ARŞİVLE`, `YAYINLA`, `KATEGORİ` ve `SİL` seçeneklerini barındırır.
- **Yeni Ürün:** Ürün listesinin en başında bulunan tam genişlikteki ince "+" çubuğuyla ekleme yapılır.
- **Onay:** Silme işlemleri her zaman `window.confirm` ile doğrulanır.

## 4. Arama ve Filtreleme
- Arama kutusunda "X" (Temizle) butonu bulunur.
- Kategori seçildiğinde sayfa başına süzülme (`scrollTo: 0`) yapılır.
- Debounce: 3 karakterden uzun aramalar 2 saniye sonra loglanır.
