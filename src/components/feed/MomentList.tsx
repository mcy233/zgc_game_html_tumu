import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, ThumbsUp } from 'lucide-react';
import type { Moment } from '../../types/index';

export interface MomentListProps {
  moments: Moment[];
  onInteract: (momentId: string) => void;
}

export function MomentList({ moments, onInteract }: MomentListProps) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const handleLike = useCallback(
    (momentId: string) => {
      onInteract(momentId);
      setLikedIds((prev) => new Set(prev).add(momentId));
      setTimeout(() => {
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(momentId);
          return next;
        });
      }, 1200);
    },
    [onInteract]
  );

  if (moments.length === 0) {
    return (
      <motion.div
        key="moments-empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-10 opacity-30 dark:opacity-40 flex flex-col items-center gap-2 dark:text-gray-500"
      >
        <Share2 size={32} />
        <p className="text-xs">工友圈还没有新动态</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="moments-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      {moments.map((moment) => (
        <motion.div
          key={moment.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-black/5 dark:border-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                moment.author === '我'
                  ? 'bg-black dark:bg-white dark:text-black'
                  : 'bg-indigo-500 dark:bg-indigo-600'
              }`}
            >
              {moment.author[0]}
            </div>
            <span className="text-[10px] font-bold dark:text-gray-100">{moment.author}</span>
            <span className="text-[10px] opacity-30 dark:opacity-50 dark:text-gray-500 ml-auto">{moment.timestamp}</span>
          </div>
          <p className="text-xs leading-relaxed mb-3 dark:text-gray-300">{moment.content}</p>

          {moment.comments && moment.comments.length > 0 && (
            <div className="mb-3 space-y-2 bg-black/5 dark:bg-gray-800/50 p-2 rounded-xl">
              {moment.comments.map((comment, idx) => (
                <div key={idx} className="text-[10px] leading-tight">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{comment.author}: </span>
                  <span className="text-gray-600 dark:text-gray-400">{comment.content}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-black/5 dark:border-white/10 pt-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => handleLike(moment.id)}
                disabled={moment.hasInteracted}
                className={`flex items-center gap-1 text-[10px] transition-all ${
                  moment.hasInteracted
                    ? 'text-rose-500 dark:text-rose-400 font-bold'
                    : 'text-gray-400 hover:text-black dark:hover:text-gray-100'
                }`}
              >
                <ThumbsUp size={12} className={moment.hasInteracted ? 'fill-current' : ''} />{' '}
                {moment.likes}
              </button>
              <AnimatePresence>
                {likedIds.has(moment.id) && (
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -28 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute left-full ml-1 -top-1 text-[11px] font-bold text-rose-500 dark:text-rose-400 whitespace-nowrap pointer-events-none"
                  >
                    +2 心态
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
