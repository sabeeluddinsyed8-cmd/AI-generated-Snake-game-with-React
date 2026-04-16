import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused((p) => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [food, gameOver, isPaused, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      
      {/* Header / Scoreboard */}
      <div className="flex justify-between w-full mb-6 px-4">
        <div className="flex flex-col">
          <span className="text-cyan-400/70 text-xs uppercase tracking-widest font-mono mb-1">Score</span>
          <span className="text-3xl font-bold text-cyan-300 font-mono drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-fuchsia-400/70 text-xs uppercase tracking-widest font-mono mb-1 flex items-center gap-1">
            <Trophy size={12} /> High Score
          </span>
          <span className="text-3xl font-bold text-fuchsia-300 font-mono drop-shadow-[0_0_8px_rgba(240,171,252,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div 
          className="bg-zinc-950 rounded-lg overflow-hidden relative border border-white/5"
          style={{
            width: `${GRID_SIZE * 20}px`,
            height: `${GRID_SIZE * 20}px`,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-sm ${
                  isHead 
                    ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10' 
                    : 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.5)]'
                }`}
                style={{
                  width: '18px',
                  height: '18px',
                  left: `${segment.x * 20 + 1}px`,
                  top: `${segment.y * 20 + 1}px`,
                  transition: 'all 0.1s linear'
                }}
              />
            );
          })}

          {/* Food */}
          <div
            className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_12px_rgba(217,70,239,0.9)] animate-pulse"
            style={{
              width: '16px',
              height: '16px',
              left: `${food.x * 20 + 2}px`,
              top: `${food.y * 20 + 2}px`,
            }}
          />

          {/* Overlays */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <h2 className="text-4xl font-black text-rose-500 mb-2 tracking-wider drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">
                SYSTEM FAILURE
              </h2>
              <p className="text-zinc-400 font-mono mb-6">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/50 rounded-full font-mono uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-95"
              >
                <RotateCcw size={18} /> Reboot
              </button>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <h2 className="text-3xl font-bold text-cyan-400 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                PAUSED
              </h2>
              <p className="text-cyan-400/60 font-mono mt-2 text-sm">Press SPACE to resume</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls Hint */}
      <div className="mt-6 flex gap-6 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">WASD</kbd>
          <span>or</span>
          <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Arrows</kbd>
          <span>to move</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Space</kbd>
          <span>to pause</span>
        </div>
      </div>
    </div>
  );
}
