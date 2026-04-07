import { useState } from 'react';
import { GRID, sortCategories } from '../data/config';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categoryOrder: string[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Product>) => void;
  onOrderUpdate: (newOrder: Product[]) => void;
  activeDiscount?: { code: string; rate: number; category?: string } | null;
}

export default function ProductGrid({
  products,
  categoryOrder,
  isAdmin,
  onDelete,
  onUpdate,
  onOrderUpdate,
  activeDiscount,
}: ProductGridProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
        <span className="text-5xl mb-3">🔍</span>
        <p className="text-sm font-medium">Ürün bulunamadı.</p>
      </div>
    );
  }

  // Gruplama
  const groupedProducts = products.reduce((acc: Record<string, Product[]>, product) => {
    const catName = product.category || 'KATEGORİSİZ / DİĞER';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const sortedCategories = sortCategories(Object.keys(groupedProducts), categoryOrder);

  const reorder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const sourceIdx = products.findIndex(p => p.id === sourceId);
    const targetIdx = products.findIndex(p => p.id === targetId);
    if (sourceIdx !== -1 && targetIdx !== -1) {
      const sourceProduct = products[sourceIdx];
      const targetProduct = products[targetIdx];
      if (sourceProduct.category !== targetProduct.category) return;
      const newProducts = [...products];
      newProducts.splice(sourceIdx, 1);
      newProducts.splice(targetIdx, 0, sourceProduct);
      onOrderUpdate(newProducts);
    }
  };

  const handleDragStart = (_e: React.DragEvent, id: string) => {
    if (!isAdmin) return;
    setDraggedId(id);
    if (_e.dataTransfer) {
      _e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragEnter = (id: string) => {
    if (!isAdmin || !draggedId || draggedId === id) return;
    reorder(draggedId, id);
  };

  const handleTouchStart = (_e: React.TouchEvent, id: string) => {
    if (!isAdmin) return;
    setDraggedId(id);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isAdmin || !draggedId) return;
    const touch = e.changedTouches[0];
    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetId = targetEl?.closest('[data-product-id]')?.getAttribute('data-product-id');
    if (targetId) reorder(draggedId, targetId);
    setDraggedId(null);
  };

  return (
    <div className="w-full flex flex-col">
      {sortedCategories.map((catName) => (
        <div key={catName} className="flex flex-col mb-8">
          <h2 className={GRID.headerClass}>{catName}</h2>
          <div className={`grid ${GRID.colsClass} ${GRID.gapClass}`}>
            {groupedProducts[catName].map((product) => (
              <div
                key={product.id}
                onDragEnter={() => handleDragEnter(product.id)}
                className={`transition-all duration-300 ease-in-out ${
                  draggedId === product.id ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <ProductCard
                  product={product}
                  categories={sortedCategories}
                  isAdmin={isAdmin}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onDragStart={handleDragStart}
                  onDragEnd={() => setDraggedId(null)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  activeDiscount={activeDiscount}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
