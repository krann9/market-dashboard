import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    stocks: [
      { ticker: 'TEST1', price: 100 },
      { ticker: 'TEST2', price: 200 }
    ]
  });
}
