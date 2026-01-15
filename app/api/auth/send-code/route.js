import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { sendVerificationSMS } from '@/lib/twilio';

// In-memory store for demo (use Redis/DB in production)
const pendingCodes = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-code - Send OTP code
export async function POST(request) {
  try {
    const { email, phone, method = 'email' } = await request.json();
    
    if (method === 'email' && !email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    if (method === 'phone' && !phone) {
      return NextResponse.json(
        { success: false, error: 'Phone is required' },
        { status: 400 }
      );
    }

    const identifier = method === 'email' ? email : phone;
    const code = generateCode();
    
    // Store code with expiration (10 minutes)
    pendingCodes.set(identifier, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    if (method === 'email') {
      // In production, use Supabase Auth or send via Beehiiv/custom SMTP
      // await supabase.auth.signInWithOtp({ email });
      
      console.log(`[DEV] Email code for ${email}: ${code}`);
      
      // For demo, we'll just log it
      // In production, send actual email
    } else {
      // In production, send via Twilio
      // await sendVerificationSMS({ to: phone, code });
      
      console.log(`[DEV] SMS code for ${phone}: ${code}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Verification code sent to ${method}`,
      // Only include code in development for testing
      ...(process.env.NODE_ENV === 'development' && { devCode: code })
    });
  } catch (error) {
    console.error('Error sending code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
