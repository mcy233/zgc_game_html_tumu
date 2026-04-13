import type { ComponentType } from 'react';

export interface MinigameResult {
  score: number; // 0-100
  grade: 'S' | 'A' | 'B' | 'C';
  bonusMultiplier: number; // 对行动效果的加成倍率 (1.0 = 无加成, 1.5 = 50%加成)
}

export interface MinigameProps {
  onComplete: (result: MinigameResult) => void;
  onSkip: () => void; // 玩家选择跳过
}

export interface MinigameConfig {
  id: string;
  triggerAction: string; // 触发的行动 id
  triggerChance: number; // 触发概率 0-1
  component: ComponentType<MinigameProps>;
}
