"use client";

import { useEffect, useRef, useState } from "react";
import PositiveMessages from "./components/PositiveMessages";

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
          <h1 className="text-6xl font-extrabold text-pink-600 drop-shadow-lg animate-bounce mb-4">
            🎉 Happy Birthday, Mythi! 🎂
          </h1>
          <p className="text-2xl text-blue-700 font-bold mb-8 animate-pulse">
            Wishing you a day that&apos;s super fun, crazy awesome, and full of surprises!
          </p>
        </div>
        
        {/* Main content area with side-by-side layout */}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left column with Positive Messages */}
          <div className="w-full md:w-1/2">
            <div className="bg-white/80 rounded-xl p-6 shadow-xl h-full">
              <h2 className="text-3xl font-bold text-purple-600 mb-4">Birthday Wishes</h2>
              <PositiveMessages />
            </div>
          </div>
          
          {/* Right column with Message Board and Mini-Game */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            <div className="bg-pink-100 rounded-xl p-6 shadow-xl">
              <h2 className="text-3xl font-bold text-yellow-600 mb-4">Message Board</h2>
              <MessageBoard />
            </div>
            
            <div className="bg-blue-100 rounded-xl p-6 shadow-xl">
              <h2 className="text-3xl font-bold text-pink-600 mb-4">Mini-Game: Click the Cake!</h2>
              <MiniGame />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Message Board Component
function MessageBoard() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial messages from the database
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/db');
        const data = await response.json();
        setMessages(data.messages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Save a new message to the database
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Update local state immediately for better UX
    const newMessages = [input, ...messages];
    setMessages(newMessages);
    setInput("");
    
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <input
          className="border-2 border-yellow-400 rounded-lg px-4 py-2 w-full mr-2 mb-2"
          type="text"
          value={input}
          placeholder="Leave a message for Mythi!"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-pink-400 text-white font-bold px-4 py-2 rounded-lg w-full"
          onClick={handleSendMessage}
        >Send</button>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : (
        <ul className="space-y-2 max-h-[200px] overflow-y-auto">
          {messages.map((msg, idx) => (
            <li key={idx} className="bg-yellow-200 rounded-lg px-4 py-2 text-lg font-semibold">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Mini-Game Component
function MiniGame() {
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial click count from the database
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/db');
        const data = await response.json();
        setScore(data.cakeClicks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cake clicks:', error);
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Update click count in the database
  const handleClick = async () => {
    const newScore = score + 1;
    setScore(newScore);
    
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cakeClicks: newScore }),
      });
    } catch (error) {
      console.error('Error saving cake clicks:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-pink-400 rounded-full p-4 shadow-lg hover:scale-110 transition-transform text-4xl"
        onClick={handleClick}
        disabled={isLoading}
      >
        🎂
      </button>
      <p className="mt-4 text-xl font-bold text-purple-700">
        {isLoading ? "Loading..." : `Cake Clicks: ${score}`}
      </p>
    </div>
  );
}
