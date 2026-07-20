import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TempImage from '@/lib/models/TempImage';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64String = buffer.toString('base64');
    const contentType = file.type;

    await dbConnect();
    const tempImage = new TempImage({
      data: base64String,
      contentType: contentType,
    });
    
    await tempImage.save();

    // Generate absolute URL for WhatsApp so it can preview the image
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${origin}/api/images/${tempImage._id.toString()}`;

    return NextResponse.json({ status: 'success', data: { url } });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
