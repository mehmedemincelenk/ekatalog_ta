# GÖREV PROMPTLARI — Önerilen Sıraya Göre

Her görevi ayrı bir mesaj olarak gönder. Bir tanesi bitince sonrakini at.

⚠️ ÖNEMLİ: Bu promptlar mevcut kod tabanı incelenerek hazırlanmıştır. Zaten var olan yapılar (useDiscount, displayConfig.showPrice, FloatingAdminMenu, DisplaySettingsModal) tekrar yazılmaz, sadece genişletilir.

---

## GÖREV 1/11: Navbar Duyuru Barı (Announcement Banner) ⚡

```
Navbar'ın hemen üstüne sabit bir "Duyuru Barı" (Announcement Banner) ekle.

⚠️ MEVCUT ALTYAPI:
- useSettings hook'u (src/hooks/useSettings.ts) zaten CompanySettings interface'i ve modifyStoreConfiguration fonksiyonu ile settings yönetimini yapıyor. Yeni alan eklenmeli, sıfırdan hook yazılmamalı.
- Supabase'te "stores" tablosunda ek alanlar JSON olarak display_config veya ayrı bir kolon ile saklanabilir.

Davranış:
- Admin panelinden açılıp kapatılabilir (toggle).
- Admin, bar içindeki metni inline düzenleyebilir (örn: "Temmuza kadar %10 indirim!").
- Metin, CompanySettings interface'ine yeni alan olarak eklenir: announcementBar: { enabled: boolean, text: string }.
- useSettings hook'undaki synchronizeStoreSettings ve modifyStoreConfiguration fonksiyonlarına bu alanın mapping'i eklenir.
- Kullanıcı (müşteri) bu barı küçük bir "X" butonuyla kendi oturumunda kapatabilir (sessionStorage ile hatırla).

Tasarım:
- Navbar'ın üzerinde, tam genişlikte, ince (py-2), koyu arka plan (stone-900 veya siyah).
- Metin: Beyaz, küçük punto, bold, uppercase, tracking-widest, ortalanmış.
- Sağ köşede küçük bir X butonu (müşteri kapatabilsin).
- Mobilde de aynı şekilde görünmeli.

Teknik:
- CompanySettings interface'ine announcementBar alanı ekle.
- constants.ts'deki DEFAULT_COMPANY'ye varsayılan değer ekle.
- useSettings hook'undaki mapping'e (satır 144-156 civarı) yeni alanı ekle.
- theme.tsx'e yeni tokenlar ekle.
- Navbar.tsx içine entegre et (Navbar'ın üstünde ayrı bir div olarak).
- Admin değilse ve bar kapalıysa hiç render etme.
- ASLA mevcut Navbar yapısını bozma.
```

---

## GÖREV 2/11: Gece Vardiyası (Off-Hours Visitor) ⚡

```
Gece saatlerinde (23:00 - 07:00 arası) siteye giren ziyaretçilere otomatik bir bildirim/modal göster.

⚠️ MEVCUT ALTYAPI:
- TECH config objesi (src/data/config/constants.ts) zaten teknik sabitleri tutuyor. Yeni saat aralığı buraya eklenmeli.
- settings.whatsapp zaten WhatsApp numarasını tutuyor. Tekrar sorgulamaya gerek yok.

Davranış:
- Sayfa yüklendiğinde saat kontrol edilir: new Date().getHours()
- Saat 23:00-07:00 arasıysa, 5 saniye sonra ekranın alt köşesinden zarif bir bildirim kartı yükselir.
- Kart içeriği:
  "Şu an çalışma saatleri dışındayız.
   İlgilendiğiniz ürünleri not alalım,
   sabah ilk iş size dönelim."
  [WhatsApp ile Gönder] butonu → wa.me link'i ile açılır
- Müşteri "X" ile kapatabilir. Kapatırsa aynı oturumda tekrar gösterilmez (sessionStorage).
- Admin modunda bu bildirim ASLA gösterilmez.

Tasarım:
- Ekranın sağ alt köşesinde yüzen kart (fixed position).
- Beyaz arka plan, yumuşak gölge, rounded-2xl.
- Framer Motion ile aşağıdan yukarı kayarak gelsin (slide-in-from-bottom). Framer Motion projede zaten yüklü.
- WhatsApp butonu yeşil, premium görünümlü.
- Mobil ve masaüstünde uyumlu.

Teknik:
- Yeni bileşen: src/components/OffHoursNotice.tsx
- constants.ts'deki TECH objesine ekle: offHours: { start: 23, end: 7 }
- App.tsx'de koşullu render et: !isAdmin && saatUygun && oturumKapatılmadı
- WhatsApp numarasını settings.whatsapp'tan oku (prop olarak geçir).
- Mevcut Button bileşenini (src/components/Button.tsx) kullan.
```

