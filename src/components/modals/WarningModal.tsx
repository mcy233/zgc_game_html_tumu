import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

export interface WarningModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function WarningModal({ open, message, onConfirm, onCancel }: WarningModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl max-w-md w-full shadow-2xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 text-rose-600 dark:text-rose-500">
              <ShieldAlert size={32} />
              <h3 className="text-xl font-bold dark:text-gray-100">安监高风险提示</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{message}</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                先戴好安全帽
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 bg-rose-600 text-white dark:bg-rose-500 rounded-xl font-bold hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors"
              >
                仍要冒险施工
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
