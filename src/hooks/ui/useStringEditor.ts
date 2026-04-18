import { useState, useCallback } from 'react';

interface StringEditorState {
  isOpen: boolean;
  title: string;
  initialValue: string;
  onConfirm: (newValue: string) => Promise<void> | void;
}

/**
 * HOOK: useStringEditor
 * -----------------------------------------------------------
 * A global-ready manager for string editing.
 * Handles modal state and the callback action for any text update.
 */
export function useStringEditor() {
  const [editorState, setEditorState] = useState<StringEditorState>({
    isOpen: false,
    title: '',
    initialValue: '',
    onConfirm: async () => {}
  });

  const openEditor = useCallback((title: string, initialValue: string, onConfirm: (val: string) => Promise<void> | void) => {
    setEditorState({
      isOpen: true,
      title,
      initialValue,
      onConfirm
    });
  }, []);

  const closeEditor = useCallback(() => {
    setEditorState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...editorState,
    openEditor,
    closeEditor
  };
}
