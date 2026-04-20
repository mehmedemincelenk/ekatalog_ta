import React, { memo } from 'react';
import { THEME } from '../data/config';

/**
 * ATOMIC BUTTON COMPONENT (100% Tokenized & Professional English)
 * -----------------------------------------------------------
 * Unified UI unit for all interactions. Managed via central THEME tokens.
 */

interface ButtonProps {
  onClick?: (event: React.MouseEvent) => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  variant?: keyof typeof THEME.button.variants;
  size?: keyof typeof THEME.button.sizes.circle; // Sizes are shared across modes
<<<<<<< HEAD
  mode?: 'circle' | 'rectangle';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
=======
  mode?: 'circle' | 'rectangle' | 'square';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  title?: string;
  loading?: boolean;
>>>>>>> master
}

const Button = memo(({ 
  onClick, 
  icon, 
  children,
  variant = 'secondary', 
  size = 'md', 
  mode = 'circle',
  className = '', 
<<<<<<< HEAD
  disabled = false,
  type = 'button'
}: ButtonProps) => {
  
  const buttonTheme = THEME.button;
  const variantStyles = buttonTheme.variants[variant];
  const sizeStyles = buttonTheme.sizes[mode][size];
  const globalRadius = mode === 'circle' ? 'rounded-full' : THEME.radius.button;
=======
  disabled = false, 
  type = 'button',
  title,
  loading = false
}: ButtonProps) => {
  const buttonTheme = THEME.button;
  const variantStyles = buttonTheme.variants[variant as keyof typeof buttonTheme.variants] || buttonTheme.variants.secondary;
  const sizeStyles = buttonTheme.sizes[mode as keyof typeof buttonTheme.sizes][size as keyof (typeof buttonTheme.sizes)['circle']] || buttonTheme.sizes.circle.md;
  
  const getRadius = () => {
    if (mode === 'circle') return 'rounded-full';
    if (mode === 'square') return 'rounded-md';
    return THEME.radius.button;
  };

  const globalRadius = getRadius();
>>>>>>> master

  return (
    <button 
      type={type}
      onClick={onClick}
<<<<<<< HEAD
      disabled={disabled}
=======
      disabled={disabled || loading}
      title={title}
>>>>>>> master
      className={`
        ${buttonTheme.base} 
        ${globalRadius} 
        ${sizeStyles} 
        ${variantStyles} 
        ${className}
<<<<<<< HEAD
      `}
    >
      {/* ICON AREA: Scaled for Apple-style refined aesthetics */}
      {icon && (
        <span className={`
          ${children ? 'mr-2' : ''} 
          flex items-center justify-center scale-75
        `}>
          {icon}
        </span>
      )}
      
      {/* CONTENT AREA */}
      {children}
=======
        ${loading ? 'opacity-80 cursor-wait' : ''}
      `}
    >
      {loading ? (
        <div className={`${THEME.loading.spinner} w-4 h-4`} />
      ) : (
        <>
          {/* ICON AREA: Scaled for Apple-style refined aesthetics */}
          {icon && (
            <span className={`
              ${children ? 'mr-2' : ''} 
              flex items-center justify-center scale-75
            `}>
              {icon}
            </span>
          )}
          
          {/* CONTENT AREA */}
          {children}
        </>
      )}
>>>>>>> master
    </button>
  );
});

export default Button;
