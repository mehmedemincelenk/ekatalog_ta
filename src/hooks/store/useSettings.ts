import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DEFAULT_COMPANY, CATEGORY_ORDER as DEFAULT_ORDER, TECH } from '../../data/config';
import { getActiveStoreSlug } from '../../utils/helpers/store';

export interface CompanySettings {
  id: string; // Store UUID
  whatsapp: string;
  address: string;
  instagram: string;
  title: string;
  subtitle: string;
  name: string;
  logoEmoji: string;
  categoryOrder: string[];
  carouselData: {
    slides: Array<{
      id: number;
      src: string;
      bg: string;
      label: string;
      sub: string;
    }>;
  };
  referencesData: Array<{
    id: number;
    name: string;
    logo: string;
  }>;
}

const STORE_SLUG = getActiveStoreSlug();

/**
 * USE SETTINGS HOOK (BRANDING & CONFIGURATION ENGINE)
 */
export function useSettings(isAdministrativeModeActive: boolean) {
  const [activeStoreSettings, setActiveStoreSettings] = useState<CompanySettings>({
    id: '',
    whatsapp: DEFAULT_COMPANY.phone,
    address: DEFAULT_COMPANY.address,
    instagram: DEFAULT_COMPANY.instagramUrl,
    title: DEFAULT_COMPANY.name,
    subtitle: DEFAULT_COMPANY.tagline,
    name: DEFAULT_COMPANY.name,
    logoEmoji: DEFAULT_COMPANY.logoEmoji,
    categoryOrder: DEFAULT_ORDER,
    carouselData: { slides: [] },
    referencesData: [],
  });

  const [isSettingsDataLoading, setIsSettingsDataLoading] = useState(true);

  const synchronizeStoreSettings = useCallback(async () => {
    if (STORE_SLUG === 'main-site') {
      setIsSettingsDataLoading(false);
      return;
    }
    
    const { data: storeConfig, error: fetchError } = await supabase
      .from(TECH.tables.stores)
      .select('*')
      .eq('slug', STORE_SLUG)
      .single();

    if (storeConfig && !fetchError) {
      setActiveStoreSettings({
        id: storeConfig.id,
        whatsapp: storeConfig.phone || DEFAULT_COMPANY.phone,
        address: storeConfig.address || DEFAULT_COMPANY.address,
        instagram: storeConfig.instagram_url || DEFAULT_COMPANY.instagramUrl,
        title: storeConfig.name || DEFAULT_COMPANY.name,
        subtitle: storeConfig.tagline || DEFAULT_COMPANY.tagline,
        name: storeConfig.name || DEFAULT_COMPANY.name,
        logoEmoji: storeConfig.logo_url || DEFAULT_COMPANY.logoEmoji,
        categoryOrder: storeConfig.category_order || DEFAULT_ORDER,
        carouselData: storeConfig.carousel_data || { slides: [] },
        referencesData: storeConfig.references_data || [],
      });
    }
    setIsSettingsDataLoading(false);
  }, []);

  useEffect(() => {
    synchronizeStoreSettings();
  }, [synchronizeStoreSettings]);

  const modifyStoreConfiguration = useCallback(async (
    settingKey: keyof CompanySettings, 
    newValue: any
  ) => {
    setActiveStoreSettings(prev => ({ ...prev, [settingKey]: newValue }));

    if (isAdministrativeModeActive) {
      const updatePayload: Record<string, any> = {};
      if (settingKey === 'whatsapp') updatePayload.phone = newValue;
      if (settingKey === 'address') updatePayload.address = newValue;
      if (settingKey === 'instagram') updatePayload.instagram_url = newValue;
      if (settingKey === 'name' || settingKey === 'title') updatePayload.name = newValue;
      if (settingKey === 'subtitle') updatePayload.tagline = newValue;
      if (settingKey === 'logoEmoji') updatePayload.logo_url = newValue;
      if (settingKey === 'categoryOrder') updatePayload.category_order = newValue;
      if (settingKey === 'referencesData') updatePayload.references_data = newValue;

      await supabase.from(TECH.tables.stores).update(updatePayload).eq('slug', STORE_SLUG);
    }
  }, [isAdministrativeModeActive]);

  /**
   * uploadStoreLogo: Updates the main brand logo.
   */
  const uploadStoreLogo = useCallback(async (visualFile: File) => {
    if (!isAdministrativeModeActive) return;
    try {
      const fileName = `logo-${STORE_SLUG}-${Date.now()}.jpg`;
      const storagePath = `branding/${fileName}`;

      const { error: uploadError } = await supabase.storage.from(TECH.storage.bucket).upload(storagePath, visualFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(TECH.storage.bucket).getPublicUrl(storagePath);
      const finalizedUrl = `${publicUrl}?t=${Date.now()}`;
      
      await modifyStoreConfiguration('logoEmoji', finalizedUrl);
      return finalizedUrl;
    } catch (err) {
      console.error('Logo upload failed:', err);
      throw err;
    }
  }, [isAdministrativeModeActive, modifyStoreConfiguration]);

  /**
   * updateReferenceLogo: Updates a specific logo in the references grid.
   */
  const updateReferenceLogo = useCallback(async (referenceId: number, visualFile: File) => {
    if (!isAdministrativeModeActive) return;
    try {
      const fileName = `ref-${STORE_SLUG}-${referenceId}-${Date.now()}.jpg`;
      const storagePath = `references/${fileName}`;

      const { error: uploadError } = await supabase.storage.from(TECH.storage.bucket).upload(storagePath, visualFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(TECH.storage.bucket).getPublicUrl(storagePath);
      const finalizedUrl = `${publicUrl}?t=${Date.now()}`;

      const updatedRefs = activeStoreSettings.referencesData.map(ref => 
        ref.id === referenceId ? { ...ref, logo: finalizedUrl } : ref
      );
      
      await modifyStoreConfiguration('referencesData', updatedRefs);
      return finalizedUrl;
    } catch (err) {
      console.error('Reference logo update failed:', err);
      throw err;
    }
  }, [isAdministrativeModeActive, activeStoreSettings.referencesData, modifyStoreConfiguration]);

  return { 
    settings: activeStoreSettings, 
    updateSetting: modifyStoreConfiguration, 
    uploadLogo: uploadStoreLogo,
    updateReferenceLogo,
    loading: isSettingsDataLoading 
  };
}
