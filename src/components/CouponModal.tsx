import { useState, useCallback, useEffect } from 'react';
import Button from './Button';
import BaseModal from './BaseModal';
import * as Lucide from 'lucide-react';
import FormInput from './FormInput';
import { CouponModalProps } from '../types';
import { useGlobalFeedback } from '../hooks/useGlobalFeedback';

/**
 * COUPON MODAL (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Handles discount code entry. Feedback is now handled via
 * global StatusOverlay for a cleaner cinematic experience.
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
  const { showFeedback } = useGlobalFeedback();

  const handleApply = useCallback(() => {
    if (couponCode.trim()) {
      onApplyDiscount(couponCode.trim().toUpperCase());
    }
  }, [couponCode, onApplyDiscount]);

  // Sync Global Feedback with Store State
  useEffect(() => {
    if (isOpen && activeDiscount) {
      showFeedback('success', `İNDİRİM UYGULANDI: %${Math.round(activeDiscount.rate * 100)}`);
      onClose();
    }
    if (isOpen && discountError) {
      showFeedback('error', discountError);
    }
  }, [activeDiscount, discountError, isOpen, showFeedback, onClose]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleApply();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      isStatic={isStatic}
      title="İNDİRİM KUPONU"
    >
      <div className="space-y-6 py-2">
        <div className="relative">
          <FormInput
            id="coupon-input"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Kodu buraya yazın"
            className="!text-center !py-6 focus:!border-emerald-500 !text-sm !rounded-3xl shadow-inner"
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
            <span className="font-black tracking-[0.2em] text-[15px] uppercase">UYGULA</span>
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
