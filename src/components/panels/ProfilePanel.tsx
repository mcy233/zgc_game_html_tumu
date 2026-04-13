import {
  ShieldAlert,
  Brain,
  Heart,
  Zap,
  DollarSign,
  Package,
  BookOpen,
  Star,
  FileText,
  HeartHandshake,
  TreePine,
  Ghost,
  Palmtree,
  FileX,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { GameState } from '../../types/index';
import { getCareerTitle } from '../../data/careerPaths';
import { phaseLabel } from '../../data/projectTemplates';
import { StatBar } from '../cards/StatBar';
import { AnimatedStatBar } from '../../systems/animation/AnimatedStatBar';

export interface ProfilePanelProps {
  state: GameState;
  disabled?: boolean;
  workWalkMax?: number;
  outingCostLabel?: string;
  onWorkWalk: () => void;
  onDormRest: () => void;
  onOuting: () => void;
  onWithdrawSubmit: () => void;
}

export function ProfilePanel({
  state,
  disabled = false,
  workWalkMax = 3,
  outingCostLabel = '¥500',
  onWorkWalk,
  onDormRest,
  onOuting,
  onWithdrawSubmit,
}: ProfilePanelProps) {
  const careerTitle = getCareerTitle(state.careerTrack, state.careerStage);
  const phaseName = phaseLabel(state.project.phase);

  return (
    <>
      <p className="hidden lg:block text-[10px] font-mono uppercase opacity-40 tracking-wider px-1 dark:opacity-50 dark:text-gray-500">
        档案
      </p>
      <div
        id="onb-stats-card"
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-sm border border-black/5 dark:border-white/10 flex flex-col gap-5"
      >
        <h2 className="text-xs font-mono uppercase opacity-40 flex items-center gap-2 dark:opacity-50 dark:text-gray-500">
          <ShieldAlert size={14} /> 个人状态
        </h2>
        <div id="ff-stat-morale">
          <AnimatedStatBar icon={Brain} label="心态值" value={state.morale} color="bg-indigo-500" />
        </div>
        <div id="ff-stat-stamina">
          <AnimatedStatBar icon={Heart} label="体力值" value={state.stamina} color="bg-rose-500" />
        </div>
        <div id="ff-stat-energy">
          <AnimatedStatBar icon={Zap} label="精力值" value={state.energy} color="bg-amber-400" />
        </div>
        <div id="ff-stat-safety">
          <AnimatedStatBar icon={ShieldAlert} label="安全隐患" value={state.safetyRisk} color="bg-red-600" />
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div
              id="ff-stat-experience"
              className="bg-violet-50/80 dark:bg-violet-950/40 p-3 rounded-xl border border-violet-100 dark:border-violet-800/50"
            >
              <p className="text-[8px] font-mono uppercase opacity-50 text-violet-900/70 dark:text-violet-300/90 flex items-center gap-1">
                <TrendingUp size={10} className="opacity-70" /> 经验值
              </p>
              <p className="text-sm font-bold font-mono text-violet-800 dark:text-violet-300 mt-1">{state.experience}</p>
            </div>
            <div
              id="ff-stat-network"
              className="bg-teal-50/80 dark:bg-teal-950/40 p-3 rounded-xl border border-teal-100 dark:border-teal-800/50"
            >
              <p className="text-[8px] font-mono uppercase opacity-50 text-teal-900/70 dark:text-teal-300/90 flex items-center gap-1">
                <Users size={10} className="opacity-70" /> 人脉值
              </p>
              <p className="text-sm font-bold font-mono text-teal-800 dark:text-teal-300 mt-1">{state.networkValue}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              id="ff-stat-salary"
              className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/50"
            >
              <p className="text-[8px] font-mono uppercase opacity-50 text-emerald-900/70 dark:text-emerald-300/90 flex items-center gap-1">
                <DollarSign size={10} className="opacity-70" /> 工资
              </p>
              <p
                className={`text-sm font-bold font-mono mt-1 ${state.salary < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}
              >
                ¥{state.salary.toLocaleString()}
              </p>
            </div>
            <div
              id="ff-stat-materials"
              className="bg-blue-50/80 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50"
            >
              <p className="text-[8px] font-mono uppercase opacity-50 text-blue-900/70 dark:text-blue-300/90 flex items-center gap-1">
                <Package size={10} className="opacity-70" /> 物资
              </p>
              <p className="text-sm font-bold font-mono text-blue-700 dark:text-blue-400 mt-1">{state.project.materials}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              id="ff-stat-certificates"
              className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-black/5 dark:border-white/10"
            >
              <p className="text-[8px] font-mono uppercase opacity-40 dark:text-gray-500">资质证书</p>
              <p className="text-sm font-bold flex items-center gap-1 dark:text-gray-100">
                <BookOpen size={12} /> {state.certificates}
              </p>
            </div>
            <div
              id="ff-stat-reputation"
              className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-black/5 dark:border-white/10"
            >
              <p className="text-[8px] font-mono uppercase opacity-40 dark:text-gray-500">行业口碑</p>
              <p className="text-sm font-bold flex items-center gap-1 dark:text-gray-100">
                <Star size={12} className="text-yellow-500 dark:text-yellow-400" /> {state.reputation}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase opacity-40 dark:text-gray-500">职级 / 阶段</span>
              <div className="flex flex-wrap gap-1 justify-end">
                <span className="text-xs font-bold px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded-md">
                  {careerTitle}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 dark:bg-gray-700 dark:text-gray-100 rounded-md border border-black/10 dark:border-white/10">
                  {phaseName}
                </span>
              </div>
            </div>
            <div id="ff-stat-progress">
              <AnimatedStatBar
                icon={BookOpen}
                label="阶段进度"
                value={state.project.progress}
                color="bg-blue-600"
                suffix="%"
              />
            </div>
            <div className="mt-3 space-y-3">
              <div id="ff-stat-plan">
                <AnimatedStatBar
                  icon={FileText}
                  label="施工方案进度"
                  value={state.project.planProgress}
                  color="bg-purple-500"
                  suffix="%"
                />
              </div>
              {state.project.submittedSections > 0 && (
                <p className="text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg px-2 py-1.5">
                  送审排队：{state.project.submittedSections}{' '}
                  项（下季度封账时将公布监理/业主审查意见）
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        id="onb-self-reg"
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-sm border border-black/5 dark:border-white/10 flex flex-col gap-4"
      >
        <h2 className="text-xs font-mono uppercase opacity-40 flex items-center gap-2 dark:opacity-50 dark:text-gray-500">
          <HeartHandshake size={14} /> 自我调节
        </h2>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={onWorkWalk}
            disabled={disabled}
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950/70 transition-all text-xs font-bold disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              <TreePine size={14} /> 工间散步
            </span>
            <span className="opacity-60 dark:opacity-70 dark:text-gray-400">
              {state.walksThisQuarter}/{workWalkMax}
            </span>
          </button>
          <button
            type="button"
            onClick={onDormRest}
            disabled={disabled}
            className="flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/70 transition-all text-xs font-bold disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              <Ghost size={14} /> 板房躺平
            </span>
            <span className="opacity-60 dark:opacity-70 dark:text-gray-400">∞</span>
          </button>
          <button
            type="button"
            onClick={onOuting}
            disabled={disabled}
            className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/70 transition-all text-xs font-bold disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              <Palmtree size={14} /> 外出放风
            </span>
            <span className="opacity-60 dark:opacity-70 dark:text-gray-400">{outingCostLabel}</span>
          </button>
          <button
            type="button"
            onClick={onWithdrawSubmit}
            disabled={disabled}
            className="flex items-center justify-between p-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950/70 transition-all text-xs font-bold disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              <FileX size={14} /> 撤回送审
            </span>
            <span className="opacity-60 dark:opacity-70 dark:text-gray-400">分项-1</span>
          </button>
        </div>
      </div>
    </>
  );
}
