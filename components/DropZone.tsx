import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export default function DropZone({ onFileSelect }: DropZoneProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.includes('video/')) onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-20 h-96 border-2 border-dashed rounded-3xl border-emerald-200 bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900/50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="p-4 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <UploadCloud className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-emerald-950 dark:text-white">Upload Video for Annotation</h3>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">Drag and drop your file here, or click to browse</p>
      <label className="px-6 py-3 text-sm font-medium text-white transition-transform rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 cursor-pointer shadow-lg shadow-emerald-900/20">
        Select Video File
        <input type="file" accept="video/*" className="hidden" onChange={handleChange} />
      </label>
    </motion.div>
  );
}