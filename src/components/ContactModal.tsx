import React from 'react';
import { Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import BaseModal from './BaseModal';
import Button from './Button';
import { generateWhatsAppLink } from '../utils/core';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  storeName: string;
}

export default function ContactModal({ isOpen, onClose, phone, storeName }: ContactModalProps) {
  const handleCall = () => {
    window.open(`tel:${phone.replace(/\D/g, '')}`, '_self');
    onClose();
  };

  const handleWhatsApp = () => {
    const message = `Merhaba, ${storeName} web sitenizden ulaşıyorum.`;
    window.open(generateWhatsAppLink(phone, message), '_blank');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="İLETİŞİME GEÇİN"
      subtitle="Size nasıl yardımcı olabiliriz?"
      icon={<ShieldCheck className="w-8 h-8 text-stone-900" />}
      maxWidth="max-w-sm"
    >
      <div className="flex flex-col gap-4">
        {/* OPTION 1: CALL */}
        <Button
          onClick={handleCall}
          variant="primary"
          mode="rectangle"
          className="w-full !py-5 flex flex-col items-center gap-1 shadow-xl group"
          icon={<Phone size={20} className="group-hover:scale-110 transition-transform" strokeWidth={2.5} />}
        >
          <span className="text-sm font-black tracking-widest">DİREKT ARA</span>
          <span className="text-[10px] font-bold opacity-60 normal-case">{phone}</span>
        </Button>

        {/* OPTION 2: WHATSAPP */}
        <Button
          onClick={handleWhatsApp}
          variant="secondary"
          mode="rectangle"
          className="w-full !py-5 flex flex-col items-center gap-1 border-2 border-stone-100 group"
          icon={<MessageSquare size={20} className="text-[#25D366] group-hover:scale-110 transition-transform" strokeWidth={2.5} />}
        >
          <span className="text-sm font-black tracking-widest text-stone-900">WHATSAPP MESAJ</span>
          <span className="text-[10px] font-bold text-stone-400 normal-case">Hızlı ve yazılı iletişim</span>
        </Button>

        {/* SECURITY INFO */}
        <p className="text-[10px] font-medium text-stone-400 text-center mt-2 px-4 italic leading-relaxed">
          Verileriniz güvenli bağlantı üzerinden işlenir. Mağaza yetkilisiyle anında görüşme sağlayabilirsiniz.
        </p>
      </div>
    </BaseModal>
  );
}
