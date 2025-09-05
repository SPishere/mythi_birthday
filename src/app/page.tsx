"use client";

import { useEffect, useRef } from "react";
import PositiveMessages from "./components/PositiveMessages";
import BalloonPop from "./components/BalloonPop";
import FortuneTeller from "./components/FortuneTeller";

export default function Home() {
  // Confetti animation using canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const confettiColors = ["#FF69B4", "#FFD700", "#00FFFF", "#FF6347", "#32CD32", "#8A2BE2"];
    const confetti = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 8 + 4,
      d: Math.random() * 2 + 1,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    }));
    function draw() {
      // TypeScript now knows ctx is defined because of the early return above
      ctx!.clearRect(0, 0, W, H);
      confetti.forEach((c) => {
        ctx!.beginPath();
        ctx!.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx!.fillStyle = c.color;
        ctx!.fill();
        c.y += c.d;
        if (c.y > H) c.y = 0;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
      <div className="z-10 w-full max-w-6xl py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-extrabold text-pink-600 drop-shadow-lg animate-bounce mb-4 font-display">
            🎉 Happy Birthday, Mythi! 🎂
          </h1>
          <p className="text-2xl text-blue-700 font-bold mb-8 animate-pulse font-sans italic">
            You are the bitch and you&apos;ll always be THE bitch and forever my cutie patooti ILU ❤️
          </p>
        </div>
        
        {/* Main content area with side-by-side layout */}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left column with Positive Messages */}
          <div className="w-full md:w-1/2">
            <div className="bg-white/80 rounded-xl p-6 shadow-xl h-full">
              <h2 className="text-3xl font-bold text-purple-600 mb-4 font-display">Your Statement of the Moment</h2>
              <PositiveMessages />
            </div>
          </div>
          
          {/* Right column with Balloon Pop Game and Fortune Teller */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            <div className="bg-pink-100 rounded-xl p-6 shadow-xl">
              <h2 className="text-3xl font-bold text-yellow-600 mb-4 font-display">Balloon Pop Game</h2>
              <BalloonPop />
            </div>
            
            <div className="bg-blue-100 rounded-xl p-6 shadow-xl">
              <h2 className="text-3xl font-bold text-pink-600 mb-4 font-display">Birthday Fortune Teller</h2>
              <FortuneTeller />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
