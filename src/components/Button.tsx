import React from 'react';
import { Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'success'
    | 'glass'
    | 'whatsapp'
    | 'kraft';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  mode?: 'circle' | 'rectangle' | 'square';
  loading?: boolean;
  // Master Button Extensions
  description?: string;
  selected?: boolean;
  layout?: 'vertical' | 'horizontal';
  badge?: string;
}

/**
 * MASTER BUTTON (DIAMOND STANDARD)
 * -----------------------------------------------------------
 * The ultimate clickable unit. Handles everything from simple 
 * action triggers to complex selection cards.
 */
const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  variant = 'secondary',
  size = 'md',
  mode = 'rectangle',
  loading,
  className = '',
  disabled,
  description,
  selected,
  layout = 'horizontal',
  badge,
  ...props
}) => {
  const isCard = !!description || selected !== undefined;
  const isVertical = layout === 'vertical';

  const baseStyles = 'relative inline-flex items-center justify-center transition-all duration-300 font-black uppercase tracking-widest active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden';
  
  const variants = {
    primary: 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-200',
    secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200',
    outline: 'border-2 border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900',
    ghost: 'text-stone-500 hover:bg-stone-50 hover:text-stone-900',
    danger: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
    success: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white',
    glass: 'bg-white/80 backdrop-blur-md text-stone-900 border border-white/50 hover:bg-white shadow-xl',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-green-100',
    kraft: 'bg-[#e3d5c1] text-[#5d4037] hover:bg-[#d7c4aa]',
  };

  const sizes = {
    xs: 'px-2 py-1 text-[8px] gap-1',
    sm: 'px-3 py-1.5 text-[9px] gap-1.5',
    md: 'px-6 py-3 text-xs gap-2',
    lg: 'px-8 py-4 text-sm gap-3',
    xl: 'px-10 py-5 text-base gap-4',
  };

  const modes = {
    circle: 'rounded-full aspect-square !p-0',
    square: 'rounded-2xl aspect-square !p-0',
    rectangle: isCard ? 'rounded-[2.5rem]' : 'rounded-2xl',
  };

  // Card specific styles override
  const cardStyles = isCard ? `
    !flex border-2 text-left w-full justify-start
    ${isVertical ? 'flex-col items-center p-8 rounded-[3rem] text-center' : 'items-center gap-5 p-6'}
    ${selected 
      ? 'bg-stone-900 border-stone-900 text-white shadow-2xl scale-[1.02] z-10' 
      : 'bg-stone-50 border-stone-100 text-stone-600 hover:border-stone-300 hover:bg-white'}
  ` : '';

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${modes[mode]} 
        ${cardStyles}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 bg-inherit flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* SELECTION CHECKMARK */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
          <Check size={14} className="text-stone-900" strokeWidth={3} />
        </div>
      )}

      {/* BADGE */}
      {badge && (
        <div className="absolute -top-1 left-6 px-3 py-1 bg-amber-400 text-stone-900 text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm border border-white">
          {badge}
        </div>
      )}

      {/* ICON / PREVIEW UNIT */}
      {icon && (
        <div className={`
          flex items-center justify-center shrink-0 transition-transform duration-300
          ${isCard ? (isVertical ? 'w-20 h-28 mb-4' : 'w-14 h-14 rounded-3xl bg-white shadow-sm text-stone-400') : ''}
          ${selected && isCard ? 'bg-white text-stone-900 shadow-xl' : ''}
        `}>
          {icon}
        </div>
      )}

      {/* CONTENT UNIT */}
      <div className={`
        ${isCard ? 'flex-1 min-w-0' : ''}
        ${selected && !isVertical ? 'pr-8' : ''}
      `}>
        {isCard ? (
          <>
            <div className={`
              ${description ? 'font-black text-sm mb-0.5 block' : 'flex items-center justify-between w-full'}
            `}>
              {children}
            </div>
            {description && (
              <p className={`
                text-[10px] lowercase leading-relaxed font-bold opacity-70 transition-colors normal-case
                ${selected ? 'text-stone-300' : 'text-stone-400'}
              `}>
                {description}
              </p>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </button>
  );
};

export default Button;
