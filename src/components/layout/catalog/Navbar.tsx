import { memo } from 'react';
import { THEME, DEFAULT_COMPANY } from '../../../data/config';
import { CompanySettings } from '../../../hooks/store/useSettings';
import ImageActionWrapper from '../../admin/ImageActionWrapper';
import { useAsyncAction } from '../../../hooks/ui/useAsyncAction';

interface NavbarProps {
  logoGestureActions: any;
  onLogout: () => void;
  isAdmin: boolean;
  settings: CompanySettings;
  onLogoUpdate?: (file: File) => Promise<void>;
}

/**
 * BRAND SECTION COMPONENT
 */
const NavBrand = memo(({ settings, isAdmin, isLogoUploading, onLogoSelect, logoGestureActions }: any) => {
  const theme = THEME.navbar.brand;
  
  const renderLogo = () => {
    const isImage = settings.logoEmoji && (settings.logoEmoji.startsWith('http') || settings.logoEmoji.startsWith('data:'));
    if (isImage) return <img src={settings.logoEmoji} alt={settings.name} className={theme.logoImg} />;
    return <span className={theme.logoEmoji}>{settings.logoEmoji || DEFAULT_COMPANY.logoEmoji}</span>;
  };

  return (
    <div className={theme.wrapper}>
      <div className={theme.logoWrapper} {...logoGestureActions}>
        <ImageActionWrapper
          isAdmin={isAdmin}
          isUploading={isLogoUploading}
          onFileSelect={onLogoSelect}
          className="w-9 h-9 sm:w-10 sm:h-10"
        >
          {renderLogo()}
        </ImageActionWrapper>
      </div>
      
      <div className={theme.textWrapper}>
        <div className="flex items-center">
          <span className={theme.name}>{settings.name}</span>
          {isAdmin && <span className={theme.adminBadge}>Yönetici</span>}
        </div>
        <span className={theme.tagline}>{settings.subtitle}</span>
      </div>
    </div>
  );
});

/**
 * NAV ACTIONS COMPONENT
 */
const NavActions = memo(({ isAdmin, onLogout, address }: any) => {
  const theme = THEME.navbar.contact;

  if (isAdmin) {
    return (
      <button 
        onClick={onLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-sm"
      >
        <div className="w-3 h-3">{THEME.icons.power}</div>
        <span>Çıkış Yap</span>
      </button>
    );
  }

  return (
    <a 
      href={`${theme.mapUrlBase}${encodeURIComponent(address)}`}
      target="_blank" 
      rel="noreferrer"
      className="text-[10px] sm:text-xs text-stone-400 hover:text-stone-900 transition-colors font-medium text-right leading-tight max-w-[120px] sm:max-w-none truncate"
    >
      {address}
    </a>
  );
});

/**
 * MAIN NAVBAR COMPONENT
 * -----------------------------------------------------------
 * Moved to layout/catalog/Navbar.tsx for better feature isolation.
 */
const Navbar = memo(({ logoGestureActions, onLogout, isAdmin, settings, onLogoUpdate }: NavbarProps) => {
  const theme = THEME.navbar;

  const { execute: handleLogoSelect, isLoading: isLogoUploading } = useAsyncAction(
    async (file: File) => {
      if (onLogoUpdate) await onLogoUpdate(file);
    }
  );

  return (
    <nav className={theme.layout}>
      <div className={theme.container}>
        <div className={theme.innerWrapper}>
          <NavBrand 
            settings={settings} 
            isAdmin={isAdmin} 
            isLogoUploading={isLogoUploading}
            onLogoSelect={handleLogoSelect}
            logoGestureActions={logoGestureActions}
          />
          <NavActions 
            isAdmin={isAdmin} 
            onLogout={onLogout} 
            address={settings.address} 
          />
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
