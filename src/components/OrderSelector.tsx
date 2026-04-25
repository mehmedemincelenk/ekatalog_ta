import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { OrderSelectorProps } from '../types';

/**
 * UNIVERSAL ORDER SELECTOR (Diamond Standard)
 * -----------------------------------------------------------
 * Supports isDark prop for high-contrast scenarios.
 */
const OrderSelector = memo(
  ({
    currentOrder,
    totalCount,
    onChange,
    variant = 'small',
    className = '',
    isDark = false,
  }: OrderSelectorProps) => {
    const sizeClass =
      variant === 'small'
        ? 'w-7 h-7'
        : variant === 'medium'
          ? 'w-8 h-8'
          : 'w-10 h-10';
    const radiusClass = 'rounded-full'; // Projenin genel yumuşak köşeli nizamına uygun

    return (
      <div
        className={`
        relative flex items-center justify-center shadow-2xl transition-all active:scale-95 group border
        ${
          isDark
            ? 'bg-stone-900 border-stone-800 hover:bg-black text-white'
            : 'bg-white/95 backdrop-blur-md border-white/40 hover:bg-white text-stone-900'
        }
        ${sizeClass} ${radiusClass} ${className}
      `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* DISPLAY NUMBER */}
        <div className="flex items-center justify-center overflow-hidden w-6 h-full pointer-events-none relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOrder}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <span
                className={`font-black tracking-tighter flex items-center justify-center ${variant === 'large' ? 'text-[14px]' : 'text-[12px]'}`}
              >
                {currentOrder}.
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* GHOST SELECT DROPDOWN */}
        <select
          value={currentOrder}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val !== currentOrder) onChange(val);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[5] appearance-none"
          onClick={(e) => e.stopPropagation()}
        >
          {Array.from({ length: totalCount }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}. Sıraya Alalım
            </option>
          ))}
        </select>
      </div>
    );
  },
);

export default OrderSelector;
