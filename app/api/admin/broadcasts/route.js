import { NextResponse } from 'next/server';

// Sample broadcasts for demo
let broadcasts = [
  { id: '1', date: '2025-01-10', type: 'email', subject: 'MSTR Position Update', content: 'Adding to Bitcoin proxy position...', status: 'sent', recipients: 156 },
  { id: '2', date: '2025-01-05', type: 'both', subject: 'Weekly Portfolio Recap', content: 'This week we saw...', status: 'sent', recipients: 203 },
];

// GET /api/admin/broadcasts - List broadcasts (admin only)
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: broadcasts,
      total: broadcasts.length
    });
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch broadcasts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/broadcasts - Create and send broadcast (admin only)
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const newBroadcast = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: body.type || 'email',
      subject: body.subject || '',
      content: body.content,
      status: 'pending',
      recipients: 0
    };

    // Send via integrations if configured
    const results = {
      email: null,
      sms: null
    };

    if (body.type === 'email' || body.type === 'both') {
      // Send via Beehiiv
      if (process.env.BEEHIIV_API_KEY) {
        try {
          // results.email = await sendBeehiivEmail(body);
          results.email = { sent: true, count: 150 }; // Demo
        } catch (e) {
          results.email = { error: e.message };
        }
      } else {
        results.email = { skipped: true, reason: 'Beehiiv not configured' };
      }
    }

    if (body.type === 'sms' || body.type === 'both') {
      // Send via Twilio
      if (process.env.TWILIO_ACCOUNT_SID) {
        try {
          // results.sms = await sendTwilioSms(body);
          results.sms = { sent: true, count: 50 }; // Demo
        } catch (e) {
          results.sms = { error: e.message };
        }
      } else {
        results.sms = { skipped: true, reason: 'Twilio not configured' };
      }
    }

    // Update status based on results
    const emailSent = results.email?.sent;
    const smsSent = results.sms?.sent;
    
    newBroadcast.status = (emailSent || smsSent) ? 'sent' : 'failed';
    newBroadcast.recipients = (results.email?.count || 0) + (results.sms?.count || 0);

    broadcasts.unshift(newBroadcast);

    return NextResponse.json({ 
      success: true, 
      data: newBroadcast,
      results
    });
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create broadcast' },
      { status: 500 }
    );
  }
}
