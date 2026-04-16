import { THEME } from '../data/config';
import Button from './Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-stone-900 selection:text-white">
      <section className="pt-12 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter leading-[0.85] animate-in slide-in-from-bottom-8 duration-700">
            basit. sade.<br />ekatalog.
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-stone-500 font-medium leading-relaxed">
            Katalog maliyetinden kurtulun. Ürünlerinizi saniyeler içinde güncelleyin. Üstelik web adresiniz (sirketiniz.ekatalog.site) ömür boyu bizden 0₺.
          </p>

          <div className="pt-10 flex justify-center">
            <div className="max-w-[280px] md:max-w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-stone-900 bg-stone-900 ring-1 ring-stone-200">
              <img src="/images/catalog_preview.png" alt="E-Katalog Önizleme" className="w-full h-auto" />
            </div>
          </div>

          <div className="pt-4">
            <p className="text-2xl font-black text-stone-900">sadece 200₺/ay</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <a href="https://wa.me/905550000000" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="!rounded-full px-20 shadow-2xl font-black text-[12px] w-full sm:w-auto">
                HEMEN BAŞLAYIN
              </Button>
            </a>
            <a href="https://toptanambalajcim.ekatalog.site" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="!rounded-full px-20 font-black text-[12px] w-full sm:w-auto">
                ÖRNEK KATALOG
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* THE VALUE SECTION */}
      <section className="py-24 px-4 bg-stone-50/50 border-t border-stone-100">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter leading-tight">
            Kendi dükkan isminizle.<br />
            <span className="text-green-600 block mt-2 text-2xl md:text-3xl">markaniz.ekatalog.site</span>
          </h2>
          <p className="text-stone-500 font-medium text-lg mx-auto max-w-2xl">Kağıt kataloglar geçmişte kaldı. Dükkanınıza özel linkle her şey anında, her yerde güncel.</p>
          <ul className="space-y-4 text-stone-900 font-black text-xs uppercase tracking-widest flex flex-col items-center">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">✓</span>
              Sıfır Baskı Maliyeti
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">✓</span>
              Anlık Fiyat Güncelleme
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">✓</span>
              Hızlı WhatsApp Siparişi
            </li>
          </ul>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="py-24 px-4 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-stone-900 tracking-tight uppercase">Eksiksiz & Profesyonel</h2>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">İhtiyacınız olan her şey tek bir panelde.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Basit Yönetim", desc: "Telefonunuzdan saniyeler içinde ürün ekleyin, silin veya güncelleyin.", icon: "📱" },
              { title: "Toplu Güncelleme", desc: "Tüm dükkana veya seçtiğiniz reyona tek tıkla zam veya indirim uygulayın.", icon: "📈" },
              { title: "WhatsApp Entegrasyonu", desc: "Müşterileriniz ürün seçtiğinde sipariş listesi doğrudan cebinize gelsin.", icon: "💬" },
              { title: "Sınırsız Reyon", desc: "Ürünlerinizi istediğiniz gibi gruplayın, parmağınızla sürükleyerek sıralayın.", icon: "🗂️" },
              { title: "Işık Hızında", desc: "Müşterileriniz beklemeyi sevmez. Kataloğunuz her telefonda anında açılır.", icon: "⚡" },
              { title: "Sade Tasarım", desc: "Karmaşık menüler yok. Sadece ürünleriniz ve markanız ön planda.", icon: "💎" }
            ].map((f, i) => (
              <div key={i} className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-500 group">
                <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
                <h3 className="text-xl font-black tracking-tight mb-3">{f.title}</h3>
                <p className="text-stone-500 group-hover:text-stone-400 font-medium text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
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
