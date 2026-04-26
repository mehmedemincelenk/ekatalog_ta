import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TECH } from '../data/config';
import * as Lucide from 'lucide-react';
import Button from './Button';
import Numpad from './Numpad';
import { useSettings } from '../hooks/useSettingsHub';
import { OffHoursNoticeProps } from '../types';

/**
 * OFF HOURS NOTICE (Diamond Edition)
 * -----------------------------------------------------------
 * A gentle notification for late-night visitors.
 * Integrated with Numpad for direct lead capture.
 */
export default function OffHoursNotice({
  forceVisible = false,
}: OffHoursNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(
    () => sessionStorage.getItem('ekatalog_offhours_dismissed') === 'true',
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const { addVisitorLead } = useSettings(false);

  useEffect(() => {
    if (isDismissed && !forceVisible) return;

    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    const currentHour = new Date().getHours();
    const isOffHours =
      currentHour >= (TECH.offHours?.start || 23) ||
      currentHour < (TECH.offHours?.end || 7);

    if (isOffHours) {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDismissed, forceVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('ekatalog_offhours_dismissed', 'true');
  };

  const handleLeadSubmit = async (phone: string) => {
    try {
      await addVisitorLead(phone);
      setIsSuccess(true);
      setTimeout(() => {
        handleDismiss();
      }, 3000);
    } catch (err) {
      console.error('Lead submission failed', err);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100] w-[calc(100%-48px)] sm:w-[380px]"
        >
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl border-2 border-stone-100 shadow-[0_30px_70px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8">
            <Button
              onClick={handleDismiss}
              variant="ghost"
              mode="circle"
              size="sm"
              className="absolute top-6 right-6 !w-10 !h-10 shadow-none border-none !text-stone-300 hover:!bg-stone-50 transition-colors"
              icon={<Lucide.X size={20} />}
            />

            {!isSuccess ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-stone-900 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-xl shadow-stone-900/10">
                    🌙
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] mb-1">GECE VARDİYASI</h4>
                    <p className="text-xl font-black text-stone-900 tracking-tighter leading-none">Sizi Arayalım</p>
                  </div>
                </div>

                <div className="py-2">
                  <p className="text-stone-400 text-xs font-bold leading-relaxed mb-6">
                    Şu an kapalıyız. Numaranızı bırakın, sabah ilk iş sizi arayalım.
                  </p>
                  
                  <Numpad 
                    onSubmit={handleLeadSubmit} 
                    maxDigits={10} 
                  />
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner mb-2">
                  <Lucide.CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">ALINDI!</h4>
                <p className="text-stone-400 text-xs font-bold px-8">Mesajınız mühürlendi. En kısa sürede iletişime geçeceğiz.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
