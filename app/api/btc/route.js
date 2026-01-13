import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

export async function GET(request) {
    try {
          const response = await fetch(
                  `${COINGECKO_API}?ids=bitcoin&vs_currencies=usd`,
            {
                      method: 'GET',
                      headers: {
                                  'Accept': 'application/json',
                      },
                      next: { revalidate: 60 } // Cache for 1 minute
            }
                );

      if (!response.ok) {
              console.error(`CoinGecko API error: ${response.status}`);
              return NextResponse.json(
                { error: 'Failed to fetch BTC price' },
                { status: 500 }
                      );
      }

      const data = await response.json();

      if (!data.bitcoin || !data.bitcoin.usd) {
              return NextResponse.json(
                { error: 'Invalid response format' },
                { status: 500 }
                      );
      }

      return NextResponse.json({
              success: true,
              data: {
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        price: data.bitcoin.usd,
                        currency: 'USD',
                        timestamp: new Date().toISOString(),
              },
              timestamp: new Date().toISOString(),
      });
    } catch (error) {
          console.error('BTC API error:', error);
          return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
                );
    }
}
