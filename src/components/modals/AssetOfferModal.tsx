import { motion, AnimatePresence } from 'motion/react';
import { Package } from 'lucide-react';
import type { Asset } from '../../types/index';

const TYPE_LABEL: Record<Asset['type'], string> = {
  HARDWARE: '硬件装备',
  SOFTWARE: '软件工具',
  LIFESTYLE: '生活物资',
  SERVICE: '现场服务',
};

export interface AssetOfferModalProps {
  open: boolean;
  asset: Asset | null;
  vendorTitle: string | undefined;
  playerSalary: number;
  onBuy: (asset: Asset) => void;
  onDecline: () => void;
  formatAssetEffectLines: (asset: Asset) => string[];
}

export function AssetOfferModal({
  open,
  asset,
  vendorTitle,
  playerSalary,
  onBuy,
  onDecline,
  formatAssetEffectLines,
}: AssetOfferModalProps) {
  const canAfford = asset !== null && playerSalary >= asset.price;

  return (
    <AnimatePresence>
      {open && asset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10"
          >
            <div className="p-8 flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200/80 dark:border-amber-700/50 flex items-center justify-center shadow-md ring-2 ring-amber-100 dark:ring-amber-900/50">
                <Package size={36} className="text-amber-700 dark:text-amber-500" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700/70 dark:text-amber-400/90 mb-1">
                  季初供应商到访
                </p>
                <h2 className="text-2xl font-bold tracking-tight dark:text-gray-100">「{vendorTitle ?? '路过的供货商'}」</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                  “项目经理在吗？这批货工地专用，错过这一车下一车要涨价。”
                </p>
              </div>

              <div className="w-full bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-black/5 dark:border-white/10 text-left">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <div className="shrink-0 flex flex-col items-center gap-1.5 w-[4.5rem]">
                    <div className="w-16 h-16 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 flex items-center justify-center">
                      <Package size={28} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="text-[9px] font-mono text-gray-600 dark:text-gray-400 leading-snug text-center w-full space-y-0.5">
                      {formatAssetEffectLines(asset).map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg dark:text-gray-100">{asset.name}</h3>
                    <span className="text-[10px] px-2 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full font-mono shrink-0">
                      {TYPE_LABEL[asset.type]}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{asset.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/10">
                  <span className="text-sm font-mono opacity-50 dark:text-gray-500">报价（工资抵扣）</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">¥{asset.price}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-mono opacity-50 dark:text-gray-500">当前账面工资</span>
                  <span
                    className={`text-sm font-bold ${!canAfford ? 'text-rose-500 dark:text-rose-400' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    ¥{playerSalary.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  type="button"
                  onClick={onDecline}
                  className="py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl font-bold transition-all"
                >
                  下次再说
                </button>
                <button
                  type="button"
                  onClick={() => onBuy(asset)}
                  disabled={!canAfford}
                  className={`py-4 rounded-2xl font-bold shadow-lg transition-all ${
                    !canAfford
                      ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white shadow-black/10'
                  }`}
                >
                  {!canAfford ? '工资不够' : '签字采购'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
