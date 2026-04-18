import { useState, useCallback, memo } from 'react';
import { THEME, LABELS } from '../../../../data/config';
import { ActiveDiscount } from '../../../../hooks/catalog/useDiscount';

interface CouponSectionProps {
  activeDiscount?: ActiveDiscount | null;
  onApplyDiscount: (code: string) => void;
  discountError?: string | null;
}

/**
 * COUPON SECTION
 */
export const CouponSection = memo(({ 
  activeDiscount, 
  onApplyDiscount, 
  discountError 
}: CouponSectionProps) => {
  const [couponCode, setCouponCode] = useState('');
  const theme = THEME.footer.coupons;

  const handleApply = useCallback(() => {
    onApplyDiscount(couponCode);
  }, [couponCode, onApplyDiscount]);

  return (
    <div className={theme.wrapper}>
      <span className={theme.label}>İNDİRİM KUPONU</span>
      <div className={theme.inputWrapper}>
        <input 
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder={LABELS.couponPlaceholder}
          className={theme.input}
        />
        <button 
          onClick={handleApply}
          className={theme.button}
          aria-label="Apply Coupon"
        >
          {THEME.icons.plus}
        </button>
      </div>
      
      {activeDiscount && (
        <div className={`${theme.statusWrapper} ${theme.successText}`}>
          <span className={theme.statusText}>
            {typeof LABELS.discountApplied === 'function' ? LABELS.discountApplied(activeDiscount.rate) : LABELS.discountApplied}
          </span>
        </div>
      )}
      
      {discountError && (
        <div className={`${theme.statusWrapper} ${theme.errorText}`}>
          <span className={theme.statusText}>{discountError}</span>
        </div>
      )}
    </div>
  );
});