---

## GÖREV 3/11: Bakım Modu (Maintenance Mode) ⚡

```
Admin yüzen menüsüne "Bakım Modu" toggle'ı ekle.

⚠️ MEVCUT ALTYAPI:
- FloatingAdminMenu.tsx (src/components/FloatingAdminMenu.tsx) zaten mevcut ve çalışıyor. İçinde 3 buton var: Ürün Ekle, Toplu Fiyat, Ayarlar. YENİ buton eklenecek, sıfırdan menü YAZILMAYACAK.
- DisplaySettingsModal.tsx (src/components/DisplaySettingsModal.tsx) zaten toggle grid'i olan bir modal. Bakım modu toggle'ı BURAYA eklenebilir veya ayrı bir buton olarak FloatingAdminMenu'ye eklenebilir.
- CompanySettings interface'i (useSettings.ts satır 6-41) genişletilmeli.

Davranış:
- Admin bu toggle'ı açtığında, müşteriler siteye girdiğinde tüm içerik yerine tam ekran bir bakım sayfası görür.
- Bakım sayfası mesajı admin tarafından yazılabilir.
- CompanySettings'e yeni alan: maintenanceMode: { enabled: boolean, message: string }
- Admin kendi oturumunda bakım modunu görmez, normal şekilde çalışmaya devam eder.
- Varsayılan mesaj: "Sistemlerimiz güncelleniyor. Kısa süre içinde tekrar hizmetinizdeyiz."

Tasarım:
- Tam ekran, ortalanmış.
- Firma logosu (settings.logoUrl'dan oku) + bakım mesajı + büyük bir saat/çark ikonu.
- Arka plan: Zarif gradient veya minimalist beyaz.
- WhatsApp butonu altta (settings.whatsapp'tan oku).

Teknik:
- MaintenancePage.tsx bileşeni oluştur.
- CompanySettings interface'ine maintenanceMode alanı ekle.
- constants.ts DEFAULT_COMPANY'ye varsayılan ekle.
- useSettings mapping'ine (satır 144-156) ekle.
- App.tsx'de en üst seviyede kontrol et: maintenanceMode.enabled && !isAdmin ise sadece MaintenancePage göster.
- Toggle'ı DisplaySettingsModal.tsx'deki mevcut allOptions dizisine yeni bir satır olarak ekle.
```

---

## GÖREV 4/11: Admin Döviz Kuru Ayarlayıcı ⚡

```
Admin ayarlarına döviz kuru giriş alanı ekle.

⚠️ MEVCUT ALTYAPI:
- DisplaySettingsModal.tsx zaten admin ayar paneli olarak çalışıyor. Yeni alan BURAYA eklenmeli.
- CompanySettings interface'i genişletilmeli.
- TECH.commerce objesi (constants.ts satır 85-89) zaten locale, currency ve currencySymbol tutuyor.

Davranış:
- Admin USD ve EUR kurlarını manuel olarak girer.
- CompanySettings'e yeni alan: exchangeRates: { usd: number, eur: number }
- Bu değerler settings'e kaydedilir (Supabase).
- Varsayılan: usd: 35, eur: 38

Tasarım:
- DisplaySettingsModal içinde mevcut grid'in altına yeni bir bölüm.
- İki input: [🇺🇸 USD: ___] [🇪🇺 EUR: ___]
- Blur'da otomatik kaydet (mevcut updateSetting pattern'ını kullan).

Teknik:
- CompanySettings interface'ine exchangeRates ekle.
- constants.ts DEFAULT_COMPANY'ye varsayılan ekle.
- useSettings mapping'ine ekle.
- DisplaySettingsModal.tsx'e input alanları ekle (mevcut allOptions grid'inin altına).
- Görev 5 (müşteri döviz çevirici) bu veriyi okuyacak.
```

