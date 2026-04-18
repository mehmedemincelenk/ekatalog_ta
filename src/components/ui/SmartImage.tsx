import { useState, memo, useEffect } from 'react';
import { PLACEHOLDER_VISUAL_SYMBOL } from '../../utils/media/image';

interface SmartImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  wrapperClass?: string;
  fallbackSymbol?: string;
  objectFit?: 'cover' | 'contain';
  isPriority?: boolean;
}

/**
 * SMART IMAGE
 * -----------------------------------------------------------
 * A robust component that handles loading states, error fallbacks,
 * and standard placeholders across the entire application.
 */
const SmartImage = memo(({ 
  src, 
  alt, 
  className = "", 
  wrapperClass = "", 
  fallbackSymbol = PLACEHOLDER_VISUAL_SYMBOL,
  objectFit = 'cover',
  isPriority = false
}: SmartImageProps) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'loaded'>(src ? 'loading' : 'error');

  // Unified side-effect for source changes
  useEffect(() => {
    if (!src) {
      setStatus('error');
    } else {
      setStatus('loading');
    }
  }, [src]);

  const containerStyle = `relative overflow-hidden bg-stone-100 flex items-center justify-center ${wrapperClass}`;
  const imageStyle = `w-full h-full transition-all duration-500 ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} ${status === 'loading' ? 'blur-sm scale-105 opacity-50' : 'blur-0 scale-100 opacity-100'} ${className}`;

  return (
    <div className={containerStyle}>
      {src && status !== 'error' ? (
        <>
          <img 
            key={src} // Force reset if src changes significantly
            src={src} 
            alt={alt} 
            className={imageStyle}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            loading={isPriority ? "eager" : "lazy"}
            {...(isPriority ? { fetchpriority: "high" } : {})}
          />
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100/50">
               <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-stone-300 select-none animate-in fade-in duration-500">
          <span className="text-4xl">{fallbackSymbol}</span>
        </div>
      )}
    </div>
  );
});

export default SmartImage;
