import { motion } from 'framer-motion';
import { UploadCloud, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

// canPlayType returns '', 'maybe', or 'probably'
// We check both the generic type and specific codec strings
const isBrowserSupported = (file: File): boolean => {
  const probe = document.createElement('video');

  // Explicit codec checks — most reliable
  const codecChecks: string[] = [];

  const name = file.name.toLowerCase();

  if (name.endsWith('.mp4') || file.type === 'video/mp4') {
    codecChecks.push(
      'video/mp4; codecs="avc1.42E01E"',  // H.264 Baseline
      'video/mp4; codecs="avc1.4D401E"',  // H.264 Main
      'video/mp4; codecs="avc1.64001E"',  // H.264 High
    );
  } else if (name.endsWith('.webm') || file.type === 'video/webm') {
    codecChecks.push(
      'video/webm; codecs="vp8"',
      'video/webm; codecs="vp9"',
      'video/webm; codecs="av1"',
    );
  } else if (name.endsWith('.ogg') || file.type === 'video/ogg') {
    codecChecks.push('video/ogg; codecs="theora"');
  } else if (name.endsWith('.mov') || file.type === 'video/quicktime') {
    // .mov is almost always either H.264 or H.265 — Chrome can play H.264 MOV
    codecChecks.push('video/mp4; codecs="avc1.42E01E"');
  } else {
    // Unknown extension — fall back to generic type check
    const genericType = file.type || 'video/mp4';
    return probe.canPlayType(genericType) !== '';
  }

  return codecChecks.some(codec => probe.canPlayType(codec) !== '');
};

export default function DropZone({ onFileSelect }: DropZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|ogg|mkv|avi)$/i)) {
      setError('Please upload a video file.');
      return;
    }

    if (!isBrowserSupported(file)) {
      setError(
        'This video codec is not supported (likely H.265/HEVC or MKV/AVI). ' +
        'Convert to H.264 MP4 with the command below.'
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
          Best supported: H.264 MP4 · WebM · OGG
        </p>
        <label className="px-6 py-3 text-sm font-medium text-white transition-transform rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 cursor-pointer shadow-lg shadow-emerald-900/20">
          Select Video File
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

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
            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed mb-2">
              {error}
            </p>
            <code className="block text-xs bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg font-mono">
              ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
            </code>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}