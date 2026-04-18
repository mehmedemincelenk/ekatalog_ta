import { useCallback } from 'react';
import { useAsyncAction } from '../ui/useAsyncAction';
import { Product } from '../../types';
import { LABELS } from '../../data/config';

interface UseProductCardActionsProps {
  product: Product;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onImageUpload?: (id: string, file: File) => Promise<void>;
}

/**
 * HOOK: useProductCardActions
 * -----------------------------------------------------------
 * Encapsulates update and upload logic for a product card.
 */
export function useProductCardActions({ product, onUpdate, onImageUpload }: UseProductCardActionsProps) {
  
  // 1. Image Upload Logic
  const { execute: handleImageUpload, isLoading: isUploading } = useAsyncAction(
    async (file: File) => {
      if (onImageUpload) {
        await onImageUpload(product.id, file);
      }
    },
    { onError: () => alert(LABELS.saveError) }
  );

  // 2. Data Update Logic
  const handleDataUpdate = useCallback((fieldName: keyof Product, newValue: string | boolean | null) => {
    if (newValue !== (product[fieldName] || '')) {
      onUpdate(product.id, { [fieldName]: newValue });
    }
  }, [product, onUpdate]);

  return {
    isUploading,
    handleImageUpload,
    handleDataUpdate
  };
}
