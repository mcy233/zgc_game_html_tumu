import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Briefcase, Home, Package, Users, Zap, DollarSign, Boxes } from 'lucide-react';
import type { Action, Asset, GameState } from '../../types/index';
import { ACTIONS } from '../../data/actions';
import { BOSS_PROFILES } from '../../data/bossProfiles';
import { getCareerTitle } from '../../data/careerPaths';
import { phaseLabel } from '../../data/projectTemplates';
import { getAvailableActions } from '../../engine/actionHandlers';
import { relationMoodLabel } from '../../engine/progressionRules';
import { StatBar } from '../cards/StatBar';
import type { Tab } from '../../hooks/useLayout';
import { CharacterAvatar } from '../../systems/animation/CharacterAvatar';
import { fmtNum } from '../../utils/format';

export interface CenterMainPanelProps {
  state: GameState;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  layoutZone: 'ARCHIVE' | 'MAIN' | 'FEED';
  disabledPlay: boolean;
  headlineTitle: string;
  onAction: (action: Action) => void;
  onBossInteraction: () => void;
  onCoworkerInteraction: (cwId: string) => void;
  onSellAsset: (asset: Asset) => void;
}

export function CenterMainPanel({
  state,
  activeTab,
  setActiveTab,
  layoutZone,
  disabledPlay,
  headlineTitle,
  onAction,
  onBossInteraction,
  onCoworkerInteraction,
  onSellAsset,
}: CenterMainPanelProps) {
  const tabs = [
    { id: 'HOME' as const, label: '首页', icon: Home },
    { id: 'DAILY' as const, label: '学习', icon: BookOpen },
    { id: 'CONSTRUCTION' as const, label: '工作', icon: Briefcase },
    { id: 'TEAM' as const, label: '团队', icon: Users },
    { id: 'ASSETS' as const, label: '资产', icon: Package },
  ];

  const careerTitle = getCareerTitle(state.careerTrack, state.careerStage);
  const phaseName = phaseLabel(state.project.phase);
  const availableActions = getAvailableActions(ACTIONS, state);

  return (
    <div
      className={`flex flex-col gap-4 sm:gap-6 lg:col-span-6 min-h-0 overflow-y-auto lg:overflow-visible scrollbar-hide ${
        layoutZone !== 'MAIN' ? 'max-lg:hidden' : ''
      }`}
    >
      <p className="hidden lg:block text-[10px] font-mono uppercase opacity-40 tracking-wider px-1 dark:opacity-50 dark:text-gray-500">
        主页
      </p>
      <div
        id="onb-tab-bar"
        className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-x-auto scrollbar-hide shrink-0"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 min-w-[4.5rem] sm:flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                : 'text-gray-400 hover:text-black hover:bg-black/5 dark:hover:text-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <tab.icon size={14} className="sm:w-4 sm:h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div id="onb-main-body" className="flex-1 min-h-0 lg:min-h-[480px] flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {activeTab === 'HOME' && (
            <motion.div
              id="onb-home-card"
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm flex flex-col gap-6"
            >
              <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
                <CharacterAvatar
                  morale={state.morale}
                  stamina={state.stamina}
                  energy={state.energy}
                  safetyRisk={state.safetyRisk}
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{state.playerName || '待登记'}</h2>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{headlineTitle}</p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    {state.playerContactEmail && (
                      <>
                        企业邮箱 <span className="font-mono">{state.playerContactEmail}</span>
                        <br />
                      </>
                    )}
                    {state.playerOfficeRoom && (
                      <>
                        驻地 <span className="font-mono">{state.playerOfficeRoom}</span>
                        <br />
                      </>
                    )}
                    {state.playerEducation && <>学历背景 {state.playerEducation}</>}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-black/5 dark:border-white/10 p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="font-bold text-black dark:text-white mb-1">
                  {state.project.name} · {phaseName}
                </p>
                <p>
                  职级 {careerTitle}，形象进度 {fmtNum(state.project.progress)}%，本项已完分项{' '}
                  {state.project.completedSections}，累计完工项目 {state.totalProjectsCompleted}，人脉 {fmtNum(state.networkValue)}，口碑{' '}
                  {fmtNum(state.reputation)}。项目经理 {state.project.bossName}（{BOSS_PROFILES[state.project.bossType].label}
                  ）在岗。
                </p>
              </div>
            </motion.div>
          )}

          {activeTab !== 'HOME' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              {activeTab === 'TEAM' && (
                <div className="flex flex-col gap-4">
                  <div
                    id="onb-team-advisor-card"
                    className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-black/5 dark:border-white/10 space-y-3"
                  >
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      项目经理 · {state.project.bossName}
                      <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                        {BOSS_PROFILES[state.project.bossType].label}
                      </span>
                    </p>
                    <StatBar icon={Users} label="上级信任度" value={state.project.bossApproval} color="bg-violet-500" />
                    <button
                      type="button"
                      disabled={disabledPlay || state.interactionsThisQuarter.includes('boss')}
                      onClick={onBossInteraction}
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white text-xs font-bold disabled:opacity-35"
                    >
                      {state.interactionsThisQuarter.includes('boss') ? '本季已汇报' : '随机汇报 / 互动'}
                    </button>
                  </div>

                  {state.project.coworkers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {state.project.coworkers.map((mate) => (
                        <div
                          key={mate.id}
                          className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-black/5 dark:border-white/10 space-y-2"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                              {mate.name}
                              <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">{mate.position ?? mate.role}</span>
                            </p>
                            <button
                              type="button"
                              disabled={disabledPlay || state.interactionsThisQuarter.includes(mate.id)}
                              onClick={() => onCoworkerInteraction(mate.id)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                                state.interactionsThisQuarter.includes(mate.id)
                                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              }`}
                            >
                              {state.interactionsThisQuarter.includes(mate.id) ? '本季已聊' : '随机互动'}
                            </button>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 rounded inline-block">
                            {mate.status}
                          </span>
                          <StatBar icon={Users} label="好感度" value={mate.favor} color="bg-emerald-400" />
                          <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/90">
                            态度：{relationMoodLabel(mate.favor)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ASSETS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.assets.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-800 p-10 rounded-3xl border border-dashed border-black/10 dark:border-white/10 text-center text-gray-500 dark:text-gray-400 text-sm">
                      暂无资产。每季初流动供货商可能上门推销，留意弹窗。
                    </div>
                  ) : (
                    state.assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm space-y-3"
                      >
                        <div className="flex gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border border-black/5 dark:border-white/10 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{asset.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{asset.description}</p>
                          </div>
                        </div>
                        {Object.entries(asset.effect).filter(([, v]) => v !== undefined && v !== 0).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {asset.effect.moraleCostMultiplier != null && asset.effect.moraleCostMultiplier !== 1 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">心态消耗 ×{asset.effect.moraleCostMultiplier}</span>
                            )}
                            {asset.effect.staminaCostMultiplier != null && asset.effect.staminaCostMultiplier !== 1 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">体力消耗 ×{asset.effect.staminaCostMultiplier}</span>
                            )}
                            {asset.effect.energyGainMultiplier != null && asset.effect.energyGainMultiplier !== 1 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">精力恢复 ×{asset.effect.energyGainMultiplier}</span>
                            )}
                            {asset.effect.progressGainMultiplier != null && asset.effect.progressGainMultiplier !== 1 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">进度加成 ×{asset.effect.progressGainMultiplier}</span>
                            )}
                            {asset.effect.materialsGainPerQuarter != null && asset.effect.materialsGainPerQuarter !== 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">每季物资 +{asset.effect.materialsGainPerQuarter}</span>
                            )}
                            {asset.effect.salaryGainPerQuarter != null && asset.effect.salaryGainPerQuarter !== 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">每季工资 +¥{asset.effect.salaryGainPerQuarter}</span>
                            )}
                            {asset.effect.reputationGainMultiplier != null && asset.effect.reputationGainMultiplier !== 1 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300">口碑加成 ×{asset.effect.reputationGainMultiplier}</span>
                            )}
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-black/5 dark:border-white/10">
                          <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400">回收 ¥{asset.sellPrice}</span>
                          <button
                            type="button"
                            onClick={() => onSellAsset(asset)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 rounded-lg text-xs font-bold"
                          >
                            变卖
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {(activeTab === 'DAILY' || activeTab === 'CONSTRUCTION' || activeTab === 'TEAM') &&
                availableActions
                  .filter((a) => a.category === activeTab)
                  .map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => onAction(action)}
                      disabled={disabledPlay}
                      className="group bg-white dark:bg-gray-800 p-5 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm text-left flex justify-between gap-3 hover:border-black dark:hover:border-white/30 transition-all disabled:opacity-35"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-base text-gray-900 dark:text-gray-100">{action.label}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                        {action.strategyHint && (
                          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {action.strategyHint}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {action.energyCost > 0 && (
                          <span className="text-[10px] font-mono bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Zap size={10} /> {action.energyCost}
                          </span>
                        )}
                        {action.salaryCost > 0 && (
                          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <DollarSign size={10} /> {action.salaryCost}
                          </span>
                        )}
                        {action.materialsCost > 0 && (
                          <span className="text-[10px] font-mono bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Boxes size={10} /> {action.materialsCost}
                          </span>
                        )}
                        {action.progressGain > 0 && (
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-md">
                            进度 +{action.progressGain}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
