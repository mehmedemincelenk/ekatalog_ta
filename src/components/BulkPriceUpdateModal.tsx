import { useState, memo } from 'react';
import { THEME, LABELS } from '../data/config';
import Button from './Button';
import { Product } from '../types';

interface BulkPriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (categories: string[], amount: number, isPercentage: boolean, isIncrease: boolean) => Promise<void>;
  categories: string[];
  allProducts: Product[];
}

const BulkPriceUpdateModal = memo(({ isOpen, onClose, onUpdate, categories, allProducts = [] }: BulkPriceUpdateModalProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isIncrease, setIsIncrease] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const modalTheme = THEME.addProductModal;
  const globalTheme = THEME;
  const labels = LABELS.bulkPriceUpdate;

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = async () => {
    if (isIncrease === null) {
      alert('Lütfen yapılacak işlemi seçiniz (ZAM veya İNDİRİM).');
      return;
    }

    const isPercentage = inputValue.includes('%');
    const amount = parseFloat(inputValue.replace('%', '').replace(',', '.')) || 0;

    if (amount <= 0) {
      alert(labels.invalidValue);
      return;
    }

    const productsToUpdate = allProducts.filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category));
    const affectedCount = productsToUpdate.length;
    
    if (affectedCount === 0) {
      alert(labels.noProducts);
      return;
    }

    const confirmMsg = labels.confirm(selectedCategories.length, affectedCount, isIncrease);
    
    if (!window.confirm(confirmMsg)) return;

    setIsProcessing(true);
    try {
      await onUpdate(selectedCategories, amount, isPercentage, isIncrease);
      alert('Uygulandı');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={modalTheme.overlay}>
      <div className={`${modalTheme.container} max-w-[340px]`}>
        {/* HEADER */}
        <div className={`${modalTheme.header} flex-col items-start gap-1`}>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tighter uppercase">{labels.title}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              mode="circle" 
              onClick={onClose} 
              icon={globalTheme.icons.close} 
            />
          </div>
          <p className="text-[10px] leading-tight text-stone-500 font-medium lowercase first-letter:uppercase">
            {labels.description}
          </p>
        </div>

        {/* BODY */}
        <div className={modalTheme.body}>
          <div className={modalTheme.formGap}>
            
            {/* CATEGORY SELECTION */}
            <div className="space-y-3">
              <label className={modalTheme.typography.label}>{labels.categoryLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={selectedCategories.includes(cat) ? modalTheme.categoryChipActive : modalTheme.categoryChipInactive}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT & DIRECTION ROW */}
            <div className="flex items-end gap-3">
              <div className="flex-[0.8] space-y-2">
                <label className={modalTheme.typography.label}>MİKTAR</label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="5 veya %5"
                  className={modalTheme.inputField}
                />
              </div>
              <div className="flex-[1.2] flex gap-2 h-full">
                <button
                  onClick={() => setIsIncrease(true)}
                  className={`flex-1 py-2.5 rounded-lg font-black text-[9px] transition-all border-2 ${isIncrease === true ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'}`}
                >
                  ZAM
                </button>
                <button
                  onClick={() => setIsIncrease(false)}
                  className={`flex-1 py-2.5 rounded-lg font-black text-[9px] transition-all border-2 ${isIncrease === false ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-stone-400 border-stone-200 hover:border-red-400 hover:text-red-500'}`}
                >
                  İNDİRİM
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-stone-100 flex gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-3 rounded-xl border-2 border-stone-100 shadow-sm"
          >
            İptal
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={isProcessing}
            className="flex-[1.5] py-3 rounded-xl shadow-xl"
          >
            {isProcessing ? labels.processingBtn : labels.submitBtn}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default BulkPriceUpdateModal;
