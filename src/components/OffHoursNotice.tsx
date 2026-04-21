import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TECH } from '../data/config';
import { X, Check, Delete } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OffHoursNoticeProps {
  whatsappNumber: string;
  storeId: string;
}

export default function OffHoursNotice({ whatsappNumber, storeId }: OffHoursNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => 
    sessionStorage.getItem('ekatalog_offhours_dismissed') === 'true'
  );

  useEffect(() => {
    if (isDismissed) return;

    const currentHour = new Date().getHours();
    const isOffHours = currentHour >= TECH.offHours.start || currentHour < TECH.offHours.end;

    if (isOffHours) {
      const timer = setTimeout(() => setIsVisible(true), 20000);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  const handleKeyClick = (num: string) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('ekatalog_offhours_dismissed', 'true');
  };

  const handleSubmit = async () => {
    if (phoneNumber.length < 10) return;

    try {
      // 1. Save to Database (Silent)
      await supabase.from('visitor_leads').insert({
        store_id: storeId,
        phone_number: phoneNumber,
        status: 'pending'
      });
      
      // 2. Notify via Telegram (Master Admin Line)
      if (TECH.notifications.telegram.enabled && TECH.notifications.telegram.botToken !== 'YOUR_BOT_TOKEN') {
        const domain = window.location.hostname;
        const catalogPhone = whatsappNumber; 
        
        const text = encodeURIComponent(
          `🚨 *Yeni Gece Vardiyası Talebi!*\n\n` +
          `🌐 *Katalog:* ${domain}\n` +
          `📞 *Katalog No:* ${catalogPhone}\n` +
          `📱 *Müşteri No:* ${phoneNumber}\n\n` +
          `⏰ *Saat:* ${new Date().toLocaleTimeString('tr-TR')}`
        );
        
        fetch(`https://api.telegram.org/bot${TECH.notifications.telegram.botToken}/sendMessage?chat_id=${TECH.notifications.telegram.chatId}&text=${text}&parse_mode=Markdown`)
          .catch(err => console.error('Telegram notification error:', err));
      }

      handleDismiss();
    } catch (err) {
      console.error('Lead saving error:', err);
      handleDismiss();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, x: 0, opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ y: 0, x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ y: 100, x: 0, opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          className="fixed bottom-6 right-6 z-[100] w-[90%] max-w-[320px]"
        >
          <div className="backdrop-blur-3xl bg-stone-900/95 border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] rounded-[32px] p-4 overflow-hidden text-white">
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-stone-800 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/5">
                  🌙
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13px] font-black tracking-tight leading-none text-stone-100">Gece Vardiyası</h4>
                  <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mt-1 truncate">Numaranızı Bırakın, Arayalım</p>
                </div>
              </div>
              <button 
                onClick={handleDismiss}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-stone-500 hover:text-white transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Display Area */}
            <div className="bg-white/5 rounded-2xl p-3 mb-3 text-center border border-white/5">
              <div className="text-[18px] font-black tracking-widest h-6 text-stone-100">
                {phoneNumber || '05-- --- -- --'}
              </div>
            </div>

            {/* Numeric Keypad Grid (Compact) */}
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyClick(String(num))}
                  className="h-10 bg-white/5 hover:bg-white/10 rounded-xl text-md font-bold active:scale-95 transition-all text-stone-300"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleDelete}
                className="h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-stone-500"
              >
                <Delete size={18} />
              </button>
              <button
                onClick={() => handleKeyClick('0')}
                className="h-10 bg-white/5 hover:bg-white/10 rounded-xl text-md font-bold text-stone-300"
              >
                0
              </button>
              <button
                onClick={handleSubmit}
                disabled={phoneNumber.length < 10}
                className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                  phoneNumber.length >= 10 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-white/5 text-stone-700 opacity-50'
                }`}
              >
                <Check size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
