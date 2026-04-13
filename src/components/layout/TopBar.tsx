import { useCallback, useState } from 'react';
import { Calendar, HardHat, Moon, Settings, Sun, Volume2, VolumeX } from 'lucide-react';
import type { WeatherType } from '../../types/index';
import type { ThemeMode } from '../../systems/theme/useTheme';
import { weatherDescription } from '../../engine/weatherSystem';
import { audioManager } from '../../systems/audio/AudioManager';
import { isFeatureEnabled } from '../../systems/featureFlags';

export interface TopBarProps {
  gameTitle: string;
  season: string;
  totalQuarters: number;
  projectName: string;
  careerTitle: string;
  projectPhase: string;
  weather: WeatherType;
  onOpenSettings: () => void;
  onOpenSurvivalGuide: () => void;
  onStartTutorial: () => void;
  onOpenLLMSettings: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

export function TopBar({
  gameTitle,
  season,
  totalQuarters,
  projectName,
  careerTitle,
  projectPhase,
  weather,
  onOpenSettings,
  onOpenSurvivalGuide,
  onStartTutorial,
  onOpenLLMSettings,
  themeMode,
  onToggleTheme,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(() => audioManager.isEnabled());
  const weatherLine = weatherDescription(weather);

  const toggleAudio = useCallback(() => {
    audioManager.setEnabled(!audioManager.isEnabled());
    setAudioOn(audioManager.isEnabled());
  }, []);

  return (
    <header
      id="onb-header"
      className="shrink-0 bg-white/90 dark:bg-gray-800/95 border-b border-black/5 dark:border-white/10 px-3 sm:px-6 py-3 lg:py-4 sticky top-0 z-30 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 min-h-[2.75rem] sm:min-h-0 pr-1">
            <div className="bg-black text-white dark:bg-white dark:text-black p-1.5 sm:p-2 rounded-lg shrink-0">
              <HardHat size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold tracking-tight truncate text-gray-900 dark:text-gray-100">
                {gameTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider opacity-50">
                <span className="flex items-center gap-1">
                  <Calendar size={10} className="sm:w-3 sm:h-3" /> 累计第 {totalQuarters} 季 · {season}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate max-w-[10rem] sm:max-w-none" title={projectName}>
                  {projectName}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-800 dark:text-gray-200">{careerTitle}</span>
                <span className="hidden sm:inline text-gray-400 dark:text-gray-500">·</span>
                <span>{projectPhase}</span>
                <span className="hidden sm:inline text-gray-400 dark:text-gray-500">·</span>
                <span title={weatherLine}>{weatherLine}</span>
              </div>
            </div>
          </div>
          <div className="relative shrink-0 pt-0.5 flex items-center gap-1">
            {isFeatureEnabled('enableAudio') && (
              <button
                type="button"
                onClick={toggleAudio}
                className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title={audioOn ? '关闭音效' : '开启音效'}
                aria-label={audioOn ? '关闭音效' : '开启音效'}
                aria-pressed={audioOn}
              >
                {audioOn ? <Volume2 size={20} strokeWidth={2} /> : <VolumeX size={20} strokeWidth={2} />}
              </button>
            )}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title={
                themeMode === 'system'
                  ? '切换明亮/暗黑主题'
                  : themeMode === 'dark'
                    ? '切换为浅色'
                    : '切换为深色'
              }
              aria-label="切换明亮或暗黑主题"
            >
              <Moon size={20} strokeWidth={2} className="dark:hidden" aria-hidden />
              <Sun size={20} strokeWidth={2} className="hidden dark:inline" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              title="项目部菜单"
            >
              <Settings size={20} strokeWidth={2} />
            </button>
            {menuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-[29] cursor-default bg-transparent"
                  aria-label="关闭菜单"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 z-40 w-44 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-lg py-1 text-left"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-3 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                    onClick={() => {
                      onOpenSettings();
                      setMenuOpen(false);
                    }}
                  >
                    系统设置
                  </button>
                  <div className="border-t border-black/5 dark:border-white/10 my-0.5" />
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-3 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                    onClick={() => {
                      onOpenSurvivalGuide();
                      setMenuOpen(false);
                    }}
                  >
                    工地生存指南
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-3 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                    onClick={() => {
                      onStartTutorial();
                      setMenuOpen(false);
                    }}
                  >
                    界面导览
                  </button>
                  <div className="border-t border-black/5 dark:border-white/10 my-0.5" />
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-3 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1.5"
                    onClick={() => {
                      onOpenLLMSettings();
                      setMenuOpen(false);
                    }}
                  >
                    AI 文案设置
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
