import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME } from '../data/config';
import SmartImage from './SmartImage';
import OrderSelector from './OrderSelector';
import Button from './Button';

import { CarouselSlideUnitProps } from '../types';
import { resolveVisualAssetUrl } from '../utils/image';

/**
 * CAROUSEL SLIDE UNIT (DIAMOND EDITION)
 * -----------------------------------------------------------
 * An autonomous cinematic slide unit that manages its own visual
 * state (Active vs Ghost) to ensure layout purity.
 */
const CarouselSlideUnit = memo(
  ({
    slideData,
    isCurrentlyActive,
    isAdmin,
    isCurrentlyUploading,
    editingTargetSlideId,
    isMobileView,
    onImageUpdateTrigger,
    onDeleteTrigger,
    onAddTrigger,
    onReorderTrigger,
    currentIndex,
    totalSlides,
  }: CarouselSlideUnitProps) => {
    const carouselTheme = THEME.heroCarousel;
    const globalIcons = THEME.icons;

    const onAction = () => {
      if (isAdmin && !isCurrentlyUploading) {
        onImageUpdateTrigger(slideData.id);
      }
    };

    return (
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileView ? 1 : (isCurrentlyActive ? 1 : 0.35),
          scale: isMobileView ? 1 : (isCurrentlyActive ? 1 : 0.95),
          filter: isMobileView ? 'blur(0px)' : (isCurrentlyActive ? 'blur(0px)' : 'blur(2px)'),
          zIndex: isCurrentlyActive ? 10 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`
        ${carouselTheme.slide.base} 
        rounded-lg overflow-hidden relative w-full h-full
        ${isCurrentlyActive ? 'pointer-events-auto' : 'pointer-events-none'} 
        ${slideData.bg}
      `}
      >
        <div
          className={`relative w-full h-full overflow-hidden ${isAdmin ? 'cursor-pointer' : ''}`}
          onClick={onAction}
        >
          <SmartImage
            src={resolveVisualAssetUrl(slideData.src)}
            alt={slideData.label}
            aspectRatio="rectangle"
            priority={true}
            className={`
            ${carouselTheme.slide.image} 
            ${isCurrentlyUploading && editingTargetSlideId === slideData.id ? carouselTheme.slide.loadingBlur : ''}
          `}
          />
        </div>

        <AnimatePresence>
          {isAdmin && isCurrentlyActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-4 right-4 z-[50] flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <OrderSelector
                currentOrder={currentIndex}
                totalCount={totalSlides}
                variant="large"
                className="!w-8 !h-8 sm:!w-10 sm:!h-10"
                onChange={(newIdx) => onReorderTrigger?.(slideData.id, newIdx)}
              />

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteTrigger?.(slideData.id);
                }}
                variant="danger"
                mode="circle"
                className="w-8 h-8 sm:w-10 sm:h-10 shadow-xl border-2 border-white/20"
                icon={<div className="w-3.5 h-3.5 sm:w-5 sm:h-5">{globalIcons.trash}</div>}
                title="AFİŞİ SİL"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* UPLOAD PROGRESS VISUAL */}
        {isCurrentlyUploading &&
          editingTargetSlideId === slideData.id &&
          isCurrentlyActive && (
            <div className={carouselTheme.slide.overlay}>
              <div className={carouselTheme.slide.loadingSpinner}></div>
            </div>
          )}
      </motion.div>
    );
  },
);

export default CarouselSlideUnit;
