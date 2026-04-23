import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
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
}

interface BaseFloatingMenuProps {
  actions: FloatingAction[];
  autoCloseDelay?: number;
  mainIcon?: ReactNode;
  activeMainIcon?: ReactNode;
  isPrimaryToggle?: boolean;
}

export default function BaseFloatingMenu({
  actions,
  autoCloseDelay = 5000,
  mainIcon = <Menu className="w-full h-full p-0.5" strokeWidth={2.5} />,
  activeMainIcon = <X className="w-full h-full p-0.5" strokeWidth={2.5} />,
  isPrimaryToggle = true,
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

  return (
    <div ref={containerRef} className="z-[100]">
      <div className={`${menuTheme.container} overflow-hidden w-[46px] flex flex-col items-center justify-end shadow-2xl`}>
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
                  marginBottom: 8,
                  transition: { height: { type: 'spring', stiffness: 300, damping: 30 }, staggerChildren: 0.05, delayChildren: 0.1 }
                },
                closed: {
                  height: 0,
                  opacity: 0,
                  marginBottom: 0,
                  transition: { height: { type: 'spring', stiffness: 300, damping: 35 }, staggerChildren: 0.03, staggerDirection: -1 }
                }
              }}
              className="flex flex-col gap-2 items-center w-full"
              style={{ transformOrigin: 'bottom' }}
            >
              {actions.map((btn) => (
                <motion.div
                  key={btn.id}
                  variants={{
                    open: { opacity: 1, y: 0, scale: 1 },
                    closed: { opacity: 0, y: 15, scale: 0.5 }
                  }}
                  className="w-full flex justify-center"
                >
                  <Button
                    onClick={() => handleAction(btn.action)}
                    icon={btn.icon}
                    variant={btn.primary ? 'primary' : 'secondary'}
                    size="sm"
                    mode="circle"
                    className={`shrink-0 shadow-md ${btn.className || ''}`}
                    aria-label={btn.label}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MASTER TOGGLE */}
        <div className="flex items-center justify-center p-0.5">
          <Button
            onClick={() => {
              clearTimer();
              setIsExpanded((prev) => !prev);
            }}
            icon={isExpanded ? activeMainIcon : mainIcon}
            variant={isPrimaryToggle && !isExpanded ? 'secondary' : 'primary'}
            size="sm"
            mode="circle"
            className={`${isExpanded ? '!bg-white !text-stone-900 border-2 border-stone-100' : '!bg-stone-900 !text-white'} hover:scale-105 active:scale-95 transition-all w-10 h-10 shadow-lg`}
            aria-label={isExpanded ? 'Menüyü Kapat' : 'Menüyü Aç'}
          />
        </div>
      </div>
    </div>
  );
}
