import React, { useState, memo } from 'react';
import { LABELS, MODAL } from '../data/config';
import { Product } from '../types';

/**
 * ADD PRODUCT MODAL
 * ----------------------------------
 * Yeni ürün ekleme kapısı. Resimler artık doğrudan Supabase Storage'a gider.
 */

interface AddProductModalProps {
  isOpen: boolean;
  categories: string[];
  onAdd: (product: Omit<Product, 'id' | 'is_archived'>, imageFile?: File) => void;
  onClose: () => void;
}

const EMPTY_FORM = {
  name: '',
  category: '',
  newCategory: '',
  price: '',
  description: '',
  imageFile: null as File | null,
  inStock: true,
};

// --- YARDIMCI BİLEŞENLER ---

const FormInput = memo(({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-xs font-semibold text-stone-600 mb-1">{label}</label>
    <input
      {...props}
      className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kraft-400 transition outline-none"
    />
  </div>
));

const ImagePicker = memo(({ previewUrl, onFileChange }: { previewUrl: string | null, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-20 h-20 shrink-0 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shadow-inner">
      {previewUrl ? (
        <img src={previewUrl} alt={LABELS.form.preview} className="w-full h-full object-cover" />
      ) : (
        <span className="text-3xl text-stone-300">📷</span>
      )}
    </div>
    <label className="cursor-pointer text-xs font-bold text-kraft-700 hover:text-kraft-900 transition-colors border border-kraft-200 px-4 py-1.5 rounded-full bg-kraft-50/50 uppercase tracking-tight">
      {LABELS.form.selectImage}
      <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
    </label>
  </div>
));

const CategorySelector = memo(({ categories, selected, newCategory, onSelect, onNewCategoryChange }: { 
  categories: string[], 
  selected: string, 
  newCategory: string,
  onSelect: (cat: string) => void,
  onNewCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div>
    <label className="block text-xs font-semibold text-stone-600 mb-2">{LABELS.form.category}</label>
    {categories.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mb-3">
        {categories.map((cat) => (
          <button 
            key={cat} 
            type="button" 
            onClick={() => onSelect(cat)} 
            className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all ${selected === cat && !newCategory ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>
    )}
    <input 
      name="newCategory" 
      type="text" 
      value={newCategory} 
      onChange={onNewCategoryChange} 
      placeholder={LABELS.form.newCategoryPlaceholder} 
      className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kraft-400 transition outline-none italic" 
    />
  </div>
));

export default function AddProductModal({
  isOpen,
  categories = [],
  onAdd,
  onClose,
}: AddProductModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return; // Yükleme sırasında kapattırma
    setForm(EMPTY_FORM);
    setPreviewUrl(null);
    setError('');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: value,
      category: name === 'newCategory' && value.trim() ? '' : prev.category 
    }));
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setForm(prev => ({ ...prev, imageFile: file }));
    
    // Geçici önizleme
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const finalCategory = form.newCategory.trim() || form.category.trim();
    
    if (!form.name.trim() || !finalCategory || !form.price.trim()) {
      setError(LABELS.form.requiredFieldsError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        name: form.name.trim(),
        category: finalCategory,
        price: form.price.trim(),
        description: form.description.trim(),
        image: null,
        inStock: form.inStock,
      }, form.imageFile || undefined);
      handleClose();
    } catch (err) {
      setError("Ürün eklenirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${MODAL.overlayBg} backdrop-blur-sm px-4 py-8`} role="dialog">
      <div className={`${MODAL.bgClass} w-full ${MODAL.maxWidthClass} ${MODAL.roundingClass} ${MODAL.shadowClass} flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}>
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-tight">{LABELS.newProductBtn}</h2>
          <button type="button" onClick={handleClose} disabled={isSubmitting} className="text-stone-400 hover:text-stone-900 transition-colors text-2xl leading-none disabled:opacity-30">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
          <ImagePicker previewUrl={previewUrl} onFileChange={handleImageChange} />

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 shadow-inner">
              <label className="text-xs font-bold text-stone-700 uppercase" htmlFor="add-instock">{LABELS.form.stockStatus}</label>
              <input id="add-instock" type="checkbox" checked={form.inStock} onChange={(e) => setForm(p => ({ ...p, inStock: e.target.checked }))} className="w-5 h-5 text-stone-900 border-stone-300 rounded-lg focus:ring-0 cursor-pointer" />
            </div>

            <FormInput label={LABELS.form.productName} name="name" value={form.name} onChange={handleChange} placeholder={LABELS.form.productNamePlaceholder} required disabled={isSubmitting} />
            
            <CategorySelector categories={categories} selected={form.category} newCategory={form.newCategory} onSelect={(cat) => setForm(p => ({ ...p, category: cat, newCategory: '' }))} onNewCategoryChange={handleChange} />

            <FormInput label={LABELS.form.price} name="price" value={form.price} onChange={handleChange} placeholder={LABELS.form.pricePlaceholder} required disabled={isSubmitting} />
            
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">{LABELS.form.description}</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} disabled={isSubmitting} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kraft-400 transition outline-none disabled:bg-stone-50" placeholder={LABELS.form.descriptionPlaceholder} />
            </div>
          </div>

          {error && (
            <div className={`bg-red-50 text-red-600 text-[10px] font-bold uppercase p-2 rounded-lg text-center border border-red-100`}>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} disabled={isSubmitting} className="flex-1 py-3 border border-stone-200 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-50 transition uppercase disabled:opacity-50">{LABELS.form.cancelBtn}</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition shadow-lg uppercase tracking-widest flex items-center justify-center gap-2 disabled:bg-stone-600">
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>EKLENİYOR...</span>
                </>
              ) : LABELS.form.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
