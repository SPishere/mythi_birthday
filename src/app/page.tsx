"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
      <div className="z-10 text-center py-12">
        <h1 className="text-6xl font-extrabold text-pink-600 drop-shadow-lg animate-bounce mb-4">
          🎉 Happy Birthday, Mythi! 🎂
        </h1>
        <p className="text-2xl text-blue-700 font-bold mb-8 animate-pulse">
          Wishing you a day that&apos;s super fun, crazy awesome, and full of surprises!
        </p>
        {/* Playful surprise button (sound effect) */}
        <button
          className="bg-yellow-400 hover:bg-pink-400 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 text-xl mb-8"
          onClick={() => {
            const audio = new Audio("https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b9b7b7.mp3");
            audio.play();
          }}
        >
          Click for a Surprise Sound! 🔊
        </button>
        {/* Gallery Section */}
        <div className="bg-white/80 rounded-xl p-6 shadow-xl mb-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Fun Memories Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Placeholder images, replace with real ones! */}
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-md">
              <Image src="https://placekitten.com/200/200" alt="Memory 1" fill className="object-cover" />
            </div>
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-md">
              <Image src="https://placebear.com/200/200" alt="Memory 2" fill className="object-cover" />
            </div>
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-md">
              <Image src="https://placebeard.it/200x200" alt="Memory 3" fill className="object-cover" />
            </div>
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-md">
              <Image src="https://placekitten.com/201/200" alt="Memory 4" fill className="object-cover" />
            </div>
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-md">
              <Image src="https://placebear.com/201/200" alt="Memory 5" fill className="object-cover" />
            </div>
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-md">
              <Image src="https://placebeard.it/201x200" alt="Memory 6" fill className="object-cover" />
            </div>
          </div>
        </div>
        {/* Message Board Section */}
        <div className="bg-pink-100 rounded-xl p-6 shadow-xl mb-8">
          <h2 className="text-3xl font-bold text-yellow-600 mb-4">Message Board</h2>
          <MessageBoard />
        </div>
        {/* Mini-game placeholder */}
        <div className="bg-blue-100 rounded-xl p-6 shadow-xl">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Mini-Game: Click the Cake!</h2>
          <MiniGame />
        </div>
      </div>
    </div>
  );
}

// Message Board Component
function MessageBoard() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  return (
    <div>
      <div className="mb-4">
        <input
          className="border-2 border-yellow-400 rounded-lg px-4 py-2 w-64 mr-2"
          type="text"
          value={input}
          placeholder="Leave a message for Mythi!"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-pink-400 text-white font-bold px-4 py-2 rounded-lg"
          onClick={() => {
            if (input.trim()) {
              setMessages([input, ...messages]);
              setInput("");
            }
          }}
        >Send</button>
      </div>
      <ul className="space-y-2">
        {messages.map((msg, idx) => (
          <li key={idx} className="bg-yellow-200 rounded-lg px-4 py-2 text-lg font-semibold">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Mini-Game Component
function MiniGame() {
  const [score, setScore] = useState(0);
  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-pink-400 rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        onClick={() => setScore(score + 1)}
      >
        🎂
      </button>
      <p className="mt-4 text-xl font-bold text-purple-700">Cake Clicks: {score}</p>
    </div>
  );
}
