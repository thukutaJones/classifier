import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import { ToastType } from '@/types/types';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-2xl rounded-xl"
        >
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {message}
          </span>
          <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}