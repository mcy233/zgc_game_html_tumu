import { motion, AnimatePresence } from 'motion/react';
import type { ProjectScore } from '../../engine/projectManager';

export interface ProjectScoreModalProps {
  open: boolean;
  score: ProjectScore | null;
  projectName: string;
  onContinue: () => void;
}

const gradeColors: Record<ProjectScore['overallGrade'], string> = {
  S: 'text-violet-600 dark:text-violet-400',
  A: 'text-amber-600 dark:text-amber-500',
  B: 'text-emerald-600 dark:text-emerald-400',
  C: 'text-orange-600 dark:text-orange-500',
  D: 'text-red-600 dark:text-red-500',
};

export function ProjectScoreModal({ open, score, projectName, onContinue }: ProjectScoreModalProps) {
  if (!score) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl max-w-md w-full shadow-2xl flex flex-col gap-6"
          >
            <div className="text-center">
              <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase">项目完工评价</p>
              <h2 className="text-xl font-bold mt-2 dark:text-gray-100">{projectName}</h2>
              <p className={`text-6xl font-bold mt-4 ${gradeColors[score.overallGrade]}`}>
                {score.overallGrade}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-mono opacity-50 dark:text-gray-500">进度评分</p>
                <p className="text-lg font-bold dark:text-gray-100">{score.progressScore}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-mono opacity-50 dark:text-gray-500">安全评分</p>
                <p className="text-lg font-bold dark:text-gray-100">{score.safetyScore}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-mono opacity-50 dark:text-gray-500">甲方满意</p>
                <p className="text-lg font-bold dark:text-gray-100">{score.ownerScore}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-mono opacity-50 dark:text-gray-500">上级评价</p>
                <p className="text-lg font-bold dark:text-gray-100">{score.bossScore}</p>
              </div>
            </div>

            {score.narrativeLines.map((line, i) => (
              <p key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {line}
              </p>
            ))}

            <button
              type="button"
              onClick={onContinue}
              className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              进入转场期
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
