import { usePricingRotation } from '../../hooks/mainpage/usePricingRotation';
import { StickyPromoBar } from '../mainpage/StickyPromoBar';
import { HeroSection } from '../mainpage/HeroSection';
import { PricingSection } from '../mainpage/PricingSection';
import { CTASection } from '../mainpage/CTASection';
import { LandingFooter } from '../mainpage/LandingFooter';

/**
 * LANDING PAGE (ekatalog.site)
 * -----------------------------------------------------------
 * Main sales page for the product. Modular and optimized.
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
