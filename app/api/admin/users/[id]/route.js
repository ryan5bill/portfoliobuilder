import { NextResponse } from 'next/server';

// Sample users for demo (shared with parent route)
let users = [
  { id: '1', email: 'john@example.com', phone: '+1234567890', name: 'John Smith', status: 'active', following: 'HRGP', joined: '2024-01-15', lastActive: '2025-01-10' },
  { id: '2', email: 'jane@example.com', phone: '+1987654321', name: 'Jane Doe', status: 'active', following: 'SFGP', joined: '2024-03-20', lastActive: '2025-01-09' },
  { id: '3', email: 'bob@example.com', phone: null, name: 'Bob Wilson', status: 'active', following: 'BOTH', joined: '2024-06-10', lastActive: '2025-01-08' },
];

// GET /api/admin/users/[id] - Get single user
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    users[index] = { ...users[index], ...body };

    return NextResponse.json({ 
      success: true, 
      data: users[index] 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    users.splice(index, 1);

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
