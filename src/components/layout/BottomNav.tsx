import { Archive, Home, MessageSquare, Clock } from 'lucide-react';
import type { LayoutZone } from '../../hooks/useLayout';

export interface BottomNavProps {
  layoutZone: LayoutZone;
  setLayoutZone: (z: LayoutZone) => void;
  hasUnreadMoments: boolean;
  actionsRemaining: number;
  actionsTotal: number;
  isLoading: boolean;
  isGameOver: boolean;
  onNextQuarter: () => void;
  sessionReady: boolean;
}

export function BottomNav({
  layoutZone,
  setLayoutZone,
  hasUnreadMoments,
  actionsRemaining,
  actionsTotal,
  isLoading,
  isGameOver,
  onNextQuarter,
  sessionReady,
}: BottomNavProps) {
  const zones = [
    { zone: 'ARCHIVE' as const, label: '档案', Icon: Archive },
    { zone: 'MAIN' as const, label: '主页', Icon: Home },
    { zone: 'FEED' as const, label: '动态', Icon: MessageSquare },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(0,0,0,0.06)]"
      aria-label="主分区与季度推进"
    >
      <div className="max-w-lg mx-auto flex items-stretch gap-0">
        <div className="flex flex-1 min-w-0 items-stretch">
          {zones.map(({ zone, label, Icon }) => (
            <button
              key={zone}
              type="button"
              onClick={() => setLayoutZone(zone)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-t-lg transition-colors min-w-0 ${
                layoutZone === zone
                  ? 'text-black dark:text-white bg-black/5 dark:bg-white/10'
                  : 'text-gray-400 dark:text-gray-500 active:bg-black/5 dark:active:bg-white/10'
              }`}
            >
              <span className="relative inline-flex">
                <Icon size={20} strokeWidth={layoutZone === zone ? 2.25 : 2} />
                {zone === 'FEED' && hasUnreadMoments && (
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900"
                    aria-hidden
                  />
                )}
              </span>
              <span className="text-[10px] font-bold">{label}</span>
            </button>
          ))}
        </div>
        <div className="w-px shrink-0 bg-black/10 dark:bg-white/10 self-stretch my-2" aria-hidden />
        <div className="flex flex-col items-stretch justify-center gap-1.5 px-2 py-1.5 shrink-0 min-w-[6.5rem] max-w-[7.5rem]">
          {sessionReady ? (
            <>
              <p className="text-[9px] font-mono font-bold text-amber-600 text-center leading-none whitespace-nowrap">
                本季行动 {actionsRemaining}/{actionsTotal}
              </p>
              <button
                id="onb-quarter-fab"
                type="button"
                onClick={onNextQuarter}
                disabled={isLoading || isGameOver}
                className="w-full bg-black text-white dark:bg-white dark:text-black rounded-full py-2.5 px-2 text-[10px] font-bold leading-tight hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-35 disabled:active:scale-100"
              >
                {isLoading ? '封账中…' : '进入下季度'}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-0.5 py-2 text-[9px] text-gray-400 text-center leading-tight">
              <Clock size={16} className="opacity-50" aria-hidden />
              <span>报到后开放</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
