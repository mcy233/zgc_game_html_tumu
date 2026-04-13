import { motion, AnimatePresence } from 'motion/react';
import type { PromotionCheckResult } from '../../engine/promotionSystem';

export interface PromotionModalProps {
  open: boolean;
  promotionCheck: PromotionCheckResult;
  promotionNarrative: { title: string; body: string } | null;
  /** Visible world-change bullets for this promotion */
  stageChangeEffects: string[];
  /** Quarterly base salary before / after promotion (from career stage tables) */
  salaryQuarterlyBefore: number;
  salaryQuarterlyAfter: number;
  onAccept: () => void;
  onDecline: () => void;
}

function formatQuarterlySalary(n: number): string {
  return `¥${n.toLocaleString('zh-CN')} / 季`;
}

export function PromotionModal({
  open,
  promotionCheck,
  promotionNarrative,
  stageChangeEffects,
  salaryQuarterlyBefore,
  salaryQuarterlyAfter,
  onAccept,
  onDecline,
}: PromotionModalProps) {
  const salaryDelta = salaryQuarterlyAfter - salaryQuarterlyBefore;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 flex items-center justify-center text-2xl mb-4 text-stone-900 dark:text-white">
                ↑
              </div>
              <h2 className="text-2xl font-bold dark:text-gray-100">{promotionNarrative?.title ?? '晋升机会'}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {promotionCheck.currentTitle} → {promotionCheck.nextTitle}
              </p>
            </div>

            {promotionNarrative && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                {promotionNarrative.body}
              </p>
            )}

            {stageChangeEffects.length > 0 && (
              <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-gray-800/50 p-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  阶段变化
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  {stageChangeEffects.map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-500 dark:text-amber-400 shrink-0">·</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/40 p-4">
              <h3 className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300/90 uppercase tracking-wide mb-2">
                季度基薪对比
              </h3>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  晋升前{' '}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatQuarterlySalary(salaryQuarterlyBefore)}
                  </span>
                </span>
                <span className="text-gray-400 dark:text-gray-500">→</span>
                <span className="text-gray-600 dark:text-gray-400">
                  晋升后{' '}
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                    {formatQuarterlySalary(salaryQuarterlyAfter)}
                  </span>
                </span>
              </div>
              {salaryDelta !== 0 && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2">
                  每季基薪上调 {salaryDelta > 0 ? '+' : ''}
                  {salaryDelta.toLocaleString('zh-CN')}
                </p>
              )}
            </div>

            {promotionCheck.bonusConditions.length > 0 && (
              <div className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                {promotionCheck.bonusConditions.map((c, i) => (
                  <p key={i}>+ {c}</p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onDecline}
                className="py-3 rounded-xl border-2 border-black/10 dark:border-white/10 text-sm font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                暂不晋升
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white text-sm font-bold shadow-md"
              >
                接受晋升
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
