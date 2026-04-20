<<<<<<< HEAD
import { useState, useEffect, useCallback, useMemo } from 'react';
=======
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> master
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import SearchFilter from './components/SearchFilter';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import FloatingAdminMenu from './components/FloatingAdminMenu';
import AddProductModal from './components/AddProductModal';
import BulkPriceUpdateModal from './components/BulkPriceUpdateModal';
import PinModal from './components/PinModal';
<<<<<<< HEAD
import References from './components/References';
import LandingPage from './components/LandingPage';
=======
import QRModal from './components/QRModal';
import References from './components/References';
import LandingPage from './components/LandingPage';
import DisplaySettingsModal from './components/DisplaySettingsModal';
>>>>>>> master
import { useProducts } from './hooks/useProducts';
import { useAdminMode } from './hooks/useAdminMode';
import { useDiscount } from './hooks/useDiscount';
import { useSettings } from './hooks/useSettings';
import { UI } from './data/config';
import { getActiveStoreSlug } from './utils/store';

/**
 * CATALOG VIEW: Sadece dükkanlar için çalışan ana bileşen.
 */
function CatalogView() {
<<<<<<< HEAD
  const { isAdmin, handleLogoPointerDown, handleLogoPointerUp, logout, isPinModalOpen, setIsPinModalOpen, correctPin, onPinSuccess } = useAdminMode();
  const { settings, loading: settingsLoading } = useSettings(isAdmin);
=======
  const { 
    isAdmin, 
    handleLogoPointerDown, 
    handleLogoPointerUp, 
    isPinModalOpen, 
    setIsPinModalOpen, 
    isQRModalOpen,
    setIsQRModalOpen,
    verifyPinWithServer, 
    onPinSuccess,
    isInlineEnabled,
    toggleInlineEdit,
    isLockedOut,
    failedAttempts
  } = useAdminMode();
  const { settings, updateSetting, loading: settingsLoading, notFound, isError, retry } = useSettings(isAdmin);
>>>>>>> master
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  const { 
    products, 
    allProducts,
    categoryOrder, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    reorderCategory: updateCategoryOrder, 
    reorderProductsInCategory,
    renameCategory, 
<<<<<<< HEAD
    removeCategoryFromProducts, 
    addCategory, 
    bulkUpdatePrices,
    uploadImage,
    loading: productsLoading 
  } = useProducts(search, activeCategories, isAdmin);
=======
    executeGranularBulkActions,
    uploadImage,
    loading: productsLoading 
  } = useProducts(search, activeCategories, isAdmin, settings, updateSetting);
>>>>>>> master
  
  const { activeDiscount, applyCode, error: discountError } = useDiscount();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
