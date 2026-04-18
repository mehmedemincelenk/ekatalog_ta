import { memo } from 'react';

interface CategoryEmptyStateProps {
  isAdmin: boolean;
  onAddClick?: () => void;
}

/**
 * ATOM: CategoryEmptyState
 * -----------------------------------------------------------
 * Renders a placeholder for empty categories with an optional CTA.
 */
export const CategoryEmptyState = memo(({ isAdmin, onAddClick }: CategoryEmptyStateProps) => (
  <div className="py-16 border-2 border-dashed border-stone-100 rounded-2xl flex flex-col items-center justify-center bg-stone-50/30 animate-in fade-in duration-500">
    <p className="text-stone-400 text-xs font-medium italic mb-4">
      {isAdmin ? "Bu reyon henüz boş." : "Bu reyonda henüz ürün bulunmuyor."}
    </p>
    {isAdmin && (
      <button 
        onClick={onAddClick}
        className="bg-stone-900/5 text-stone-900 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all border border-stone-200 shadow-sm active:scale-95"
      >
        + BU REYONA ÜRÜN EKLE
      </button>
    )}
  </div>
));
