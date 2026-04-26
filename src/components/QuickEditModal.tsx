import { useState, useEffect, useRef } from 'react';
import * as Lucide from 'lucide-react';
import BaseModal from './BaseModal';
import Button from './Button';
import FormInput from './FormInput';
import { QuickEditModalProps } from '../types';

export default function QuickEditModal({
  isOpen,
  onClose,
  onSave,
  title = '',
  subtitle = '',
  initialValue = '',
  placeholder = '',
  type = 'text',
  isStatic = false,
}: QuickEditModalProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    onSave(value.trim());
    onClose();
  };


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      isStatic={isStatic}
    >
      <div className="flex flex-col gap-6 py-2">
        <FormInput
          id="quick-edit-input"
          ref={inputRef as any}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder={placeholder}
          className="!text-center !py-6 focus:!border-emerald-500 !text-sm !rounded-3xl shadow-inner"
        />

        <div className="flex gap-3 w-full">
          <Button
            onClick={onClose}
            variant="secondary"
            className="w-16 h-16 shrink-0"
            mode="rectangle"
          >
            <Lucide.ChevronLeft size={24} strokeWidth={3} />
          </Button>
          <Button
            onClick={handleSave}
            variant="action"
            className="flex-1 h-16 !rounded-[24px]"
            showFingerprint={true}
          >
            <span className="font-black tracking-[0.2em] text-[15px] uppercase">TAMAM</span>
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
