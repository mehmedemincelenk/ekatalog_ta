---
name: constitution
description: Projenin vizyonunu, ticari hedeflerini ve asla ödün verilmeyecek temel kurallarını "Benimse/Kaçın" odağında belirleyen en üst düzey rehber.
---

# Project Constitution (Proje Anayasası)

Bu belge, "Toptan Ambalajcım" projesinin varlık sebebini ve teknik-tasarım süreçlerindeki en üst hiyerarşik kuralları iki ana sütunda tanımlar.

## 1. Bunları Benimse (Adopt These)

Bu prensipler, her satır kodda ve her tasarım öğesinde var olmalıdır:

- **Hız ve Basitlik:** Toptan ambalaj ticaretini en hızlı ve en şık şekilde dijitalleştir. Başarı kriteri "hızlı satış kapatma"dır.
- **Admin Sadeliği:** Paneli 40-50+ yaş grubundaki bir dükkan sahibinin hata yapamayacağı kadar basit tut.
- **Apple Minimalizmi:** "Premium Minimalist" estetiği koru. Sadece gerekli olanı göster (Signal-to-Noise).
- **Beyaz Boşluk (Whitespace):** Boşluğu bir lüks olarak kullan; içeriğin nefes almasını sağla.
- **Sıfır Hardcoding:** Tüm görsel kararları `src/data/config.ts` (`THEME`) üzerinden yönet. Kod "kör" olmalı, irade konfigürasyonda olmalıdır.
- **Mantık İzolasyonu:** UI her zaman "aptal" (stateless), mantık her zaman "akıllı" (hook/context) olmalıdır.
- **A-Level English:** Tüm isimlendirmeleri küresel standartlarda, profesyonel ve net İngilizce ile yap.
- **Mobil Öncelik (Mobile-First):** Her özelliği önce mobilde (başparmak dostu) mükemmel çalıştır, sonra masaüstüne uyarla.
- **8px Izgara Sistemi:** Tüm boşlukları ve boyutları 8'in katı olacak şekilde matematiksel bir düzende tut.
- **Güvenlik (Sec-by-Design):** "Sıfır Güven" (Zero Trust) ilkesini benimse; her yeni özelliği önce "Nasıl suistimal edilebilir?" süzgecinden geçir.

## 2. Bunlardan Kaçın (Avoid These)

Aşağıdaki "günahlar" ve hatalar projeye dahil edilemez:

- **Yasaklı Günahlar:** Complexity (Karmaşıklık), Inconsistency (Tutarsızlık), Hardcoding (Sabit değerler), Fragility (Kırılganlık), Laziness (Üşengeçlik), Clutter (Kirlilik), Ambiguity (Belirsizlik), Bloat (Şişkinlik), Silence (Sessiz hata), Assumption (Varsayım).
- **Gereksiz Karmaşıklık (Over-engineering):** "Belki ilerde lazım olur" diyerek eklenen her soyutlama katmanından kaçın.
- **Bağlam Kaybı (Context Loss):** Mevcut yardımcı fonksiyonları (`utils`, `hooks`) görmezden gelip benzerini sıfırdan yazma.
- **Kütüphane Varsayımı (Hallucination):** `package.json` içinde olmayan bir kütüphaneyi varmış gibi import etme.
- **Vibe Körlüğü:** Teknik olarak çalışan ama projenin Apple estetiğine uymayan "çirkin" veya "kaba" UI üretme.
- **Yıkıcı Onarımlar (Regressive Fixes):** Bir bug'ı düzeltirken mobil görünümü veya Design Token yapısını bozma.
- **Açıklama Kalabalığı (Verbose Output):** Basit bir mantık için yüzlerce satır kod yazma; her zaman en sade yolu bul.
- **Mobil İhmali:** Sadece masaüstünde güzel görünen, mobilde tıklanması imkansız küçük öğelerden kaçın.
- **Anlamsız İsimlendirme:** `item`, `data`, `prod` gibi belirsiz kısaltmalar kullanma; her zaman tam ve açıklayıcı ol.

---
*Anayasaya aykırı hiçbir kod satırı veya tasarım öğesi sisteme dahil edilemez.*
