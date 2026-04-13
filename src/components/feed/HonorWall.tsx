import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';

export interface HonorWallItem {
  id: string;
  headlineTitle: string;
  unlockBody: string;
}

export interface HonorWallProps {
  honors: HonorWallItem[];
}

export function HonorWall({ honors }: HonorWallProps) {
  if (honors.length === 0) {
    return (
      <motion.div
        key="honors-empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-10 opacity-40 dark:opacity-50 flex flex-col items-center gap-2"
      >
        <Trophy size={32} className="opacity-50 dark:opacity-60" />
        <p className="text-xs text-gray-600 dark:text-gray-400 px-2">
          荣誉墙尚空，推进施工里程碑后将在此挂牌展示。
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="honors-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-3"
    >
      <ul className="flex flex-col gap-2">
        {honors.map((h) => (
          <li
            key={h.id}
            className="rounded-xl border border-black/5 dark:border-white/10 bg-violet-50/40 dark:bg-violet-950/30 px-3 py-2 text-left"
          >
            <p className="text-xs font-bold text-violet-950 dark:text-violet-200 leading-snug">{h.headlineTitle}</p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{h.unlockBody}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
