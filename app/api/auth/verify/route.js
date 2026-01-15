import { NextResponse } from 'next/server';

// In-memory store for demo (shared with send-code route in production)
const pendingCodes = new Map();

// POST /api/auth/verify - Verify OTP code
export async function POST(request) {
  try {
    const { email, phone, code, method = 'email' } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    const identifier = method === 'email' ? email : phone;
    
    if (!identifier) {
      return NextResponse.json(
        { success: false, error: `${method === 'email' ? 'Email' : 'Phone'} is required` },
        { status: 400 }
      );
    }

    // For demo, accept 123456 as valid code
    if (code === '123456') {
      // Create session (in production, use Supabase Auth)
      return NextResponse.json({ 
        success: true, 
        message: 'Verification successful',
        user: {
          id: 'demo-user',
          email: email || null,
          phone: phone || null,
        },
        // In production, Supabase handles session cookies automatically
        session: {
          access_token: 'demo-token',
          expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        }
      });
    }

    // Check stored code
    const stored = pendingCodes.get(identifier);
    
    if (!stored) {
      return NextResponse.json(
        { success: false, error: 'No pending verification. Request a new code.' },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      pendingCodes.delete(identifier);
      return NextResponse.json(
        { success: false, error: 'Code expired. Request a new code.' },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid code' },
        { status: 400 }
      );
    }

    // Code is valid - clean up and create session
    pendingCodes.delete(identifier);

    return NextResponse.json({ 
      success: true, 
      message: 'Verification successful',
      user: {
        id: 'user-' + Date.now(),
        email: email || null,
        phone: phone || null,
      }
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
