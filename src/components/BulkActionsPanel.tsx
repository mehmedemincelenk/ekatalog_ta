import React from 'react';
import { LABELS } from '../data/config';

interface BulkActionsPanelProps {
  selectedCount: number;
  categories: string[];
  onCancel: () => void;
  onDelete: () => void;
  onArchiveToggle: () => void;
  onStockToggle: () => void;
  onChangeCategory: (newCategory: string) => void;
  onChangeName: () => void;
  onChangePrice: () => void;
}

export default function BulkActionsPanel({
  selectedCount,
  categories,
  onCancel,
  onDelete,
  onArchiveToggle,
  onStockToggle,
  onChangeCategory,
  onChangeName,
  onChangePrice,
}: BulkActionsPanelProps) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-2 animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-stone-900 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-2xl text-center uppercase tracking-widest mb-1 border border-white/20">
        {selectedCount} Seçili
      </div>

      <button onClick={onCancel} className="bg-white hover:bg-stone-100 text-stone-600 border border-stone-300 shadow-xl rounded-xl w-12 h-12 flex items-center justify-center transition-all active:scale-90 group relative" title="İptal">
        <span className="text-lg font-black">×</span>
        <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">İptal</span>
      </button>

      <button onClick={onDelete} className="bg-white hover:bg-red-50 text-red-500 border border-stone-200 shadow-xl rounded-xl w-12 h-12 flex items-center justify-center transition-all active:scale-90 group relative" title={LABELS.adminActions.delete}>
        <span className="text-lg">🗑️</span>
        <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{LABELS.adminActions.delete}</span>
      </button>

      <button onClick={onArchiveToggle} className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-xl rounded-xl w-12 h-12 flex items-center justify-center transition-all active:scale-90 group relative" title={LABELS.adminActions.archive}>
        <span className="text-lg">📦</span>
        <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{LABELS.adminActions.archive}</span>
      </button>

      <button onClick={onStockToggle} className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-xl rounded-xl w-12 h-12 flex items-center justify-center transition-all active:scale-90 group relative" title={LABELS.adminActions.inStock}>
        <span className="text-lg">✅</span>
        <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{LABELS.adminActions.inStock}</span>
      </button>

      <div className="relative w-12 h-12 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-xl rounded-xl flex items-center justify-center transition-all active:scale-90 group">
        <span className="text-lg">🏷️</span>
        <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{LABELS.adminActions.categories}</span>
        <select 
          onChange={(e) => { if(e.target.value) { onChangeCategory(e.target.value); e.target.value = ""; } }}
          value=""
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full appearance-none"
        >
          <option value="" disabled>Kategori Seç...</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button onClick={onChangeName} className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-xl rounded-xl w-12 h-12 flex items-center justify-center transition-all active:scale-90 group relative" title="İsim Değiştir">
        <span className="text-lg">✏️</span>
        <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">İsim Değiştir</span>
      </button>

      <button onClick={onChangePrice} className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-xl rounded-xl w-12 h-12 flex items-center justify-center transition-all active:scale-90 group relative" title="Fiyat Değiştir">
        <span className="text-lg">💰</span>
        <span className="absolute right-14 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Fiyat Değiştir</span>
      </button>
    </div>
  );
}
