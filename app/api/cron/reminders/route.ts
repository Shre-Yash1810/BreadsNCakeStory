import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendAnnualReminderNotification } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

/**
 * Cron Reminder API - Runs daily to find orders whose delivery date
 * anniversary falls exactly 7 days from now (matching month & day,
 * ignoring the year). Sends automated WhatsApp reminders to customers.
 * 
 * Skips orders with eventType 'General' since those are not celebrations.
 * 
 * Security: Protected by a CRON_SECRET header to prevent public abuse.
 * Deploy with a serverless cron provider (e.g., Vercel Cron, cron-job.org).
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized triggers
    const cronSecret = request.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET || 'dev-cron-secret';

    if (cronSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Calculate the target date: 7 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    const targetMonth = targetDate.getMonth() + 1; // 1-indexed
    const targetDay = targetDate.getDate();

    // Use MongoDB aggregation to match month and day from the deliveryDate field
    const matchingOrders = await Order.aggregate([
      {
        $match: {
          deliveryDate: { $exists: true, $ne: null },
          eventType: { $nin: ['General'] } // Skip non-celebration orders
        }
      },
      {
        $addFields: {
          deliveryMonth: { $month: '$deliveryDate' },
          deliveryDay: { $dayOfMonth: '$deliveryDate' }
        }
      },
      {
        $match: {
          deliveryMonth: targetMonth,
          deliveryDay: targetDay
        }
      }
    ]);

    console.log(`[Cron Reminders] Found ${matchingOrders.length} orders matching ${targetMonth}/${targetDay} (7 days from now)`);

    let sentCount = 0;
    let failedCount = 0;

    for (const order of matchingOrders) {
      try {
        const success = await sendAnnualReminderNotification(
          order.whatsapp,
          order.customerName,
          order.eventType
        );
        if (success) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (err) {
        console.error(`[Cron Reminders] Failed for order ${order.id}:`, err);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${matchingOrders.length} reminders. Sent: ${sentCount}, Failed: ${failedCount}`,
      targetDate: `${targetMonth}/${targetDay}`,
      totalMatched: matchingOrders.length,
      sent: sentCount,
      failed: failedCount
    });
  } catch (error: any) {
    console.error('[Cron Reminders] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
