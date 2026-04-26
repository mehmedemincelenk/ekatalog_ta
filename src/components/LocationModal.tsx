import { MapPin } from 'lucide-react'; // Harita İkonu
import BaseModal from './BaseModal';
import Button from './Button';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  isStatic?: boolean;
}

export default function LocationModal({ isOpen, onClose, address, isStatic = false }: LocationModalProps) {
  const handleOpenMaps = () => {
    if (!address || isStatic) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      isStatic={isStatic}
      maxWidth="max-w-sm"
      noPadding
    >
      <div className="flex flex-col bg-stone-50 border-b border-stone-100 rounded-[2rem] shadow-sm overflow-hidden p-7 gap-4">
        <p className="text-[16px] font-black text-stone-900 leading-relaxed text-center px-2">
          {address || 'Adres bilgisi bulunamadı.'}
        </p>

        <Button
          onClick={handleOpenMaps}
          variant="phone"
          mode="rectangle"
          className="w-full !h-16 !rounded-2xl"
          disabled={!address}
          showFingerprint={true}
          icon={<MapPin size={18} strokeWidth={2.5} />}
        >
          YOL TARİFİ AL
        </Button>
      </div>
    </BaseModal>
  );
}
