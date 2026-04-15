import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Info } from 'lucide-react';

interface InfoTipProps {
  lines: { label: string; value: string; color?: string }[];
  title?: string;
  size?: number;
}

export function InfoTip({ lines, title, size = 14 }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  return (
    <span className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors ml-1"
        aria-label="查看详情"
      >
        <Info size={size} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-1.5"
          >
            {title && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">{title}</p>
            )}
            {lines.map((line, i) => (
              <div key={i} className="flex justify-between text-[11px] font-mono leading-tight">
                <span className="text-gray-600 dark:text-gray-400 shrink-0 mr-2">{line.label}</span>
                <span className={line.color ?? 'text-gray-900 dark:text-gray-100'}>{line.value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
