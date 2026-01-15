import { NextResponse } from 'next/server';
import { TRADE_ALERTS } from '@/lib/sampleData';

// In-memory storage for demo (replace with Supabase in production)
let alerts = [...TRADE_ALERTS];

// GET /api/alerts - List trade alerts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolio = searchParams.get('portfolio');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let filteredAlerts = [...alerts];
    
    if (portfolio && portfolio !== 'all') {
      filteredAlerts = filteredAlerts.filter(a => 
        a.portfolio === portfolio || a.portfolio === 'BOTH'
      );
    }
    
    // Sort by date descending
    filteredAlerts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply limit
    filteredAlerts = filteredAlerts.slice(0, limit);

    return NextResponse.json({ 
      success: true, 
      data: filteredAlerts,
      total: alerts.length
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST /api/alerts - Create new alert (admin only)
export async function POST(request) {
  try {
    const body = await request.json();
    
    // TODO: Verify admin auth
    
    const newAlert = {
      id: Date.now(),
      date: body.date || new Date().toISOString().split('T')[0],
      portfolio: body.portfolio || 'HRGP',
      ticker: body.ticker?.toUpperCase(),
      action: body.action || 'BUY',
      shares: body.shares ? parseFloat(body.shares) : null,
      price: body.price ? parseFloat(body.price) : null,
      details: body.details || '',
      is_published: body.is_published !== false
    };

    if (!newAlert.ticker) {
      return NextResponse.json(
        { success: false, error: 'Ticker is required' },
        { status: 400 }
      );
    }

    alerts.unshift(newAlert);

    return NextResponse.json({ 
      success: true, 
      data: newAlert 
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
