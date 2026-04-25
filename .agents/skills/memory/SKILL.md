---
name: Memory
description: "AI Memory & Project Evolution Log. Diamond Standartlarının ve teknik kararların mühürlendiği hafıza merkezi."
---

# 🧠 ANTIGRAVITY MEMORY HUB

Bu dosya, projenin evrimsel sürecini, alınan kritik kararları ve teknik kısıtlamaları içerir. Her görev öncesi burayı oku, görev sonrası burayı güncelle.

## 📜 PROJE HAFIZASI (LOGS)

### [2026-04-25] - STRICT PROTOCOL: MEMORY-FIRST (LOCKED 🔒)
- **Mandate:** Her kullanıcı isteği öncesi `SKILL.md` (Memory Hub) okunacak.
- **Workflow:** Yapılacak planlanmış adımlar önce bu dosyaya "PLAN" başlığı ile kaydedilecek.
- **Execution:** Plan kaydedildikten sonra teknik uygulama başlatılacak.
- **Status:** Bu protokol projenin "Diamond Standard" operasyonel yasasıdır.

### [2026-04-25] - PLAN: NAVBAR CONTACT BUTTON TRANSFORMATION
- **Objective:** Navbar'daki WhatsApp butonunu bir iletişim modalına dönüştürmek ve ikonunu güncellemek.
- **Strategy:**
    - `ContactModal.tsx` oluştur ("Direkt Ara" ve "WhatsApp Mesaj" seçenekleri).
    - `AppModals.tsx` üzerinden modalı sisteme bağla.
    - `Navbar.tsx` içindeki WhatsApp butonunu güncelle:
        - Mevcut WP ikonunu kaldır.
        - Sağ tarafa (text'ten sonra) parmak izi (fingerprint) ikonunu ekle.
        - `onClick` aksiyonunu `openModal('CONTACT')` yap.

### [2026-04-25] - LOCATION MODAL IMPLEMENTATION (LOCKED 🔒)

### [2026-04-25] - PLAN: LOCATION MODAL IMPLEMENTATION
- **Objective:** "Harita" butonuna tıklandığında direkt link yerine bir modal açılmasını sağlamak.
- **Strategy:**
    - `LocationModal.tsx` bileşenini oluştur (Açık adres + "Haritalarda Gör" butonu).
    - `AppModals.tsx` üzerinden modalı global sisteme entegre et.
    - `FloatingGuestMenu.tsx` içindeki direkt link aksiyonunu `openModal('LOCATION')` ile değiştir.
    - `types.ts` içindeki `ModalType` tanımını güncelle.

### [2026-04-25] - PERFECT ICON CENTERING (LOCKED 🔒)

### [2026-04-25] - PERFECT ICON CENTERING (LOCKED 🔒)
- **Centering Standard:** Tüm yazısız (grid) ikonlar için `flex items-center justify-center` sınıfları buton seviyesine çekilerek tam X/Y simetrisi sağlandı.
- **Structural Fix:** `Currency` ve `Instagram/WhatsApp` gibi manuel ikon yapıları `w-full h-full` ve flex konteynerlar ile buton alanını kusursuz ortalayacak şekilde mühürlendi.
- **Verification:** İkonlar artık kendi buton alanlarının tam kalbinde yer almaktadır.

### [2026-04-25] - FINAL ICON UNIFICATION (LOCKED 🔒)

### [2026-04-25] - FINAL ICON UNIFICATION (LOCKED 🔒)
- **Standardization:** Mobil cihazlarda tüm ikonlar (Paylaş, Konum, QR, Instagram, WhatsApp, Arama, Telefon) Kur ikonuyla (`20px`) tam olarak eşitlendi.
- **Sizing (Mobile):** Padding bazlı yapıdan vazgeçilerek tüm ikonlar için `w-5 h-5` (20px) sabit ölçeği mühürlendi.
- **Visual Balance:** Kur simgesi (`text-[20px]`) ile diğer ikonlar arasında %100 görsel denge sağlandı.
- **Persistence:** PC görünümü (`sm:w-9 sm:h-9`) Diamond Standard gereği korunmuştur.

### [2026-04-25] - MOBILE ICON UNIFICATION (LOCKED 🔒)
- **Standardization:** Mobil cihazlarda tüm ikonların görsel ağırlığı "Kur" ikonu (`20px`) ile eşitlendi.
- **Sizing (Mobile):** Grid ikonları için `p-[11px]`, labeled ikonlar için `w-5 h-5` ölçekleri mühürlendi.
- **Scaling (PC):** Masaüstü görünümü (`sm:p-1.5` / `sm:w-9`) bozulmadan korundu, hibrit denge sağlandı.
- **Target Icons:** QR, Arama, Paylaş, Telefon, Liste, İndirim.

### [2026-04-25] - STYLE UPDATE: SHARE BUTTON (LOCKED 🔒)
- **Visuals:** "Paylaş" butonu rengi `stone-900`'dan **beyaz** (`bg-white`) rengine çevrildi.
- **Centering:** İkonun X ve Y ekseninde tam merkezlenmesi için `flex items-center justify-center` yapısı mühürlendi.
- **Consistency:** Buton, dükkanın genel `secondary` buton şablonuna (border-2 border-stone-100) uygun hale getirildi.

### [2026-04-25] - RESTORE: SHARE BUTTON (LOCKED 🔒)
- **Essential Utility:** Kullanıcı isteği üzerine "En Üste Çık" kaldırıldı ve dükkanın en önemli işlevlerinden olan **"Paylaş" (Share)** butonu geri getirildi.
- **Layout Logic (Grid 2x4):**
    - Satır 1: [PAYLAŞ (Premium Black)] | [KONUM]
    - Satır 2: [PARA BİRİMİ] | [INSTAGRAM]
    - Satır 3: [QR] | [WHATSAPP]
    - Satır 4: [ARAMA] | [TELEFON]
- **Behavior:** `navigator.share` API ve fallback olarak clipboard kopyalama mekanizması yeniden mühürlendi.

### [2026-04-25] - MENU EXPANSION (LOCKED 🔒)
- **Architecture:** 3x2 grid yapısı genişletilerek **4x2 (8 ikonlu)** tam kapasiteye geçildi.
- **Layout Logic (Grid 2x4):**
    - Satır 1: [PAYLAŞ (Essential)] | [KONUM]
    - Satır 2: [PARA BİRİMİ] | [INSTAGRAM]
    - Satır 3: [QR] | [WHATSAPP]
    - Satır 4: [ARAMA] | [TELEFON (En sağ en alt)]
- **New Actions:**
    - Paylaş (Share): Dükkan linkini paylaşan `Share2` butonu eklendi.
    - Telefon (Call): Eksik olan arama butonu en sağ en alta mühürlendi.
- **Visual Standard:** 4 satırlı yapı için `grid-cols-2` kullanımı tescillendi, tüm ikonlar mühürlü renk paletlerine (`stone-900`, `blue-600`, vb.) uygun hale getirildi.

### [2026-04-25] - FLOATING MENU RESTRUCTURING (LOCKED 🔒)
- **Grid Architecture:** 2x2 kısıtı kaldırılarak **3x2 (6 ikonlu)** yapıya geçildi.
- **Layout Logic (Grid 2x3):**
    - Satır 1: [PARA BİRİMİ] | [KONUM (Toprak Rengi)]
    - Satır 2: [QR] | [INSTAGRAM (#FF0069)]
    - Satır 3: [ARAMA] | [WHATSAPP (#25D366)]
- **Branding Standards:**
    - Instagram: Özel SVG logo ve `#FF0069` buton rengi mühürlendi.
    - WhatsApp: Buton rengi `#25D366` olarak güncellendi.
    - Konum: `#A67B5B` (Toprak rengi) arka plan ve Lucide `MapPin` mühürlendi.
- **Currency:** Labeled actions'dan grid'e taşındı, sadece ikon (₺/$/€) olarak temizlendi.

### [2026-04-25] - MENU EVOLUTION & NAMING (LOCKED 🔒)
- **Guest Menu:**
    - Boşluk Standardı: Buton genişliği (92px/138px) ve her yönden eşit **6px** (`p-1.5`) boşluk ile konteyner genişliği **104px (Mobil) / 150px (PC)** olarak sabitlendi. Tam kare simetrisi sağlandı.
    - Merkezleme: İkon ve metin, `gap-1.5` ile bitişik ve hem X hem Y ekseninde tam ortalıdır.
- **Admin Menu:**
    - Main Toggle Label: "MENÜ" -> **"AYARLAR"**.
    - Action Update: "TOPLU FİYAT" -> **"TOPLU İŞLEM"**.
    - Layout: "Ürün Ekle" (+) ve "Ayarlar" (dişli) artık sadece ikonlu (circle) butonlar olarak 2x2 veya 3x3 grubuna dahil edildi.
- **Visual Standard:**
    - İkon Dizilimi (3x2): `grid-cols-2` yapısıyla 3 satır (6 ikon) olarak zorlandı.
    - Konteyner: İçerideki 92px simetrisini korumak için dış genişlik **110px (Mobil) / 165px (PC)** olarak rahatlatıldı.
    - PC Optimization: `scale-[1.5]` yerine milimetrik ölçülere geçildi. Konteyner `sm:w-[165px]`, butonlar `sm:h-[60px]`, fontlar `sm:text-[14px]`, ikonlar ise `sm:w-[24px] sm:h-[24px]` olarak optimize edildi. Arka plan içeriği tam sarar.
    - Yükseklik Standardı: Tüm butonlar (yazılı veya sadece ikonlu fark etmeksizin) **Mobil'de 42px, PC'de 63px** yüksekliğinde eşitlenerek kusursuz simetri sağlandı.

### [2026-04-25] - FLOATING MENU DIAMOND SNAPSHOT (UPDATED 🔒)
- **Container Architecture:**
    - Width: Mobil **104px**, PC **150px**.
    - Padding: Her yönden eşit **6px** (`p-1.5`).
    - Effects: `bg-white/50`, `backdrop-blur-2xl`, `border-white/50`.
- **Button Architecture:**
    - Labeled Height: Mobil **42px**, PC **63px**.
    - Icon-only Size: Mobil **42px x 42px**, PC **63px x 63px**.
    - Master Toggle: Mobil **h-11 w-92px**, PC **h-16 w-138px**.
- **Icon Standard:**
    - Visual Size: Mobil **w-5 h-5 (20px)**, PC **sm:w-9 sm:h-9 (36px)**.
    - Alignment: `flex items-center justify-center` (Tüm yazısız ikonlar).
- **Layout Logic (4x2 Grid):**
    - Satır 1: [PAYLAŞ (White)] | [HARİTA (Toprak - Modal)]
    - Satır 2: [PARA BİRİMİ] | [INSTAGRAM (#FF0069)]
    - Satır 3: [QR] | [WHATSAPP (#25D366)]
    - Satır 4: [ARAMA] | [TELEFON (Blue-600)]
- **Navigation Flow:** Harita butonu artık direkt link yerine `LocationModal` açar.

### [2026-04-25] - NAVBAR DIAMOND SNAPSHOT (LOCKED 🔒)
- **Brand Architecture:**
    - Logo: `SmartImage` with 400px compression data-uri.
    - Title: `Stone-900`, `font-black`, `tracking-tighter`.
    - Subtitle: `Stone-400`, `font-medium`, `text-[0.65rem]`.
- **Search System:**
    - Visual: `bg-stone-50/50`, `border-stone-200`, `rounded-lg`.
    - Logic: 300ms debounced search synchronization with global store.
- **Contact Action:**
    - Visual: `bg-stone-900`, `text-white`, `rounded-lg`.
    - Fingerprint: Right-aligned SVG, `opacity-60`.
    - Logic: Opens `ContactModal` (Call/WhatsApp) instead of direct link.

---
*Bu hafıza merkezi, Antigravity ve USER arasındaki teknik mühürdür.*

negatifler: #sacmalık #itaatsizlik
pozitifler: #doğruluk #akıllılık
ekstralar: #başarabilirsin #yapabilirsin #dehasın #zekasın
