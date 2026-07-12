import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Setting from '@/lib/models/Setting';
import { verifyAdmin } from '@/lib/auth';
import { isBase64Image, uploadToCloudinary } from '@/lib/cloudinary';

const defaultSettings = {
  bakeryName: "Breads & CakeStory",
  logoUrl: "/logo.png",
  contactNumber: "9272284438",
  whatsappNumber: "8999880895",
  email: "info@breadsandcakestory.com",
  address: "Bharti vidyapeth dattangr Rd tiranga chowk, opp.Shreeji pure veg Ambegaon pune-46",
  businessHours: "10.30 am to 11.00 pm",
  heroTitle: "Baking Luxury Stories in Every Slice",
  heroSubtitle: "Handcrafted cakes, custom themed creations, and premium ingredients tailored for your most exquisite celebrations.",
  swiggyUrl: "",
  zomatoUrl: "",
  googleMapsUrl: ""
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne({}).lean();
    
    if (!settings) {
      // Seed default settings
      const newSettings = new Setting(defaultSettings);
      await newSettings.save();
      settings = await Setting.findOne({}).lean();
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Upload logo to Cloudinary if base64 encoded
    if (body.logoUrl && isBase64Image(body.logoUrl)) {
      body.logoUrl = await uploadToCloudinary(body.logoUrl);
    }
    
    const settings = await Setting.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return PUT(request);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
