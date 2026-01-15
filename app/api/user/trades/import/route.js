import { NextResponse } from 'next/server';

// In-memory storage for demo (shared with trades route)
let userTrades = {};

// POST /api/user/trades/import - Bulk import trades from CSV
export async function POST(request) {
  try {
    const body = await request.json();
    const userId = 'demo-user';
    
    if (!body.trades || !Array.isArray(body.trades)) {
      return NextResponse.json(
        { success: false, error: 'trades array is required' },
        { status: 400 }
      );
    }

    const imported = [];
    const errors = [];

    for (const trade of body.trades) {
      try {
        if (!trade.ticker || !trade.shares || !trade.price) {
          errors.push({ trade, error: 'Missing required fields' });
          continue;
        }

        const newTrade = {
          id: Date.now().toString() + '-' + Math.random().toString(36).slice(2, 7),
          date: trade.date || new Date().toISOString().split('T')[0],
          ticker: trade.ticker.toUpperCase(),
          action: trade.action?.toUpperCase() || 'BUY',
          shares: parseFloat(trade.shares),
          price: parseFloat(trade.price),
          notes: trade.notes || '',
          createdAt: new Date().toISOString()
        };

        if (!userTrades[userId]) {
          userTrades[userId] = [];
        }
        
        userTrades[userId].push(newTrade);
        imported.push(newTrade);
      } catch (e) {
        errors.push({ trade, error: e.message });
      }
    }

    // Sort by date descending
    if (userTrades[userId]) {
      userTrades[userId].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        imported: imported.length,
        errors: errors.length,
        trades: imported
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error importing trades:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import trades' },
      { status: 500 }
    );
  }
}
