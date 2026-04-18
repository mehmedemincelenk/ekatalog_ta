import { memo } from 'react';
import ModalBase from './ModalBase';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

/**
 * CONFIRM MODAL
 * -----------------------------------------------------------
 * A specialized modal for final confirmation of critical actions.
 * Replaces window.confirm with a consistent, blurred Apple-style UI.
 */
const ConfirmModal = memo(({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmLabel = "EVET", 
  cancelLabel = "VAZGEÇ",
  variant = 'primary'
}: ConfirmModalProps) => {
  return (
    <ModalBase onClose={onCancel} className="!max-w-[320px] p-0" overlayClass="!backdrop-blur-xl">
      <div className="flex flex-col">
        {/* TEXT CONTENT */}
        <div className="px-6 pt-8 pb-6 text-center space-y-2">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-[0.2em]">{title}</h2>
          <p className="text-xs text-stone-400 font-medium leading-relaxed">{message}</p>
        </div>

        {/* ACTION BUTTONS (Horizontal Split) */}
        <div className="flex border-t border-stone-100 h-14">
          <button 
            onClick={onCancel}
            className="flex-1 text-[10px] font-black text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors uppercase tracking-widest border-r border-stone-100"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 text-[10px] font-black uppercase tracking-widest transition-colors ${
              variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalBase>
  );
});

export default ConfirmModal;
