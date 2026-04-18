import { useState, useCallback } from 'react';
import { LABELS } from '../../data/config';

/**
 * Custom hook to handle loading and error states for async actions.
 * Perfect for admin uploads or form submissions.
 */
export function useAsyncAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options: { 
    errorLabel?: string; 
    onSuccess?: () => void; 
    onError?: (err: any) => void;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (...args: Parameters<T>) => {
    setIsLoading(true);
    try {
      const result = await action(...args);
      options.onSuccess?.();
      return result;
    } catch (error) {
      console.error("Action failed:", error);
      alert(options.errorLabel || LABELS.saveError);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [action, options]);

  return { execute, isLoading };
}
