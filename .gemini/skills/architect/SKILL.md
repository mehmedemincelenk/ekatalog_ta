---
name: architect
description: Proje hafızasını tutan, kod tekrarını önleyen ve tüm hooks/utils/components envanterini yöneten ana mimari rehber.
---

# Skill: Architect & Codebase Oracle
## Tam Proje Envanteri ve Tekrarı Önleme Rehberi

Sen bu projenin baş mimarısın. Yeni bir satır kod yazmadan önce mutlaka bu envanteri kontrol et.

---

### 🧠 HOOKS ENVANTERİ (Logic)

#### UI & Etkileşim (`src/hooks/ui/`)
- **`useStringEditor`**: Global metin/sayı düzenleme yönetimi (Modal/Inline tetikleyici).
- **`useLongPress`**: Unified Pointer Events ile uzun basma algılama (Logo girişi).
- **`useSwipe`**: Mobil cihazlar için kaydırma (swipe) hareketleri.
- **`useClickOutside`**: Bir öğenin dışına tıklandığında (örn: menü kapatma) aksiyon alma.
- **`useAutoFocus`**: Modal açıldığında inputa otomatik odaklanma.
- **`useTextOverflow`**: Metnin taşıp taşmadığını (marquee için) kontrol etme.
- **`useFloatingMenu`**: AssistiveTouch tarzı yüzen menülerin (admin menüsü) mantığı.
- **`useScrollToClose`**: Sayfa kaydırıldığında açık olan modal/zoom'u kapatma.
- **`useAsyncAction`**: Async işlemlerde loading/error yönetimi.
- **`useHeroCarousel`**: Ana sayfa slider mekanizması.

#### Katalog & Ürün (`src/hooks/catalog/`)
- **`useProducts`**: Ürün listeleme, ekleme, silme, güncelleme ve toplu fiyat işlemleri (Supabase sync).
- **`useProductPricing`**: İndirim hesaplama ve fiyat etiketleme mantığı.
- **`useDiscount`**: Kupon kodu uygulama ve doğrulama.
- **`useSearchFilterLogic`**: Arama ve kategori filtreleme algoritması.
- **`useProductGridLogic`**: Ürünlerin kategorilere göre gruplanması ve sıralanması.

#### Auth & Ayarlar (`src/hooks/auth/` & `src/hooks/store/`)
- **`useAdminMode`**: Admin yetkisi ve logo hareketlerinin koordinasyonu.
- **`usePinAuth`**: PIN giriş süreci ve modal yönetimi.
- **`useSettings`**: Mağaza genel ayarları (isim, logo, adres, sosyal medya) ve veritabanı sync.

#### Depolama (`src/hooks/storage/`)
- **`useProductStorage`**: Resim yükleme ve silme (Supabase Storage).
- **`useLocalStorage`**: Tarayıcı bazlı kalıcı veri saklama.

---

### 🛠️ UTILS & FORMATTERS (Toolbox)

#### Fiyat & Rakam (`src/utils/formatters/price.ts`)
- `ensureCurrencySymbol`: Başına ₺ ekler.
- `transformCurrencyStringToNumber`: Yazıyı matematiksel sayıya çevirir.
- `formatNumberToCurrency`: Sayıyı ₺1.000,00 formatına sokar.
- `calculatePromotionalPrice`: İndirimli fiyatı hesaplar.

#### İletişim & Medya (`src/utils/formatters/contact.ts` & `src/utils/media/`)
- `formatWhatsAppUrl`: Numaradan direkt link oluşturur.
- `optimizeImage`: Resimleri boyutlandırır ve optimize eder (Vite/Supabase uyumlu).

#### Yardımcılar (`src/utils/helpers/`)
- `verifyStorePin`: Sunucu taraflı PIN kontrolü (auth.ts).
- `getActiveStoreSlug`: Mevcut dükkan ismini URL'den çözer (store.ts).

---

### 📦 COMPONENTS (Building Blocks)

#### UI Atoms (`src/components/ui/`)
- **`EditableField`**: OMNI-EDITOR. Her türlü metin/sayı düzenleme için tek adres.
- **`Button`**: Standartlaştırılmış buton (Primary, Secondary, Circle, Ghost modları).
- **`SmartImage`**: Resim yükleme, hata yönetimi ve placeholder desteği.
- **`ModalBase`**: Tüm modalların temel iskeleti.
- **`ConfirmModal`**: "Emin misiniz?" onay pencereleri.
- **`MarqueeText`**: Taşınca kayan, adminse düzenlenen metin bileşeni.
- **`LoadingSpinner`**: Apple tarzı minimalist yükleme animasyonu.

---

### 📜 CORE MANDATES (Yazılım Kanunları)

1. **Önce Oku**: Bir util yazmadan önce `price.ts`'e, bir hook yazmadan önce `hooks/` klasörüne bak.
2. **Cerrahi Ayrıştırma (Surgical Separation)**: Bir dosya içinde yazılan mantık (logic), util veya UI parçası eğer bağımsız bir hook, util veya component olabilecek nitelikteyse, onu ASLA dosya içinde bırakma. Derhal ilgili klasöre (`hooks/`, `utils/`, `components/ui/`) taşı ve oradan import et.
3. **EditableField Kullan**: Yerinde düzenleme veya modal düzenleme için başka kod yazma.
3. **Mühendislik Standartları**: `useCatalogLogic` ana beyindir, veriyi oradan çek. `useStringEditor` tüm düzenlemeleri koordine eder.
4. **Kod Tekrarı Yasaktır**: Aynı işi yapan ikinci bir fonksiyon veya bileşen tespit edilirse derhal mevcut olanla birleştirilmelidir.

---
*Mükemmellik, eklenecek bir şey kalmadığında değil, çıkarılacak bir şey kalmadığında elde edilir.*
