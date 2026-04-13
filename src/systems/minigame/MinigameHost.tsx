import { AnimatePresence, motion } from 'motion/react';
import type { MinigameConfig, MinigameResult } from './types';

interface MinigameHostProps {
  config: MinigameConfig | null;
  onComplete: (result: MinigameResult) => void;
  onSkip: () => void;
}

export function MinigameHost({ config, onComplete, onSkip }: MinigameHostProps) {
  const Comp = config?.component;

  return (
    <AnimatePresence>
      {config && Comp && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg max-h-[90dvh] flex flex-col rounded-3xl bg-white shadow-2xl border border-black/5 overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <div className="flex justify-end shrink-0 px-3 pt-3">
              <button
                type="button"
                onClick={onSkip}
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-xl hover:bg-black/5 transition-colors"
              >
                跳过
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto px-4 pb-4 pt-1">
              <Comp onComplete={onComplete} onSkip={onSkip} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
