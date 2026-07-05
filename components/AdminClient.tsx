"use client";

import React, { useState, useEffect } from 'react';
import { useApp, Product, Order } from '@/context/AppContext';
import { KeyRound, LogOut, LayoutDashboard, ShoppingCart, Cake, Settings, Image as ImageIcon, Plus, Edit3, Trash2, Search, Download, Save, Check } from 'lucide-react';

export default function AdminClient() {
  const {
    products,
    orders,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
    updateSettings
  } = useApp();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active admin section
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');

  // Search & Filters inside Admin
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'>('All');

  // Modal / Form States
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Birthday' as Product['category'],
    image: ''
  });
  
  // Image Upload helper converting to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'product' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (field === 'product') {
        setProductForm(prev => ({ ...prev, image: base64String }));
      } else if (field === 'logo') {
        updateSettings({ logoUrl: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
      // Save session
      sessionStorage.setItem('bac_authenticated', 'true');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bac_authenticated');
  };

  // Auto-login from session
  useEffect(() => {
    const auth = sessionStorage.getItem('bac_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Product CRUD submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.description) {
      alert("Please fill in all required fields.");
      return;
    }

    const priceNum = parseFloat(productForm.price);
    const imgUrl = productForm.image || '/images/cake_birthday_1.png';

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: productForm.name,
        description: productForm.description,
        price: priceNum,
        category: productForm.category,
        image: imgUrl
      });
    } else {
      addProduct({
        name: productForm.name,
        description: productForm.description,
        price: priceNum,
        category: productForm.category,
        image: imgUrl,
        images: [imgUrl]
      });
    }

    setIsProductFormOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', category: 'Birthday', image: '' });
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      category: prod.category,
      image: prod.image
    });
    setIsProductFormOpen(true);
  };

  // Settings update submit
  const [settingsForm, setSettingsForm] = useState({
    bakeryName: '',
    contactNumber: '',
    whatsappNumber: '',
    email: '',
    address: '',
    businessHours: '',
    heroTitle: '',
    heroSubtitle: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        bakeryName: settings.bakeryName,
        contactNumber: settings.contactNumber,
        whatsappNumber: settings.whatsappNumber,
        email: settings.email,
        address: settings.address,
        businessHours: settings.businessHours,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle
      });
    }
  }, [settings]);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // CSV Export orders helper
  const exportOrdersCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Customer Name,Mobile,WhatsApp,Address,Landmark,Total,Status,Date,Ordered Items\n";

    orders.forEach(order => {
      const itemsDesc = order.items.map(i => `${i.name} (Qty:${i.quantity} Wt:${i.weight}kg)`).join(" | ");
      csvContent += `"${order.id}","${order.customerName}","${order.mobile}","${order.whatsapp}","${order.address}","${order.landmark}",${order.total},"${order.status}","${order.date}","${itemsDesc}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Breads_CakeStory_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.mobile.includes(orderSearchQuery) ||
      order.id.includes(orderSearchQuery);
      
    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalEarnings = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-cream-200 shadow-premium max-w-sm w-full font-sans">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-luxury-champagne rounded-full flex items-center justify-center mx-auto mb-4 border border-luxury-gold/20">
              <KeyRound className="w-6 h-6 text-luxury-gold" />
            </div>
            <h2 className="heading-luxury text-2xl font-bold text-cocoa-900">Owner Portal</h2>
            <p className="text-xs text-cocoa-100 mt-1">Please enter credentials to manage your store.</p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200 mb-4 font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-cocoa-500 mb-1">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                placeholder="Username (admin)"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-cocoa-500 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full text-sm py-2.5 px-3 rounded-lg border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold-gradient text-white py-3 rounded-xl font-bold hover:opacity-95 shadow-gold-glow transition-all active:scale-98 text-sm mt-2"
            >
              Sign In
            </button>
          </form>
          
          <div className="text-center mt-6">
            <a href="/" className="text-[10px] text-cocoa-100 hover:text-luxury-gold uppercase font-bold">
              ← Return to Main Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Sidebar Admin Navigation */}
      <aside className="w-full md:w-64 bg-cocoa-900 text-cream-50 border-r border-cocoa-800 flex flex-col justify-between p-6">
        <div>
          {/* Logo Section */}
          <div className="flex items-center gap-3 border-b border-cocoa-800 pb-6 mb-6">
            <div className="relative w-10 h-10 bg-white rounded-full p-1 overflow-hidden flex-shrink-0">
              <img src={settings.logoUrl || '/logo.png'} alt="Admin Logo" className="object-contain w-full h-full" />
            </div>
            <div>
              <h3 className="heading-luxury text-sm font-bold text-luxury-gold truncate max-w-[140px]">{settings.bakeryName}</h3>
              <span className="text-[8px] uppercase tracking-wider text-cocoa-100 font-semibold">Store Manager</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products Catalog', icon: Cake },
              { id: 'orders', label: 'Order Register', icon: ShoppingCart },
              { id: 'settings', label: 'Website settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-luxury-gold text-white shadow-premium'
                      : 'text-cocoa-100 hover:bg-cocoa-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-cocoa-100 hover:bg-red-950 hover:text-red-300 transition-colors mt-8"
        >
          <LogOut className="w-4 h-4" />
          Logout Manager
        </button>
      </aside>

      {/* Main Admin Dashboard Work Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 font-sans">
            <div>
              <h2 className="heading-luxury text-3xl font-bold text-cocoa-900">Dashboard Overview</h2>
              <p className="text-xs text-cocoa-500 font-normal">Monitor your sales, catalog items, and pending delivery orders.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Total Sales Revenue', value: `₹${totalEarnings}`, color: 'border-l-green-600', sub: 'Completed orders sum' },
                { title: 'Total Products', value: products.length, color: 'border-l-luxury-gold', sub: 'Active catalog items' },
                { title: 'Pending Orders', value: pendingCount, color: 'border-l-amber-500', sub: 'Awaiting confirmation' },
                { title: 'Completed Orders', value: completedCount, color: 'border-l-blue-600', sub: 'Completed delivery logs' }
              ].map((stat, i) => (
                <div key={i} className={`bg-white p-5 rounded-2xl border border-cream-200 border-l-4 ${stat.color} shadow-sm`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cocoa-500 block mb-1">{stat.title}</span>
                  <span className="text-2xl font-extrabold text-cocoa-900 block leading-tight">{stat.value}</span>
                  <span className="text-[9px] text-cocoa-100 mt-1 block">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* Recent Orders log */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-cream-100 pb-4 mb-4">
                <h3 className="heading-luxury text-base font-bold text-cocoa-900">Recent Pending Inquiries</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-luxury-gold hover:text-luxury-golddark"
                >
                  Manage All Orders →
                </button>
              </div>

              {orders.filter(o => o.status === 'Pending').length === 0 ? (
                <p className="text-xs text-cocoa-100 text-center py-6">No new pending order inquiries found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-cream-100 text-cocoa-500 uppercase tracking-wider font-bold">
                        <th className="py-2.5">ID</th>
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Items</th>
                        <th className="py-2.5">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100 font-medium">
                      {orders
                        .filter(o => o.status === 'Pending')
                        .slice(0, 5)
                        .map((order) => (
                          <tr key={order.id} className="text-cocoa-900">
                            <td className="py-3">#{order.id}</td>
                            <td className="py-3">
                              <div>{order.customerName}</div>
                              <div className="text-[10px] text-cocoa-100">{order.mobile}</div>
                            </td>
                            <td className="py-3">{order.date}</td>
                            <td className="py-3 truncate max-w-[200px]">
                              {order.items.map(item => `${item.name} (${item.weight}kg x${item.quantity})`).join(", ")}
                            </td>
                            <td className="py-3 font-bold">₹{order.total}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCTS CATALOG (CRUD) */}
        {activeTab === 'products' && (
          <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="heading-luxury text-3xl font-bold text-cocoa-900">Products Catalog</h2>
                <p className="text-xs text-cocoa-500 font-normal">Add, edit, or delete items from the online store.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', description: '', price: '', category: 'Birthday', image: '' });
                  setIsProductFormOpen(true);
                }}
                className="bg-gold-gradient hover:opacity-95 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-gold-glow text-xs"
              >
                <Plus className="w-4 h-4" />
                Add New Cake
              </button>
            </div>

            {/* Catalog list table */}
            <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-cream-50 text-cocoa-500 uppercase tracking-wider font-bold border-b border-cream-100">
                    <tr>
                      <th className="p-4 w-16">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Base Price (0.5kg)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100 font-medium text-cocoa-900">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-cream-50/40">
                        <td className="p-4">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-cream-100 bg-cream-50">
                            <img src={prod.image} alt={prod.name} className="object-cover w-full h-full" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-cocoa-900">{prod.name}</div>
                          <div className="text-[10px] text-cocoa-100 max-w-[250px] truncate">{prod.description}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-luxury-champagne text-luxury-gold font-bold uppercase text-[9px] rounded-full">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold">₹{prod.price}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="p-2 bg-cream-100 hover:bg-luxury-champagne text-cocoa-500 hover:text-luxury-gold rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { if(confirm("Are you sure you want to delete this product?")) deleteProduct(prod.id); }}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product form Modal overlay */}
            {isProductFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-cocoa-900/60 backdrop-blur-sm" onClick={() => setIsProductFormOpen(false)} />
                
                <div className="bg-cream-50 rounded-2xl border border-cream-200 max-w-md w-full p-6 shadow-premium z-10 space-y-4">
                  <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                    <h3 className="heading-luxury text-lg font-bold text-cocoa-900">
                      {editingProduct ? 'Edit Cake Details' : 'Add New Cake to Store'}
                    </h3>
                    <button type="button" onClick={() => setIsProductFormOpen(false)} className="text-cocoa-100 hover:text-cocoa-500 font-bold text-sm">✕</button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Cake Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full text-sm py-2 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                        placeholder="e.g. Belgian Truffle Delight"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as any }))}
                          className="w-full text-xs py-2 px-2 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold cursor-pointer"
                        >
                          <option value="Birthday">Birthday Cakes</option>
                          <option value="Anniversary">Anniversary Cakes</option>
                          <option value="Themed">Themed Cakes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Base Price (0.5kg)</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full text-sm py-2 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                          placeholder="e.g. 1500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full text-sm py-2 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium resize-none"
                        placeholder="Detail features, frosting notes, chocolate content..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Cake Cover Photo</label>
                      <div className="flex items-center gap-3 mt-1.5">
                        {productForm.image && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-cream-200">
                            <img src={productForm.image} alt="Form preview" className="object-cover w-full h-full" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'product')}
                          className="w-full text-xs text-cocoa-100 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-luxury-champagne file:text-luxury-gold hover:file:opacity-90 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="border-t border-cream-100 pt-4 mt-6 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsProductFormOpen(false)}
                        className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-900 rounded-xl font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gold-gradient text-white px-5 py-2 rounded-xl font-bold shadow-gold-glow"
                      >
                        {editingProduct ? 'Save Changes' : 'Publish Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: ORDER REGISTER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="heading-luxury text-3xl font-bold text-cocoa-900">Order Register</h2>
                <p className="text-xs text-cocoa-500 font-normal">Manage orders received and update preparation status logs.</p>
              </div>
              <button
                onClick={exportOrdersCSV}
                className="bg-cocoa-500 hover:bg-cocoa-800 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-xs shadow-premium active:scale-95"
              >
                <Download className="w-4 h-4 text-luxury-gold" />
                Export to CSV Report
              </button>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-cream-200">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full text-xs py-2.5 pl-9 pr-3 border border-cream-200 focus:outline-none focus:border-luxury-gold input-premium rounded-lg"
                  placeholder="Search by customer name, mobile, or Order ID..."
                />
                <Search className="w-4 h-4 text-cocoa-100 absolute left-3 top-3" />
              </div>

              <div className="w-full sm:w-48">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className="w-full text-xs py-2.5 px-3 border border-cream-200 focus:outline-none focus:border-luxury-gold rounded-lg cursor-pointer text-cocoa-900 font-medium"
                >
                  <option value="All">All Status Logs</option>
                  <option value="Pending">Pending Inquiries</option>
                  <option value="In Progress">In Progress / Baking</option>
                  <option value="Completed">Completed / Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Order Log list */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-cream-200 py-16 text-center shadow-sm">
                <p className="text-sm text-cocoa-100">No order logs found matching the filter queries.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-sm"
                  >
                    <div className="bg-cream-50/50 p-4 border-b border-cream-100 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-cocoa-900">Order ID: #{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            order.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-200' :
                            order.status === 'Pending' ? 'bg-amber-50 text-amber-500 border border-amber-200' :
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-500 border border-red-200' :
                            'bg-blue-50 text-blue-500 border border-blue-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-cocoa-100 font-medium mt-0.5">Placed: {order.date}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-cocoa-100 font-bold uppercase text-[9px] tracking-wider">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="text-xs py-1.5 px-2 bg-white border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold cursor-pointer font-semibold text-cocoa-900"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => { if(confirm("Delete this order record permanently?")) deleteOrder(order.id); }}
                          className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Order Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-cocoa-500">
                      <div className="md:col-span-4 space-y-2 border-r border-cream-100 pr-4">
                        <h4 className="heading-luxury text-sm font-bold text-cocoa-900 mb-2">Customer Details</h4>
                        <div>
                          <span className="text-[10px] text-cocoa-100 block">Name</span>
                          <span className="font-bold text-cocoa-900">{order.customerName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-cocoa-100 block">Mobile</span>
                            <span className="font-semibold text-cocoa-900">{order.mobile}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-cocoa-100 block">WhatsApp</span>
                            <span className="font-semibold text-cocoa-900">{order.whatsapp}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-cocoa-100 block">Delivery Address</span>
                          <span className="font-semibold text-cocoa-900 leading-tight block">{order.address}</span>
                        </div>
                        {order.landmark && (
                          <div>
                            <span className="text-[10px] text-cocoa-100 block">Landmark</span>
                            <span className="font-semibold text-cocoa-900">{order.landmark}</span>
                          </div>
                        )}
                        {order.notes && (
                          <div className="bg-cream-50 p-2.5 rounded-lg border border-cream-200">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-cocoa-100 block">Notes/Instructions</span>
                            <span className="text-cocoa-900 font-medium italic mt-0.5 block">{order.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-8 space-y-3">
                        <h4 className="heading-luxury text-sm font-bold text-cocoa-900 mb-2">Ordered Cakes</h4>
                        <div className="space-y-2.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3.5 items-center justify-between border-b border-cream-100 pb-2.5 last:border-0 last:pb-0">
                              <div className="flex gap-2.5 items-center">
                                <div className="relative w-8 h-8 rounded overflow-hidden bg-cream-50 border border-cream-200">
                                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                  <span className="font-bold text-cocoa-900">{item.name}</span>
                                  <span className="text-[10px] text-cocoa-100 block mt-0.5">
                                    Weight: {item.weight} kg | Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <span className="font-bold text-cocoa-900">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-cream-200 pt-3 flex justify-between items-center bg-cream-50/50 p-3.5 rounded-xl">
                          <span className="text-sm font-bold text-cocoa-900">Grand Total Earned</span>
                          <span className="text-base font-extrabold text-green-700">₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: WEBSITE SETTINGS EDIT PANEL */}
        {activeTab === 'settings' && (
          <div className="space-y-6 font-sans">
            <div>
              <h2 className="heading-luxury text-3xl font-bold text-cocoa-900">Website Settings</h2>
              <p className="text-xs text-cocoa-500 font-normal">Change brand details, logos, social details, and hero section templates.</p>
            </div>

            <div className="bg-white rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSettingsSubmit} className="space-y-6 text-xs">
                <div className="space-y-4">
                  <h3 className="heading-luxury text-base font-bold text-cocoa-900 border-l-4 border-luxury-gold pl-2.5">
                    General Brand Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Bakery Name</label>
                      <input
                        type="text"
                        value={settingsForm.bakeryName}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, bakeryName: e.target.value }))}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Owner Contact Number</label>
                      <input
                        type="tel"
                        value={settingsForm.contactNumber}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Order WhatsApp Number</label>
                      <input
                        type="tel"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Support Email Address</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Complete Bakery Address</label>
                      <textarea
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                        rows={2}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Business Operating Hours</label>
                      <input
                        type="text"
                        value={settingsForm.businessHours}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, businessHours: e.target.value }))}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Store Brand Logo</label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white p-1 shadow-md border border-cream-200 flex-shrink-0 flex items-center justify-center">
                        <img src={settings.logoUrl || '/logo.png'} alt="Bakery Logo" className="object-contain w-full h-full" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logo')}
                          className="w-full text-xs text-cocoa-100 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-luxury-champagne file:text-luxury-gold hover:file:opacity-90 cursor-pointer"
                        />
                        <span className="text-[9px] text-cocoa-100 italic">Prepares logo for header layout. Recommended: square PNG with transparent background.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-cream-100 pt-6">
                  <h3 className="heading-luxury text-base font-bold text-cocoa-900 border-l-4 border-luxury-gold pl-2.5">
                    Hero Section Headlines
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Hero Main Title</label>
                      <input
                        type="text"
                        value={settingsForm.heroTitle}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-cocoa-500 uppercase tracking-wider mb-1">Hero Subtitle</label>
                      <textarea
                        value={settingsForm.heroSubtitle}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                        rows={2}
                        className="w-full text-sm py-2.5 px-3 border border-cream-200 rounded-lg focus:outline-none focus:border-luxury-gold input-premium resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-cream-100 pt-6 flex items-center justify-between">
                  <div>
                    {settingsSaved && (
                      <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                        <Check className="w-4 h-4" />
                        Settings saved and synced to storefront!
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-gold-gradient hover:opacity-95 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 text-xs shadow-gold-glow active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    Save Website Configurations
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}
