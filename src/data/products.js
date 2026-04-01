// ============================================================
// ÜRÜN VERİ TABANI
// NOT: Tüm veriler yerel hafıza (localStorage) üzerinde saklanır.
// ============================================================

export const DEFAULT_PRODUCTS = [
  // --- BASKILI ÖZEL ÜRÜNLER (Özel Yapım) ---
  { id: 1, name: 'Baskılı Pipet', category: 'BASKILI ÖZEL ÜRÜNLER', price: 'Fiyat Sorunuz', image: null, description: '' },
  { id: 2, name: 'Baskılı Şeker', category: 'BASKILI ÖZEL ÜRÜNLER', price: 'Fiyat Sorunuz', image: null, description: '' },
  { id: 3, name: 'Baskılı Poşet', category: 'BASKILI ÖZEL ÜRÜNLER', price: 'Fiyat Sorunuz', image: null, description: '' },
  { id: 4, name: 'Baskılı Kağıt', category: 'BASKILI ÖZEL ÜRÜNLER', price: 'Fiyat Sorunuz', image: null, description: '' },
  { id: 5, name: 'Baskılı Mendil', category: 'BASKILI ÖZEL ÜRÜNLER', price: 'Fiyat Sorunuz', image: null, description: '' },
  { id: 6, name: 'Baskılı Kese Kağıdı', category: 'BASKILI ÖZEL ÜRÜNLER', price: 'Fiyat Sorunuz', image: null, description: 'Çeşitleri' },

  // --- STREÇ VE FOLYO ÇEŞİTLERİ ---
  { id: 7, name: 'Streç', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺75', image: null, description: '1 Adet' },
  { id: 8, name: 'Açık Streç (İlka)', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺95', image: null, description: '1 Adet\n200 Mt.' },
  { id: 9, name: 'Folyo', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺85', image: null, description: '1 Adet\n400 Gram' },
  { id: 10, name: 'Streç', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺550', image: null, description: '1 Adet\n30x1500' },
  { id: 11, name: 'Streç', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺700', image: null, description: '1 Adet\n45x1500' },
  { id: 12, name: "45'lik Streç", category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺85', image: null, description: '1 Adet\n200 Mt.' },
  { id: 13, name: 'Folyo', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺170', image: null, description: '1 Adet\n1 Kg' },
  { id: 14, name: 'Streç Folyo', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: '(Çeşitleri)' },
  { id: 15, name: 'Patpat', category: 'STREÇ VE FOLYO ÇEŞİTLERİ', price: '₺250', image: null, description: '50 Mt' },

  // --- ALÜMİNYUM ÇEŞİTLERİ ---
  { id: 16, name: 'Sütlaç Kabı', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺80', image: null, description: '100 Adet' },
  { id: 17, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺145', image: null, description: '100 Adet\n250 Gr' },
  { id: 18, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺150', image: null, description: '100 Adet\n350 Gr' },
  { id: 19, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺185', image: null, description: '100 Adet\n500 Gr' },
  { id: 20, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺230', image: null, description: '100 Adet\n750 Gr' },
  { id: 21, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺265', image: null, description: '100 Adet\n1 Kg' },
  { id: 22, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺320', image: null, description: '100 Adet\n1.5 Kg' },
  { id: 23, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺320', image: null, description: '100 Adet\n3 Gözlü' },
  { id: 24, name: 'Alüminyum + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺320', image: null, description: '100 Adet\n2 Gözlü' },
  { id: 25, name: 'Künefe + Kap', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺180', image: null, description: '100 Adet' },
  { id: 26, name: 'Oval Tepsi', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: '₺155', image: null, description: '25 Adet' },
  { id: 27, name: 'Alüminyum', category: 'ALÜMİNYUM ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: '(Genel Çeşitler)' },

  // --- POŞET VE NAYLON ÇEŞİTLERİ ---
  { id: 28, name: 'Orta Poşet Dökme', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺44', image: null, description: '1 Kg.' },
  { id: 29, name: 'Orta Boy Poşet (Ambalajcım)', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺40', image: null, description: '1 Kg' },
  { id: 30, name: 'Dürüm Hışır Poşet', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺48', image: null, description: '500 Gr.' },
  { id: 31, name: 'Yapışkanlı Set Poşeti', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺125', image: null, description: '1 Kg.' },
  { id: 32, name: 'Hışır', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺35', image: null, description: '1 Paket\nKüçük\n250 Adet' },
  { id: 33, name: 'Hışır', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺43', image: null, description: '1 Paket\nOrta\n250 Adet' },
  { id: 34, name: 'Çöp Poşeti', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺26', image: null, description: 'Florex\n400 Gr.\n80x110' },
  { id: 35, name: 'Çöp Poşeti', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺25', image: null, description: '80x110 - 70x90' },
  { id: 36, name: 'Dökme Çöp', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺385', image: null, description: '10 Kg.\n80x110' },
  { id: 37, name: 'Kilit Torba', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺185', image: null, description: '2000 Ad.\n5x5' },
  { id: 38, name: 'Kilit Torba', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺185', image: null, description: '2000 Ad.\n6x7' },
  { id: 39, name: 'Kilit Torba', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: '₺185', image: null, description: '1500 Ad.\n7x9' },
  { id: 40, name: 'Poşet & Naylon', category: 'POŞET VE NAYLON ÇEŞİTLERİ', price: 'Fiyat Sorunuz', image: null, description: '(Genel)' },

  // --- DETERJAN VE TEMİZLİK GRUBU ---
  { id: 41, name: 'Çamaşır Suyu (Start)', category: 'DETERJAN VE TEMİZLİK', price: '₺100', image: null, description: '5 Lt' },
  { id: 42, name: 'Çamaşır Suyu (Start)', category: 'DETERJAN VE TEMİZLİK', price: '₺400', image: null, description: '30 Lt' },
  { id: 43, name: 'Çamaşır Suyu', category: 'DETERJAN VE TEMİZLİK', price: '₺30', image: null, description: 'Tetik' },
  { id: 44, name: 'Çamaşır Sodası', category: 'DETERJAN VE TEMİZLİK', price: '₺30', image: null, description: '500 Gr' },
  { id: 45, name: 'Bulaşık Deterjanı (Pril)', category: 'DETERJAN VE TEMİZLİK', price: '₺150', image: null, description: '5 Lt' },
  { id: 46, name: 'Bulaşık Deterjanı (Formül)', category: 'DETERJAN VE TEMİZLİK', price: '₺30', image: null, description: '750 Ml' },
  { id: 47, name: 'Bulaşık Deterjanı Ekstra (Pak)', category: 'DETERJAN VE TEMİZLİK', price: '₺450', image: null, description: '20 Kg' },
  { id: 48, name: 'Yüzey Temizleyici (Start)', category: 'DETERJAN VE TEMİZLİK', price: '₺100', image: null, description: '5 Lt' },
  { id: 49, name: 'Yüzey Temizleyici (Start)', category: 'DETERJAN VE TEMİZLİK', price: '₺400', image: null, description: '30 Lt' },
  { id: 50, name: 'Camsil (Start)', category: 'DETERJAN VE TEMİZLİK', price: '₺100', image: null, description: '5 Lt' },
  { id: 51, name: 'Köpük Sabun (Start)', category: 'DETERJAN VE TEMİZLİK', price: '₺100', image: null, description: '5 Lt' },
  { id: 52, name: 'Aspirin', category: 'DETERJAN VE TEMİZLİK', price: '₺100', image: null, description: 'Tetik\n5 Lt' },
  { id: 53, name: 'Arap Sabunu', category: 'DETERJAN VE TEMİZLİK', price: '₺100', image: null, description: 'Tetik\n5 Lt' },
  { id: 54, name: 'Arap Sabunu', category: 'DETERJAN VE TEMİZLİK', price: '₺45', image: null, description: 'Tetik\n1 Lt' },
  { id: 55, name: 'Sıvı Sabun (Dalan)', category: 'DETERJAN VE TEMİZLİK', price: '₺70', image: null, description: '3 Lt' },
  { id: 56, name: 'Sıvı Sabun (Papilion)', category: 'DETERJAN VE TEMİZLİK', price: '₺40', image: null, description: '1.5 Lt' },
  { id: 57, name: 'Güç (Sir Pro)', category: 'DETERJAN VE TEMİZLİK', price: '₺60', image: null, description: '1 Lt' },
  { id: 58, name: 'Katı Jel', category: 'DETERJAN VE TEMİZLİK', price: '₺425', image: null, description: '9 Kg\n(Stok Sorunuz)' },
  { id: 59, name: 'Temizlik Havlusu (Sleepy)', category: 'DETERJAN VE TEMİZLİK', price: '₺75', image: null, description: '100\'lü' },
  { id: 60, name: 'Islak Mendil', category: 'DETERJAN VE TEMİZLİK', price: '₺25', image: null, description: '120\'li' },
  { id: 61, name: 'Hareket Havlu', category: 'DETERJAN VE TEMİZLİK', price: '₺200', image: null, description: '25 Kg' },
  { id: 62, name: 'Mikro Fiber Bez / Temizlik Bezi', category: 'DETERJAN VE TEMİZLİK', price: '₺15', image: null, description: 'Mavi' },
  { id: 63, name: 'Tuvalet Kağıdı (Papilion)', category: 'DETERJAN VE TEMİZLİK', price: '₺175', image: null, description: '40\'lı' },

  // --- AMBALAJ VE SARF MALZEMELERİ ---
  { id: 64, name: 'Siyah Eldiven', category: 'AMBALAJ VE SARF', price: '₺100', image: null, description: '(M) Beden\n100\'lü' },
  { id: 65, name: 'Karton Bardak', category: 'AMBALAJ VE SARF', price: '₺15', image: null, description: '50\'li' },
  { id: 66, name: 'Pipet', category: 'AMBALAJ VE SARF', price: '₺15', image: null, description: 'Çeşitleri' },
  { id: 67, name: 'Boş Koli', category: 'AMBALAJ VE SARF', price: '₺35', image: null, description: '60x60' },
  { id: 68, name: 'Koli Bandı', category: 'AMBALAJ VE SARF', price: '₺35', image: null, description: '' },
  { id: 69, name: 'Köpük Tabak', category: 'AMBALAJ VE SARF', price: '₺40', image: null, description: 'Küçük' },
  { id: 70, name: 'Köpük Tabak', category: 'AMBALAJ VE SARF', price: '₺160', image: null, description: 'Büyük' },
  { id: 71, name: 'Bone', category: 'AMBALAJ VE SARF', price: '₺50', image: null, description: '100 Ad.' },
  { id: 72, name: 'Kolluk', category: 'AMBALAJ VE SARF', price: '₺50', image: null, description: '100 Ad.' },
  { id: 73, name: 'Tahta Karıştırıcı', category: 'AMBALAJ VE SARF', price: '₺35', image: null, description: '1000 Ad.' },
  { id: 74, name: 'Cips Çatalı', category: 'AMBALAJ VE SARF', price: '₺45', image: null, description: '1000 Ad.' },
  { id: 75, name: 'Kağıt & Kese Kağıdı', category: 'AMBALAJ VE SARF', price: 'Fiyat Sorunuz', image: null, description: '' },

  // --- GIDA VE SOS GRUBU ---
  { id: 76, name: 'Salatalık Turşusu', category: 'GIDA VE SOS GRUBU', price: '₺315', image: null, description: 'Kova' },
  { id: 77, name: 'Domates Salçası', category: 'GIDA VE SOS GRUBU', price: '₺200', image: null, description: '4.3 Kg' },
  { id: 78, name: 'Ketçap (Gold)', category: 'GIDA VE SOS GRUBU', price: '₺200', image: null, description: '9 Kg' },
  { id: 79, name: 'Mayonez (Gold)', category: 'GIDA VE SOS GRUBU', price: '₺200', image: null, description: '8 Kg' },
  { id: 80, name: 'Ketçap (Burcu)', category: 'GIDA VE SOS GRUBU', price: '₺275', image: null, description: '9 Kg' },
  { id: 81, name: 'Mayonez (Burcu)', category: 'GIDA VE SOS GRUBU', price: '₺290', image: null, description: '8 Kg' },
  { id: 82, name: 'Nar Ekşisi', category: 'GIDA VE SOS GRUBU', price: '₺35', image: null, description: '1 Lt' },
  { id: 83, name: 'Bardak Su', category: 'GIDA VE SOS GRUBU', price: '₺250', image: null, description: 'Koli' },
  { id: 84, name: 'Su (0.5 Lt)', category: 'GIDA VE SOS GRUBU', price: '₺35', image: null, description: 'Koli\n12\'li' },
  { id: 85, name: 'Sızma Zeytinyağı', category: 'GIDA VE SOS GRUBU', price: 'Fiyat Sorunuz', image: null, description: '5 Lt' },

  // --- HAZIR SET VE HİJYEN ---
  { id: 86, name: 'Lux İkram Seti', category: 'HAZIR SET VE HİJYEN', price: '₺475', image: null, description: '1 Koli\n6\'lı' },
  { id: 87, name: 'Lux Set', category: 'HAZIR SET VE HİJYEN', price: '₺425', image: null, description: '1 Koli\n5\'li' },
  { id: 88, name: 'Dürüm Set', category: 'HAZIR SET VE HİJYEN', price: '₺550', image: null, description: '1 Koli\n4\'lü' },
  { id: 89, name: 'Siyah Eldiven', category: 'HAZIR SET VE HİJYEN', price: '₺120', image: null, description: '100 Ad.\nL Beden' },
  { id: 90, name: 'Eldiven Cerrah', category: 'HAZIR SET VE HİJYEN', price: '₺115', image: null, description: '100 Ad.\nL Beden' },
  { id: 91, name: 'Dezenfektan', category: 'HAZIR SET VE HİJYEN', price: '₺50', image: null, description: '1 Lt.' },
  { id: 92, name: 'Kolonya (Limon)', category: 'HAZIR SET VE HİJYEN', price: '₺300', image: null, description: '5 Lt.' },
];
