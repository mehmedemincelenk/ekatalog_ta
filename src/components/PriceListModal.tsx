import { useState, useRef, useMemo, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import Button from './Button';
import { calculatePromotionalPrice, transformCurrencyStringToNumber, formatNumberToCurrency } from '../utils/price';
import { TECH } from '../data/config';
import html2canvas from 'html2canvas';
import { Download, Printer, ArrowLeft } from 'lucide-react';

type FlatItem = { isCategoryHeader: true; cat: string } | { isCategoryHeader: false; product: Product; cat: string };

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: string[];
  displayCurrency: 'TRY' | 'USD' | 'EUR';
  exchangeRates?: { usd: number; eur: number };
  activeDiscount?: { rate: number; category?: string } | null;
  storeName: string;
}

export default function PriceListModal({ 
  isOpen, 
  onClose, 
  products, 
  categories,
  displayCurrency,
  exchangeRates,
  activeDiscount,
  storeName
}: PriceListModalProps) {
  const [step, setStep] = useState<0 | 1 | 2>(1); // Step 0 is Intro
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Group products
  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || TECH.products.fallbackCategory;
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);

  // Categories that actually have products
  const populatedCategories = useMemo(() => {
    return categories.filter(cat => (groupedProducts[cat] || []).length > 0);
  }, [categories, groupedProducts]);

  useEffect(() => {
    if (isOpen) {
      const skipIntro = localStorage.getItem('ekatalog_skip_price_list_intro');
      setStep(skipIntro === 'true' ? 1 : 0);
      
      // Select all by default
      setSelectedCategories([...populatedCategories]);
      setIsExporting(false);
    }
  }, [isOpen, populatedCategories]);

  if (!isOpen) return null;

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const calculateFinalPrice = (product: Product) => {
    const isPromotionActive = activeDiscount && (!activeDiscount.category || activeDiscount.category === product.category);
    const baseMathPrice = transformCurrencyStringToNumber(product.price);
    
    if (isPromotionActive && baseMathPrice > 0) {
      return formatNumberToCurrency(baseMathPrice * (1 - activeDiscount.rate), displayCurrency, exchangeRates);
    }
    return formatNumberToCurrency(baseMathPrice, displayCurrency, exchangeRates);
  };

  const filteredProductsCount = selectedCategories.reduce((total, cat) => total + (groupedProducts[cat]?.length || 0), 0);

  const downloadAsImage = async () => {
    if (!listContainerRef.current) return;
    setIsExporting(true);
    
    // Tiny delay to ensure React renders the 'Exporting' state cleanly if we wanted UI changes, 
    // but html2canvas needs the actual DOM elements visible.
    try {
      const canvas = await html2canvas(listContainerRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement('a');
      link.href = image;
      link.download = `${storeName.replace(/\s+/g, '_')}_Fiyat_Listesi.jpg`;
      link.click();
    } catch (error) {
      console.error("Fotoğraf oluşturulamadı:", error);
      alert("Fotoğraf oluşturulurken bir hata oluştu.");
    } finally {
      setIsExporting(false);
    }
  };

  const printAsPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 print:p-0 print:block print:relative print:z-auto">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm print:hidden"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-100 print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-full print:rounded-none"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50/50 print:hidden shrink-0">
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">Fiyat Listesi Asistanı</h3>
            <p className="text-xs font-bold text-stone-400">
              {step === 1 ? 'Katalogda görünmesini istediğiniz reyonları seçin.' : `${filteredProductsCount} ürün listeleniyor.`}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors font-bold">
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto print:overflow-visible custom-scrollbar print:h-auto">
          {step === 0 ? (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                <span className="text-4xl">📊</span>
              </div>
              <h4 className="text-xl font-black text-stone-900 mb-4 uppercase tracking-tight">Fiyat Listesi Asistanına Hoş Geldiniz</h4>
              <div className="space-y-4 text-stone-600 font-medium text-sm leading-relaxed max-w-sm">
                <p>Mağazanız için güncel fiyat föyü oluşturmak artık çok kolay! İşte yapmanız gerekenler:</p>
                <div className="text-left bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-3">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                    <p>Önce listenizde hangi reyonların görünmesini istediğinizi seçin.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                    <p><b>Tabloyu Gör</b> diyerek ürünlerinizi kontrol edin.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                    <p><b>Fotoğraf İndir</b> diyerek listenizi galerine kaydedip her yerde paylaşabilirsin.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                <button 
                  onClick={() => setSelectedCategories(selectedCategories.length === populatedCategories.length ? [] : [...populatedCategories])}
                  className="col-span-full mb-1 bg-stone-100 text-stone-900 py-2 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors"
                >
                  {selectedCategories.length === populatedCategories.length ? 'Tüm Seçimleri Kaldır' : 'Tüm Reyonları Seç'}
                </button>
                {populatedCategories.map(cat => {
                  const isSelected = selectedCategories.includes(cat);
                  const count = groupedProducts[cat]?.length || 0;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleToggleCategory(cat)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-stone-100 bg-white hover:border-stone-200'}`}
                    >
                      <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700' : 'text-stone-700'}`}>{cat}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                        {count} Ürün
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 print:p-0 bg-stone-50 min-h-full">
              {/* THE ACTUAL TABLE DIV THAT GETS CAPTURED */}
              <div 
                ref={listContainerRef} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 print:shadow-none print:border-none print:p-0"
              >
                {/* PRINT-OPTIMIZED SINGLE TABLE */}
                <table className="w-full text-left">
                  {/* REPEATING HEADER */}
                  <thead>
                    <tr>
                      <th colSpan={3} className="p-0 border-none outline-none">
                        <div className="flex flex-col mb-8 border-b-4 border-stone-900 pb-6 relative pt-4">
                          <div className="absolute -top-4 w-full flex justify-center">
                            <span className="bg-stone-900/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl shadow-md">
                              {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                                ? `www.${storeName.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '')}.ekatalog.site`
                                : (window.location.hostname.startsWith('www.') ? window.location.hostname : `www.${window.location.hostname}`)
                              }
                            </span>
                          </div>
                          <div className="flex items-end justify-between mt-6">
                            <div>
                              <h1 className="text-3xl font-black text-stone-900 tracking-tight">{storeName}</h1>
                              <p className="text-sm font-bold text-stone-400 mt-1 uppercase tracking-widest">Güncel Fiyat Listesi</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-stone-400">Tarih</p>
                              <p className="text-sm font-black text-stone-900">{new Date().toLocaleDateString('tr-TR')}</p>
                              {activeDiscount && (
                                <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-1">
                                  %{activeDiscount.rate * 100} İndirim Uygulanmıştır
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                    </tr>
                    <tr className="border-b-2 border-stone-200 print:hidden invisible h-0 overflow-hidden text-[0px]">
                      <th className="w-1/3"></th>
                      <th className="w-1/2"></th>
                      <th className="w-1/6"></th>
                    </tr>
                  </thead>

                  {/* REPEATING FOOTER */}
                  <tfoot className="table-footer-group">
                    <tr>
                      <td colSpan={3}>
                        <div className="mt-12 mb-2 pt-6 border-t border-stone-100 flex flex-col items-center gap-1.5">
                          <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest text-center">
                            ÖZEL FİYAT LİSTESİDİR. BİZİ TERCİH ETTİĞİNİZ İÇİN TEŞEKKÜR EDERİZ.
                          </p>
                          <div className="flex items-center gap-2 text-stone-100 opacity-30">
                            <div className="w-6 h-[1px] bg-stone-200"></div>
                            <span className="text-[8px] font-black text-stone-900 uppercase tracking-[0.3em]">
                              www.ekatalog.site
                            </span>
                            <div className="w-6 h-[1px] bg-stone-200"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>

                  {/* BODY WITH CATEGORIES AND PRODUCTS */}
                  <tbody className="divide-y divide-stone-100">
                    {selectedCategories.map(cat => {
                      const categoryProducts = groupedProducts[cat];
                      if (!categoryProducts || categoryProducts.length === 0) return null;

                      return (
                        <Fragment key={cat}>
                          {/* CATEGORY HEADER ROW */}
                          <tr>
                            <td colSpan={3} className="pt-10 pb-4">
                              <h2 className="text-lg font-black text-stone-900 bg-stone-100 px-4 py-2 rounded-lg inline-block uppercase tracking-wide">
                                {cat}
                              </h2>
                            </td>
                          </tr>
                          {/* PRODUCT ROWS */}
                          {categoryProducts.map(product => (
                            <tr key={product.id} className="transition-colors hover:bg-stone-50 break-inside-avoid">
                              <td className="py-2.5 px-2 align-top">
                                <div className="flex items-center gap-3">
                                  {product.image ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-10 h-10 object-cover rounded-lg border border-stone-100 shadow-sm shrink-0 bg-white"
                                      crossOrigin="anonymous" 
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg border border-stone-100 bg-stone-50 shrink-0 flex items-center justify-center shadow-sm">
                                      <span className="text-lg opacity-40">📦</span>
                                    </div>
                                  )}
                                  <span className="font-bold text-stone-900 leading-tight">{product.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-stone-500 font-medium text-[11px] align-middle pr-6 leading-snug">
                                {product.shortDescription || product.description || '-'}
                              </td>
                              <td className="py-3 px-2 font-black text-stone-900 text-right align-middle whitespace-nowrap text-sm">
                                {calculateFinalPrice(product)}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-stone-100 bg-white grid grid-cols-2 gap-2 print:hidden shrink-0">
          {step === 0 ? (
             <div className="col-span-full flex flex-col gap-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => setStep(1)} 
                  className="!w-full h-12 !bg-stone-900 !text-white text-xs font-black uppercase"
                >
                  Tamam, Devam Et
                </Button>
                <button 
                  onClick={() => {
                    localStorage.setItem('ekatalog_skip_price_list_intro', 'true');
                    setStep(1);
                  }}
                  className="text-[10px] font-black text-stone-400 hover:text-stone-600 uppercase tracking-widest py-2 transition-colors underline underline-offset-4"
                >
                  Anladım ve bunu tekrar gösterme
                </button>
             </div>
          ) : step === 1 ? (
             <>
                <Button variant="secondary" size="sm" onClick={onClose} className="!w-full">
                  İptal
                </Button>
                <Button variant="primary" size="sm" onClick={() => setStep(2)} disabled={selectedCategories.length === 0} className="!w-full">
                  İleri →
                </Button>
             </>
          ) : (
             <div className="col-span-full grid grid-cols-3 gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setStep(1)} 
                  disabled={isExporting} 
                  className="!w-full !text-xs font-black uppercase flex items-center justify-center gap-2 h-11 border-2 border-stone-900 bg-stone-100 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Geri
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={downloadAsImage} 
                  disabled={isExporting}
                  className="!w-full !bg-stone-900 !text-white flex items-center justify-center gap-2 relative overflow-hidden !text-xs font-black uppercase h-11 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? '...' : 'Foto'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={printAsPDF} 
                  disabled={isExporting}
                  className="!w-full flex items-center justify-center border-2 border-stone-900 !text-stone-900 h-11 shadow-sm"
                >
                  <Printer className="w-5 h-5" />
                </Button>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
