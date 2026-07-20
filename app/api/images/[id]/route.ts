import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TempImage from '@/lib/models/TempImage';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const tempImage = await TempImage.findById(params.id).lean();

    if (!tempImage) {
      return new NextResponse('Image not found or expired', { status: 404 });
    }

    const buffer = Buffer.from(tempImage.data as string, 'base64');
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': tempImage.contentType as string,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Fetch image error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
