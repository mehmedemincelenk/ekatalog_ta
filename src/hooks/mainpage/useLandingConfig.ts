import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DEFAULT_COMPANY, TECH } from '../../data/config';
import { LandingConfig } from '../../types';
import { PRICING_PHRASES } from './usePricingRotation';

/**
 * useLandingConfig: Fetches and manages dynamic settings for the landing page.
 * Falls back to DEFAULT_COMPANY and hardcoded phrases if database record is missing.
 */
export function useLandingConfig() {
  const [config, setConfig] = useState<LandingConfig>({
    whatsapp_number: DEFAULT_COMPANY.phone,
    pricing_amount: '200',
    pricing_rotation: PRICING_PHRASES,
    hero_title: 'basit. sade.\nekatalog.',
    hero_subtitle: 'Fiyatlar zamlandığında kataloglarınızı tek tek güncellemek gibi angarya maliyetlere veda edin, ekataloğunuzdan fiyatlarınızı saniyeler içinde güncelleyin.'
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from(TECH.tables.siteConfig)
        .select('*')
        .eq('id', 'landing_main') // Assume a single record with this ID
        .single();

      if (data && !error) {
        setConfig({
          whatsapp_number: data.whatsapp_number || DEFAULT_COMPANY.phone,
          pricing_amount: data.pricing_amount || '200',
          pricing_rotation: data.pricing_rotation || PRICING_PHRASES,
          hero_title: data.hero_title || 'basit. sade.\nekatalog.',
          hero_subtitle: data.hero_subtitle || 'Fiyatlar zamlandığında kataloglarınızı tek tek güncellemek gibi angarya maliyetlere veda edin, ekataloğunuzdan fiyatlarınızı saniyeler içinde güncelleyin.'
        });
      }
    } catch (err) {
      console.error('Failed to fetch landing config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading };
}
