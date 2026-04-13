import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import type { PendingQuarterChoice } from '../../types/index';

export interface ChoiceModalProps {
  open: boolean;
  choice: PendingQuarterChoice | null;
  onSelect: (option: PendingQuarterChoice['options'][number]) => void;
}

export function ChoiceModal({ open, choice, onSelect }: ChoiceModalProps) {
  return (
    <AnimatePresence>
      {open && choice && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-[40px] max-w-md w-full shadow-2xl border border-indigo-200/90 dark:border-indigo-700/50 flex flex-col gap-5 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-start gap-3 text-indigo-600 dark:text-indigo-400">
              <ShieldAlert size={28} className="shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-black dark:text-gray-100">{choice.title}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{choice.description}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">项目部三选一，请权衡工期、安全与口碑。</p>
            <div className="flex flex-col gap-3">
              {choice.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelect(opt)}
                  className="text-left p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-700/50 transition-colors"
                >
                  <p className="font-bold text-sm text-black dark:text-gray-100">{opt.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{opt.hint}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
