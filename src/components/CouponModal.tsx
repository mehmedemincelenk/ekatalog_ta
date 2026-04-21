import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME, LABELS } from '../data/config';
import Button from './Button';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (code: string) => void;
  discountError?: string | null;
  activeDiscount?: { rate: number; category?: string } | null;
}

export default function CouponModal({ isOpen, onClose, onApplyDiscount, discountError, activeDiscount }: CouponModalProps) {
  const [couponCode, setCouponCode] = useState('');

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCouponCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (couponCode.trim()) {
      onApplyDiscount(couponCode.trim().toUpperCase());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleApply();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 border border-stone-100"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100/50 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col items-center mt-2 mb-6 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm border border-emerald-100">
            🏷️
          </div>
          <h3 className="text-lg font-black text-stone-900 uppercase tracking-widest px-2 leading-tight">İndirim Kuponu</h3>
          <p className="text-[11px] font-bold text-stone-400 mt-2">Avantajlı fiyatlar için kodunuzu girin</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Örn: YAZ20"
              className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 text-center font-black text-stone-900 tracking-[0.2em] uppercase focus:border-stone-900 focus:bg-white transition-all outline-none placeholder:text-stone-300 placeholder:tracking-normal"
            />
          </div>

          {activeDiscount && (
            <div className="bg-emerald-50 text-emerald-600 rounded-xl px-4 py-3 text-center border border-emerald-100/50 flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Aktif İndirim</span>
              <span className="text-sm font-bold">%{activeDiscount.rate * 100} Onaylandı ✓</span>
            </div>
          )}

          {discountError && (
            <div className="bg-red-50 text-red-500 rounded-xl px-4 py-3 text-center border border-red-100/50 flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Hata</span>
              <span className="text-xs font-bold font-sans">Geçersiz Kupon Kodu</span>
            </div>
          )}

          <Button 
            onClick={handleApply}
            variant="primary"
            size="md"
            mode="rectangle"
            className="w-full !rounded-2xl !py-4"
          >
            KUPONU UYGULA
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
