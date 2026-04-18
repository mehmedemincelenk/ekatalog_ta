import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CAROUSEL, TECH, LABELS } from '../../data/config';
import { getActiveStoreSlug } from '../../utils/helpers/store';

export interface Slide {
  id: number;
  src: string;
  bg: string;
  label: string;
  sub: string;
}

const STORE_SLUG = getActiveStoreSlug();

export function useCarousel(isAdministrativeModeActive: boolean) {
  const [marketingSlides, setMarketingSlides] = useState<Slide[]>(CAROUSEL.slides);
  const [isCarouselContentLoading, setIsCarouselContentLoading] = useState(true);
  
  const [isUploading, setIsUploading] = useState(false);
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);

  const synchronizeCarouselSlides = useCallback(async () => {
    if (STORE_SLUG === 'main-site') {
      setIsCarouselContentLoading(false);
      return;
    }
    
    setIsCarouselContentLoading(true);
    const { data: storeData, error: fetchError } = await supabase
      .from('stores')
      .select('carousel_data')
      .eq('slug', STORE_SLUG)
      .single();

    if (storeData && !fetchError && storeData.carousel_data?.slides) {
      setMarketingSlides(storeData.carousel_data.slides);
    }
    setIsCarouselContentLoading(false);
  }, []);

  useEffect(() => {
    synchronizeCarouselSlides();
  }, [synchronizeCarouselSlides]);

  const modifySlideContent = useCallback(async (slideId: number, contentChanges: Partial<Slide>) => {
    setMarketingSlides(prev => {
      const updated = prev.map(s => s.id === slideId ? { ...s, ...contentChanges } : s);
      
      if (isAdministrativeModeActive) {
        supabase
          .from('stores')
          .update({ carousel_data: { slides: updated } })
          .eq('slug', STORE_SLUG)
          .then(({ error }) => error && console.error('Carousel sync failed:', error));
      }
      return updated;
    });
  }, [isAdministrativeModeActive]);

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

    if (isAdministrativeModeActive) {
      const { error } = await supabase
        .from('stores')
        .update({ carousel_data: { slides: updatedSlides } })
        .eq('slug', STORE_SLUG);
      
      if (!error && initialImage) {
        await uploadHeroImage(nextId, initialImage);
      }
    }
  }, [isAdministrativeModeActive, marketingSlides, uploadHeroImage]);

  return { 
    slides: marketingSlides, 
    updateSlide: modifySlideContent, 
    uploadHeroImage, 
    addSlide: addNewSlide,
    loading: isCarouselContentLoading,
    isUploading,
    activeUploadId
  };
}
