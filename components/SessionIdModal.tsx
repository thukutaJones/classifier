import { motion } from 'framer-motion';
import { useState } from 'react';

interface TrackIdModalProps {
  isOpen: boolean;
  onSubmit: (id: number) => void;
}

export default function TrackIdModal({ isOpen, onSubmit }: TrackIdModalProps) {
  const [val, setVal] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const parsedId = parseInt(val, 10);
    if (!isNaN(parsedId)) {
      onSubmit(parsedId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-6 bg-white dark:bg-neutral-900 border border-emerald-100 dark:border-neutral-800 rounded-2xl shadow-2xl"
      >
        <h2 className="mb-2 text-xl font-semibold text-emerald-950 dark:text-white">Initialize Tracking</h2>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">Enter the Track ID (e.g., YOLO bounding box ID) for the student you are annotating.</p>
        
        <input
          type="number"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && val && handleSubmit()}
          placeholder="e.g., 5"
          className="w-full px-4 py-3 mb-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
        />
        
        <button 
          onClick={handleSubmit}
          disabled={!val}
          className="w-full py-3 font-medium text-white transition-colors bg-emerald-800 hover:bg-emerald-900 rounded-xl disabled:opacity-50"
        >
          Confirm & Choose Output Folder
        </button>
      </motion.div>
    </div>
  );
}