---

## GÖREV 5/11: Müşteri Döviz Çevirici 🔧

```
Müşteri için fiyatları farklı döviz cinslerinde gösterme özelliği ekle.

⚠️ MEVCUT ALTYAPI:
- ProductCard.tsx (satır 266-295) zaten fiyat gösterim mantığına sahip. Mevcut indirim hesaplaması (isPromotionActive, calculatePromotionalPrice) zaten çalışıyor. Döviz çevrimi bu yapının ÜZERİNE eklenmeli, ASLA değiştirmemeli.
- src/utils/price.ts zaten fiyat dönüşüm fonksiyonları içeriyor (transformCurrencyStringToNumber, formatNumberToCurrency).
- settings.exchangeRates Görev 4'te ekleniyor.

Davranış:
- Müşteri ₺ / $ / € arasında geçiş yapabilir.
- TÜM fiyatlar anlık olarak seçilen döviz cinsine çevrilir.
- Fiyat yanına "(≈)" eklenir (tahmini olduğunu belirtir).
- Gerçek DB fiyatları DEĞİŞMEZ. Sadece görsel dönüşüm.
- Varsayılan her zaman ₺.

Tasarım:
- Ekranın bir köşesinde 3 butonlu küçük bir seçici: [₺] [$] [€]
- Aktif olan filled, diğerleri outline.
- Veya Footer bölgesine yerleştirilebilir.

Teknik:
- Yeni state: App.tsx'de activeCurrency state'i tut, ProductGrid/ProductCard'a prop olarak geçir.
- Yeni utility: src/utils/currency.ts (convertPrice fonksiyonu).
- ProductCard.tsx'de fiyat gösterilirken (satır 127-129 civarı) bu çevrimi uygula.
- FloatingCurrencySelector.tsx bileşeni oluştur (veya mevcut bir yere entegre et).
- ASLA mevcut fiyat/indirim mantığını bozma. Render aşamasında son adım olarak çevrim yap.
```

---

## GÖREV 6/11: Sosyal Kanıt Kartları (Social Proof Cards) 🔧

```
Ürün kartlarının arasına "sosyal kanıt" bildirim kartları yerleştir.

⚠️ MEVCUT ALTYAPI:
- ProductGrid.tsx (src/components/ProductGrid.tsx) ürünleri kategoriye göre gruplayıp listeliyor. Yeni kartlar bu grid'in render döngüsüne inject edilecek.
- CompanySettings genişletilmeli.
- Mevcut ProductCard ile AYNI grid hücresini paylaşmalı (aynı boyut).

Davranış:
- Her 6-8 üründe bir, normal ürün kartı yerine bir "bildirim kartı" görünür.
- Mesajlar admin tarafından yazılır: CompanySettings'e socialProofCards: string[] ekle.
- Örnek: "📋 340+ ürün, 12 kategoride", "🔥 En çok sipariş: Sızdırmaz Grup"
- Admin modunda düzenlenebilir, müşteri modunda sadece okunur.

Tasarım:
- Ürün kartıyla AYNI boyutta grid hücresi.
- Arka plan: stone-50, ince border, hafif gradient.
- Büyük emoji + kalın metin, ortalanmış, dikey hizalı.
- Ürün kartlarından görsel farklı ama tema uyumlu (THEME tokenları kullan).

Teknik:
- SocialProofCard.tsx bileşeni oluştur.
- CompanySettings'e socialProofCards: string[] ekle.
- constants.ts'ye varsayılan mesajlar ekle.
- ProductGrid.tsx'deki render mantığına: her N üründe bir <SocialProofCard/> inject et.
- theme.tsx'e yeni tokenlar ekle.
```

---

## GÖREV 7/11: Yüzen Arama Butonu ⚡

