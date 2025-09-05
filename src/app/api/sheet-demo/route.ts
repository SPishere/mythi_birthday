import { NextRequest, NextResponse } from 'next/server';

// Define the Sheet ID from your Google Sheet URL
const SHEET_ID = '1kXmN3W4awa4iyv_20O_MCwUPzUU19aTh1Gg1S7GnEJw';

// Define the interface for our data structure
interface AppData {
  cakeClicks: number;
  messages: string[];
}

// Function to fetch data from the Google Sheet
async function fetchSheetData(): Promise<AppData> {
  try {
    // Using the publicly accessible CSV export feature of Google Sheets
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch sheet data, status:', response.status);
      throw new Error('Failed to fetch data from Google Sheet');
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.split(','));
    
    // Process the data from the sheet
    let cakeClicks = 0;
    const messages: string[] = [];
    
    // Find the cake clicks (we expect it in cell B2)
    if (rows.length >= 2 && rows[1].length >= 2) {
      const clicksValue = rows[1][1]; // B2 (row 1, column 1 in 0-indexed array)
      cakeClicks = parseInt(clicksValue, 10) || 0;
    }
    
    // Collect messages (we expect them in column A starting from row 3)
    for (let i = 2; i < rows.length; i++) {
      if (rows[i] && rows[i][0] && rows[i][0].trim()) {
        messages.push(rows[i][0].trim());
      }
    }
    
    return { cakeClicks, messages };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return { cakeClicks: 0, messages: [] };
  }
}

// Function to update the Google Sheet data
// Note: For writing, we'll use a simple form submit approach that works with public sheets
async function updateSheetData(update: { message?: string, incrementCakeClicks?: boolean }): Promise<void> {
  try {
    // First get the current data to know the current state
    const currentData = await fetchSheetData();
    
    // Create a form data object to submit to the Google Form endpoint
    const formData = new FormData();
    
    // If we need to increment cake clicks
    if (update.incrementCakeClicks) {
      const newClickCount = currentData.cakeClicks + 1;
      
      // We'll use the sheet's form submission URL
      const formUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`;
      
      // You'd need to create a Google Form connected to your sheet
      // and add these form field names
      formData.append('entry.123456789', newClickCount.toString());
      
      await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // Important for CORS issues
      });
    }
    
    // If we need to add a new message
    if (update.message) {
      const formUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`;
      formData.append('entry.987654321', update.message);
      
      await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
    }
  } catch (error) {
    console.error('Error updating sheet data:', error);
    throw error;
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

// Note: For a complete implementation, you'll need to:
// 1. Create a Google Form linked to your sheet
// 2. Get the form ID and field IDs
// 3. Update the updateSheetData function with those IDs
