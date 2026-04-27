import { FolderOpen, HardDrive } from 'lucide-react';

interface DirectoryBarProps {
  dirHandle: FileSystemDirectoryHandle | null;
  onSelectDir: () => void;
}

export default function DirectoryBar({ dirHandle, onSelectDir }: DirectoryBarProps) {
  if (!dirHandle) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 mb-6 border bg-emerald-50 border-emerald-100 rounded-xl dark:bg-emerald-900/10 dark:border-emerald-900/30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg dark:bg-emerald-900/40">
          <HardDrive className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70">Output Directory</p>
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{dirHandle.name}</p>
        </div>
      </div>
      <button 
        onClick={onSelectDir}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors border border-emerald-200 rounded-lg hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-800/40"
      >
        <FolderOpen className="w-3 h-3" />
        Change Directory
      </button>
    </div>
  );
}