import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/lib/models/Review';

const defaultReviews = [
  {
    id: 'rev-1',
    name: 'Rohan Deshmukh',
    role: 'Software Architect',
    quote: 'We ordered the Golden Glamour Chocolate Cake for my daughter\'s birthday, and it was the highlight of the party! Breads & CakeStory design sense is unmatched. Elegant, not too sweet, and 100% pure vegetarian.',
    rating: 5,
    date: '02 Jul 2026'
  },
  {
    id: 'rev-2',
    name: 'Pooja Kulkarni',
    role: 'Creative Director',
    quote: 'Absolute masterpiece. The Red Velvet Bloom Cake for our anniversary looked too beautiful to cut, but tasted even better! Extremely premium delivery service and custom inquiries are handled with great detail on WhatsApp.',
    rating: 5,
    date: '28 Jun 2026'
  },
  {
    id: 'rev-3',
    name: 'Aditya Ranade',
    role: 'Event Designer',
    quote: 'If you want a cake that looks like a work of art and tastes like heaven, this is the place. Their themed galaxy cake mirror glaze was flawless. The design detail was spectacular and they are very prompt with WhatsApp responses.',
    rating: 5,
    date: '15 Jun 2026'
  }
];

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    
    if (reviews.length === 0) {
      // Seed default reviews
      await Review.insertMany(defaultReviews);
      reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    }
    
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newReview = new Review(body);
    await newReview.save();
    
    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
