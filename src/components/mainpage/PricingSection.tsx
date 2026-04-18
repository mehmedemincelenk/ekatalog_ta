import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingSectionProps {
  currentPhrase: string;
}

export const PricingSection = memo(({ currentPhrase }: PricingSectionProps) => (
  <section className="pb-20 px-4 flex flex-col items-center space-y-6">
    <div className="text-center flex flex-col items-center">
      <div className="w-fit flex flex-col items-center">
        <p className="text-6xl md:text-8xl font-black text-green-600 tracking-tighter leading-none pr-1">
          ₺200<span className="text-lg font-bold opacity-70 ml-1">&nbsp;/&nbsp;ay&nbsp;</span>
        </p>
        <div className="relative h-3 md:h-4 w-full -mt-1 md:-mt-2 overflow-visible">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPhrase}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-stone-400 font-black text-[7px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.45em] text-center whitespace-nowrap absolute inset-0 flex items-center justify-center"
            >
              {currentPhrase}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <p className="mt-4 text-[10px] font-bold text-stone-300 uppercase tracking-widest">Cayma bedeli yok, istediğiniz zaman iptal edin.</p>
    </div>

    <div className="bg-stone-50 border border-stone-100 px-6 py-4 rounded-3xl flex items-center gap-4 animate-in fade-in zoom-in duration-700 delay-300">
       <span className="text-xl flex-shrink-0">✅</span>
       <p className="text-sm font-bold text-stone-900 leading-tight text-left">
         Ürün/Hizmet listenizi bize atın, <span className="text-green-600 underline decoration-2 underline-offset-4">kataloğunuzu biz kuralım siz yönetin.</span>
       </p>
    </div>
  </section>
));
