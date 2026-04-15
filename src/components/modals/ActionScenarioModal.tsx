import { motion, AnimatePresence } from 'motion/react';
import { Drama } from 'lucide-react';
import type { ActionScenario, ScenarioChoice } from '../../data/actionScenarios';

export interface ActionScenarioModalProps {
  open: boolean;
  scenario: ActionScenario | null;
  actionLabel: string;
  onChoose: (choice: ScenarioChoice) => void;
}

export function ActionScenarioModal({ open, scenario, actionLabel, onChoose }: ActionScenarioModalProps) {
  return (
    <AnimatePresence>
      {open && scenario && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-[32px] max-w-md w-full shadow-2xl border border-black/10 dark:border-white/10 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <Drama size={22} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-gray-400 dark:text-gray-500">
                  {actionLabel}
                </p>
                <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  发生了状况
                </h2>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {scenario.scene}
            </p>

            <div className="flex flex-col gap-2.5">
              {scenario.choices.map((choice, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChoose(choice)}
                  className="group text-left p-4 rounded-2xl border border-gray-200 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                      {choice.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
