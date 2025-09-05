"use client";

import { useState, useEffect } from 'react';

export default function MiniGame() {
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
        className="bg-pink-400 rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
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
