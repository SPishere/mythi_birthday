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

// Ensure database file exists with default values
function ensureDBExists() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultData: DB = { cakeClicks: 0, messages: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
      console.log('Created new database file');
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
  }
}

// Helper function to read the database with retries
function readDB(): DB {
  ensureDBExists();
  
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      const parsedData = JSON.parse(data) as DB;
      
      // Ensure the data has the expected structure
      return {
        cakeClicks: typeof parsedData.cakeClicks === 'number' ? parsedData.cakeClicks : 0,
        messages: Array.isArray(parsedData.messages) ? parsedData.messages : []
      };
    } catch (error) {
      console.error(`Error reading database (attempt ${attempts + 1}/${maxAttempts}):`, error);
      attempts++;
      
      // If we've failed all attempts, return default data
      if (attempts >= maxAttempts) {
        console.error('All read attempts failed, returning default data');
        return { cakeClicks: 0, messages: [] };
      }
      
      // Small delay before retry
      new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // This should never happen due to the return in the loop above
  return { cakeClicks: 0, messages: [] };
}

// Helper function to write to the database with retries
function writeDB(data: DB): boolean {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      // Ensure the data has the expected structure before writing
      const safeData: DB = {
        cakeClicks: typeof data.cakeClicks === 'number' ? data.cakeClicks : 0,
        messages: Array.isArray(data.messages) ? data.messages : []
      };
      
      fs.writeFileSync(DB_PATH, JSON.stringify(safeData, null, 2), 'utf8');
      console.log('Successfully wrote to database');
      return true;
    } catch (error) {
      console.error(`Error writing to database (attempt ${attempts + 1}/${maxAttempts}):`, error);
      attempts++;
      
      if (attempts >= maxAttempts) {
        console.error('All write attempts failed');
        return false;
      }
      
      // Small delay before retry
      new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // This should never happen due to the return in the loop above
  return false;
}

// GET handler to retrieve data
export async function GET() {
  try {
    const data = readDB();
    
    // Set strong cache control headers to prevent caching
    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache'
      }
    });
  }
}

// POST handler to update data
export async function POST(request: NextRequest) {
  try {
    const data = readDB();
    const body = await request.json();
    
    // Update cake clicks if incrementCakeClicks is provided
    if (body.incrementCakeClicks === true) {
      data.cakeClicks = (data.cakeClicks || 0) + 1;
      console.log('Incremented cake clicks to:', data.cakeClicks);
    }
    
    // Add new message if provided
    if (body.message && typeof body.message === 'string' && body.message.trim()) {
      if (!Array.isArray(data.messages)) {
        data.messages = [];
      }
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
          'Expires': '0',
          'Surrogate-Control': 'no-store'
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
