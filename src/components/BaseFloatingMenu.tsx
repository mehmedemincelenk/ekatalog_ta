import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { MarqueeText } from './MarqueeText';
import { X, Menu } from 'lucide-react';
import { THEME } from '../data/config';

/**
 * BASE FLOATING MENU (DIAMOND FRAME)
 * -----------------------------------------------------------
 * Unified orchestrator for AssistiveTouch-style menus.
 * Handles expansion, auto-close, and outside-click logic.
 */

export interface FloatingAction {
  id: string;
  icon: ReactNode;
  action: () => void;
  label: string;
  primary?: boolean;
  className?: string;
  variant?: string;
}

interface BaseFloatingMenuProps {
  actions: FloatingAction[];
  autoCloseDelay?: number;
  mainIcon?: ReactNode;
  activeMainIcon?: ReactNode;
  isPrimaryToggle?: boolean;
  labelText?: string;
}

export default function BaseFloatingMenu({
  actions,
  autoCloseDelay = 5000,
  mainIcon = <Menu className="w-full h-full p-0.5" strokeWidth={2.5} />,
  activeMainIcon = <X className="w-full h-full p-0.5" strokeWidth={2.5} />,
  isPrimaryToggle = true,
  labelText = 'MENÜ',
}: BaseFloatingMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const menuTheme = THEME.floatingAdminMenu;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleAction = (callback: () => void) => {
    clearTimer();
    callback();
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('pointerdown', handleClickOutside);
      clearTimer();
      timerRef.current = setTimeout(() => setIsExpanded(false), autoCloseDelay);
    } else {
      document.removeEventListener('pointerdown', handleClickOutside);
      clearTimer();
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      clearTimer();
    };
  }, [isExpanded, autoCloseDelay, clearTimer]);

  return (    <div ref={containerRef} className="z-[100]">
      <div className={`${menuTheme.container} w-[104px] sm:w-[150px] flex flex-col items-center justify-end shadow-[0_10px_40px_rgba(0,0,0,0.15)] !rounded-2xl bg-white/50 backdrop-blur-2xl border border-white/50 p-1.5`}>
        {/* ACTION CLUSTER */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  height: 'auto',
                  opacity: 1,
                  marginBottom: 10,
                  transition: { height: { type: 'spring', stiffness: 300, damping: 30 }, staggerChildren: 0.05, delayChildren: 0.1 }
                },
                closed: {
                  height: 0,
                  opacity: 0,
                  marginBottom: 0,
                  transition: { height: { type: 'spring', stiffness: 300, damping: 35 }, staggerChildren: 0.03, staggerDirection: -1 }
                }
              }}
              className="flex flex-col gap-2 sm:gap-3 items-center w-full"
              style={{ transformOrigin: 'bottom' }}
            >
              {/* LABELED ACTIONS (Full Width) */}
              <div className="flex flex-col gap-2 sm:gap-3 items-center w-full">
                {actions.filter(a => a.label).map((btn) => (
                  <motion.div
                    key={btn.id}
                    variants={{
                      open: { opacity: 1, y: 0, scale: 1 },
                      closed: { opacity: 0, y: 15, scale: 0.5 }
                    }}
                    className="w-[92px] sm:w-[138px]"
                  >
                    <Button
                      onClick={() => handleAction(btn.action)}
                      icon={btn.icon}
                      variant={(btn.variant as any) || (btn.primary ? 'primary' : 'secondary')}
                      size="sm"
                      mode="rectangle"
                      className={`shrink-0 shadow-md !rounded-xl ${btn.className || ''} w-full !justify-start px-2 sm:px-3 gap-2 sm:gap-3 h-[42px] sm:h-[63px]`}
                      aria-label={btn.label}
                    >
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <MarqueeText
                          text={btn.label}
                          textClass="text-[8px] sm:text-[11px] font-black uppercase tracking-tighter"
                          isAdmin={false}
                        />
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* ICON-ONLY ACTIONS (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 justify-items-center w-full max-w-[92px] sm:max-w-[138px]">
                {actions.filter(a => !a.label).map((btn) => (
                  <motion.div
                    key={btn.id}
                    variants={{
                      open: { opacity: 1, y: 0, scale: 1 },
                      closed: { opacity: 0, y: 15, scale: 0.5 }
                    }}
                    className="w-[42px] sm:w-[63px]"
                  >
                    <Button
                      onClick={() => handleAction(btn.action)}
                      icon={btn.icon}
                      variant={(btn.variant as any) || (btn.primary ? 'primary' : 'secondary')}
                      size="sm"
                      mode="circle"
                      className={`shrink-0 shadow-md !rounded-xl ${btn.className || ''} w-[42px] h-[42px] sm:w-[63px] sm:h-[63px] !p-0`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MASTER TOGGLE */}
        <div className="flex items-center justify-center w-full">
          <Button
            onClick={() => {
              clearTimer();
              setIsExpanded((prev) => !prev);
            }}
            variant={isPrimaryToggle && !isExpanded ? 'secondary' : 'primary'}
            size="sm"
            mode="rectangle"
            className={`${isExpanded ? '!bg-white !text-stone-900 border-2 border-stone-100' : '!bg-stone-900 !text-white'} hover:scale-105 active:scale-95 transition-all h-11 sm:h-16 w-[92px] sm:w-[138px] shadow-lg !rounded-xl relative overflow-hidden`}
            aria-label={isExpanded ? 'Menüyü Kapat' : 'Menüyü Aç'}
          >
            <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 w-full h-full">
              <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
                {isExpanded ? activeMainIcon : mainIcon}
              </div>
              <span className="text-[10px] sm:text-[14px] font-black uppercase tracking-widest leading-none">
                {labelText}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
