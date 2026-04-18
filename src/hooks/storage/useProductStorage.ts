import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { TECH } from '../../data/config';
import { getActiveStoreSlug } from '../../utils/helpers/store';

const STORE_SLUG = getActiveStoreSlug();

/**
 * useProductStorage: Dedicated service for Supabase Storage operations.
 * Handles dual-quality image processing, sanitization, and cleanup.
 */
export function useProductStorage() {
  
  /**
   * uploadImage: Processes and deploys images to storage tiers.
   */
  const uploadImage = useCallback(async (targetProduct: Product, visualFile: File) => {
    try {
      const { processDualQualityVisuals } = await import('../../utils/media/image');
      const { hq: hqAsset, lq: lqAsset } = await processDualQualityVisuals(visualFile);

      // Hygiene: Remove old images if they exist
      if (targetProduct.image) {
        try {
          const fileName = new URL(targetProduct.image).pathname.split('/').pop();
          if (fileName && !fileName.includes('placeholder')) {
            await supabase.storage.from(TECH.storage.bucket).remove([
              `${TECH.storage.lqFolder}/${fileName}`, 
              `${TECH.storage.hqFolder}/${fileName}`
            ]);
          }
        } catch (e) { /* Ignore cleanup errors */ }
      }

      // Name Sanitization
      const turkishMap: Record<string, string> = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','Ç':'C','Ğ':'G','İ':'I','Ö':'O','Ş':'S','Ü':'U' };
      const safeName = targetProduct.name
        .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m: string) => turkishMap[m])
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .substring(0, TECH.products.maxFileNameLength);
      
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const fileName = `${safeName}-${STORE_SLUG}-${uniqueSuffix}.jpg`;

      const lqPath = `${TECH.storage.lqFolder}/${fileName}`;
      const hqPath = `${TECH.storage.hqFolder}/${fileName}`;

      const [lqRes, hqRes] = await Promise.all([
        supabase.storage.from(TECH.storage.bucket).upload(lqPath, lqAsset, { upsert: true, cacheControl: TECH.storage.cacheControl }),
        supabase.storage.from(TECH.storage.bucket).upload(hqPath, hqAsset, { upsert: true, cacheControl: TECH.storage.cacheControl })
      ]);

      if (lqRes.error) throw lqRes.error;
      if (hqRes.error) throw hqRes.error;

      const { data: { publicUrl } } = supabase.storage.from(TECH.storage.bucket).getPublicUrl(lqPath);
      return `${publicUrl}?t=${Date.now()}`;

    } catch (error) {
      console.error('Storage upload failed:', error);
      throw error;
    }
  }, []);

  /**
   * deleteImage: Removes assets from storage.
   */
  const deleteImage = useCallback(async (imageUrl: string) => {
    try {
      const fileName = new URL(imageUrl).pathname.split('/').pop();
      if (fileName) {
        await supabase.storage.from(TECH.storage.bucket).remove([
          `${TECH.storage.lqFolder}/${fileName}`, 
          `${TECH.storage.hqFolder}/${fileName}`
        ]);
      }
    } catch (e) {
      console.error('Storage delete failed:', e);
    }
  }, []);

  return { uploadImage, deleteImage };
}
