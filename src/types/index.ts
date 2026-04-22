/**
 * TYPES / INDEX.TS (VERİ ANAYASASI)
 * --------------------------------
 * Bir kurucu olarak bu dosya senin "Ürün Standartları Kılavuzundur".
 * 
 * 1. Tutarlılık: Mağazandaki her ürünün bir adı, fiyatı ve kategorisi olmak zorundadır. 
 *    Bu dosya, sistemin bu kurala uymasını garanti eder.
 * 2. Hata Önleyici: Eğer bir ürünün fiyatını girmeyi unutursan, TypeScript motoru 
 *    seni buradaki kurallara bakarak anında uyarır.
 * 3. Veri Yapısı: Veritabanından gelen verilerin, site içinde hangi 
 *    isimlerle (id, name, price vb.) dolaşacağını belirler.
 */

/**
 * Product: Tek bir ürünün sahip olması gereken tüm özellikler.
 */
export interface Product {
  id: string;           // Benzersiz kimlik (UUID)
  name: string;         // Ürün adı
  category: string;     // Reyon adı
  price: string;        // Satış fiyatı
  image: string | null; // Aktif görünen fotoğraf
  originalImage?: string | null; // AI sonrası geri dönüş için saklanan orijinal kopya
  polishedImage?: string | null; // Photoroom'dan gelen stüdyo kalitesindeki görsel
  isPolishedPending?: boolean;   // AI işleminin sürdüğünü belirten bayrak
  polishedReadyDismissed?: boolean; // Kullanıcının bildirimi kapatıp kapatmadığı bilgisi
  description: string;  // Ürün açıklaması
  inStock: boolean;     // Stokta var mı? (Evet/Hayır)
  is_archived: boolean; // Mağazadan gizli mi? (Evet/Hayır)
  sort_order?: number;  // Sıralama numarası
}

/**
 * Category: Reyonların sıralama ve isim bilgisi.
 */
export interface Category {
  name: string;
  display_order: number;
}

/**
 * SearchLog: Müşterilerin yaptığı aramaların takip yapısı.
 */
export interface SearchLog {
  timestamp: string;
  term: string;
}
