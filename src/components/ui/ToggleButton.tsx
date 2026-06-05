import React, { memo } from 'react';
import { motion } from 'motion/react';
import Button from './Button';

interface ToggleOption<T> {
  value: T;
  label: React.ReactNode;
}

interface ToggleButtonProps<T> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const ToggleButton = memo(<T extends string | number | boolean>({
  options,
  value,
  onChange,
  className = '',
  buttonClassName = '',
  size = 'md',
}: ToggleButtonProps<T>) => {
  const isSm = size === 'sm';
  const containerClass = isSm
    ? 'bg-stone-100 p-0.5 rounded-[12px] flex relative overflow-hidden gap-0.5'
    : 'bg-stone-100 p-0.5 rounded-[16px] flex relative overflow-hidden gap-0.5';
  const buttonHeightClass = isSm ? 'h-7 !text-[10px]' : 'h-9';
  const buttonRoundedClass = isSm ? '!rounded-[10px]' : '!rounded-[12px]';

  return (
    <div className={`${containerClass} ${className}`}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <Button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            variant={isActive ? 'primary' : 'ghost'}
            size={size}
            className={`z-10 relative ${buttonRoundedClass} ${buttonHeightClass} transition-all flex-1 ${buttonClassName}`}
            mode="rectangle"
          >
            {isActive && (
              <motion.div
                layoutId="active-toggle-bg"
                className={`absolute inset-0 bg-stone-900 ${buttonRoundedClass} -z-10`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-20 ${isActive ? 'text-white font-black' : 'text-stone-500 font-bold'}`}>
              {opt.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}) as <T>(props: ToggleButtonProps<T>) => React.ReactElement;

export default ToggleButton;
