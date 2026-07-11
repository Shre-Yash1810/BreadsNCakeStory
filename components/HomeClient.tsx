"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp, Product } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import HeroScene from '@/components/HeroScene';
import CartDrawer from '@/components/CartDrawer';
import ProductModal from '@/components/ProductModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Eye, ShoppingBag, Plus, Minus, Info, Check, MessageSquare, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomeClient() {
  const { products, settings, gallery, addToCart, reviews, addReview, addOrder } = useApp();
  const carouselProducts = products.filter(p => p.category !== 'Add-ons');
  const searchParams = useSearchParams();
  
  // Modal & Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Auto-open product modal based on query param '?open=prod-x'
  useEffect(() => {
    const openId = searchParams.get('open');
    if (openId && products.length > 0) {
      const prod = products.find((p) => p.id === openId);
      if (prod) {
        setActiveProduct(prod);
      }
    }
  }, [searchParams, products]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Dynamic quick-add state to track weight and qty directly on card
  const [cardStates, setCardStates] = useState<Record<string, { weight: number; qty: number }>>({});
  const [successAddedId, setSuccessAddedId] = useState<string | null>(null);

  // Custom cake inquiry form state
  const [customForm, setCustomForm] = useState({
    name: '',
    phone: '',
    eventType: 'Birthday',
    theme: '',
    weight: '1',
    date: '',
    instructions: ''
  });
  const [customErrors, setCustomErrors] = useState<Record<string, string>>({});

  // Custom cake upload image state
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string>('');
  const [isUploadingCustom, setIsUploadingCustom] = useState(false);

  // Review form states
  const [reviewForm, setReviewForm] = useState({
    name: '',
    quote: '',
    rating: 5
  });
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({});

  // Circular train states
  const [trainStep, setTrainStep] = useState(0);
  const [autoRotateTrain, setAutoRotateTrain] = useState(true);

  const trainIndex = carouselProducts.length > 0 ? ((trainStep % carouselProducts.length) + carouselProducts.length) % carouselProducts.length : 0;

  useEffect(() => {
    if (!autoRotateTrain || carouselProducts.length === 0) return;
    const interval = setInterval(() => {
      setTrainStep((prev) => prev + 1);
    }, 1800);
    return () => clearInterval(interval);
  }, [autoRotateTrain, carouselProducts.length]);

  const rotateToCard = (idx: number) => {
    const n = carouselProducts.length;
    if (n === 0) return;
    const currentStep = trainStep;
    const currentIdx = ((currentStep % n) + n) % n;
    
    let diff = idx - currentIdx;
    if (diff > n / 2) {
      diff -= n;
    } else if (diff < -n / 2) {
      diff += n;
    }
    
    setTrainStep(currentStep + diff);
  };

  // Testimonials slider state
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % Math.min(reviews.length, 6));
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!reviewForm.name.trim()) errors.name = 'Name is required';
    if (!reviewForm.quote.trim()) errors.quote = 'Review text is required';

    if (Object.keys(errors).length > 0) {
      setReviewErrors(errors);
      return;
    }

    addReview({
      name: reviewForm.name,
      quote: reviewForm.quote,
      rating: reviewForm.rating
    });

    setReviewForm({ name: '', quote: '', rating: 5 });
    setReviewErrors({});
    setReviewSubmitSuccess(true);
    setTimeout(() => setReviewSubmitSuccess(false), 3000);
  };

  // Filtered products
  const filteredProducts = selectedCategory === 'All'
    ? products.filter(p => p.category !== 'Add-ons')
    : products.filter(p => p.category === selectedCategory);

  // Get or initialize quick states for cards
  const getCardState = (id: string) => {
    return cardStates[id] || { weight: 0.5, qty: 1 };
  };

  const updateCardState = (id: string, weight: number, qty: number) => {
    setCardStates(prev => ({ ...prev, [id]: { weight, qty } }));
  };

  const handleCardAddToCart = (product: Product) => {
    const cardState = getCardState(product.id);
    addToCart(product, cardState.qty, cardState.weight);
    
    // Success feedback
    setSuccessAddedId(product.id);
    setTimeout(() => setSuccessAddedId(null), 1200);

    // Minor confetti pop
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#D4AF37', '#C5A880']
    });
  };

  // Custom Inquiry submit
  // Custom Inquiry submit
  const handleCustomInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!customForm.name.trim()) newErrors.name = 'Name is required';
    if (!customForm.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(customForm.phone.trim())) newErrors.phone = 'Enter a valid 10-digit number';
    if (!customForm.theme.trim()) newErrors.theme = 'Design theme / theme concept is required';
    if (!customForm.date) newErrors.date = 'Preferred date is required';

    if (Object.keys(newErrors).length > 0) {
      setCustomErrors(newErrors);
      return;
    }

    let uploadedUrl = '';
    if (customImage) {
      setIsUploadingCustom(true);
      try {
        const formData = new FormData();
        formData.append('file', customImage);
        
        // Uploading anonymously to tmpfiles.org
        const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: formData
        });
        
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.status === 'success' && uploadJson.data?.url) {
            // Convert to direct link for easy viewing
            uploadedUrl = uploadJson.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          }
        }
      } catch (err) {
        console.error("Reference image upload failed", err);
      }
      setIsUploadingCustom(false);
    }

    // Format WhatsApp message
    let message = `🎂 *Custom Cake Inquiry - ${settings.bakeryName}* 🎂\n`;
    message += `==========================\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `• *Name:* ${customForm.name}\n`;
    message += `• *Phone:* ${customForm.phone}\n\n`;
    message += `🎉 *Event Details:*\n`;
    message += `• *Event Type:* ${customForm.eventType}\n`;
    message += `• *Cake Theme/Idea:* ${customForm.theme}\n`;
    message += `• *Est. Weight:* ${customForm.weight} kg\n`;
    message += `• *Delivery Date:* ${customForm.date}\n\n`;
    if (customForm.instructions.trim()) {
      message += `✍️ *Instructions/Flavor Request:*\n`;
      message += `${customForm.instructions}\n\n`;
    }
    if (uploadedUrl) {
      message += `📸 *Reference Image URL:*\n${uploadedUrl}\n\n`;
    }
    message += `==========================\n`;
    message += `*Please review and confirm cake booking availability.*`;

    // Save as local custom order so admin can view it
    addOrder({
      customerName: customForm.name,
      mobile: customForm.phone,
      whatsapp: customForm.phone,
      address: 'Bespoke Custom Cake Inquiry',
      landmark: `Event: ${customForm.eventType}`,
      notes: `Theme: ${customForm.theme}. Prep Date: ${customForm.date}. Instructions: ${customForm.instructions}`,
      items: [{
        id: `custom-${Date.now()}`,
        name: `Bespoke Custom Cake`,
        price: 0,
        quantity: 1,
        weight: parseFloat(customForm.weight),
        image: uploadedUrl || '/images/cake_themed_1.png'
      }],
      total: 0
    });

    const encodedText = encodeURIComponent(message);
    let ownerNum = settings.whatsappNumber;
    if (ownerNum.length === 10) ownerNum = `91${ownerNum}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${ownerNum}&text=${encodedText}`;
    
    // Clear custom form and reset image states
    setCustomForm({
      name: '',
      phone: '',
      eventType: 'Birthday',
      theme: '',
      weight: '1',
      date: '',
      instructions: ''
    });
    setCustomImage(null);
    setCustomImagePreview('');
    setCustomErrors({});
    window.open(whatsappUrl, '_blank');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomForm(prev => ({ ...prev, [name]: value }));
    if (customErrors[name]) {
      setCustomErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Static Premium Testimonials
  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      quote: 'We ordered the Golden Glamour Chocolate Cake for my daughter\'s birthday, and it was the highlight of the party! Breads & CakeStory design sense is unmatched. Elegant, not too sweet, and 100% pure vegetarian.',
      rating: 5
    },
    {
      name: 'Pooja Kulkarni',
      quote: 'Absolute masterpiece. The Red Velvet Bloom Cake for our anniversary looked too beautiful to cut, but tasted even better! Extremely premium delivery service and custom inquiries are handled with great detail on WhatsApp.',
      rating: 5
    },
    {
      name: 'Aditya Ranade',
      quote: 'If you want a cake that looks like a work of art and tastes like heaven, this is the place. Their themed galaxy cake mirror glaze was flawless. The design detail was spectacular and they are very prompt with WhatsApp responses.',
      rating: 5
    }
  ];

  const anglePerItem = carouselProducts.length > 0 ? 360 / carouselProducts.length : 0;
  const currentRotation = -trainStep * anglePerItem;

  return (
    <>
      <Navbar onCartOpen={() => setIsCartOpen(true)} />
      
      {/* 1. Hero Section */}
      <HeroScene />

      {/* Circular Train Carousel Section */}
      <section className="py-16 bg-white border-t border-cream-200 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,234,211,0.25)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-2 block">Interactive Orbit</span>
            <h2 className="heading-luxury text-3xl sm:text-4xl text-cocoa-900 mb-4">The Patisserie Carousel</h2>
            <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-4" />
            <p className="text-sm text-cocoa-500 max-w-xl mx-auto">
              Spin the rotating train of sweet creations. Tap any cake to reveal its name, flavor profile, and direct order options.
            </p>
          </div>

          {/* 3D Train Container */}
          <div className="relative h-[280px] sm:h-[400px] flex items-center justify-center perspective-container ring-container">
            {carouselProducts.length > 0 && (
              <div
                className="relative w-full h-full flex items-center justify-center ring-3d"
                style={{
                  transform: `rotateY(${currentRotation}deg)`,
                  '--radius': 'var(--radius-dynamic)'
                } as any}
              >
                {carouselProducts.map((product, idx) => {
                  const itemAngle = idx * anglePerItem;
                  const isSelected = idx === trainIndex;
                  const isVisible = idx === trainIndex ||
                    idx === (trainIndex - 1 + carouselProducts.length) % carouselProducts.length ||
                    idx === (trainIndex + 1) % carouselProducts.length;

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        rotateToCard(idx);
                      }}
                      className={`absolute left-1/2 top-1/2 w-36 h-36 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-4 bg-white cursor-pointer shadow-premium transition-all duration-500 ring-item-3d ${
                        isVisible
                          ? isSelected
                            ? 'border-luxury-gold ring-4 ring-luxury-gold/25 z-10 opacity-100 pointer-events-auto shadow-gold-glow'
                            : 'border-white opacity-40 sm:opacity-60 z-0 pointer-events-auto'
                          : 'opacity-0 pointer-events-none z-0'
                      }`}
                      style={{
                        transform: `translate(-50%, -50%) rotateY(${itemAngle}deg) translateZ(var(--radius)) scale(${
                          isSelected ? 1.15 : isVisible ? 0.5 : 0.35
                        })`,
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Carousel Control Buttons */}
            {carouselProducts.length > 0 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden sm:flex justify-between px-2 sm:px-12 pointer-events-none z-20">
                <button
                  type="button"
                  onClick={() => {
                    setTrainStep((prev) => prev - 1);
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm border border-cream-200 text-cocoa-900 rounded-full flex items-center justify-center shadow-md hover:bg-luxury-gold hover:text-white transition-all duration-300 pointer-events-auto active:scale-90"
                  aria-label="Previous Cake"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrainStep((prev) => prev + 1);
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm border border-cream-200 text-cocoa-900 rounded-full flex items-center justify-center shadow-md hover:bg-luxury-gold hover:text-white transition-all duration-300 pointer-events-auto active:scale-90"
                  aria-label="Next Cake"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Active Detail Sheet below Orbit */}
          {carouselProducts.length > 0 && (
            <div className="text-center mt-12 sm:mt-16 h-8 px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={trainIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm font-extrabold text-cocoa-900 uppercase tracking-widest"
                >
                  {carouselProducts[trainIndex].name} — <span className="text-luxury-gold font-black">₹{carouselProducts[trainIndex].price}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section id="products" className="py-20 bg-cream-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-luxury text-3xl sm:text-4xl text-cocoa-900 mb-4">Handcrafted Collections</h2>
            <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-4" />
            <p className="text-sm sm:text-base text-cocoa-500 max-w-xl mx-auto font-normal">
              Explore our curated selection of high-end luxury cakes. Filter by celebration style to find your perfect flavor match.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 px-4 scrollbar-hide">
            {['All', ...Array.from(new Set(['Birthday', 'Anniversary', 'Themed', ...products.map(p => p.category)]))].filter(cat => cat !== 'Add-ons').map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                  (selectedCategory === cat)
                    ? 'bg-gold-gradient text-white shadow-premium'
                    : 'bg-white border border-cream-200 text-cocoa-500 hover:border-cream-300'
                }`}
              >
                {cat === 'All' ? 'All Cakes' : `${cat} Cakes`}
              </button>
            ))}
          </div>

          {/* 3. Products Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.filter(p => p.category !== 'Add-ons').map((product) => {
                const cardState = getCardState(product.id);
                // Price scaling multiplier
                let multiplier = 1;
                if (product.category !== 'Add-ons') {
                  if (cardState.weight === 1) multiplier = 1.8;
                  else if (cardState.weight === 2) multiplier = 3.2;
                }
                const displayPrice = Math.round(product.price * multiplier);

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-cream-200 group flex flex-col justify-between shadow-premium hover-gold-grow"
                  >
                    {/* Image Panel */}
                    <div className="relative aspect-square overflow-hidden bg-cream-50 border-b border-cream-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-cocoa-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                        <button
                          onClick={() => setActiveProduct(product)}
                          className="bg-white text-cocoa-900 p-3 rounded-full shadow-lg hover:bg-luxury-gold hover:text-white transition-all duration-300 scale-90 group-hover:scale-100"
                          title="Quick View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Pure Veg Indicator Tag */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-cream-200 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                        <span className="text-[9px] font-bold text-cocoa-900 uppercase tracking-wider">EGGLESS</span>
                      </div>
                    </div>

                    {/* Content Detail Panel */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="heading-luxury text-base font-bold text-cocoa-900 leading-tight mb-2 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-cocoa-500 font-normal leading-relaxed mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div>
                        {/* Card controls */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {/* Weight selector */}
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-cocoa-500 font-bold mb-1">Weight</span>
                            <select
                              value={cardState.weight}
                              onChange={(e) => updateCardState(product.id, parseFloat(e.target.value), cardState.qty)}
                              className="w-full text-xs py-1.5 px-2 bg-cream-50 border border-cream-200 rounded-lg text-cocoa-900 focus:outline-none focus:border-luxury-gold cursor-pointer"
                            >
                              <option value={0.5}>0.5 kg</option>
                              <option value={1}>1.0 kg</option>
                              <option value={2}>2.0 kg</option>
                            </select>
                          </div>

                          {/* Qty selector */}
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-cocoa-500 font-bold mb-1">Quantity</span>
                            <div className="flex items-center border border-cream-200 rounded-lg bg-cream-50 justify-between px-1">
                              <button
                                onClick={() => updateCardState(product.id, cardState.weight, Math.max(1, cardState.qty - 1))}
                                className="p-1 hover:text-luxury-gold text-cocoa-500"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-cocoa-900">{cardState.qty}</span>
                              <button
                                onClick={() => updateCardState(product.id, cardState.weight, cardState.qty + 1)}
                                className="p-1 hover:text-luxury-gold text-cocoa-500"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price & Add to Cart button */}
                        <div className="flex items-center justify-between border-t border-cream-100 pt-3">
                          <span className="text-base font-extrabold text-cocoa-900">
                            ₹{displayPrice * cardState.qty}
                          </span>
                          <button
                            onClick={() => handleCardAddToCart(product)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm active:scale-95 ${
                              successAddedId === product.id
                                ? 'bg-green-600 text-white shadow-none'
                                : 'bg-gold-gradient text-white hover:opacity-95'
                            }`}
                          >
                            {successAddedId === product.id ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Added
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 4. Custom Cake Section */}
      <section id="custom-cake" className="py-20 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-2 block">Exclusive Customization</span>
            <h2 className="heading-luxury text-3xl sm:text-4xl text-cocoa-900 mb-4">Bespoke Cake Creations</h2>
            <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-4" />
            <p className="text-sm text-cocoa-500 max-w-xl mx-auto">
              Make your milestone celebrations unforgettable. Share your dream cake concept, event theme, and size requirements, and we will sketch a tailored masterwork for you.
            </p>
          </div>

          {/* Luxury Custom Order Form */}
          <div className="glass-card rounded-2xl border border-cream-200 p-6 sm:p-10 shadow-premium">
            <form onSubmit={handleCustomInquiry} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={customForm.name}
                  onChange={handleCustomChange}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                  placeholder="Your full name"
                />
                {customErrors.name && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{customErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={customForm.phone}
                  onChange={handleCustomChange}
                  maxLength={10}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                  placeholder="10-digit mobile number"
                />
                {customErrors.phone && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{customErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Event Type</label>
                <select
                  name="eventType"
                  value={customForm.eventType}
                  onChange={handleCustomChange}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium cursor-pointer"
                >
                  <option value="Birthday">Birthday Party</option>
                  <option value="Anniversary">Wedding / Anniversary</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Other">Other Milestone Celebration</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Est. Weight (kg)</label>
                  <select
                    name="weight"
                    value={customForm.weight}
                    onChange={handleCustomChange}
                    className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium cursor-pointer"
                  >
                    <option value="1">1.0 kg</option>
                    <option value="1.5">1.5 kg</option>
                    <option value="2">2.0 kg</option>
                    <option value="3">3.0 kg</option>
                    <option value="5">5.0 kg+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    name="date"
                    value={customForm.date}
                    onChange={handleCustomChange}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium cursor-pointer"
                  />
                  {customErrors.date && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{customErrors.date}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Design Theme / Theme Concept</label>
                <input
                  type="text"
                  name="theme"
                  value={customForm.theme}
                  onChange={handleCustomChange}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                  placeholder="e.g. Jungle theme, Gold leaf textures, Pastel florals"
                />
                {customErrors.theme && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{customErrors.theme}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                  Special Instructions / Flavor Requests <span className="text-[10px] text-cocoa-100 italic">(Optional)</span>
                </label>
                <textarea
                  name="instructions"
                  value={customForm.instructions}
                  onChange={handleCustomChange}
                  rows={3}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium resize-none"
                  placeholder="Tell us about favored flavors, tier setups, text tags, or allergies..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                  Upload Reference Image / Design Sketch <span className="text-[10px] text-cocoa-100 italic">(Optional)</span>
                </label>
                <div className="flex items-center gap-4 mt-1 bg-white p-3 rounded-lg border border-cream-200">
                  {customImagePreview && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-cream-200 bg-cream-50 flex-shrink-0">
                      <img src={customImagePreview} alt="Reference Preview" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => { setCustomImage(null); setCustomImagePreview(''); }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[8px] hover:bg-red-700 leading-none"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCustomImage(file);
                        setCustomImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs text-cocoa-100 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-luxury-champagne file:text-luxury-gold hover:file:opacity-90 cursor-pointer"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isUploadingCustom}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98 ${
                    isUploadingCustom
                      ? 'bg-cocoa-300 text-cocoa-500 cursor-not-allowed'
                      : 'bg-cocoa-500 hover:bg-cocoa-800 hover:shadow-premium text-white'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 text-luxury-gold" />
                  {isUploadingCustom ? 'Uploading Reference Image...' : 'Send Inquiry on WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>



      {/* 6. Testimonials & Reviews Section */}
      <section id="reviews" className="py-20 bg-white border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-2 block">Client Diaries</span>
            <h2 className="heading-luxury text-3xl sm:text-4xl text-cocoa-900 mb-4">Sweet Endorsements</h2>
            <div className="w-16 h-[2px] bg-luxury-gold mx-auto" />
          </div>

          {reviews.length > 0 && (
            <div className="max-w-xl mx-auto mb-12 relative px-4">
              <div className="relative overflow-hidden min-h-[180px] sm:min-h-[140px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeReviewIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="w-full bg-cream-50/60 rounded-2xl p-6 sm:p-8 border border-cream-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex gap-0.5 mb-4 justify-center sm:justify-start">
                        {Array.from({ length: reviews[activeReviewIndex].rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
                        ))}
                      </div>
                      <p className="text-sm italic text-cocoa-500 leading-relaxed font-normal mb-6 text-center sm:text-left">
                        "{reviews[activeReviewIndex].quote}"
                      </p>
                    </div>
                    <div className="border-t border-cream-100 pt-4 text-center sm:text-left">
                      <h4 className="heading-luxury text-sm font-bold text-cocoa-900">
                        {reviews[activeReviewIndex].name}
                      </h4>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {reviews.slice(0, 6).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveReviewIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeReviewIndex ? 'bg-luxury-gold w-4' : 'bg-cream-200'
                    }`}
                    aria-label={`Go to review ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Review Submission Form */}
          <div className="max-w-xl mx-auto border-t border-cream-200 pt-12">
            <div className="text-center mb-8">
              <h3 className="heading-luxury text-2xl font-bold text-cocoa-900 mb-1">Share Your Sweet Experience</h3>
              <p className="text-xs text-cocoa-500">Your feedback helps us make Breads & CakeStory even better!</p>
            </div>

            {reviewSubmitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-4 rounded-xl text-center mb-6 font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Thank you! Your review has been submitted successfully.
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-cream-50/50 p-6 rounded-2xl border border-cream-200 shadow-sm">
              <div className="flex flex-col items-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-2">Your Rating</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? 'fill-luxury-gold text-luxury-gold'
                            : 'text-cream-200 fill-none'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Name</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-sm py-2 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                  placeholder="Your name"
                />
                {reviewErrors.name && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{reviewErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">Your Review</label>
                <textarea
                  value={reviewForm.quote}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, quote: e.target.value }))}
                  rows={3}
                  className="w-full text-sm py-2 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium resize-none"
                  placeholder="Tell us about the flavor, cake design, service..."
                />
                {reviewErrors.quote && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{reviewErrors.quote}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gold-gradient text-white py-3.5 rounded-xl font-bold hover:opacity-95 shadow-gold-glow transition-all active:scale-98 text-xs"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>



      {/* 8. Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-2 block">Get in Touch</span>
            <h2 className="heading-luxury text-3xl sm:text-4xl text-cocoa-900 mb-4">Visit Our Boutique</h2>
            <div className="w-16 h-[2px] bg-luxury-gold mx-auto" />
          </div>

          <div className="max-w-xl mx-auto">
            {/* Contact Details Card */}
            <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="heading-luxury text-lg font-bold text-cocoa-900 mb-1">{settings.bakeryName}</h3>
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Patisserie & Custom Cakes</span>
              </div>

              <div className="space-y-4 text-sm font-sans text-cocoa-500">
                <div className="flex gap-3">
                  <span className="text-luxury-gold font-semibold uppercase tracking-wider text-xs w-20 flex-shrink-0">Phone:</span>
                  <span>+91 {settings.contactNumber}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-luxury-gold font-semibold uppercase tracking-wider text-xs w-20 flex-shrink-0">WhatsApp:</span>
                  <span>+91 {settings.whatsappNumber}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-luxury-gold font-semibold uppercase tracking-wider text-xs w-20 flex-shrink-0">Address:</span>
                  <span>{settings.address}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-luxury-gold font-semibold uppercase tracking-wider text-xs w-20 flex-shrink-0">Hours:</span>
                  <span>{settings.businessHours}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-cream-200 pt-6">
                <a
                  href={`tel:${settings.contactNumber}`}
                  className="bg-white hover:bg-cream-100 text-cocoa-900 border border-cream-200 text-center py-3 rounded-xl text-xs font-bold transition-all duration-300"
                >
                  Call Now
                </a>
                <a
                  href={`https://wa.me/91${settings.whatsappNumber}`}
                  target="_blank"
                  className="bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl text-xs font-bold transition-all duration-300"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cocoa-900 text-cream-50 py-12 border-t border-cocoa-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="heading-luxury text-lg font-bold text-luxury-gold mb-3">{settings.bakeryName}</h3>
            <p className="text-xs text-cocoa-100 font-normal leading-relaxed max-w-xs">
              Handcrafting premium celebration cakes and sweet memories. Located in Ambegaon, Pune. 100% Eggless.
            </p>
          </div>
          <div>
            <h4 className="heading-luxury text-sm font-bold text-white mb-3">Sections</h4>
            <ul className="space-y-2 text-xs text-cocoa-100 font-normal">
              <li><a href="#hero" className="hover:text-luxury-gold transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-luxury-gold transition-colors">Our Cakes</a></li>
              <li><a href="#custom-cake" className="hover:text-luxury-gold transition-colors">Custom Designs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="heading-luxury text-sm font-bold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-cocoa-100 font-normal">
              <li><button onClick={() => { setSelectedCategory('Birthday'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-luxury-gold text-left">Birthday Cakes</button></li>
              <li><button onClick={() => { setSelectedCategory('Anniversary'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-luxury-gold text-left">Anniversary Cakes</button></li>
              <li><button onClick={() => { setSelectedCategory('Themed'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-luxury-gold text-left">Themed Cakes</button></li>
            </ul>
          </div>
          <div>
            <h4 className="heading-luxury text-sm font-bold text-white mb-3">Contact</h4>
            <p className="text-xs text-cocoa-100 leading-relaxed font-normal">
              📍 Ambegaon, Pune - 46<br />
              📞 +91 {settings.contactNumber}<br />
              ✉️ {settings.email}
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-cocoa-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-cocoa-100 font-normal">
            &copy; {new Date().getFullYear()} Breads & CakeStory. All Rights Reserved. Handcrafted in India.
          </span>
          <a
            href="/admin"
            className="text-[10px] text-cocoa-100 hover:text-luxury-gold uppercase tracking-wider font-semibold"
          >
            Owner Portal Login
          </a>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {activeProduct && (
          <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
