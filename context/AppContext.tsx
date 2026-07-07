"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultProducts } from './productsData';
export type { Product } from './productsData';

export interface Review {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  weight: number; // in kg (0.5, 1, 2, etc.)
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  landmark: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Completed' | 'Sold';
  date: string;
}

export interface WebsiteSettings {
  bakeryName: string;
  logoUrl: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  businessHours: string;
  heroTitle: string;
  heroSubtitle: string;
}

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  settings: WebsiteSettings;
  gallery: string[];
  reviews: Review[];
  addToCart: (product: Product, quantity: number, weight: number) => void;
  updateCartQuantity: (productId: string, weight: number, quantity: number) => void;
  removeFromCart: (productId: string, weight: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderTotal: (orderId: string, total: number) => void;
  deleteOrder: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  addGalleryImage: (imageUrl: string) => void;
  removeGalleryImage: (imageUrl: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (reviewId: string) => void;
}



const defaultSettings: WebsiteSettings = {
  bakeryName: "Breads & CakeStory",
  logoUrl: "/logo.png",
  contactNumber: "9272284438",
  whatsappNumber: "8999880895",
  email: "info@breadsandcakestory.com",
  address: "Bharti vidyapeth dattangr Rd tiranga chowk, opp.Shreeji pure veg Ambegaon pune-46",
  businessHours: "10.30 am to 11.00 pm",
  heroTitle: "Baking Luxury Stories in Every Slice",
  heroSubtitle: "Handcrafted cakes, custom themed creations, and premium ingredients tailored for your most exquisite celebrations."
};

const defaultGallery: string[] = [
  '/images/cake_birthday_1.png',
  '/images/cake_birthday_2.png',
  '/images/cake_anniversary_1.png',
  '/images/cake_anniversary_2.png',
  '/images/cake_themed_1.png',
  '/images/cake_themed_2.png',
  '/images/cake_themed_3.png',
  '/images/cake_birthday_3.png'
];

const defaultReviews: Review[] = [
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [gallery, setGallery] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from API endpoints on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resProducts, resOrders, resSettings, resReviews, resGallery] = await Promise.all([
          fetch('/api/products').then((res) => res.json()),
          fetch('/api/orders').then((res) => res.json()),
          fetch('/api/settings').then((res) => res.json()),
          fetch('/api/reviews').then((res) => res.json()),
          fetch('/api/gallery').then((res) => res.json())
        ]);

        if (Array.isArray(resProducts)) setProducts(resProducts);
        if (Array.isArray(resOrders)) setOrders(resOrders);
        if (resSettings && typeof resSettings === 'object') setSettings(resSettings);
        if (Array.isArray(resReviews)) setReviews(resReviews);
        if (Array.isArray(resGallery)) setGallery(resGallery);
      } catch (err) {
        console.error("Error loading database data", err);
      } finally {
        // Retrieve cart from local storage
        const storedCart = localStorage.getItem('bac_cart');
        if (storedCart) {
          try {
            setCart(JSON.parse(storedCart));
          } catch (e) {
            console.error("Error parsing cart from local storage", e);
          }
        }
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Save changes to local storage only for cart
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('bac_cart', JSON.stringify(cart));
  }, [cart, isLoaded]);

  // Cart operations (purely local/client side)
  const addToCart = (product: Product, quantity: number, weight: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.weight === weight
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, quantity, weight }];
    });
  };

  const updateCartQuantity = (productId: string, weight: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.weight === weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, weight: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.weight === weight))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Base price is for 0.5kg.
      // Scaling factor: 0.5kg -> 1.0x, 1kg -> 1.8x, 2kg -> 3.2x, etc.
      let multiplier = 1;
      if (item.weight === 1) multiplier = 1.8;
      else if (item.weight === 2) multiplier = 3.2;
      else if (item.weight > 2) multiplier = item.weight * 1.5;
      
      const itemPrice = Math.round(item.product.price * multiplier);
      return total + itemPrice * item.quantity;
    }, 0);
  };

  // Orders operations
  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Pending'
    };
    setOrders((prev) => [newOrder, ...prev]);

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch((err) => console.error("Error creating order on server:", err));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch((err) => console.error("Error updating order status on server:", err));
  };

  const updateOrderTotal = (orderId: string, total: number) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, total } : order))
    );

    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total })
    }).catch((err) => console.error("Error updating order total on server:", err));
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));

    fetch(`/api/orders/${orderId}`, {
      method: 'DELETE'
    }).catch((err) => console.error("Error deleting order on server:", err));
  };

  // Products operations
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 5.0,
      reviewsCount: 0
    };
    setProducts((prev) => [...prev, newProduct]);

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch((err) => console.error("Error creating product on server:", err));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
    );

    fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    }).catch((err) => console.error("Error updating product on server:", err));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));

    fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    }).catch((err) => console.error("Error deleting product on server:", err));
  };

  // Settings
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch((err) => console.error("Error updating settings on server:", err));
      
      return updated;
    });
  };

  // Gallery management
  const addGalleryImage = (imageUrl: string) => {
    setGallery((prev) => [imageUrl, ...prev]);

    fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    }).catch((err) => console.error("Error adding gallery image on server:", err));
  };

  const removeGalleryImage = (imageUrl: string) => {
    setGallery((prev) => prev.filter((img) => img !== imageUrl));

    fetch(`/api/gallery?imageUrl=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE'
    }).catch((err) => console.error("Error deleting gallery image on server:", err));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
    setReviews((prev) => [newReview, ...prev]);

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    }).catch((err) => console.error("Error creating review on server:", err));
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));

    fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    }).catch((err) => console.error("Error deleting review on server:", err));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        orders,
        settings,
        gallery,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        addOrder,
        updateOrderStatus,
        updateOrderTotal,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        addGalleryImage,
        removeGalleryImage,
        reviews,
        addReview,
        deleteReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
