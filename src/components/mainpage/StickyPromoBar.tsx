import { memo } from 'react';

export const StickyPromoBar = memo(() => (
  <div className="sticky top-0 z-[100] bg-green-600 text-white py-3 px-4 text-center shadow-lg overflow-hidden">
    <p className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap opacity-90">
      domain <span className="font-black opacity-100">hediye!</span> <span className="mx-2 opacity-50">→</span> <span className="font-black bg-black/10 px-2 py-0.5 rounded normal-case opacity-100">www.markaniz.ekatalog.site</span>
    </p>
  </div>
));
