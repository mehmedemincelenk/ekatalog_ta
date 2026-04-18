import { memo } from 'react';
import { THEME, DEFAULT_COMPANY } from '../../../data/config';
import { CompanySettings } from '../../../hooks/store/useSettings';
import ImageActionWrapper from '../../admin/ImageActionWrapper';
import { useAsyncAction } from '../../../hooks/ui/useAsyncAction';
import { formatWhatsAppUrl, cleanSocialHandle } from '../../../utils/formatters/contact';
import { EditableField } from '../../ui/EditableField';

interface NavbarProps {
  logoGestureActions: any;
  isAdmin: boolean;
  editMode: 'modal' | 'inline';
  settings: CompanySettings;
  onUpdateSetting: (key: keyof CompanySettings, value: any) => Promise<void>;
  onLogoUpdate?: (file: File) => Promise<void>;
  openEditor: (title: string, value: string, onConfirm: (val: string) => Promise<void>) => void;
}

/**
 * BRAND SECTION (Left Side)
 */
const NavBrand = memo(({ settings, isAdmin, editMode, isLogoUploading, onLogoSelect, logoGestureActions, onUpdate, openEditor }: any) => {
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
      
      <div className={`${theme.textWrapper} relative z-10`}>
        <div className="flex items-center">
          <EditableField 
            value={settings.name}
            title="Mağaza Adı"
            isAdmin={isAdmin}
            editMode={editMode}
            openModal={openEditor}
            onConfirm={(val) => onUpdate('name', val)}
            className={theme.name}
          />
          {isAdmin && <span className="ml-1 text-[8px] bg-amber-400 text-white px-1 rounded font-black uppercase">Düzenle</span>}
        </div>
        <EditableField 
          value={settings.subtitle}
          title="Slogan"
          isAdmin={isAdmin}
          editMode={editMode}
          openModal={openEditor}
          onConfirm={(val) => onUpdate('subtitle', val)}
          className={theme.tagline}
        />
      </div>
    </div>
  );
});

/**
 * CONTACT ACTIONS (Right Side)
 */
const NavActions = memo(({ settings, isAdmin, editMode, onUpdate, openEditor }: any) => {
  const theme = THEME.navbar.contact;
  const instagramUrl = `https://instagram.com/${settings.instagram.replace('@', '').replace('https://instagram.com/', '')}`;
  const whatsappUrl = formatWhatsAppUrl(settings.whatsapp);

  return (
    <div className="flex flex-col items-end gap-1.5 shrink-0 relative z-10">
      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <a 
          href={isAdmin ? undefined : whatsappUrl} 
          target="_blank" rel="noreferrer" 
          className={`${theme.whatsapp} ${isAdmin && editMode === 'modal' ? 'cursor-pointer' : ''}`}
        >
          <div className={theme.whatsappIconSize}>{THEME.icons.whatsapp}</div>
          <EditableField 
            value={settings.whatsapp}
            title="WhatsApp Numarası"
            isAdmin={isAdmin}
            editMode={editMode}
            openModal={openEditor}
            onConfirm={(val) => onUpdate('whatsapp', val)}
            className={theme.phoneText}
          />
        </a>

        {/* Instagram */}
        <div className={`${theme.instagram} ${isAdmin ? 'bg-amber-50 border border-amber-200 p-1.5 rounded-lg' : ''}`}>
          <div className={`${theme.instagramIconSize} cursor-pointer`} onClick={() => !isAdmin && window.open(instagramUrl, '_blank')}>
            <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.947-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.948 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.948.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          {isAdmin && (
            <EditableField 
              value={settings.instagram}
              title="Instagram Kullanıcı Adı"
              isAdmin={isAdmin}
              editMode={editMode}
              openModal={openEditor}
              onConfirm={(val) => onUpdate('instagram', cleanSocialHandle(val))}
              className="hidden" // Just for the editing trigger if needed
            />
          )}
        </div>
      </div>

      <EditableField 
        value={settings.address}
        title="Mağaza Adresi"
        isAdmin={isAdmin}
        editMode={editMode}
        openModal={openEditor}
        onConfirm={(val) => onUpdate('address', val)}
        className={`${theme.address} !block`}
      />
    </div>
  );
});

/**
 * MAIN NAVBAR COMPONENT
 */
const Navbar = memo(({ logoGestureActions, isAdmin, editMode, settings, onLogoUpdate, onUpdateSetting, openEditor }: NavbarProps) => {
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
            editMode={editMode}
            isLogoUploading={isLogoUploading}
            onLogoSelect={handleLogoSelect}
            logoGestureActions={logoGestureActions}
            onUpdate={onUpdateSetting}
            openEditor={openEditor}
          />
          <NavActions 
            settings={settings}
            isAdmin={isAdmin} 
            editMode={editMode}
            onUpdate={onUpdateSetting}
            openEditor={openEditor}
          />
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
