import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import type { GameState } from '../../types/index';
import { weatherDescription } from '../../engine/weatherSystem';
import { ownerSatisfactionLabel } from '../../engine/ownerSystem';
import { fmtNum } from '../../utils/format';

export interface PaperReviewDetail {
  submitted: number;
  accepted: number;
  rejected: number;
  lines: string[];
}

export interface QuarterSummaryModalProps {
  state: GameState;
  paperReviewDetail: PaperReviewDetail | null;
  mainTaskHtml: string | null;
  onClose: () => void;
  effectStatLabel: (key: string) => string;
  formatEffectDisplayValue: (val: number) => string;
}

export function QuarterSummaryModal({
  state,
  paperReviewDetail,
  mainTaskHtml,
  onClose,
  effectStatLabel,
  formatEffectDisplayValue,
}: QuarterSummaryModalProps) {
  const p = state.project;
  const constructionYear = Math.floor(state.totalQuarters / 4) + 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-[40px] max-w-md w-full shadow-2xl border border-black/10 dark:border-white/10 flex flex-col gap-6 max-h-[90dvh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 text-black dark:text-white">
          <Calendar size={32} />
          <h2 className="text-2xl font-bold tracking-tight italic font-serif">季度封账</h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            第 {constructionYear} 施工年 · {state.season} 已进场，项目部例会纪要已归档。
          </p>
          <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50/90 dark:bg-gray-800/50 p-4 flex flex-col gap-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-gray-400">
              本季天气与甲方态度
            </p>
            <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed">{weatherDescription(p.weather)}</p>
            <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed border-t border-slate-200/80 dark:border-gray-700 pt-2">
              <span className="font-semibold text-slate-800 dark:text-gray-200">甲方满意度</span>{' '}
              <span className="font-mono tabular-nums">{fmtNum(p.ownerSatisfaction)}</span>/100 —{' '}
              {ownerSatisfactionLabel(p.ownerSatisfaction)}
            </p>
          </div>
          {mainTaskHtml ? (
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-700/85 dark:text-indigo-300/90 mb-2">
                本季主线提示
              </p>
              <p
                className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: mainTaskHtml }}
              />
            </div>
          ) : null}
          {p.safetyComplianceAlert && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200/90 dark:border-rose-800/60 p-4 rounded-2xl flex flex-col gap-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-rose-800/90 dark:text-rose-300/90">
                安监站 · 合规提醒
              </p>
              <p className="text-sm text-rose-950/90 dark:text-rose-200/95 leading-relaxed whitespace-pre-wrap">
                {p.safetyComplianceAlert}
              </p>
            </div>
          )}
          {p.safetyMidPeriodHint && (
            <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 p-4 rounded-2xl flex flex-col gap-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-sky-700/85 dark:text-sky-300/90">
                安全员温馨提示
              </p>
              <p className="text-sm text-sky-950/90 dark:text-sky-200/95 leading-relaxed">{p.safetyMidPeriodHint}</p>
            </div>
          )}
          {p.quarterNotice && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 p-4 rounded-2xl flex flex-col gap-3">
              <p className="text-[10px] font-mono uppercase opacity-50 text-amber-900 dark:text-amber-300/90">
                {p.quarterNotice.title}
              </p>
              <p className="text-sm text-amber-950/90 dark:text-amber-200/95 whitespace-pre-wrap leading-relaxed">
                {p.quarterNotice.description}
              </p>
              {Object.keys(p.quarterNotice.effect).length > 0 && (
                <div className="border-t border-amber-200/60 dark:border-amber-800/50 pt-2 flex flex-col gap-1.5">
                  <p className="text-[10px] font-mono uppercase opacity-40 text-amber-900 dark:text-amber-400/90">
                    人事与资源变动
                  </p>
                  {Object.entries(p.quarterNotice.effect).map(([key, val]) => {
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
            </div>
          )}
          {paperReviewDetail && (
            <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/60 p-4 rounded-2xl flex flex-col gap-2">
              <p className="text-[10px] font-mono uppercase opacity-50 text-violet-800 dark:text-violet-300/90">
                分项送审结果（上季度）
              </p>
              <p className="text-sm font-bold text-violet-950 dark:text-violet-200">
                送审 {paperReviewDetail.submitted} 项 · 通过 {paperReviewDetail.accepted} · 退回{' '}
                {paperReviewDetail.rejected}
              </p>
              <ul className="text-xs text-violet-900/90 dark:text-violet-300/85 space-y-1 list-disc pl-4">
                {paperReviewDetail.lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-black/5 dark:bg-gray-800/50 p-4 rounded-2xl flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase opacity-40 dark:opacity-50 dark:text-gray-500">
              本季资源与节奏
            </p>
            {state.assets.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-1">
                {asset.effect.materialsGainPerQuarter ? (
                  <div className="flex justify-between text-xs font-mono dark:text-gray-300">
                    <span>
                      {asset.name} · 每季物资补给
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">+{asset.effect.materialsGainPerQuarter}</span>
                  </div>
                ) : null}
                {asset.effect.salaryGainPerQuarter ? (
                  <div className="flex justify-between text-xs font-mono dark:text-gray-300">
                    <span>
                      {asset.name} · 每季工资补贴
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">+¥{asset.effect.salaryGainPerQuarter}</span>
                  </div>
                ) : null}
              </div>
            ))}
            <div className="border-t border-black/5 dark:border-white/10 pt-2 flex justify-between text-xs font-mono font-bold dark:text-gray-100">
              <span>班后精力回满</span>
              <span className="text-amber-600 dark:text-amber-500">重置为满格</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shrink-0"
        >
          开工下一季度
        </button>
      </motion.div>
    </motion.div>
  );
}
