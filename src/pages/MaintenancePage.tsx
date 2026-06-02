import { useState } from 'react';
import { useSettings } from '../hooks/useSettingsHub';
import { MaintenancePageProps } from '../types';

/**
 * MAINTENANCE PAGE (Diamond Standard v2.0)
 * -----------------------------------------------------------
 * A professional downtime interface with lead capture and hidden admin access.
 */
export default function MaintenancePage({
  onPointerDown,
  onPointerUp,
}: MaintenancePageProps) {
  const { settings } = useSettings(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePressStart = () => {
    setIsPressed(true);
    onPointerDown();
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    onPointerUp();
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
      <div className="max-w-md w-full space-y-12 relative z-10">
        {/* BRANDING (HIDDEN ADMIN ACCESS) */}
        <div
          className={`flex flex-col items-center space-y-6 transition-all duration-300 cursor-pointer touch-none ${isPressed ? 'scale-95 opacity-50' : 'scale-100'}`}
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressEnd}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          }}
        >
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.title}
              className="h-24 w-auto object-contain pointer-events-none drop-shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 bg-stone-900 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl">
              {settings?.title?.charAt(0) || 'E'}
            </div>
          )}
          <div className="space-y-3">
            <h1 className="text-sm font-black text-stone-400 tracking-[0.5em] uppercase">
              {settings?.title || 'KATALOG'}
            </h1>
            <div className="h-0.5 w-8 bg-stone-900/5 mx-auto rounded-full" />
          </div>
        </div>

        <div className="relative py-8">
          <h2 className="text-4xl font-black text-stone-900 tracking-tighter lowercase">
            bakımdayız.
          </h2>
        </div>

        {/* FOOTER */}
        <div className="pt-8">
          <p className="text-[8px] font-black text-stone-300 uppercase tracking-[0.8em]">
            DIAMOND INFRASTRUCTURE
          </p>
        </div>
      </div>
    </div>
  );
}
