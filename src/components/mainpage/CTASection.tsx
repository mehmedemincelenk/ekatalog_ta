import { memo } from 'react';
import Button from '../ui/Button';
import { formatWhatsAppUrl } from '../../utils/formatters/contact';
import { THEME } from '../../data/config';

interface CTASectionProps {
  whatsapp: string;
}

export const CTASection = memo(({ whatsapp }: CTASectionProps) => {
  const whatsappUrl = formatWhatsAppUrl(whatsapp, "Merhaba, e-katalog kurulumu hakkında bilgi almak istiyorum.");

  return (
    <section className="pb-10 pt-2 md:pb-20 md:pt-4 px-4">
      <div className="max-w-2xl mx-auto bg-stone-900 rounded-[3.5rem] pt-6 pb-8 md:pt-12 md:pb-16 px-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none relative z-10">Hemen başlayalım.</h2>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-block">
          <Button variant="primary" size="lg" className="!bg-[#25D366] !text-white !rounded-full p-4 md:p-8 shadow-2xl transition-all active:scale-95 hover:scale-105 group border-none aspect-square flex items-center justify-center">
            {THEME.icons.whatsappLarge}
          </Button>
        </a>
      </div>
    </section>
  );
});
