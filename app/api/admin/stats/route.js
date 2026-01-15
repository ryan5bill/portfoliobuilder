import { NextResponse } from 'next/server';
import { PORTFOLIO_DATA, TRADE_ALERTS } from '@/lib/sampleData';
import { calculateTotalReturn } from '@/lib/theme';

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    const hrgp = PORTFOLIO_DATA.portfolios.HRGP;
    const sfgp = PORTFOLIO_DATA.portfolios.SFGP;

    const stats = {
      portfolios: {
        HRGP: {
          return: calculateTotalReturn(hrgp.monthlyReturns),
          positions: hrgp.positions.length,
          trades: hrgp.trades?.length || 0,
        },
        SFGP: {
          return: calculateTotalReturn(sfgp.monthlyReturns),
          positions: sfgp.positions.length,
          trades: sfgp.trades?.length || 0,
        },
      },
      alerts: {
        total: TRADE_ALERTS.length,
        thisMonth: TRADE_ALERTS.filter(a => {
          const alertDate = new Date(a.date);
          const now = new Date();
          return alertDate.getMonth() === now.getMonth() && 
                 alertDate.getFullYear() === now.getFullYear();
        }).length,
        buys: TRADE_ALERTS.filter(a => a.action === 'BUY').length,
        sells: TRADE_ALERTS.filter(a => a.action === 'SELL').length,
      },
      users: {
        total: 5, // Demo
        active: 3,
        newThisMonth: 1,
      },
      lastUpdated: PORTFOLIO_DATA.lastUpdated || new Date().toISOString(),
    };

    return NextResponse.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
