import { ReactNode, memo, useEffect } from 'react';

interface ModalBaseProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  overlayClass?: string;
}

/**
 * MODAL BASE
 * -----------------------------------------------------------
 * A reusable, primitive component that provides the background overlay
 * and "click outside to close" logic for all modals.
 */
const ModalBase = memo(({ children, onClose, className = "", overlayClass = "" }: ModalBaseProps) => {
  
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300 ${overlayClass}`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
});

export default ModalBase;
