import { forwardRef, useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  file: File | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  onTimeUpdate: (time: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onTogglePlay: () => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ file, currentTime, duration, isPlaying, playbackRate, onTimeUpdate, onLoadedMetadata, onTogglePlay }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const objectUrlRef = useRef<string | null>(null); // <-- track URL in a ref, not state

    const formatTime = (secs: number) => {
      if (isNaN(secs)) return '0:00';
      const minutes = Math.floor(secs / 60);
      const seconds = Math.floor(secs % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Create the object URL once per file and assign directly to the video element
    useEffect(() => {
      const video = (ref as React.RefObject<HTMLVideoElement>).current;
      if (!file || !video) return;

      // Revoke previous URL if any
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;

      // Set src directly on the DOM element to avoid React batching delays
      video.src = url;
      video.load(); // <-- force the browser to re-evaluate the source

      return () => {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
      };
    }, [file, ref]);

    useEffect(() => {
      const video = (ref as React.RefObject<HTMLVideoElement>).current;
      if (video) {
        video.playbackRate = playbackRate;
      }
    }, [playbackRate, ref]);

    const seekToPosition = (clientX: number) => {
      if (!progressBarRef.current || duration === 0) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      const video = (ref as React.RefObject<HTMLVideoElement>).current;
      if (video) {
        video.currentTime = newTime;
        onTimeUpdate(newTime);
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDragging(true);
      seekToPosition(e.clientX);
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) seekToPosition(e.clientX);
      };
      const handleMouseUp = () => setIsDragging(false);

      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, duration]);

    if (!file) return null;

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        className="relative flex flex-col w-full overflow-hidden bg-black rounded-2xl shadow-xl cursor-pointer group"
        onClick={onTogglePlay}
      >
        <video
          ref={ref}
          className="w-full h-auto max-h-[60vh] outline-none"
          controls={false}
          // No src prop here — we set it directly via the ref in useEffect
          onTimeUpdate={(e) => {
            if (!isDragging) onTimeUpdate(e.currentTarget.currentTime);
          }}
          onLoadedMetadata={(e) => onLoadedMetadata(e.currentTarget.duration)}
          onError={(e) => console.error('Video error:', e.currentTarget.error)}
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 group-hover:bg-black/30 backdrop-blur-[2px]">
            <div className="flex items-center justify-center w-20 h-20 text-white transition-transform duration-300 scale-100 bg-emerald-600/90 rounded-full shadow-2xl backdrop-blur-md group-hover:scale-110 group-hover:bg-emerald-500/90">
              <Play className="w-10 h-10 ml-2" />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-10 px-2 py-1 text-xs font-medium tracking-wide text-white bg-black/60 rounded-md backdrop-blur-sm pointer-events-none shadow-sm">
          {formatTime(currentTime)} <span className="text-white/60 mx-0.5">/</span> {formatTime(duration)}
        </div>

        <div
          ref={progressBarRef}
          className={`absolute bottom-0 left-0 w-full z-10 transition-all duration-200 cursor-ew-resize bg-neutral-800/80 backdrop-blur-sm 
            ${isDragging ? 'h-2' : 'h-1 hover:h-2 group-hover:h-1.5'}`}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="h-full bg-emerald-500 transition-all duration-75 ease-linear relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-transform shadow-md translate-x-1/2
              ${isDragging ? 'scale-125' : 'scale-0 group-hover:scale-100'}`}
            />
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;