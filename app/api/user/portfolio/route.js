import { NextResponse } from 'next/server';

// In-memory storage for demo
let userPortfolios = {};

// GET /api/user/portfolio - Get current user's portfolio
export async function GET(request) {
  try {
    // TODO: Get user ID from session
    const userId = 'demo-user';
    
    const portfolio = userPortfolios[userId] || {
      id: null,
      name: 'My Portfolio',
      following: 'HRGP',
      trades: [],
      createdAt: null
    };

    return NextResponse.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// POST /api/user/portfolio - Create user portfolio
export async function POST(request) {
  try {
    const body = await request.json();
    const userId = 'demo-user';
    
    const portfolio = {
      id: Date.now().toString(),
      name: body.name || 'My Portfolio',
      following: body.following || 'HRGP',
      trades: [],
      createdAt: new Date().toISOString()
    };

    userPortfolios[userId] = portfolio;

    return NextResponse.json({ 
      success: true, 
      data: portfolio 
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}

// PATCH /api/user/portfolio - Update user portfolio
export async function PATCH(request) {
  try {
    const body = await request.json();
    const userId = 'demo-user';
    
    if (!userPortfolios[userId]) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    userPortfolios[userId] = {
      ...userPortfolios[userId],
      ...body
    };

    return NextResponse.json({ 
      success: true, 
      data: userPortfolios[userId] 
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}
