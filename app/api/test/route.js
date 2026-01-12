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
```

5. **Commit changes**

---

## ✅ Step 2: Test the API

1. Wait 2-3 minutes for Vercel to deploy
2. Open this URL in your browser:
```
   https://market-dashboard-beige.vercel.app/api/test
