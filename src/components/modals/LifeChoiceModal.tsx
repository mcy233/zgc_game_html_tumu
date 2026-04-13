import { motion, AnimatePresence } from 'motion/react';
import type { LifeChoice } from '../../types/index';

export interface LifeChoiceModalProps {
  open: boolean;
  choices: LifeChoice[];
  careerTitle: string;
  onSelect: (choice: LifeChoice) => void;
  onCancel: () => void;
}

export function LifeChoiceModal({
  open,
  choices,
  careerTitle,
  onSelect,
  onCancel,
}: LifeChoiceModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl max-w-lg w-full shadow-2xl flex flex-col gap-6 max-h-[85dvh] overflow-y-auto"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold dark:text-gray-100">人生十字路口</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                当前身份：<span className="font-bold dark:text-gray-100">{careerTitle}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">每个选择都将改变你的人生轨迹</p>
            </div>

            <div className="space-y-3">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => onSelect(choice)}
                  className="w-full p-4 rounded-2xl border border-black/10 dark:border-white/10 text-left hover:border-black/30 dark:hover:border-white/25 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                        {choice.label}
                        {choice.isEnding && (
                          <span className="ml-2 text-[10px] bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 px-1.5 py-0.5 rounded">
                            终结局
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{choice.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 rounded-xl border border-black/10 dark:border-white/10 text-sm font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              返回项目选择
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
