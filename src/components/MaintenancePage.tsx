import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import Numpad from './Numpad';
import { useSettings } from '../hooks/useSettingsHub';

/**
 * MAINTENANCE PAGE (Diamond Standard)
 * -----------------------------------------------------------
 * A professional downtime interface with lead capture.
 */
export default function MaintenancePage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { settings, addVisitorLead } = useSettings(false);

  const handleLeadSubmit = async (phone: string) => {
    try {
      await addVisitorLead(phone);
      setIsSuccess(true);
    } catch (err) {
      console.error('Maintenance lead failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-12">
        {/* BRANDING */}
        <div className="flex flex-col items-center space-y-4">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.title} className="h-16 w-auto object-contain mb-2" />
          ) : (
            <div className="w-16 h-16 bg-stone-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black">
              {settings?.title?.charAt(0) || 'E'}
            </div>
          )}
          <h1 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">{settings?.title}</h1>
        </div>

        <div className="relative">
          {/* SUCCESS STATE */}
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-stone-50 rounded-[2rem] p-12 border border-stone-100 flex flex-col items-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                <Lucide.CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-stone-900 uppercase tracking-tight">KAYDEDİLDİ!</h4>
                <p className="text-stone-400 text-sm font-bold leading-relaxed px-4">
                  Dükkanı açtığımızda sizi ilk biz arayacağız. İlginiz için teşekkürler!
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none uppercase">
                  BAKIMDA
                </h2>
              </div>

              {/* LEAD CAPTURE SECTION */}
              <div className="bg-white border-2 border-stone-100 rounded-[2rem] p-8 shadow-2xl shadow-stone-200/50">
                <div className="text-center mb-8">
                  <p className="text-xl font-black text-stone-900 tracking-tighter uppercase">Sizi Arayalım</p>
                </div>
                
                <Numpad onSubmit={handleLeadSubmit} maxDigits={10} />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-8 opacity-20">
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.5em]">
            EKATALOG.SITE — #ELİTETRADERS
          </p>
        </div>
      </div>
    </div>
  );
}
