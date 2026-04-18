import { memo } from 'react';

/**
 * LOADING SPINNER
 * -----------------------------------------------------------
 * A reusable, centralized loading indicator.
 */
const LoadingSpinner = memo(() => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
    </div>
  );
});

export default LoadingSpinner;
