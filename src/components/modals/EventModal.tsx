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
  return (
    <AnimatePresence>
      {open && event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-[40px] max-w-md w-full shadow-2xl border border-black/10 dark:border-white/10 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 text-amber-500 dark:text-amber-400">
              <AlertCircle size={32} />
              <h2 className="text-2xl font-bold tracking-tight italic font-serif dark:text-gray-100">{event.title}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{event.description}</p>

            {event.effect && Object.keys(event.effect).length > 0 && (
              <div className="bg-black/5 dark:bg-gray-800/50 p-4 rounded-2xl flex flex-col gap-2">
                <p className="text-[10px] font-mono uppercase opacity-40 dark:opacity-50 dark:text-gray-500 mb-1">
                  现场影响
                </p>
                {Object.entries(event.effect).map(([key, val]) => {
                  const n = Number(val);
                  return (
                    <div key={key} className="flex justify-between text-xs font-mono dark:text-gray-300">
                      <span>{effectStatLabel(key)}</span>
                      <span
                        className={
                          n > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : n < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-gray-400 dark:text-gray-500'
                        }
                      >
                        {formatEffectDisplayValue(n)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              返回工地
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
