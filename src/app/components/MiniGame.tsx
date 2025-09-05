"use client";

import { useState, useEffect } from 'react';

export default function MiniGame() {
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial click count from Google Sheets
  useEffect(() => {
    async function loadData() {
      try {
        // First try to get data from Google Sheets
        const sheetResponse = await fetch('/api/sheet-read');
        const sheetData = await sheetResponse.json();
        
        if (sheetData && typeof sheetData.cakeClicks === 'number') {
          setScore(sheetData.cakeClicks);
          setIsLoading(false);
        } else {
          // Fallback to file-based database
          const response = await fetch('/api/db');
          const data = await response.json();
          setScore(data.cakeClicks);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading cake clicks:', error);
        
        // Final fallback to file-based database
        try {
          const response = await fetch('/api/db');
          const data = await response.json();
          setScore(data.cakeClicks);
        } catch (err) {
          console.error('Error with fallback data source:', err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    loadData();
    
    // Set up periodic refresh from Google Sheets
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('/api/sheet-read');
        const data = await response.json();
        if (data && typeof data.cakeClicks === 'number') {
          setScore(data.cakeClicks);
        }
      } catch (error) {
        console.error('Error refreshing cake clicks:', error);
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Update click count in both databases
  const handleClick = async () => {
    const newScore = score + 1;
    setScore(newScore);
    
    try {
      // Update file-based database
      await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cakeClicks: newScore }),
      });
      
      // Also send update to sheet-write API
      await fetch('/api/sheet-write', {
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
