import { memo } from 'react';
import { THEME } from '../data/config';
import { CompanySettings } from '../hooks/useSettings';
import Button from './Button';

interface DisplaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
  updateSetting: <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) => void;
  isInlineEnabled: boolean;
  onToggleInline: () => void;
}

const DisplaySettingsModal = memo(({ isOpen, onClose, settings, updateSetting, isInlineEnabled, onToggleInline }: DisplaySettingsModalProps) => {
  if (!isOpen) return null;

  const config = settings.displayConfig;
  const theme = THEME.addProductModal;
  const globalIcons = THEME.icons;

  const toggleOption = (key: keyof CompanySettings['displayConfig']) => {
    const updatedConfig = { ...config, [key]: !config[key] };
    updateSetting('displayConfig', updatedConfig);
  };

  // Her seçenek aynı tile stiliyle render edilir
  const allOptions = [
    { key: 'inline', label: 'Düzenleme', icon: '✍️', isOn: isInlineEnabled, onToggle: onToggleInline },
    { key: 'showPrice', label: 'Fiyat', icon: '💰', isOn: config.showPrice ?? true, onToggle: () => toggleOption('showPrice') },
    { key: 'showLogo', label: 'Logo', icon: '🖼️', isOn: config.showLogo, onToggle: () => toggleOption('showLogo') },
    { key: 'showSubtitle', label: 'Slogan', icon: '📝', isOn: config.showSubtitle, onToggle: () => toggleOption('showSubtitle') },
    { key: 'showAddress', label: 'Adres', icon: '📍', isOn: config.showAddress, onToggle: () => toggleOption('showAddress') },
    { key: 'showInstagram', label: 'Instagram', icon: '📸', isOn: config.showInstagram, onToggle: () => toggleOption('showInstagram') },
    { key: 'showWhatsapp', label: 'WhatsApp', icon: '💬', isOn: config.showWhatsapp, onToggle: () => toggleOption('showWhatsapp') },
    { key: 'showSearch', label: 'Arama', icon: '🔍', isOn: config.showSearch, onToggle: () => toggleOption('showSearch') },
    { key: 'showCategories', label: 'Kategoriler', icon: '🏷️', isOn: config.showCategories, onToggle: () => toggleOption('showCategories') },
    { key: 'showReferences', label: 'Referanslar', icon: '🤝', isOn: config.showReferences, onToggle: () => toggleOption('showReferences') },
  ];

  return (
    <div className={theme.overlay} onClick={onClose}>
      <div className={`${theme.container} max-w-[280px]`} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex flex-col">
            <h2 className="text-sm font-black tracking-tight text-stone-900 leading-none">Görünüm Ayarları</h2>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Stilini Belirle</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors">
            <div className="w-4 h-4 text-stone-400">{globalIcons.close}</div>
          </button>
        </div>

        {/* GRID */}
        <div className="p-3 grid grid-cols-2 gap-2">
          {allOptions.map((option) => (
            <div
              key={option.key}
              onClick={option.onToggle}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center group ${
                option.isOn
                  ? 'border-stone-900 bg-stone-900 text-white shadow-lg scale-[0.98]'
                  : 'border-stone-100 bg-stone-50 text-stone-400 hover:border-stone-200'
              }`}
            >
              <span className={`text-xl transition-all duration-300 ${option.isOn ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'grayscale opacity-70 group-hover:grayscale-0'}`}>
                {option.icon}
              </span>
              <span className="text-[8px] font-black uppercase tracking-tighter mt-1 leading-none line-clamp-1">
                {option.label}
              </span>
              <div className={`w-1 h-1 rounded-full mt-1.5 transition-all duration-300 ${option.isOn ? 'bg-white shadow-[0_0_5px_white]' : 'bg-transparent'}`} />
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-3 pt-0">
          <Button onClick={onClose} variant="primary" size="md" mode="rectangle" className="w-full !rounded-2xl">
            KAPAT
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DisplaySettingsModal;