<<<<<<< HEAD
  const [visibleCategoryLimit, setVisibleCategoryLimit] = useState(2);

  // FAVICON & TITLE SYNC
  useEffect(() => {
    if (!settings.id) return;
    document.title = settings.title || 'E-Katalog';
    if (settings.logoEmoji && (settings.logoEmoji.startsWith('data:image') || settings.logoEmoji.startsWith('http'))) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = settings.logoEmoji;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [settings.logoEmoji, settings.title, settings.id]);
=======
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false);
  const [activeAdminProductId, setActiveAdminProductId] = useState<string | null>(null);
  const [visibleCategoryLimit, setVisibleCategoryLimit] = useState(2);

  // FAVICON & TITLE SYNC (With Fallback Protection)
  useEffect(() => {
    // 1. Title Sync
    const baseTitle = settings.title || 'E-Katalog';
    document.title = isAdmin ? `[Admin] ${baseTitle}` : baseTitle;

    // 2. Favicon Sync
    if (!settings.id) return;
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    
    // Fallback logic: Use logoUrl if it's a valid path/URI
    if (settings.logoUrl) {
      link.href = settings.logoUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [settings.logoUrl, settings.title, settings.id, isAdmin]);
>>>>>>> master

  if (settingsLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
      </div>
    );
  }

<<<<<<< HEAD
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         (p.description?.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategories.length === 0 || activeCategories.includes(p.category);
    const isVisible = !p.is_archived || isAdmin;
    return matchesSearch && matchesCategory && isVisible;
  });

  return (
    <div className={`min-h-screen ${UI.layout.bodyBg} ${UI.layout.selection} font-sans`}>
      <Navbar onLogoPointerDown={handleLogoPointerDown} onLogoPointerUp={handleLogoPointerUp} onLogout={logout} isAdmin={isAdmin} settings={settings} />
=======
  if (isError) {
    return (
      <div className={UI.errorState.overlay}>
        <div className={UI.errorState.card}>
          <span className={UI.errorState.icon}>📡</span>
          <h2 className={UI.errorState.title}>Bağlantı Hatası</h2>
          <p className={UI.errorState.description}>Dükkan verileri yüklenirken bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.</p>
          <button onClick={retry} className={UI.errorState.button}>TEKRAR DENE</button>
        </div>
      </div>
    );
  }

  if (notFound) {
    return <LandingPage />;
  }


  return (
    <div className={`min-h-screen ${UI.layout.bodyBg} ${UI.layout.selection} font-sans fade-in`}>
      <Navbar onLogoPointerDown={handleLogoPointerDown} onLogoPointerUp={handleLogoPointerUp} isAdmin={isAdmin} isInlineEnabled={isInlineEnabled} settings={settings} updateSetting={updateSetting} />
>>>>>>> master
      <main>
        <HeroCarousel isAdminModeActive={isAdmin} />
        <SearchFilter 
          products={products} categoryOrder={categoryOrder} onCategoryOrderChange={updateCategoryOrder}
          search={search} onSearchChange={setSearch} activeCategories={activeCategories} onCategoryToggle={(cat) => {
            if (cat === 'Tüm Ürünler') setActiveCategories([]);
            else setActiveCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
          }}
<<<<<<< HEAD
          isAdmin={isAdmin} renameCategory={renameCategory} removeCategoryFromProducts={removeCategoryFromProducts}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid 
            products={filteredProducts} categoryOrder={categoryOrder} isAdmin={isAdmin}
=======
          isAdmin={isAdmin} renameCategory={renameCategory}
          displayConfig={settings.displayConfig}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid 
            products={products} categoryOrder={categoryOrder} isAdmin={isAdmin} isInlineEnabled={isInlineEnabled}
>>>>>>> master
            onDelete={deleteProduct} onUpdate={updateProduct} onOrderUpdate={reorderProductsInCategory}
            onImageUpload={uploadImage}
            activeDiscount={activeDiscount} visibleCategoryLimit={visibleCategoryLimit}
            onLoadMore={() => setVisibleCategoryLimit(prev => prev + 3)}
            activeCategories={activeCategories} onAddClick={() => setIsAddModalOpen(true)}
<<<<<<< HEAD
          />
        </div>
        {!isAdmin && <References />}
      </main>
      <Footer onLogoClick={() => {}} isAdmin={isAdmin} activeDiscount={activeDiscount} onApplyDiscount={applyCode} discountError={discountError} settings={settings} />
      {isAdmin && (
        <>
          <FloatingAdminMenu onProductAddTrigger={() => setIsAddModalOpen(true)} onBulkUpdateTrigger={() => setIsBulkUpdateModalOpen(true)} />
          <AddProductModal isModalOpen={isAddModalOpen} onModalClose={() => setIsAddModalOpen(false)} onProductAddition={addProduct} availableCategories={categoryOrder} />
          <BulkPriceUpdateModal isOpen={isBulkUpdateModalOpen} onClose={() => setIsBulkUpdateModalOpen(false)} allProducts={allProducts} categories={categoryOrder} onUpdate={bulkUpdatePrices} />
        </>
      )}
      <PinModal isModalOpen={isPinModalOpen} authorizedPinCode={correctPin} onAuthenticationSuccess={onPinSuccess} onModalClose={() => setIsPinModalOpen(false)} />
=======
            activeAdminProductId={activeAdminProductId}
            setActiveAdminProductId={setActiveAdminProductId}
          />
        </div>
        {settings.displayConfig.showReferences && (
          <>
            {!isAdmin && <References isInlineEnabled={isInlineEnabled} />}
            {isAdmin && <References isAdmin={true} isInlineEnabled={isInlineEnabled} />}
          </>
        )}
      </main>
      <Footer 
        onLogoClick={() => {}} 
        onQRClick={() => setIsQRModalOpen(true)}
        isAdmin={isAdmin} 
        activeDiscount={activeDiscount} 
        onApplyDiscount={applyCode} 
        discountError={discountError} 
        settings={settings} 
      />
      
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />

      <AnimatePresence mode="popLayout">
        {isAdmin && (
          <>
            <motion.div
              key="floating-menu"
              initial={false}
              animate={{ opacity: 1, scale: 1, transform: 'translateZ(0)' }}
              exit={{ opacity: 0, filter: 'blur(15px)', scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="fixed bottom-2 right-2 z-[150]"
            >
              <FloatingAdminMenu 
                onProductAddTrigger={() => setIsAddModalOpen(true)} 
                onBulkUpdateTrigger={() => setIsBulkUpdateModalOpen(true)} 
                isInlineEnabled={isInlineEnabled} 
                onToggleInline={toggleInlineEdit} 
                onSettingsTrigger={() => setIsDisplaySettingsOpen(true)}
              />
            </motion.div>

            {/* Admin Modals (Separated to stay full-screen) */}
            <AddProductModal isModalOpen={isAddModalOpen} onModalClose={() => setIsAddModalOpen(false)} onProductAddition={addProduct} availableCategories={categoryOrder} />
            <BulkPriceUpdateModal 
              isOpen={isBulkUpdateModalOpen} 
              onClose={() => setIsBulkUpdateModalOpen(false)} 
              allProducts={allProducts} 
              categories={categoryOrder} 
              onGranularUpdate={executeGranularBulkActions}
            />
            <DisplaySettingsModal isOpen={isDisplaySettingsOpen} onClose={() => setIsDisplaySettingsOpen(false)} settings={settings} updateSetting={updateSetting} />
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPinModalOpen && (
          <PinModal 
            isModalOpen={true} 
            onVerify={verifyPinWithServer} 
            onAuthenticationSuccess={onPinSuccess} 
            onModalClose={() => setIsPinModalOpen(false)} 
            isLockedOut={isLockedOut} 
            failedAttempts={failedAttempts}
          />
        )}
      </AnimatePresence>
>>>>>>> master
    </div>
  );
}

/**
 * MAIN APP: Ana sayfa mı yoksa dükkan mı olduğuna burada karar verilir.
 */
export default function App() {
  const currentSlug = getActiveStoreSlug();

  // Eğer ana sayfadaysak kataloğa dair HİÇBİR hook çalışmaz, direkt tanıtım sayfası gelir.
  if (currentSlug === 'main-site') {
    return <LandingPage />;
  }

  // Sadece subdomain varsa kataloğu yükle.
  return <CatalogView />;
}
