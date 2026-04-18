import CatalogView from './components/layout/CatalogView';
import LandingPage from './components/layout/LandingPage';
import { getActiveStoreSlug } from './utils/helpers/store';

/**
 * MAIN APP
 * -----------------------------------------------------------
 * Acts as a traffic controller (Conductor).
 * Decides whether to show the Landing Page or a specific Store Catalog.
 */
export default function App() {
  const currentSlug = getActiveStoreSlug();

  // Route to the marketing landing page for the main domain
  if (currentSlug === 'main-site') {
    return <LandingPage />;
  }

  // Route to the dynamic catalog view for subdomains
  return <CatalogView />;
}




