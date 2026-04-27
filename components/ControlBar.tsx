import { Play, Pause, Flag, Target, Gauge } from 'lucide-react';

interface ControlBarProps {
  isPlaying: boolean;
  togglePlay: () => void;
  markStart: () => void;
  markEnd: () => void;
  startTime: number | null;
  currentTime: number;
  playbackRate: number; // <-- 1. Add prop
  setPlaybackRate: (rate: number) => void; // <-- 2. Add prop
}

export default function ControlBar({ isPlaying, togglePlay, markStart, markEnd, startTime, currentTime, playbackRate, setPlaybackRate }: ControlBarProps) {
  const formatTime = (secs: number) => new Date(secs * 1000).toISOString().substring(14, 19);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-2xl shadow-sm mt-4 gap-4">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={togglePlay}
          className="flex items-center gap-3 px-6 py-3 font-medium transition-colors bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-neutral-900 dark:text-white"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Pause' : 'Play'}
          <kbd className="hidden px-2 py-0.5 text-xs font-mono text-neutral-500 bg-white border border-neutral-200 rounded dark:bg-neutral-950 dark:border-neutral-700 sm:inline-block shadow-sm">Space</kbd>
        </button>

        {/* 3. Add the Speed Selector Menu */}
        <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 hover:border-emerald-500 transition-colors">
          <Gauge className="w-4 h-4 text-neutral-500 mr-2" />
          <select 
            value={playbackRate} 
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="bg-transparent text-sm font-medium text-neutral-700 dark:text-neutral-300 outline-none cursor-pointer appearance-none pr-4"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2.0x</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-4 min-w-[140px]">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Clip Window</span>
          <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            {startTime !== null ? (
              <>
                {formatTime(startTime)} 
                <span className="text-neutral-400 animate-pulse text-xs">→</span> 
                {formatTime(Math.max(startTime, currentTime))}
              </>
            ) : '--:--'}
          </span>
        </div>

        <button 
          onClick={markStart}
          className="flex items-center gap-2 px-5 py-3 font-medium transition-colors border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-300 rounded-xl"
        >
          <Flag className="w-4 h-4" /> Start
          <kbd className="ml-1 px-2 py-0.5 text-xs font-mono text-emerald-700 bg-emerald-200/50 rounded dark:text-emerald-300 dark:bg-emerald-800/50 shadow-sm">S</kbd>
        </button>

        <button 
          onClick={markEnd}
          disabled={startTime === null}
          className="flex items-center gap-2 px-5 py-3 font-medium text-white transition-all bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-emerald-900/20"
        >
          <Target className="w-4 h-4" /> End
          <kbd className="ml-1 px-2 py-0.5 text-xs font-mono text-emerald-100 bg-emerald-900/50 rounded shadow-sm">E</kbd>
        </button>
      </div>
    </div>
  );
}