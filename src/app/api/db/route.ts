import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define database structure
interface DB {
  cakeClicks: number;
  messages: string[];
}

// Define the path to our "database" file
const DB_PATH = path.join(process.cwd(), 'public', 'db.json');

// Helper function to read the database
function readDB(): DB {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    // If the file doesn't exist or has invalid JSON, return default structure
    return { cakeClicks: 0, messages: [] };
  }
}

// Helper function to write to the database
function writeDB(data: DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

// GET handler to retrieve data
export async function GET() {
  const data = readDB();
  
  // Set cache control headers to prevent caching
  return new NextResponse(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

// POST handler to update data
export async function POST(request: NextRequest) {
  try {
    const data = readDB();
    const body = await request.json();
    
    // Update cake clicks if provided - always increment by 1
    if (body.incrementCakeClicks) {
      data.cakeClicks = (data.cakeClicks || 0) + 1;
      console.log('Incremented cake clicks to:', data.cakeClicks);
    }
    
    // Add new message if provided
    if (body.message && typeof body.message === 'string' && body.message.trim()) {
      // Add the new message to the front of the array
      if (!data.messages) data.messages = [];
      data.messages.unshift(body.message.trim());
      console.log('Added new message:', body.message.trim());
      
      // Keep only the last 100 messages
      if (data.messages.length > 100) {
        data.messages = data.messages.slice(0, 100);
      }
    }
    
    // Write the updated data back to the file
    const success = writeDB(data);
    
    if (success) {
      // Set cache control headers to prevent caching
      return new NextResponse(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else {
      return new NextResponse(JSON.stringify({ error: 'Failed to write to database' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
