import { useState, memo, useEffect, useRef } from 'react';
import { THEME, LABELS } from '../../data/config';
import ModalBase from './ModalBase';

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
 * the native window.prompt. Features auto-focus and background blur.
 */
const InputModal = memo(({ 
  title, 
  initialValue, 
  placeholder = "", 
  onConfirm, 
  onCancel,
  submitLabel = "GÜNCELLE" 
}: InputModalProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = THEME.addProductModal; // Reusing consistent modal tokens

  // Auto-focus on mount for faster UX
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

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

        {/* FOOTER ACTIONS */}
        <div className="flex border-t border-stone-100 h-14">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 text-[10px] font-black text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors uppercase tracking-widest border-r border-stone-100"
          >
            {LABELS.form.cancelBtn}
          </button>
          <button 
            type="submit"
            className="flex-1 text-[10px] font-black text-green-600 hover:bg-green-50 transition-colors uppercase tracking-widest"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </ModalBase>
  );
});

export default InputModal;
