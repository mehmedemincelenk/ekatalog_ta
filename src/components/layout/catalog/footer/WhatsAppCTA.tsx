import { memo } from 'react';
import { THEME } from '../../../../data/config';
import { formatWhatsAppUrl } from '../../../../utils/formatters/contact';

interface WhatsAppCTAProps {
  whatsapp: string;
}

/**
 * WHATSAPP FLOATING CTA
 */
export const WhatsAppCTA = memo(({ whatsapp }: WhatsAppCTAProps) => {
  const whatsappUrl = formatWhatsAppUrl(whatsapp);

  return (
    <div className="fixed bottom-6 left-6 z-[90] group">
      <p className="bg-stone-900 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-2xl mb-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
         Sipariş ve Bilgi İçin
      </p>
      <a 
        href={whatsappUrl}
        target="_blank" 
        rel="noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all active:scale-95 hover:scale-110"
      >
        <div className="w-8 h-8 fill-current">
          {THEME.icons.whatsapp}
        </div>
      </a>
    </div>
  );
});
