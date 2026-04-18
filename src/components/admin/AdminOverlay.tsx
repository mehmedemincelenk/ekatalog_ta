import FloatingAdminMenu from './FloatingAdminMenu';
import AddProductModal from './modals/AddProductModal';
import BulkPriceUpdateModal from './modals/BulkPriceUpdateModal';
import { Product } from '../../types';

interface AdminOverlayProps {
  allProducts: Product[];
  categoryOrder: string[];
  addProduct: (productData: Omit<Product, 'id' | 'is_archived'>, initialImage?: File) => Promise<void>;
  bulkUpdatePrices: (targetCategories: string[], amount: number, isPercentage: boolean, isIncrease: boolean) => Promise<void>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isOpen: boolean) => void;
  isBulkUpdateModalOpen: boolean;
  setIsBulkUpdateModalOpen: (isOpen: boolean) => void;
  editMode: 'modal' | 'inline';
  toggleEditMode: () => void;
  requestConfirmation: (options: { title: string, message: string, onConfirm: () => void, variant?: 'danger' | 'primary' }) => void;
}

/**
 * ADMIN OVERLAY COMPONENT
 * -----------------------------------------------------------
 * Orchestrates all admin-only modals and floating menus.
 */
export default function AdminOverlay({
  allProducts,
  categoryOrder,
  addProduct,
  bulkUpdatePrices,
  isAddModalOpen,
  setIsAddModalOpen,
  isBulkUpdateModalOpen,
  setIsBulkUpdateModalOpen,
  editMode,
  toggleEditMode,
  requestConfirmation
}: AdminOverlayProps) {
  return (
    <>
      <FloatingAdminMenu 
        onProductAddTrigger={() => setIsAddModalOpen(true)} 
        onBulkUpdateTrigger={() => setIsBulkUpdateModalOpen(true)} 
        editMode={editMode}
        onToggleEditMode={toggleEditMode}
      />
      
      {isAddModalOpen && (
        <AddProductModal 
          onModalClose={() => setIsAddModalOpen(false)} 
          onProductAddition={addProduct} 
          availableCategories={categoryOrder} 
        />
      )}
      
      {isBulkUpdateModalOpen && (
        <BulkPriceUpdateModal 
          onClose={() => setIsBulkUpdateModalOpen(false)} 
          allProducts={allProducts} 
          categories={categoryOrder} 
          onUpdate={bulkUpdatePrices} 
          requestConfirmation={requestConfirmation}
        />
      )}
    </>
  );
}
