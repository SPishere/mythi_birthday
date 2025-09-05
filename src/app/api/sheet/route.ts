import { NextRequest, NextResponse } from 'next/server';

// Normally we would use a Google Sheets API client library with proper auth
// This is a simplified example using a fetch-based approach with a public sheet

// Replace these with your actual values
const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID'; // e.g. '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
const API_KEY = 'REPLACE_WITH_YOUR_API_KEY'; // You'll need to create this in Google Cloud Console

// Define a utility function to fetch data from the Google Sheet
async function fetchSheetData() {
  try {
    // This URL format is for reading from a Google Sheet using its API
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:B100?key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheet');
    }
    
    const data = await response.json();
    
    // Process the data from the sheet
    // Assuming column A has messages and cell B1 has the cake click count
    const messages: string[] = [];
    let cakeClicks = 0;
    
    if (data.values && data.values.length > 0) {
      // First row might contain headers, skip if needed
      // For simplicity, we're assuming the first cell of the second row has the click count
      if (data.values[0] && data.values[0][1]) {
        cakeClicks = parseInt(data.values[0][1], 10) || 0;
      }
      
      // Extract messages from column A (starting from row 2 to skip header)
      for (let i = 1; i < data.values.length; i++) {
        if (data.values[i] && data.values[i][0]) {
          messages.push(data.values[i][0]);
        }
      }
    }
    
    return { cakeClicks, messages };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return { cakeClicks: 0, messages: [] };
  }
}

// Define a utility function to update data in the Google Sheet
async function updateSheetData(update: { message?: string, incrementCakeClicks?: boolean }) {
  try {
    // First get the current data
    const currentData = await fetchSheetData();
    
    // If we need to increment cake clicks
    if (update.incrementCakeClicks) {
      const newClickCount = currentData.cakeClicks + 1;
      
      // Update the cake clicks cell (B1)
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!B1?valueInputOption=RAW&key=${API_KEY}`;
      
      await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[newClickCount.toString()]]
        }),
      });
    }
    
    // If we need to add a new message
    if (update.message) {
      // Add a new row with the message
      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:A:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&key=${API_KEY}`;
      
      await fetch(appendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[update.message]]
        }),
      });
    }
    
    // Return the updated data
    return await fetchSheetData();
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
    
    // Validate the request body
    if (!body.message && !body.incrementCakeClicks) {
      return new NextResponse(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the sheet data
    const updatedData = await updateSheetData({
      message: body.message,
      incrementCakeClicks: body.incrementCakeClicks
    });
    
    return new NextResponse(JSON.stringify(updatedData), {
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
