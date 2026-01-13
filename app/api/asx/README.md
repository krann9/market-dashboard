# ASX API Integration

Real-time Australian Securities Exchange (ASX) stock data integration for the Market Dashboard.

## Endpoints

### GET /api/asx
Fetch data for a single ASX-listed stock.

**Parameters:**
- `symbol` (required): ASX stock ticker symbol (e.g., CBA, BHP, NAB)

- **Example:**
- ```bash
  curl "http://localhost:3000/api/asx?symbol=CBA"
  ```

  **Response:**
  ```json
  {
    "success": true,
    "data": {
      "symbol": "CBA",
      "name": "Commonwealth Bank of Australia",
      "price": 157.50,
      "change": 1.25,
      "changePercent": 0.80,
      "volume": 2500000,
      "timestamp": "2026-01-13T16:18:35Z"
    },
    "timestamp": "2026-01-13T16:18:35Z"
  }
  ```

  **Error Response (404):**
  ```json
  {
    "error": "Could not fetch data for symbol: INVALID"
  }
  ```

  ### POST /api/asx
  Fetch data for multiple ASX-listed stocks in a single request.

  **Request Body:**
  ```json
  {
    "symbols": ["CBA", "BHP", "NAB", "WES"]
  }
  ```

  **Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/asx" \
    -H "Content-Type: application/json" \
    -d '{"symbols": ["CBA", "BHP", "NAB"]}'
  ```

  **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "symbol": "CBA",
        "name": "Commonwealth Bank of Australia",
        "price": 157.50,
        "change": 1.25,
        "changePercent": 0.80,
        "volume": 2500000,
        "timestamp": "2026-01-13T16:18:35Z"
      },
      {
        "symbol": "BHP",
        "name": "BHP Group Limited",
        "price": 52.85,
        "change": -0.50,
        "changePercent": -0.94,
        "volume": 5000000,
        "timestamp": "2026-01-13T16:18:35Z"
      }
    ],
    "timestamp": "2026-01-13T16:18:35Z"
  }
  ```

  ## Features

  - **Real-time Data**: Fetches live stock prices and market data from ASX
  - - **Caching**: Implements 5-minute caching to reduce API load and improve performance
    - - **Batch Queries**: POST endpoint supports multiple symbols in a single request
      - - **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
        - - **Type Safety**: Proper response formatting with consistent data structures
         
          - ## Status Codes
         
          - - `200 OK`: Successful request
            - - `400 Bad Request`: Missing or invalid parameters
              - - `404 Not Found`: Symbol not found or API returned no data
                - - `500 Internal Server Error`: Server-side error
                 
                  - ## Implementation Details
                 
                  - - Uses Next.js API Routes with async/await pattern
                    - - Connects directly to ASX API endpoint: `https://www.asx.com.au/asx/1/share/{symbol}`
                      - - Includes User-Agent header to comply with API requirements
                        - - Implements Next.js ISR (Incremental Static Regeneration) with 5-minute revalidation
                          - - Full error logging for debugging
                           
                            - ## Testing
                           
                            - You can test the endpoints using curl, Postman, or directly from your frontend:
                           
                            - ```javascript
                              // Fetch single stock
                              const response = await fetch('/api/asx?symbol=CBA');
                              const data = await response.json();

                              // Fetch multiple stocks
                              const response = await fetch('/api/asx', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ symbols: ['CBA', 'BHP', 'NAB'] })
                              });
                              const data = await response.json();
                              ```

                              ## Future Enhancements

                              - Support for additional data fields (dividend info, market cap, etc.)
                              - - Advanced filtering and sorting options
                                - - Historical price data endpoints
                                  - - Real-time WebSocket integration for live updates
