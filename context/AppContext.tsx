"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Base price for 0.5kg
  image: string;
  images: string[];
  category: 'Birthday' | 'Anniversary' | 'Themed';
  rating: number;
  reviewsCount: number;
}

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
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
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

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Golden Glamour Chocolate Cake',
    description: 'Indulgent Belgian chocolate sponge layers with rich ganache, gold dust, and edible pearls. The ultimate celebratory showstopper.',
    price: 1800,
    image: '/images/cake_birthday_1.png',
    images: ['/images/cake_birthday_1.png', '/images/cake_birthday_3.png'],
    category: 'Birthday',
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: 'prod-2',
    name: 'Berry Macaron Gradient Cake',
    description: 'Whimsical pastel gradients of vanilla buttercream, crowned with gold-brushed macarons, fresh strawberries, and meringue drops.',
    price: 1500,
    image: '/images/cake_birthday_2.png',
    images: ['/images/cake_birthday_2.png', '/images/cake_themed_3.png'],
    category: 'Birthday',
    rating: 4.8,
    reviewsCount: 38
  },
  {
    id: 'prod-3',
    name: 'Royal Red Velvet Bloom Cake',
    description: 'Layers of rich crimson cocoa sponge paired with thick cream cheese frosting, decorated with handmade edible red roses and chocolate curls.',
    price: 1950,
    image: '/images/cake_anniversary_2.png',
    images: ['/images/cake_anniversary_2.png', '/images/cake_anniversary_1.png'],
    category: 'Anniversary',
    rating: 5.0,
    reviewsCount: 57
  },
  {
    id: 'prod-4',
    name: 'Champagne Gold Rose Cake',
    description: 'Epitome of elegance. Luxurious ivory frosting with shimmering champagne gold leaf flakes and white sugar rose bouquets.',
    price: 2200,
    image: '/images/cake_anniversary_1.png',
    images: ['/images/cake_anniversary_1.png', '/images/cake_themed_3.png'],
    category: 'Anniversary',
    rating: 4.9,
    reviewsCount: 29
  },
  {
    id: 'prod-5',
    name: 'Enchanted Forest Bark Cake',
    description: 'Hand-sculpted rustic chocolate bark casing filled with decadent truffle layers, decorated with edible moss and meringue mushrooms.',
    price: 2400,
    image: '/images/cake_themed_1.png',
    images: ['/images/cake_themed_1.png', '/images/cake_birthday_1.png'],
    category: 'Themed',
    rating: 4.7,
    reviewsCount: 18
  },
  {
    id: 'prod-6',
    name: 'Galaxy Cosmic Mirror Cake',
    description: 'Flawless glossy mirror glaze reflecting deep cosmos purples and teals, featuring white chocolate planets and hand-painted stardust.',
    price: 2600,
    image: '/images/cake_themed_2.png',
    images: ['/images/cake_themed_2.png'],
    category: 'Themed',
    rating: 5.0,
    reviewsCount: 24
  },
  {
    id: 'prod-7',
    name: 'Gold Splash Macaron Cake',
    description: 'Modern luxury design with gold drips cascading down smooth vanilla bean frosting, topped with gold leaf macarons and chocolate shards.',
    price: 2100,
    image: '/images/cake_themed_3.png',
    images: ['/images/cake_themed_3.png', '/images/cake_birthday_2.png'],
    category: 'Themed',
    rating: 4.9,
    reviewsCount: 31
  },
  {
    id: 'prod-8',
    name: 'Royal Chocolate Truffle Cake',
    description: 'Double-chocolate sponge infused with chocolate liqueur syrup, finished with a dark mirror glaze and luxury truffles.',
    price: 1650,
    image: '/images/cake_birthday_3.png',
    images: ['/images/cake_birthday_3.png', '/images/cake_birthday_1.png'],
    category: 'Birthday',
    rating: 4.8,
    reviewsCount: 49
  }
];

const defaultSettings: WebsiteSettings = {
  bakeryName: "Breads & CakeStory",
  logoUrl: "/logo.png",
  contactNumber: "9272284438",
  whatsappNumber: "9272284438",
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

  // Load from local storage
  useEffect(() => {
    const storedProducts = localStorage.getItem('bac_products');
    const storedOrders = localStorage.getItem('bac_orders');
    const storedSettings = localStorage.getItem('bac_settings');
    const storedGallery = localStorage.getItem('bac_gallery');
    const storedCart = localStorage.getItem('bac_cart');

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    else {
      setProducts(defaultProducts);
      localStorage.setItem('bac_products', JSON.stringify(defaultProducts));
    }

    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      if (parsed.bakeryName === "Breads& CakeStory") {
        parsed.bakeryName = "Breads & CakeStory";
        localStorage.setItem('bac_settings', JSON.stringify(parsed));
      }
      setSettings(parsed);
    }
    if (storedGallery) setGallery(JSON.parse(storedGallery));
    else {
      setGallery(defaultGallery);
      localStorage.setItem('bac_gallery', JSON.stringify(defaultGallery));
    }

    const storedReviews = localStorage.getItem('bac_reviews');
    if (storedReviews) setReviews(JSON.parse(storedReviews));
    else {
      setReviews(defaultReviews);
      localStorage.setItem('bac_reviews', JSON.stringify(defaultReviews));
    }

    if (storedCart) setCart(JSON.parse(storedCart));
    
    setIsLoaded(true);
  }, []);

  // Save changes to local storage when state updates
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('bac_products', JSON.stringify(products));
  }, [products, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('bac_orders', JSON.stringify(orders));
  }, [orders, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('bac_settings', JSON.stringify(settings));
  }, [settings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('bac_gallery', JSON.stringify(gallery));
  }, [gallery, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('bac_cart', JSON.stringify(cart));
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('bac_reviews', JSON.stringify(reviews));
  }, [reviews, isLoaded]);

  // Cart operations
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
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
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
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== productId));
    // Also remove from cart if present
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Settings
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Gallery management
  const addGalleryImage = (imageUrl: string) => {
    setGallery((prev) => [imageUrl, ...prev]);
  };

  const removeGalleryImage = (imageUrl: string) => {
    setGallery((prev) => prev.filter((img) => img !== imageUrl));
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
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
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