```
Mobilde kolay erişim için yüzen bir arama butonu ekle.

⚠️ MEVCUT ALTYAPI:
- SearchFilter.tsx (src/components/SearchFilter.tsx) zaten arama input'u ve kategori filtresi içeriyor.
- Navbar.tsx'de arama kutusu zaten render ediliyor.
- displayConfig.showSearch zaten arama kutusunun gösterilip gösterilmeyeceğini kontrol ediyor.
- FloatingAdminMenu.tsx yüzen buton pattern'ını zaten uyguluyor — benzer bir yapı kullanılabilir.

Davranış:
- Sadece MÜŞTERI modunda görünür (isAdmin false iken).
- Sadece MOBILDE görünür (sm breakpoint altında). Masaüstünde zaten Navbar'da arama var.
- Sağ alt köşe (FloatingAdminMenu ile çakışmamalı, o sadece admin'de görünür).
- Tıklandığında sayfanın üstüne scroll + arama input'una focus.

Tasarım:
- Fixed position, sağ alt köşe.
- Yuvarlak buton, büyüteç ikonu (THEME.icons'dan al).
- Glassmorphism (backdrop-blur + bg-white/70).
- Framer Motion ile scale animasyonu.

Teknik:
- FloatingSearchButton.tsx bileşeni oluştur.
- App.tsx'de koşullu render: !isAdmin && mobil ise göster.
- Tıklandığında: window.scrollTo({ top: 0 }) + document.getElementById('search-input')?.focus()
- SearchFilter.tsx'deki arama input'una id="search-input" eklenmesi gerekebilir.
```

---

## GÖREV 8/11: Excel/Fiyat Listesi Modalı 🔧

```
Tüm ürünleri tablo formatında gösteren modern bir fiyat listesi modalı ekle.

⚠️ MEVCUT ALTYAPI:
- useProducts hook'u zaten tüm ürün verisini (products, allProducts, existingCategories) sağlıyor.
- THEME.addProductModal'daki overlay ve container stilleri yeniden kullanılabilir.
- Mevcut modal pattern'ı (overlay + container + header + body) tüm modallarda aynı. Aynı yapıyı kullan.

Davranış:
- Tüm ürünler tabloda: Ürün Adı | Kategori | Fiyat
- Kategoriye göre gruplanmış, her grup başlığıyla.
- Üstte arama/filtreleme (mevcut search mantığını kullan).
- Opsiyonel: "Kopyala" butonu (clipboard'a düz metin olarak).

Tasarım:
- THEME.addProductModal.overlay ve container stilleri kullan (tutarlılık).
- Tablo: zebra stripe (even:bg-stone-50), sticky header.
- Minimalist, premium, Excel hissi.
- Mobilde yatay scroll (overflow-x-auto).

Teknik:
- PriceListModal.tsx bileşeni oluştur.
- App.tsx'de state + koşullu render.
- Mevcut products ve existingCategories verilerini prop olarak al.
- Yeni npm paketi EKLEME. HTML <table> + Tailwind CSS yeterli.
```

---

## GÖREV 9/11: Kupon Sistemi 🔧

```
Müşteriye görünür bir kupon kodu giriş alanı ekle.

⚠️ MEVCUT ALTYAPI — ÇOK ÖNEMLİ:
- useDiscount hook'u (src/hooks/useDiscount.ts) ZATEN MEVCUT VE ÇALIŞIYOR!
- ActiveDiscount tipi zaten tanımlı: { code: string, rate: number, category?: string }
- processPromotionCode fonksiyonu zaten kupon kodunu parse edip indirim oranını çıkarıyor (WELCOME10 → %10).
- TECH.discount config'i zaten min/max/errorResetMs değerlerini tutuyor.
- ProductCard.tsx zaten activeDiscount prop'unu alıp eski fiyat/yeni fiyat gösterimini yapıyor!
- App.tsx'de useDiscount() zaten çağrılıyor ve activeDiscount ProductGrid'e geçiriliyor.

YAPILMASI GEREKEN:
- useDiscount zaten çalışıyor ama kullanıcının KOD GİRECEĞİ bir UI yok!
- Sadece bir "kupon giriş alanı" UI bileşeni oluştur.
- Bu bileşen App.tsx'deki mevcut applyCode fonksiyonunu çağırsın.
- Hata mesajı (error) zaten hook'tan geliyor, göster.

Tasarım:
- Ekranın bir köşesinde veya footer'da küçük bir kupon alanı.
- Input + "Uygula" butonu.
- Geçerli: yeşil onay animasyonu + "WELCOME10 uygulandı" mesajı.
- Geçersiz: kırmızı shake animasyonu + hook'tan gelen error mesajı.
- Aktif kupon varsa: sürekli görünen küçük bir badge "🎫 %10 İNDİRİM AKTİF"

Teknik:
- CouponInput.tsx bileşeni oluştur (SADECE UI).
- App.tsx'den applyCode ve error prop olarak geçir.
- useDiscount hook'una DOKUNMA, zaten çalışıyor.
- Opsiyonel: Admin tarafında tanımlı kupon listesi (settings'e coupons dizisi ekle) — ama bu AYRI bir görev olabilir, şimdilik mevcut "herkese açık kod parse" sistemi yeterli.
```

