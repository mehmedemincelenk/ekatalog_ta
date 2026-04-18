---
name: design
description: Apple standartlarında estetik, mobil öncelikli (Mobile-First) deneyim ve "Security by Design" prensiplerini birleştiren bütünsel tasarım rehberi.
---

# Design & Security Excellence (Bütünsel Tasarım Rehberi)

Bu rehber, projenin sadece "arzulanabilir" ve "premium" hissettirmesini sağlamakla kalmaz, aynı zamanda her aşamada güvenliği bir tasarım öğesi olarak sisteme işler.

## 1. Görsel Estetik & Apple Standartları (UI/UX)
**Felsefe:** "Az ama öz". İçeriği (ürünleri) öne çıkaran, kullanıcıyı yormayan zarif bir kap.
- **8px Izgara Sistemi:** Tüm boşluklar (padding/margin) ve boyutlar 8'in katı (4, 8, 16, 32...) olmalıdır. Bu, matematiksel bir ritim sağlar.
- **Tipografi:** Sans-serif (örn: Inter, SF Pro) fontlar. Başlıklar kalın (bold), alt metinler ince/orta. `leading-relaxed` (1.5) ile okunabilirliği artır.
- **Minimalist Palet (60-30-10):** %60 nötr (Stone/Slate), %30 ikincil, %10 vurgu rengi (Amber/Kraft).
- **Derinlik ve Katmanlar:** `backdrop-blur-xl` ve yumuşak gölgelerle (shadows) hiyerarşiyi hissettir.

## 2. Mobil Öncelikli & Dokunmatik Deneyim (Mobile-First)
**Felsefe:** 40-50 yaş grubunun dahi zorlanmadan kullanabileceği, başparmak dostu bir akış.
- **Dokunmatik Hedefler:** Tıklanabilir her alan en az **44x44px** olmalıdır.
- **Responsive Grid:** Mobilde tek sütun, masaüstünde ürünün cinsine göre 2, 3 veya 4 sütun.
- **Performans (LCP):** Resimler için `loading="lazy"`, kritik resimler (Hero) için `fetchpriority="high"`. LQ/HQ resim ayrımını her zaman koru.
- **Alt Menü (Tab Bar):** Mobil kullanımda kritik aksiyonları (Kategoriler, Arama, Admin) ekranın alt yarısında (başparmak alanı) tut.

## 3. Siber Savunma ve Mimari Güvenlik (Sec-by-Design)
**Felsefe:** "Sıfır Güven" (Zero Trust). Güvenlik bir eklenti değil, tasarımın temelidir.
- **SaaS & Tenant İzolasyonu:** Çoklu mağaza yapısına hazırlık için her sorguda `tenant_id` (veya store_slug) filtresini zorunlu tut.
- **En Az Yetki Prensibi:** Admin paneli sadece geçerli PIN/Session ile erişilebilir olmalı. Hatalı girişlerde saldırgana ipucu vermeyen mesajlar kullan.
- **Girdi Güvenliği (XSS/CSRF):** Kullanıcıdan gelen her veriyi temizle. `dangerouslySetInnerHTML` kullanımından kaçın.
- **Secrets Management:** `.env` ve API anahtarlarını asla koda gömme (hardcode).

## 4. İnteraktif Geri Bildirim (Micro-interactions)
**Felsefe:** Sitenin kullanıcının her hareketine "canlı" ve "fiziksel" bir tepki vermesi.
- **Active States:** Butonlara basıldığında `scale-95` efekti ile fiziksel basma hissi ver.
- **Haptic & Visual Feedback:** İşlem başarılı olduğunda (örn: Zam uygulandı) net bir bildirim ve görsel onay sağla.
- **Smooth Transitions:** Modallar ve reyon geçişleri "pat" diye değil, yumuşak bir `fade-in` veya `slide` efektiyle açılmalı.

## 5. Uygulama Stratejisi
1. **Düşün:** "Bu özellik 50 yaşında bir dükkan sahibi için yeterince büyük mü?"
2. **Sorgula:** "Bu yeni veri girişi sistemi nasıl suistimal edilebilir?"
3. **Uygula:** "8px kuralına ve mobil öncelikli grid yapısına uyuyor mu?"

---
*En iyi tasarım, kullanıcının orada olduğunu fark etmediği ama kusursuz çalışan tasarımdır.*
