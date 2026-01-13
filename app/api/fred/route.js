export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('series_id');

  if (!seriesId) {
        return new Response(JSON.stringify({ error: 'series_id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
        });
  }

  try {
        const FRED_API_KEY = 'e8f12e41f115b52f9a65b3bcc42a4b63';
        const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&limit=1&sort_order=desc`;

      const fredResponse = await fetch(fredUrl);

      if (!fredResponse.ok) {
              return new Response(JSON.stringify({ error: 'Failed to fetch from FRED API' }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
              });
      }

      const data = await fredResponse.json();

      return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
        console.error('FRED API proxy error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
        });
  }
}
