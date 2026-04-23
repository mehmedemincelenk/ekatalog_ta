import BaseFloatingMenu, { FloatingAction } from './BaseFloatingMenu';
import { useStore } from '../store';
import { FloatingGuestMenuProps } from '../types';
import {
  Phone,
  FileSpreadsheet,
  Ticket,
  Search,
  QrCode,
} from 'lucide-react';

/**
 * FLOATING GUEST MENU COMPONENT
 * -----------------------------------------------------------
 * Specialized AssistiveTouch hub for store visitors.
 */
export default function FloatingGuestMenu({
  onCouponClick,
  onExcelClick,
  onSearchClick,
  onQRClick,
}: FloatingGuestMenuProps) {
  const {
    visitorCurrency: activeCurrency,
    toggleVisitorCurrency: onCurrencyToggle,
    settings,
  } = useStore();

  const whatsappNumber = settings?.whatsapp || '';

  const handleCall = () => {
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };

  const guestActions: FloatingAction[] = [
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
      className: 'border-2 border-stone-100 text-stone-900 bg-white',
    },
    {
      id: 'qr',
      icon: <QrCode className="w-full h-full p-1" strokeWidth={2.5} />,
      action: onQRClick,
      label: 'Dükkan QR',
      className: 'bg-white text-stone-900 border-2 border-stone-100 hover:bg-stone-50',
    },
    {
      id: 'call',
      icon: <Phone className="w-full h-full p-1" strokeWidth={2.5} />,
      action: handleCall,
      label: 'Bizi Arayın',
      className: 'bg-white text-stone-900 border-2 border-stone-100 hover:bg-stone-50',
    },
    {
      id: 'excel',
      icon: <FileSpreadsheet className="w-full h-full p-1" strokeWidth={2.5} />,
      action: onExcelClick,
      label: 'Fiyat Listesi',
      className: 'bg-white text-stone-900 border-2 border-stone-100 hover:bg-stone-50',
    },
    {
      id: 'coupon',
      icon: <Ticket className="w-full h-full p-0.5" strokeWidth={2.5} />,
      action: onCouponClick,
      label: 'Kupon Gir',
      className: 'bg-white text-stone-900 border-2 border-stone-100 hover:bg-stone-50',
    },
    {
      id: 'search',
      icon: <Search className="w-full h-full p-1" strokeWidth={2.5} />,
      action: onSearchClick,
      label: 'Ürün Ara',
      className: 'bg-white text-stone-900 border-2 border-stone-100 hover:bg-stone-50',
    },
  ];

  return (
    <BaseFloatingMenu 
      actions={guestActions} 
      autoCloseDelay={5000} 
    />
  );
}
