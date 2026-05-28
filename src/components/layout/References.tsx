import { useState, useRef, memo } from 'react';
import { THEME } from '../../data/config';
import { useReferencesFlow } from '../../hooks/useReferencesFlow';
import { useMarqueePhysics } from '../../hooks/useMarqueePhysics';
import Button from '../ui/Button';
import { QuickEditModal } from '../modals/UtilityModals';
import * as Lucide from 'lucide-react';
import { ReferencesProps, Reference } from '../../types';


// Admin-only ReferenceCard for editing
const AdminReferenceCard = memo(
  ({
    refData,
    currentIndex,
    totalItems,
    onOrderChange,
    onDelete,
    onEdit,
    onUploadLogo,
    isUploading,
  }: {
    refData: Reference;
    currentIndex: number;
    totalItems: number;
    onOrderChange: (id: number, newIndex: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, name: string) => void;
    onUploadLogo: (id: number, file: File) => void;
    isUploading: boolean;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUploadLogo(refData.id, file);
      }
    };

    return (
      <div
        className="relative flex flex-col items-center justify-center p-4 pt-8 border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)] hover:shadow-lg hover:shadow-stone-200/60 transition-all duration-300 rounded-xl overflow-hidden w-full h-28 select-none"
      >
        {/* LOADING SPINNER OVERLAY */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center z-30">
            <Lucide.Loader2 size={16} className="text-stone-900 animate-spin" />
          </div>
        )}

        {/* STANDARDIZED ADMINISTRATIVE CONTROLS OVERLAY */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-20" onClick={(e) => e.stopPropagation()}>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* INTERACTIVE SEQUENCE BADGE (SELECT OVERLAY) */}
          <div className="relative w-6 h-6 flex items-center justify-center rounded-md border border-white/20 shadow-sm bg-stone-900/60 backdrop-blur-md">
            <select
              value={currentIndex}
              onChange={(e) => {
                const newPos = Number(e.target.value);
                onOrderChange(refData.id, newPos);
              }}
              className="absolute inset-0 cursor-pointer opacity-0 z-10"
            >
              {Array.from({ length: totalItems }).map((_, i) => (
                <option key={i} value={i}>
                  {i + 1}.
                </option>
              ))}
            </select>
            <span className="text-white text-[9px] font-black">
              {currentIndex + 1}.
            </span>
          </div>

          {!isDeleteConfirming ? (
            <>
              {/* CHANGE LOGO */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="glass"
                mode="square"
                className="!w-6 !h-6 !bg-stone-900/60 backdrop-blur-md border border-white/20 text-white shadow-sm !rounded-md !p-0 cursor-pointer"
                icon={<Lucide.ImagePlus size={11} strokeWidth={2.5} />}
                title="Logo Yükle/Değiştir"
              />

              {/* EDIT NAME */}
              <Button
                onClick={() => onEdit(refData.id, refData.name)}
                variant="glass"
                mode="square"
                className="!w-6 !h-6 !bg-stone-900/60 backdrop-blur-md border border-white/20 text-white shadow-sm !rounded-md !p-0 cursor-pointer"
                icon={<Lucide.Pencil size={11} strokeWidth={2.5} />}
                title="İsmi Düzenle"
              />

              {/* DELETE */}
              <Button
                onClick={() => setIsDeleteConfirming(true)}
                variant="glass"
                mode="square"
                className="!w-6 !h-6 !bg-stone-900/60 backdrop-blur-md border border-white/20 text-white shadow-sm !rounded-md !p-0 cursor-pointer hover:!bg-red-500/80"
                icon={<Lucide.Trash2 size={12} strokeWidth={2.5} />}
                title="Referansı Sil"
              />
            </>
          ) : (
            <div className="flex gap-1 animate-in slide-in-from-right-1 duration-200">
              <Button
                onClick={() => {
                  onDelete(refData.id);
                  setIsDeleteConfirming(false);
                }}
                variant="action"
                mode="square"
                className="!w-6 !h-6 !p-0 !rounded-md shadow-sm"
                icon={<Lucide.Check size={11} strokeWidth={4} />}
              />
              <Button
                onClick={() => setIsDeleteConfirming(false)}
                variant="glass"
                mode="square"
                className="!w-6 !h-6 !bg-stone-900/60 backdrop-blur-md border border-white/20 text-white shadow-sm !rounded-md !p-0"
                icon={<Lucide.X size={11} strokeWidth={3} />}
              />
            </div>
          )}
        </div>

        {/* LOGO IMAGE OR TEXT PLACEHOLDER */}
        {refData.logo && (refData.logo.startsWith('/') || refData.logo.startsWith('http')) ? (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <img
              src={refData.logo}
              alt={refData.name}
              className="h-8 w-auto max-w-[80%] object-contain"
            />
            <span className="text-[8px] font-black tracking-[0.1em] text-stone-400 uppercase leading-none">
              {refData.name}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 py-1">
            <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200/60 flex items-center justify-center text-[9px] font-black text-stone-600 uppercase shadow-inner">
              {refData.name.slice(0, 2)}
            </div>
            <span className="text-[10px] font-black text-stone-700 uppercase tracking-widest leading-none">
              {refData.name}
            </span>
          </div>
        )}
      </div>
    );
  },
);

