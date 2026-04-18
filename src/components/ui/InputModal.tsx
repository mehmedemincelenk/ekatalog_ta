import { useState, memo } from 'react';
import { THEME, LABELS } from '../../data/config';
import ModalBase from './ModalBase';
import { ModalActions } from './ModalActions';
import { useAutoFocus } from '../../hooks/ui/useAutoFocus';

interface InputModalProps {
  title: string;
  initialValue: string;
  placeholder?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  submitLabel?: string;
}

/**
 * INPUT MODAL
 * -----------------------------------------------------------
 * A clean, minimalist text input interface that replaces 
 * the native window.prompt. Features auto-focus via custom hook.
 */
const InputModal = memo(({ 
  title, 
  initialValue, 
  placeholder = "", 
  onConfirm, 
  onCancel,
  submitLabel
}: InputModalProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useAutoFocus<HTMLInputElement>();
  const theme = THEME.addProductModal;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
    }
  };

  return (
    <ModalBase onClose={onCancel} className="!max-w-[320px] p-0" overlayClass="!backdrop-blur-xl">
      <form onSubmit={handleFormSubmit} className="flex flex-col">
        {/* HEADER */}
        <div className="px-6 pt-8 pb-4 text-center">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-[0.2em] mb-2">{title}</h2>
        </div>

        {/* BODY */}
        <div className="px-6 pb-6">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className={`${theme.inputField} !text-center !text-base font-bold`}
          />
        </div>

        {/* FOOTER ACTIONS (Shared Component) */}
        <ModalActions 
          onCancel={onCancel}
          confirmLabel={submitLabel || LABELS.confirmation.update}
          isForm={true}
        />
      </form>
    </ModalBase>
  );
});

export default InputModal;
