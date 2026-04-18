import { memo } from 'react';
import { THEME } from '../../../../data/config';
import ImageActionWrapper from '../../../admin/ImageActionWrapper';

interface CarouselEmptyStateProps {
  onAdd: (file: File) => void;
  isUploading: boolean;
}

/**
 * CAROUSEL EMPTY STATE
 * -----------------------------------------------------------
 * Interactive placeholder for admins to add their first slide.
 */
const CarouselEmptyState = memo(({ onAdd, isUploading }: CarouselEmptyStateProps) => {
  const theme = THEME.heroCarousel;

  return (
    <div className={`${theme.layout} ${theme.container} !aspect-[21/9] sm:!aspect-[3/1]`}>
      <ImageActionWrapper
        isAdmin={true}
        isUploading={isUploading}
        onFileSelect={onAdd}
        className="w-full h-full"
      >
        <div className="w-full h-full border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white shadow-sm">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <span className="w-6 h-6">{THEME.icons.plus}</span>
          </div>
          <span className="text-stone-500 font-black uppercase text-xs tracking-widest">İlk Slider Görselini Ekle</span>
        </div>
      </ImageActionWrapper>
    </div>
  );
});

export default CarouselEmptyState;

