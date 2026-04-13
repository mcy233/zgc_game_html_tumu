import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Skull } from 'lucide-react';
import type { GameState } from '../../types/index';
import { getEndingNarrative, failureGameOverCopy } from '../../engine/endingSystem';
import { getCareerTitle } from '../../data/careerPaths';
import { BRAND } from '../../config/branding';

export interface GameOverModalProps {
  open: boolean;
  state: GameState;
  onRestart?: () => void;
}

export function GameOverModal({ open, state, onRestart }: GameOverModalProps) {
  const handleRestart = () => {
    if (onRestart) onRestart();
    else window.location.reload();
  };

  const isFailure =
    state.endingType === 'BURNOUT' ||
    state.endingType === 'SAFETY_ACCIDENT' ||
    state.endingType === 'SAFETY_NONCOMPLIANCE';
  const ending = isFailure ? failureGameOverCopy(state.endingType) : getEndingNarrative(state);

  const careerTitle = getCareerTitle(state.careerTrack, state.careerStage);

  const successAccent =
    'accent' in ending && typeof ending.accent === 'string' ? ending.accent : 'text-emerald-500';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-10 rounded-[40px] max-w-lg w-full shadow-2xl text-center flex flex-col gap-6 max-h-[90dvh] overflow-y-auto"
          >
            <div
              className={`flex justify-center ${isFailure ? 'text-rose-500 dark:text-rose-400' : successAccent}`}
            >
              {isFailure ? <Skull size={64} /> : <Trophy size={64} />}
            </div>
            <h2 className="text-3xl font-bold italic font-serif dark:text-gray-100">{ending.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{'body' in ending ? ending.body : ''}</p>
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
              最终职称：{careerTitle} · {BRAND.short}
            </p>

            <div className="grid grid-cols-2 gap-4 text-left bg-black/5 dark:bg-gray-800/50 p-5 rounded-3xl">
              <div>
                <p className="text-[10px] font-mono uppercase opacity-40 dark:text-gray-500">总季度</p>
                <p className="text-2xl font-bold dark:text-gray-100">{state.totalQuarters}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase opacity-40 dark:text-gray-500">完成项目</p>
                <p className="text-2xl font-bold dark:text-gray-100">{state.totalProjectsCompleted}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase opacity-40 dark:text-gray-500">经验值</p>
                <p className="text-2xl font-bold dark:text-gray-100">{state.experience}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase opacity-40 dark:text-gray-500">行业口碑</p>
                <p className="text-2xl font-bold dark:text-gray-100">{state.reputation}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-5 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              重新进场
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
