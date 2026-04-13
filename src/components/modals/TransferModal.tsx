import { motion, AnimatePresence } from 'motion/react';
import type { ProjectType } from '../../types/index';
import { PROJECT_TEMPLATES } from '../../data/projectTemplates';

export interface TransferModalProps {
  open: boolean;
  availableTypes: ProjectType[];
  careerTitle: string;
  onSelectProject: (type: ProjectType) => void;
  onOpenLifeChoices: () => void;
}

export function TransferModal({
  open,
  availableTypes,
  careerTitle,
  onSelectProject,
  onOpenLifeChoices,
}: TransferModalProps) {
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
              <h2 className="text-2xl font-bold dark:text-gray-100">转场期</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                当前职称：<span className="font-bold text-black dark:text-white">{careerTitle}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">选择下一个项目，或考虑人生新方向</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono uppercase opacity-50 dark:text-gray-500">可选项目</p>
              {availableTypes.map((type) => {
                const tmpl = PROJECT_TEMPLATES[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onSelectProject(type)}
                    className="w-full p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50 text-left hover:border-black/30 dark:hover:border-white/20 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold dark:text-gray-100">{tmpl.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tmpl.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-mono text-amber-700 dark:text-amber-500">~{tmpl.baseQuarters} 季度</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">难度 x{tmpl.difficultyMultiplier}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-black/10 dark:border-white/10 pt-4">
              <button
                type="button"
                onClick={onOpenLifeChoices}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                人生十字路口...
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
