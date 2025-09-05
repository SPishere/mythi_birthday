import { NextRequest, NextResponse } from 'next/server';

// The Sheet ID from your Google Sheet URL
const SHEET_ID = '1kXmN3W4awa4iyv_20O_MCwUPzUU19aTh1Gg1S7GnEJw';

// Define sheet names
const CAKE_SHEET = 'cake';
const MESSAGES_SHEET = 'messages';

// Check if sheets exist and are properly formatted
async function checkSheets() {
  try {
    // First check the cake sheet
    const cakeUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${CAKE_SHEET}`;
    console.log('Checking cake sheet at:', cakeUrl);
    
    const cakeResponse = await fetch(cakeUrl, { 
      cache: 'no-store',
      headers: {
        'Accept': 'text/csv,*/*'
      }
    });
    
    if (!cakeResponse.ok) {
      console.error('Failed to fetch cake sheet, status:', cakeResponse.status);
      return false;
    }
    
    // Then check the messages sheet
    const messagesUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${MESSAGES_SHEET}`;
    console.log('Checking messages sheet at:', messagesUrl);
    
    const messagesResponse = await fetch(messagesUrl, { 
      cache: 'no-store',
      headers: {
        'Accept': 'text/csv,*/*'
      }
    });
    
    if (!messagesResponse.ok) {
      console.error('Failed to fetch messages sheet, status:', messagesResponse.status);
      return false;
    }
    
    console.log('Both sheets are accessible');
    return true;
  } catch (error) {
    console.error('Error checking sheet:', error);
    return false;
  }
}

// Function to fetch data from both cake and messages sheets
async function fetchSheetData() {
  try {
    // Fetch cake data (clicks count)
    const cakeUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${CAKE_SHEET}&_cb=${Date.now()}`;
    console.log('Fetching cake data from URL:', cakeUrl);
    
    const cakeResponse = await fetch(cakeUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'text/csv,*/*'
      }
    });
    
    if (!cakeResponse.ok) {
      console.error('Failed to fetch cake data, status:', cakeResponse.status);
      throw new Error('Failed to fetch cake data from Google Sheet');
    }
    
    const cakeText = await cakeResponse.text();
    console.log('Cake data received, length:', cakeText.length);
    
    // Parse cake data
    let cakeClicks = 0;
    if (cakeText.length > 0) {
      const cakeRows = cakeText.split('\n').map(row => 
        row.split(',').map(cell => cell.replace(/^"(.*)"$/, '$1'))
      );
      
      // We expect the clicks count to be in cell A2 (skip header row)
      if (cakeRows.length >= 2 && cakeRows[1].length >= 1) {
        const clicksValue = cakeRows[1][0]; // A2 (row 1, column 0 in 0-indexed array)
        cakeClicks = parseInt(clicksValue, 10) || 0;
      }
    }
    
    // Fetch messages data
    const messagesUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${MESSAGES_SHEET}&_cb=${Date.now()}`;
    console.log('Fetching messages data from URL:', messagesUrl);
    
    const messagesResponse = await fetch(messagesUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'text/csv,*/*'
      }
    });
    
    if (!messagesResponse.ok) {
      console.error('Failed to fetch messages data, status:', messagesResponse.status);
      throw new Error('Failed to fetch messages data from Google Sheet');
    }
    
    const messagesText = await messagesResponse.text();
    console.log('Messages data received, length:', messagesText.length);
    
    // Parse messages data
    const messages: string[] = [];
    if (messagesText.length > 0) {
      const messageRows = messagesText.split('\n').map(row => 
        row.split(',').map(cell => cell.replace(/^"(.*)"$/, '$1'))
      );
      
      // Skip header row (index 0) and collect messages from column A
      for (let i = 1; i < messageRows.length; i++) {
        if (messageRows[i] && messageRows[i][0] && messageRows[i][0].trim()) {
          messages.push(messageRows[i][0].trim());
        }
      }
    }
    
    return { cakeClicks, messages };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return { cakeClicks: 0, messages: [] };
  }
}

// GET handler to retrieve data
export async function GET() {
  try {
    // Check if sheets are accessible
    const sheetsAccessible = await checkSheets();
    if (!sheetsAccessible) {
      return new NextResponse(JSON.stringify({ 
        error: 'Google Sheets not accessible',
        instructions: `Please make sure your Google Sheet has:
          1. A sheet named "cake" with click count in cell A2
          2. A sheet named "messages" with messages in column A (starting at A2)
          3. Public access set to "Anyone with the link can view"`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await fetchSheetData();
    
    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST handler to update data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // We could implement direct updates to Google Sheets with API key/OAuth,
    // but for now we'll update the local file as before while reading from sheets
    
    // Forward the request to our file-based API
    const dbApiUrl = new URL('/api/db', request.url);
    const response = await fetch(dbApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Get latest data from our sheets (even though we couldn't update them directly)
    const sheetData = await fetchSheetData();
    
    // Combine the local DB response with our sheet data
    const dbData = await response.json();
    const combinedData = {
      ...dbData,
      sheetData
    };
    
    return new NextResponse(JSON.stringify(combinedData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
