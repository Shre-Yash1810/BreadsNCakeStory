"use client";

import React, { useState } from 'react';
import { useApp, CartItem } from '@/context/AppContext';
import { X, Plus, Minus, Trash2, Send, ShoppingCart, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    products,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    addOrder,
    clearCart,
    settings
  } = useApp();

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    address: '',
    landmark: '',
    notes: '',
    deliveryDate: '',
    eventType: 'General'
  });

  const [homeDelivery, setHomeDelivery] = useState(false);
  const DELIVERY_CHARGE = 50;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const getScaledPrice = (item: CartItem) => {
    let multiplier = 1;
    if (item.product.category !== 'Add-ons') {
      if (item.weight === 1) multiplier = 1.8;
      else if (item.weight === 2) multiplier = 3.2;
      else if (item.weight > 2) multiplier = item.weight * 1.5;
    }
    
    return Math.round(item.product.price * multiplier);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!checkoutForm.name.trim()) newErrors.name = 'Name is required';
    if (!checkoutForm.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(checkoutForm.mobile.trim())) newErrors.mobile = 'Enter a valid 10-digit number';
    
    if (!checkoutForm.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
    else if (!/^\d{10}$/.test(checkoutForm.whatsapp.trim())) newErrors.whatsapp = 'Enter a valid 10-digit number';

    if (!checkoutForm.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    if (homeDelivery && !checkoutForm.address.trim()) newErrors.address = 'Delivery address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Format order items for context
      const formattedItems = cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: getScaledPrice(item),
        quantity: item.quantity,
        weight: item.weight,
        image: item.product.image
      }));

      const grandTotal = getCartTotal() + (homeDelivery ? DELIVERY_CHARGE : 0);

      // 2. Add order to internal AppState/localStorage
      addOrder({
        customerName: checkoutForm.name,
        mobile: checkoutForm.mobile,
        whatsapp: checkoutForm.whatsapp,
        address: homeDelivery ? checkoutForm.address : 'Store Pickup',
        landmark: homeDelivery ? checkoutForm.landmark : '',
        notes: checkoutForm.notes,
        items: formattedItems,
        total: grandTotal,
        deliveryDate: new Date(checkoutForm.deliveryDate).toISOString(),
        eventType: checkoutForm.eventType as any,
        homeDelivery,
        deliveryCharge: homeDelivery ? DELIVERY_CHARGE : 0
      });

      // 3. Trigger confetti celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C5A880', '#3E2723', '#FAF7F2']
      });

      // 4. Reset forms and transition to premium success screen
      clearCart();
      setCheckoutForm({
        name: '',
        mobile: '',
        whatsapp: '',
        address: '',
        landmark: '',
        notes: '',
        deliveryDate: '',
        eventType: 'General'
      });
      setHomeDelivery(false);
      setIsOrderSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-cocoa-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 w-full flex justify-end pl-10 sm:pl-16">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md sm:max-w-lg bg-cream-50 h-full shadow-premium flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-cream-200 flex items-center justify-between bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-luxury-gold" />
              <h2 className="heading-luxury text-xl font-bold text-cocoa-900">Your Basket</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-cream-100 rounded-full text-cocoa-500">
                {cart.length} item{cart.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-cream-100 transition-colors duration-300"
            >
              <X className="w-5 h-5 text-cocoa-900" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {isOrderSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-200 shadow-sm mx-auto">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="heading-luxury text-2xl font-bold text-cocoa-900 mb-3">Order Confirmed!</h3>
                <div className="w-12 h-[2px] bg-luxury-gold mx-auto mb-4" />
                <p className="text-sm text-cocoa-500 max-w-sm mb-2 leading-relaxed">
                  Your premium cake order request has been successfully registered in our kitchen!
                </p>
                <p className="text-xs text-luxury-gold font-semibold max-w-xs mb-8">
                  We've sent an automated confirmation message directly to your WhatsApp number.
                </p>
                <button
                  onClick={() => {
                    setIsOrderSuccess(false);
                    onClose();
                  }}
                  className="w-full bg-gold-gradient text-white font-bold py-3.5 rounded-xl shadow-gold-glow hover:opacity-95 transition-all duration-300"
                >
                  Return to Storefront
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-luxury-gold opacity-50" />
                </div>
                <h3 className="heading-luxury text-lg font-semibold text-cocoa-900 mb-1">Your Basket is Empty</h3>
                <p className="text-sm text-cocoa-500 max-w-xs mb-6">
                  Add some handcrafted premium cakes to your basket and make your celebrations sweeter!
                </p>
                <button
                  onClick={onClose}
                  className="bg-gold-gradient text-white font-medium px-6 py-2.5 rounded-xl shadow-gold-glow hover:opacity-90 active:scale-95 transition-all duration-300"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                {/* Product Items List */}
                <div className="space-y-3">
                  {cart.map((item, index) => {
                    const singlePrice = getScaledPrice(item);
                    return (
                      <div
                        key={`${item.product.id}-${item.weight}-${index}`}
                        className="bg-white rounded-xl p-3.5 border border-cream-200 flex gap-4 shadow-sm"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-cream-100 bg-cream-50">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="heading-luxury text-sm font-semibold text-cocoa-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-luxury-gold font-medium mt-0.5">
                            Weight: {item.weight} kg
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Editor */}
                            <div className="flex items-center border border-cream-200 rounded-lg bg-cream-50 px-1 py-0.5">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.weight, item.quantity - 1)}
                                className="p-1 hover:text-luxury-gold text-cocoa-500 rounded"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-semibold px-2 text-cocoa-900 w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.weight, item.quantity + 1)}
                                className="p-1 hover:text-luxury-gold text-cocoa-500 rounded"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Price details */}
                            <span className="text-sm font-bold text-cocoa-900">
                              ₹{singlePrice * item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeFromCart(item.product.id, item.weight)}
                          className="text-cocoa-100 hover:text-red-500 transition-colors self-start p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add-ons Upsell Section */}
                {products.filter(p => p.category === 'Add-ons').length > 0 && (
                  <div className="border-t border-cream-200 pt-5 mt-5">
                    <h3 className="heading-luxury text-sm font-bold text-cocoa-900 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" /> Make It Extra Special
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {products.filter(p => p.category === 'Add-ons').map(addon => (
                        <div key={addon.id} className="min-w-[140px] bg-white rounded-xl border border-cream-200 p-2.5 shadow-sm flex flex-col justify-between">
                          <div className="relative w-full h-24 rounded-lg overflow-hidden bg-cream-50 mb-2 border border-cream-100">
                            <img src={addon.image} alt={addon.name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-cocoa-900 truncate">{addon.name}</h4>
                            <span className="text-[10px] text-cocoa-500 font-bold block mb-2">₹{addon.price}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(addon, 1, 1)}
                            className="w-full bg-cream-100 hover:bg-luxury-champagne hover:text-luxury-gold text-cocoa-900 font-semibold text-[10px] py-1.5 rounded transition-all duration-300 flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checkout Section Form */}
                <div className="border-t border-cream-200 pt-6 mt-6 space-y-4">
                  <h3 className="heading-luxury text-base font-bold text-cocoa-900 border-l-4 border-luxury-gold pl-2.5">
                    Delivery Checkout Details
                  </h3>

                  <form onSubmit={handleSubmitOrder} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={checkoutForm.name}
                        onChange={handleInputChange}
                        className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={checkoutForm.mobile}
                          onChange={handleInputChange}
                          maxLength={10}
                          className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                          placeholder="10-digit number"
                        />
                        {errors.mobile && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.mobile}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="whatsapp"
                          value={checkoutForm.whatsapp}
                          onChange={handleInputChange}
                          maxLength={10}
                          className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                          placeholder="WhatsApp number"
                        />
                        {errors.whatsapp && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.whatsapp}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          name="deliveryDate"
                          value={checkoutForm.deliveryDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium cursor-pointer"
                        />
                        {errors.deliveryDate && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.deliveryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                          Celebration Event
                        </label>
                        <select
                          name="eventType"
                          value={checkoutForm.eventType}
                          onChange={handleInputChange}
                          className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium cursor-pointer"
                        >
                          <option value="General">General / No Event</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Baby Shower">Baby Shower</option>
                          <option value="Corporate">Corporate Event</option>
                          <option value="Other">Other Celebration</option>
                        </select>
                      </div>
                    </div>

                    {/* Home Delivery Toggle */}
                    <div className="bg-cream-100/30 p-4 rounded-xl border border-cream-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-cocoa-900 uppercase tracking-wider block">Home Delivery</span>
                          <span className="text-[10px] text-cocoa-500 block">Deliver to your doorstep (Charges: ₹{DELIVERY_CHARGE})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHomeDelivery(!homeDelivery)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            homeDelivery ? 'bg-luxury-gold' : 'bg-cream-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              homeDelivery ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {homeDelivery && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                            Delivery Address
                          </label>
                          <textarea
                            name="address"
                            value={checkoutForm.address}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium resize-none"
                            placeholder="Complete residential address"
                          />
                          {errors.address && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.address}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                            Landmark <span className="text-[10px] text-cocoa-100 italic">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={checkoutForm.landmark}
                            onChange={handleInputChange}
                            className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                            placeholder="e.g. Near Tiranga Chowk"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-cocoa-500 mb-1">
                        Special Instructions / Notes <span className="text-[10px] text-cocoa-100 italic">(Optional)</span>
                      </label>
                      <textarea
                        name="notes"
                        value={checkoutForm.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium resize-none"
                        placeholder="e.g. Write 'Happy Birthday Shreyash' on cake, deliver by 6 PM"
                      />
                    </div>

                    {/* Submit Order Details */}
                    <div className="border-t border-cream-200 pt-4 mt-6">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-cocoa-500">
                          <span>Items Subtotal</span>
                          <span>₹{getCartTotal()}</span>
                        </div>
                        {homeDelivery && (
                          <div className="flex items-center justify-between text-xs font-semibold text-cocoa-500">
                            <span>Delivery Charges</span>
                            <span>₹{DELIVERY_CHARGE}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-t border-cream-100 pt-2">
                          <span className="text-sm font-bold text-cocoa-900">Grand Total</span>
                          <span className="text-lg font-extrabold text-cocoa-900">
                            ₹{getCartTotal() + (homeDelivery ? DELIVERY_CHARGE : 0)}
                          </span>
                        </div>
                      </div>

                      {/* Cancellation warning note */}
                      <p className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg mb-4 text-center leading-relaxed">
                        ⚠️ <strong>Cancellation Policy:</strong> In case of order cancellation, cancellation charges may apply.
                      </p>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gold-gradient text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold-glow hover:opacity-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 text-sm"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
                      </button>
                      <p className="text-[9px] text-center text-cocoa-100 mt-2">
                        *Order request will be generated and WhatsApp will open to finalise order dispatch with the owner.
                      </p>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartDrawer;
