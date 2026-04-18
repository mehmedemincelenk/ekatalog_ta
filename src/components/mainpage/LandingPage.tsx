import { usePricingRotation } from '../../hooks/mainpage/usePricingRotation';
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
  const { currentPhrase } = usePricingRotation();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-stone-900 selection:text-white">
      <StickyPromoBar />
      <HeroSection />
      <PricingSection currentPhrase={currentPhrase} />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
