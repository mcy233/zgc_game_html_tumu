import { AnimatePresence, motion } from 'motion/react';
import type { GameLog, GameState } from '../../types/index';
import type { LayoutZone, RightTab } from '../../hooks/useLayout';
import { getActionsPerQuarter } from '../../engine/promotionSystem';
import { LogList } from '../feed/LogList';
import { MomentList } from '../feed/MomentList';
import { HonorWall, type HonorWallItem } from '../feed/HonorWall';

export interface RightFeedColumnProps {
  state: GameState;
  layoutZone: LayoutZone;
  rightTab: RightTab;
  setRightTab: (t: RightTab) => void;
  honorWallItems: HonorWallItem[];
  logs: GameLog[];
  hasUnreadMoments: boolean;
  onMomentInteract: (momentId: string) => void;
  sessionReady: boolean;
  isLoading: boolean;
  isGameOver: boolean;
  onNextQuarter: () => void;
}

export function RightFeedColumn({
  state,
  layoutZone,
  rightTab,
  setRightTab,
  honorWallItems,
  logs,
  hasUnreadMoments,
  onMomentInteract,
  sessionReady,
  isLoading,
  isGameOver,
  onNextQuarter,
}: RightFeedColumnProps) {
  const actionsPerQuarter = getActionsPerQuarter(state.careerStage);
  const actionsRemaining = Math.max(0, actionsPerQuarter - state.actionsThisQuarter);

  return (
    <div
      className={`flex flex-col gap-4 sm:gap-6 lg:col-span-3 min-h-0 overflow-y-auto lg:overflow-visible scrollbar-hide ${
        layoutZone !== 'FEED' ? 'max-lg:hidden' : ''
      }`}
    >
      <p className="hidden lg:flex items-center gap-2 text-[10px] font-mono uppercase opacity-40 tracking-wider px-1 dark:opacity-50 dark:text-gray-500">
        动态
        {hasUnreadMoments && (
          <span className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-800 shrink-0" />
        )}
      </p>
      <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl border border-black/5 dark:border-white/10 shadow-sm shrink-0 gap-0.5">
        {(['LOGS', 'MOMENTS', 'HONORS'] as const).map((rt) => (
          <button
            key={rt}
            type="button"
            onClick={() => setRightTab(rt)}
            className={`relative flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
              rightTab === rt ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {rt === 'LOGS' ? '施工日志' : rt === 'MOMENTS' ? '工友圈' : '荣誉墙'}
            {rt === 'MOMENTS' && hasUnreadMoments && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-800" />
            )}
          </button>
        ))}
      </div>

      <section
        id="onb-feed-panel"
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-sm border border-black/5 dark:border-white/10 flex flex-col gap-4 flex-1 min-h-[min(480px,65dvh)] lg:flex-none lg:h-[560px] lg:min-h-0"
      >
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pr-1 scrollbar-hide">
          <AnimatePresence mode="wait">
            {rightTab === 'LOGS' && (
              <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LogList logs={logs} />
              </motion.div>
            )}
            {rightTab === 'MOMENTS' && (
              <motion.div key="moments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MomentList moments={state.moments} onInteract={onMomentInteract} />
              </motion.div>
            )}
            {rightTab === 'HONORS' && (
              <motion.div key="honors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HonorWall honors={honorWallItems} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {sessionReady && (
        <div id="onb-quarter-wide" className="hidden lg:flex flex-col items-end gap-2 pt-1 shrink-0">
          <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500">
            本季行动 {actionsRemaining}/{actionsPerQuarter}
          </p>
          <button
            type="button"
            onClick={onNextQuarter}
            disabled={isLoading || isGameOver}
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-30"
          >
            {isLoading ? '封账中…' : '进入下季度'}
          </button>
        </div>
      )}
    </div>
  );
}
