// FILE ROLE: Interactive Category Header for Product Grid (Diamond Standard)
// DEPENDS ON: OrderSelector, QuickEditModal, THEME
import { memo, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME, LABELS } from '../data/config';
import OrderSelector from './OrderSelector';
import QuickEditModal from './QuickEditModal';
import { CategoryHeaderProps } from '../types';

/**
 * CATEGORY HEADER (DIAMOND EDITION)
 * -----------------------------------------------------------
 * Responsive and interactive header for category sections.
 * Supports long-press renaming and instant reordering for admins.
 */
const CategoryHeader = memo(
  ({
    categoryName,
    productCount,
    isAdmin,
    onRename,
    onOrderChange,
    currentOrder,
    totalCategories,
  }: CategoryHeaderProps) => {
    const theme = THEME.productGrid.header;
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

    // LONG PRESS LOGIC: Elegant way to trigger rename for admins
    const handlePointerDown = useCallback(() => {
      if (!isAdmin) return;
      longPressTimer.current = setTimeout(() => {
        setIsRenameModalOpen(true);
      }, 600); // Diamond Standard Long Press
    }, [isAdmin]);

    const handlePointerUp = useCallback(() => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }, []);

    return (
      <div 
        className={`${theme.wrapper} group relative select-none`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="flex items-center gap-3 shrink-0">
          <AnimatePresence>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mr-1"
              >
                <OrderSelector
                  currentOrder={currentOrder}
                  totalCount={totalCategories}
                  onChange={(newPos) => onOrderChange(categoryName, newPos)}
                  className="!shadow-none !bg-transparent !border-none !h-8 !w-8"
                  variant="small"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <h2 className={`${theme.title} ${isAdmin ? 'cursor-edit' : ''}`}>
            {categoryName}
          </h2>
        </div>

        <div className={theme.line}></div>

        <span className={theme.count}>
          {productCount} {LABELS.productCountSuffix}
        </span>

        {/* ADMIN RENAME MODAL */}
        <QuickEditModal
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          onSave={(newName) => {
            if (newName && newName.trim() && newName !== categoryName) {
              onRename(categoryName, newName.trim());
            }
          }}
          title="Reyon Adını Değiştir"
          subtitle="Bu reyonun adını güncelleyerek dükkan nizamını koruyabilirsiniz."
          initialValue={categoryName}
          placeholder="Yeni reyon adı girin..."
        />
      </div>
    );
  }
);

export default CategoryHeader;
