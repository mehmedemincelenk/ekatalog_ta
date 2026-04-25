import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import BaseModal from './BaseModal';
import Button from './Button';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export default function LocationModal({ isOpen, onClose, address }: LocationModalProps) {
  const handleOpenMaps = () => {
    if (!address) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="MAĞAZA KONUMU"
      subtitle="Açık Adres Bilgileri"
      icon={<MapPin className="w-8 h-8" />}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-6">
        {/* ADDRESS CARD */}
        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <MapPin size={80} />
          </div>
          
          <p className="text-stone-600 text-sm font-medium leading-relaxed relative z-10">
            {address || 'Adres bilgisi bulunamadı.'}
          </p>
        </div>

        {/* GUIDANCE TEXT */}
        <div className="flex items-start gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-[11px] font-bold text-stone-400 leading-tight">
            Aşağıdaki butona tıklayarak telefonunuzdaki haritalar uygulamasında dükkanın tam konumuna yol tarifi alabilirsiniz.
          </p>
        </div>

        {/* ACTION BUTTON */}
        <Button
          onClick={handleOpenMaps}
          variant="primary"
          mode="rectangle"
          className="w-full !py-4 font-black tracking-widest text-sm shadow-xl"
          icon={<Navigation size={18} strokeWidth={3} />}
          disabled={!address}
        >
          HARİTALARDA GÖR
        </Button>
      </div>
    </BaseModal>
  );
}
