---
trigger: always_on
---

---
name: first-rules
description: Vibe Coding Manifestosu ve Genel Mühendislik Anayasası
---

# VİBE CODİNG MANİFESTOSU & MÜHENDİSLİK ANAYASASI

## 1. Vibe Coding Nedir? (Temel Öğreti)
Vibe Coding, geliştirmenin **hissiyat ve akış** üzerine kurulu olduğu bir yaklaşımdır.
- **Kullanıcının ihtiyacına bugün cevap verirsin.** Altı ay sonra belki lazım olur diye yapı kurmazsın.
- **Prototip hızına saygı duyarsın.** Mükemmel mimariden önce çalışan ürün gelir.
- **Arayüze (UI), emojiye, renge, hissiyata önem verirsin.** Kuru teknik doğruluk değil, insanın tuttuğu şey önemlidir.
- **Yorumlamak yerine kodlarsın.** Uzun toplantılar, dokümantasyon maratonu, ihtiyaç analizi raporu yok. Kullanıcı söylüyor, sen anlık yapıyorsun.

## 2. Overengineering Nedir? (Öğretilmesi Gereken Tehlike)
Overengineering, **şu anki problemi aşan** bir karmaşıklık kurmaktır. Belirtileri şunlardır:

| Overengineering İşareti | Doğru Vibe Coding Alternatifi |
|---|---|
| `Redux` veya `Zustand` kurmak (state basit) | `useState` + custom hook yeterli |
| Tek kullanımlık için ayrı `util/helper` dosyası | Direkt component içinde yaz |
| 50 satır için 3 ayrı component dosyası açmak | Tek dosyada tutabilirsin |
| TypeScript interface zinciri kurmak | JS objesi + yorum satırı yeterli |
| Firebase/Supabase kurmak (kullanıcı çok az) | localStorage JSON yeterli |
| Genel amaçlı soyutlamalar (`BaseButton`, `AbstractCard`) | Direkt kullan, soyutlama sonra yapılır |

**Kural:** Eğer bugün **tek bir kullanıcı** için çözüm üretiyorsan, en basit çalışan kod en doğru koddur.

## 3. K.I.S.S. Prensibi (Keep It Simple, Stupid)
- Daha az kod = daha az hata = daha kolay bakım.
- Her yeni soyutlama, her yeni dosya, her yeni bağımlılık bir **borca** dönüşür.
- Bu proje B2B katalog MVP'sidir. Hedef: Ürünleri göster, admin düzenleyebilsin, müşteri görebilsin. Hepsi bu.

## 4. Component-Based Mimari (Doğru Uygulama)
- Her bileşen **tek bir şey yapar** (Single Responsibility).
- State, onu kullanan en yakın üst bileşende tutulur (State'i hemen `App.jsx`'e çekme).
- İş mantığı custom hook'lara (`useProducts`, `useAdminMode`) taşınır, UI bileşenleri saf (pure) kalır.
- Bileşen sayısını gereksiz artırmak **overengineering**dir.

## 5. Genel Kodlama Kuralları
- Tüm sabitler (renkler, telefon numarası, marka adı, sıralama kuralları) `src/data/config.js` dosyasında tutulur.
- Türkçe UI, Türkçe yorumlar, evrensel kod.
- Her değişiklik `git commit` ile izlenir.
