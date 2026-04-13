import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

const KEYWORDS = [
  '进度可控',
  '质量达标',
  '成本优化',
  '安全无事故',
  '按期交付',
  '团队配合好',
];

const FALL_DURATION = 2.5;
const PLAY_H = 380;
const ZONE_TOP_FR = 0.42;
const ZONE_BOTTOM_FR = 0.58;
const EDGE_PX = 14;

type HitKind = 'perfect' | 'good' | 'miss';

function gradeFromHits(perfect: number, good: number): MinigameResult {
  const hits = perfect + good;
  let grade: MinigameResult['grade'];
  let bonusMultiplier: number;
  if (perfect >= 5) {
    grade = 'S';
    bonusMultiplier = 1.5;
  } else if (perfect >= 3) {
    grade = 'A';
    bonusMultiplier = 1.3;
  } else if (hits >= 4) {
    grade = 'B';
    bonusMultiplier = 1.0;
  } else {
    grade = 'C';
    bonusMultiplier = 0.8;
  }
  const score = Math.min(100, perfect * 15 + good * 10 + (hits >= 4 ? 5 : 0));
  return { score, grade, bonusMultiplier };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S':
      return '甲方频频点头，这波汇报节奏满分。';
    case 'A':
      return '关键词踩点很稳，PPT战士就是你。';
    case 'B':
      return '基本把故事讲圆了，下次再抠细节。';
    case 'C':
    default:
      return '汇报有点飘，建议多对齐甲方关切。';
  }
}

export function PPTPresenter({ onComplete }: MinigameProps) {
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [index, setIndex] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [good, setGood] = useState(0);
  const [miss, setMiss] = useState(0);
  const [flash, setFlash] = useState<{ kind: HitKind; key: number } | null>(null);
  const [result, setResult] = useState<MinigameResult | null>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const settledRef = useRef(false);
  const resolvedRef = useRef(false);

  const zoneTopPx = PLAY_H * ZONE_TOP_FR;
  const zoneBottomPx = PLAY_H * ZONE_BOTTOM_FR;

  const finish = useCallback((p: number, g: number) => {
    if (settledRef.current) return;
    settledRef.current = true;
    const r = gradeFromHits(p, g);
    setResult(r);
    setPhase('settled');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (index < KEYWORDS.length) return;
    finish(perfect, good);
  }, [phase, index, perfect, good, finish]);

  const onBubbleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (phase !== 'playing' || index >= KEYWORDS.length || resolvedRef.current) return;
    e.stopPropagation();
    resolvedRef.current = true;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const cy = rect.top + rect.height / 2;
    const play = playRef.current?.getBoundingClientRect();
    if (!play) return;
    const localY = cy - play.top;

    let kind: HitKind;
    if (localY >= zoneTopPx && localY <= zoneBottomPx) {
      const innerTop = zoneTopPx + EDGE_PX;
      const innerBottom = zoneBottomPx - EDGE_PX;
      if (localY >= innerTop && localY <= innerBottom) kind = 'perfect';
      else kind = 'good';
    } else {
      kind = 'miss';
    }

    if (kind === 'perfect') setPerfect((p) => p + 1);
    else if (kind === 'good') setGood((g) => g + 1);
    else setMiss((m) => m + 1);

    setFlash({ kind, key: Date.now() });
    window.setTimeout(() => setFlash(null), 320);

    window.setTimeout(() => {
      resolvedRef.current = false;
      setIndex((i) => i + 1);
    }, 400);
  };

  const onBubbleComplete = () => {
    if (phase !== 'playing' || index >= KEYWORDS.length) return;
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    setMiss((m) => m + 1);
    setFlash({ kind: 'miss', key: Date.now() });
    window.setTimeout(() => setFlash(null), 280);
    window.setTimeout(() => {
      resolvedRef.current = false;
      setIndex((i) => i + 1);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && (
        <div className="flex justify-between text-xs font-semibold text-gray-600 px-0.5">
          <span>
            关键词 {Math.min(index + 1, KEYWORDS.length)}/{KEYWORDS.length}
          </span>
          <span className="tabular-nums">
            Perfect {perfect} · Good {good} · Miss {miss}
          </span>
        </div>
      )}

      <div
        ref={playRef}
        className="relative mx-auto w-full max-w-[340px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-amber-50/80"
        style={{ height: PLAY_H }}
      >
        <svg viewBox="0 0 320 380" width="100%" height="100%" className="absolute inset-0 block select-none pointer-events-none">
          <rect width="320" height="380" fill="#FEF9C3" opacity={0.5} />
          <ellipse cx="160" cy="300" rx="120" ry="36" fill="#D4A574" stroke="#92400E" strokeWidth="2" />
          <rect x="100" y="268" width="120" ry="4" height="16" fill="#B45309" opacity={0.35} />
          <circle cx="90" cy="250" r="14" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <circle cx="160" cy="232" r="14" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <circle cx="230" cy="250" r="14" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <circle cx="120" cy="268" r="14" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <circle cx="200" cy="268" r="14" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <line x1="160" y1="218" x2="160" y2="268" stroke="#78350F" strokeWidth="2" />
        </svg>

        <div
          className="absolute left-2 right-2 rounded-lg bg-blue-500/25 border border-blue-400/40 pointer-events-none"
          style={{ top: `${ZONE_TOP_FR * 100}%`, height: `${(ZONE_BOTTOM_FR - ZONE_TOP_FR) * 100}%` }}
        />

        <AnimatePresence>
          {phase === 'playing' && index < KEYWORDS.length && (
            <motion.button
              key={index}
              type="button"
              layout={false}
              className="absolute left-1/2 z-10 min-w-[120px] max-w-[200px] -translate-x-1/2 px-3 py-2 rounded-2xl bg-white border-2 border-gray-800 shadow-md text-sm font-bold text-gray-900 cursor-pointer hover:bg-amber-50"
              style={{ top: 0 }}
              initial={{ y: -56 }}
              animate={{ y: PLAY_H - 8 }}
              transition={{ duration: FALL_DURATION, ease: 'linear' }}
              onAnimationComplete={onBubbleComplete}
              onClick={onBubbleClick}
            >
              {KEYWORDS[index]}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {flash && (
            <motion.div
              key={flash.key}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {flash.kind === 'perfect' && (
                <div className="text-4xl font-black text-emerald-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]">
                  Perfect
                </div>
              )}
              {flash.kind === 'good' && (
                <div className="text-4xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.85)]">
                  Good
                </div>
              )}
              {flash.kind === 'miss' && <div className="text-5xl font-black text-red-600">✕</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-center text-gray-500">在蓝色击中带内点击下落的关键词气泡</p>

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
