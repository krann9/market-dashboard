'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Globe, BarChart3, Eye } from 'lucide-react';

export default function Dashboard() {
  const [btcPrice, setBtcPrice] = useState({ price: 0, change: 0, high24h: 0, low24h: 0, volume: '0' });

    // Fetch Bitcoin price from API
    useEffect(() => {
          const fetchBTC = async () => {
                  try {
                            const res = await fetch('/api/btc');
                            const data = await res.json();
                            if (data.success && data.data) {
                                        setBtcPrice({
                                                      price: data.data.price,
                                                      change: ((data.data.price - 91810) / 91810 * 100).toFixed(2), // Rough calculation
                                                      high24h: Math.ceil(data.data.price * 1.01),
                                                      low24h: Math.floor(data.data.price * 0.99),
                                                      volume: (Math.random() * 50).toFixed(2) + 'B'
                                        });
                            }
                  } catch (error) {
                            console.error('Failed to fetch BTC:', error);
                  }
          };
          fetchBTC();
    }, []);

    // Fetch Treasury Yields and S&P 500 from FRED API
    useEffect(() => {
          const fetchFREDData = async () => {
                  try {
                            const FRED_API_KEY = 'e8f12e41f115b52f9a65b3bcc42a4b63';
                            const series = ['GS2', 'GS10', 'GS30', 'SP500'];
                            const rates = {};

                            for (const seriesId of series) {
                                        const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&limit=1&sort_order=desc`);
                                        const data = await res.json();
                                        if (data.observations && data.observations.length > 0) {
                                                      const value = parseFloat(data.observations[0].value);
                                                      if (seriesId === 'GS2') rates.us2y = value;
                                                      if (seriesId === 'GS10') rates.us10y = value;
                                                      if (seriesId === 'GS30') rates.us30y = value;
                                                      if (seriesId === 'SP500') rates.sp500 = value;
                                        }
                            }

                            if (Object.keys(rates).length > 0) {
                                        setBondRates(prev => ({ ...prev, ...rates }));
                            }
                  } catch (error) {
                            console.error('Failed to fetch FRED data:', error);
                  }
          };

          fetchFREDData();
    }, []);

  const [sp500Data] = useState(() => {
    const data = [];
    const baseValue = 4500;
    for (let i = 0; i < 30; i++) {
      data.push({
        date: `Day ${i + 1}`,
        sp500: baseValue + Math.random() * 200 - 100,
        asx200: 7600 + Math.random() * 150 - 75,
      });
    }
    return data;
  });

  const [bondRates] = useState({ 
    us10y: 4.23, 
    us2y: 4.15, 
    us30y: 4.45 
  });

  const [axsStocks] = useState([
    {
      ticker: 'XRO.AX',
      name: 'Xero Limited',
      price: 120.50,
      change24h: 2.3,
      mtd: 5.6,
      ytd: 15.2
    },
    {
      ticker: 'DDR.AX',
      name: 'Dicker Data',
      price: 4.25,
      change24h: -1.2,
      mtd: 2.1,
      ytd: 8.7
    },
    {
      ticker: '^AXJO',
      name: 'ASX 200',
      price: 7634.12,
      change24h: -0.5,
      mtd: 1.8,
      ytd: 12.3
    }
  ]);

  const [time, setTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&family=Playfair+Display:wght@400;600;700&display=swap');
        
        * {
          font-family: 'JetBrains Mono', monospace;
        }
        
        .headline-font {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .animate-slide-in {
          animation: slideInFromTop 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .data-card {
          background: linear-gradient(135deg, rgba(39, 39, 42, 0.4) 0%, rgba(24, 24, 27, 0.6) 100%);
          border: 1px solid rgba(251, 191, 36, 0.1);
          transition: all 0.3s ease;
        }
        
        .data-card:hover {
          border-color: rgba(251, 191, 36, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(251, 191, 36, 0.1);
        }
        
        .ticker-tape {
          background: linear-gradient(90deg, rgba(24, 24, 27, 0.95) 0%, rgba(39, 39, 42, 0.95) 100%);
          border-bottom: 1px solid rgba(251, 191, 36, 0.2);
        }
        
        .market-open {
          animation: pulse 2s ease-in-out infinite;
        }

        .stock-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .stock-table th {
          text-align: left;
          padding: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(251, 191, 36, 0.1);
        }

        .stock-table td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(39, 39, 42, 0.5);
          font-size: 14px;
        }

        .stock-table tr:last-child td {
          border-bottom: none;
        }

        .stock-table tr:hover {
          background: rgba(251, 191, 36, 0.05);
        }
      `}</style>

      {/* Header with live clock */}
      <div className="ticker-tape mb-8 p-4 rounded-lg animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="headline-font text-4xl font-bold text-amber-400 mb-1">
              MARKET TERMINAL
            </h1>
            <p className="text-xs text-zinc-500 tracking-widest">LIVE DATA STREAM</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light text-amber-400 tracking-wider">
              {formatTime(time)}
            </div>
            <div className="text-xs text-zinc-500 mt-1">{formatDate(time)}</div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full market-open"></span>
              <span className="text-xs text-emerald-400">MARKETS OPEN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        
        {/* Bitcoin Price Card */}
        <div className="data-card p-6 rounded-lg" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className="text-amber-400" size={28} />
              <div>
                <h3 className="text-xs text-zinc-500 tracking-widest">BITCOIN</h3>
                <p className="text-2xl font-semibold text-zinc-100 mt-1">
                  ${btcPrice.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-1 ${btcPrice.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {btcPrice.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              <span className="text-sm font-semibold">
                {btcPrice.change >= 0 ? '+' : ''}{btcPrice.change}%
              </span>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">24H HIGH</span>
              <span className="text-zinc-300 font-semibold">${btcPrice.high24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">24H LOW</span>
              <span className="text-zinc-300 font-semibold">${btcPrice.low24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">24H VOLUME</span>
              <span className="text-zinc-300 font-semibold">${btcPrice.volume}</span>
            </div>
          </div>
        </div>

        {/* Bond Rates Card */}
        <div className="data-card p-6 rounded-lg" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-amber-400" size={28} />
            <div>
              <h3 className="text-xs text-zinc-500 tracking-widest">US TREASURY YIELDS</h3>
              <p className="text-sm text-zinc-400 mt-1">Government Bonds</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded">
              <span className="text-zinc-400 text-sm">2-Year</span>
              <span className="text-xl font-semibold text-zinc-100">{bondRates.us2y}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded">
              <span className="text-zinc-400 text-sm">10-Year</span>
              <span className="text-xl font-semibold text-amber-400">{bondRates.us10y}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded">
              <span className="text-zinc-400 text-sm">30-Year</span>
              <span className="text-xl font-semibold text-zinc-100">{bondRates.us30y}%</span>
            </div>
          </div>
        </div>

        {/* Interest Rates Card */}
        <div className="data-card p-6 rounded-lg" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-amber-400" size={28} />
            <div>
              <h3 className="text-xs text-zinc-500 tracking-widest">CENTRAL BANK RATES</h3>
              <p className="text-sm text-zinc-400 mt-1">Policy Rates</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded">
              <div>
                <span className="text-zinc-400 text-sm block">Federal Reserve</span>
                <span className="text-xs text-zinc-600">USD</span>
              </div>
              <span className="text-xl font-semibold text-zinc-100">5.50%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded">
              <div>
                <span className="text-zinc-400 text-sm block">European Central Bank</span>
                <span className="text-xs text-zinc-600">EUR</span>
              </div>
              <span className="text-xl font-semibold text-zinc-100">4.00%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded">
              <div>
                <span className="text-zinc-400 text-sm block">Reserve Bank of Australia</span>
                <span className="text-xs text-zinc-600">AUD</span>
              </div>
              <span className="text-xl font-semibold text-zinc-100">4.35%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ASX Watchlist */}
      <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="data-card p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="text-amber-400" size={28} />
            <div>
              <h3 className="text-xs text-zinc-500 tracking-widest">ASX WATCHLIST</h3>
              <p className="text-sm text-zinc-400 mt-1">Australian Securities Exchange</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Price</th>
                  <th>24H</th>
                  <th>MTD</th>
                  <th>YTD</th>
                </tr>
              </thead>
              <tbody>
                {axsStocks.map((stock, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <div className="font-semibold text-zinc-100">{stock.ticker}</div>
                        <div className="text-xs text-zinc-500">{stock.name}</div>
                      </div>
                    </td>
                    <td className="text-zinc-100 font-semibold">
                      ${formatCurrency(stock.price)}
                    </td>
                    <td>
                      <div className={`flex items-center gap-1 ${stock.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="font-semibold">{formatPercentage(stock.change24h)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={stock.mtd >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatPercentage(stock.mtd)}
                      </span>
                    </td>
                    <td>
                      <span className={stock.ytd >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatPercentage(stock.ytd)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        
        {/* S&P 500 Chart */}
        <div className="data-card p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-amber-400" size={28} />
            <div>
              <h3 className="text-xs text-zinc-500 tracking-widest">S&P 500 INDEX</h3>
              <p className="text-2xl font-semibold text-zinc-100 mt-1">4,567.89</p>
              <div className="flex items-center gap-1 text-emerald-400 text-sm mt-1">
                <TrendingUp size={14} />
                <span>+1.23% (56.23)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sp500Data}>
              <defs>
                <linearGradient id="sp500Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#52525b" 
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#52525b" 
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #fbbf24',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="sp500" 
                stroke="#fbbf24" 
                strokeWidth={2}
                fill="url(#sp500Gradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ASX 200 Chart */}
        <div className="data-card p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-amber-400" size={28} />
            <div>
              <h3 className="text-xs text-zinc-500 tracking-widest">ASX 200 INDEX</h3>
              <p className="text-2xl font-semibold text-zinc-100 mt-1">7,634.12</p>
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <TrendingDown size={14} />
                <span>-0.45% (34.56)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sp500Data}>
              <XAxis 
                dataKey="date" 
                stroke="#52525b" 
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#52525b" 
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
                domain={[7400, 7800]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #fbbf24',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="asx200" 
                stroke="#fbbf24" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-zinc-600 tracking-wider">
        <p>DATA DELAYED • FOR INFORMATIONAL PURPOSES ONLY • NOT INVESTMENT ADVICE</p>
      </div>
    </div>
  );
}
