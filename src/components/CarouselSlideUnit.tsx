import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME } from '../data/config';
import { Slide } from '../hooks/useCarousel';
import OrderSelector from './OrderSelector';
import Button from './Button';

interface CarouselSlideUnitProps {
  slideData: Slide;
  isCurrentlyActive: boolean;
  isAdmin: boolean;
  isCurrentlyUploading: boolean;
  editingTargetSlideId: number | null;
  onImageUpdateTrigger: (id: number) => void;
  onDeleteTrigger?: (id: number) => void;
  onAddTrigger?: () => void;
  onReorderTrigger?: (id: number, newIndex: number) => void;
  currentIndex: number;
  totalSlides: number;
}

const CarouselSlideUnit = memo(({ 
  slideData, 
  isCurrentlyActive, 
  isAdmin, 
  isCurrentlyUploading, 
  editingTargetSlideId, 
  onImageUpdateTrigger, 
  onDeleteTrigger, 
  onAddTrigger,
  onReorderTrigger,
  currentIndex,
  totalSlides
}: CarouselSlideUnitProps) => {
  const carouselTheme = THEME.heroCarousel;
  const globalIcons = THEME.icons;

  return (
    <div className={`
      ${carouselTheme.slide.base} 
      rounded-lg overflow-hidden
      ${isCurrentlyActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-[0.35] pointer-events-none z-0 scale-95 blur-[1px]'} 
      ${slideData.bg}
    `}>
      {/* BACKGROUND IMAGE OR PLACEHOLDER */}
      {slideData.src ? (
        <img 
          src={slideData.src} 
          alt={slideData.label} 
          className={`
            ${carouselTheme.slide.image} 
            ${isAdmin ? 'cursor-pointer' : ''} 
            ${isCurrentlyUploading && editingTargetSlideId === slideData.id ? carouselTheme.slide.loadingBlur : ''}
          `} 
          onClick={() => isAdmin && !isCurrentlyUploading && onImageUpdateTrigger(slideData.id)} 
          loading={isCurrentlyActive ? "eager" : "lazy"}
          {...(isCurrentlyActive ? { fetchpriority: "high" } : {})}
        />
      ) : (
        <div 
          className={`${carouselTheme.slide.image} ${carouselTheme.slide.placeholderBg} ${isAdmin ? 'cursor-pointer' : ''}`} 
          onClick={() => isAdmin && !isCurrentlyUploading && onImageUpdateTrigger(slideData.id)} 
        />
      )}

      {/* ADMIN CONTROLS ON SLIDE: Repositioned to bottom-right vertical stack */}
      <AnimatePresence>
        {isAdmin && isCurrentlyActive && (
          <motion.div 
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(12px)', scale: 0.9 }}
            className="absolute bottom-6 right-6 z-[200] flex flex-col gap-3"
          >
            <OrderSelector 
              currentOrder={currentIndex}
              totalCount={totalSlides}
              onChange={(newIdx) => onReorderTrigger?.(slideData.id, newIdx)}
            />

            <Button 
              onClick={(e) => { e.stopPropagation(); onAddTrigger?.(); }}
              variant="glass"
              mode="square"
              size="xs"
              icon={globalIcons.plus}
              title="Yeni Slide Ekle"
            />
            <Button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteTrigger?.(slideData.id); }}
              variant="danger"
              mode="square"
              size="sm"
              icon={globalIcons.trash}
              title="AFİŞİ SİL"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD PROGRESS VISUAL */}
      {isCurrentlyUploading && editingTargetSlideId === slideData.id && isCurrentlyActive && (
        <div className={carouselTheme.slide.overlay}>
          <div className={carouselTheme.slide.loadingSpinner}></div>
        </div>
      )}
    </div>
  );
});

export default CarouselSlideUnit;
