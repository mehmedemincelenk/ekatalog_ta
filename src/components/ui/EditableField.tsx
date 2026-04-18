import { memo, useCallback } from 'react';
import { useInlineEdit } from '../../hooks/ui/useInlineEdit';

interface EditableFieldProps {
  value: string;
  title: string;
  onConfirm: (newValue: string) => Promise<void> | void;
  isAdmin: boolean;
  editMode: 'modal' | 'inline';
  openModal: (title: string, value: string, onConfirm: (val: string) => Promise<void> | void) => void;
  type?: 'text' | 'number' | 'textarea';
  className?: string;
  multiline?: boolean;
}

/**
 * ATOMIC COMPONENT: EditableField
 * -----------------------------------------------------------
 * A polymorphic UI unit that switches between 'Modal' and 'Inline' editing
 * based on the global admin preference.
 * Now delegates behavioral logic to the useInlineEdit hook.
 */
export const EditableField = memo(({ 
  value, 
  title, 
  onConfirm, 
  isAdmin, 
  editMode, 
  openModal,
  type = 'text',
  className = "",
  multiline = false
}: EditableFieldProps) => {

  // 1. BEHAVIORAL LOGIC (Delegated to Hook)
  const { handleBlur, handleKeyDown } = useInlineEdit({ value, onConfirm, multiline });

  // 2. MODAL MODE TRIGGER
  const handleModalClick = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    if (!isAdmin || editMode !== 'modal') return;
    e.stopPropagation();
    openModal(title, value, onConfirm);
  }, [isAdmin, editMode, title, value, onConfirm, openModal]);

  // NON-ADMIN VIEW
  if (!isAdmin) {
    return <span className={className}>{value}</span>;
  }

  // --- ADMIN MODE: MODAL ---
  if (editMode === 'modal') {
    return (
      <span 
        className={`${className} cursor-pointer hover:bg-amber-50 rounded transition-colors px-1 border border-transparent hover:border-amber-200`}
        onPointerDown={(e) => e.stopPropagation()} 
        onClick={handleModalClick}
      >
        {value || (type === 'textarea' ? '+ Açıklama Ekle' : '...')}
      </span>
    );
  }

  // --- ADMIN MODE: INLINE ---
  const Tag = multiline ? 'div' : 'span';
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => e.stopPropagation()} 
      className={`
        ${className} 
        outline-none focus:bg-amber-50 focus:ring-1 focus:ring-amber-200 
        cursor-text rounded px-0.5 min-w-[20px] inline-block transition-all
      `}
    >
      {value}
    </Tag>
  );
});
