import { memo } from 'react';

interface StatusDotProps {
  variant?: 'success' | 'danger' | 'warning' | 'primary' | 'stone';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * STATUS DOT (Diamond Edition)
 * -----------------------------------------------------------
 * Minimal indicator for availability, synchronization, or focus.
 */
const StatusDot = memo(({
  variant = 'success',
  pulse = false,
  size = 'md',
  className = '',
}: StatusDotProps) => {
  const variantClasses = {
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-400',
    primary: 'bg-stone-900',
    stone: 'bg-stone-300',
  };

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={`
        rounded-full flex-shrink-0
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${variant === 'success' || variant === 'danger' ? 'shadow-[0_0_8px_rgba(0,0,0,0.1)]' : ''}
        ${className}
      `}
    />
  );
});

StatusDot.displayName = 'StatusDot';
export default StatusDot;
