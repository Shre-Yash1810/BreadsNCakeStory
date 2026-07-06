"use client";

import React, { useState } from 'react';
import { useApp, CartItem } from '@/context/AppContext';
import { X, Plus, Minus, Trash2, Send, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
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
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const getScaledPrice = (item: CartItem) => {
    let multiplier = 1;
    if (item.weight === 1) multiplier = 1.8;
    else if (item.weight === 2) multiplier = 3.2;
    else if (item.weight > 2) multiplier = item.weight * 1.5;
    
    return Math.round(item.product.price * multiplier);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!checkoutForm.name.trim()) newErrors.name = 'Name is required';
    if (!checkoutForm.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(checkoutForm.mobile.trim())) newErrors.mobile = 'Enter a valid 10-digit number';
    
    if (!checkoutForm.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
    else if (!/^\d{10}$/.test(checkoutForm.whatsapp.trim())) newErrors.whatsapp = 'Enter a valid 10-digit number';

    if (!checkoutForm.address.trim()) newErrors.address = 'Delivery address is required';

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

      const grandTotal = getCartTotal();

      // 2. Add order to internal AppState/localStorage
      const order = addOrder({
        customerName: checkoutForm.name,
        mobile: checkoutForm.mobile,
        whatsapp: checkoutForm.whatsapp,
        address: checkoutForm.address,
        landmark: checkoutForm.landmark,
        notes: checkoutForm.notes,
        items: formattedItems,
        total: grandTotal
      });

      // 3. Format WhatsApp Message
      let message = `🍰 *New Order - ${settings.bakeryName}* 🍰\n`;
      message += `==========================\n\n`;
      message += `👤 *Customer Details:*\n`;
      message += `• *Name:* ${checkoutForm.name}\n`;
      message += `• *Mobile:* ${checkoutForm.mobile}\n`;
      message += `• *WhatsApp:* ${checkoutForm.whatsapp}\n`;
      message += `• *Delivery Address:* ${checkoutForm.address}\n`;
      if (checkoutForm.landmark) {
        message += `• *Landmark:* ${checkoutForm.landmark}\n`;
      }
      if (checkoutForm.notes) {
        message += `• *Notes:* ${checkoutForm.notes}\n`;
      }
      message += `\n`;
      message += `🛒 *Ordered Products:*\n`;
      
      formattedItems.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   • Qty: ${item.quantity} | Weight: ${item.weight} kg\n`;
        message += `   • Price: ₹${item.price * item.quantity} (₹${item.price} each)\n`;
        if (item.image && !item.image.startsWith('data:image/')) {
          const detailPageUrl = `${window.location.origin}/products/${item.id}`;
          message += `   • Preview: ${detailPageUrl}\n`;
        } else if (item.image && item.image.startsWith('data:image/')) {
          message += `   • Preview: [Custom Reference Image Uploaded]\n`;
        }
      });
      
      message += `\n`;
      message += `💰 *Grand Total: ₹${grandTotal}*\n\n`;
      message += `==========================\n`;
      message += `*Status:* Order request generated. Thank you!\n`;

      // 4. Encode message for URL
      const encodedText = encodeURIComponent(message);
      
      // Clean owner number: prepend +91 if 10-digit
      let ownerNum = settings.whatsappNumber;
      if (ownerNum.length === 10) {
        ownerNum = `91${ownerNum}`;
      }

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${ownerNum}&text=${encodedText}`;

      // 5. Trigger confetti celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C5A880', '#3E2723', '#FAF7F2']
      });

      // 6. Reset cart & forms, redirect user
      clearCart();
      setCheckoutForm({
        name: '',
        mobile: '',
        whatsapp: '',
        address: '',
        landmark: '',
        notes: ''
      });
      onClose();

      // Open WhatsApp link in new tab
      window.open(whatsappUrl, '_blank');
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

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md sm:max-w-lg bg-cream-50 h-full shadow-premium flex flex-col"
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
            {cart.length === 0 ? (
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
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-cocoa-500">Order Subtotal</span>
                        <span className="text-lg font-extrabold text-cocoa-900">₹{getCartTotal()}</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gold-gradient text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold-glow hover:opacity-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
                      </button>
                      <p className="text-[10px] text-center text-cocoa-100 mt-2.5">
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
