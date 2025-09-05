import { NextRequest, NextResponse } from 'next/server';

// Define the Sheet ID from your Google Sheet URL
const SHEET_ID = '1kXmN3W4awa4iyv_20O_MCwUPzUU19aTh1Gg1S7GnEJw';

// Define sheet names
const CAKE_SHEET = 'cake';
const MESSAGES_SHEET = 'messages';

// Function to fetch the Google Sheet data
async function fetchSheetData(): Promise<{ cakeClicks: number, messages: string[] }> {
  try {
    // Fetch the cake sheet data
    const cakeResponse = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${CAKE_SHEET}&tqx=out:csv`);
    const cakeCSV = await cakeResponse.text();
    
    // Parse the CSV data
    const cakeRows = cakeCSV.split('\n');
    let cakeClicks = 0;
    
    // Assume the click count is in cell A2
    if (cakeRows.length > 1) {
      // Remove quotes if present
      const clickCell = cakeRows[1].replace(/"/g, '');
      cakeClicks = parseInt(clickCell, 10) || 0;
    }
    
    // Fetch the messages sheet data
    const messagesResponse = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${MESSAGES_SHEET}&tqx=out:csv`);
    const messagesCSV = await messagesResponse.text();
    
    // Parse the CSV data
    const rows = messagesCSV.split('\n');
    const messages: string[] = [];
    
    // Skip header row and process each message
    for (let i = 1; i < rows.length; i++) {
      if (rows[i] && rows[i].trim()) {
        // Remove quotes if present
        messages.push(rows[i][0].trim());
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
    
    // For now, let's simulate a successful update since we need to set up a Google Form
    // In a production app, you'd use the updateSheetData function properly configured
    
    // Log the attempted update
    console.log('Update requested:', body);
    
    // Fetch the current data
    const currentData = await fetchSheetData();
    
    // Simulate local updates for demo purposes
    if (body.incrementCakeClicks) {
      currentData.cakeClicks += 1;
    }
    
    if (body.message && typeof body.message === 'string') {
      currentData.messages.unshift(body.message);
    }
    
    return new NextResponse(JSON.stringify(currentData), {
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
