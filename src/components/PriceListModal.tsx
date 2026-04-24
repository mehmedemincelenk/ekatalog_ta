// FILE ROLE: B2B Price List Generator (Export/Print Utility)
// DEPENDS ON: THEME, Product Logic, html2canvas
// CONSUMED BY: FloatingGuestMenu.tsx, Admin Controls
import { useState, useRef, useMemo, useEffect } from 'react';
import { Product } from '../types';
import Button from './Button';
import BaseModal from './BaseModal';
import {
  transformCurrencyStringToNumber,
  formatNumberToCurrency,
} from '../utils/core';
import { TECH } from '../data/config';
import html2canvas from 'html2canvas';
import {
  Download,
  Printer,
  ArrowLeft,
  Layers3,
  CheckSquare,
  Square,
} from 'lucide-react';

import { useStore } from '../store';
import { PriceListModalProps } from '../types';

/**
 * PRICE LIST MODAL (Diamond Standard)
 * -----------------------------------------------------------
 * Specialized tool for generating printable/exportable price catalogs.
 * Standardized to use the atomic Button unit for consistent B2B experience.
 */
export default function PriceListModal({
  isOpen,
  onClose,
  products,
  categories,
  displayCurrency,
  exchangeRates,
  activeDiscount,
  storeName,
}: PriceListModalProps) {
  const { settings } = useStore();
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(1); // 0: Intro, 1: Mode, 2: Theme, 3: Categories, 4: Preview
  const [exportMode, setExportMode] = useState<'LIST' | 'STORY'>('LIST');
  const [storyTheme, setStoryTheme] = useState<'LIGHT' | 'DARK'>('LIGHT');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [listOrientation, setListOrientation] = useState<'VERTICAL' | 'HORIZONTAL'>('VERTICAL');
  const listContainerRef = useRef<HTMLDivElement>(null);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  // Group products (Move up)
  const groupedProducts = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        const category = product.category || TECH.products.fallbackCategory;
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
      },
      {} as Record<string, Product[]>,
    );
  }, [products]);

  // Story Paging Logic (Move up)
  const storyPages = useMemo(() => {
    if (exportMode !== 'STORY') return [];
    
    const pages: { category: string; products: Product[] }[] = [];
    
    selectedCategories.forEach(cat => {
      const catProducts = groupedProducts[cat] || [];
      // Chunk by 6 products per page
      for (let i = 0; i < catProducts.length; i += 6) {
        pages.push({
          category: cat,
          products: catProducts.slice(i, i + 6)
        });
      }
    });
    
    return pages;
  }, [exportMode, selectedCategories, groupedProducts]);


  const storeUrl = settings?.slug
    ? `${settings.slug.toLowerCase()}.ekatalog.site`
    : storeName.toLowerCase().replace(/\s+/g, '') + '.ekatalog.site';



  // Categories that actually have products
  const populatedCategories = useMemo(() => {
    return categories.filter((cat) => (groupedProducts[cat] || []).length > 0);
  }, [categories, groupedProducts]);

  useEffect(() => {
    if (isOpen) {
      const skipIntro = localStorage.getItem('ekatalog_skip_price_list_intro');
      setStep(skipIntro === 'true' ? 1 : 0);
      setSelectedCategories([]);
      setIsExporting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const selectAllCategories = () => {
    if (selectedCategories.length === populatedCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...populatedCategories]);
    }
  };

  const calculateFinalPrice = (product: Product) => {
    const isPromotionActive =
      activeDiscount &&
      (!activeDiscount.category ||
        activeDiscount.category === product.category);
    const baseMathPrice = transformCurrencyStringToNumber(product.price);

    if (isPromotionActive && baseMathPrice > 0) {
      return formatNumberToCurrency(
        baseMathPrice * (1 - activeDiscount.rate),
        displayCurrency,
        exchangeRates,
      );
    }
    return formatNumberToCurrency(
      baseMathPrice,
      displayCurrency,
      exchangeRates,
    );
  };

  const filteredProductsCount = selectedCategories.reduce(
    (total, cat) => total + (groupedProducts[cat]?.length || 0),
    0,
  );

  const downloadAsImage = async () => {
    const targetRef =
      exportMode === 'STORY' ? storiesContainerRef : listContainerRef;
    if (!targetRef.current) return;

    setIsExporting(true);

    try {
      if (exportMode === 'STORY') {
        const pages = targetRef.current.querySelectorAll('[data-story-page="true"]');
        for (let i = 0; i < pages.length; i++) {
          const canvas = await html2canvas(pages[i] as HTMLElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: storyTheme === 'DARK' ? '#1d1d1f' : '#f9fafb',
          });
          const image = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.href = image;
          link.download = `${storeName.replace(/\s+/g, '_')}_Story_${i + 1}.jpg`;
          link.click();
          // Small delay between downloads to prevent browser blocking
          await new Promise((r) => setTimeout(r, 400));
        }
      } else {
        const canvas = await html2canvas(listContainerRef.current!, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: storyTheme === 'DARK' ? '#1d1d1f' : '#ffffff',
          onclone: (clonedDoc) => {
            const el = clonedDoc.querySelector('[data-capture-area="true"]');
            if (el) (el as HTMLElement).style.display = 'block';
          },
        });
        const image = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.href = image;
        link.download = `${storeName.replace(/\s+/g, '_')}_Fiyat_Listesi.jpg`;
        link.click();
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const printAsPDF = () => {
    window.print();
  };

  const footer = (
    <div className="w-full">
      {step === 0 ? (
        <div className="flex flex-col gap-2 w-full">
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              className="!w-full h-12 shadow-none"
              mode="rectangle"
            >
              KAPAT
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(1)}
              className="!w-full h-12 !bg-stone-900 !text-white text-xs font-black uppercase shadow-xl shadow-stone-200"
              mode="rectangle"
            >
              DEVAM ET
            </Button>
          </div>
          <Button
            onClick={() => {
              localStorage.setItem('ekatalog_skip_price_list_intro', 'true');
              setStep(1);
            }}
            variant="ghost"
            size="sm"
            mode="rectangle"
            className="!w-full h-10 !text-[10px] font-black !text-stone-400 hover:!text-stone-900 uppercase tracking-widest transition-all shadow-none"
          >
            BİR DAHA GÖSTERME
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setStep((prev) => (prev - 1) as 0 | 1 | 2 | 3 | 4);
            }}
            className="!w-full h-12 shadow-none"
            mode="rectangle"
            icon={<ArrowLeft size={16} />}
          >
            GERİ
          </Button>
          {step === 4 ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="primary"
                size="md"
                icon={<Download size={18} />}
                onClick={downloadAsImage}
                loading={isExporting}
                className="flex-1 h-12 shadow-lg"
                mode="rectangle"
              >
                {exportMode === 'STORY' ? 'SERİ KAYDET' : 'KAYDET'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={<Printer size={18} />}
                onClick={printAsPDF}
                className="w-12 shrink-0 h-12 flex items-center justify-center p-0"
                mode="rectangle"
              />
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              disabled={step === 1 && selectedCategories.length === 0}
              onClick={() => {
                setStep((prev) => (prev + 1) as 0 | 1 | 2 | 3 | 4);
              }}
              className="!w-full h-12 shadow-lg shadow-stone-200"
              mode="rectangle"
            >
              {step === 3 ? 'ÖNİZLEME' : 'İLERLE'}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 0: return "Hoş Geldiniz";
      case 1: return "Reyon Seçimi";
      case 2: return "Format Seçimi";
      case 3: return "Görünüm Tarzı";
      case 4: return "Katalog Hazır!";
      default: return "Fiyat Listesi";
    }
  };

  const progress = step > 0 ? {
    current: step,
    total: 4
  } : undefined;

  const getMaxWidth = () => {
    switch (step) {
      case 0: return "max-w-4xl";
      case 1: return "max-w-3xl";
      case 2: return "max-w-2xl";
      case 3: return "max-w-xl";
      case 4: return exportMode === 'STORY' ? 'max-w-[360px]' : 'max-w-5xl';
      default: return "max-w-4xl";
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={getStepTitle()}
      maxWidth={getMaxWidth()}
      footer={footer}
      progress={progress}
      noPadding={step === 4}
    >
      <div className="print:p-0">
        {step === 0 ? (
          <div className="py-2 px-1 flex flex-col items-center">
            <div className="flex items-center gap-5 mb-8 w-full px-4">
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 rotate-2 text-stone-900 shrink-0">
                <Layers3 size={32} />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tighter text-left leading-tight">
                Fiyat Listemizi Galerinize İndirin
              </h4>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* STEP 1 */}
              <div className="bg-stone-50/50 p-4 rounded-[2.5rem] border border-stone-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="w-24 h-24 mb-4 rounded-3xl overflow-hidden shadow-sm border border-white group-hover:scale-110 transition-transform">
                  <img src="/assets/onboarding/step1.png" alt="Adım 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 bg-white text-stone-900 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] shadow-sm border border-stone-100 mb-3">
                  1
                </div>
                <p className="text-[10px] font-bold text-stone-600 leading-relaxed px-2">
                  İndirmek istediğiniz ürün kategorilerini seçin.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="bg-stone-50/50 p-4 rounded-[2.5rem] border border-stone-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="w-24 h-24 mb-4 rounded-3xl overflow-hidden shadow-sm border border-white group-hover:scale-110 transition-transform">
                  <img src="/assets/onboarding/step2.png" alt="Adım 2" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 bg-white text-stone-900 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] shadow-sm border border-stone-100 mb-3">
                  2
                </div>
                <p className="text-[10px] font-bold text-stone-600 leading-relaxed px-2">
                  Formatınızı seçin ve indir butonuna basın.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="bg-stone-50/50 p-4 rounded-[2.5rem] border border-stone-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="w-24 h-24 mb-4 rounded-3xl overflow-hidden shadow-sm border border-white group-hover:scale-110 transition-transform">
                  <img src="/assets/onboarding/step3.png" alt="Adım 3" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 bg-white text-stone-900 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] shadow-sm border border-stone-100 mb-3">
                  3
                </div>
                <p className="text-[10px] font-bold text-stone-600 leading-relaxed px-2">
                  Tüm ürünler galerinizde! WhatsApp'ta paylaşın.
                </p>
              </div>
            </div>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-2 italic">
              İşte bu kadar kolay!
            </p>
          </div>
        ) : step === 1 ? (
          <div className="p-2">
            <div className="mb-8 px-2 flex items-end justify-between">
              <div>
                <h5 className="text-xs font-black text-stone-900 uppercase tracking-[0.2em] mb-1">
                  REYOUN / KATEGORİ SEÇİMİ
                </h5>
                <p className="text-[11px] text-stone-400 font-medium italic">
                  Hangi ürün gruplarını kataloğa ekleyelim?
                </p>
              </div>
              <Button
                onClick={selectAllCategories}
                variant="secondary"
                mode="rectangle"
                size="sm"
                className="!flex !items-center !gap-1.5 !text-[9px] font-black !text-stone-900 hover:!text-stone-600 transition-colors !bg-stone-100 !px-3 !py-1.5 !rounded-lg whitespace-nowrap shrink-0 border-none shadow-none"
                icon={
                  selectedCategories.length === populatedCategories.length ? (
                    <CheckSquare size={14} />
                  ) : (
                    <Square size={14} />
                  )
                }
              >
                TÜMÜNÜ SEÇ
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {populatedCategories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => handleToggleCategory(cat)}
                  variant="ghost"
                  mode="rectangle"
                  selected={selectedCategories.includes(cat)}
                  className={`
                      !p-4 border-2 transition-all group !h-auto shadow-none
                      ${
                        selectedCategories.includes(cat)
                          ? '!bg-stone-900 !border-stone-900 !text-white shadow-xl scale-[1.02]'
                          : '!bg-stone-50 !border-stone-100 !text-stone-600 hover:!border-stone-300'
                      }
                    `}
                >
                  <span className="font-black text-[10px] uppercase tracking-tight text-left flex-1 leading-tight mr-3">
                    {cat}
                  </span>
                  <div
                    className={`
                      px-2.5 py-1.5 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0
                      ${
                        selectedCategories.includes(cat)
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-100 text-stone-400'
                      }
                    `}
                  >
                    {groupedProducts[cat]?.length || 0} ÜRÜN
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : step === 2 ? (
          <div className="p-2 space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">Katalog Formatını Seç</h3>
              <p className="text-xs text-stone-400 font-bold mt-1 uppercase tracking-widest">Nasıl bir dosya oluşturmak istersiniz?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button
                description="Tüm ürünleri alt alta, uzun bir liste halinde toplar. WhatsApp'ta PDF gibi göndermek veya çıktı almak için idealdir."
                icon={<Printer size={28} />}
                selected={exportMode === 'LIST'}
                onClick={() => setExportMode('LIST')}
              >
                Hepsini Tek Fotoğrafta Al
              </Button>

              <Button
                description="Ürünleri ekran boyutuna göre sayfalara ayırır (9:16). Instagram ve WhatsApp durumlarında paylaşmak için en profesyonel yöntemdir."
                icon={<Download size={28} />}
                selected={exportMode === 'STORY'}
                onClick={() => setExportMode('STORY')}
                badge="POPÜLER"
              >
                WhatsApp Hikaye Boyutu
              </Button>
            </div>
          </div>
        ) : step === 3 ? (
          <div className="p-2 space-y-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">Görünüm ve Düzen</h3>
              <p className="text-xs text-stone-400 font-bold mt-1 uppercase tracking-widest">Kataloğunuzun stilini belirleyin</p>
            </div>

            <div className="space-y-8">
              {/* THEME SELECTION */}
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 px-1">Renk Teması</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    layout="vertical"
                    selected={storyTheme === 'LIGHT'}
                    onClick={() => setStoryTheme('LIGHT')}
                    icon={
                      <div className="w-12 h-16 bg-white border border-stone-100 rounded-xl shadow-sm flex flex-col p-1.5 gap-1 overflow-hidden">
                        <div className="w-full h-1 bg-stone-100 rounded-full"></div>
                        <div className="w-full h-4 bg-stone-50 rounded-md"></div>
                        <div className="w-full h-4 bg-stone-50 rounded-md"></div>
                      </div>
                    }
                  >
                    Ferah Beyaz
                  </Button>

                  <Button
                    layout="vertical"
                    selected={storyTheme === 'DARK'}
                    onClick={() => setStoryTheme('DARK')}
                    icon={
                      <div className="w-12 h-16 bg-stone-950 border border-stone-800 rounded-xl shadow-sm flex flex-col p-1.5 gap-1 overflow-hidden">
                        <div className="w-full h-1 bg-stone-900 rounded-full"></div>
                        <div className="w-full h-4 bg-stone-900/50 rounded-md"></div>
                        <div className="w-full h-4 bg-stone-900/50 rounded-md"></div>
                      </div>
                    }
                  >
                    Asil Siyah
                  </Button>
                </div>
              </div>

              {/* ORIENTATION SELECTION (Only for LIST) */}
              {exportMode === 'LIST' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 px-1">Sayfa Yapısı</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      layout="vertical"
                      selected={listOrientation === 'VERTICAL'}
                      onClick={() => setListOrientation('VERTICAL')}
                      icon={
                        <div className="w-10 h-14 bg-stone-50 border-2 border-stone-200 rounded-lg flex flex-col items-center justify-center gap-1.5 p-2">
                           <div className="w-full h-1 bg-stone-200 rounded-full"></div>
                           <div className="w-full h-1 bg-stone-200 rounded-full"></div>
                           <div className="w-full h-1 bg-stone-200 rounded-full"></div>
                        </div>
                      }
                    >
                      Dikey (A4)
                    </Button>

                    <Button
                      layout="vertical"
                      selected={listOrientation === 'HORIZONTAL'}
                      onClick={() => setListOrientation('HORIZONTAL')}
                      icon={
                        <div className="w-14 h-10 bg-stone-50 border-2 border-stone-200 rounded-lg flex flex-col items-center justify-center gap-1.5 p-2">
                           <div className="flex gap-1 w-full">
                             <div className="flex-1 h-3 bg-stone-200 rounded"></div>
                             <div className="flex-1 h-3 bg-stone-200 rounded"></div>
                           </div>
                           <div className="flex gap-1 w-full">
                             <div className="flex-1 h-3 bg-stone-200 rounded"></div>
                             <div className="flex-1 h-3 bg-stone-200 rounded"></div>
                           </div>
                        </div>
                      }
                    >
                      Yatay (Katalog)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`py-4 ${storyTheme === 'DARK' ? 'bg-[#121212]' : 'bg-stone-50/30'} print:bg-white print:p-0`}>
            {exportMode === 'LIST' ? (
              <div
                ref={listContainerRef}
                data-capture-area="true"
                className={`
                  ${storyTheme === 'DARK' ? 'bg-[#1d1d1f] text-white' : 'bg-white text-stone-900'} 
                  px-8 sm:px-12 py-10 rounded-[40px] shadow-sm border border-stone-100 
                  print:shadow-none print:border-none print:p-0 overflow-hidden mx-auto
                  ${listOrientation === 'HORIZONTAL' ? 'max-w-none w-full' : 'max-w-4xl'}
                `}
              >
                {/* PUZZLE HEADER */}
                <div className={`flex flex-col mb-12 border-b-4 ${storyTheme === 'DARK' ? 'border-white/10' : 'border-stone-900'} pb-10 relative pt-4 text-center items-center`}>
                  <div className={`absolute top-0 px-8 py-2 ${storyTheme === 'DARK' ? 'bg-white text-black' : 'bg-stone-900 text-white'} rounded-b-3xl shadow-xl`}>
                    <span className="text-[9px] font-black lowercase tracking-[0.3em] opacity-90">
                      {storeUrl}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mt-12 uppercase px-4 leading-none">
                    {storeName}
                  </h1>
                  <p className={`text-[10px] font-black uppercase tracking-[0.5em] mt-4 ${storyTheme === 'DARK' ? 'text-stone-500' : 'text-stone-300'}`}>
                    ÜRÜN KATALOĞU
                  </p>

                  <div className="mt-10 flex gap-8 items-center">
                    <div className="text-center">
                      <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">GÜNCELLEME</p>
                      <p className="text-xs font-black">{new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className={`w-[1px] h-8 ${storyTheme === 'DARK' ? 'bg-white/10' : 'bg-stone-100'}`}></div>
                    <div className="text-center">
                      <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">TOPLAM</p>
                      <p className="text-xs font-black">{filteredProductsCount} ÜRÜN</p>
                    </div>
                  </div>
                </div>

                {/* CATEGORY PUZZLE BOXES */}
                <div className="space-y-12">
                  {selectedCategories.map((cat) => {
                    const categoryProducts = groupedProducts[cat];
                    if (!categoryProducts || categoryProducts.length === 0) return null;

                    return (
                      <div key={cat} className={`break-inside-avoid p-6 sm:p-8 rounded-[2.5rem] border ${storyTheme === 'DARK' ? 'bg-stone-900/50 border-white/5' : 'bg-stone-50 border-stone-100'}`}>
                        <div className="flex items-center gap-4 mb-8">
                          <h2 className="text-lg font-black uppercase tracking-tight shrink-0">
                            {cat}
                          </h2>
                          <div className={`h-1 flex-1 rounded-full ${storyTheme === 'DARK' ? 'bg-white/5' : 'bg-white'}`}></div>
                          <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                            {categoryProducts.length} ÜRÜN
                          </span>
                        </div>

                        <div className={`
                          grid gap-4
                          ${listOrientation === 'VERTICAL' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}
                        `}>
                          {categoryProducts.map((product) => (
                            <div
                              key={product.id}
                              className={`
                                flex flex-col p-3 rounded-3xl border transition-all duration-500 group
                                ${storyTheme === 'DARK' ? 'bg-black/20 border-white/5 hover:bg-black/40' : 'bg-white border-white hover:border-stone-200 hover:shadow-xl'}
                              `}
                            >
                              <div className="aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-stone-100 relative group-hover:scale-[1.02] transition-transform duration-500">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <Layers3 size={24} />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col flex-1 px-1">
                                <h4 className="font-black text-[10px] sm:text-[11px] leading-tight uppercase line-clamp-2 mb-2 min-h-[2.2em]">
                                  {product.name}
                                </h4>
                                <div className="mt-auto pt-2 border-t border-stone-100/50 flex items-center justify-between">
                                  <span className="text-[12px] sm:text-[13px] font-black tracking-tighter">
                                    {calculateFinalPrice(product)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-16 pt-12 border-t border-stone-100/10 text-center flex flex-col items-center">
                  <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.5em] mb-4">
                    BU KATALOG www.ekatalog.site İLE OLUŞTURULMUŞTUR
                  </p>
                </div>
              </div>
            ) : (
              <div
                ref={storiesContainerRef}
                className="flex flex-col items-center overflow-y-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={() => setIsAutoScrolling(false)}
                onMouseUp={() => setIsAutoScrolling(true)}
                onTouchStart={() => setIsAutoScrolling(false)}
                onTouchEnd={() => setIsAutoScrolling(true)}
              >
                {storyPages.map((page, pageIdx) => (
                  <div
                    key={pageIdx}
                    data-story-page="true"
                    className={`w-[360px] h-[640px] relative shadow-none flex flex-col items-center px-12 pt-12 pb-6 shrink-0 overflow-hidden transition-colors duration-500 ${storyTheme === 'DARK' ? 'bg-[#1d1d1f] text-white' : 'bg-[#f8f8f8] text-[#1c1c1e]'}`}
                    style={{ aspectRatio: '9/16' }}
                  >
                    {/* STORY HEADER (SIMPLIFIED - NO LOGO) */}
                    <div className="w-full flex items-center justify-end mb-4 shrink-0 px-1 py-1">
                      <div className={`
                        px-3 py-1.5 rounded-lg shadow-sm border
                        ${storyTheme === 'DARK' ? 'bg-stone-900/50 border-stone-800 text-white' : 'bg-stone-900 text-white border-stone-900'}
                      `}>
                        <h2 className="text-[9px] font-black uppercase tracking-tighter leading-none">
                          {page.category}
                        </h2>
                      </div>
                    </div>

                    {/* STORY PRODUCTS (HORIZONTAL LIST) */}
                    <div className="w-full flex flex-col gap-2 overflow-hidden">
                      {page.products.map((product) => {
                        const description = product.description || 'Standart Ürün';
                        const truncatedDesc = description.length > 50 
                          ? description.substring(0, 47) + '...' 
                          : description;

                        return (
                          <div
                            key={product.id}
                            className={`
                              flex items-center gap-3 p-2 rounded-xl border transition-all
                              ${storyTheme === 'DARK' ? 'bg-stone-900/40 border-stone-800/50' : 'bg-stone-50/50 border-stone-100 shadow-sm'}
                            `}
                          >
                            <div className={`w-12 h-12 rounded-lg overflow-hidden border shadow-sm shrink-0 bg-white ${storyTheme === 'DARK' ? 'border-stone-800' : 'border-white'}`}>
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  crossOrigin="anonymous"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-200">
                                  <Layers3 size={20} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-[10px] font-black leading-tight uppercase line-clamp-1 ${storyTheme === 'DARK' ? 'text-white' : 'text-stone-900'}`}>
                                {product.name}
                              </h4>
                              <p className={`text-[8px] font-bold mt-0.5 line-clamp-2 break-words leading-[1.3] ${storyTheme === 'DARK' ? 'text-stone-500' : 'text-stone-400'}`}>
                                {truncatedDesc}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className={`text-[11px] font-black tracking-tighter ${storyTheme === 'DARK' ? 'text-white' : 'text-stone-900'}`}>
                                {calculateFinalPrice(product)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* STORY FOOTER WATERMARK (TRANSPARENT & ROUNDED) */}
                    <div className="mt-4 flex flex-col items-center gap-2 shrink-0">
                      <p className={`text-[8px] font-black lowercase tracking-[0.2em] opacity-40 ${storyTheme === 'DARK' ? 'text-white' : 'text-stone-900'}`}>
                        {storeUrl}
                      </p>
                      {settings?.logoUrl && (
                        <img
                          src={settings.logoUrl}
                          alt="watermark"
                          className={`w-10 h-10 object-contain rounded-lg opacity-40 ${storyTheme === 'DARK' ? 'brightness-125' : ''}`}
                          crossOrigin="anonymous"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
