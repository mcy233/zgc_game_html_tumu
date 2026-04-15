import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { effectStatLabel, formatEffectDisplayValue } from '../../utils/format';

export interface EventModalEvent {
  title: string;
  description: string;
  effect: Record<string, number>;
}

export interface EventModalProps {
  open: boolean;
  event: EventModalEvent | null;
  onClose: () => void;
}

export function EventModal({ open, event, onClose }: EventModalProps) {
  const effectEntries = event
    ? Object.entries(event.effect)
        .filter(([, v]) => v !== 0)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    : [];

  return (
    <AnimatePresence>
      {open && event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-[32px] max-w-md w-full shadow-2xl border border-black/10 dark:border-white/10 flex flex-col gap-5"
          >
            <div className="flex items-center gap-3 text-amber-500 dark:text-amber-400">
              <AlertCircle size={28} />
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{event.title}</h2>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap min-h-[2rem]">
              {event.description}
            </p>

            {effectEntries.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl space-y-1.5">
                {effectEntries.map(([k, val]) => (
                  <div key={k} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-300">{effectStatLabel(k)}</span>
                    <span
                      className={`font-bold tabular-nums ${
                        val > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : val < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {formatEffectDisplayValue(val)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              返回工地
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
