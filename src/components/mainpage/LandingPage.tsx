import { usePricingRotation } from '../../hooks/mainpage/usePricingRotation';
import { useLandingConfig } from '../../hooks/mainpage/useLandingConfig';
import { StickyPromoBar } from './StickyPromoBar';
import { HeroSection } from './HeroSection';
import { PricingSection } from './PricingSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';

/**
 * LANDING PAGE (ekatalog.site)
 * -----------------------------------------------------------
 * Main sales page for the product. Now fully encapsulated in mainpage/ module.
 */
export default function LandingPage() {
  const { config, loading } = useLandingConfig();
  const { currentPhrase } = usePricingRotation(config.pricing_rotation);

  if (loading) return null; // Or a minimalist spinner

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-stone-900 selection:text-white">
      <StickyPromoBar />
      <HeroSection title={config.hero_title} subtitle={config.hero_subtitle} />
      <PricingSection amount={config.pricing_amount} currentPhrase={currentPhrase} />
      <CTASection whatsapp={config.whatsapp_number} />
      <LandingFooter />
    </div>
  );
}
