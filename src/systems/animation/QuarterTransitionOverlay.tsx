import { useEffect, useRef } from 'react';

export interface QuarterTransitionOverlayProps {
  show: boolean;
  seasonLabel: string;
  onComplete: () => void;
}

const TOTAL_DURATION_MS = 1400;

export function QuarterTransitionOverlay({ show, seasonLabel, onComplete }: QuarterTransitionOverlayProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onCompleteRef.current(), TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-auto"
      style={{ animation: 'qt-curtain 1.4s ease-in-out forwards' }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-black/55" />

      <div
        className="relative z-10 w-[min(220px,70vw)] h-[min(260px,42vh)]"
        style={{ perspective: 900, transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 rounded-2xl border border-amber-200/80 bg-[#f5f0e6] shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center gap-2"
          style={{ transform: 'translateZ(-2px)' }}
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">新季度</span>
          <span className="text-2xl sm:text-3xl font-serif font-black text-stone-800">{seasonLabel}</span>
        </div>

        <div
          className="absolute inset-0 rounded-2xl border border-white/70 bg-white shadow-lg flex items-center justify-center"
          style={{
            transformOrigin: 'bottom center',
            backfaceVisibility: 'hidden',
            animation: 'qt-flip 0.6s ease-in 0.3s forwards',
          }}
        >
          <span className="text-sm font-bold text-stone-400 tracking-widest">季度台账</span>
        </div>
      </div>
    </div>
  );
}
