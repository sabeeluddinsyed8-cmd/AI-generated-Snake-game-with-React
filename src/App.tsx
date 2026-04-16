import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-8 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Neon
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 drop-shadow-[0_0_10px_rgba(232,121,249,0.5)]">
              Snake
            </span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs mt-1 tracking-widest uppercase">
            System v2.0.4 // Online
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-8">
        {/* Game Container */}
        <div className="flex-1 w-full flex justify-center items-center">
          <SnakeGame />
        </div>

        {/* Side Panel (Music Player) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Audio Subsystem
            </h2>
            <MusicPlayer />
          </div>
          
          {/* Decorative Element */}
          <div className="hidden lg:block bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col gap-2 font-mono text-xs text-zinc-600">
              <p>{'>'} INITIALIZING NEON_SNAKE.EXE...</p>
              <p>{'>'} LOADING AUDIO_MODULE...</p>
              <p>{'>'} CONNECTING TO MAINFRAME...</p>
              <p className="text-cyan-500/70">{'>'} SYSTEM READY_</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
