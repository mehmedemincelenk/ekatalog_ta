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
import * as Lucide from 'lucide-react';

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
  isStatic = false,
  initialStep,
}: PriceListModalProps) {
  const { settings } = useStore();
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>((initialStep as any) || 1); // 0: Intro, 1: Mode, 2: Theme, 3: Categories, 4: Preview
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
    if (isOpen && initialStep === undefined) {
      const skipIntro = localStorage.getItem('ekatalog_skip_price_list_intro');
      setStep(skipIntro === 'true' ? 1 : 0);
      setSelectedCategories([]);
      setIsExporting(false);
    }
  }, [isOpen, initialStep]);

  useEffect(() => {
    if (initialStep !== undefined) {
      setStep(initialStep as any);
    }
  }, [initialStep]);

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
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-3 w-full">
            <Button
              onClick={() => {
                localStorage.setItem('ekatalog_skip_price_list_intro', 'true');
                setStep(1);
              }}
              variant="secondary"
              size="md"
              mode="rectangle"
              className="flex-1 h-16 !rounded-[24px]"
              showFingerprint={true}
            >
              ANLADIM TEKRAR GÖSTERME
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(1)}
              className="flex-1 h-16 !rounded-[24px]"
              mode="rectangle"
              showFingerprint={true}
            >
              TAMAM
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            mode="rectangle"
            onClick={() => {
              setStep((prev) => (prev - 1) as 0 | 1 | 2 | 3 | 4);
            }}
            className="w-16 h-16 shrink-0"
            showFingerprint={false}
          >
            <Lucide.ChevronLeft size={24} strokeWidth={4} />
          </Button>
          {step === 4 ? (
            <div className="flex gap-2 flex-1">
              <Button
                variant="primary"
                size="md"
                icon={<Lucide.Download size={18} />}
                onClick={downloadAsImage}
                loading={isExporting}
                className="flex-1 h-16 shadow-lg !rounded-[24px]"
                mode="rectangle"
                showFingerprint={true}
              >
                {exportMode === 'STORY' ? 'SERİ KAYDET' : 'KAYDET'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={<Lucide.Printer size={18} />}
                onClick={printAsPDF}
                className="w-16 shrink-0 h-16 flex items-center justify-center p-0 !bg-stone-50 border-stone-100 shadow-sm"
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
              className="flex-1 h-16 !rounded-[24px]"
              mode="rectangle"
              showFingerprint={true}
            >
              {step === 3 ? 'ÖNİZLEME' : 'DEVAM'}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 0: return "";
      case 1: return "KATEGORİ";
      case 2: return "BİÇİM";
      case 3: return "TEMA";
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
      case 1: return "max-w-4xl";
      case 2: return "max-w-2xl";
      case 3: return "max-w-xl";
      case 4: return exportMode === 'STORY' ? 'max-w-sm' : 'max-w-5xl';
      default: return "max-w-4xl";
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? "" : getStepTitle()}
      maxWidth={getMaxWidth()}
      footer={footer}
      progress={progress}
      noPadding={step === 4}
      isStatic={isStatic}
    >
      <div className="print:p-0">
        {step === 0 ? (
          <div className="py-2 px-1 flex flex-col items-center">
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { id: 1, img: '/assets/onboarding/step1.png', text: 'İndirmek istediğiniz ürün kategorilerini seçin.' },
                { id: 2, img: '/assets/onboarding/step2.png', text: 'Formatınızı seçin ve indir butonuna basın.' },
                { id: 3, img: '/assets/onboarding/step3.png', text: "Tüm ürünler galerinizde! WhatsApp'ta paylaşın." }
              ].map((card) => (
                <div key={card.id} className="relative bg-stone-50/50 p-3 rounded-[2rem] border border-stone-100 flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-4 text-left group hover:bg-white hover:shadow-xl transition-all duration-500 overflow-hidden">
                  {/* Image Unit (Hardened Square 1:1) */}
                  <div 
                    className="w-24 h-24 sm:w-full aspect-square rounded-3xl overflow-hidden shadow-sm border border-white shrink-0 group-hover:scale-105 transition-transform duration-500 relative bg-stone-100"
                  >
                    <img src={card.img} alt="" className="w-full h-full object-cover" />
                    {/* Sequence Number Overlay */}
                    <div className="absolute top-2 left-2 w-7 h-7 bg-white/90 backdrop-blur-sm text-stone-900 rounded-xl flex items-center justify-center font-black text-[11px] shadow-sm border border-white/50 z-10">
                      {card.id}
                    </div>
                  </div>

                  {/* Text Unit */}
                  <p className="text-[10px] font-bold text-stone-500 leading-relaxed flex-1 sm:px-2 pb-2">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-2 italic">
              İşte bu kadar kolay!
            </p>
          </div>
        ) : step === 1 ? (
          <div className="p-2">
            <div className="mb-6 flex items-center justify-between -mt-2">
              <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight leading-tight">
                KATEGORİ
              </h3>
              <Button
                onClick={selectAllCategories}
                variant="secondary"
                mode="rectangle"
                size="sm"
                className="!flex !items-center !gap-1.5 !text-[9px] font-black !text-stone-900 hover:!text-stone-600 transition-colors !bg-stone-50 !px-4 !py-2 !rounded-xl whitespace-nowrap shrink-0 border border-stone-100 shadow-sm"
                showFingerprint={true}
                icon={
                  selectedCategories.length === populatedCategories.length ? (
                    <Lucide.CheckSquare size={14} />
                  ) : (
                    <Lucide.Square size={14} />
                  )
                }
              >
                TÜMÜNÜ SEÇ
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {populatedCategories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => handleToggleCategory(cat)}
                  variant={selectedCategories.includes(cat) ? 'primary' : 'secondary'}
                  mode="rectangle"
                  size="sm"
                  className="!text-[10px] !py-2 !px-4 !rounded-xl"
                  showFingerprint={true}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        ) : step === 2 ? (
          <div className="p-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                layout="vertical"
                selected={exportMode === 'LIST'}
                onClick={() => setExportMode('LIST')}
                className="!h-auto !py-10 !rounded-[2.5rem]"
                showFingerprint={false}
                icon={
                  <div className="w-16 h-24 bg-stone-50 border-2 border-stone-200 rounded-lg flex flex-col gap-1 p-2 group-hover:border-stone-400 transition-colors">
                    <div className="grid grid-cols-3 gap-1">
                      {[1,2,3,4,5,6,7,8,9].map(i => (
                        <div key={i} className="aspect-square bg-stone-200 rounded-[2px]" />
                      ))}
                    </div>
                  </div>
                }
              >
                <span className="text-[11px] font-black uppercase tracking-widest mt-2">TEKTE HEPSİ</span>
              </Button>

              <Button
                layout="vertical"
                selected={exportMode === 'STORY'}
                onClick={() => setExportMode('STORY')}
                className="!h-auto !py-10 !rounded-[2.5rem]"
                showFingerprint={false}
                icon={
                  <div className="grid grid-cols-2 gap-1.5 p-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-6 h-10 bg-stone-50 border border-stone-200 rounded-sm flex flex-col gap-0.5 p-0.5 group-hover:border-stone-400 transition-colors">
                        <div className="grid grid-cols-2 gap-0.5">
                           <div className="w-full h-1.5 bg-stone-200 rounded-[1px]" />
                           <div className="w-full h-1.5 bg-stone-200 rounded-[1px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <span className="text-[11px] font-black uppercase tracking-widest mt-2">SOSYAL MEDYA</span>
              </Button>
            </div>

            {/* CONDITIONAL ORIENTATION CHOICE */}
            {exportMode === 'LIST' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 pt-2"
              >
                <Button
                  onClick={() => setListOrientation('VERTICAL')}
                  selected={listOrientation === 'VERTICAL'}
                  variant="secondary"
                  mode="rectangle"
                  className="!h-16 !rounded-2xl flex flex-col items-center justify-center gap-1 border-2"
                  showFingerprint={false}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">DİKEY</span>
                </Button>
                <Button
                  onClick={() => setListOrientation('HORIZONTAL')}
                  selected={listOrientation === 'HORIZONTAL'}
                  variant="secondary"
                  mode="rectangle"
                  className="!h-16 !rounded-2xl flex flex-col items-center justify-center gap-1 border-2"
                  showFingerprint={false}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">YATAY</span>
                </Button>
              </motion.div>
            )}
          </div>
        ) : step === 3 ? (
          <div className="p-2">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                layout="vertical"
                selected={storyTheme === 'LIGHT'}
                onClick={() => setStoryTheme('LIGHT')}
                className="!h-auto !py-10 !rounded-[2.5rem]"
              >
                BEYAZ
              </Button>

              <Button
                variant="primary"
                layout="vertical"
                selected={storyTheme === 'DARK'}
                onClick={() => setStoryTheme('DARK')}
                className="!h-auto !py-10 !rounded-[2.5rem]"
              >
                SİYAH
              </Button>
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
                                    <Lucide.Layers3 size={24} />
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
                                  <Lucide.Layers3 size={20} />
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
