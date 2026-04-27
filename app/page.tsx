'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Layers } from 'lucide-react';
import DropZone from '@/components/DropZone';
import VideoPlayer from '@/components/VideoPlayer';
import ControlBar from '@/components/ControlBar';
import TrackIdModal from '@/components/SessionIdModal'; // <-- Updated Import
import ClassModal from '@/components/ClassModal';
import DirectoryBar from '@/components/DirectoryBar';
import AnnotationTable from '@/components/AnnotationTable';
import Toast from '@/components/Toast';
import { Annotation, ToastMessage, ToastType } from '@/types/types';

export default function AnnotationPage() {
  // --- Core State ---
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [trackId, setTrackId] = useState<number | null>(null); // <-- Changed to trackId
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  // --- Video State ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(0.25);
  
  // --- UI State ---
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'success' });

  // --- Handlers ---
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const markStart = useCallback(() => {
    if (!videoFile) return;
    setStartTime(currentTime);
  }, [videoFile, currentTime]);

  const markEnd = useCallback(() => {
    if (!videoFile || startTime === null) return;
    if (currentTime <= startTime) {
      showToast('End time must be after start time', 'error');
      return;
    }
    
    if (videoRef.current && !videoRef.current.paused) {
      togglePlay(); 
    }
    setIsClassModalOpen(true);
  }, [videoFile, startTime, currentTime, togglePlay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTrackModalOpen || isClassModalOpen) return;

      const key = e.key.toLowerCase();
      if (key === ' ' || key === 'spacebar') {
        e.preventDefault(); 
        togglePlay();
      } else if (key === 's') {
        markStart();
      } else if (key === 'e') {
        markEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrackModalOpen, isClassModalOpen, togglePlay, markStart, markEnd]);

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setIsTrackModalOpen(true);
  };

  const handleTrackSubmit = async (id: number) => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      setDirHandle(handle);
      setTrackId(id);
      setIsTrackModalOpen(false);
      showToast('Session initialized successfully');
    } catch (err) {
      showToast('Directory access is required', 'error');
    }
  };

  const changeDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      setDirHandle(handle);
      showToast('Output directory updated');
    } catch (err) {
      // User cancelled
    }
  };

  // --- CSV Generation Helper ---
  const generateCSV = (data: Annotation[]) => {
    const header = "start_time,end_time,track_id,class\n";
    // We reverse the data so the CSV is in chronological order (oldest to newest)
    const rows = [...data].reverse().map(ann => 
      `${ann.startTime.toFixed(2)},${ann.endTime.toFixed(2)},${ann.trackId},${ann.classification}`
    ).join("\n");
    return header + rows;
  };

  // --- Core Save Logic ---
  const saveAnnotation = async (classification: Annotation['classification'], finalStart: number, finalEnd: number) => {
    if (!dirHandle || !videoFile || trackId === null) return;

    const newAnnotation: Annotation = {
      id: crypto.randomUUID(),
      trackId,
      videoFileName: videoFile.name,
      startTime: finalStart,
      endTime: finalEnd,
      classification,
      timestamp: new Date().toISOString(),
    };

    // Add new annotation to the top of our React state list (for the UI table)
    const updatedAnnotations = [newAnnotation, ...annotations];

    try {
      // Create a clean filename based on the uploaded video name
      const baseName = videoFile.name.replace(/\.[^/.]+$/, ""); 
      const csvFileName = `${baseName}_annotations.csv`;
      
      // Get the file handle in the root of the selected directory
      const fileHandle = await dirHandle.getFileHandle(csvFileName, { create: true });
      const writable = await fileHandle.createWritable();
      
      // Write the full CSV string containing all annotations for this session
      const csvContent = generateCSV(updatedAnnotations);
      await writable.write(csvContent);
      await writable.close();
      
      // Update UI state
      setAnnotations(updatedAnnotations);
      setStartTime(null); 
      setIsClassModalOpen(false);
      showToast('Saved to CSV successfully');
    } catch (err) {
      showToast('Failed to write CSV. Check directory permissions.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 transition-colors duration-300">
      
      <header className="px-8 py-5 bg-white border-b border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-emerald-800 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-950 dark:text-white">
            Classify
          </h1>
          {trackId !== null && (
            <span className="ml-auto px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-800 rounded-full dark:bg-emerald-900/30 dark:text-emerald-300">
              Track ID: #{trackId}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8 pb-24">
        {!videoFile ? (
          <DropZone onFileSelect={handleFileSelect} />
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col">
            <DirectoryBar dirHandle={dirHandle} onSelectDir={changeDirectory} />
            
            <VideoPlayer 
              ref={videoRef}
              file={videoFile}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              playbackRate={playbackRate}
              onTogglePlay={togglePlay}
              onTimeUpdate={setCurrentTime}
              onLoadedMetadata={setDuration}
            />
            
            <ControlBar 
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              markStart={markStart}
              markEnd={markEnd}
              startTime={startTime}
              currentTime={currentTime}
              playbackRate={playbackRate}
              setPlaybackRate={setPlaybackRate}
            />

            <AnnotationTable annotations={annotations} />
          </div>
        )}
      </main>

      <TrackIdModal 
        isOpen={isTrackModalOpen} 
        onSubmit={handleTrackSubmit} 
      />
      
      <ClassModal 
        isOpen={isClassModalOpen} 
        onSelectClass={saveAnnotation}
        onCancel={() => setIsClassModalOpen(false)}
        initialStartTime={startTime}
        initialEndTime={currentTime}
      />

      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />
    </div>
  );
}