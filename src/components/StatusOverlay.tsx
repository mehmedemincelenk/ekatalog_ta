import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';

interface StatusOverlayProps {
  status: 'idle' | 'success' | 'error' | 'loading';
  message?: string;
  onClose?: () => void;
  autoCloseMs?: number;
}

/**
 * STATUS OVERLAY (Diamond Edition)
 * -----------------------------------------------------------
 * High-end feedback system for async operations.
 * Ported from App.tsx into a reusable atomic component.
 */
const StatusOverlay = memo(({
  status,
  message,
  onClose,
}: StatusOverlayProps) => {
  if (status === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-white/40 backdrop-blur-3xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
          className="flex flex-col items-center gap-6"
        >
          <div 
            className={`
              w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-500
              ${status === 'success' ? 'bg-emerald-500' : status === 'error' ? 'bg-red-500' : 'bg-stone-900'}
            `}
          >
            {status === 'success' && (
              <Lucide.Check size={48} className="text-white sm:size-[64px]" strokeWidth={4} />
            )}
            {status === 'error' && (
              <Lucide.X size={48} className="text-white sm:size-[64px]" strokeWidth={4} />
            )}
            {status === 'loading' && (
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </div>
          
          {message && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-2xl font-black text-stone-900 uppercase tracking-[0.2em] text-center px-6"
            >
              {message}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

StatusOverlay.displayName = 'StatusOverlay';
export default StatusOverlay;
