import { memo } from 'react';
import { THEME } from '../../../data/config';
import SmartImage from '../../ui/SmartImage';
import ImageActionWrapper from '../../admin/ImageActionWrapper';
import { useAsyncAction } from '../../../hooks/ui/useAsyncAction';

interface ReferenceItemProps {
  id: number;
  logo: string;
  name: string;
  isAdmin: boolean;
  onUpdate: (id: number, file: File) => Promise<void>;
}

/**
 * REFERENCE ITEM
 * -----------------------------------------------------------
 * Renders a single partner logo with admin update capabilities.
 */
const ReferenceItem = memo(({ id, logo, name, isAdmin, onUpdate }: ReferenceItemProps) => {
  const theme = THEME.references;

  // Unified Logic for Async Update
  const { execute: handleFileSelect, isLoading: isUploading } = useAsyncAction(
    (file: File) => onUpdate(id, file)
  );

  return (
    <div className={theme.card.base}>
      <ImageActionWrapper
        isAdmin={isAdmin}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        className="w-full h-full flex items-center justify-center"
      >
        {logo.startsWith('http') || logo.startsWith('data:') ? (
          <SmartImage 
            src={logo} 
            alt={name} 
            className="max-h-12 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
            objectFit="contain"
          />
        ) : (
          <span className={theme.card.logoSize} aria-hidden="true">
            {logo}
          </span>
        )}
      </ImageActionWrapper>
    </div>
  );
});

export default ReferenceItem;
