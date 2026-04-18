import { memo, useMemo } from 'react';

interface OrderSelectorProps {
  currentOrder: number;
  totalCount: number;
  onChange: (newOrder: number) => void;
  className?: string;
  variant?: 'chip' | 'floating';
}

/**
 * ATOMIC COMPONENT: OrderSelector
 * -----------------------------------------------------------
 * Specialized input for reordering items (Categories or Products).
 * Uses a native select overlaid on a visual badge for the best mobile experience.
 */
const OrderSelector = memo(({ 
  currentOrder, 
  totalCount, 
  onChange, 
  className = "",
  variant = 'chip'
}: OrderSelectorProps) => {
  
  // Logic: Generate range [1 ... totalCount]
  const options = useMemo(() => 
    Array.from({ length: Math.max(1, totalCount) }, (_, i) => i + 1), 
    [totalCount]
  );

  const variantStyles = {
    chip: "w-7 h-7 sm:w-8 sm:h-8",
    floating: "w-6 h-6 bg-white/90 backdrop-blur-md shadow-lg border border-stone-200 rounded-lg"
  };

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 font-black transition-all duration-300 overflow-hidden rounded-full group cursor-pointer ${variantStyles[variant]} ${className}`}
      onClick={(e) => e.stopPropagation()} // STOP BUBBLING
    >
      {/* Visual Number */}
      <span className="z-0 pointer-events-none">{currentOrder}</span>
      
      {/* Invisible Native Select Trigger */}
      <select
        value={currentOrder}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerDown={(e) => e.stopPropagation()} // Prevent logo gesture
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none"
        aria-label="Change position"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      
      {/* Admin Hover State */}
      <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
});

export default OrderSelector;