---

## GÖREV 10/11: Tüm Ürünler PDF İndirme 🔧

```
Tüm katalogdaki ürünleri profesyonel bir PDF/yazdırma formatında indirme özelliği ekle.

⚠️ MEVCUT ALTYAPI:
- useProducts hook'u allProducts ve existingCategories sağlıyor.
- settings objesi firma logosu (logoUrl), adı (name), adresi (address), WhatsApp (whatsapp) tutuyor.
- Ürün görselleri product.image'dan alınıyor, çözümleme: resolveVisualAssetUrl (src/utils/image.ts).

Davranış:
- "Kataloğu İndir" butonuna basılınca yazdırma modu açılır.
- Ürünler kategorilere göre gruplu, her sayfada 4-6 ürün.
- Kapak: Logo + Firma Adı + Tarih.
- Son sayfa: İletişim (adres, WhatsApp, Instagram).

Tasarım:
- A4 format, dikey.
- Temiz, minimalist.
- Siyah-beyaz yazıcıda da okunabilir.

Teknik:
- window.print() + CSS @media print kullan. Sıfır ek kütüphane.
- PrintableView.tsx bileşeni oluştur (sayfayı yazdırma modunda gösterilecek düzenle).
- @media print CSS kuralları: Navbar, footer, yüzen menüler, butonlar gizlenir. Sadece ürün grid kalır.
- Ana CSS dosyasına (index.css) @media print kuralları ekle.
```

---

## GÖREV 11/11: Seçili Ürünler Kolaj Fotoğraf İndirme 🧠

```
Seçilen ürünlerin kolaj fotoğrafını indirme özelliği ekle (Instagram paylaşımı için).

⚠️ MEVCUT ALTYAPI:
- Product tipi ve görselleri mevcut. resolveVisualAssetUrl ile HQ görsellere erişilebilir.
- settings.logoUrl ve settings.whatsapp mevcut.
- Bu görev html2canvas kütüphanesi gerektirebilir (npm install html2canvas). DİĞER TÜM GÖREVLERDEN FARKLI olarak bu tek görevde harici kütüphane olabilir.

Davranış:
- Müşteri "Görsel İndir" moduna girer (buton ile).
- Ürünlere tıklayarak seçer (her karta checkbox overlay gelir).
- "İndir" butonuna basınca: seçilen ürünlerin fotoğrafları grid olarak birleştirilir.
- Sonuç: 1080x1080 (kare) veya 1080x1350 (dikey) JPG/PNG dosyası.
- Alt kısımda firma logosu + WhatsApp numarası otomatik eklenir.

Tasarım:
- Grid: 2x2, 2x3, veya 3x3 (seçilen ürün sayısına göre otomatik).
- Her hücre: Ürün fotoğrafı + küçük fiyat etiketi.
- Temiz beyaz arka plan, ince çerçeveler.
- Alt şerit: Logo + WhatsApp + firma adı.

Teknik:
- npm install html2canvas gerekebilir.
- CollageGenerator.tsx bileşeni oluştur.
- Gizli bir div'de (<div style={{position:'absolute', left:'-9999px'}}>) kolajdaki grid'i oluştur.
- html2canvas ile o div'i canvas'a çevir, canvas.toDataURL ile PNG olarak indir.
- Seçim state'i: selectedProductIds: string[] (App.tsx'de veya kendi hook'unda).
- Seçim modunu açma/kapama toggle'ı gerekli.
```
