import { NextResponse } from 'next/server';
import { PORTFOLIO_DATA } from '@/lib/sampleData';

// GET /api/portfolios - List all portfolios
export async function GET() {
  try {
    // In production, fetch from Supabase
    // const { data, error } = await getPortfolios();
    
    const portfolios = Object.values(PORTFOLIO_DATA.portfolios).map(p => ({
      id: p.ticker,
      name: p.name,
      ticker: p.ticker,
      description: p.description,
      color: p.color,
      startDate: p.startDate,
      positionCount: p.positions.length,
      // Don't include full data in list view
    }));

    return NextResponse.json({ 
      success: true, 
      data: portfolios,
      lastUpdated: PORTFOLIO_DATA.lastUpdated
    });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}
