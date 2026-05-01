import BaseFloatingMenu, { FloatingAction } from './BaseFloatingMenu';
import { useStore } from '../store';
import { FloatingAdminMenuProps } from '../types';
import { THEME } from '../data/config';

import * as Lucide from 'lucide-react';

/**
 * FLOATING ADMIN MENU COMPONENT
 * -----------------------------------------------------------
 * Specialized AssistiveTouch hub for store owners.
 * Refined layout: 2x2 grid with spanning top action.
 */
export default function FloatingAdminMenu({
  onProductAddTrigger,
  onBulkUpdateTrigger,
  onSettingsTrigger,
}: FloatingAdminMenuProps) {
  const { settings, updateSetting } = useStore();
  const globalIcons = THEME.icons;

  if (!settings) return null;

  const activeCurrency = settings.activeCurrency;

  const onCurrencyToggle = () => {
    const cycle: Record<string, typeof activeCurrency> = {
      TRY: 'USD',
      USD: 'EUR',
      EUR: 'TRY',
    };
    const next = cycle[activeCurrency] || 'TRY';
    updateSetting('activeCurrency', next);
  };

  const adminActions: FloatingAction[] = [
    // TOP ROW: SPANNING ACTION
    ...(onBulkUpdateTrigger
      ? [
          {
            id: 'bulk',
            icon: <div className="w-6 h-6 flex items-center justify-center">{globalIcons.bulkPrice}</div>,
            action: onBulkUpdateTrigger,
            label: 'TOPLU İŞLEM',
            className: 'bg-stone-900 text-white w-full !col-span-2 !rounded-2xl mb-1',
            primary: true
          },
        ]
      : []),
    
    // BOTTOM ROW: 2x2 GRID ITEMS
    {
      id: 'notifications',
      icon: <div className="w-6 h-6 flex items-center justify-center"><Lucide.Bell size={24} /></div>,
      action: () => useStore.getState().openModal('NOTIFICATIONS'),
      label: 'BİLDİRİMLER', 
      className: 'bg-white text-stone-900 border-2 border-stone-100',
    },
    {
      id: 'currency',
      icon: (
        <div className="w-6 h-6 flex flex-col items-center justify-center leading-none">
          <span className="text-[12px] font-black">
            {activeCurrency === 'TRY' ? '₺' : activeCurrency === 'USD' ? '$' : '€'}
          </span>
          <span className="text-[5px] font-bold uppercase tracking-tighter opacity-70 -mt-0.5">
            {activeCurrency}
          </span>
        </div>
      ),
      action: onCurrencyToggle,
      label: 'PARA BİRİMİ',
      className: 'bg-white text-stone-900 border-2 border-stone-100',
    },

    // CENTER PRIMARY ACTIONS (FAB STYLE)
    {
      id: 'add',
      icon: <div className="w-6 h-6 flex items-center justify-center">{globalIcons.plus}</div>,
      action: onProductAddTrigger,
      label: '', 
      primary: true,
    },
    {
      id: 'social',
      icon: <div className="w-6 h-6 flex items-center justify-center"><Lucide.Share2 size={24} /></div>,
      action: () => useStore.getState().openModal('SOCIAL_EXPORT'),
      label: 'SOSYAL',
      className: 'bg-white text-stone-900 border-2 border-stone-100',
    },
    {
      id: 'settings',
      icon: <div className="w-6 h-6 flex items-center justify-center">{globalIcons.settings}</div>,
      action: onSettingsTrigger,
      label: 'AYARLAR', 
      className: 'bg-white text-stone-900 border-2 border-stone-100',
    },
  ];

  return (
    <BaseFloatingMenu 
      actions={adminActions} 
      autoCloseDelay={5000}
      mainIcon={globalIcons.settings}
      labelText="AYARLAR"
    />
  );
}
