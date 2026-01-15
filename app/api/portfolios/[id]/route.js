import { NextResponse } from 'next/server';
import { PORTFOLIO_DATA } from '@/lib/sampleData';

// GET /api/portfolios/[id] - Get single portfolio with full data
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // In production, fetch from Supabase
    const portfolio = PORTFOLIO_DATA.portfolios[id.toUpperCase()];
    
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// PATCH /api/portfolios/[id] - Update portfolio (admin only)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // TODO: Verify admin auth
    // const session = await getSession();
    // if (!session?.user?.is_admin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // In production, update in Supabase
    // const { data, error } = await updatePortfolio(id, body);
    
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio updated (demo mode)',
      data: { id, ...body }
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}
