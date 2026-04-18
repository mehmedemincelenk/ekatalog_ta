import Navbar from './catalog/Navbar';
import Footer from './catalog/footer/Footer';
import MetadataSync from './MetadataSync';
import LoadingSpinner from '../ui/LoadingSpinner';
import { CatalogMain } from './catalog/CatalogMain';
import { CatalogOverlayManager } from './catalog/CatalogOverlayManager';
import { useCatalogLogic } from '../../hooks/useCatalogLogic';
import { UI } from '../../data/config';

/**
 * CATALOG VIEW (Declarative Layout)
 * -----------------------------------------------------------
 * The main layout orchestrator for the store application.
 * Modularized for better maintainability.
 */
export default function CatalogView() {
  const {
    admin,
    settings,
    search,
    activeCategories,
    visibleCategoryLimit,
    isAddModalOpen,
    isBulkUpdateModalOpen,
    isLoading,
    filteredProducts,
    allProducts,
    categoryOrder,
    activeDiscount,
    discountError,
    activeReferences,
    confirmModal,
    setSearch,
    setIsAddModalOpen,
    setIsBulkUpdateModalOpen,
    actions
  } = useCatalogLogic();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen ${UI.layout.bodyBg} ${UI.layout.selection} font-sans`}>
      <MetadataSync settings={settings} />
      
      <Navbar 
        logoGestureActions={admin.logoGestureActions} 
        onLogout={admin.logout} 
        isAdmin={admin.isAdmin} 
        settings={settings} 
        onLogoUpdate={async (file) => { await actions.uploadLogo(file); }}
      />

      <CatalogMain 
        isAdmin={admin.isAdmin}
        allProducts={allProducts}
        filteredProducts={filteredProducts}
        categoryOrder={categoryOrder}
        activeCategories={activeCategories}
        search={search}
        visibleCategoryLimit={visibleCategoryLimit}
        actions={actions}
        setSearch={setSearch}
        setIsAddModalOpen={setIsAddModalOpen}
        activeReferences={activeReferences}
        activeDiscount={activeDiscount}
      />

      <Footer 
        isAdmin={admin.isAdmin} 
        activeDiscount={activeDiscount} 
        onApplyDiscount={actions.applyDiscount} 
        discountError={discountError} 
        settings={settings} 
      />

      <CatalogOverlayManager 
        admin={admin}
        allProducts={allProducts}
        categoryOrder={categoryOrder}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        isBulkUpdateModalOpen={isBulkUpdateModalOpen}
        setIsBulkUpdateModalOpen={setIsBulkUpdateModalOpen}
        confirmModal={confirmModal}
        actions={actions}
      />
    </div>
  );
}
