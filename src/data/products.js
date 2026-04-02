// ============================================================
// ÜRÜN VERİ TABANI
// NOT: Tüm veriler yerel hafıza (localStorage) üzerinde saklanır.
// ============================================================

export const DEFAULT_PRODUCTS = [
  // --- TURŞU VE GIDA ÇEŞİTLERİ ---
  { id: 101, name: 'LİNA Salatalık Turşusu', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺315', image: null, description: 'Özel Yapım\nToptan Büfe Boy Büyük Kova' },
  { id: 102, name: 'LİNA Yaman Turşusu', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nLİNA Marka Kalitesi' },
  { id: 103, name: 'LİNA Sivri Turşusu', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nLİNA Marka Kalitesi' },
  { id: 104, name: 'LİNA JALAPENO TURŞUSU', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nLİNA Marka Kalitesi' },
  { id: 80, name: 'LİNA Ketçap', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺275', image: null, description: 'Kaliteli Büfe Tercihi\n9 Kilogram Kova' },
  { id: 81, name: 'LİNA Mayonez', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺290', image: null, description: 'Kaliteli Büfe Tercihi\n8 Kilogram Kova' },
  { id: 77, name: 'Domates Salçası', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺200', image: null, description: 'Ticari Mutfak Boyu\n4.3 Kilogram / Kutu' },
  { id: 78, name: 'Ketçap (Gold Marka)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺200', image: null, description: 'Fast Food Boy\n9 Kilogram Kova' },
  { id: 79, name: 'Mayonez (Gold Marka)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺200', image: null, description: 'Fast Food Boy\n8 Kilogram Kova' },
  { id: 82, name: 'Nar Ekşisi', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺35', image: null, description: 'Sos ve Salata Hazırlığı\n1 Litre Şişe' },
  { id: 83, name: 'Bardak Su (Pet)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺250', image: null, description: 'Toplu Tüketim Paket Koli' },
  { id: 84, name: 'Şişe Su (0.5 Lt)', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: '₺35', image: null, description: 'Yarım Litrelik Bireysel Pet Şişe\n1 Koli / 12 Şişe İçerir' },
  { id: 85, name: 'Sızma Zeytinyağı', category: 'TURŞU VE GIDA ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: 'El değmeden, Hakiki Üretim\n5 Litre Teneke' },

  // --- BAHARAT GRUBU ---
  { id: 201, name: 'Pul Biber', category: 'BAHARAT GRUBU', price: 'Fiyat Sorunuz', image: null, description: 'Taze ve Kaliteli' },
  { id: 202, name: 'Nane', category: 'BAHARAT GRUBU', price: 'Fiyat Sorunuz', image: null, description: 'Taze ve Kaliteli' },
  { id: 203, name: 'Kekik', category: 'BAHARAT GRUBU', price: 'Fiyat Sorunuz', image: null, description: 'Taze ve Kaliteli' },

  // --- PEÇETE ---
  { id: 63, name: 'Tuvalet Kağıdı (Papilion)', category: 'PEÇETE', price: '₺175', image: null, description: '1 Koli / 40 Rulo' },
  { id: 61, name: 'Hareketli Havlu (Sensörlü İçin)', category: 'PEÇETE', price: '₺200', image: null, description: 'Dispenser Kağıt Havlu\n1 Koli / 25 Kilogram' },
  { id: 59, name: 'Yüzey Temizlik Havlusu (Sleepy)', category: 'PEÇETE', price: '₺75', image: null, description: 'Kullan At Havlu Bezi\n1 Paket / 100 Yaprak' },
  { id: 60, name: 'Islak Mendil Paket', category: 'PEÇETE', price: '₺25', image: null, description: '1 Paket / 120 Yaprak' },

  // --- KÖPÜK ---
  { id: 69, name: 'Köpük Tabak (Küçük)', category: 'KÖPÜK', price: '₺40', image: null, description: 'Tek kullanımlık Gıda Güvenli\nGünlük Fiyat Sürümü' },
  { id: 70, name: 'Köpük Tabak (Büyük)', category: 'KÖPÜK', price: '₺160', image: null, description: 'Kasap & Fiş Tipi Tabak' },

  // --- KAĞIT ---
  { id: 65, name: 'Karton Bardak', category: 'KAĞIT', price: '₺15', image: null, description: 'Çay / Kahve Otomat Fincanı\n1 Paket / 50 Adet' },
  { id: 75, name: 'Standart Kağıt & Keselar', category: 'KAĞIT', price: 'Fiyat Sorunuz', image: null, description: 'Hamur & Fırın kağıt türleri' },
  { id: 6, name: 'Baskılı Kese Kağıdı', category: 'KAĞIT', price: 'Fiyat Sorunuz', image: null, description: 'Farklı Boy Çeşitleri\nFirmanıza Özel Baskı' },

  // --- PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU ---
  { id: 66, name: 'Pipet (Standart Çeşitler)', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺15', image: null, description: 'Körüklü / Düz seçenekli' },
  { id: 73, name: 'Tahta Karıştırıcı', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺35', image: null, description: 'Çay / Kahve Çubuğu\n1 Paket / 1000 Adet' },
  { id: 74, name: 'Plastik Cips / Tadım Çatalı', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: '₺45', image: null, description: 'Dondurma ve Küçük Sunum İçin\n1 Paket / 1000 Adet' },
  { id: 105, name: 'Sızdırmaz Kap Çeşitleri', category: 'PLASTİK ÜRÜNLERİ VE SIZDIRMAZ GRUBU', price: 'Fiyat Sorunuz', image: null, description: 'Farklı boy ve sızdırmazlık seçenekleri' },

  // --- STREÇ ÇEŞİTLERİ ---
  { id: 7, name: 'Streç Film', category: 'STREÇ ÇEŞİTLERİ', price: '₺75', image: null, description: '1 Adet Rulo' },
  { id: 8, name: 'Açık Streç Film (İlka)', category: 'STREÇ ÇEŞİTLERİ', price: '₺95', image: null, description: '200 Metre Uzunluk\n1 Adet Rulo' },
  { id: 10, name: 'Streç Film (30cm)', category: 'STREÇ ÇEŞİTLERİ', price: '₺550', image: null, description: '30 cm Genişlik\n1500 Metre Uzunluk\n1 Adet Rulo' },
  { id: 11, name: 'Streç Film (45cm XL)', category: 'STREÇ ÇEŞİTLERİ', price: '₺700', image: null, description: '45 cm Genişlik\n1500 Metre Uzunluk\n1 Adet Rulo' },
  { id: 12, name: 'Streç Film (45\'lik, 200 Mt)', category: 'STREÇ ÇEŞİTLERİ', price: '₺85', image: null, description: '45 cm Genişlik\n200 Metre Uzunluk\n1 Adet Rulo' },
  { id: 15, name: 'Patpat (Balonlu Naylon)', category: 'STREÇ ÇEŞİTLERİ', price: '₺250', image: null, description: '50 Metre Rulo' },

  // --- ALÜMİNYUM ÇEŞİTLERİ ---
  { id: 9, name: 'Alüminyum Folyo (400 Gr)', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺85', image: null, description: '400 Gram\n1 Adet Rulo' },
  { id: 13, name: 'Alüminyum Folyo (1 Kg)', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺170', image: null, description: '1 Kilogram\n1 Adet Rulo' },
  { id: 16, name: 'Sütlaç Kabı (Alüminyum)', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺80', image: null, description: '1 Paket / 100 Adet' },
  { id: 17, name: 'Alüminyum Kap (250 Gr)', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺145', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 21, name: 'Alüminyum Kap (1 Kg)', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺265', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 23, name: 'Alüminyum Kap (3 Gözlü)', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺320', image: null, description: 'Bölmeli Yemek Kabı\nKapak Dahildir\n1 Paket / 100 Adet' },

  // --- POŞET ÇEŞİTLERİ ---
  { id: 28, name: 'Dökme Poşet', category: 'POŞET ÇEŞİTLERİ', price: '₺44', image: null, description: 'Orta Boy\n1 Kilogram (Kg)' },
  { id: 29, name: 'Poşet (Ambalajcım)', category: 'POŞET ÇEŞİTLERİ', price: '₺40', image: null, description: 'Orta Boy\nKendi markamız\n1 Kilogram (Kg)' },
  { id: 32, name: 'Hışır Poşet (Küçük)', category: 'POŞET ÇEŞİTLERİ', price: '₺35', image: null, description: 'Küçük Boy\n1 Paket / 250 Adet' },
  { id: 34, name: 'Çöp Poşeti (Florex)', category: 'POŞET ÇEŞİTLERİ', price: '₺26', image: null, description: '80x110 cm Boyut\n400 Gram Rulo ağırlığı' },
  { id: 36, name: 'Dökme Çöp Poşeti', category: 'POŞET ÇEŞİTLERİ', price: '₺385', image: null, description: '80x110 cm Sanayi Tipi\n10 Kilogramlık Çuval' },

  // --- DETERJAN ---
  { id: 41, name: 'Çamaşır Suyu (Start)', category: 'DETERJAN', price: '₺100', image: null, description: '5 Litrelik Bidon' },
  { id: 45, name: 'Bulaşık Deterjanı (Pril)', category: 'DETERJAN', price: '₺150', image: null, description: 'Pril Marka\n5 Litrelik Bidon' },
  { id: 48, name: 'Yüzey Temizleyici (Start)', category: 'DETERJAN', price: '₺100', image: null, description: 'Limon vb kokulu\n5 Litrelik Bidon' },
  { id: 51, name: 'Köpük Sabun (Start)', category: 'DETERJAN', price: '₺100', image: null, description: 'Makineler için uyumlu\n5 Litrelik Bidon' },
  { id: 55, name: 'Sıvı Sabun (Dalan)', category: 'DETERJAN', price: '₺70', image: null, description: 'Besleyici özlü\n3 Litrelik Bidon' },

  // --- HİJYEN SARF MALZEMELERİ ---
  { id: 64, name: "Siyah Eldiven (M Beden)", category: 'HİJYEN SARF MALZEMELERİ', price: '₺100', image: null, description: 'Nitril Dayanıklı Siyah\n1 Kutu / 100 Adet' },
  { id: 71, name: 'Tek Kullanımlık Bone', category: 'HİJYEN SARF MALZEMELERİ', price: '₺50', image: null, description: 'Saç kılı önleyici üretim standardı\n1 Paket / 100 Adet' },
  { id: 72, name: 'Tek Kullanımlık Kolluk', category: 'HİJYEN SARF MALZEMELERİ', price: '₺50', image: null, description: 'Önlük dirsek koruması\n1 Paket / 100 Adet' },
  { id: 91, name: 'Dezenfektan (El / Yüzey)', category: 'HİJYEN SARF MALZEMELERİ', price: '₺50', image: null, description: 'Kapasite: 1 Litre\nPompalı Kolay Kullanım' },
  { id: 92, name: 'Limon Kolonyası (5 Lt)', category: 'HİJYEN SARF MALZEMELERİ', price: '₺300', image: null, description: 'Sıvı Dolum veya İkram İçin\n5 Litre Ticari Bidon' },

  // --- DİĞER (Baskılı vb.) ---
  { id: 1, name: 'Logolu Baskılı Pipet', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nFirmanıza Özel Baskı' },
  { id: 86, name: "Lüks İkram Seti (6 Parça)", category: 'Özel Setler', price: '₺475', image: null, description: 'Çatal, Kaşık, Peçete, Bıçak vd. Set\n1 Koli Formunda Gönderilir' },
];
