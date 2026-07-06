import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { defaultProducts } from '@/context/productsData';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = defaultProducts.find((p) => p.id === params.id);
  if (!product) {
    return {
      title: 'Product Not Found - Breads & CakeStory',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://breads-n-cakestory.vercel.app';
  const absoluteImageUrl = `${siteUrl}${product.image.startsWith('/') ? '' : '/'}${product.image}`;

  return {
    title: `${product.name} - Breads & CakeStory`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Breads & CakeStory`,
      description: product.description,
      url: `${siteUrl}/products/${product.id}`,
      siteName: 'Breads & CakeStory',
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Breads & CakeStory`,
      description: product.description,
      images: [absoluteImageUrl],
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = defaultProducts.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl border border-cream-200 shadow-sm max-w-sm">
          <h2 className="heading-luxury text-2xl font-bold text-cocoa-900 mb-2">Cake Not Found</h2>
          <p className="text-sm text-cocoa-500 mb-6">The sweet creation you are looking for does not exist or has been removed.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold-gradient text-white text-xs font-bold px-6 py-3 rounded-xl shadow-gold-glow hover:opacity-95 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Boutique Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cocoa-500 hover:text-luxury-gold text-xs font-semibold transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Boutique Shop
          </Link>
        </div>

        {/* Product Card Container */}
        <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-premium grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          {/* Left: Product Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-luxury-champagne/40 bg-cream-50 flex items-center justify-center group shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-[#3E2723] text-[#FAF7F2] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              100% Eggless
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {/* Category */}
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-1.5 block">
                {product.category} Collection
              </span>

              {/* Title */}
              <h1 className="heading-luxury text-2xl sm:text-3xl text-cocoa-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-cocoa-900">₹{product.price}</span>
                <span className="text-xs text-cocoa-500 ml-2 font-medium">for 0.5 kg</span>
              </div>

              {/* Description */}
              <div className="border-t border-cream-100 pt-6 mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cocoa-900 mb-2">Description</h3>
                <p className="text-sm text-cocoa-500 font-normal leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href={`/?open=${product.id}`}
                className="w-full bg-gold-gradient text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-gold-glow hover:opacity-95 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                Order This Cake Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
