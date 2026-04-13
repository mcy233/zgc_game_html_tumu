import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

const SECONDS_PER_Q = 8;
const PICK = 3;

type Q = { question: string; options: string[]; correctIndex: number };

const BANK: Q[] = [
  {
    question: '混凝土坍落度过大，最可能的原因是？',
    options: ['水灰比太大', '搅拌站老板太帅', '月亮引力异常', '用了矿泉水搅拌'],
    correctIndex: 0,
  },
  {
    question: '脚手架连墙件的作用是？',
    options: ['挂国旗', '防止架体倾覆', '晾工服', '装饰'],
    correctIndex: 1,
  },
  {
    question: "建筑施工中'三宝'是指？",
    options: ['安全帽安全带安全网', '烟酒茶', '钢筋水泥砖', '手机充电器耳机'],
    correctIndex: 0,
  },
  {
    question: '混凝土养护时间一般不少于？',
    options: ['7天', '7秒', '下班就行', '看心情'],
    correctIndex: 0,
  },
  {
    question: '临时用电中TN-S系统的特点是？',
    options: ['保护零线独立', '省电', '好看', '施工方便'],
    correctIndex: 0,
  },
  {
    question: '基坑开挖深度超过多少米需专家论证？',
    options: ['1米', '3米', '5米', '只要胆子大不需要'],
    correctIndex: 2,
  },
  {
    question: '以下哪项是高处作业？',
    options: ['站在板房屋顶', '2m及以上作业', '心态很高', '工资很高'],
    correctIndex: 1,
  },
  {
    question: '混凝土试块标准养护温度是？',
    options: ['20±2℃', '36.5℃(体温)', '随便', '冰箱里'],
    correctIndex: 0,
  },
  {
    question: '施工现场灭火器应多久检查一次？',
    options: ['每月', '着火的时候', '检查啥', '每年315'],
    correctIndex: 0,
  },
  {
    question: '安全技术交底应在什么时候进行？',
    options: ['出了事以后', '施工前', '下班前', '年终总结时'],
    correctIndex: 1,
  },
];

function shuffleOptions(q: Q): { question: string; options: string[]; correctIndex: number } {
  const entries = q.options.map((text, i) => ({ text, wasCorrect: i === q.correctIndex }));
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j]!, entries[i]!];
  }
  const correctIndex = entries.findIndex((e) => e.wasCorrect);
  return {
    question: q.question,
    options: entries.map((e) => e.text),
    correctIndex,
  };
}

function pickQuestions(): { question: string; options: string[]; correctIndex: number }[] {
  const idx = [...Array(BANK.length).keys()];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return idx.slice(0, PICK).map((i) => shuffleOptions(BANK[i]!));
}

function gradeFromCorrect(n: number): MinigameResult {
  let grade: MinigameResult['grade'];
  let bonusMultiplier: number;
  if (n >= 3) {
    grade = 'S';
    bonusMultiplier = 1.5;
  } else if (n === 2) {
    grade = 'A';
    bonusMultiplier = 1.2;
  } else if (n === 1) {
    grade = 'B';
    bonusMultiplier = 1.0;
  } else {
    grade = 'C';
    bonusMultiplier = 0.8;
  }
  const score = Math.round((n / 3) * 100);
  return { score, grade, bonusMultiplier };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S':
      return '学霸附体，考证路上横着走。';
    case 'A':
      return '基础扎实，再刷几套题就稳了。';
    case 'B':
      return '还行，错题本记得安排上。';
    case 'C':
    default:
      return '别灰心，规范翻一翻，分数翻一番。';
  }
}

export function QuizChallenge({ onComplete }: MinigameProps) {
  const rounds = useMemo(() => pickQuestions(), []);
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [qi, setQi] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_PER_Q);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<MinigameResult | null>(null);
  const [revealed, setRevealed] = useState(false);

  const resolvedRef = useRef(false);
  const correctRef = useRef(0);
  correctRef.current = correctCount;

  const current = rounds[qi];

  const settle = useCallback((finalCorrect: number) => {
    const r = gradeFromCorrect(finalCorrect);
    setResult(r);
    setPhase('settled');
  }, []);

  const startNextQuestion = useCallback(() => {
    resolvedRef.current = false;
    setPicked(null);
    setRevealed(false);
    setSecondsLeft(SECONDS_PER_Q);
    setQi((q) => q + 1);
  }, []);

  const resolveRound = useCallback(
    (choiceIndex: number | null) => {
      if (resolvedRef.current || phase !== 'playing') return;
      resolvedRef.current = true;
      const cur = rounds[qi];
      if (!cur) return;

      const ok = choiceIndex !== null && choiceIndex === cur.correctIndex;
      const nextCorrect = correctRef.current + (ok ? 1 : 0);
      setCorrectCount(nextCorrect);
      setRevealed(true);

      const done = qi + 1 >= rounds.length;
      window.setTimeout(() => {
        if (done) settle(nextCorrect);
        else startNextQuestion();
      }, 750);
    },
    [phase, qi, rounds, settle, startNextQuestion],
  );

  useEffect(() => {
    if (phase !== 'playing') return;
    if (qi >= rounds.length) return;
    if (revealed) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase, qi, revealed, rounds.length]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (revealed) return;
    if (secondsLeft !== 0) return;
    resolveRound(picked);
  }, [secondsLeft, phase, revealed, picked, resolveRound]);

  const onChoose = (i: number) => {
    if (phase !== 'playing' || revealed) return;
    setPicked(i);
    resolveRound(i);
  };

  const progress = secondsLeft / SECONDS_PER_Q;

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && qi < rounds.length && (
        <>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-violet-500"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-600 px-0.5">
            <span>
              第 {qi + 1}/{rounds.length} 题
            </span>
            <span className="tabular-nums">剩余 {Math.max(0, secondsLeft)} 秒</span>
          </div>
        </>
      )}

      {phase === 'playing' && current && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
          <p className="text-sm font-bold text-gray-900 leading-snug mb-4">{current.question}</p>
          <div className="flex flex-col gap-2">
            {current.options.map((opt, i) => {
              const isRight = i === current.correctIndex;
              const isPicked = picked === i;
              let cls =
                'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ';
              if (!revealed) {
                cls += 'border-gray-200 bg-white hover:bg-violet-50 hover:border-violet-300';
              } else if (isRight) {
                cls += 'border-emerald-500 bg-emerald-50 text-emerald-900';
              } else if (isPicked && !isRight) {
                cls += 'border-red-400 bg-red-50 text-red-900';
              } else {
                cls += 'border-gray-100 bg-white/60 text-gray-500';
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={revealed}
                  onClick={() => onChoose(i)}
                  className={cls}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-center text-gray-500">建筑工程趣味快答，超时未选视为错误</p>

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
