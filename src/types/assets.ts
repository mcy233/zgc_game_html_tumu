/**
 * 工地物资与装备（结构同原 Asset，效果字段改为工地语境）
 * type 枚举不变，仅语义上对应：硬件/软件/生活/服务类采购
 */
export interface Asset {
  id: string;
  name: string;
  description: string;
  price: number;
  sellPrice: number;
  type: 'HARDWARE' | 'SOFTWARE' | 'LIFESTYLE' | 'SERVICE';
  effect: {
    moraleCostMultiplier?: number;
    staminaCostMultiplier?: number;
    energyGainMultiplier?: number;
    progressGainMultiplier?: number;
    materialsGainPerQuarter?: number;
    salaryGainPerQuarter?: number;
    reputationGainMultiplier?: number;
  };
}
