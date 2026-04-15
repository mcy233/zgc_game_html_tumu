import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import type { GameState } from '../../types/index';
import { weatherDescription, getWeatherProgressModifier, getWeatherStaminaModifier } from '../../engine/weatherSystem';
import { ownerSatisfactionLabel } from '../../engine/ownerSystem';
import { fmtNum } from '../../utils/format';
import { InfoTip } from '../ui/InfoTip';

type TipLine = { label: string; value: string; color?: string };

function buildSatisfactionTip(state: GameState): TipLine[] {
  const p = state.project;
  const lines: TipLine[] = [];
  lines.push({ label: '基础值', value: `${fmtNum(p.ownerSatisfaction)}` });

  if (p.progress > 80) {
    lines.push({ label: '进度>80%', value: '+5/季', color: 'text-emerald-600 dark:text-emerald-400' });
  } else if (p.progress > 60) {
    lines.push({ label: '进度>60%', value: '+2/季', color: 'text-emerald-600 dark:text-emerald-400' });
  }
  if (state.safetyRisk > 80) {
    lines.push({ label: '安全隐患>80', value: '-8/季', color: 'text-rose-600 dark:text-rose-400' });
  } else if (state.safetyRisk > 50) {
    lines.push({ label: '安全隐患>50', value: '-3/季', color: 'text-rose-600 dark:text-rose-400' });
  }
  if (p.completedSections > 0) {
    lines.push({ label: `已完工分项(${p.completedSections})`, value: `+${p.completedSections}/季`, color: 'text-emerald-600 dark:text-emerald-400' });
  }
  if (state.reputation > 60) {
    lines.push({ label: '口碑>60', value: '+1/季', color: 'text-emerald-600 dark:text-emerald-400' });
  }
  lines.push({ label: '满意度奖金', value: p.ownerSatisfaction >= 90 ? '+¥2,000' : p.ownerSatisfaction >= 70 ? '+¥1,000' : p.ownerSatisfaction >= 50 ? '+¥500' : p.ownerSatisfaction < 30 ? '-¥500' : '¥0' });
  return lines;
}

function buildWeatherTip(state: GameState): TipLine[] {
  const w = state.project.weather;
  const progMod = getWeatherProgressModifier(w);
  const stamMod = getWeatherStaminaModifier(w);
  const lines: TipLine[] = [];
  lines.push({ label: '当前天气', value: w });
  const progPct = Math.round((progMod - 1) * 100);
  lines.push({
    label: '室外进度效率',
    value: progPct >= 0 ? `+${progPct}%` : `${progPct}%`,
    color: progPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
  });
  const stamPct = Math.round((stamMod - 1) * 100);
  if (stamPct > 0) {
    lines.push({ label: '室外体力消耗', value: `+${stamPct}%`, color: 'text-rose-600 dark:text-rose-400' });
  }
  lines.push({ label: '影响范围', value: '仅室外行动', color: 'text-gray-500 dark:text-gray-400' });
  if (w === '大雨' || w === '大风' || w === '寒潮' || w === '高温') {
    lines.push({ label: '⚠ 赶工加班', value: '额外+安全隐患', color: 'text-rose-600 dark:text-rose-400' });
  }
  return lines;
}

function buildRecoveryTip(state: GameState): TipLine[] {
  const maxFavor = state.project.coworkers.filter(c => c.favor >= 100).length;
  const lines: TipLine[] = [
    { label: '心态自然恢复', value: '+10', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: '体力自然恢复', value: '+10', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: '精力自然恢复', value: '+20', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: '经验自然积累', value: '+5', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: '物资基础补给', value: '+400', color: 'text-blue-600 dark:text-blue-400' },
  ];
  if (maxFavor > 0) {
    lines.push({ label: `满好感工友(×${maxFavor})`, value: `心态/体力/精力 各+${maxFavor * 5}`, color: 'text-emerald-600 dark:text-emerald-400' });
  }
  lines.push({ label: '⚠ 精力不再重置', value: '上季度剩余+20', color: 'text-amber-600 dark:text-amber-400' });
  return lines;
}

export interface PaperReviewDetail {
  submitted: number;
  accepted: number;
  rejected: number;
  lines: string[];
}

export interface QuarterSummaryModalProps {
  state: GameState;
  paperReviewDetail: PaperReviewDetail | null;
  projectHintHtml: string | null;
  careerHintHtml: string | null;
  onClose: () => void;
  effectStatLabel: (key: string) => string;
  formatEffectDisplayValue: (val: number) => string;
}

export function QuarterSummaryModal({
  state,
  paperReviewDetail,
  projectHintHtml,
  careerHintHtml,
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
            <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed">
              {weatherDescription(p.weather)}
              <InfoTip lines={buildWeatherTip(state)} title="天气对行动的影响" size={13} />
            </p>
            <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed border-t border-slate-200/80 dark:border-gray-700 pt-2">
              <span className="font-semibold text-slate-800 dark:text-gray-200">甲方满意度</span>{' '}
              <span className="font-mono tabular-nums">{fmtNum(p.ownerSatisfaction)}</span>/100 —{' '}
              {ownerSatisfactionLabel(p.ownerSatisfaction)}
              <InfoTip lines={buildSatisfactionTip(state)} title="满意度计算明细" size={13} />
            </p>
          </div>
          {projectHintHtml ? (
            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700/85 dark:text-emerald-300/90 mb-2">
                工地建设进展
              </p>
              <p
                className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: projectHintHtml }}
              />
            </div>
          ) : null}
          {careerHintHtml ? (
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-700/85 dark:text-indigo-300/90 mb-2">
                个人职业发展
              </p>
              <p
                className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: careerHintHtml }}
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
            <div className="border-t border-black/5 dark:border-white/10 pt-2 flex flex-col gap-1.5">
              <p className="text-[10px] font-mono uppercase opacity-40 dark:opacity-50 dark:text-gray-500 mb-0.5">
                季度自然恢复
                <InfoTip lines={buildRecoveryTip(state)} title="季度恢复机制说明" size={12} />
              </p>
              <div className="flex justify-between text-xs font-mono dark:text-gray-300">
                <span>心态</span>
                <span className="text-emerald-600 dark:text-emerald-400">+10</span>
              </div>
              <div className="flex justify-between text-xs font-mono dark:text-gray-300">
                <span>体力</span>
                <span className="text-emerald-600 dark:text-emerald-400">+10</span>
              </div>
              <div className="flex justify-between text-xs font-mono dark:text-gray-300">
                <span>精力</span>
                <span className="text-emerald-600 dark:text-emerald-400">+20</span>
              </div>
              {p.coworkers.filter(c => c.favor >= 100).length > 0 && (
                <div className="flex justify-between text-xs font-mono dark:text-gray-300 pt-1 border-t border-black/5 dark:border-white/5">
                  <span>满好感工友 ×{p.coworkers.filter(c => c.favor >= 100).length}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    心态/体力/精力 各+{p.coworkers.filter(c => c.favor >= 100).length * 5}
                  </span>
                </div>
              )}
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
