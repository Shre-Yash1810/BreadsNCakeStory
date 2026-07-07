import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Session from '@/lib/models/Session';

export async function verifyAdmin(): Promise<boolean> {
  try {
    await dbConnect();
    
    // Read the secure HTTP-only cookie
    const cookieStore = cookies();
    const token = cookieStore.get('bac_session_token')?.value;

    if (!token) {
      return false;
    }

    // Query active session from MongoDB
    const session = await Session.findOne({ token });
    if (!session) {
      return false;
    }

    // Verify session expiration
    if (new Date() > session.expiresAt) {
      await Session.deleteOne({ token });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying admin session:', error);
    return false;
  }
}
