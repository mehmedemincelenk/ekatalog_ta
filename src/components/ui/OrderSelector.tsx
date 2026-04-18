import { memo } from 'react';

interface OrderSelectorProps {
  currentOrder: number;
  totalCount: number;
  onChange: (newPosition: number) => void;
  className?: string;
  selectClass?: string;
}

/**
 * ORDER SELECTOR
 * -----------------------------------------------------------
 * A reusable, specialized select component for reordering items.
 * Encapsulates the "invisible select" logic used across the app.
 */
const OrderSelector = memo(({ 
  currentOrder, 
  totalCount, 
  onChange, 
  className = "relative w-full h-full",
  selectClass = "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
}: OrderSelectorProps) => {
  return (
    <div className={className}>
      <span className="pointer-events-none">{currentOrder}.</span>
      <select 
        value={currentOrder}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className={selectClass}
        onClick={(e) => e.stopPropagation()}
      >
        {Array.from({ length: totalCount }, (_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
    </div>
  );
});

export default OrderSelector;
