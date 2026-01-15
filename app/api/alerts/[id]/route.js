import { NextResponse } from 'next/server';
import { TRADE_ALERTS } from '@/lib/sampleData';

// In-memory storage for demo
let alerts = [...TRADE_ALERTS];

// GET /api/alerts/[id] - Get single alert
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const alert = alerts.find(a => a.id.toString() === id);
    
    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: alert });
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}

// PATCH /api/alerts/[id] - Update alert (admin only)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const index = alerts.findIndex(a => a.id.toString() === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    alerts[index] = { ...alerts[index], ...body };

    return NextResponse.json({ 
      success: true, 
      data: alerts[index] 
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE /api/alerts/[id] - Delete alert (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const index = alerts.findIndex(a => a.id.toString() === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }

    alerts.splice(index, 1);

    return NextResponse.json({ 
      success: true, 
      message: 'Alert deleted' 
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}
