import { useState, useCallback, useMemo } from 'react';
import { THEME, LABELS } from '../data/config';
import { ActiveDiscount } from '../hooks/useDiscount';
import { CompanySettings } from '../hooks/useSettings';

interface FooterProps {
  onLogoClick: () => void;
  onQRClick?: () => void;
  isAdmin: boolean;
  activeDiscount?: ActiveDiscount | null;
  onApplyDiscount?: (code: string) => void;
  discountError?: string | null;
  onDeleteAll?: () => void;
  settings: CompanySettings;
}

export default function Footer({ isAdmin, activeDiscount, onApplyDiscount, discountError, settings }: FooterProps) {
  const [couponCodeInput, setCouponCodeInput] = useState('');

  const footerTheme = THEME.footer;

  const handlePromotionApply = useCallback(() => {
    if (onApplyDiscount && couponCodeInput.trim()) {
      onApplyDiscount(couponCodeInput.trim().toUpperCase());
    }
  }, [onApplyDiscount, couponCodeInput]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePromotionApply();
  };

  const couponStatus = useMemo(() => {
    if (activeDiscount) return 'success';
    if (discountError) return 'error';
    return 'default';
  }, [activeDiscount, discountError]);

  return (
    <footer className={footerTheme.layout}>
      <div className={footerTheme.container}>
        <div className={footerTheme.grid}>
          {/* CONTENT REMOVED - Clean design */}
        </div>

        {/* MIDDLE BRANDING SECTION */}
        <div className="mt-8 mb-4 flex flex-col items-center gap-2">
          <div className="h-[1px] w-12 bg-stone-200 mb-2"></div>
          <p className="text-[10px] font-black text-stone-900 uppercase tracking-[0.3em] select-none">
            ekatalog | {settings?.title || 'Dijital Kart'}
          </p>
          <p className="text-[9px] font-bold text-stone-400 tracking-tighter uppercase">
            Tüm hakları saklıdır. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
