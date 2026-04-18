import { memo } from 'react';
import { THEME } from '../../../data/config';
import { Product } from '../../../types';
import { resolveVisualAssetUrl } from '../../../utils/media/image';
import SmartImage from '../../ui/SmartImage';
import ImageActionWrapper from '../../admin/ImageActionWrapper';

interface ProductCardImageProps {
  product: Product;
  isAdmin: boolean;
  isUploading: boolean;
  isPriority?: boolean;
  onZoom: () => void;
  onUpload: (file: File) => void;
}

/**
 * SUB-COMPONENT: ProductCardImage
 */
export const ProductCardImage = memo(({ 
  product, 
  isAdmin, 
  isUploading, 
  isPriority, 
  onZoom, 
  onUpload 
}: ProductCardImageProps) => {
  const theme = THEME.productCard.image;
  const imageUrl = product.image ? resolveVisualAssetUrl(product.image) : null;

  return (
    <div 
      className={`${theme.wrapper} ${theme.aspect} ${THEME.radius.image} ${!isAdmin ? theme.cursorUser : theme.cursorAdmin}`} 
      onClick={() => { if (!isAdmin && imageUrl) onZoom(); }}
    >
      <ImageActionWrapper
        isAdmin={isAdmin}
        isUploading={isUploading}
        onFileSelect={onUpload}
        className="w-full h-full"
      >
        <SmartImage src={imageUrl} alt={product.name} isPriority={isPriority} wrapperClass="w-full h-full" />
      </ImageActionWrapper>
    </div>
  );
});
