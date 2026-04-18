# 🔍 POTANSİYEL BUGLAR & TEKNİK AÇIKLAR

Bu liste, sistemin kararlılığını tehdit eden ve MVP aşamasında çözülmesi gereken kritik teknik borçları içerir.

### 1. Fiyat Ayrıştırma (Critical)
*   **Dosya:** `src/utils/price.ts` -> `transformCurrencyStringToNumber`
*   **Sorun:** Fonksiyon şu an binlik ayırıcıları (nokta) ondalık sanıyor.
    *   Örn: `1.250,50` girdisini `1.25` olarak parse ediyor.
    *   **Risk:** Toplu fiyat güncellemelerinde veya ürün eklemede fiyatların yanlış (çok düşük) kaydedilmesi.

### 2. Input Validasyon Eksikliği (Medium)
*   **Dosya:** `src/components/AddProductModal.tsx`
*   **Sorun:** Fiyat alanı `text` input ve herhangi bir kısıtlama yok.
    *   Kullanıcı harf girerse veya boş bırakırsa `parseFloat` sonucu `NaN` veya `0` dönebilir.
    *   **Risk:** Veritabanında bozuk fiyat verisi.

### 3. Veri Tipi Karmaşası (Low/Medium)
*   **Dosya:** `src/types/index.ts` & `AddProductModal.tsx`
*   **Sorun:** Fiyat bazı yerlerde `string` (UI için), bazı yerlerde `number` (işlem için) olarak geçiyor.
    *   **Risk:** `toFixed()` veya matematiksel işlemlerde "not a function" hataları.

### 4. State Senkronizasyon Gecikmesi (Low)
*   **Dosya:** `src/hooks/useProducts.ts`
*   **Sorun:** Ürün eklendikten sonra listenin anlık güncellenmesi Supabase -> LocalStorage -> UI döngüsünde bazen "yarış durumuna" (race condition) düşebilir.
    *   **Risk:** Kullanıcının eklediği ürünü listede hemen görememesi.
