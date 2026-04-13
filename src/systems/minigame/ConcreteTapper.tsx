import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

const TOTAL_BEATS = 10;
const BEAT_INTERVAL_MS = 1200;
const RING_DURATION_S = 0.85;
/** 相对节拍起点，窗口打开/关闭（秒） */
const WINDOW_OPEN_S = 0.52;
const WINDOW_CLOSE_S = 0.72;

function gradeFromHits(hitCount: number): MinigameResult {
  let grade: MinigameResult['grade'];
  let bonusMultiplier: number;
  if (hitCount >= 9) {
    grade = 'S';
    bonusMultiplier = 1.5;
  } else if (hitCount >= 7) {
    grade = 'A';
    bonusMultiplier = 1.3;
  } else if (hitCount >= 5) {
    grade = 'B';
    bonusMultiplier = 1.0;
  } else {
    grade = 'C';
    bonusMultiplier = 0.8;
  }
  const score = Math.min(100, Math.round((hitCount / TOTAL_BEATS) * 100));
  return { score, grade, bonusMultiplier };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S':
      return '振捣密实，监理看了都想给你点赞。';
    case 'A':
      return '节拍感不错，混凝土都更听话了。';
    case 'B':
      return '还行，注意别漏振也别过振。';
    case 'C':
    default:
      return '手感有点飘，下次对准扩散圈外缘再点。';
  }
}

export function ConcreteTapper({ onComplete }: MinigameProps) {
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [beatIndex, setBeatIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<MinigameResult | null>(null);
  const [ringKey, setRingKey] = useState(0);
  const [feedback, setFeedback] = useState<'hit' | 'miss' | null>(null);

  const windowOpenRef = useRef(false);
  const consumedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const hitsRef = useRef(0);
  hitsRef.current = hits;

  const clearBeatTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const advanceBeat = useCallback(() => {
    setBeatIndex((b) => b + 1);
  }, []);

  const settle = useCallback(() => {
    const r = gradeFromHits(hitsRef.current);
    setResult(r);
    setPhase('settled');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (beatIndex >= TOTAL_BEATS) {
      settle();
    }
  }, [phase, beatIndex, settle]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (beatIndex >= TOTAL_BEATS) return;

    clearBeatTimers();
    consumedRef.current = false;
    windowOpenRef.current = false;
    setRingKey((k) => k + 1);

    const push = (fn: () => void, ms: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, ms));
    };

    push(() => {
      windowOpenRef.current = true;
    }, Math.round(WINDOW_OPEN_S * 1000));

    push(() => {
      windowOpenRef.current = false;
    }, Math.round(WINDOW_CLOSE_S * 1000));

    push(() => {
      if (consumedRef.current) return;
      consumedRef.current = true;
      setFeedback('miss');
      setProgress((p) => Math.min(100, p + 5));
      window.setTimeout(() => setFeedback(null), 180);
      advanceBeat();
    }, BEAT_INTERVAL_MS);

    return clearBeatTimers;
  }, [phase, beatIndex, clearBeatTimers, advanceBeat]);

  const onTap = () => {
    if (phase !== 'playing' || beatIndex >= TOTAL_BEATS) return;
    if (consumedRef.current) return;

    consumedRef.current = true;
    clearBeatTimers();

    if (windowOpenRef.current) {
      setHits((h) => h + 1);
      setProgress((p) => Math.min(100, p + 10));
      setFeedback('hit');
    } else {
      setProgress((p) => Math.min(100, p + 5));
      setFeedback('miss');
    }

    window.setTimeout(() => setFeedback(null), 160);
    window.setTimeout(advanceBeat, 200);
  };

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && (
        <div className="flex justify-between text-xs font-semibold text-gray-600 px-0.5">
          <span>
            节拍 {Math.min(beatIndex + 1, TOTAL_BEATS)}/{TOTAL_BEATS}
          </span>
          <span className="tabular-nums">命中 {hits}</span>
        </div>
      )}

      <button
        type="button"
        onClick={onTap}
        disabled={phase !== 'playing'}
        className="relative mx-auto w-full max-w-[320px] h-[280px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-slate-200/90 disabled:opacity-90"
      >
        <div className="absolute bottom-0 left-0 right-0 h-14 px-3 pt-2 bg-white/80 border-t border-gray-200">
          <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-cyan-600"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1 text-center">浇筑进度 {Math.round(progress)}%</p>
        </div>

        <div className="absolute inset-0 bottom-14 flex items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <motion.div
              key={ringKey}
              className="absolute rounded-full border-4 border-cyan-500/90"
              initial={{ width: 16, height: 16, opacity: 0.95 }}
              animate={{ width: 168, height: 168, opacity: 0.12 }}
              transition={{ duration: RING_DURATION_S, ease: 'easeOut' }}
            />
            <div
              className="absolute rounded-full border-2 border-dashed border-gray-500/60 pointer-events-none"
              style={{ width: 160, height: 160 }}
            />
            <svg width="48" height="120" className="relative z-10 pointer-events-none" viewBox="0 0 48 120">
              <line x1="24" y1="8" x2="24" y2="88" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
              <ellipse cx="24" cy="102" rx="18" ry="10" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <AnimatePresence>
          {feedback === 'hit' && (
            <motion.div
              className="absolute top-10 left-0 right-0 text-center text-emerald-600 font-black text-lg z-20 pointer-events-none"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              命中
            </motion.div>
          )}
          {feedback === 'miss' && (
            <motion.div
              className="absolute top-10 left-0 right-0 text-center text-red-600 font-black text-xl z-20 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              Miss
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <p className="text-xs text-center text-gray-500">外圈扩散接近虚线圆环时点击屏幕</p>

      <AnimatePresence>
        {phase === 'settled' && result && (
          <motion.div
            className="flex flex-col items-center gap-4 py-4 border-t border-gray-100 mt-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-6xl font-black tabular-nums text-gray-900 tracking-tight">{result.grade}</div>
            <p className="text-sm text-center text-gray-700 px-2 leading-relaxed">{messageForGrade(result.grade)}</p>
            <p className="text-xs text-gray-500">
              得分 {result.score} · 行动加成 ×{result.bonusMultiplier.toFixed(1)}
            </p>
            <button
              type="button"
              onClick={() => onComplete(result)}
              className="mt-1 px-8 py-2.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              返回
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