export default function References({
  isAdmin = false,
}: ReferencesProps) {
  const {
    activeReferences,
    activeQuickEdit,
    setActiveQuickEdit,
    handleDelete,
    handleSaveEdit,
    handleUploadLogo,
    handleOrderChange,
    isUploading,
  } = useReferencesFlow(isAdmin);

  const {
    trackRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useMarqueePhysics(activeReferences.length, isAdmin);

  // Repeat activeReferences enough times to guarantee perfect seamless scrolling overlay
  const marqueeItems = [];
  if (activeReferences.length > 0) {
    const baseItems = [];
    const repeatCount = Math.max(1, Math.ceil(12 / activeReferences.length));
    for (let i = 0; i < repeatCount; i++) {
      baseItems.push(...activeReferences);
    }
    marqueeItems.push(...baseItems, ...baseItems);
  }


  // --- ADMIN MODE VIEW ---
  if (isAdmin) {
    const referencesTheme = THEME.references;
    return (
      <section className={`${referencesTheme.layout} !py-8`}>
        <div className={referencesTheme.container}>
          {/* CENTERED HEADER SECTION */}
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <h2 className="text-2xl font-black text-stone-900 tracking-tighter uppercase leading-none">
              REFERANSLARIMIZ (DÜZENLEME MODU)
            </h2>
            <div className="w-12 h-1 bg-stone-900 mt-4 mb-2 rounded-full opacity-10"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center w-full">
            {activeReferences.map((ref, idx) => (
              <AdminReferenceCard
                key={ref.id}
                refData={ref}
                currentIndex={idx}
                totalItems={activeReferences.length}
                onOrderChange={handleOrderChange}
                onDelete={handleDelete}
                onEdit={(id, name) => setActiveQuickEdit({ id, name })}
                onUploadLogo={handleUploadLogo}
                isUploading={isUploading === ref.id}
              />
            ))}

            {activeReferences.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-stone-100 rounded-xl py-16 flex flex-col items-center justify-center gap-3 text-stone-300 bg-stone-50/50 w-full">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-100 mb-2">
                  <span className="text-xl">🤝</span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-center px-8 leading-loose opacity-60">
                  HENÜZ REFERANS EKLENMEMİŞ
                </span>
                <p className="text-[9px] font-bold text-stone-400 italic">
                  Sağ alttaki "+" butonuna basıp "Yeni Referans"ı seçin
                </p>
              </div>
            )}
          </div>
        </div>

        <QuickEditModal
          isOpen={!!activeQuickEdit}
          onClose={() => setActiveQuickEdit(null)}
          onSave={handleSaveEdit}
          initialValue={activeQuickEdit?.name || ''}
          placeholder="Referans adı..."
        />
      </section>
    );
  }

  // --- VISITOR/GUEST MODE VIEW (PREMIUM SLIDING MARQUEE) ---
  return (
    <section className="w-full max-w-full overflow-hidden select-none py-4 bg-white">
      <div className="w-full max-w-full overflow-hidden relative">
        {/* Subtle premium edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y' }}
          className="w-full max-w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          <div
            ref={trackRef}
            style={{ transform: 'translate3d(0px, 0, 0)' }}
            className="flex gap-10 py-1.5 items-center shrink-0 w-max"
          >
            {marqueeItems.map((ref, idx) => (
              <div
                key={`${ref.id}-${idx}`}
                className="flex items-center justify-center shrink-0 px-2 min-w-0"
              >
                {ref.logo && (ref.logo.startsWith('/') || ref.logo.startsWith('http')) ? (
                  <img
                    src={ref.logo}
                    alt={ref.name}
                    decoding="async"
                    draggable={false}
                    className="h-10 sm:h-12 w-auto object-contain opacity-100 select-none pointer-events-none transition-all duration-300 ease-out"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-stone-400 select-none pointer-events-none transition-all duration-300 ease-out">
                    {ref.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
