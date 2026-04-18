import { memo } from 'react';
import { usePageMetadata } from '../../hooks/ui/usePageMetadata';
import { CompanySettings } from '../../hooks/store/useSettings';

/**
 * METADATA SYNC
 * -----------------------------------------------------------
 * Isolated component that handles side-effects like Title and Favicon.
 */
const MetadataSync = memo(({ settings }: { settings: CompanySettings }) => {
  usePageMetadata(settings);
  return null; // This component renders nothing to the UI
});

export default MetadataSync;
