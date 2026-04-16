import { THEME } from '../data/config';
import Button from './Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-stone-900 selection:text-white">
      {/* STICKY PROMO BAR */}
      <div className="sticky top-0 z-[100] bg-green-600 text-white py-3 px-4 text-center shadow-lg overflow-hidden">
        <p className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap opacity-90">
          domain <span className="font-black opacity-100">hediye!</span> <span className="mx-2 opacity-50">→</span> <span className="font-black bg-black/10 px-2 py-0.5 rounded normal-case opacity-100">www.markaniz.ekatalog.site</span>
        </p>
      </div>

      <section className="pt-12 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter leading-[0.85] animate-in slide-in-from-bottom-8 duration-700">
            basit. sade.<br />ekatalog.
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-500 font-medium leading-relaxed">
            Fiyatlar zamlanınca kataloglarınızı tek tek güncellemekle gibi angarya maliyetlerle artık uğraşmayın, ekatalogunuzdan fiyatlarınızı saniyeler içinde güncelleyin.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="max-w-[280px] md:max-w-[320px] rounded-lg overflow-hidden shadow-2xl border-4 border-green-600 bg-white ring-1 ring-stone-200">
              <img src="/images/catalog_preview.png" alt="E-Katalog Önizleme" className="w-full h-auto" />
            </div>
          </div>

          {/* PRICING & TRUST SECTION */}
          <div className="pt-10 flex flex-col items-center space-y-6">
            <div className="text-center flex flex-col items-center">
              <div className="w-fit">
                <p className="text-stone-400 font-black text-[7px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.45em] -mb-1.5 md:-mb-2.5 text-justify after:content-[''] after:inline-block after:w-full">
                  aylık bir koli bandı fiyatına
                </p>
                <p className="text-6xl md:text-8xl font-black text-green-600 tracking-tighter leading-none">
                  ₺200<span className="text-lg font-bold opacity-70 ml-1">/ay</span>
                </p>
              </div>
              <p className="mt-4 text-[10px] font-bold text-stone-300 uppercase tracking-widest">Cayma bedeli yok, istediğiniz zaman iptal edin.</p>
            </div>

            {/* SETUP ASSISTANCE BADGE */}
            <div className="bg-stone-50 border border-stone-100 px-6 py-4 rounded-3xl flex items-center gap-4 animate-in fade-in zoom-in duration-700 delay-300">
               <span className="text-xl flex-shrink-0">✅</span>
               <p className="text-sm font-bold text-stone-900 leading-tight text-left">
                 Ürün/Hizmet listenizi bize atın, <span className="text-green-600 underline decoration-2 underline-offset-4">kataloğunuzu biz kuralım siz yönetin.</span>
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20 pt-10 px-4">
        <div className="max-w-4xl mx-auto bg-stone-900 rounded-[3.5rem] pt-12 pb-16 md:pt-20 md:pb-24 px-12 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none relative z-10">Hemen başlayalım.</h2>
            <a href="https://wa.me/905550000000" target="_blank" rel="noreferrer" className="inline-block">
              <Button variant="primary" size="lg" className="!bg-[#25D366] !text-white !rounded-[2.5rem] p-4 md:p-6 shadow-2xl transition-all active:scale-95 hover:scale-105 group border-none">
                <svg className="w-20 h-20 md:w-32 md:h-32 fill-white drop-shadow-sm" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.004.332.009c.109.004.258-.045.405.314.144.354.491 1.197.534 1.285.043.088.072.191.014.303-.058.112-.087.181-.173.282-.087.101-.183.226-.26.303-.087.087-.177.181-.076.354.101.174.448.736.961 1.192.66.588 1.216.771 1.389.857.173.088.274.072.376-.043.101-.116.433-.506.548-.68.116-.173.231-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                </svg>
              </Button>
            </a>
        </div>
      </section>

      <footer className="pb-6 text-center border-t border-stone-100 pt-6 flex flex-col items-center gap-4">
        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
          ekatalog.site © 2026 — <span className="text-red-600">#</span>MİLLİTEKNOLOJİHAMLESİ
        </p>
      </footer>
    </div>
  );
}
