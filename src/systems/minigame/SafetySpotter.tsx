import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

const DURATION_SEC = 15;
const TOTAL = 5;

type HazardId = 'no_helmet' | 'no_guardrail' | 'open_hole' | 'messy_materials' | 'exposed_wire';

const HAZARDS: { id: HazardId; label: string; x: number; y: number; w: number; h: number }[] = [
  { id: 'no_helmet', label: '工人未戴安全帽', x: 118, y: 118, w: 36, h: 36 },
  { id: 'no_guardrail', label: '临边缺少防护栏杆', x: 200, y: 200, w: 88, h: 28 },
  { id: 'open_hole', label: '洞口未覆盖防护', x: 48, y: 312, w: 52, h: 36 },
  { id: 'messy_materials', label: '材料堆放杂乱', x: 208, y: 300, w: 72, h: 56 },
  { id: 'exposed_wire', label: '电线裸露', x: 22, y: 168, w: 80, h: 56 },
];

function gradeForFound(found: number): Pick<MinigameResult, 'grade' | 'bonusMultiplier' | 'score'> {
  const score = Math.min(100, Math.round((found / TOTAL) * 100));
  if (found <= 1) return { grade: 'C', bonusMultiplier: 0.8, score };
  if (found === 2) return { grade: 'B', bonusMultiplier: 1.0, score };
  if (found <= 4) return { grade: 'A', bonusMultiplier: 1.3, score };
  return { grade: 'S', bonusMultiplier: 1.5, score: 100 };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S':
      return '你的安全意识让项目经理刮目相看！';
    case 'A':
      return '观察力在线，现场管理味很正。';
    case 'B':
      return '基本合格，继续加油。';
    case 'C':
    default:
      return '安全意识还需加强，多留心现场细节。';
  }
}

export function SafetySpotter({ onComplete }: MinigameProps) {
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [found, setFound] = useState<Set<HazardId>>(() => new Set());
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SEC);
  const [result, setResult] = useState<MinigameResult | null>(null);
  const foundRef = useRef(found);
  foundRef.current = found;
  const settledRef = useRef(false);

  const foundCount = found.size;

  const settle = useCallback((foundNow: Set<HazardId>) => {
    if (settledRef.current) return;
    settledRef.current = true;
    const n = foundNow.size;
    const r: MinigameResult = { ...gradeForFound(n) };
    setResult(r);
    setPhase('settled');
  }, []);

  useEffect(() => {
    if (phase === 'playing') settledRef.current = false;
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (secondsLeft !== 0) return;
    settle(new Set(foundRef.current));
  }, [phase, secondsLeft, settle]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (foundCount < TOTAL) return;
    settle(new Set(found));
  }, [phase, foundCount, found, settle]);

  const progress = useMemo(() => secondsLeft / DURATION_SEC, [secondsLeft]);

  const onHit = (id: HazardId) => {
    if (phase !== 'playing') return;
    if (found.has(id)) return;
    setFound((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && (
        <>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-amber-500"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-600 px-0.5">
            <span>剩余 {Math.max(0, secondsLeft)} 秒</span>
            <span>
              已发现 {foundCount}/{TOTAL}
            </span>
          </div>
        </>
      )}

      <div className="relative mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-sky-100">
        <svg viewBox="0 0 300 400" width={300} height={400} className="block select-none">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>
          <rect width="300" height="400" fill="url(#skyGrad)" />
          <rect x="0" y="280" width="300" height="120" fill="#D1D5DB" />
          <line x1="40" y1="280" x2="40" y2="120" stroke="#6B7280" strokeWidth="4" />
          <line x1="100" y1="280" x2="100" y2="100" stroke="#6B7280" strokeWidth="4" />
          <line x1="160" y1="280" x2="160" y2="110" stroke="#6B7280" strokeWidth="4" />
          <line x1="220" y1="280" x2="220" y2="130" stroke="#6B7280" strokeWidth="4" />
          <line x1="30" y1="160" x2="230" y2="200" stroke="#6B7280" strokeWidth="3" />
          <line x1="50" y1="200" x2="240" y2="150" stroke="#6B7280" strokeWidth="3" />
          <rect x="200" y="220" width="80" height="14" fill="#9CA3AF" />
          <rect x="215" y="206" width="12" height="28" fill="#9CA3AF" />
          <rect x="70" y="240" width="90" height="16" fill="#9CA3AF" />
          <rect x="105" y="210" width="18" height="46" fill="#9CA3AF" />

          {/* Worker — head intentionally without helmet (hazard 1) */}
          <g>
            <circle cx="135" cy="128" r="10" fill="#374151" />
            <line x1="135" y1="138" x2="135" y2="175" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
            <line x1="135" y1="150" x2="115" y2="168" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
            <line x1="135" y1="150" x2="158" y2="162" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
            <line x1="135" y1="175" x2="122" y2="205" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
            <line x1="135" y1="175" x2="152" y2="202" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Platform edge without guardrail */}
          <rect x="198" y="198" width="92" height="8" fill="#6B7280" opacity="0.35" />

          {/* Open hole */}
          <rect x="52" y="318" width="44" height="28" rx="2" fill="#1F2937" opacity="0.85" />

          {/* Messy materials */}
          <g>
            <rect x="220" y="318" width="22" height="18" fill="#78716C" transform="rotate(-18 231 327)" />
            <rect x="238" y="312" width="24" height="20" fill="#A8A29E" transform="rotate(12 250 322)" />
            <rect x="252" y="328" width="20" height="16" fill="#57534E" transform="rotate(-25 262 336)" />
          </g>

          {/* Exposed wire */}
          <path
            d="M 28 210 Q 55 180 72 205 T 98 195"
            fill="none"
            stroke="#DC2626"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {HAZARDS.map((h) => (
            <g key={h.id}>
              <rect
                x={h.x}
                y={h.y}
                width={h.w}
                height={h.h}
                fill="transparent"
                className="cursor-pointer hover:fill-white/10"
                onClick={() => onHit(h.id)}
              />
              {found.has(h.id) && (
                <g>
                  <motion.circle
                    key={h.id}
                    cx={h.x + h.w / 2}
                    cy={h.y + h.h / 2}
                    r={14}
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth={3}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                  />
                  <text
                    x={h.x + h.w / 2}
                    y={h.y - 6}
                    textAnchor="middle"
                    fill="#DC2626"
                    fontSize={10}
                    fontWeight={700}
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    {h.label}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      <p className="text-xs text-center text-gray-500">点击图中隐患区域进行标记</p>

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
