import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyAdmin } from '@/lib/auth';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newOrder = new Order(body);
    await newOrder.save();
    
    // Dispatch automated WhatsApp notification asynchronously to avoid blocking checkout completion
    try {
      await sendWhatsAppNotification(
        newOrder.whatsapp,
        newOrder.customerName,
        newOrder.id,
        newOrder.total
      );
    } catch (err) {
      console.error('Failed to trigger automated WhatsApp notification:', err);
    }
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
