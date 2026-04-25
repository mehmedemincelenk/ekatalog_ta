import BaseFloatingMenu, { FloatingAction } from './BaseFloatingMenu';
import { useStore } from '../store';
import { FloatingAdminMenuProps } from '../types';
import { THEME } from '../data/config';

/**
 * FLOATING ADMIN MENU COMPONENT
 * -----------------------------------------------------------
 * Specialized AssistiveTouch hub for store owners.
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
    {
      id: 'currency',
      icon: (
        <div className="w-6 h-6 sm:w-9 sm:h-9 flex flex-col items-center justify-center leading-none bg-stone-900 text-white rounded-md">
          <span className="text-[12px] sm:text-[18px] font-black">
            {activeCurrency === 'TRY' ? '₺' : activeCurrency === 'USD' ? '$' : '€'}
          </span>
          <span className="text-[5px] sm:text-[7px] font-bold uppercase tracking-tighter opacity-70 -mt-0.5">
            {activeCurrency}
          </span>
        </div>
      ),
      action: onCurrencyToggle,
      label: 'PARA BİRİMİ',
      className: 'bg-white text-stone-900 border-2 border-stone-100',
    },
    ...(onBulkUpdateTrigger
      ? [
          {
            id: 'bulk',
            icon: <div className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center">{globalIcons.bulkPrice}</div>,
            action: onBulkUpdateTrigger,
            label: 'TOPLU İŞLEM',
            className: 'bg-white text-stone-900 border-2 border-stone-100',
          },
        ]
      : []),
    {
      id: 'add',
      icon: <div className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center">{globalIcons.plus}</div>,
      action: onProductAddTrigger,
      label: '', 
      primary: true,
    },
    {
      id: 'settings',
      icon: <div className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center">{globalIcons.settings}</div>,
      action: onSettingsTrigger,
      label: '', 
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
