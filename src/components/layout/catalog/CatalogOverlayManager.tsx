import { memo } from 'react';
import AdminOverlay from '../../admin/AdminOverlay';
import PinModal from '../../admin/PinModal';
import ConfirmModal from '../../ui/ConfirmModal';

interface CatalogOverlayManagerProps {
  admin: any;
  allProducts: any[];
  categoryOrder: string[];
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
  isBulkUpdateModalOpen: boolean;
  setIsBulkUpdateModalOpen: (val: boolean) => void;
  confirmModal: any;
  actions: any;
}

/**
 * CATALOG OVERLAY MANAGER
 * -----------------------------------------------------------
 * Handles all floating layers, modals, and administrative tools.
 */
export const CatalogOverlayManager = memo(({
  admin,
  allProducts,
  categoryOrder,
  isAddModalOpen,
  setIsAddModalOpen,
  isBulkUpdateModalOpen,
  setIsBulkUpdateModalOpen,
  confirmModal,
  actions
}: CatalogOverlayManagerProps) => (
  <>
    {admin.isAdmin && (
      <AdminOverlay 
        allProducts={allProducts} 
        categoryOrder={categoryOrder} 
        addProduct={actions.addProduct} 
        bulkUpdatePrices={actions.bulkUpdatePrices} 
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        isBulkUpdateModalOpen={isBulkUpdateModalOpen}
        setIsBulkUpdateModalOpen={setIsBulkUpdateModalOpen}
        requestConfirmation={actions.requestConfirmation}
      />
    )}

    {admin.isPinModalOpen && (
      <PinModal 
        authorizedPinCode={admin.correctPin} 
        onAuthenticationSuccess={admin.onPinSuccess} 
        onModalClose={() => admin.setIsPinModalOpen(false)} 
      />
    )}

    {confirmModal.isOpen && (
      <ConfirmModal 
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.close}
        variant={confirmModal.variant}
      />
    )}
  </>
));
