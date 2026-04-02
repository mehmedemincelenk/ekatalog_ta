// ============================================================
// ÜRÜN VERİ TABANI
// NOT: Tüm veriler yerel hafıza (localStorage) üzerinde saklanır.
// ============================================================

export const DEFAULT_PRODUCTS = [
  // --- BASKILI ÜRÜNLER ---
  { id: 1, name: 'Baskılı Pipet', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nFirmanıza Özel Baskı' },
  { id: 2, name: 'Baskılı Şeker', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nFirmanıza Özel Baskı' },
  { id: 3, name: 'Baskılı Poşet', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nFirmanıza Özel Baskı' },
  { id: 4, name: 'Baskılı Kağıt', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Sargı Kağıdı\nFirmanıza Özel Baskı' },
  { id: 5, name: 'Baskılı Mendil', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Islak / Kuru Opsiyonları\nFirmanıza Özel Baskı' },
  { id: 6, name: 'Baskılı Kese Kağıdı Çeşitleri', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Farklı Boy Çeşitleri\nFirmanıza Özel Baskı' },

  // --- TURŞU VE GIDA ÇEŞİTLERİ ---
  { id: 101, name: 'LİNA Salatalık Turşusu', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺315', image: null, description: '1 Kova\nLİNA Marka Kalitesi' },
  { id: 102, name: 'LİNA Sivri Biber Turşusu', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺1.565', image: null, description: '1 Kova\nLİNA Marka Kalitesi' },
  { id: 103, name: 'LİNA Yaman Tombul Turşusu', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺540', image: null, description: '1 Kova\nLİNA Marka Kalitesi' },
  { id: 104, name: 'LİNA JALAPENO TURŞUSU', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nLİNA Marka Kalitesi' },
  { id: 80, name: 'LİNA Ketçap (9 Kg)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺275', image: null, description: '9 Kg Kova\nLİNA Kalitesi' },
  { id: 81, name: 'LİNA Mayonez (8 Kg)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺285', image: null, description: '8 Kg Kova\nLİNA Kalitesi' },
  { id: 105, name: 'Gold Mayonez (8 Kg)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺190', image: null, description: '8 Kg Kova' },
  { id: 106, name: 'Gold Ketçap (8 Kg)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺190', image: null, description: '8 Kg Kova' },
  { id: 107, name: 'Fişek Ketçap (500 Adet)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺250', image: null, description: '1 Koli / 500 Adet' },
  { id: 108, name: 'Fişek Mayonez (500 Adet)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺250', image: null, description: '1 Koli / 500 Adet' },
  { id: 77, name: 'Domates Salçası (4.3 Kg)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺200', image: null, description: '4.3 Kg Kutu' },
  { id: 109, name: 'Seç Biber Salçası (9 Kg)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺725', image: null, description: '9 Kg Kova' },
  { id: 82, name: 'Lobas Nar Suyu / Ekşisi', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺35', image: null, description: '1 Adet / Şişe' },
  { id: 85, name: 'Sızma Zeytinyağı 5 Lt', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: '5 Litre Teneke' },
  { id: 83, name: 'Bardak Su Koli', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺250', image: null, description: 'Toplu Tüketim Paket Koli' },
  { id: 84, name: '0.5 Lt Su Koli 12\'li', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺35', image: null, description: '1 Koli / 12 Şişe' },

  // --- BAHARAT GRUBU ---
  { id: 201, name: 'Yağlı Pul Biber (5 Kg)', category: 'BAHARAT GRUBU', price: '₺800', image: null, description: '5 Kg Paket' },
  { id: 202, name: 'Başkan Pul Biber (5 Kg)', category: 'BAHARAT GRUBU', price: '₺700', image: null, description: '5 Kg Paket' },
  { id: 203, name: 'Yaprak Pul Biber (1 Kg)', category: 'BAHARAT GRUBU', price: '₺115', image: null, description: '1 Kg Paket' },
  { id: 204, name: 'Yaprak İsot (1 Kg)', category: 'BAHARAT GRUBU', price: '₺115', image: null, description: '1 Kg Paket' },
  { id: 205, name: 'Toz Biber 1. Kalite (1 Kg)', category: 'BAHARAT GRUBU', price: '₺150', image: null, description: '1 Kg Paket' },
  { id: 206, name: 'Sumak 1. Kalite (1 Kg)', category: 'BAHARAT GRUBU', price: '₺175', image: null, description: '1 Kg Paket' },
  { id: 207, name: 'Kekik (1 Kg)', category: 'BAHARAT GRUBU', price: '₺75', image: null, description: '1 Kg Paket' },
  { id: 208, name: 'Nane (400 g)', category: 'BAHARAT GRUBU', price: '₺90', image: null, description: '400 Gram Paket' },
  { id: 209, name: 'Limon Tuzu (1 Kg)', category: 'BAHARAT GRUBU', price: '₺95', image: null, description: '1 Kg Paket' },
  { id: 210, name: 'Karbonat (1 Kg)', category: 'BAHARAT GRUBU', price: '₺65', image: null, description: '1 Kg Paket' },
  { id: 211, name: 'Köri (1 Kg)', category: 'BAHARAT GRUBU', price: '₺120', image: null, description: '1 Kg Paket' },
  { id: 212, name: 'Kimyon (1 Kg)', category: 'BAHARAT GRUBU', price: '₺120', image: null, description: '1 Kg Paket' },
  { id: 213, name: 'Karabiber (1 Kg)', category: 'BAHARAT GRUBU', price: '₺140', image: null, description: '1 Kg Paket' },
  { id: 214, name: '7 Türlü (1 Kg)', category: 'BAHARAT GRUBU', price: '₺150', image: null, description: '1 Kg Paket' },
  { id: 215, name: 'Sarımsak Toz (1 Kg)', category: 'BAHARAT GRUBU', price: '₺140', image: null, description: '1 Kg Paket' },
  { id: 216, name: 'Paket Pul Biber (1000 Adet)', category: 'BAHARAT GRUBU', price: '₺170', image: null, description: '1 Koli / 1000 Adet' },
  { id: 217, name: 'Paket Kara Biber (1000 Adet)', category: 'BAHARAT GRUBU', price: '₺170', image: null, description: '1 Koli / 1000 Adet' },

  // --- PEÇETE ---
  { id: 301, name: 'Focus Peçete 32x100', category: 'PEÇETE', price: '₺310', image: null, description: '1 Koli / 32 Paket' },
  { id: 302, name: 'Mirada Peçete 24x100', category: 'PEÇETE', price: '₺375', image: null, description: '1 Koli / 24 Paket' },
  { id: 303, name: 'LİNA Dispanser Peçete', category: 'PEÇETE', price: '₺115', image: null, description: '1 Koli / LİNA Marka' },
  { id: 304, name: 'Nergis Dispanser Peçete', category: 'PEÇETE', price: '₺145', image: null, description: '4500 Adet' },
  { id: 305, name: 'İçten Çekmeli Havlu', category: 'PEÇETE', price: '₺215', image: null, description: '1 Koli' },
  { id: 306, name: 'Z Katlama Havlu', category: 'PEÇETE', price: '₺155', image: null, description: '1 Koli' },
  { id: 61, name: 'Hareketli Havlu (6 Rulo)', category: 'PEÇETE', price: '₺200', image: null, description: '1 Koli / 6 Rulo' },
  { id: 307, name: 'Garson Katlama 33x33', category: 'PEÇETE', price: '₺375', image: null, description: '1 Koli' },
  { id: 308, name: 'Mini Jumbo Tuvalet Kağıdı', category: 'PEÇETE', price: '₺200', image: null, description: '1 Koli / 12 Rulo' },
  { id: 309, name: 'Focus Rulo Havlu (24 Adet)', category: 'PEÇETE', price: '₺250', image: null, description: '1 Koli / 24 Adet' },
  { id: 310, name: 'Artu Mendil 7x10', category: 'PEÇETE', price: '₺160', image: null, description: '1 Koli' },
  { id: 59, name: 'Sleepy Temizlik Havlusu', category: 'PEÇETE', price: '₺75', image: null, description: '100\'lü Paket' },
  { id: 60, name: 'Islak Mendil 120\'li', category: 'PEÇETE', price: '₺25', image: null, description: '120\'li Paket' },

  // --- KÖPÜK ---
  { id: 401, name: 'Erze Küçük Köpük Tabak', category: 'KÖPÜK', price: '₺115', image: null, description: '1 Koli' },
  { id: 402, name: 'Erze Orta Köpük Tabak', category: 'KÖPÜK', price: '₺150', image: null, description: '1 Koli' },
  { id: 403, name: 'Erze Büyük Köpük Tabak', category: 'KÖPÜK', price: '₺150', image: null, description: '1 Koli' },
  { id: 404, name: '3 Göz Kapaklı Köpük', category: 'KÖPÜK', price: '₺200', image: null, description: '100 Adet' },
  { id: 405, name: 'İçi Boş Kapaklı Köpük', category: 'KÖPÜK', price: '₺200', image: null, description: '100 Adet' },
  { id: 406, name: '3 Göz Kapaksız Köpük', category: 'KÖPÜK', price: '₺195', image: null, description: '200 Adet' },
  { id: 407, name: 'Pizza Köpük', category: 'KÖPÜK', price: '₺250', image: null, description: '100 Adet' },
  { id: 408, name: 'Cici Köpük', category: 'KÖPÜK', price: '₺285', image: null, description: '250 Adet' },
  { id: 409, name: 'K. Hamburger Köpük', category: 'KÖPÜK', price: '₺285', image: null, description: '250 Adet' },

  // --- KAĞIT ---
  { id: 501, name: 'Beyaz Kağıt 30x40', category: 'KAĞIT', price: '₺320', image: null, description: '10 Kg Paket' },
  { id: 502, name: 'Dijital Kağıt 30x40', category: 'KAĞIT', price: '₺250', image: null, description: '10 Kg Paket' },
  { id: 503, name: 'Sülfit Kağıt 30x40', category: 'KAĞIT', price: '₺325', image: null, description: '10 Kg Paket' },
  { id: 504, name: 'Kısa Burger Kese Kağıdı', category: 'KAĞIT', price: '₺525', image: null, description: '10 Kg Paket' },
  { id: 505, name: 'Dürüm Kese Kağıdı', category: 'KAĞIT', price: '₺525', image: null, description: '10 Kg Paket' },
  { id: 506, name: 'Uzun Burger Kese Kağıdı', category: 'KAĞIT', price: '₺525', image: null, description: '10 Kg Paket' },
  { id: 507, name: 'Kahverengi Pide Kağıdı', category: 'KAĞIT', price: '₺285', image: null, description: '100 Adet' },
  { id: 508, name: 'Kahverengi Lahmacun Kağıdı', category: 'KAĞIT', price: '₺590', image: null, description: '100 Adet' },
  { id: 509, name: 'Pizza Kahve Kutusu', category: 'KAĞIT', price: '₺445', image: null, description: '1 Koli' },
  { id: 510, name: 'Pizza Kutu Kahve 26x26', category: 'KAĞIT', price: '₺400', image: null, description: '1 Koli' },
  { id: 511, name: 'Çorba Kap Beste', category: 'KAĞIT', price: '₺650', image: null, description: '1 Koli' },

  // --- PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU ---
  { id: 601, name: 'Çatal / Kaşık Lux Paket', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺24', image: null, description: '1 Paket' },
  { id: 602, name: 'Bıçak Lux Paket', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺25', image: null, description: '1 Paket' },
  { id: 603, name: 'Paket Tuz Salt', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺22', image: null, description: '1 Kg Paket' },
  { id: 604, name: 'Kürdan Jelatinli', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺15', image: null, description: '1 Paket' },
  { id: 605, name: 'Pipet Kağıtlı', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺15', image: null, description: '200 Adet' },
  { id: 606, name: 'Poşet Eldiven', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺15', image: null, description: '100 Adet' },
  { id: 607, name: 'Sızdırmaz Kap (150gr - 750gr)', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺55 - ₺130', image: null, description: '100 Adet / Çeşitli Boylar' },
  { id: 608, name: 'Eltron 250gr / 500gr Kase', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺50 - ₺65', image: null, description: 'Paket Fiyatı' },
  { id: 609, name: 'Süp Kase', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺40', image: null, description: '100 Adet' },
  { id: 610, name: 'Sos Kabı 20cc / 50cc', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺30 - ₺40', image: null, description: '100 Adet' },
  { id: 611, name: '7 Öz Bardak', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺20', image: null, description: '100 Adet' },
  { id: 612, name: '12 Öz Karton Bardak', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺90', image: null, description: '100 Adet' },
  { id: 613, name: '12 Öz Plastik Bardak', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺15', image: null, description: '100 Adet' },
  { id: 614, name: 'Kebap Kabı 3 Göz + Kapak', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺775', image: null, description: 'Koli Fiyatı' },
  { id: 615, name: 'Mikrodalga Kap + Kapak', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺775', image: null, description: '200 Adet / İçi Boş' },

  // --- STREÇ ÇEŞİTLERİ ---
  { id: 7, name: 'Streç Film', category: 'STREÇ ÇEŞİTLERİ', price: '₺75', image: null, description: '1 Adet Rulo' },
  { id: 8, name: 'Açık Streç 200 Mt (İlka)', category: 'STREÇ ÇEŞİTLERİ', price: '₺95', image: null, description: '1 Adet / 200 Metre' },
  { id: 701, name: 'Alüminyum Folyo 400 Gr', category: 'STREÇ ÇEŞİTLERİ', price: '₺85', image: null, description: '1 Adet' },
  { id: 702, name: 'Alüminyum Folyo 1 Kg', category: 'STREÇ ÇEŞİTLERİ', price: '₺170', image: null, description: '1 Adet' },
  { id: 10, name: '30x1500 Streç Film', category: 'STREÇ ÇEŞİTLERİ', price: '₺550', image: null, description: '30 cm Genişlik / 1500 Metre' },
  { id: 11, name: '45x1500 Streç Film', category: 'STREÇ ÇEŞİTLERİ', price: '₺700', image: null, description: '45 cm Genişlik / 1500 Metre' },
  { id: 15, name: 'Patpat 50 Mt', category: 'STREÇ ÇEŞİTLERİ', price: '₺250', image: null, description: 'Balonlu Naylon / 50 Metre' },

  // --- ALÜMİNYUM ÇEŞİTLERİ ---
  { id: 16, name: 'Sütlaç Kabı', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺80', image: null, description: '100 Adet' },
  { id: 801, name: 'Alüminyum Kap + Kap (250gr - 1.5kg)', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺145 - ₺320', image: null, description: 'Kapak Dahildir' },
  { id: 23, name: '2/3 Gözlü Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺320', image: null, description: '100 Adet / Kapak Dahil' },
  { id: 25, name: 'Künefe Kabı + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺180', image: null, description: '100 Adet / Kapak Dahil' },
  { id: 26, name: 'Oval Tepsi', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺155', image: null, description: '25 Adet' },

  // --- POŞET ÇEŞİTLERİ ---
  { id: 28, name: 'Orta Poşet Dökme', category: 'POŞET ÇEŞİTLERİ', price: '₺40 - ₺44', image: null, description: '1 Kg' },
  { id: 30, name: 'Dürüm Hışır Poşet', category: 'POŞET ÇEŞİTLERİ', price: '₺48', image: null, description: '500 Gram' },
  { id: 31, name: 'Yapışkanlı Set Poşeti', category: 'POŞET ÇEŞİTLERİ', price: '₺125', image: null, description: '1 Kg' },
  { id: 32, name: 'Küçük/Orta Hışır Poşet', category: 'POŞET ÇEŞİTLERİ', price: '₺35 - ₺43', image: null, description: '250 Adet' },
  { id: 34, name: 'Çöp Poşeti 80x110', category: 'POŞET ÇEŞİTLERİ', price: '₺26 - ₺385', image: null, description: 'Adet / 10 Kg Dökme Seçenekleri' },
  { id: 37, name: 'Kilit Torba Çeşitleri', category: 'POŞET ÇEŞİTLERİ', price: '₺185', image: null, description: '5x5 - 7x9 Arası Çeşitler' },
  { id: 73, name: 'Tahta Karıştırıcı', category: 'POŞET ÇEŞİTLERİ', price: '₺35', image: null, description: '1000 Adet' },
  { id: 74, name: 'Cips Çatalı', category: 'POŞET ÇEŞİTLERİ', price: '₺45', image: null, description: '1000 Adet' },

  // --- DETERJAN ---
  { id: 41, name: 'Çamaşır Suyu (5 Lt - 30 Lt)', category: 'DETERJAN', price: '₺100 - ₺400', image: null, description: 'Bidon Seçenekleri' },
  { id: 45, name: 'Bulaşık Deterjanı (5 Lt - 20 Kg)', category: 'DETERJAN', price: '₺110 - ₺450', image: null, description: 'Bidon Seçenekleri' },
  { id: 48, name: 'Yüzey Temizleyici 5 Lt', category: 'DETERJAN', price: '₺100', image: null, description: 'Limon vb. Kokulu' },
  { id: 50, name: 'Camsil Start 5 Lt', category: 'DETERJAN', price: '₺100', image: null, description: '5 Litre' },
  { id: 55, name: 'Sıvı Sabun (1.5 Lt - 5 Lt)', category: 'DETERJAN', price: '₺40 - ₺100', image: null, description: 'Şişe / Bidon Seçenekleri' },
  { id: 53, name: 'Arap Sabunu (1 Lt - 5 Lt)', category: 'DETERJAN', price: '₺45 - ₺100', image: null, description: 'Şişe / Bidon Seçenekleri' },
  { id: 58, name: 'Peros Katı Jel 9 Kg', category: 'DETERJAN', price: '₺425', image: null, description: '9 Kilogram' },
  { id: 44, name: 'Çamaşır Sodası 500 Gr', category: 'DETERJAN', price: '₺30', image: null, description: '500 Gram' },

  // --- HİJYEN SARF MALZEMELERİ ---
  { id: 64, name: 'Siyah Eldiven 100\'lü (M/L)', category: 'HİJYEN SARF MALZEMELERİ', price: '₺100 - ₺120', image: null, description: 'Nitril / Lüks' },
  { id: 900, name: 'Eldiven Cerrah L', category: 'HİJYEN SARF MALZEMELERİ', price: '₺115', image: null, description: 'L Beden Klasik' },
  { id: 91, name: 'Dezenfektan 1 Lt', category: 'HİJYEN SARF MALZEMELERİ', price: '₺50', image: null, description: '1 Litre Pompalı' },
  { id: 92, name: 'Kolonya Limon 5 Lt', category: 'HİJYEN SARF MALZEMELERİ', price: '₺300', image: null, description: '5 Litre Bidon' },
  { id: 71, name: '100 Adet Bone / Kolluk', category: 'HİJYEN SARF MALZEMELERİ', price: '₺50', image: null, description: '1 Paket / 100 Adet' },

  // --- ÖZEL SETLER ---
  { id: 86, name: 'Lux 6\'lı İkram Seti', category: 'Özel Setler', price: '₺475', image: null, description: '1 Koli / Lüks Paket' },
  { id: 87, name: '5\'li Lux Set', category: 'Özel Setler', price: '₺425', image: null, description: '1 Koli / Lüks Paket' },
  { id: 88, name: 'Dürüm Set 4\'lü', category: 'Özel Setler', price: '₺550', image: null, description: '1 Koli / Hazır Paket' },
];
