import { memo } from 'react';
import { LABELS } from '../../data/config';

interface ModalActionsProps {
  onCancel: () => void;
  onConfirm?: () => void; // Optional if button is part of a form (type="submit")
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'success';
  isForm?: boolean;
}

/**
 * SHARED COMPONENT: ModalActions
 * -----------------------------------------------------------
 * Reusable action bar for Apple-style blurred modals.
 * Used by ConfirmModal and InputModal to ensure design consistency.
 */
export const ModalActions = memo(({ 
  onCancel, 
  onConfirm, 
  confirmLabel, 
  cancelLabel, 
  variant = 'primary',
  isForm = false
}: ModalActionsProps) => {
  const successColor = 'text-green-600 hover:bg-green-50';
  const dangerColor = 'text-red-600 hover:bg-red-50';
  
  const confirmBtnColor = variant === 'danger' ? dangerColor : successColor;

  return (
    <div className="flex border-t border-stone-100 h-14">
      {/* CANCEL BUTTON */}
      <button 
        type="button"
        onClick={onCancel}
        className="flex-1 text-[10px] font-black text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors uppercase tracking-widest border-r border-stone-100"
      >
        {cancelLabel || LABELS.confirmation.no}
      </button>

      {/* CONFIRM BUTTON */}
      <button 
        type={isForm ? "submit" : "button"}
        onClick={isForm ? undefined : onConfirm}
        className={`flex-1 text-[10px] font-black uppercase tracking-widest transition-colors ${confirmBtnColor}`}
      >
        {confirmLabel || LABELS.confirmation.yes}
      </button>
    </div>
  );
});
