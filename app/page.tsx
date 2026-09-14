'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Sparkles, Star, ArrowRight, X, Plus, Minus, MessageCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

interface Product {
  id: string;
  name: string;
  category: string;
  priceNum: number;
  price: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // কাস্টমার চেকআউট ফর্ম স্টেট
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // আপনার WhatsApp নম্বর এখানে দিন (যেমন: 88017XXXXXXXX)
  const WHATSAPP_NUMBER = "8801700000000"; 

  const categories = [
    "All Products",
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList: Product[] = [];
        querySnapshot.forEach((doc) => {
          productList.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        if (productList.length === 0) {
          setProducts([
            { id: '1', name: 'Premium Cotton Panjabi', category: "Men's Wear (মেনস ওয়্যার)", priceNum: 1850, price: 'Tk 1,850', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60' },
            { id: '2', name: 'Jamdani Silk Saree', category: "Women's Wear (উমেনস ওয়্যার)", priceNum: 4500, price: 'Tk 4,500', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60' },
            { id: '3', name: 'Executive Winter Jacket', category: "Winter Jacket (উইন্টার জ্যাকেট)", priceNum: 3200, price: 'Tk 3,200', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60' },
          ]);
        } else {
          setProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, {...product, quantity: 1}];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? {...item, quantity: newQty} : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All Products" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'low-high') return a.priceNum - b.priceNum;
    if (sortBy === 'high-low') return b.priceNum - a.priceNum;
    return 0;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);

  // WhatsApp Checkout Handler
  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName || !customerPhone || !customerAddress) {
      alert("দয়া করে আপনার নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন।");
      return;
    }

    let message = `🛒 *New Order from Sohoj Life*\n\n`;
    message += `👤 *Customer Name:* ${customerName}\n`;
    message += `📞 *Phone:* ${customerPhone}\n`;
    message += `📍 *Address:* ${customerAddress}\n\n`;
    message += `📦 *Order Details:*\n`;

    cart.forEach((item, index) => {
      message += `${index +1}. ${item.name} (${item.price}) x ${item.quantity} = Tk ${item.priceNum * item.quantity}\n`;
    });

    message += `\n💰 *Total Amount:* Tk ${cartTotal.toLocaleString()}\n`;
    message += `🚚 *Payment Method:* Cash on Delivery`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 py-2.5 px-4 text-center text-xs font-black tracking-wider shadow-lg flex items-center justify-center gap-2">
        <Sparkles size={16} /> <span>LUXURY LIFESTYLE STORE — Free Shipping on Orders Over Tk 2,000!</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-xl shadow-amber-500/20 border border-amber-300/40">
              SL
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">Sohoj <span className="text-amber-400">Life</span></span>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase font-bold">Premium Collections</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search luxury panjabi, sarees, jackets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-white pl-11 pr-4 py-3 rounded-2xl border border-slate-800 focus:border-amber-400/80 focus:outline-none focus:ring-4 focus:ring-amber-400/10 text-sm transition shadow-inner"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl border border-slate-800 flex items-center gap-2.5 transition shadow-xl text-sm font-bold group"
            >
              <ShoppingBag size={18} className="text-amber-400 group-hover:scale-110 transition" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <Link 
              href="/admin" 
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 px-4.5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition shadow-xl shadow-amber-500/20 border border-amber-300/40"
            >
              Admin Area
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-slate-800 p-8 md:p-14 shadow-2xl mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-xl relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-5 shadow-sm">
              <Sparkles size={14} /> NEW SEASON EXCLUSIVE 2026
            </span>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-5 leading-tight">
              Elevate Your Style With <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Luxury Essentials</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed font-medium">
              Discover our exclusive curated collection of premium traditional wear, executive winter outfits, and elite lifestyle products.
            </p>
            <button 
              onClick={() => {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-7 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2.5 hover:from-amber-300 hover:to-yellow-400 transition shadow-xl shadow-amber-500/25 border border-amber-300/40"
            >
              Explore Collection <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Categories & Filter Bar */}
        <div id="products-section" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-4">
          <div className="flex items-center gap-2.5 overflow-x-auto w-full pb-3 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-3 rounded-2xl text-xs font-bold transition shadow-md ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-amber-500/30 border border-amber-300/50' 
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-amber-400 font-bold"
            >
              <option value="featured">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-900/50 rounded-3xl h-88 animate-pulse border border-slate-800/50"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm font-semibold">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-slate-900/90 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-slate-800 shadow-lg">
                      {product.category.split(' ')[0]}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 mb-1.5 group-hover:text-amber-400 transition">{product.name}</h3>
                    <p className="text-base font-black text-amber-400">{product.price}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-slate-800 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-slate-950 text-slate-200 py-3.5 rounded-2xl font-black text-xs transition duration-300 flex items-center justify-center gap-2 shadow-inner border border-slate-700/60"
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer Modal with WhatsApp Checkout Form */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <ShoppingBag size={18} className="text-amber-400" /> Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800">
                  <X size={18} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-24">
                  <ShoppingBag size={52} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-slate-400 text-sm font-semibold">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3.5 my-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                          <p className="text-amber-400 text-xs font-bold mt-0.5">{item.price}</p>
                          <div className="flex items-center gap-2.5 mt-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-black text-white w-5 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information Form for WhatsApp Order */}
                  <form onSubmit={handleWhatsAppCheckout} className="space-y-4 pt-4 border-t border-slate-800 text-xs">
                    <h3 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Customer Checkout Information</h3>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Md. Hasibul Hasan" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Mobile Number</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. 017XXXXXXXX" 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Delivery Address</label>
                      <textarea 
                        placeholder="e.g. House 12, Road 5, Tangail / Dhaka" 
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none text-xs font-medium resize-none"
                        required
                      ></textarea>
                    </div>

                    <div className="pt-2 flex justify-between items-center font-bold text-sm">
                      <span className="text-slate-400">Total Amount:</span>
                      <span className="text-amber-400 text-base">Tk {cartTotal.toLocaleString()}</span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition shadow-xl shadow-emerald-500/20 border border-emerald-300/40"
                    >
                      <MessageCircle size={18} fill="currentColor" /> Order via WhatsApp <ExternalLink size={14} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
