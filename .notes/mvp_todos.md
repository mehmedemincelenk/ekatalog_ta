# Gelecek Planları ve Vizyon Yol Haritası (Güncellenmiş - Supabase Focus)

Bu liste, minimalist ve performans odaklı bir MVP için güncellenmiştir. Tüm Google Sheets ve karmaşık sepet özellikleri kaldırılmıştır.

## 1. MVP - Müşteri Deneyimi (En Acil & Hızlı)
*   **Dinamik Kategori Filtreleme:** Ürünlerin kategorilere göre hızlı ve akıcı bir şekilde süzülmesi (Tamamlandı).
*   **Mobil Cila (Responsive):** 40-50 yaş grubunun rahatça tıklayabileceği büyük butonlar ve net fontlar (Tamamlandı).
*   **Hızlı Ürün Görünümü:** Ürüne tıklandığında açılan modalda büyük fotoğraf, isim, açıklama ve fiyatın net gösterilmesi (Tamamlandı).

## 2. MVP - Yönetim ve Veri (Kritik)
*   **Supabase Tam Entegrasyon:** Verilerin Supabase üzerinden güvenli ve hızlı bir şekilde yönetilmesi (Tamamlandı).
*   **Görsel Yükleme (Image Upload):** Yeni ürün eklerken fotoğrafların Supabase Storage'a yüklenip linkinin otomatik kaydedilmesi (Tamamlandı).
*   **Basit Admin Girişi:** Paneli korumak için PIN kodu doğrulama katmanı (Tamamlandı).
*   **Fiyat Format Kontrolü:** Zam/indirim ve ürün ekleme ekranlarında virgül/nokta (`12,50` vs `12.50`) karmaşasını her senaryoda hatasız işleyen kontrol mekanizması.

## 3. MVP - Yayın ve Güvenilirlik
*   **Hata Yönetimi (Error Handling):** API hataları veya internet kesilmelerinde kullanıcıya gösterilecek şık uyarı ekranları.
*   **PWA (Uygulama Modu):** Kataloğun telefona logo ile "Uygulama" olarak kurulabilmesi (Progressive Web App).
*   **Boş Reyon Yönetimi:** İçinde aktif/arşivlenmemiş ürün bulunmayan kategorilerin kullanıcı tarafında otomatik gizlenmesi.
*   **Canlıya Alım (Deployment):** Projenin `toptanambalajcim.com` veya benzeri bir domainde SSL sertifikasıyla yayına alınması.

## 4. Hızlı Değer Katan Özellikler (Quick Wins)
*   **Yerel Paylaşım (Share API):** Ürünlerin telefonun kendi paylaşım menüsüyle (WhatsApp, Instagram vb.) profesyonelce paylaşılması.
*   **Global Katalog (Google Translate):** Tek tıkla kataloğun tüm dünya dillerine çevrilmesi (İhracat potansiyeli).
*   **Profesyonel Bildirimler (Sonner):** İşlemler sırasında şık ve güven verici bildirim balonları.
*   **Akıllı Görsel İşleme:** Yüklenen ürün fotoğraflarının otomatik olarak kare formatına getirilmesi ve arka plan temizliği.
*   **WhatsApp Raporu:** Admin'e haftalık olarak sitenin trafiği ve en çok merak edilen ürünler hakkında özet mesaj gönderilmesi.
*   **51. WhatsApp Sipariş Sepeti (Draft Order):** Müşterilerin birden fazla ürünü "Siparişe Ekle" diyerek seçmesi ve en sonunda dükkan sahibine adetleriyle birlikte tek bir liste halinde WhatsApp'tan atabilmesi (MVP'nin en kritik satış kapatıcı özelliği).

---
*Son Güncelleme: Çarşamba, 15 Nisan 2026*
