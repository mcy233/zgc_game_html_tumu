import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SURVIVAL_GUIDE_META, SURVIVAL_SECTIONS, TUTORIAL_STEPS } from '../../data/narrativeTexts/onboarding';

const HIGHLIGHT_STYLE_ID = 'onb-highlight-style';

type PopupPlacement = 'center' | 'left' | 'right' | 'bottom';

function applyHighlight(highlightId?: string): PopupPlacement {
  let style = document.getElementById(HIGHLIGHT_STYLE_ID) as HTMLStyleElement | null;
  if (!highlightId) {
    style?.remove();
    return 'center';
  }
  const el = document.getElementById(highlightId);
  if (!el) {
    style?.remove();
    return 'center';
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (!style) {
    style = document.createElement('style');
    style.id = HIGHLIGHT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
    #${highlightId} {
      position: relative;
      z-index: 150;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.7), 0 0 32px 8px rgba(59, 130, 246, 0.35);
      border-radius: 16px;
      transition: box-shadow 0.3s ease;
    }
  `;

  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const cx = rect.left + rect.width / 2;

  if (vw < 640) return 'bottom';
  if (cx < vw * 0.33) return 'right';
  if (cx > vw * 0.67) return 'left';
  return 'bottom';
}

function clearHighlight() {
  document.getElementById(HIGHLIGHT_STYLE_ID)?.remove();
}

function placementClasses(p: PopupPlacement): string {
  switch (p) {
    case 'left':
      return 'sm:items-center sm:justify-start sm:pl-6';
    case 'right':
      return 'sm:items-center sm:justify-end sm:pr-6';
    case 'bottom':
      return 'sm:items-end sm:justify-center sm:pb-8';
    default:
      return 'sm:items-center sm:justify-center';
  }
}

export interface GuideAndSettingsModalsProps {
  showSurvivalGuide: boolean;
  onCloseSurvival: () => void;
  showTutorial: boolean;
  tutorialIndex: number;
  onCloseTutorial: () => void;
  onTutorialNext: () => void;
  showSettingsShell: boolean;
  onCloseSettings: () => void;
  showLLMSettings: boolean;
  onCloseLLM: () => void;
}

export function GuideAndSettingsModals({
  showSurvivalGuide,
  onCloseSurvival,
  showTutorial,
  tutorialIndex,
  onCloseTutorial,
  onTutorialNext,
  showSettingsShell,
  onCloseSettings,
  showLLMSettings,
  onCloseLLM,
}: GuideAndSettingsModalsProps) {
  const prevHighlightRef = useRef<string | undefined>(undefined);
  const [placement, setPlacement] = useState<PopupPlacement>('center');

  const computeHighlight = useCallback((hid?: string) => {
    const p = applyHighlight(hid);
    setPlacement(p);
  }, []);

  useEffect(() => {
    if (!showTutorial) {
      clearHighlight();
      prevHighlightRef.current = undefined;
      setPlacement('center');
      return;
    }
    const step = TUTORIAL_STEPS[tutorialIndex];
    const hid = step?.highlightId;
    if (hid !== prevHighlightRef.current) {
      prevHighlightRef.current = hid;
      const timer = setTimeout(() => computeHighlight(hid), 120);
      return () => clearTimeout(timer);
    }
  }, [showTutorial, tutorialIndex, computeHighlight]);

  useEffect(() => {
    return () => clearHighlight();
  }, []);

  const handleCloseTutorial = () => {
    clearHighlight();
    onCloseTutorial();
  };

  const handleTutorialNext = () => {
    clearHighlight();
    onTutorialNext();
  };

  const step = showTutorial ? TUTORIAL_STEPS[tutorialIndex] : undefined;
  const zoneName = step?.layoutZone === 'ARCHIVE' ? '左栏 · 档案' : step?.layoutZone === 'FEED' ? '右栏 · 动态' : step?.layoutZone === 'MAIN' ? '中栏 · 主页' : undefined;

  return (
    <>
      {showSurvivalGuide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 max-w-lg w-full max-h-[85dvh] overflow-y-auto rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/10"
          >
            <h2 className="text-xl font-bold dark:text-gray-100">{SURVIVAL_GUIDE_META.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{SURVIVAL_GUIDE_META.subtitle}</p>
            <div className="mt-4 space-y-4 text-sm text-gray-700 dark:text-gray-300">
              {SURVIVAL_SECTIONS.map((sec, i) => (
                <div key={i}>
                  <p className="font-bold text-black dark:text-white mb-2">{sec.heading}</p>
                  {sec.paragraphs?.map((p, j) => (
                    <p key={j} className="leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                  {sec.bullets && (
                    <ul className="list-disc pl-5 space-y-1.5">
                      {sec.bullets.map((b, j) => (
                        <li key={j} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: b }} />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onCloseSurvival}
              className="mt-6 w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              已阅，返回工地
            </button>
          </motion.div>
        </div>
      )}

      {showTutorial && (
        <>
          {/* Backdrop below highlight (z-140) so the highlighted element (z-150) shows through */}
          <div className="fixed inset-0 z-[140] bg-black/50" />
          {/* Modal above highlight (z-200), positioned to avoid blocking the highlight */}
          <div className={`fixed inset-0 z-[200] flex items-end justify-center p-4 pointer-events-none ${placementClasses(placement)}`}>
            <motion.div
              key={tutorialIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto bg-white dark:bg-gray-800 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
                  导览 {tutorialIndex + 1}/{TUTORIAL_STEPS.length}
                </p>
                {zoneName && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    {zoneName}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold dark:text-gray-100">{TUTORIAL_STEPS[tutorialIndex]?.title}</h3>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: TUTORIAL_STEPS[tutorialIndex]?.body ?? '' }}
              />
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseTutorial}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold text-sm"
                >
                  跳过
                </button>
                <button
                  type="button"
                  onClick={handleTutorialNext}
                  className="flex-1 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  {tutorialIndex + 1 >= TUTORIAL_STEPS.length ? '完成' : '下一步'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {showSettingsShell && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-xl border border-black/10 dark:border-white/10">
            <h3 className="font-bold text-lg dark:text-gray-100">系统设置</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">音效、字号与主题后续版本开放，当前请先专注现场节点。</p>
            <button
              type="button"
              onClick={onCloseSettings}
              className="mt-4 w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      )}

      {showLLMSettings && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-xl border border-black/10 dark:border-white/10">
            <h3 className="font-bold text-lg dark:text-gray-100">AI 文案设置</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              当前版本使用静态工地文案，未接入大模型。后续迭代将在此配置接口与密钥。
            </p>
            <button
              type="button"
              onClick={onCloseLLM}
              className="mt-4 w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  );
}
