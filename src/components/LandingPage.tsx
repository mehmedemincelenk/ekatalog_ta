import { THEME } from '../data/config';
import Button from './Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-stone-900 selection:text-white">
      {/* STICKY PROMO BAR */}
      <div className="sticky top-0 z-[100] bg-green-600 text-white py-3 px-4 text-center shadow-lg overflow-hidden">
        <p className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap opacity-90">
          website adresi <span className="font-black opacity-100">hediye!</span> <span className="mx-2 opacity-50">→</span> <span className="font-black bg-black/10 px-2 py-0.5 rounded normal-case opacity-100">www.markaniz.ekatalog.site</span>
        </p>
      </div>

      <section className="pt-12 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter leading-[0.85] animate-in slide-in-from-bottom-8 duration-700">
            basit. sade.<br />ekatalog.
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-500 font-medium leading-relaxed">
            Zam vb. durumlarda kataloğu çöpe atmayın, ürünlerinizi saniyeler içinde güncelleyin.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="max-w-[280px] md:max-w-[320px] rounded-lg overflow-hidden shadow-2xl border-4 border-green-600 bg-white ring-1 ring-stone-200">
              <img src="/images/catalog_preview.png" alt="E-Katalog Önizleme" className="w-full h-auto" />
            </div>
          </div>

          {/* PRICING & TRUST SECTION */}
          <div className="pt-10 flex flex-col items-center space-y-6">
            <div className="text-center">
              <p className="text-6xl md:text-8xl font-black text-green-600 tracking-tighter leading-none">
                200₺<span className="text-lg font-bold opacity-40 ml-1">/ay</span>
              </p>
              <p className="mt-4 text-stone-400 font-black text-[10px] uppercase tracking-[0.25em]">aylık bir koli bandı fiyatına</p>
            </div>

            {/* SETUP ASSISTANCE BADGE */}
            <div className="bg-stone-50 border border-stone-100 px-6 py-4 rounded-3xl flex flex-col md:flex-row items-center gap-4 animate-in fade-in zoom-in duration-700 delay-300">
               <span className="text-xl">✅</span>
               <p className="text-sm font-bold text-stone-900 leading-tight">
                 Siz sadece ürün listesini atın, <span className="text-green-600 underline decoration-2 underline-offset-4">kataloğunuzu biz kuralım.</span><br />
                 <span className="text-[10px] text-stone-400 uppercase tracking-wider">Sonrasında kendiniz saniyeler içinde güncelleyebilirsiniz.</span>
               </p>
            </div>

            {/* ALL FEATURES LIST */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-stone-900 font-bold text-[11px] uppercase tracking-[0.15em] border-t border-stone-100 pt-8 w-full max-w-2xl">
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Sınırsız Ürün
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> WhatsApp Sipariş
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> QR Kod Hediye
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Toplu Fiyat Zam/İndirim
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Sınırsız Reyon
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Hızlı Arama & Filtre
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Mobil Yönetim Paneli
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Stok Kontrolü
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Özel Web Adresi
               </span>
            </div>
            
            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Cayma bedeli yok, istediğiniz zaman iptal edin.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-stone-900 rounded-[3.5rem] p-12 md:p-24 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none relative z-10">Siz de hemen başlayın.</h2>
          <div className="flex flex-col items-center justify-center relative z-10">
            <a href="https://wa.me/905550000000" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="!bg-white !text-stone-900 !rounded-full px-24 font-black shadow-xl w-full sm:w-auto">
                WHATSAPP'TAN YAZIN 🚀
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="pb-12 text-center border-t border-stone-100 pt-12">
        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">ekatalog.site © 2026 — HER DÜKKANA BİR WEB ADRESİ</p>
      </footer>
    </div>
  );
}
