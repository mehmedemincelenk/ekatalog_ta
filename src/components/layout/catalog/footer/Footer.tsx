import { memo } from 'react';
import { THEME } from '../../../../data/config';
import { ActiveDiscount } from '../../../../hooks/catalog/useDiscount';
import { CompanySettings } from '../../../../hooks/store/useSettings';
import { WhatsAppCTA } from './WhatsAppCTA';
import { MobileQuickBuy } from './MobileQuickBuy';
import { CouponSection } from './CouponSection';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onLogoClick: () => void;
  isAdmin: boolean;
  activeDiscount?: ActiveDiscount | null;
  onApplyDiscount: (code: string) => void;
  discountError?: string | null;
  settings: CompanySettings;
}

/**
 * CATALOG FOOTER COMPONENT
 * -----------------------------------------------------------
 * Moved to layout/catalog/footer for better feature isolation.
 */
const Footer = memo(({ 
  onLogoClick, 
  isAdmin, 
  activeDiscount, 
  onApplyDiscount, 
  discountError, 
  settings 
}: FooterProps) => {
  const footerTheme = THEME.footer;

  return (
    <footer className={footerTheme.layout}>
      <div className={footerTheme.container}>
        <div className={footerTheme.grid}>
          
          {/* 1. COUPON SECTION (User Only) */}
          {!isAdmin && (
            <CouponSection 
              activeDiscount={activeDiscount}
              onApplyDiscount={onApplyDiscount}
              discountError={discountError}
            />
          )}

          {/* 2. CONTACT & SOCIAL INFO */}
          <SocialLinks settings={settings} />

        </div>
      </div>

      {/* 3. COPYRIGHT BAR */}
      <div onClick={onLogoClick} className={footerTheme.bottomBar.layout}>
        <p className={footerTheme.bottomBar.text}>
          ekatalog.site © 2026 — <span className="text-red-600">#</span>MİLLİTEKNOLOJİHAMLESİ
        </p>
      </div>

      {/* 4. FLOATING WHATSAPP CTA (User Only) */}
      {!isAdmin && <WhatsAppCTA whatsapp={settings.whatsapp} />}

      {/* 5. MOBILE QUICK BUY BAR (User Only) */}
      {!isAdmin && <MobileQuickBuy name={settings.name} whatsapp={settings.whatsapp} />}
    </footer>
  );
});

export default Footer;
