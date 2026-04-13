import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export interface StatBarProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  max?: number;
  suffix?: string;
}

export function StatBar({
  icon: Icon,
  label,
  value,
  color,
  max = 100,
  suffix = '',
}: StatBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[10px] font-mono uppercase opacity-70 dark:opacity-80 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Icon size={10} /> {label}
        </span>
        <span>
          {Math.round(value)}
          {suffix}/{max}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 bg-black/10 rounded-full overflow-hidden border border-black/5 dark:bg-white/10 dark:border-white/10">
        <motion.div
          className={`h-full ${color} dark:brightness-90`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 50 }}
        />
      </div>
    </div>
  );
}
