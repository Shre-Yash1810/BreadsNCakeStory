import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Session from '@/lib/models/Session';

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('bac_session_token')?.value;

    if (token) {
      // Connect to database and invalidate the session
      await dbConnect();
      await Session.deleteOne({ token });
    }

    // Delete the session cookie
    cookieStore.delete('bac_session_token');

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
