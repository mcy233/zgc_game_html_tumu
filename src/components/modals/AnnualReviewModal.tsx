import { motion, AnimatePresence } from 'motion/react';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import type { AnnualReviewResult } from '../../engine/annualReview';

interface Props {
  open: boolean;
  result: AnnualReviewResult | null;
  onClose: () => void;
}

const GRADE_COLORS: Record<string, string> = {
  S: 'text-amber-500',
  A: 'text-emerald-500',
  B: 'text-blue-500',
  C: 'text-gray-500',
  D: 'text-rose-500',
};

const GRADE_BG: Record<string, string> = {
  S: 'bg-amber-100 dark:bg-amber-900/30',
  A: 'bg-emerald-100 dark:bg-emerald-900/30',
  B: 'bg-blue-100 dark:bg-blue-900/30',
  C: 'bg-gray-100 dark:bg-gray-800',
  D: 'bg-rose-100 dark:bg-rose-900/30',
};

export function AnnualReviewModal({ open, result, onClose }: Props) {
  if (!result) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-[32px] max-w-md w-full shadow-2xl border border-black/10 dark:border-white/10 flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/40">
                <Award size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  第 {result.year} 年度考核
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">年终绩效评估报告</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 py-4">
              <div className={`${GRADE_BG[result.performanceGrade]} rounded-3xl p-6 flex flex-col items-center`}>
                <span className={`text-5xl font-black ${GRADE_COLORS[result.performanceGrade]}`}>
                  {result.performanceGrade}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {result.performanceScore} 分
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {result.salaryRaise >= 0 ? (
                    <TrendingUp size={14} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={14} className="text-rose-500" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    {result.salaryRaise >= 0 ? '+' : ''}{result.salaryRaise} 元
                  </span>
                </div>
                {result.promoted && (
                  <div className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-700 dark:text-amber-300 text-xs font-bold">
                    晋升！{result.newTitle}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {result.narrativeLines.map((line, i) => (
                <p key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              继续
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
