import { useState } from 'react';
import { LABELS, DEFAULT_COMPANY } from '../data/config';
import { CompanySettings } from '../hooks/useSettings';
import FloatingButton from './FloatingButton';

interface FloatingAdminMenuProps {
  settings: CompanySettings;
  updateSetting: (key: keyof CompanySettings, value: string) => void;
  onAddClick: () => void;
  isSelectMode: boolean;
  toggleSelectMode: () => void;
  onLogout: () => void;
}

export default function FloatingAdminMenu({
  settings, updateSetting, onAddClick, isSelectMode, toggleSelectMode, onLogout
}: FloatingAdminMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const promptUpdate = (key: keyof CompanySettings, title: string, currentValue: string) => {
    const newVal = window.prompt(`${title} için yeni değer girin:`, currentValue);
    if (newVal !== null && newVal.trim() !== '') {
      updateSetting(key, newVal.trim());
    }
    // Ayar yapıldıktan sonra menüleri kapatabiliriz veya açık bırakabiliriz.
    // Kullanıcı deneyimi için sadece ayar grubunu kapatalım.
    setShowSettings(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-3">
      
      {/* 1. SEVİYE: HAMBURGER AÇILINCA ÇIKANLAR */}
      {isOpen && (
        <div className="flex flex-col items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
          
          {/* 2. SEVİYE: AYARLAR BUTONUNA BASINCA ÇIKANLAR */}
          {showSettings && (
            <div className="flex flex-col items-center gap-2 mb-2 p-2 bg-stone-100/50 backdrop-blur-sm rounded-3xl border border-stone-200 animate-in zoom-in-95 duration-150">
              <FloatingButton onClick={() => promptUpdate('title', 'Marka Adı', settings.title)} icon="🏷️" label="Başlık" className="w-10 h-10 text-base" />
              <FloatingButton onClick={() => promptUpdate('subtitle', 'Alt Başlık', settings.subtitle)} icon="👤" label="Alt Başlık" className="w-10 h-10 text-base" />
              <FloatingButton onClick={() => promptUpdate('whatsapp', 'WhatsApp', settings.whatsapp)} icon="💬" label="WhatsApp" variant="success" className="w-10 h-10 text-base" />
              <FloatingButton onClick={() => promptUpdate('instagram', 'Instagram', settings.instagram)} icon="📸" label="Instagram" className="w-10 h-10 text-base" />
              <FloatingButton onClick={() => promptUpdate('address', 'Firma Adresi', settings.address)} icon="📍" label="Adres" className="w-10 h-10 text-base" />
              <FloatingButton onClick={() => promptUpdate('logoEmoji', 'Logo', settings.logoEmoji || DEFAULT_COMPANY.logoEmoji)} icon="✨" label="Logo Emojisi" className="w-10 h-10 text-base" />
            </div>
          )}

          {/* ANA İŞLEMLER */}
          <FloatingButton 
            onClick={() => setShowSettings(!showSettings)} 
            icon={showSettings ? '✕' : '⚙️'} 
            label="Site Ayarları" 
            variant={showSettings ? 'kraft' : 'secondary'} 
          />
          
          <FloatingButton onClick={() => { onAddClick(); setIsOpen(false); }} icon="+" label={LABELS.newProductBtn} variant="primary" />
          
          <FloatingButton 
            onClick={() => { toggleSelectMode(); setIsOpen(false); }} 
            icon={isSelectMode ? '✕' : '✅'} 
            label={isSelectMode ? 'Seçimi Kapat' : 'Çoklu Seç'} 
            variant={isSelectMode ? 'kraft' : 'secondary'} 
          />
        </div>
      )}

      {/* ANA KONTROLLER (DİKEY DİZİLİM) */}
      <div className="flex flex-col gap-3">
        {/* HAMBURGER BUTONU (Üstte) */}
        <FloatingButton 
          onClick={() => { setIsOpen(!isOpen); if(isOpen) setShowSettings(false); }} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          }
          label="Admin Araçları"
          variant="secondary"
          className="border-stone-300"
        />

        {/* ÇIKIŞ BUTONU (En Altta) */}
        <FloatingButton 
          onClick={onLogout} 
          icon="🚪" 
          label={LABELS.adminCloseBtn} 
          variant="primary" 
        />
      </div>

    </div>
  );
}
