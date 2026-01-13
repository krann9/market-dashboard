import { NextResponse } from 'next/server';

const ASX_API_BASE = 'https://www.asx.com.au/asx/1/share';

// Function to fetch ASX stock data
async function getASXStockData(symbol) {
    try {
          const response = await fetch(
                  `${ASX_API_BASE}/${symbol.toUpperCase()}`,
            {
                      method: 'GET',
                      headers: {
                                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                  'Accept': 'application/json',
                      },
                      next: { revalidate: 300 } // Cache for 5 minutes
            }
                );

      if (!response.ok) {
              console.error(`ASX API error for ${symbol}: ${response.status}`);
              return null;
      }

      const data = await response.json();
          return {
                  symbol: data.code,
                  name: data.name_full,
                  price: data.last_price,
                  change: data.change_price,
                  changePercent: data.change_in_percent,
                  volume: data.volume,
                  timestamp: new Date().toISOString(),
          };
    } catch (error) {
          console.error(`Error fetching ASX data for ${symbol}:`, error.message);
          return null;
    }
}

export async function GET(request) {
    try {
          const { searchParams } = new URL(request.url);
          const symbol = searchParams.get('symbol');

      if (!symbol) {
              return NextResponse.json(
                { error: 'Missing symbol parameter' },
                { status: 400 }
                      );
      }

      const stockData = await getASXStockData(symbol);

      if (!stockData) {
              return NextResponse.json(
                { error: `Could not fetch data for symbol: ${symbol}` },
                { status: 404 }
                      );
      }

      return NextResponse.json({
              success: true,
              data: stockData,
              timestamp: new Date().toISOString(),
      });
    } catch (error) {
          console.error('ASX API error:', error);
          return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
                );
    }
}

// Support POST requests as well
export async function POST(request) {
    try {
          const body = await request.json();
          const { symbols } = body;

      if (!symbols || !Array.isArray(symbols)) {
              return NextResponse.json(
                { error: 'Provide symbols as an array in request body' },
                { status: 400 }
                      );
      }

      const results = await Promise.all(
              symbols.map(symbol => getASXStockData(symbol))
            );

      return NextResponse.json({
              success: true,
              data: results.filter(r => r !== null),
              timestamp: new Date().toISOString(),
      });
    } catch (error) {
          console.error('ASX API POST error:', error);
          return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
                );
    }
}
