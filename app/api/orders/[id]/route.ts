import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyAdmin } from '@/lib/auth';
import { sendOrderCompletedNotification, sendOrderSoldNotification } from '@/lib/whatsapp';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const id = params.id;
    const body = await request.json();
    
    // Fetch current order to detect status transitions
    const existingOrder = await Order.findOne({ id });
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = existingOrder.status;
    
    const updatedOrder = await Order.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );
    
    // Trigger WhatsApp notifications on status transitions
    if (body.status && body.status !== previousStatus) {
      try {
        if (body.status === 'Completed') {
          await sendOrderCompletedNotification(
            updatedOrder.whatsapp,
            updatedOrder.customerName,
            updatedOrder.id
          );
        } else if (body.status === 'Sold') {
          await sendOrderSoldNotification(
            updatedOrder.whatsapp,
            updatedOrder.customerName,
            updatedOrder.id
          );
        }
      } catch (err) {
        console.error('Failed to send status change WhatsApp notification:', err);
      }
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const id = params.id;
    
    const deletedOrder = await Order.findOneAndDelete({ id });
    
    if (!deletedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
