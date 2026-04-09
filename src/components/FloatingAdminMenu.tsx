import React, { useState } from 'react';
import { LABELS } from '../data/config';
import { CompanySettings } from '../hooks/useSettings';

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

  const promptUpdate = (key: keyof CompanySettings, title: string, currentValue: string) => {
    const newVal = window.prompt(`${title} için yeni değer girin:`, currentValue);
    if (newVal !== null && newVal.trim() !== '') {
      updateSetting(key, newVal.trim());
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      
      {/* Expanded Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <button onClick={() => promptUpdate('title', 'Marka Adı', settings.title)} className="w-10 h-10 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all group relative" title="Başlık">
            <span className="text-lg">🏷️</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Başlık</span>
          </button>
          
          <button onClick={() => promptUpdate('subtitle', 'Alt Başlık', settings.subtitle)} className="w-10 h-10 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all group relative" title="Alt Başlık">
            <span className="text-lg">👤</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Alt Başlık</span>
          </button>

          <button onClick={() => promptUpdate('whatsapp', 'WhatsApp Numarası', settings.whatsapp)} className="w-10 h-10 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all group relative" title="WhatsApp">
            <span className="text-lg">💬</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">WhatsApp</span>
          </button>

          <button onClick={() => promptUpdate('instagram', 'Instagram Linki', settings.instagram)} className="w-10 h-10 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all group relative" title="Instagram">
            <span className="text-lg">📸</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Instagram</span>
          </button>

          <button onClick={() => promptUpdate('address', 'Firma Adresi', settings.address)} className="w-10 h-10 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all group relative" title="Adres">
            <span className="text-lg">📍</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Adres</span>
          </button>
          
          <button onClick={() => promptUpdate('logoEmoji', 'Logo Emojisi', settings.logoEmoji)} className="w-10 h-10 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all group relative" title="Logo Emojisi">
            <span className="text-lg">✨</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Logo Emojisi</span>
          </button>

          <div className="w-6 h-px bg-stone-200 my-1"></div>

          <button onClick={() => { onAddClick(); setIsOpen(false); }} className="w-10 h-10 bg-stone-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-stone-800 active:scale-90 transition-all group relative" title="Yeni Ürün">
            <span className="text-xl font-light">+</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{LABELS.newProductBtn}</span>
          </button>

          <button onClick={() => { toggleSelectMode(); setIsOpen(false); }} className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all group relative ${isSelectMode ? 'bg-kraft-600 text-white' : 'bg-white border border-stone-200 hover:bg-stone-50'}`} title="Seç (Çoklu)">
            <span className="text-lg">{isSelectMode ? '✕' : '✅'}</span>
            <span className="absolute right-12 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{isSelectMode ? 'Seçimi Kapat' : 'Çoklu Seç'}</span>
          </button>
        </div>
      )}

      {/* Bottom Controls (Hamburger + Logout) */}
      <div className="flex gap-3">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="bg-stone-100 text-stone-900 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center border-2 border-stone-300 hover:border-stone-500 active:scale-90 transition-all group relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Admin Araçları</span>
        </button>

        <button 
          onClick={onLogout} 
          className="bg-stone-900 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20 active:scale-90 transition-all group relative"
        >
          <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {LABELS.adminCloseBtn}
          </span>
          🚪
        </button>
      </div>

    </div>
  );
}
