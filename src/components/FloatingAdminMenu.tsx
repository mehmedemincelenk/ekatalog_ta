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
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[17px] font-black">
            {activeCurrency === 'TRY' ? '₺' : activeCurrency === 'USD' ? '$' : '€'}
          </span>
          <span className="text-[7px] font-bold uppercase tracking-tighter opacity-50 -mt-0.5">
            {activeCurrency}
          </span>
        </div>
      ),
      action: onCurrencyToggle,
      label: 'Para Birimi',
      className: 'border-2 border-stone-900 text-stone-900 bg-white',
    },
    {
      id: 'add',
      icon: globalIcons.plus,
      action: onProductAddTrigger,
      label: 'Ürün Ekle',
      primary: true,
    },
    ...(onBulkUpdateTrigger
      ? [
          {
            id: 'bulk',
            icon: globalIcons.bulkPrice,
            action: onBulkUpdateTrigger,
            label: 'Toplu Fiyat',
          },
        ]
      : []),
    {
      id: 'settings',
      icon: globalIcons.settings,
      action: onSettingsTrigger,
      label: 'Ayarlar',
    },
  ];

  return (
    <BaseFloatingMenu 
      actions={adminActions} 
      autoCloseDelay={3000} // Admin needs shorter delay
      mainIcon={globalIcons.adminLayout}
    />
  );
}
