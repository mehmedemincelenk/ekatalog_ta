import { memo } from 'react';
import AdminOverlay from '../../admin/AdminOverlay';
import PinModal from '../../admin/PinModal';
import ConfirmModal from '../../ui/ConfirmModal';
import InputModal from '../../ui/InputModal';
import { CatalogLogic } from '../../../hooks/useCatalogLogic';

interface CatalogOverlayManagerProps {
  admin: CatalogLogic['admin'] & { editMode: CatalogLogic['editMode'] };
  allProducts: CatalogLogic['allProducts'];
  categoryOrder: CatalogLogic['categoryOrder'];
  isAddModalOpen: CatalogLogic['isAddModalOpen'];
  setIsAddModalOpen: CatalogLogic['setIsAddModalOpen'];
  isBulkUpdateModalOpen: CatalogLogic['isBulkUpdateModalOpen'];
  setIsBulkUpdateModalOpen: CatalogLogic['setIsBulkUpdateModalOpen'];
  confirmModal: CatalogLogic['confirmModal'];
  stringEditor: CatalogLogic['stringEditor'];
  actions: CatalogLogic['actions'] & { toggleEditMode: CatalogLogic['toggleEditMode'] };
}

/**
 * CATALOG OVERLAY MANAGER
 * -----------------------------------------------------------
 * Handles all floating layers, modals, and administrative tools.
 * Now manages the global string editor modal.
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
  stringEditor,
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
        editMode={admin.editMode || 'modal'}
        toggleEditMode={actions.toggleEditMode}
        requestConfirmation={actions.requestConfirmation}
      />
    )}

    {admin.isPinModalOpen && (
      <PinModal 
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

    {/* GLOBAL STRING EDITOR MODAL */}
    {stringEditor.isOpen && (
      <InputModal 
        title={stringEditor.title}
        initialValue={stringEditor.initialValue}
        onConfirm={async (val) => {
          await stringEditor.onConfirm(val);
          stringEditor.closeEditor();
        }}
        onCancel={stringEditor.closeEditor}
      />
    )}
  </>
));
