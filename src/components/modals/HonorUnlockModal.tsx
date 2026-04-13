import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';

export interface HonorUnlockPopup {
  popupTitle: string;
  unlockBody: string;
}

export interface HonorUnlockModalProps {
  popup: HonorUnlockPopup | null;
  onDismiss: () => void;
}

export function HonorUnlockModal({ popup, onDismiss }: HonorUnlockModalProps) {
  return (
    <AnimatePresence>
      {popup && (
        <div className="fixed inset-0 z-[58] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            key={popup.popupTitle}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl flex flex-col gap-5 border border-violet-100"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700">
                <Trophy size={26} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{popup.popupTitle}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{popup.unlockBody}</p>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full py-3.5 rounded-2xl font-bold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              收到，上墙展示
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
