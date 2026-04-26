import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import BaseModal from './BaseModal';
import * as Lucide from 'lucide-react';
import FormInput from './FormInput';
import { CouponModalProps } from '../types';

/**
 * COUPON MODAL (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Handles discount code entry with smooth cinematic feedback.
 * State reset is handled by the 'key' prop pattern in AppModals.
 */
export default function CouponModal({
  isOpen,
  onClose,
  onApplyDiscount,
  discountError,
  activeDiscount,
  isStatic = false,
}: CouponModalProps) {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = useCallback(() => {
    if (couponCode.trim()) {
      onApplyDiscount(couponCode.trim().toUpperCase());
    }
  }, [couponCode, onApplyDiscount]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleApply();
  };


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      isStatic={isStatic}
    >
      <div className="space-y-6">
        <div className="relative">
          <FormInput
            id="coupon-input"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Kodu buraya yazın"
            className="!text-center !py-6 focus:!border-emerald-500 !text-sm !rounded-3xl"
            autoFocus
          />
        </div>

        <div className="flex gap-3 w-full">
          <Button
            onClick={onClose}
            variant="secondary"
            className="w-16 h-16 shrink-0"
            mode="rectangle"
          >
            <Lucide.ChevronLeft size={24} strokeWidth={3} />
          </Button>
          <Button
            onClick={handleApply}
            variant="action"
            className="flex-1 h-16 !rounded-[24px]"
            showFingerprint={true}
          >
            <Lucide.Check size={28} strokeWidth={4} />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeDiscount && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-50 text-emerald-600 rounded-xl px-4 py-3 text-center border border-emerald-100 flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Aktif İndirim
              </span>
              <span className="text-sm font-bold">
                %{Math.round(activeDiscount.rate * 100)} İNDİRİM UYGULANDI ✓
              </span>
            </motion.div>
          )}

          {discountError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-red-50 text-red-500 rounded-xl px-4 py-3 text-center border border-red-100 flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Geçersiz Kod
              </span>
              <span className="text-xs font-bold">LÜTFEN TEKRAR DENEYİN</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  );
}
