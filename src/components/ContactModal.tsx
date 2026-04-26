import BaseModal from './BaseModal';
import Numpad from './Numpad';
import { useStore } from '../store';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  storeName: string;
  isStatic?: boolean;
}

export default function ContactModal({ isOpen, onClose, phone, storeName, isStatic = false }: ContactModalProps) {
  const { settings } = useStore();

  const handleNumpadSubmit = async (customerPhone: string) => {
    try {
      const currentLeads = settings?.visitor_leads || [];
      const newLead = { phone: customerPhone, created_at: new Date().toISOString() };
      
      // Update store with new lead
      const { supabase } = await import('../supabase');
      if (settings?.id) {
        await supabase
          .from('stores')
          .update({ visitor_leads: [...currentLeads, newLead] })
          .eq('id', settings.id);
      }
      
      onClose();
    } catch (err) {
      console.error('Lead capture failed', err);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      isStatic={isStatic}
      maxWidth="max-w-[320px]"
      position="bottom-right"
      title="SİZİ ARAYALIM"
      className="!rounded-[2.5rem]"
    >
      <div className="py-2">
        <Numpad 
          onSubmit={handleNumpadSubmit}
          title="" // Title is in BaseModal
        />
      </div>
    </BaseModal>
  );
}
