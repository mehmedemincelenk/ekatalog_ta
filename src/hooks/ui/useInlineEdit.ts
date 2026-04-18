import { useCallback } from 'react';

interface UseInlineEditOptions {
  value: string;
  onConfirm: (newValue: string) => Promise<void> | void;
  multiline?: boolean;
}

/**
 * HOOK: useInlineEdit
 * -----------------------------------------------------------
 * Encapsulates the behavioral logic for 'contentEditable' elements.
 * Handles blur saving and key interactions (like Enter to blur).
 */
export function useInlineEdit({ value, onConfirm, multiline = false }: UseInlineEditOptions) {
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.textContent?.trim() || '';
    if (newValue !== value) {
      onConfirm(newValue);
    }
  }, [value, onConfirm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // For single-line inputs, Enter triggers blur (which triggers save)
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  }, [multiline]);

  return {
    handleBlur,
    handleKeyDown
  };
}
