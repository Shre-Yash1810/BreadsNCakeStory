import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { defaultProducts } from '@/context/productsData';
import { verifyAdmin } from '@/lib/auth';
import { isBase64Image, uploadToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let products = await Product.find({}).lean();
    
    if (products.length === 0) {
      // Seed default products
      await Product.insertMany(defaultProducts);
      products = await Product.find({}).lean();
    }
    
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const body = await request.json();
    
    // Upload main image to Cloudinary if base64 encoded
    if (body.image && isBase64Image(body.image)) {
      body.image = await uploadToCloudinary(body.image);
    }
    
    // Upload extra gallery images to Cloudinary if base64 encoded
    if (body.images && Array.isArray(body.images)) {
      body.images = await Promise.all(
        body.images.map(async (img: string) => {
          if (isBase64Image(img)) {
            return await uploadToCloudinary(img);
          }
          return img;
        })
      );
    }
    
    const newProduct = new Product(body);
    await newProduct.save();
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
