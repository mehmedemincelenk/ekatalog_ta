import { create } from 'zustand';
import { CompanySettings, StoreState } from './types';

/**
 * STORE.TS (DÜKKANIN ORTAK AKLI)
 * ----------------------------
 * Dükkanın tüm global durumlarını (admin modu, ayarlar vb.)
 * merkezi bir yerden yöneten akıllı pano.
 */

export const useStore = create<StoreState>((set) => ({
  // Admin Modu (Varsayılan kapalı)
  isAdmin: false,
  setIsAdmin: (status: boolean) => set({ isAdmin: status }),

  // Dükkan Ayarları
  settings: null,
  setSettings: (settings: CompanySettings) => set({ settings }),
  updateSetting: <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) =>
    set((state: StoreState) => ({
      settings: state.settings
        ? ({ ...state.settings, [key]: value } as CompanySettings)
        : null,
    })),

  // Katalog UI Kontrolleri
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  activeCategories: [],
  toggleCategory: (category: string) =>
    set((state: StoreState) => ({
      activeCategories: state.activeCategories.includes(category)
        ? state.activeCategories.filter((c: string) => c !== category)
        : [...state.activeCategories, category],
    })),
  clearCategories: () => set({ activeCategories: [] }),

  visitorCurrency:
    (localStorage.getItem('ekatalog_visitor_currency') as
      | 'TRY'
      | 'USD'
      | 'EUR') || 'TRY',
  toggleVisitorCurrency: () =>
    set((state: StoreState) => {
      const cycle: Record<string, 'TRY' | 'USD' | 'EUR'> = {
        TRY: 'USD',
        USD: 'EUR',
        EUR: 'TRY',
      };
      const next = cycle[state.visitorCurrency] || 'TRY';
      localStorage.setItem('ekatalog_visitor_currency', next);
      return { visitorCurrency: next };
    }),

  // Promosyonlar
  activeDiscount: null,
  setActiveDiscount: (discount: { code: string; rate: number; category?: string } | null) =>
    set({ activeDiscount: discount }),

  // UI / Modal Management
  activeModal: null,
  modalData: null,
  openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
