"use client";

import { useEffect, useState } from "react";

// Component to display and update data from Google Sheets
export default function GoogleSheetViewer() {
  const [sheetData, setSheetData] = useState<{ cakeClicks: number, messages: string[] }>({ 
    cakeClicks: 0, 
    messages: [] 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Function to fetch data from the Google Sheet
  const fetchSheetData = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/sheet-read?nocache=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSheetData({
        cakeClicks: typeof data.cakeClicks === 'number' ? data.cakeClicks : 0,
        messages: Array.isArray(data.messages) ? data.messages : []
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching Google Sheet data:', error);
      setError('Failed to load data from Google Sheet');
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    fetchSheetData();
    
    // Set up polling to refresh data every 10 seconds
    const intervalId = setInterval(fetchSheetData, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to manually refresh the data
  const handleRefresh = () => {
    setIsLoading(true);
    fetchSheetData();
  };

  return (
    <div className="bg-white/90 rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-600">Google Sheet Data</h2>
        <button 
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {lastUpdated && (
        <p className="text-xs text-gray-500 mb-4">Last updated: {lastUpdated}</p>
      )}
      
      {error ? (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Make sure your Google Sheet is properly set up with:
            <ul className="list-disc ml-5 mt-1">
              <li>A sheet named "cake" with click count in cell A2</li>
              <li>A sheet named "messages" with messages in column A (starting at A2)</li>
              <li>Public access set to "Anyone with the link can view"</li>
            </ul>
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-pink-600">Cake Clicks from Sheet</h3>
            <p className="text-3xl font-bold">{isLoading ? '...' : sheetData.cakeClicks}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-yellow-600 mb-2">Messages from Sheet</h3>
            {isLoading ? (
              <p>Loading messages...</p>
            ) : sheetData.messages.length === 0 ? (
              <p className="text-gray-500 italic">No messages found in the Google Sheet</p>
            ) : (
              <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                {sheetData.messages.map((msg, idx) => (
                  <li key={idx} className="bg-yellow-100 rounded-lg px-3 py-2">
                    {msg}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          This component displays data from the Google Sheet.
          Updates made on the main page are stored separately.
        </p>
        <a 
          href="https://docs.google.com/spreadsheets/d/1kXmN3W4awa4iyv_20O_MCwUPzUU19aTh1Gg1S7GnEJw/edit" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm block mt-1"
        >
          View/Edit Google Sheet
        </a>
      </div>
    </div>
  );
}
