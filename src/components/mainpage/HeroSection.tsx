import { memo } from 'react';

export const HeroSection = memo(() => (
  <section className="pt-12 pb-10 px-4 text-center">
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter leading-[0.85] animate-in slide-in-from-bottom-8 duration-700">
        basit. sade.<br />ekatalog.
      </h1>
      <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-500 font-medium leading-relaxed">
        Fiyatlar zamlandığında kataloglarınızı tek tek güncellemek gibi angarya maliyetlere veda edin, ekataloğunuzdan fiyatlarınızı saniyeler içinde güncelleyin.
      </p>
      <div className="pt-2 flex justify-center">
        <div className="max-w-[280px] md:max-w-[320px] rounded-lg overflow-hidden shadow-2xl border-4 border-green-600 bg-white ring-1 ring-stone-200">
          <img src="/images/catalog_preview.png" alt="E-Katalog Önizleme" className="w-full h-auto" />
        </div>
      </div>
    </div>
  </section>
));
