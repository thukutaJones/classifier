import { motion } from 'framer-motion';
import { UploadCloud, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const ACCEPTED_EXTENSIONS = ['.mp4', '.webm', '.ogg'];

// Probes whether the browser can actually decode this file
const checkBrowserSupport = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadedmetadata = () => { cleanup(); resolve(true); };
    video.onerror = () => { cleanup(); resolve(false); };

    // Timeout fallback — if no event fires in 3s, assume unsupported
    setTimeout(() => { cleanup(); resolve(false); }, 3000);

    video.src = url;
    video.load();
  });
};

export default function DropZone({ onFileSelect }: DropZoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);

    // Basic type gate
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file.');
      return;
    }

    setChecking(true);
    const supported = await checkBrowserSupport(file);
    setChecking(false);

    if (!supported) {
      setError(
        'This video codec is not supported by your browser (likely H.265/HEVC or a proprietary format). ' +
        'Please convert to H.264 MP4 first — e.g. using HandBrake (free) or: ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4'
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-20 gap-4"
    >
      <div
        className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-3xl border-emerald-200 bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900/50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="p-4 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <UploadCloud className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-emerald-950 dark:text-white">
          Upload Video for Annotation
        </h3>
        <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
          Drag and drop your file here, or click to browse
        </p>
        <p className="mb-6 text-xs text-neutral-400 dark:text-neutral-500">
          Supported: H.264 MP4, WebM, OGG
        </p>

        {checking ? (
          <div className="px-6 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Checking compatibility…
          </div>
        ) : (
          <label className="px-6 py-3 text-sm font-medium text-white transition-transform rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 cursor-pointer shadow-lg shadow-emerald-900/20">
            Select Video File
            <input
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(',')}
              className="hidden"
              onChange={handleChange}
            />
          </label>
        )}
      </div>

      {/* Error card shown below the drop zone */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
              Unsupported format
            </p>
            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">
              {error}
            </p>
            <code className="block mt-2 text-xs bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg font-mono">
              ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
            </code>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}