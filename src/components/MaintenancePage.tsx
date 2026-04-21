import { motion } from 'framer-motion';
import { Settings, MessageCircle } from 'lucide-react';
import { CompanySettings } from '../hooks/useSettings';
import Button from './Button';
import { THEME } from '../data/config';
import { resolveVisualAssetUrl } from '../utils/image';

interface MaintenancePageProps {
  settings: CompanySettings;
  onLogoPointerDown: () => void;
  onLogoPointerUp: () => void;
}

export default function MaintenancePage({ settings, onLogoPointerDown, onLogoPointerUp }: MaintenancePageProps) {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${settings.whatsapp}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Animated Background Element */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1] 
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute w-[500px] h-[500px] bg-stone-50 rounded-full blur-3xl -z-10"
      />

      <div className="max-w-md w-full flex flex-col items-center">
        {/* LOGO */}
        {settings.logoUrl && (
          <div className="relative mb-12">
            <motion.img 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              src={resolveVisualAssetUrl(settings.logoUrl ?? '')} 
              alt={settings.name}
              className="h-16 sm:h-20 object-contain"
            />
            {/* INVISIBLE SHIELD: This layer catches the gestures */}
            <div 
              className="absolute inset-0 z-20 cursor-pointer" 
              onPointerDown={onLogoPointerDown}
              onPointerUp={onLogoPointerUp}
              onContextMenu={(e) => e.preventDefault()}
              style={{ touchAction: 'none' }}
            />
          </div>
        )}

        {/* ICON */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onPointerDown={onLogoPointerDown}
            onPointerUp={onLogoPointerUp}
            className="w-24 h-24 bg-stone-900 rounded-[32px] flex items-center justify-center text-white shadow-2xl cursor-pointer active:scale-95 transition-transform"
          >
            <Settings size={48} className="animate-spin-slow" />
          </motion.div>
          {/* INVISIBLE SHIELD */}
          <div 
            className="absolute inset-0 z-10" 
            onContextMenu={(e) => e.preventDefault()}
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* CONTENT */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tighter mb-4"
        >
          BAKIM MODU
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-stone-500 font-medium leading-relaxed mb-12 px-4"
        >
          {settings.maintenanceMode.message}
        </motion.p>

        {/* ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-4"
        >
          <Button
            onClick={handleWhatsAppClick}
            variant="secondary"
            size="md"
            className="w-full !rounded-2xl !py-5 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
          >
            <div className="w-5 h-5">{THEME.icons.whatsapp}</div>
            <span className="font-bold uppercase tracking-tight text-sm">WhatsApp ile İletişim</span>
          </Button>
          
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em]">
            Bizi Anlayışla Karşıladığınız İçin Teşekkürler
          </p>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-8 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
        {settings.name} &copy; {new Date().getFullYear()}
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
}
