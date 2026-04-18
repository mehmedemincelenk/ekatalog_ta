import { useState, useCallback } from 'react';

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: 'danger' | 'primary';
}

/**
 * HOOK: useConfirmModal
 * -----------------------------------------------------------
 * Manages the state and logic for confirmation dialogs.
 * Can be reused across different views (Catalog, Settings, etc.)
 */
export function useConfirmModal() {
  const [confirmState, setConfirmState] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  const requestConfirmation = useCallback((options: { 
    title: string, 
    message: string, 
    onConfirm: () => void, 
    variant?: 'danger' | 'primary' 
  }) => {
    setConfirmState({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: options.onConfirm,
      variant: options.variant || 'primary'
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...confirmState,
    requestConfirmation,
    close: closeConfirm
  };
}
