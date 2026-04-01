// ============================================================
// ÜRÜN VERİ TABANI
// NOT: Tüm veriler yerel hafıza (localStorage) üzerinde saklanır.
// ============================================================

export const DEFAULT_PRODUCTS = [
  // --- BASKILI ÖZEL ÜRÜNLER (Özel Yapım) ---
  { id: 1, name: 'Logolu Baskılı Pipet', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nFirmanıza Özel Baskı' },
  { id: 2, name: 'Logolu Baskılı Şeker', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nFirmanıza Özel Baskı' },
  { id: 3, name: 'Logolu Baskılı Poşet', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Özel Yapım\nFirmanıza Özel Baskı' },
  { id: 4, name: 'Logolu Baskılı Kağıt', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Sargı Kağıdı\nFirmanıza Özel Baskı' },
  { id: 5, name: 'Logolu Baskılı Mendil', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Islak / Kuru Opsiyonları\nFirmanıza Özel Baskı' },
  { id: 6, name: 'Baskılı Kese Kağıdı', category: 'Baskılı Ürünler', price: 'Fiyat Sorunuz', image: null, description: 'Farklı Boy Çeşitleri\nFirmanıza Özel Baskı' },

  // --- STREÇ VE FOLYO ÇEŞİTLERİ ---
  { id: 7, name: 'Streç Film', category: 'Streç & Folyo', price: '₺75', image: null, description: '1 Adet Rulo' },
  { id: 8, name: 'Açık Streç Film (İlka)', category: 'Streç & Folyo', price: '₺95', image: null, description: '200 Metre Uzunluk\n1 Adet Rulo' },
  { id: 9, name: 'Alüminyum Folyo (400 Gr)', category: 'Streç & Folyo', price: '₺85', image: null, description: '400 Gram\n1 Adet Rulo' },
  { id: 10, name: 'Streç Film (30cm)', category: 'Streç & Folyo', price: '₺550', image: null, description: '30 cm Genişlik\n1500 Metre Uzunluk\n1 Adet Rulo' },
  { id: 11, name: 'Streç Film (45cm XL)', category: 'Streç & Folyo', price: '₺700', image: null, description: '45 cm Genişlik\n1500 Metre Uzunluk\n1 Adet Rulo' },
  { id: 12, name: 'Streç Film (45\'lik, 200 Mt)', category: 'Streç & Folyo', price: '₺85', image: null, description: '45 cm Genişlik\n200 Metre Uzunluk\n1 Adet Rulo' },
  { id: 13, name: 'Alüminyum Folyo (1 Kg)', category: 'Streç & Folyo', price: '₺170', image: null, description: '1 Kilogram\n1 Adet Rulo' },
  { id: 14, name: 'Diğer Streç & Folyo Varyantları', category: 'Streç & Folyo', price: 'Fiyat Sorunuz', image: null, description: 'Farklı ebat ve mikron seçenekleri' },
  { id: 15, name: 'Patpat (Balonlu Naylon)', category: 'Streç & Folyo', price: '₺250', image: null, description: '50 Metre Rulo' },

  // --- ALÜMİNYUM ÇEŞİTLERİ ---
  { id: 16, name: 'Sütlaç Kabı (Alüminyum)', category: 'Alüminyum', price: '₺80', image: null, description: '1 Paket / 100 Adet' },
  { id: 17, name: 'Alüminyum Kap (250 Gr)', category: 'Alüminyum', price: '₺145', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 18, name: 'Alüminyum Kap (350 Gr)', category: 'Alüminyum', price: '₺150', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 19, name: 'Alüminyum Kap (500 Gr)', category: 'Alüminyum', price: '₺185', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 20, name: 'Alüminyum Kap (750 Gr)', category: 'Alüminyum', price: '₺230', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 21, name: 'Alüminyum Kap (1 Kg)', category: 'Alüminyum', price: '₺265', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 22, name: 'Alüminyum Kap (1.5 Kg)', category: 'Alüminyum', price: '₺320', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 23, name: 'Alüminyum Kap (3 Gözlü)', category: 'Alüminyum', price: '₺320', image: null, description: 'Bölmeli Yemek Kabı\nKapak Dahildir\n1 Paket / 100 Adet' },
  { id: 24, name: 'Alüminyum Kap (2 Gözlü)', category: 'Alüminyum', price: '₺320', image: null, description: 'Bölmeli Yemek Kabı\nKapak Dahildir\n1 Paket / 100 Adet' },
  { id: 25, name: 'Künefe Kabı', category: 'Alüminyum', price: '₺180', image: null, description: 'Kapak Dahildir\n1 Paket / 100 Adet' },
  { id: 26, name: 'Oval Tepsi (Alüminyum)', category: 'Alüminyum', price: '₺155', image: null, description: '1 Koli / 25 Adet' },
  { id: 27, name: 'Diğer Alüminyum Ürünleri', category: 'Alüminyum', price: 'Fiyat Sorunuz', image: null, description: 'Eksik gördüğünüz veya özel boyutlar' },

  // --- POŞET VE NAYLON ÇEŞİTLERİ ---
  { id: 28, name: 'Dökme Poşet', category: 'Poşet', price: '₺44', image: null, description: 'Orta Boy\n1 Kilogram (Kg)' },
  { id: 29, name: 'Poşet (Ambalajcım)', category: 'Poşet', price: '₺40', image: null, description: 'Orta Boy\nKendi markamız\n1 Kilogram (Kg)' },
  { id: 30, name: 'Dürüm / Lavaş Hışır Poşet', category: 'Poşet', price: '₺48', image: null, description: 'Dar & Uzun\n500 Gram' },
  { id: 31, name: 'Yapışkanlı Set Poşeti', category: 'Poşet', price: '₺125', image: null, description: 'Kendinden Kilitli Bantlı\n1 Kilogram (Kg)' },
  { id: 32, name: 'Hışır Poşet (Küçük)', category: 'Poşet', price: '₺35', image: null, description: 'Küçük Boy\n1 Paket / 250 Adet' },
  { id: 33, name: 'Hışır Poşet (Orta)', category: 'Poşet', price: '₺43', image: null, description: 'Orta Boy\n1 Paket / 250 Adet' },
  { id: 34, name: 'Çöp Poşeti (Florex)', category: 'Poşet', price: '₺26', image: null, description: '80x110 cm Boyut\n400 Gram Rulo ağırlığı' },
  { id: 35, name: 'Çöp Poşeti (Çeşit)', category: 'Poşet', price: '₺25', image: null, description: '80x110 cm Boyut\n70x90 cm Boyut\nRulo' },
  { id: 36, name: 'Dökme Çöp Poşeti', category: 'Poşet', price: '₺385', image: null, description: '80x110 cm Sanayi Tipi\n10 Kilogramlık Çuval' },
  { id: 37, name: 'Kilit Torba (5x5)', category: 'Poşet', price: '₺185', image: null, description: '5x5 cm Ebat\n1 Paket / 2000 Adet' },
  { id: 38, name: 'Kilit Torba (6x7)', category: 'Poşet', price: '₺185', image: null, description: '6x7 cm Ebat\n1 Paket / 2000 Adet' },
  { id: 39, name: 'Kilit Torba (7x9)', category: 'Poşet', price: '₺185', image: null, description: '7x9 cm Ebat\n1 Paket / 1500 Adet' },
  { id: 40, name: 'Poşet & Naylon İsteğe Göre', category: 'Poşet', price: 'Fiyat Sorunuz', image: null, description: 'Listede olmayan özel ölçüler' },

  // --- DETERJAN VE TEMİZLİK GRUBU ---
  { id: 41, name: 'Çamaşır Suyu (Start)', category: 'Temizlik & Kağıt', price: '₺100', image: null, description: '5 Litrelik Bidon' },
  { id: 42, name: 'Çamaşır Suyu (Start, Ticari)', category: 'Temizlik & Kağıt', price: '₺400', image: null, description: '30 Litrelik Bidon' },
  { id: 43, name: 'Çamaşır Suyu (Püskürtmeli)', category: 'Temizlik & Kağıt', price: '₺30', image: null, description: 'Pratik Tetikli Şişe' },
  { id: 44, name: 'Çamaşır Sodası', category: 'Temizlik & Kağıt', price: '₺30', image: null, description: '500 Gram Toz Paket' },
  { id: 45, name: 'Bulaşık Deterjanı (Pril)', category: 'Temizlik & Kağıt', price: '₺150', image: null, description: 'Pril Marka\n5 Litrelik Bidon' },
  { id: 46, name: 'Bulaşık Deterjanı (Formül)', category: 'Temizlik & Kağıt', price: '₺30', image: null, description: 'Formül Marka\n750 Ml Küçük Boy' },
  { id: 47, name: 'Bulaşık Deterjanı (Pak Ekstra)', category: 'Temizlik & Kağıt', price: '₺450', image: null, description: 'Ticari Büyük Boy\n20 Kilogramlık Bidon' },
  { id: 48, name: 'Yüzey Temizleyici (Start)', category: 'Temizlik & Kağıt', price: '₺100', image: null, description: 'Limon vb kokulu\n5 Litrelik Bidon' },
  { id: 49, name: 'Yüzey Temizleyici (Start, Ticari)', category: 'Temizlik & Kağıt', price: '₺400', image: null, description: 'Limon vb kokulu\n30 Litrelik Bidon' },
  { id: 50, name: 'Camsil (Start)', category: 'Temizlik & Kağıt', price: '₺100', image: null, description: '5 Litrelik Bidon' },
  { id: 51, name: 'Köpük Sabun (Start)', category: 'Temizlik & Kağıt', price: '₺100', image: null, description: 'Makineler için uyumlu\n5 Litrelik Bidon' },
  { id: 52, name: 'Tetikli Aspirin (Çok Amaçlı)', category: 'Temizlik & Kağıt', price: '₺100', image: null, description: 'Ağır kirler için ideal\n5 Litrelik Bidon (Tetik aparatlı)' },
  { id: 53, name: 'Tetikli Arap Sabunu', category: 'Temizlik & Kağıt', price: '₺100', image: null, description: 'Doğal içerikli\n5 Litrelik Bidon' },
  { id: 54, name: 'Tetikli Arap Sabunu', category: 'Temizlik & Kağıt', price: '₺45', image: null, description: 'Doğal içerikli\n1 Litrelik Şişe' },
  { id: 55, name: 'Sıvı Sabun (Dalan)', category: 'Temizlik & Kağıt', price: '₺70', image: null, description: 'Besleyici özlü\n3 Litrelik Bidon' },
  { id: 56, name: 'Sıvı Sabun (Papilion)', category: 'Temizlik & Kağıt', price: '₺40', image: null, description: 'Ferah kokulu\n1.5 Litrelik Şişe' },
  { id: 57, name: 'Yağ Sökücü Güç (Sir Pro)', category: 'Temizlik & Kağıt', price: '₺60', image: null, description: 'Sanayi Mutfakları Çözümü\n1 Litre Şişe' },
  { id: 58, name: 'Katı Jel Temizleyici', category: 'Temizlik & Kağıt', price: '₺425', image: null, description: 'Profesyonel Lekeler \n9 Kilogram\n(Devamlı Bulunmaz, Stok Sorunuz)' },
  { id: 59, name: 'Yüzey Temizlik Havlusu (Sleepy)', category: 'Temizlik & Kağıt', price: '₺75', image: null, description: 'Kullan At Havlu Bezi\n1 Paket / 100 Yaprak' },
  { id: 60, name: 'Islak Mendil Paket', category: 'Temizlik & Kağıt', price: '₺25', image: null, description: '1 Paket / 120 Yaprak' },
  { id: 61, name: 'Hareketli Havlu (Sensörlü İçin)', category: 'Temizlik & Kağıt', price: '₺200', image: null, description: 'Dispenser Kağıt Havlu\n1 Koli / 25 Kilogram' },
  { id: 62, name: 'Mikro Fiber Temizlik Bezi', category: 'Temizlik & Kağıt', price: '₺15', image: null, description: 'İz & Hav Bırakmaz\nMavi Renk Seçeneği' },
  { id: 63, name: 'Tuvalet Kağıdı (Papilion)', category: 'Temizlik & Kağıt', price: '₺175', image: null, description: '1 Koli / 40 Rulo' },

  // --- AMBALAJ VE SARF MALZEMELERİ ---
  { id: 64, name: "Siyah Eldiven (M Beden)", category: 'Ambalaj', price: '₺100', image: null, description: 'Nitril Dayanıklı Siyah\n1 Kutu / 100 Adet' },
  { id: 65, name: "Karton Bardak", category: 'Ambalaj', price: '₺15', image: null, description: 'Çay / Kahve Otomat Fincanı\n1 Paket / 50 Adet' },
  { id: 66, name: 'Pipet (Standart Çeşitler)', category: 'Ambalaj', price: '₺15', image: null, description: 'Körüklü / Düz seçenekli' },
  { id: 67, name: 'Boş Kargo Kolisi', category: 'Ambalaj', price: '₺35', image: null, description: '60x60 cm Boyut\nKalın Oluklu Yapı' },
  { id: 68, name: 'Koli Bandı', category: 'Ambalaj', price: '₺35', image: null, description: 'Şeffaf / Taba (Kahverengi) Seçenekleri' },
  { id: 69, name: 'Köpük Tabak (Küçük)', category: 'Ambalaj', price: '₺40', image: null, description: 'Tek kullanımlık Gıda Güvenli\nGünlük Fiyat Sürümü' },
  { id: 70, name: 'Köpük Tabak (Büyük)', category: 'Ambalaj', price: '₺160', image: null, description: 'Kasap & Fiş Tipi Tabak' },
  { id: 71, name: 'Tek Kullanımlık Bone', category: 'Ambalaj', price: '₺50', image: null, description: 'Saç kılı önleyici üretim standardı\n1 Paket / 100 Adet' },
  { id: 72, name: 'Tek Kullanımlık Kolluk', category: 'Ambalaj', price: '₺50', image: null, description: 'Önlük dirsek koruması\n1 Paket / 100 Adet' },
  { id: 73, name: 'Tahta Karıştırıcı', category: 'Ambalaj', price: '₺35', image: null, description: 'Çay / Kahve Çubuğu\n1 Paket / 1000 Adet' },
  { id: 74, name: 'Plastik Cips / Tadım Çatalı', category: 'Ambalaj', price: '₺45', image: null, description: 'Dondurma ve Küçük Sunum İçin\n1 Paket / 1000 Adet' },
  { id: 75, name: 'Standart Kağıt & Keselar', category: 'Ambalaj', price: 'Fiyat Sorunuz', image: null, description: 'Hamur & Fırın kağıt türleri' },

  // --- GIDA VE SOS GRUBU ---
  { id: 76, name: 'Salatalık Turşusu', category: 'Gıda & Sos', price: '₺315', image: null, description: 'Toptan Büfe Boy Büyük Kova' },
  { id: 77, name: 'Domates Salçası', category: 'Gıda & Sos', price: '₺200', image: null, description: 'Ticari Mutfak Boyu\n4.3 Kilogram / Kutu' },
  { id: 78, name: 'Ketçap (Gold Marka)', category: 'Gıda & Sos', price: '₺200', image: null, description: 'Fast Food Boy\n9 Kilogram Kova' },
  { id: 79, name: 'Mayonez (Gold Marka)', category: 'Gıda & Sos', price: '₺200', image: null, description: 'Fast Food Boy\n8 Kilogram Kova' },
  { id: 80, name: 'Ketçap (Burcu Marka)', category: 'Gıda & Sos', price: '₺275', image: null, description: 'Kaliteli Büfe Tercihi\n9 Kilogram Kova' },
  { id: 81, name: 'Mayonez (Burcu Marka)', category: 'Gıda & Sos', price: '₺290', image: null, description: 'Kaliteli Büfe Tercihi\n8 Kilogram Kova' },
  { id: 82, name: 'Nar Ekşisi', category: 'Gıda & Sos', price: '₺35', image: null, description: 'Sos ve Salata Hazırlığı\n1 Litre Şişe' },
  { id: 83, name: 'Bardak Su (Pet)', category: 'Gıda & Sos', price: '₺250', image: null, description: 'Toplu Tüketim Paket Koli' },
  { id: 84, name: 'Şişe Su (0.5 Lt)', category: 'Gıda & Sos', price: '₺35', image: null, description: 'Yarım Litrelik Bireysel Pet Şişe\n1 Koli / 12 Şişe İçerir' },
  { id: 85, name: 'Sızma Zeytinyağı', category: 'Gıda & Sos', price: 'Fiyat Sorunuz', image: null, description: 'El değmeden, Hakiki Üretim\n5 Litre Teneke' },

  // --- HAZIR SET VE HİJYEN ---
  { id: 86, name: "Lüks İkram Seti (6 Parça)", category: 'Özel Setler', price: '₺475', image: null, description: 'Çatal, Kaşık, Peçete, Bıçak vd. Set\n1 Koli Formunda Gönderilir' },
  { id: 87, name: "Lüks İkram Seti (5 Parça)", category: 'Özel Setler', price: '₺425', image: null, description: 'Paketli Yemek Seti\n1 Koli Formunda Gönderilir' },
  { id: 88, name: "Dürüm Seti (4 Parça)", category: 'Özel Setler', price: '₺550', image: null, description: 'Mendil ve Kürdanlı Özel Hazır Set\n1 Koli Formunda Gönderilir' },
  { id: 89, name: 'Siyah Eldiven (L Beden)', category: 'Özel Setler', price: '₺120', image: null, description: 'L Beden Büyük El Tipi (Nitril vb)\n1 Kutu / 100 Adet' },
  { id: 90, name: 'Beyaz Eldiven (Cerrah / Lateks)', category: 'Özel Setler', price: '₺115', image: null, description: 'L Beden Klasik\n1 Kutu / 100 Adet' },
  { id: 91, name: 'Dezenfektan (El / Yüzey)', category: 'Özel Setler', price: '₺50', image: null, description: 'Kapasite: 1 Litre\nPompalı Kolay Kullanım' },
  { id: 92, name: 'Limon Kolonyası (5 Lt)', category: 'Özel Setler', price: '₺300', image: null, description: 'Sıvı Dolum veya İkram İçin\n5 Litre Ticari Bidon' },
];
