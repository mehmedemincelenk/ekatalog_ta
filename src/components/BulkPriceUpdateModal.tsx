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
  const [currentStep, setCurrentStep] = useState(1);
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

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const isPercentage = inputValue.includes('%');
  const amount = parseFloat(inputValue.replace('%', '').replace(',', '.')) || 0;
  const productsToUpdate = allProducts.filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category));
  const affectedCount = productsToUpdate.length;

  const handleApply = async () => {
    if (isIncrease === null || amount <= 0 || affectedCount === 0) return;

    setIsProcessing(true);
    try {
      await onUpdate(selectedCategories, amount, isPercentage, isIncrease!);
      onClose();
      // Reset after success
      setCurrentStep(1);
      setSelectedCategories([]);
      setInputValue('');
      setIsIncrease(null);
    } catch (_err) {
      alert("Bir hata oluştu.");
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
            <h2 className="text-sm font-black text-stone-900 tracking-widest uppercase">{labels.title}</h2>
            <Button variant="ghost" size="sm" onClick={() => { onClose(); setCurrentStep(1); }} icon={globalTheme.icons.close} />
          </div>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3].map(step => (
              <div key={step} className={`h-1 w-6 rounded-full transition-colors ${currentStep >= step ? 'bg-kraft-600' : 'bg-stone-200'}`} />
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className={modalTheme.body}>
          
          {/* STEP 1: CATEGORY SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-4 fade-in">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-stone-800 text-sm">HEDEF SEÇİMİ</h3>
                <p className="text-[10px] text-stone-500">Güncellemek istediğiniz reyonları seçin.</p>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto py-1">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={selectedCategories.length === 0 ? modalTheme.categoryChipActive : modalTheme.categoryChipInactive}
                >
                  TÜMÜ
                </button>
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
              <Button onClick={nextStep} variant="primary" className="w-full" mode="rectangle">
                {selectedCategories.length === 0 ? 'TÜM REYONLARLA DEVAM ET' : `${selectedCategories.length} REYON SEÇİLDİ`}
              </Button>
            </div>
          )}

          {/* STEP 2: AMOUNT & DIRECTION */}
          {currentStep === 2 && (
            <div className="space-y-6 fade-in">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-stone-800 text-sm">MİKTAR BELİRLE</h3>
                <p className="text-[10px] text-stone-500">Örn: 10 veya %10</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Değer giriniz..."
                    className={modalTheme.inputField}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsIncrease(true)}
                    className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all border-2 ${isIncrease === true ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-[1.02]' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'}`}
                  >
                    ZAM YAP (+)
                  </button>
                  <button
                    onClick={() => setIsIncrease(false)}
                    className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all border-2 ${isIncrease === false ? 'bg-red-600 text-white border-red-600 shadow-lg scale-[1.02]' : 'bg-white text-stone-400 border-stone-100 hover:border-red-100 hover:text-red-500'}`}
                  >
                    İNDİRİM YAP (-)
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 text-[10px] font-black text-stone-400 underline uppercase">Geri</button>
                <Button onClick={nextStep} disabled={amount <= 0 || isIncrease === null} variant="primary" className="flex-[2]" mode="rectangle">HESAPLA</Button>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & CONFIRM */}
          {currentStep === 3 && (
            <div className="space-y-6 fade-in">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-stone-800 text-sm">SON ONAY</h3>
                <p className="text-[10px] text-stone-500">Aşağıdaki işlem kalıcı olarak uygulanacak.</p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 font-medium">Hedef:</span>
                  <span className="font-bold text-stone-900">{selectedCategories.length === 0 ? 'TÜM REYONLAR' : `${selectedCategories.length} REYON`}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 font-medium">Etkilenecek Ürün:</span>
                  <span className="font-bold text-stone-900">{affectedCount} Ürün</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-200">
                  <span className="text-stone-500 font-medium">Uygulanacak:</span>
                  <span className={`font-black ${isIncrease ? 'text-stone-900' : 'text-red-600'}`}>
                    {isIncrease ? '+' : '-'} {inputValue} {isPercentage ? '' : 'TL'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={prevStep} disabled={isProcessing} variant="secondary" className="flex-1" mode="rectangle">DÜZELT</Button>
                <Button 
                  onClick={handleApply}
                  disabled={isProcessing || affectedCount === 0}
                  variant="primary" 
                  className="flex-[1.5]" 
                  mode="rectangle"
                  icon={isProcessing ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                >
                  {isProcessing ? 'İŞLENİYOR...' : 'UYGULA'}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
});

export default BulkPriceUpdateModal;
