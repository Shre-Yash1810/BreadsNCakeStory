import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Session from '@/lib/models/Session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const envUsername = process.env.ADMIN_USERNAME || 'breads&cakestory';
    const envPassword = process.env.ADMIN_PASSWORD || '1234@cake';

    if (username !== envUsername || password !== envPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Create session token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store session in MongoDB
    await Session.create({ token, expiresAt });

    // Determine if we are testing on localhost (which doesn't support HTTPS secure cookies)
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    // Set secure HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('bac_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !isLocalhost,
      sameSite: 'strict',
      path: '/',
      expires: expiresAt,
    });

    return NextResponse.json({ success: true, message: 'Logged in successfully' });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
