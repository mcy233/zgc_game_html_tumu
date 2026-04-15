import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

const TOTAL_DROPS = 8;
const SWING_SPEED_BASE = 2.2;

function gradeFromScore(goodDrops: number): MinigameResult {
  let grade: MinigameResult['grade'];
  let bonusMultiplier: number;
  if (goodDrops >= 7) { grade = 'S'; bonusMultiplier = 1.5; }
  else if (goodDrops >= 5) { grade = 'A'; bonusMultiplier = 1.3; }
  else if (goodDrops >= 3) { grade = 'B'; bonusMultiplier = 1.0; }
  else { grade = 'C'; bonusMultiplier = 0.8; }
  return { score: Math.min(100, Math.round((goodDrops / TOTAL_DROPS) * 100)), grade, bonusMultiplier };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S': return '吊装精准，信号工都为你鼓掌！';
    case 'A': return '手感不错，构件落位很稳。';
    case 'B': return '凑合能用，但塔吊司机说你手感飘。';
    case 'C': default: return '吊偏了不少，下次注意看指挥。';
  }
}

export function CraneOperator({ onComplete }: MinigameProps) {
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [dropIndex, setDropIndex] = useState(0);
  const [goodDrops, setGoodDrops] = useState(0);
  const [result, setResult] = useState<MinigameResult | null>(null);
  const [feedback, setFeedback] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [hookPos, setHookPos] = useState(50);

  const animRef = useRef<number>(0);
  const posRef = useRef(50);
  const dirRef = useRef(1);
  const speedRef = useRef(SWING_SPEED_BASE);
  const runningRef = useRef(true);

  const targetZoneStart = 40;
  const targetZoneEnd = 60;
  const perfectZoneStart = 46;
  const perfectZoneEnd = 54;

  const animate = useCallback(() => {
    if (!runningRef.current) return;
    posRef.current += dirRef.current * speedRef.current;
    if (posRef.current >= 95) { posRef.current = 95; dirRef.current = -1; }
    if (posRef.current <= 5) { posRef.current = 5; dirRef.current = 1; }
    setHookPos(posRef.current);
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    runningRef.current = true;
    speedRef.current = SWING_SPEED_BASE + dropIndex * 0.2;
    animRef.current = requestAnimationFrame(animate);
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [phase, dropIndex, animate]);

  const handleDrop = () => {
    if (phase !== 'playing' || feedback) return;
    runningRef.current = false;
    cancelAnimationFrame(animRef.current);

    const pos = posRef.current;
    let fb: 'perfect' | 'good' | 'miss';
    if (pos >= perfectZoneStart && pos <= perfectZoneEnd) {
      fb = 'perfect';
      setGoodDrops((d) => d + 1);
    } else if (pos >= targetZoneStart && pos <= targetZoneEnd) {
      fb = 'good';
      setGoodDrops((d) => d + 1);
    } else {
      fb = 'miss';
    }
    setFeedback(fb);

    setTimeout(() => {
      const next = dropIndex + 1;
      if (next >= TOTAL_DROPS) {
        const finalGood = fb !== 'miss' ? goodDrops + 1 : goodDrops;
        const r = gradeFromScore(finalGood);
        setResult(r);
        setPhase('settled');
      } else {
        setDropIndex(next);
        setFeedback(null);
        posRef.current = Math.random() * 30 + 10;
        dirRef.current = Math.random() > 0.5 ? 1 : -1;
      }
    }, 700);
  };

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && (
        <>
          <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 px-0.5">
            <span>吊装 {Math.min(dropIndex + 1, TOTAL_DROPS)}/{TOTAL_DROPS}</span>
            <span className="tabular-nums">精准 {goodDrops}</span>
          </div>

          <button
            type="button"
            onClick={handleDrop}
            disabled={!!feedback}
            className="relative mx-auto w-full max-w-[320px] h-[260px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-inner bg-sky-100/80 dark:bg-sky-950/50 disabled:opacity-90"
          >
            {/* Target zone */}
            <div
              className="absolute top-0 bottom-0 bg-emerald-200/50 dark:bg-emerald-800/30 border-x-2 border-dashed border-emerald-500/60"
              style={{ left: `${targetZoneStart}%`, width: `${targetZoneEnd - targetZoneStart}%` }}
            />
            {/* Perfect zone */}
            <div
              className="absolute top-0 bottom-0 bg-emerald-300/40 dark:bg-emerald-700/40"
              style={{ left: `${perfectZoneStart}%`, width: `${perfectZoneEnd - perfectZoneStart}%` }}
            />

            {/* Crane arm */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
              <div className="w-3/4 h-1 bg-gray-600 dark:bg-gray-400 rounded-full" />
            </div>

            {/* Hook + cable */}
            <div className="absolute top-6" style={{ left: `${hookPos}%`, transform: 'translateX(-50%)' }}>
              <div className="w-0.5 h-24 bg-gray-500 dark:bg-gray-400 mx-auto" />
              <div className="w-10 h-10 mx-auto -mt-1 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <rect x="10" y="0" width="20" height="8" rx="2" className="fill-yellow-500 dark:fill-yellow-400" />
                  <rect x="8" y="8" width="24" height="20" rx="3" className="fill-gray-500 dark:fill-gray-400" />
                  <rect x="12" y="28" width="16" height="4" rx="1" className="fill-gray-600 dark:fill-gray-500" />
                </svg>
              </div>
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-amber-200/80 dark:bg-amber-900/50 border-t-2 border-amber-400 dark:border-amber-700">
              <div
                className="absolute top-1 border-2 border-dashed border-amber-600/60 dark:border-amber-400/60 rounded"
                style={{ left: `${targetZoneStart + 2}%`, width: `${targetZoneEnd - targetZoneStart - 4}%`, height: '80%' }}
              />
              <p className="absolute bottom-0.5 w-full text-center text-[9px] text-amber-700/70 dark:text-amber-400/70">落位区</p>
            </div>

            <AnimatePresence>
              {feedback === 'perfect' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                >
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-gray-900/80 px-4 py-2 rounded-xl">完美!</span>
                </motion.div>
              )}
              {feedback === 'good' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                >
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 bg-white/80 dark:bg-gray-900/80 px-4 py-2 rounded-xl">不错</span>
                </motion.div>
              )}
              {feedback === 'miss' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  <span className="text-xl font-black text-red-600 dark:text-red-400 bg-white/80 dark:bg-gray-900/80 px-4 py-2 rounded-xl">偏了!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">吊钩摆动时点击屏幕，将构件落到绿色区域内</p>
        </>
      )}

      <AnimatePresence>
        {phase === 'settled' && result && (
          <motion.div
            className="flex flex-col items-center gap-4 py-4 border-t border-gray-100 dark:border-gray-600 mt-1"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <div className="text-6xl font-black tabular-nums text-gray-900 dark:text-gray-100 tracking-tight">{result.grade}</div>
            <p className="text-sm text-center text-gray-700 dark:text-gray-300 px-2 leading-relaxed">{messageForGrade(result.grade)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">得分 {result.score} · 行动加成 ×{result.bonusMultiplier.toFixed(1)}</p>
            <button
              type="button"
              onClick={() => onComplete(result)}
              className="mt-1 px-8 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              返回
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
