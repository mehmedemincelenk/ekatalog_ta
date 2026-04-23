import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import AddProductModal from './AddProductModal';
import BulkPriceUpdateModal from './BulkPriceUpdateModal';
import PinModal from './PinModal';
import QRModal from './QRModal';
import DisplaySettingsModal from './DisplaySettingsModal';
import CouponModal from './CouponModal';
import PriceListModal from './PriceListModal';
import GlobalAddMenuModal from './GlobalAddMenuModal';
import AIStudioCompareModal from './AIStudioCompareModal';

import { useStore } from '../store';
import { useProducts } from '../hooks/useProductsHub';
import { useAdminMode } from '../hooks/useAdminMode';
import { useDiscount } from '../hooks/useDiscount';

/**
 * APP MODALS CONTAINER (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Centralizes all global application modals to keep App.tsx clean.
 * Now fully data-driven via useStore (Zustand).
 */
const AppModals = memo(() => {
  const {
    activeModal,
    modalData,
    closeModal,
    isAdmin,
    settings,
    searchQuery,
    updateSetting,
    activeDiscount,
    visitorCurrency
  } = useStore();

  const {
    products,
    allProducts,
    categoryOrder,
    addProduct,
    updateProduct,
    uploadImage,
    executeGranularBulkActions,
    addCategory
  } = useProducts(searchQuery, [], isAdmin, settings);

  const {
    verifyPinWithServer,
    onPinSuccess,
    isLockedOut,
    failedAttempts,
    isInlineEnabled,
    toggleInlineEdit
  } = useAdminMode();

  const { applyCode, error: discountError } = useDiscount();

  const displayCurrency = isAdmin
    ? settings?.activeCurrency || 'TRY'
    : visitorCurrency;

  const handleGlobalAddAction = (
    type: 'PRODUCT' | 'CATEGORY' | 'REFERENCE' | 'CAROUSEL',
  ) => {
    if (type === 'PRODUCT') {
      // Just switch the active modal
      useStore.getState().openModal('ADD_PRODUCT');
    } else if (type === 'CATEGORY') {
      const name = window.prompt('Yeni Reyon/Kategori Adı:');
      if (name) addCategory(name);
    } else if (type === 'REFERENCE') {
      const name = window.prompt('Yeni Referans/İş Ortağı Adı:');
      if (name) {
        const currentRefs = settings?.referencesData || [];
        updateSetting('referencesData', [
          ...currentRefs,
          { id: Date.now(), name, logo: '' },
        ]);
      }
    } else if (type === 'CAROUSEL') {
      window.dispatchEvent(new CustomEvent('ekatalog:add-carousel-slide'));
    }
  };

  return (
    <>
      <QRModal
        isOpen={activeModal === 'QR'}
        onClose={closeModal}
      />

      <AnimatePresence>
        {isAdmin && (
          <>
            <AddProductModal
              isModalOpen={activeModal === 'ADD_PRODUCT'}
              onModalClose={closeModal}
              onProductAddition={async (data, file) => {
                const newId = await addProduct(data);
                if (file && newId) {
                  await uploadImage({ id: newId, file });
                }
              }}
              availableCategories={categoryOrder}
              initialCategory={modalData?.category}
            />

            <BulkPriceUpdateModal
              isOpen={activeModal === 'BULK_UPDATE'}
              onClose={closeModal}
              allProducts={allProducts}
              categories={categoryOrder}
              onGranularUpdate={executeGranularBulkActions}
            />

            {settings && (
              <DisplaySettingsModal
                key={activeModal === 'DISPLAY_SETTINGS' ? 'active' : 'inactive'}
                isOpen={activeModal === 'DISPLAY_SETTINGS'}
                onClose={closeModal}
                settings={settings}
                updateSetting={updateSetting}
                isInlineEnabled={isInlineEnabled}
                onToggleInline={toggleInlineEdit}
              />
            )}

            <GlobalAddMenuModal
              isOpen={activeModal === 'GLOBAL_ADD_MENU'}
              onClose={closeModal}
              onAction={handleGlobalAddAction}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeModal === 'PIN' && (
          <PinModal
            isModalOpen={true}
            onVerify={verifyPinWithServer}
            onAuthenticationSuccess={onPinSuccess}
            onModalClose={closeModal}
            isLockedOut={isLockedOut}
            failedAttempts={failedAttempts}
          />
        )}
      </AnimatePresence>

      <CouponModal
        key={activeModal === 'COUPON' ? 'active' : 'inactive'}
        isOpen={activeModal === 'COUPON'}
        onClose={closeModal}
        onApplyDiscount={applyCode}
        activeDiscount={activeDiscount}
        discountError={discountError}
      />

      {settings && (
        <PriceListModal
          isOpen={activeModal === 'PRICE_LIST'}
          onClose={closeModal}
          products={allProducts}
          categories={categoryOrder}
          displayCurrency={displayCurrency}
          exchangeRates={settings.exchangeRates}
          activeDiscount={activeDiscount}
          storeName={settings.title || 'Katalog'}
        />
      )}

      <AIStudioCompareModal
        isOpen={activeModal === 'AI_STUDIO_COMPARE'}
        product={modalData?.product}
        onClose={closeModal}
        onApply={(productId, polishedUrl) => {
          updateProduct({
            id: productId,
            changes: {
              image_url: polishedUrl,
              polished_ready_dismissed: true,
            },
          });
          closeModal();
        }}
        onDismiss={(productId) => {
          updateProduct({
            id: productId,
            changes: { polished_ready_dismissed: true },
          });
          closeModal();
        }}
      />
    </>
  );
});

export default AppModals;
