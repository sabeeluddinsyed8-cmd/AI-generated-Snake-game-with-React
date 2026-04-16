import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Drive",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "Neural Network",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Algorithmic Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-emerald-500 to-teal-600"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden group">
      {/* Background Glow based on current track */}
      <div className={`absolute -inset-20 bg-gradient-to-r ${currentTrack.color} opacity-10 blur-3xl transition-all duration-1000 group-hover:opacity-20 pointer-events-none`} />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="relative z-10">
        {/* Track Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-lg relative overflow-hidden`}>
            <Music className="text-white/80" size={24} />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-1">
                <div className="w-1 h-3 bg-white/80 rounded-full animate-[bounce_1s_infinite_0ms]" />
                <div className="w-1 h-4 bg-white/80 rounded-full animate-[bounce_1s_infinite_200ms]" />
                <div className="w-1 h-2 bg-white/80 rounded-full animate-[bounce_1s_infinite_400ms]" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate drop-shadow-md">
              {currentTrack.title}
            </h3>
            <p className="text-sm text-zinc-400 font-mono truncate">
              {currentTrack.artist}
            </p>
          </div>
          
          {/* Volume Control */}
          <button 
            onClick={toggleMute}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 group/progress cursor-pointer relative h-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
          />
          <div className="absolute inset-y-0 left-0 right-0 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${currentTrack.color} relative`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={prevTrack}
            className="p-3 text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-4 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-3 text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
