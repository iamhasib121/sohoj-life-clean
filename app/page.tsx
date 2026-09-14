'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ShieldCheck, Sparkles, Star, ArrowRight, X, Plus, Minus, Trash2 } from 'lucide-react';
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

  const categories = [
    "All Products",
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  // Fetch products from Firebase Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList: Product[] = [];
        querySnapshot.forEach((doc) => {
          productList.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        // যদি ফায়ারবেসে প্রোডাক্ট না থাকে, তবে কিছু ডেমো প্রিমিয়াম প্রোডাক্ট দেখাবে
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
    if (sortBy === 'high-low') return b.priceNum - b.priceNum;
    return 0;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 py-2 px-4 text-center text-xs font-bold tracking-wide shadow-md flex items-center justify-center gap-2">
        <Sparkles size={15} /> <span>Discover Premium Quality Lifestyle Products — Free Shipping on Orders Over Tk 2,000!</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              SL
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white">Sohoj <span className="text-amber-400">Life</span></span>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Your Trusted Lifestyle Store</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search premium products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-white pl-11 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 transition shadow-lg text-sm font-semibold"
            >
              <ShoppingBag size={18} className="text-amber-400" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <Link 
              href="/admin" 
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide uppercase transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              Admin Area
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 p-8 md:p-12 shadow-2xl mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-xl relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
              <Sparkles size={14} /> EXCLUSIVE COLLECTION
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Discover Premium Quality <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Lifestyle Products</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
              Explore our exclusive collection of traditional wear, winter outfits, and daily essentials crafted with perfection.
            </p>
            <button 
              onClick={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:from-amber-300 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20"
            >
              Shop Now <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Categories & Filter Bar */}
        <div id="products-section" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-500/20 shadow-md' 
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-amber-500/60"
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
              <div key={n} className="bg-slate-900/50 rounded-3xl h-80 animate-pulse border border-slate-800/50"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-slate-900/80 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-800">
                      {product.category.split(' ')[0]}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 mb-1 group-hover:text-amber-400 transition">{product.name}</h3>
                    <p className="text-base font-extrabold text-amber-400">{product.price}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 py-3 rounded-xl font-bold text-xs transition duration-300 flex items-center justify-center gap-2 shadow-inner"
                  >
                    <ShoppingBag size={15} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={18} className="text-amber-400" /> Your Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag size={48} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-slate-400 text-sm">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4 mt-6 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                        <p className="text-amber-400 text-xs font-semibold mt-0.5">{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-white w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-amber-400 text-base">Tk {cartTotal.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    alert("Order placed successfully! Thank you for shopping with Sohoj Life.");
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 py-3.5 rounded-xl font-extrabold text-sm hover:from-amber-300 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
