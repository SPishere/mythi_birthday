"use client";

import { useState } from 'react';

const FORTUNES = [
  "This year will bring exciting new adventures for you!",
  "You'll make a new friend who will change your life.",
  "A surprise gift is coming your way soon!",
  "Your creativity will reach new heights this year.",
  "Good news will arrive by the end of the month.",
  "A wish you've had for a long time will finally come true.",
  "Your kindness will be returned tenfold this year.",
  "An unexpected opportunity will knock on your door.",
  "This is your year to shine brighter than ever!",
  "Joy and laughter will follow you wherever you go.",
  "Your hard work is about to pay off in a big way.",
  "Someone is thinking of you fondly right now.",
  "The next chapter of your life will be the most exciting yet!",
  "A path you've been curious about will open up to you.",
  "Your birthday energy will bring good luck all year long!",
];

export default function FortuneTeller() {
  const [fortune, setFortune] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  
  const tellFortune = () => {
    setIsShaking(true);
    setFortune(null);
    
    // Random fortune after "shaking" the crystal ball
    setTimeout(() => {
      const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setFortune(randomFortune);
      setIsShaking(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Crystal ball */}
      <div 
        className={`relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-blue-400 flex items-center justify-center mb-4 cursor-pointer shadow-lg ${
          isShaking ? 'animate-bounce' : ''
        }`}
        onClick={tellFortune}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-200/80 to-blue-300/80 flex items-center justify-center overflow-hidden backdrop-blur-sm">
          {isShaking ? (
            <span className="text-xl animate-pulse">✨</span>
          ) : fortune ? (
            <div className="text-xs text-center font-semibold text-white px-2">
              {fortune}
            </div>
          ) : (
            <span className="text-xl">🔮</span>
          )}
        </div>
      </div>
      
      <button
        className="bg-purple-500 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition-colors"
        onClick={tellFortune}
        disabled={isShaking}
      >
        {isShaking ? "Reading the stars..." : fortune ? "Get another fortune" : "Tell my fortune"}
      </button>
      
      {fortune && !isShaking && (
        <p className="mt-4 text-lg font-semibold text-purple-700 text-center">
          {fortune}
        </p>
      )}
      
      {!fortune && !isShaking && (
        <p className="mt-4 text-sm text-center text-gray-600">
          Click the crystal ball to see what the year ahead holds for Mythi!
        </p>
      )}
    </div>
  );
}
