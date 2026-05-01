import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useStore } from '../store';
import { getActiveStoreSlug, fetchCurrentRates } from '../utils/core';
import { CompanySettings } from '../types';
import { CATEGORY_ORDER as DEFAULT_ORDER } from '../data/config';

const STORE_SLUG = getActiveStoreSlug();

/**
 * SETTINGS HUB (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Unified orchestrator for store branding, currency, and configuration.
 */

// --- 1. SETTINGS QUERY (Data Layer) ---

export function useSettingsQuery() {

  return useQuery({
    queryKey: ['settings', STORE_SLUG],
    queryFn: async () => {
      // Parallel execution: Settings + Currency Rates
      const [settingsRes, rates] = await Promise.all([
        supabase.from('stores').select('*').eq('slug', STORE_SLUG).maybeSingle(),
        fetchCurrentRates(),
      ]);

      if (settingsRes.error) throw settingsRes.error;
      if (!settingsRes.data) return null;

      const raw = settingsRes.data;
      const settings: CompanySettings = {
        id: raw.id,
        title: raw.name || '',
        logoUrl: raw.logo_url,
        activeCurrency: raw.active_currency || 'TRY',
        categoryOrder: raw.category_order || DEFAULT_ORDER,
        carouselData: raw.carousel_data || { slides: [] },
        referencesData: raw.references_data || [],
        socialProofCards: raw.social_proof_cards || [],
        maintenanceMode: raw.maintenance_mode || { enabled: false, message: '' },
        exchangeRates: rates || { usd: 0, eur: 0 },
        whatsapp: raw.phone || '',
        address: raw.address || '',
        instagram: raw.instagram_url || '',
        subtitle: raw.tagline || '',
        name: raw.name || '',
        displayConfig: raw.display_config || {},
        announcementBar: raw.announcement_bar || { enabled: false, text: '' },
        visitor_leads: raw.visitor_leads || [],
      };

      return settings;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// --- 2. SETTINGS COORDINATOR (Main Hook) ---

export function useSettings(isAdmin: boolean) {
  const setSettingsStore = useStore((state) => state.setSettings);
  const queryClient = useQueryClient();
  const { data: settings, isLoading: loading, isError } = useSettingsQuery();

  useEffect(() => {
    if (settings) setSettingsStore(settings);
  }, [settings, setSettingsStore]);

  const updateMutation = useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: keyof CompanySettings;
      value: CompanySettings[keyof CompanySettings];
    }) => {
      if (!settings?.id) throw new Error('Settings not loaded');

      const dbMap: Record<string, string> = {
        title: 'name',
        logoUrl: 'logo_url',
        activeCurrency: 'active_currency',
        categoryOrder: 'category_order',
        carouselData: 'carousel_data',
        maintenanceMode: 'maintenance_mode',
        referencesData: 'references_data',
        socialProofCards: 'social_proof_cards',
        whatsapp: 'phone',
        address: 'address',
        instagram: 'instagram_url',
        subtitle: 'tagline',
        name: 'name',
        displayConfig: 'display_config',
        announcementBar: 'announcement_bar',
        visitor_leads: 'visitor_leads',
      };

      const { error } = await supabase
        .from('stores')
        .update({ [dbMap[key] || key]: value })
        .eq('id', settings.id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['settings', STORE_SLUG] }),
  });

  return {
    settings: settings || ({} as CompanySettings),
    updateSetting: async <K extends keyof CompanySettings>(
      key: K,
      value: CompanySettings[K],
    ) => {
      if (!isAdmin) console.warn('Admin mode not active');
      await updateMutation.mutateAsync({ key, value });
    },
    loading,
    notFound: !loading && !settings,
    isError,
    addVisitorLead: async (phone: string) => {
      if (!settings?.id) return;
      const currentLeads = Array.isArray(settings.visitor_leads) ? settings.visitor_leads : [];
      const newLead = { phone, created_at: new Date().toISOString() };
      
      const { error } = await supabase
        .from('stores')
        .update({ visitor_leads: [...currentLeads, newLead] })
        .eq('id', settings.id);
      
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['settings', STORE_SLUG] });
    },
    retry: () =>
      queryClient.invalidateQueries({ queryKey: ['settings', STORE_SLUG] }),
  };
}
