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
    // If the file doesn't exist or has invalid JSON, return default structure
    return { cakeClicks: 0, messages: [] };
  }
}

// Helper function to write to the database
function writeDB(data: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// GET handler to retrieve data
export async function GET() {
  const data = readDB();
  
  // Set cache control headers to prevent caching
  return new NextResponse(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0, must-revalidate'
    }
  });
}

// POST handler to update data
export async function POST(request: NextRequest) {
  const data = readDB();
  const body = await request.json();
  
  // Update cake clicks if provided - always increment by 1
  if (body.incrementCakeClicks) {
    data.cakeClicks += 1;
  }
  
  // Add new message if provided
  if (body.message && typeof body.message === 'string' && body.message.trim()) {
    // Add the new message to the front of the array
    data.messages.unshift(body.message.trim());
    
    // Keep only the last 100 messages
    if (data.messages.length > 100) {
      data.messages = data.messages.slice(0, 100);
    }
  }
  
  // Write the updated data back to the file
  writeDB(data);
  
  // Set cache control headers to prevent caching
  return new NextResponse(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0, must-revalidate'
    }
  });
}
