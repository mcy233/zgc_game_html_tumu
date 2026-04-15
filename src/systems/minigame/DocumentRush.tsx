import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MinigameProps, MinigameResult } from './types';

interface DocItem {
  id: number;
  name: string;
  category: string;
}

const DOC_CATEGORIES = ['质量', '安全', '技术', '商务'] as const;

const ALL_DOCS: { name: string; category: string }[] = [
  { name: '检验批验收记录', category: '质量' },
  { name: '混凝土试块报告', category: '质量' },
  { name: '钢筋隐蔽验收', category: '质量' },
  { name: '回弹检测报告', category: '质量' },
  { name: '防水试验记录', category: '质量' },
  { name: '安全交底记录', category: '安全' },
  { name: '高处作业许可证', category: '安全' },
  { name: '消防演练记录', category: '安全' },
  { name: '安全培训签到表', category: '安全' },
  { name: '临电验收单', category: '安全' },
  { name: '施工组织设计', category: '技术' },
  { name: '专项施工方案', category: '技术' },
  { name: '图纸会审纪要', category: '技术' },
  { name: '设计变更通知', category: '技术' },
  { name: '技术交底记录', category: '技术' },
  { name: '工程量清单', category: '商务' },
  { name: '签证变更单', category: '商务' },
  { name: '合同补充协议', category: '商务' },
  { name: '月度结算报表', category: '商务' },
  { name: '索赔意向函', category: '商务' },
];

const TOTAL_DOCS = 10;
const TIME_LIMIT_MS = 30000;

const CATEGORY_COLORS: Record<string, string> = {
  '质量': 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500',
  '安全': 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500',
  '技术': 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500',
  '商务': 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500',
};

function gradeFromScore(correct: number): MinigameResult {
  let grade: MinigameResult['grade'];
  let bonusMultiplier: number;
  if (correct >= 9) { grade = 'S'; bonusMultiplier = 1.5; }
  else if (correct >= 7) { grade = 'A'; bonusMultiplier = 1.3; }
  else if (correct >= 5) { grade = 'B'; bonusMultiplier = 1.0; }
  else { grade = 'C'; bonusMultiplier = 0.8; }
  return { score: Math.min(100, Math.round((correct / TOTAL_DOCS) * 100)), grade, bonusMultiplier };
}

function messageForGrade(grade: MinigameResult['grade']): string {
  switch (grade) {
    case 'S': return '归档神速！监理都想直接验收了。';
    case 'A': return '条理清晰，资料管理有前途。';
    case 'B': return '勉强够用，但被监理抽查可能紧张。';
    case 'C': default: return '这分类……监理看了要写整改通知。';
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function DocumentRush({ onComplete }: MinigameProps) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; category: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);
  const [phase, setPhase] = useState<'playing' | 'settled'>('playing');
  const [result, setResult] = useState<MinigameResult | null>(null);

  useEffect(() => {
    const picked = shuffle(ALL_DOCS).slice(0, TOTAL_DOCS);
    setDocs(picked.map((d, i) => ({ ...d, id: i })));
  }, []);

  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          const r = gradeFromScore(correct);
          setResult(r);
          setPhase('settled');
          return 0;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase, feedback, correct]);

  const handleCategory = useCallback((cat: string) => {
    if (feedback || currentIdx >= docs.length) return;
    const doc = docs[currentIdx]!;
    const isCorrect = doc.category === cat;
    if (isCorrect) setCorrect((c) => c + 1);
    setFeedback({ type: isCorrect ? 'correct' : 'wrong', category: doc.category });

    setTimeout(() => {
      const next = currentIdx + 1;
      if (next >= docs.length) {
        const finalCorrect = correct + (isCorrect ? 1 : 0);
        const r = gradeFromScore(finalCorrect);
        setResult(r);
        setPhase('settled');
      } else {
        setCurrentIdx(next);
        setFeedback(null);
      }
    }, 500);
  }, [feedback, currentIdx, docs, correct]);

  const currentDoc = docs[currentIdx];
  const timePercent = (timeLeft / TIME_LIMIT_MS) * 100;

  return (
    <div className="flex flex-col gap-3 items-stretch">
      {phase === 'playing' && currentDoc && (
        <>
          <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 px-0.5">
            <span>资料 {currentIdx + 1}/{TOTAL_DOCS}</span>
            <span className="tabular-nums">正确 {correct}</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${timePercent > 30 ? 'bg-blue-500' : 'bg-red-500'}`}
              animate={{ width: `${timePercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentDoc.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-600 text-center shadow-sm"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">归入哪个类别？</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentDoc.name}</p>
              {feedback && (
                <p className={`text-sm mt-2 font-bold ${feedback.type === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {feedback.type === 'correct' ? '正确！' : `应归入 → ${feedback.category}`}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-2">
            {DOC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategory(cat)}
                disabled={!!feedback}
                className={`px-4 py-3.5 rounded-xl text-white font-bold text-base transition-all disabled:opacity-70 ${CATEGORY_COLORS[cat]}`}
              >
                {cat}
              </button>
            ))}
          </div>
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
