"use client";

import { useState, useEffect } from 'react';

export default function MessageBoard() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial messages from Google Sheets
  useEffect(() => {
    async function loadData() {
      try {
        // First try to get data from Google Sheets
        const sheetResponse = await fetch('/api/sheet-read');
        const sheetData = await sheetResponse.json();
        
        if (sheetData && Array.isArray(sheetData.messages)) {
          setMessages(sheetData.messages);
          setIsLoading(false);
        } else {
          // Fallback to file-based database
          const response = await fetch('/api/db');
          const data = await response.json();
          setMessages(data.messages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        
        // Final fallback to file-based database
        try {
          const response = await fetch('/api/db');
          const data = await response.json();
          setMessages(data.messages);
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
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Error refreshing messages:', error);
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Save a new message to both databases
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Update local state immediately for better UX
    const newMessages = [input, ...messages];
    setMessages(newMessages);
    setInput("");
    
    try {
      // Update file-based database
      await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      // Also send update to sheet-write API
      await fetch('/api/sheet-write', {
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
          className="border-2 border-yellow-400 rounded-lg px-4 py-2 w-64 mr-2"
          type="text"
          value={input}
          placeholder="Leave a message for Mythi!"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-pink-400 text-white font-bold px-4 py-2 rounded-lg"
          onClick={handleSendMessage}
        >Send</button>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : (
        <ul className="space-y-2">
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
