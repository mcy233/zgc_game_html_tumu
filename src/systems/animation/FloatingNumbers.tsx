import { AnimatePresence, motion } from 'motion/react';

import { isFeatureEnabled } from '../featureFlags';
import type { FloatingItem } from './useFloatingNumber';
import { fmtNum } from '../../utils/format';

const colorClass: Record<FloatingItem['color'], string> = {
  green: 'text-emerald-500',
  red: 'text-rose-500',
  amber: 'text-amber-500',
};

export function FloatingNumbers({ items }: { items: FloatingItem[] }) {
  if (!isFeatureEnabled('enableFloatingNumbers')) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[300]" aria-hidden>
      <AnimatePresence>
        {items.map(item => {
          const text =
            item.value > 0
              ? `${item.label} +${fmtNum(item.value)}`
              : `${item.label} ${fmtNum(item.value)}`;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={`fixed z-[301] font-mono font-bold text-sm whitespace-nowrap -translate-x-1/2 -translate-y-1/2 ${colorClass[item.color]}`}
              style={{ left: item.x, top: item.y }}
            >
              {text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
