import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

interface MathProblem {
  question: string;
  options: number[];
  correctIndex: number;
}

const TEMPLATES: (() => MathProblem)[] = [
  () => {
    const l = rand(3, 12);
    const w = rand(2, 8);
    const h = rand(0.3, 0.8, 1);
    const answer = +(l * w * h).toFixed(1);
    return mix(`${l}m × ${w}m × ${h}m 板混凝土方量？`, answer, 'm³');
  },
  () => {
    const d = rand(8, 25);
    const n = rand(20, 60);
    const unitWt: Record<number, number> = { 8: 0.395, 10: 0.617, 12: 0.888, 14: 1.21, 16: 1.58, 18: 2.0, 20: 2.47, 22: 2.98, 25: 3.85 };
    const closest = Object.keys(unitWt).map(Number).reduce((a, b) => Math.abs(b - d) < Math.abs(a - d) ? b : a);
    const answer = +(unitWt[closest]! * n).toFixed(1);
    return mix(`φ${closest}钢筋 ${n}根×1m，重量？`, answer, 'kg');
  },
  () => {
    const bags = rand(5, 20);
    const answer = bags * 50;
    return mix(`${bags}袋水泥（50kg/袋），总重？`, answer, 'kg');
  },
  () => {
    const l = rand(10, 30);
    const w = rand(8, 20);
    const answer = l * w;
    return mix(`${l}m × ${w}m 脚手架面积？`, answer, 'm²');
  },
  () => {
    const total = rand(800, 2000);
    const done = rand(30, 70);
    const answer = Math.round(total * done / 100);
    return mix(`总量${total}m³，完成${done}%，已浇多少？`, answer, 'm³');
  },
  () => {
    const perFloor = +(rand(2.8, 3.5, 1)).toFixed(1);
    const floors = rand(3, 12);
    const answer = +(perFloor * floors).toFixed(1);
    return mix(`层高${perFloor}m × ${floors}层 = 总高？`, answer, 'm');
  },
  () => {
    const price = rand(300, 600);
    const qty = rand(10, 50);
    const answer = price * qty;
    return mix(`钢管${price}元/吨×${qty}吨，总价？`, answer, '元');
  },
  () => {
    const a = rand(5, 15);
    const b = rand(5, 15);
    const answer = +(a * b / 2).toFixed(1);
    return mix(`三角形面积：底${a}m 高${b}m？`, answer, 'm²');
  },
];

function rand(min: number, max: number, decimals = 0): number {
  const v = min + Math.random() * (max - min);
  return decimals > 0 ? +v.toFixed(decimals) : Math.floor(v);
}

function mix(question: string, answer: number, _unit: string): MathProblem {
  const correctIndex = Math.floor(Math.random() * 4);
  const options: number[] = [];
  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(answer);
    } else {
      let fake: number;
      do {
        const offset = answer * (0.1 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
        fake = +(answer + offset).toFixed(1);
      } while (fake === answer || fake <= 0 || options.includes(fake));
      options.push(fake);
    }
  }
  return { question, options, correctIndex };
}

const TOTAL_ROUNDS = 6;
const TIME_PER_ROUND_MS = 8000;

function gradeFromScore(correct: number): MinigameResult {
  let grade: MinigameResult['grade'];
  let bonusMultiplier: number;
  if (correct >= 6) { grade = 'S'; bonusMultiplier = 1.5; }
  else if (correct >= 4) { grade = 'A'; bonusMultiplier = 1.3; }
  else if (correct >= 3) { grade = 'B'; bonusMultiplier = 1.0; }
  else { grade = 'C'; bonusMultiplier = 0.8; }
  return { score: Math.min(100, Math.round((correct / TOTAL_ROUNDS) * 100)), grade, bonusMultiplier };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S': return '心算如飞，你就是工地人形计算器！';
    case 'A': return '不错，算量速度让商务都刮目相看。';
    case 'B': return '基本功还行，多练练心算。';
    case 'C': default: return '建议随身带计算器……';
  }
}

export function NumberCruncher({ onComplete }: MinigameProps) {
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND_MS);
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [result, setResult] = useState<MinigameResult | null>(null);

  const generateProblem = useCallback(() => {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]!;
    setProblem(template());
    setTimeLeft(TIME_PER_ROUND_MS);
    setFeedback(null);
  }, []);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          setFeedback('wrong');
          return 0;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase, feedback, round]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= TOTAL_ROUNDS) {
        const r = gradeFromScore(correct + (feedback === 'correct' ? 0 : 0));
        setResult(r);
        setPhase('settled');
      } else {
        setRound(nextRound);
        generateProblem();
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [feedback, round, correct, generateProblem]);

  const handleChoice = (idx: number) => {
    if (feedback || !problem) return;
    if (idx === problem.correctIndex) {
      setCorrect((c) => c + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  };

  const timePercent = (timeLeft / TIME_PER_ROUND_MS) * 100;

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && problem && (
        <>
          <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 px-0.5">
            <span>第 {round + 1}/{TOTAL_ROUNDS} 题</span>
            <span className="tabular-nums">正确 {correct}</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${timePercent > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
              animate={{ width: `${timePercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-800/40 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-relaxed">{problem.question}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {problem.options.map((opt, idx) => {
              let btnClass = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500';
              if (feedback && idx === problem.correctIndex) {
                btnClass = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500';
              } else if (feedback === 'wrong' && idx !== problem.correctIndex) {
                btnClass = 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChoice(idx)}
                  disabled={!!feedback}
                  className={`px-4 py-3.5 rounded-xl border-2 text-base font-bold tabular-nums text-gray-900 dark:text-gray-100 transition-all ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.p
                className="text-center text-emerald-600 dark:text-emerald-400 font-black text-lg"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                正确！
              </motion.p>
            )}
            {feedback === 'wrong' && (
              <motion.p
                className="text-center text-red-600 dark:text-red-400 font-black text-lg"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              >
                答错了
              </motion.p>
            )}
          </AnimatePresence>
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
