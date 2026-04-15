# MVP Prototip - Teknik Tamamlama & Test Planı

Bu plan, projenin SaaS (Çoklu Mağaza) aşamasına geçmeden önceki son "Sağlamlık Kontrolü" protokolüdür.

## 1. Kullanıcı Deneyimi (UX/UI) Sağlamlık Testi
- [ ] **Arama Motoru:** Arama kutusuna hızlı yazıldığında kasmadan (debounce) sonuçlar filtreleniyor mu?
- [ ] **Reyon Filtreleri:** Birden fazla reyon seçildiğinde ürünler doğru kesişimle listeleniyor mu? "Tüm Ürünler" butonu filtreyi sıfırlıyor mu?
- [ ] **Stok Görünümü:** "Tükendi" ürünleri görsel olarak sönük (grayscale) ve "TÜKENDİ" etiketiyle mi geliyor?
- [ ] **LCP Performansı:** İlk 4 ürün ve Carousel'in ilk slaytı öncelikli (priority) yükleniyor mu?

## 2. Admin Güvenlik ve Yönetim Testi
- [ ] **Hidden Trigger:** Mağaza logosuna 3 hızlı tıklama PIN panelini açıyor mu?
- [ ] **PIN Güvenliği:** Yanlış PIN girişi engelleniyor mu? Doğru PIN ile `sessionStorage` yetkisi alınıyor mu?
- [ ] **Inactivity Timeout:** 1 saatlik (test için 10 saniye yapılabilir) hareketsizlikte sistem otomatik çıkış yapıyor mu?
- [ ] **Sıralama Motoru:** Ürünlerin reyon içi sırası (1, 2, 3...) değiştirildiğinde kalıcı oluyor mu?

## 3. Dinamik İçerik ve API Testi
- [ ] **CRUD Operasyonları:** Ürün ekleme, anlık (onBlur) isim/fiyat güncelleme ve silme işlemleri Supabase ile senkron mu?
- [ ] **Resim İşleme:** Ürün resmi yüklendiğinde "YÜKLENİYOR" yazısı çıkıyor mu ve HQ/LQ ayrımı doğru yapılıyor mu?
- [ ] **Kupon Mantığı:** Kupon kodu girildiğinde fiyatlar anında güncelleniyor mu? Hatalı kodlarda kırmızı uyarı çıkıyor mu?

## 4. SaaS Hazırlık (Dynamic Slug) - YAKINDA
- [ ] URL'den `?slug=store-name` veya `store.ekatalog.co` okuma altyapısının testi.
- [ ] Çoklu mağaza için RLS (Row Level Security) kurallarının denetimi.
