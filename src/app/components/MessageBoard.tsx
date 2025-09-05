"use client";

import { useState, useEffect } from 'react';

export default function MessageBoard() {
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
