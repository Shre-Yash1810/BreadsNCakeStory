import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/lib/models/Gallery';
import { verifyAdmin } from '@/lib/auth';
import { isBase64Image, uploadToCloudinary } from '@/lib/cloudinary';

const defaultGallery = [
  '/images/cake_birthday_1.png',
  '/images/cake_birthday_2.png',
  '/images/cake_anniversary_1.png',
  '/images/cake_anniversary_2.png',
  '/images/cake_themed_1.png',
  '/images/cake_themed_2.png',
  '/images/cake_themed_3.png',
  '/images/cake_birthday_3.png'
];

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let images = await Gallery.find({}).lean();
    
    if (images.length === 0) {
      // Seed default gallery images
      const seedData = defaultGallery.map((img) => ({ imageUrl: img }));
      await Gallery.insertMany(seedData);
      images = await Gallery.find({}).lean();
    }
    
    return NextResponse.json(images.map((img) => img.imageUrl));
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    let { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }
    
    // Upload gallery image to Cloudinary if base64 encoded
    if (isBase64Image(imageUrl)) {
      imageUrl = await uploadToCloudinary(imageUrl);
    }
    
    const newImage = new Gallery({ imageUrl });
    await newImage.save();
    
    return NextResponse.json({ imageUrl: newImage.imageUrl }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    let imageUrl = searchParams.get('imageUrl');
    
    if (!imageUrl) {
      const body = await request.json().catch(() => ({}));
      imageUrl = body.imageUrl;
    }
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }
    
    const deletedImage = await Gallery.findOneAndDelete({ imageUrl });
    
    if (!deletedImage) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
