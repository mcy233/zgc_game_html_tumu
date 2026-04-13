import { motion } from 'motion/react';
import type { GameLog } from '../../types/index';

export interface LogListProps {
  logs: GameLog[];
}

export function LogList({ logs }: LogListProps) {
  return (
    <motion.div
      key="logs-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-3"
    >
      {logs.map((log, i) => (
        <motion.div
          key={`${log.quarter}-${i}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-3 rounded-xl text-[11px] border-l-4 ${
            log.type === 'DANGER'
              ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:border-rose-400 dark:text-rose-300'
              : log.type === 'WARNING'
                ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/40 dark:border-amber-400 dark:text-amber-300'
                : log.type === 'SUCCESS'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-400 dark:text-emerald-300'
                  : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-400'
          }`}
        >
          <div className="flex justify-between mb-1 opacity-50 font-mono">
            <span>第 {log.quarter} 季度 · 施工日志</span>
          </div>
          {log.message}
        </motion.div>
      ))}
    </motion.div>
  );
}
