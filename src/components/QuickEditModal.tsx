import { useState, useEffect, useRef } from 'react';
import BaseModal from './BaseModal';
import Button from './Button';

import { QuickEditModalProps } from '../types';

/**
 * QUICK EDIT MODAL (Diamond Standard)
 * -----------------------------------------------------------
 * Replaces native window.prompt() with a premium BaseModal experience.
 * Focused on speed, reliability, and surgical precision.
 */
export default function QuickEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  subtitle,
  initialValue,
  placeholder,
  type = 'text',
}: QuickEditModalProps) {
  const [value, setValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // SYNC ENGINE: Recommended pattern for adjusting state when props change
  if (isOpen && initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setValue(initialValue);
  }

  // FOCUS ENGINE
  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure modal transition finished before focus
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(value.trim());
    onClose();
  };

  const footer = (
    <div className="flex gap-3 w-full">
      <Button
        onClick={onClose}
        variant="ghost"
        className="flex-1 !py-4"
        mode="rectangle"
      >
        İPTAL
      </Button>
      <Button
        onClick={handleSave}
        variant="primary"
        className="flex-1 !py-4 !bg-stone-900 !text-white"
        mode="rectangle"
      >
        KAYDET
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      title={title}
      subtitle={subtitle}
      footer={footer}
    >
      <div className="py-2">
        <div className="relative">
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder={placeholder}
            className="w-full bg-stone-50 border-2 border-stone-100 rounded-[20px] px-6 py-4 text-sm font-black text-stone-900 focus:border-stone-900 focus:bg-white transition-all outline-none shadow-inner"
          />
        </div>
      </div>
    </BaseModal>
  );
}
