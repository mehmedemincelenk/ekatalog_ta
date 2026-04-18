import { memo } from 'react';
import ModalBase from './ModalBase';
import { ModalActions } from './ModalActions';

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
 * Now uses Shared ModalActions for design consistency.
 */
const ConfirmModal = memo(({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmLabel, 
  cancelLabel,
  variant = 'primary'
}: ConfirmModalProps) => {
  return (
    <ModalBase onClose={onCancel} className="!max-w-[320px] p-0" overlayClass="!backdrop-blur-xl">
      <div className="flex flex-col">
        {/* 1. TEXT CONTENT SECTION */}
        <div className="px-6 pt-8 pb-6 text-center space-y-2">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-[0.2em]">{title}</h2>
          <p className="text-xs text-stone-400 font-medium leading-relaxed">{message}</p>
        </div>

        {/* 2. ACTION BAR SECTION (Shared Component) */}
        <ModalActions 
          onCancel={onCancel}
          onConfirm={onConfirm}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          variant={variant}
        />
      </div>
    </ModalBase>
  );
});

export default ConfirmModal;
