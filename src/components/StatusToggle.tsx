import { memo } from 'react';
import * as Lucide from 'lucide-react';
import Button from './Button';
import { THEME } from '../data/config';

import { motion } from 'framer-motion';

/**
 * STATUS TOGGLE COMPONENT (Diamond Standard)
 * -----------------------------------------------------------
 * A specialized binary toggle for handling Stock, Publish, etc.
 * Uses the atomic Button unit internally for consistent feel.
 */

import { StatusToggleProps } from '../types';

const StatusToggle = memo(
  ({
    label,
    value,
    onChange,
    disabled = false,
    activeColor = THEME.statusState.active,
    inactiveColor = THEME.statusState.danger,
  }: StatusToggleProps) => {
    return (
      <div className="flex items-center justify-between bg-white px-2.5 py-2 rounded-xl border border-stone-100/50 shadow-sm">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-tight">
          {label}
        </span>
        <div className="flex gap-1.5">
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => onChange(true)}
              disabled={disabled}
              mode="square"
              size="sm"
              className={`!w-7 !h-7 !p-0 !rounded-lg transition-all ${value ? activeColor : THEME.statusState.inactive}`}
              icon={<Lucide.Check size={14} strokeWidth={4} />}
            />
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => onChange(false)}
              disabled={disabled}
              mode="square"
              size="sm"
              className={`!w-7 !h-7 !p-0 !rounded-lg transition-all ${!value ? inactiveColor : THEME.statusState.inactive}`}
              icon={<Lucide.X size={14} strokeWidth={4} />}
            />
          </motion.div>
        </div>
      </div>
    );
  },
);

export default StatusToggle;
