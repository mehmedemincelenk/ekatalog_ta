import { memo } from 'react';
import { THEME } from '../../../../data/config';
import { formatWhatsAppUrl } from '../../../../utils/formatters/contact';

interface MobileQuickBuyProps {
  name: string;
  whatsapp: string;
}

/**
 * MOBILE QUICK BUY BAR
 */
export const MobileQuickBuy = memo(({ name, whatsapp }: MobileQuickBuyProps) => {
  const whatsappUrl = formatWhatsAppUrl(whatsapp);

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-stone-100 p-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Hızlı Sipariş</span>
        <span className="text-sm font-black text-stone-900">{name}</span>
      </div>
      <a 
        href={whatsappUrl}
        target="_blank" 
        rel="noreferrer"
        className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center gap-2 group"
      >
        <div className="w-3.5 h-3.5 fill-current">
          {THEME.icons.whatsapp}
        </div>
        <span className="inline-flex items-center group-hover:scale-105 transition-transform">
          Hemen Al <span className="inline-block animate-bounce ml-1.5">👆</span>
        </span>
      </a>
    </div>
  );
});
