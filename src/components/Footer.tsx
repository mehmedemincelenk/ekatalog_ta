import { useState } from 'react';
import { COMPANY } from '../data/config';
import { ActiveDiscount } from '../hooks/useDiscount';

interface FooterProps {
  onLogoClick: () => void;
  isAdmin: boolean;
  activeDiscount?: ActiveDiscount | null;
  onApplyDiscount?: (code: string) => void;
  discountError?: string | null;
}

export default function Footer({ 
  onLogoClick, 
  isAdmin,
  activeDiscount,
  onApplyDiscount,
  discountError
}: FooterProps) {
  const [couponInput, setCouponInput] = useState('');

  const handleApply = () => {
    if (onApplyDiscount) {
      onApplyDiscount(couponInput);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-stone-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 items-start">
          
          {/* 1. Bölüm: Logo ve Telif */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <button
              onClick={onLogoClick}
              className="flex items-center gap-2 select-none focus:outline-none group"
              aria-label="Marka logosu"
            >
              <span className="text-3xl group-active:scale-90 transition-transform">{COMPANY.logoEmoji}</span>
              <div className="flex flex-col items-start leading-none text-left">
                <span className="font-bold text-stone-900 tracking-tight text-lg">
                  {COMPANY.name}
                </span>
                <span className="text-[11px] text-kraft-600 mt-0.5">
                  {COMPANY.tagline}
                </span>
              </div>
              {isAdmin && (
                <span className="ml-2 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded">
                  ADMİN
                </span>
              )}
            </button>
            <p className="text-[10px] text-stone-400 text-center md:text-left leading-relaxed">
              © {new Date().getFullYear()} {COMPANY.name}.<br className="hidden md:block" />
              Tüm hakları saklıdır.
            </p>
          </div>

          {/* 2. Bölüm: Adres ve İletişim */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] mb-1">LOKASYON</span>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors max-w-[200px] leading-relaxed"
            >
              {COMPANY.address}
            </a>
          </div>

          {/* 3. Bölüm: Kupon Alanı */}
          {!isAdmin && (
            <div className="flex flex-col items-center md:items-end gap-2.5">
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em]">AVANTAJ</span>
              <div className="flex gap-1 w-full max-w-[240px]">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  placeholder="KUPON KODU"
                  className={`flex-1 px-3 py-2 border rounded-lg text-[11px] font-bold transition-all ${
                    activeDiscount ? 'border-blue-500 bg-blue-50 text-blue-700' : 
                    discountError ? 'border-red-400 bg-red-50 text-red-700' : 'border-stone-200 text-stone-600 bg-white'
                  } focus:outline-none focus:ring-1 focus:ring-blue-400`}
                />
                <button
                  onClick={handleApply}
                  className="bg-stone-900 text-white px-3 py-2 rounded-lg hover:bg-stone-800 active:scale-95 transition-all shadow-sm shrink-0"
                  aria-label="Uygula"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
              {activeDiscount && <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">İndirim Aktif: %{Math.round(activeDiscount.rate * 100)}</p>}
              {discountError && <p className="text-[9px] font-bold text-red-500 uppercase tracking-tight">{discountError}</p>}
            </div>
          )}
          
        </div>
      </div>
    </footer>
  );
}
