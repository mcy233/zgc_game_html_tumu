import type { CSSProperties } from 'react';
import { isCharacterAvatarEnabled } from '../featureFlags';

export interface CharacterAvatarProps {
  morale: number;
  stamina: number;
  energy: number;
  safetyRisk: number;
  size?: number;
  className?: string;
}

type AvatarMood = 'danger' | 'tired' | 'sad' | 'happy' | 'normal';

function resolveMood(morale: number, stamina: number, safetyRisk: number): AvatarMood {
  if (safetyRisk > 70) return 'danger';
  if (stamina < 30) return 'tired';
  if (morale < 30) return 'sad';
  if (morale > 70) return 'happy';
  return 'normal';
}

const COLORS = {
  face: '#FFD7A3',
  ink: '#1F2937',
  helmet: '#F59E0B',
  helmetDanger: '#EF4444',
  star: '#FBBF24',
  cloud: '#9CA3AF',
  sweat: '#60A5FA',
} as const;

export function CharacterAvatar({
  morale,
  stamina,
  energy,
  safetyRisk,
  size,
  className = '',
}: CharacterAvatarProps) {
  if (!isCharacterAvatarEnabled()) {
    return (
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border-4 border-white shadow-md shrink-0 ${className}`.trim()}
        aria-hidden
      />
    );
  }

  const mood = resolveMood(morale, stamina, safetyRisk);
  const helmetFill = mood === 'danger' ? COLORS.helmetDanger : COLORS.helmet;
  const showStar = mood === 'happy';
  const showCloud = mood === 'sad';
  const showSweat = mood !== 'danger' && mood !== 'sad' && energy < 30;
  const helmetTilt = mood === 'tired' ? 'rotate(-5 60 52)' : undefined;

  const wrapperStyle: CSSProperties | undefined =
    size != null ? { width: size, height: size } : undefined;
  const wrapperSizeClass = size != null ? '' : 'w-20 h-20 sm:w-24 sm:h-24';

  return (
    <>
      <style>{`
        @keyframes ca-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes ca-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        @keyframes ca-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .ca-twinkle { animation: ca-twinkle 1.2s ease-in-out infinite; }
        .ca-drift { animation: ca-drift 2.5s ease-in-out infinite; }
        .ca-shake { animation: ca-shake 0.35s ease-in-out infinite; }
      `}</style>
      <div
        className={`${wrapperSizeClass} rounded-full border-4 border-white shadow-md shrink-0 overflow-hidden bg-[#F8FAFC] flex items-center justify-center ${
          mood === 'danger' ? 'ca-shake' : ''
        } ${className}`.trim()}
        style={wrapperStyle}
        role="img"
        aria-label="工地角色头像"
      >
        <svg viewBox="0 0 120 120" className="w-[85%] h-[85%]" aria-hidden>
          <g transform={helmetTilt}>
            {/* Helmet dome + brim */}
            <path
              d="M 26 60 A 34 34 0 0 1 94 60 L 92 66 L 28 66 Z"
              fill={helmetFill}
              stroke={COLORS.ink}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {mood === 'danger' && (
              <g transform="translate(60, 38)">
                <rect x={-1} y={-10} width={2} height={12} rx={1} fill="#FEF3C7" stroke={COLORS.ink} strokeWidth={0.75} />
                <circle cx={0} cy={6} r={2.5} fill="#FEF3C7" stroke={COLORS.ink} strokeWidth={0.75} />
              </g>
            )}
          </g>

          {/* Face */}
          <circle cx={60} cy={74} r={28} fill={COLORS.face} stroke={COLORS.ink} strokeWidth={1.25} />

          {/* Eyes + mouth by mood */}
          {mood === 'happy' && (
            <g stroke={COLORS.ink} strokeWidth={2} fill="none" strokeLinecap="round">
              <path d="M 44 69 Q 48 64 52 69" />
              <path d="M 68 69 Q 72 64 76 69" />
              <path d="M 48 84 Q 60 94 72 84" />
            </g>
          )}

          {mood === 'normal' && (
            <g fill={COLORS.ink}>
              <circle cx={48} cy={72} r={3} />
              <circle cx={72} cy={72} r={3} />
              <rect x={46} y={83} width={28} height={2.5} rx={1} />
            </g>
          )}

          {mood === 'tired' && (
            <g stroke={COLORS.ink} strokeWidth={2.2} strokeLinecap="round" fill="none">
              <path d="M 44 72 L 52 72" />
              <path d="M 68 72 L 76 72" />
              <path d="M 46 84 C 50 80 54 88 58 84 C 62 80 66 88 70 84 C 74 80 78 88 82 84" />
            </g>
          )}

          {mood === 'sad' && (
            <g fill={COLORS.ink}>
              <circle cx={48} cy={72} r={2.25} />
              <circle cx={72} cy={72} r={2.25} />
              <path
                d="M 48 88 Q 60 78 72 88"
                fill="none"
                stroke={COLORS.ink}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </g>
          )}

          {mood === 'danger' && (
            <g>
              <circle cx={48} cy={72} r={9} fill="none" stroke={COLORS.ink} strokeWidth={2} />
              <circle cx={72} cy={72} r={9} fill="none" stroke={COLORS.ink} strokeWidth={2} />
              <circle cx={48} cy={72} r={3} fill={COLORS.ink} />
              <circle cx={72} cy={72} r={3} fill={COLORS.ink} />
              <ellipse cx={60} cy={88} rx={5} ry={7} fill="none" stroke={COLORS.ink} strokeWidth={2} />
            </g>
          )}

          {showStar && (
            <g className="ca-twinkle" transform="translate(82, 22)">
              <polygon
                points="0,-7 1.8,-2.2 6.8,-2.2 2.8,1 4.5,6 0,3.2 -4.5,6 -2.8,1 -6.8,-2.2 -1.8,-2.2"
                fill={COLORS.star}
                stroke={COLORS.ink}
                strokeWidth={0.6}
                strokeLinejoin="round"
              />
            </g>
          )}

          {showCloud && (
            <g className="ca-drift">
              <g transform="translate(38, 14)">
                <circle cx={8} cy={10} r={7} fill={COLORS.cloud} opacity={0.95} />
                <circle cx={18} cy={8} r={9} fill={COLORS.cloud} opacity={0.95} />
                <circle cx={28} cy={10} r={7} fill={COLORS.cloud} opacity={0.95} />
                <circle cx={14} cy={14} r={6} fill={COLORS.cloud} opacity={0.95} />
                <circle cx={24} cy={14} r={6} fill={COLORS.cloud} opacity={0.95} />
              </g>
            </g>
          )}

          {showSweat && (
            <path
              d="M 88 58 Q 92 66 90 74 Q 88 78 86 74 Q 84 68 88 58"
              fill={COLORS.sweat}
              stroke={COLORS.ink}
              strokeWidth={0.75}
              opacity={0.9}
            />
          )}
        </svg>
      </div>
    </>
  );
}
