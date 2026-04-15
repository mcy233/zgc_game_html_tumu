import { motion } from 'motion/react';

import type { StatBarProps } from '../../components/cards/StatBar';
import { isFeatureEnabled } from '../featureFlags';
import { fmtNum } from '../../utils/format';

export function AnimatedStatBar({
  icon: Icon,
  label,
  value,
  color,
  max = 100,
  suffix = '',
}: StatBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100);
  const animated = isFeatureEnabled('enableAnimatedBars');
  const dangerPulse = isFeatureEnabled('enableDangerPulse');

  const showPulse = animated && dangerPulse && value < 20;
  const showShimmer = animated && value > 80;

  if (!animated) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between text-[10px] font-mono uppercase opacity-70 dark:opacity-80 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Icon size={10} /> {label}
          </span>
          <span>
            {fmtNum(value)}
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

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[10px] font-mono uppercase opacity-70 dark:opacity-80 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Icon size={10} /> {label}
        </span>
        <span>
          {fmtNum(value)}
          {suffix}/{max}
          {suffix}
        </span>
      </div>
      <div className="relative h-1.5 bg-black/10 rounded-full overflow-hidden border border-black/5 dark:bg-white/10 dark:border-white/10">
        <div
          className={`h-full rounded-full ${color} dark:brightness-90 ${showPulse ? 'stat-bar-fill--pulse' : ''}`}
          style={{
            width: `${pct}%`,
            transition: 'width 0.6s ease',
          }}
        />
        {showShimmer && (
          <div
            className="stat-bar-shimmer-track"
            style={{ width: `${pct}%`, transition: 'width 0.6s ease' }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
