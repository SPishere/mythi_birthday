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
  return NextResponse.json(data);
}

// POST handler to update data
export async function POST(request: NextRequest) {
  const data = readDB();
  const body = await request.json();
  
  // Update cake clicks if provided
  if (body.cakeClicks !== undefined) {
    data.cakeClicks = body.cakeClicks;
  }
  
  // Add new message if provided
  if (body.message) {
    data.messages = [body.message, ...data.messages].slice(0, 100); // Keep only last 100 messages
  }
  
  writeDB(data);
  return NextResponse.json(data);
}
