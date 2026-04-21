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

  const announcementConfig = settings.announcementBar ?? { enabled: false, text: '' };
  const toggleAnnouncement = () => {
    updateSetting('announcementBar', { ...announcementConfig, enabled: !announcementConfig.enabled });
  };

  const maintenanceConfig = settings.maintenanceMode ?? { enabled: false, message: '' };
  const toggleMaintenance = () => {
    updateSetting('maintenanceMode', { ...maintenanceConfig, enabled: !maintenanceConfig.enabled });
  };

  // Her seçenek aynı tile stiliyle render edilir
  const allOptions = [
    { key: 'announcement', label: 'Duyuru', icon: '📢', isOn: announcementConfig.enabled, onToggle: toggleAnnouncement },
    { key: 'maintenance', label: 'Bakım Modu', icon: '🛠️', isOn: maintenanceConfig.enabled, onToggle: toggleMaintenance },
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
      <div className={`${theme.container} max-w-[280px] sm:max-w-[448px]`} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-stone-100">
          <div className="flex flex-col">
            <h2 className="text-sm sm:text-[22px] font-black tracking-tight text-stone-900 leading-none">Görünüm Ayarları</h2>
            <p className="text-[9px] sm:text-[14px] text-stone-400 font-bold uppercase tracking-widest mt-1 sm:mt-1.5">Stilini Belirle</p>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-[10px] hover:bg-stone-100 rounded-full transition-colors">
            <div className="w-4 h-4 sm:w-6 sm:h-6 text-stone-400">{globalIcons.close}</div>
          </button>
        </div>

        {/* GRID */}
        <div className="p-3 sm:p-5 grid grid-cols-2 gap-2 sm:gap-3">
          {allOptions.map((option) => (
            <div
              key={option.key}
              onClick={option.onToggle}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer text-center group ${
                option.isOn
                  ? 'border-stone-900 bg-stone-900 text-white shadow-lg scale-[0.98]'
                  : 'border-stone-100 bg-stone-50 text-stone-400 hover:border-stone-200'
              }`}
            >
              <span className={`text-xl sm:text-[32px] transition-all duration-300 ${option.isOn ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'grayscale opacity-70 group-hover:grayscale-0'}`}>
                {option.icon}
              </span>
              <span className="text-[8px] sm:text-[13px] font-black uppercase tracking-tighter mt-1 sm:mt-1.5 leading-none line-clamp-1">
                {option.label}
              </span>
              <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-1.5 sm:mt-2.5 transition-all duration-300 ${option.isOn ? 'bg-white shadow-[0_0_5px_white]' : 'bg-transparent'}`} />
            </div>
          ))}
        </div>
        
        {/* EXCHANGE RATES */}
        <div className="px-5 sm:px-8 pb-4">
          <div className="flex gap-2 sm:gap-3">
            {/* USD Input */}
            <div className="flex-1 bg-stone-50 rounded-2xl p-2.5 sm:p-4 border border-stone-100 focus-within:border-stone-900 transition-all">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <span className="text-[8px] sm:text-[11px] font-black text-stone-400 uppercase tracking-widest">USD Kuru</span>
                <span className="text-[13px] sm:text-[18px]">🇺🇸</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] sm:text-[14px] font-black text-stone-300">₺</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={settings.exchangeRates.usd}
                  onChange={(e) => updateSetting('exchangeRates', { ...settings.exchangeRates, usd: parseFloat(e.target.value) })}
                  className="w-full bg-transparent border-none p-0 text-[14px] sm:text-[20px] font-black text-stone-900 focus:ring-0 outline-none placeholder:text-stone-200"
                />
              </div>
            </div>

            {/* EUR Input */}
            <div className="flex-1 bg-stone-50 rounded-2xl p-2.5 sm:p-4 border border-stone-100 focus-within:border-stone-900 transition-all">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <span className="text-[8px] sm:text-[11px] font-black text-stone-400 uppercase tracking-widest">EUR Kuru</span>
                <span className="text-[13px] sm:text-[18px]">🇪🇺</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] sm:text-[14px] font-black text-stone-300">₺</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={settings.exchangeRates.eur}
                  onChange={(e) => updateSetting('exchangeRates', { ...settings.exchangeRates, eur: parseFloat(e.target.value) })}
                  className="w-full bg-transparent border-none p-0 text-[14px] sm:text-[20px] font-black text-stone-900 focus:ring-0 outline-none placeholder:text-stone-200"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* FOOTER */}
        <div className="p-3 sm:p-5 pt-0 sm:pt-0">
          <Button onClick={onClose} variant="primary" size="md" mode="rectangle" className="w-full !rounded-2xl sm:!py-5 sm:!text-[19px]">
            KAPAT
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DisplaySettingsModal;
