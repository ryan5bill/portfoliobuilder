import { NextResponse } from 'next/server';

// Sample users for demo
let users = [
  { id: '1', email: 'john@example.com', phone: '+1234567890', name: 'John Smith', status: 'active', following: 'HRGP', joined: '2024-01-15', lastActive: '2025-01-10' },
  { id: '2', email: 'jane@example.com', phone: '+1987654321', name: 'Jane Doe', status: 'active', following: 'SFGP', joined: '2024-03-20', lastActive: '2025-01-09' },
  { id: '3', email: 'bob@example.com', phone: null, name: 'Bob Wilson', status: 'active', following: 'BOTH', joined: '2024-06-10', lastActive: '2025-01-08' },
];

// GET /api/admin/users - List all users (admin only)
export async function GET(request) {
  try {
    // TODO: Verify admin auth
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let filteredUsers = [...users];
    
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredUsers,
      total: users.length,
      stats: {
        active: users.filter(u => u.status === 'active').length,
        expired: users.filter(u => u.status === 'expired').length,
        suspended: users.filter(u => u.status === 'suspended').length
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user (admin only)
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const newUser = {
      id: Date.now().toString(),
      email: body.email,
      phone: body.phone || null,
      name: body.name || '',
      status: 'active',
      following: body.following || 'HRGP',
      joined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };

    users.unshift(newUser);

    return NextResponse.json({ 
      success: true, 
      data: newUser 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
