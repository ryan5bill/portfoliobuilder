import { NextResponse } from 'next/server';

// In-memory storage for demo
let userTrades = {};

// GET /api/user/trades - Get user's trades
export async function GET(request) {
  try {
    const userId = 'demo-user';
    const trades = userTrades[userId] || [];

    return NextResponse.json({ 
      success: true, 
      data: trades,
      total: trades.length
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trades' },
      { status: 500 }
    );
  }
}

// POST /api/user/trades - Add a trade
export async function POST(request) {
  try {
    const body = await request.json();
    const userId = 'demo-user';
    
    if (!body.ticker || !body.shares || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Ticker, shares, and price are required' },
        { status: 400 }
      );
    }

    const trade = {
      id: Date.now().toString(),
      date: body.date || new Date().toISOString().split('T')[0],
      ticker: body.ticker.toUpperCase(),
      action: body.action || 'BUY',
      shares: parseFloat(body.shares),
      price: parseFloat(body.price),
      notes: body.notes || '',
      createdAt: new Date().toISOString()
    };

    if (!userTrades[userId]) {
      userTrades[userId] = [];
    }
    
    userTrades[userId].unshift(trade);

    return NextResponse.json({ 
      success: true, 
      data: trade 
    });
  } catch (error) {
    console.error('Error adding trade:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add trade' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/trades - Delete a trade (pass id in body)
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const userId = 'demo-user';
    
    if (!userTrades[userId]) {
      return NextResponse.json(
        { success: false, error: 'No trades found' },
        { status: 404 }
      );
    }

    const index = userTrades[userId].findIndex(t => t.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Trade not found' },
        { status: 404 }
      );
    }

    userTrades[userId].splice(index, 1);

    return NextResponse.json({ 
      success: true, 
      message: 'Trade deleted' 
    });
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete trade' },
      { status: 500 }
    );
  }
}
