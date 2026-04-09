import React from 'react';
import { LABELS } from '../data/config';
import { CompanySettings } from '../hooks/useSettings';

interface AdminToolbarProps {
  settings: CompanySettings;
  updateSetting: (key: keyof CompanySettings, value: string) => void;
  onAddClick: () => void;
  isSelectMode: boolean;
  toggleSelectMode: () => void;
}

export default function AdminToolbar({
  settings,
  updateSetting,
  onAddClick,
  isSelectMode,
  toggleSelectMode,
}: AdminToolbarProps) {
  const promptUpdate = (key: keyof CompanySettings, title: string, currentValue: string) => {
    const newVal = window.prompt(`${title} için yeni değer girin:`, currentValue);
    if (newVal !== null && newVal.trim() !== '') {
      updateSetting(key, newVal.trim());
    }
  };

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 py-3 overflow-x-auto no-scrollbar shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 min-w-max">
        
        {/* Ayarlar Butonları */}
        <button onClick={() => promptUpdate('title', 'Marka Adı', settings.title)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-full text-[11px] font-bold text-stone-700 hover:bg-amber-100 hover:border-amber-400 transition-all shadow-sm">
          🏷️ Başlık
        </button>
        <button onClick={() => promptUpdate('subtitle', 'Alt Başlık', settings.subtitle)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-full text-[11px] font-bold text-stone-700 hover:bg-amber-100 hover:border-amber-400 transition-all shadow-sm">
          👤 Alt Başlık
        </button>
        <button onClick={() => promptUpdate('whatsapp', 'WhatsApp Numarası', settings.whatsapp)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-full text-[11px] font-bold text-green-700 hover:bg-green-50 hover:border-green-400 transition-all shadow-sm">
          💬 WhatsApp
        </button>
        <button onClick={() => promptUpdate('instagram', 'Instagram Linki', settings.instagram)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-full text-[11px] font-bold text-pink-700 hover:bg-pink-50 hover:border-pink-400 transition-all shadow-sm">
          📸 Instagram
        </button>
        <button onClick={() => promptUpdate('address', 'Firma Adresi', settings.address)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-full text-[11px] font-bold text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm">
          📍 Adres
        </button>

        <div className="w-px h-6 bg-amber-300 mx-1"></div>

        {/* Eylem Butonları */}
        <button onClick={onAddClick} className="flex items-center gap-1.5 px-4 py-1.5 bg-stone-900 text-white rounded-full text-[11px] font-bold hover:bg-stone-800 transition-all shadow-md active:scale-95">
          + {LABELS.newProductBtn}
        </button>
        
        <button 
          onClick={toggleSelectMode} 
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shadow-md active:scale-95 ${
            isSelectMode ? 'bg-kraft-600 text-white border-kraft-700' : 'bg-white border border-amber-300 text-stone-800 hover:bg-amber-100'
          }`}
        >
          {isSelectMode ? 'Seçim Modu Kapat' : '✅ Seç (Çoklu)'}
        </button>

      </div>
    </div>
  );
}
