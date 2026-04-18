import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TECH, LABELS } from '../../data/config';
import { getActiveStoreSlug } from '../../utils/helpers/store';

export interface Slide {
  id: number;
  src: string;
  bg: string;
  label: string;
  sub: string;
}

const STORE_SLUG = getActiveStoreSlug();

export function useCarousel(
  initialSlides: Slide[], 
  onSync: (updatedSlides: Slide[]) => Promise<void> | void
) {
  const [marketingSlides, setMarketingSlides] = useState<Slide[]>(initialSlides);
  
  const [isUploading, setIsUploading] = useState(false);
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);

  // Keep local state in sync with props
  useEffect(() => {
    setMarketingSlides(initialSlides);
  }, [initialSlides]);

  const modifySlideContent = useCallback(async (slideId: number, contentChanges: Partial<Slide>) => {
    const updated = marketingSlides.map(s => s.id === slideId ? { ...s, ...contentChanges } : s);
    setMarketingSlides(updated);
    await onSync(updated);
  }, [marketingSlides, onSync]);

  const uploadHeroImage = useCallback(async (slideId: number, visualFile: File) => {
    setActiveUploadId(slideId);
    setIsUploading(true);
    
    try {
      const { processDualQualityVisuals } = await import('../../utils/media/image');
      const { hq: optimizedVisual } = await processDualQualityVisuals(visualFile, TECH.storage.heroWidth);

      const visualFileName = `hero-${STORE_SLUG}-${slideId}-${Date.now()}.jpg`;
      const storagePath = `${TECH.storage.heroFolder}/${visualFileName}`;

      const { error: storageUploadError } = await supabase.storage
        .from(TECH.storage.bucket)
        .upload(storagePath, optimizedVisual, { 
          upsert: true, 
          cacheControl: TECH.storage.cacheControl 
        });

      if (storageUploadError) throw storageUploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(TECH.storage.bucket)
        .getPublicUrl(storagePath);

      const finalizedVisualUrl = `${publicUrl}?t=${Date.now()}`;
      await modifySlideContent(slideId, { src: finalizedVisualUrl });
      return finalizedVisualUrl;

    } catch (err) {
      alert(LABELS.saveError);
      throw err;
    } finally {
      setIsUploading(false);
      setActiveUploadId(null);
    }
  }, [modifySlideContent]);

  const addNewSlide = useCallback(async (initialImage?: File) => {
    const nextId = marketingSlides.length > 0 
      ? Math.max(...marketingSlides.map(s => s.id)) + 1 
      : 1;
    
    const newSlide: Slide = {
      id: nextId,
      src: '',
      bg: 'bg-stone-200',
      label: 'Yeni Başlık',
      sub: 'Açıklama metni buraya gelecek.'
    };

    const updatedSlides = [...marketingSlides, newSlide];
    setMarketingSlides(updatedSlides);
    await onSync(updatedSlides);

    if (initialImage) {
      await uploadHeroImage(nextId, initialImage);
    }
  }, [marketingSlides, uploadHeroImage, onSync]);

  return { 
    slides: marketingSlides, 
    updateSlide: modifySlideContent, 
    uploadHeroImage, 
    addSlide: addNewSlide,
    isUploading,
    activeUploadId
  };
}
