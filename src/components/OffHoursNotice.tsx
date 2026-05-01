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

  const [prevForceVisible, setPrevForceVisible] = useState(forceVisible);
  if (forceVisible !== prevForceVisible) {
    setPrevForceVisible(forceVisible);
    if (forceVisible) setIsVisible(true);
  }

  useEffect(() => {
    if (isDismissed && !forceVisible) return;

    if (forceVisible) return;

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
          className="fixed bottom-4 right-[116px] z-[100] w-[calc(100%-132px)]"
        >
          <div className="relative overflow-hidden bg-stone-900/95 backdrop-blur-2xl border border-stone-800 shadow-[0_30px_70px_rgba(0,0,0,0.4)] rounded-[2rem] p-6">
            <Button
              onClick={handleDismiss}
              variant="ghost"
              mode="circle"
              size="sm"
              className="absolute top-4 right-4 !w-8 !h-8 shadow-none border-none !text-stone-500 hover:!text-white transition-colors"
              icon={<Lucide.X size={18} />}
            />

            {!isSuccess ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center text-2xl shadow-xl border border-stone-700/50">
                    🌙
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-stone-500 uppercase tracking-[0.3em] mb-1">GECE VARDİYASI</h4>
                    <p className="text-lg font-black text-white tracking-tighter leading-none">Sizi Arayalım</p>
                  </div>
                </div>

                <div className="py-1">
                  <p className="text-stone-400 text-[11px] font-bold leading-relaxed mb-5">
                    Şu an kapalıyız. Numaranızı bırakın, sabah ilk iş sizi arayalım.
                  </p>
                  
                  <Numpad 
                    onSubmit={handleLeadSubmit} 
                    maxDigits={10} 
                    variant="dark"
                  />
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20 mb-2">
                  <Lucide.CheckCircle2 size={32} strokeWidth={2.5} />
                </div>
                <h4 className="text-xl font-black text-white tracking-tighter uppercase">KAYDEDİLDİ</h4>
                <p className="text-stone-400 text-[10px] font-bold px-4 uppercase tracking-widest opacity-60">Sabah ilk iş arayacağız.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
