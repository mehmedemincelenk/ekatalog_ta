import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME } from '../data/config';
import { Slide } from '../hooks/useCarousel';

interface CarouselSlideUnitProps {
  slideData: Slide;
  isCurrentlyActive: boolean;
  isAdmin: boolean;
  isCurrentlyUploading: boolean;
  editingTargetSlideId: number | null;
  onImageUpdateTrigger: (id: number) => void;
  onDeleteSlide?: (id: number) => void;
  onAddSlide?: () => void;
  onReorderSlide?: (id: number, newIndex: number) => void;
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
  onDeleteSlide, 
  onAddSlide,
  onReorderSlide,
  currentIndex,
  totalSlides
}: CarouselSlideUnitProps) => {
  const carouselTheme = THEME.heroCarousel;
  const globalIcons = THEME.icons;

  return (
    <div className={`
      ${carouselTheme.slide.base} 
      ${isCurrentlyActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'} 
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

      {/* ADMIN CONTROLS ON SLIDE */}
      {isAdmin && isCurrentlyActive && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <div 
            className="relative flex items-center justify-center bg-white/90 backdrop-blur-md w-8 h-8 rounded-full shadow-2xl border border-white/20 cursor-pointer hover:bg-white transition-all active:scale-95 group"
          >
            {/* DISPLAY NUMBER */}
            <div className="flex items-center justify-center overflow-hidden h-4 w-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-stone-900 font-black text-xs absolute"
                >
                  {currentIndex}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* HIDDEN DROPDOWN OVERLAY (Ilham: CategoryFilterChip) */}
            <select 
              value={currentIndex}
              onChange={(e) => {
                const newIdx = parseInt(e.target.value, 10);
                if (newIdx !== currentIndex) onReorderSlide?.(slideData.id, newIdx);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {Array.from({ length: totalSlides }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}. Sıra</option>
              ))}
            </select>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onAddSlide?.(); }}
            className="w-8 h-8 bg-white/90 backdrop-blur-md text-stone-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all active:scale-90 border border-white/20"
            title="Yeni Slide Ekle"
          >
            {globalIcons.plus}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteSlide?.(slideData.id); }}
            className="w-8 h-8 bg-red-500/90 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-red-600 transition-all active:scale-90 border border-white/10"
            title="Slide Sil"
          >
            ✕
          </button>
        </div>
      )}

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
