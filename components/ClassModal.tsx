import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Annotation } from '@/types/types';

interface ClassModalProps {
  isOpen: boolean;
  onSelectClass: (classification: Annotation['classification'], finalStart: number, finalEnd: number) => void;
  onCancel: () => void;
  initialStartTime: number | null;
  initialEndTime: number;
}

export default function ClassModal({ isOpen, onSelectClass, onCancel, initialStartTime, initialEndTime }: ClassModalProps) {
  const [localStart, setLocalStart] = useState<number>(0);
  const [localEnd, setLocalEnd] = useState<number>(0);

  // Sync props to local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalStart(initialStartTime || 0);
      setLocalEnd(initialEndTime);
    }
  }, [isOpen, initialStartTime, initialEndTime]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => new Date(secs * 1000).toISOString().substring(14, 21); // Include deciseconds
  
  const isInvalid = localStart >= localEnd;

  // Tiny helper component for the +/- adjustments
  const TimeAdjuster = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-2 rounded-lg">
      <span className="text-xs font-semibold text-neutral-500 w-12">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(0, value - 0.1))} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded">
          <Minus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </button>
        <span className="font-mono text-sm font-medium text-emerald-700 dark:text-emerald-400 w-16 text-center">
          {formatTime(value)}
        </span>
        <button onClick={() => onChange(value + 0.1)} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded">
          <Plus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 bg-white dark:bg-neutral-900 border border-emerald-100 dark:border-neutral-800 rounded-2xl shadow-2xl"
      >
        <h2 className="mb-1 text-xl font-semibold text-emerald-950 dark:text-white">Classify & Refine Clip</h2>
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">Fine-tune your timestamps before saving.</p>
        
        {/* Timestamp Modifiers */}
        <div className="flex flex-col gap-2 mb-6">
          <TimeAdjuster label="START" value={localStart} onChange={setLocalStart} />
          <TimeAdjuster label="END" value={localEnd} onChange={setLocalEnd} />
          {isInvalid && (
            <span className="text-xs text-red-500 font-medium text-center mt-1">End time must be greater than start time.</span>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            disabled={isInvalid}
            onClick={() => onSelectClass('leaning_to_copy', localStart, localEnd)}
            className="w-full p-4 text-left border transition-all border-emerald-100 bg-emerald-50/50 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20 dark:text-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="block font-medium">Leaning to Copy</span>
          </button>
          
          <button 
            disabled={isInvalid}
            onClick={() => onSelectClass('sharing_answers', localStart, localEnd)}
            className="w-full p-4 text-left border transition-all border-emerald-100 bg-emerald-50/50 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20 dark:text-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="block font-medium">Sharing Answers</span>
          </button>
        </div>

        <button onClick={onCancel} className="w-full mt-4 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors">
          Cancel Annotation
        </button>
      </motion.div>
    </div>
  );
}