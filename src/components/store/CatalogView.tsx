import Navbar from './layout/Navbar';
import Footer from './layout/footer/Footer';
import MetadataSync from './MetadataSync';
import LoadingSpinner from '../ui/LoadingSpinner';
import { CatalogMain } from './layout/CatalogMain';
import { CatalogOverlayManager } from './layout/CatalogOverlayManager';
import { useCatalogLogic } from '../../hooks/useCatalogLogic';
import { UI } from '../../data/config';

/**
 * CATALOG VIEW (Declarative Layout)
 * -----------------------------------------------------------
 * The main layout orchestrator for the store application.
 * Now located in src/components/store/
 */
export default function CatalogView() {
  const logic = useCatalogLogic();

  if (logic.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen ${UI.layout.bodyBg} ${UI.layout.selection} font-sans`}>
      <MetadataSync settings={logic.settings} />
      
      <Navbar 
        logoGestureActions={logic.admin.logoGestureActions} 
        isAdmin={logic.admin.isAdmin} 
        editMode={logic.editMode}
        settings={logic.settings} 
        onLogoUpdate={async (file) => { await logic.actions.uploadLogo(file); }}
        onUpdateSetting={logic.actions.updateSetting}
        openEditor={logic.stringEditor.openEditor}
      />

      <CatalogMain 
        isAdmin={logic.admin.isAdmin}
        editMode={logic.editMode}
        openEditor={logic.stringEditor.openEditor}
        allProducts={logic.allProducts}
        filteredProducts={logic.filteredProducts}
        categoryOrder={logic.categoryOrder}
        sortedCategories={logic.sortedCategories}
        categoryStats={logic.categoryStats}
        activeCategories={logic.activeCategories}
        search={logic.search}
        visibleCategoryLimit={logic.visibleCategoryLimit}
        carouselSlides={logic.carouselSlides}
        actions={logic.actions}
        setSearch={logic.setSearch}
        setIsAddModalOpen={logic.setIsAddModalOpen}
        activeReferences={logic.activeReferences}
        activeDiscount={logic.activeDiscount}
      />

      <Footer 
        onLogoClick={() => logic.admin.logoGestureActions.onPointerDown({} as any)}
        isAdmin={logic.admin.isAdmin} 
        activeDiscount={logic.activeDiscount} 
        onApplyDiscount={logic.actions.applyDiscount} 
        discountError={logic.discountError} 
        settings={logic.settings} 
      />

      <CatalogOverlayManager 
        admin={{ ...logic.admin, editMode: logic.editMode }}
        allProducts={logic.allProducts}
        categoryOrder={logic.categoryOrder}
        isAddModalOpen={logic.isAddModalOpen}
        setIsAddModalOpen={logic.setIsAddModalOpen}
        isBulkUpdateModalOpen={logic.isBulkUpdateModalOpen}
        setIsBulkUpdateModalOpen={logic.setIsBulkUpdateModalOpen}
        confirmModal={logic.confirmModal}
        stringEditor={logic.stringEditor}
        actions={{ ...logic.actions, toggleEditMode: logic.toggleEditMode }}
      />
    </div>
  );
}
