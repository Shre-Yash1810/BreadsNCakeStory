"use client";

import React, { useState, useEffect } from 'react';
import { useApp, Product } from '@/context/AppContext';
import { X, Plus, Minus, ShoppingBag, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [weight, setWeight] = useState(0.5); // Default weight: 0.5 kg
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    // Reset modal states when product changes
    setSelectedImageIndex(0);
    setWeight(0.5);
    setQuantity(1);
    setIsAdded(false);
  }, [product]);

  if (!product) return null;

  // Calculate dynamic price based on weight multiplier
  const getDynamicPrice = () => {
    let multiplier = 1;
    if (weight === 1) multiplier = 1.8;
    else if (weight === 2) multiplier = 3.2;
    else if (weight > 2) multiplier = weight * 1.5;

    return Math.round(product.price * multiplier);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, weight);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const finalSinglePrice = getDynamicPrice();
  const finalTotalPrice = finalSinglePrice * quantity;

  // List of images (fallback if product.images is empty or doesn't exist)
  const imageList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-cocoa-900/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-cream-50 w-full max-w-4xl rounded-2xl overflow-hidden shadow-premium border border-cream-200 z-10 flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-cocoa-900 p-2 rounded-full shadow-md transition-colors duration-300 border border-cream-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Product Images Display */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center bg-white border-r border-cream-200">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-50 border border-cream-100 mb-4">
            <img
              src={imageList[selectedImageIndex]}
              alt={product.name}
              className="object-cover w-full h-full transition-all duration-500 hover:scale-105"
            />
            {/* Organic Badge */}
            <span className="absolute top-3 left-3 bg-green-600/90 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              EGGLESS
            </span>
          </div>

          {/* Thumbnail Selector */}
          {imageList.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 justify-center">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 bg-cream-50 flex-shrink-0 transition-all duration-300 ${
                    selectedImageIndex === idx ? 'border-luxury-gold shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name}-${idx}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Pricing Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold px-2.5 py-1 bg-luxury-champagne rounded-full">
                {product.category} Cake
              </span>
            </div>

            {/* Name & Description */}
            <h3 className="heading-luxury text-2xl font-bold text-cocoa-900 mb-3">{product.name}</h3>
            <p className="text-sm text-cocoa-500 leading-relaxed mb-6 font-normal">
              {product.description}
            </p>

            {/* Form controls */}
            <div className="space-y-5">
              {/* Weight Presets */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-2">
                  Select Weight Requirement
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: '0.5 kg', value: 0.5, desc: 'Base size' },
                    { label: '1.0 kg', value: 1, desc: 'Standard' },
                    { label: '2.0 kg', value: 2, desc: 'Feast size' }
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setWeight(preset.value)}
                      className={`py-2 px-3 border rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                        weight === preset.value
                          ? 'border-luxury-gold bg-luxury-champagne/40 text-cocoa-900 shadow-sm font-semibold'
                          : 'border-cream-200 bg-white text-cocoa-500 hover:border-cream-300'
                      }`}
                    >
                      <span className="text-xs">{preset.label}</span>
                      <span className="text-[9px] text-cocoa-100 font-normal leading-none mt-0.5">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between border-t border-cream-100 pt-5 mt-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-0.5">
                    Quantity
                  </label>
                  <span className="text-[10px] text-cocoa-100">Handcrafted per order</span>
                </div>
                <div className="flex items-center border border-cream-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                  <button
                    onClick={handleDecrement}
                    className="p-1.5 hover:text-luxury-gold text-cocoa-500 rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold px-4 text-cocoa-900 w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="p-1.5 hover:text-luxury-gold text-cocoa-500 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary and Action Button */}
          <div className="border-t border-cream-200 pt-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-cocoa-500">Total Price</span>
                <span className="text-[10px] text-cocoa-100 italic">
                  ₹{finalSinglePrice} / {weight}kg
                </span>
              </div>
              <span className="text-2xl font-extrabold text-cocoa-900">₹{finalTotalPrice}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-premium active:scale-98 ${
                isAdded
                  ? 'bg-green-600 text-white shadow-none'
                  : 'bg-gold-gradient text-white hover:opacity-95 shadow-gold-glow'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added to Basket!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Basket
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductModal;
