import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAdmin } from '@/lib/auth';
import { isBase64Image, uploadToCloudinary } from '@/lib/cloudinary';

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
    
    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Error updating product:', error);
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
    
    const deletedProduct = await Product.findOneAndDelete({ id });
    
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
