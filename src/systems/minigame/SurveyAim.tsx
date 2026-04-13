import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

const ROUNDS = 3;
const BOX = 280;
const TARGET_R = 6;
const DRIFT_BOX = 100;

function pointsForDistance(d: number): number {
  if (d < 15) return 33;
  if (d < 30) return 25;
  if (d < 50) return 15;
  return 5;
}

function gradeFromTotal(total: number): MinigameResult {
  let grade: MinigameResult['grade'];
  let bonusMultiplier: number;
  if (total >= 90) {
    grade = 'S';
    bonusMultiplier = 1.5;
  } else if (total >= 70) {
    grade = 'A';
    bonusMultiplier = 1.3;
  } else if (total >= 50) {
    grade = 'B';
    bonusMultiplier = 1.0;
  } else {
    grade = 'C';
    bonusMultiplier = 0.8;
  }
  return { score: Math.min(100, total), grade, bonusMultiplier };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S':
      return '测量员看了都想让你帮忙复测。';
    case 'A':
      return '准星稳，手不抖，放线有谱。';
    case 'B':
      return '还行，再练练眼力和节奏。';
    case 'C':
    default:
      return '偏差有点大，记得多对中、少手滑。';
  }
}

export function SurveyAim({ onComplete }: MinigameProps) {
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [roundIndex, setRoundIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [result, setResult] = useState<MinigameResult | null>(null);
  const [target, setTarget] = useState({ x: BOX / 2, y: BOX / 2 });
  const [cross, setCross] = useState({ x: BOX / 2, y: BOX / 2 });
  const [flash, setFlash] = useState<string | null>(null);

  const tickRef = useRef<number | null>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const speedRef = useRef(38);
  const targetRef = useRef({ x: BOX / 2, y: BOX / 2 });
  const crossRef = useRef({ x: BOX / 2, y: BOX / 2 });
  const totalRef = useRef(0);
  const firedRef = useRef(false);

  const spawnRound = useCallback((ri: number) => {
    const margin = DRIFT_BOX / 2 + TARGET_R;
    const tx = margin + Math.random() * (BOX - margin * 2);
    const ty = margin + Math.random() * (BOX - margin * 2);
    targetRef.current = { x: tx, y: ty };
    setTarget({ x: tx, y: ty });
    setCross({
      x: tx + (Math.random() - 0.5) * 24,
      y: ty + (Math.random() - 0.5) * 24,
    });
    angleRef.current = Math.random() * Math.PI * 2;
    speedRef.current = 32 + ri * 18;
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    firedRef.current = false;
    spawnRound(roundIndex);
  }, [phase, roundIndex, spawnRound]);

  useEffect(() => {
    crossRef.current = cross;
  }, [cross]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const step = () => {
      const sp = speedRef.current;
      const t = targetRef.current;
      angleRef.current += (0.05 + sp * 0.0008) * (Math.random() > 0.92 ? 1.6 : 1);
      setCross((c) => {
        const nx = c.x + Math.cos(angleRef.current) * (sp * 0.018);
        const ny = c.y + Math.sin(angleRef.current * 1.07) * (sp * 0.016);
        const half = DRIFT_BOX / 2;
        const cx = Math.min(Math.max(nx, t.x - half), t.x + half);
        const cy = Math.min(Math.max(ny, t.y - half), t.y + half);
        return { x: cx, y: cy };
      });
      tickRef.current = window.requestAnimationFrame(step);
    };

    tickRef.current = window.requestAnimationFrame(step);
    return () => {
      if (tickRef.current != null) window.cancelAnimationFrame(tickRef.current);
    };
  }, [phase, roundIndex]);

  const onFire = () => {
    if (phase !== 'playing' || firedRef.current) return;
    firedRef.current = true;
    const c = crossRef.current;
    const t = targetRef.current;
    const dx = c.x - t.x;
    const dy = c.y - t.y;
    const d = Math.hypot(dx, dy);
    const pts = pointsForDistance(d);
    const label = d < 15 ? 'Perfect' : d < 30 ? 'Good' : d < 50 ? 'OK' : 'Miss';
    setFlash(`${label} +${pts}`);
    window.setTimeout(() => setFlash(null), 450);

    totalRef.current += pts;
    setTotalScore(totalRef.current);

    if (roundIndex + 1 >= ROUNDS) {
      const r = gradeFromTotal(totalRef.current);
      setResult(r);
      window.setTimeout(() => setPhase('settled'), 500);
    } else {
      window.setTimeout(() => {
        firedRef.current = false;
        setRoundIndex((i) => i + 1);
      }, 480);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && (
        <div className="flex justify-between text-xs font-semibold text-gray-600 px-0.5">
          <span>
            第 {Math.min(roundIndex + 1, ROUNDS)}/{ROUNDS} 次瞄准
          </span>
          <span className="tabular-nums">累计 {totalScore}</span>
        </div>
      )}

      <button
        type="button"
        onClick={onFire}
        disabled={phase !== 'playing'}
        className="relative mx-auto rounded-2xl border border-gray-200 shadow-inner bg-slate-900/90 overflow-hidden disabled:opacity-95"
        style={{ width: BOX, height: BOX }}
      >
        <div
          className="absolute rounded-md border border-white/10 bg-slate-800/80"
          style={{
            left: (BOX - DRIFT_BOX) / 2,
            top: (BOX - DRIFT_BOX) / 2,
            width: DRIFT_BOX,
            height: DRIFT_BOX,
          }}
        />

        <div
          className="absolute rounded-full bg-red-500 border border-red-200 shadow-[0_0_10px_rgba(239,68,68,0.7)] pointer-events-none"
          style={{
            width: TARGET_R * 2,
            height: TARGET_R * 2,
            left: target.x - TARGET_R,
            top: target.y - TARGET_R,
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            left: cross.x,
            top: cross.y,
            width: 1,
            height: 1,
          }}
        >
          <div className="absolute -left-[24px] top-0 w-[48px] h-px bg-lime-300/95 shadow-[0_0_6px_rgba(190,242,100,0.9)]" />
          <div className="absolute left-0 -top-[24px] w-px h-[48px] bg-lime-300/95 shadow-[0_0_6px_rgba(190,242,100,0.9)]" />
        </div>

        <AnimatePresence>
          {flash && (
            <motion.div
              key={flash}
              className="absolute inset-x-0 top-3 text-center text-sm font-black text-white drop-shadow-md pointer-events-none"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {flash}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <p className="text-xs text-center text-gray-500">准星会漂移，尽量对准红点中心再点</p>

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
