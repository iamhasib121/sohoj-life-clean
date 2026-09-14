'use client';

import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, SlidersHorizontal, ArrowRight, ShieldCheck, Truck, Headphones, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

export default function StoreFront() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortOrder, setSortOrder] = useState("default"); // default, low-high, high-low
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [notification, setNotification] = useState<string | null>(null);

  const showPopup = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const categories = [
    { name: "All Products", icon: Sparkles },
    { name: "Men's Wear (মেনস ওয়্যার)", icon: Sparkles },
    { name: "Women's Wear (উমেনস ওয়্যার)", icon: Sparkles },
    { name: "Kids' Wear (কিডস ওয়্যার)", icon: Sparkles },
    { name: "Winter Jacket (উইন্টার জ্যাকেট)", icon: Sparkles },
    { name: "Food (ফুড)", icon: Sparkles }
  ];

  const [products] = useState([
    { id: 1, name: "Premium Cotton Punjabi", category: "Men's Wear (মেনস ওয়্যার)", priceNum: 1850, price: "Tk 1,850", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=500&auto=format&fit=crop" },
    { id: 2, name: "Slim Fit Formal Shirt", category: "Men's Wear (মেনস ওয়্যার)", priceNum: 1200, price: "Tk 1,200", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=500&auto=format&fit=crop" },
    { id: 3, name: "Graphic Print T-Shirt", category: "Men's Wear (মেনস ওয়্যার)", priceNum: 650, price: "Tk 650", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500&auto=format&fit=crop" },
    { id: 4, name: "Jamdani Silk Saree", category: "Women's Wear (উমেনস ওয়্যার)", priceNum: 4500, price: "Tk 4,500", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop" },
    { id: 5, name: "Embroidered Salwar Kameez", category: "Women's Wear (উমেনস ওয়্যার)", priceNum: 2800, price: "Tk 2,800", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop" },
    { id: 6, name: "Winter Warm Jacket", category: "Winter Jacket (উইন্টার জ্যাকেট)", priceNum: 3200, price: "Tk 3,200", image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop" }
  ]);

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => selectedCategory === "All Products" || p.category === selectedCategory);
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-high") return a.priceNum - b.priceNum;
    if (sortOrder === "high-low") return b.priceNum - a.priceNum;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#581c23] text-white font-sans flex flex-col justify-between">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-4 z-50 bg-[#f5d77f] text-[#581c23] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold transition-all">
          <Check size={16} />
          <span>{notification}</span>
        </div>
      )}

      <div>
        {/* Top Header */}
        <header className="border-b border-white/10 bg-[#4a151b]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
            
            {/* Logo Component */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f5d77f] to-[#d4af37] flex items-center justify-center shadow-lg shadow-black/30">
                <span className="text-[#581c23] font-black text-xl tracking-wider">SL</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-wide text-[#f5d77f] flex items-center gap-1.5">
                  Sohoj Life
                </h1>
                <p className="text-[10px] text-gray-300 tracking-wider uppercase">Your Trusted Lifestyle Store</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:flex items-center relative">
              <Search size={16} className="absolute left-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-[#3b1014] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#f5d77f] transition"
              />
            </div>

            {/* Actions & Admin Link */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setWishlistCount(prev => prev + 1); showPopup("Added to Wishlist!"); }}
                className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition"
              >
                <Heart size={18} className="text-[#f5d77f]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { setCartCount(prev => prev + 1); showPopup("Added to Cart!"); }}
                className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition"
              >
                <ShoppingBag size={18} className="text-[#f5d77f]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#f5d77f] text-[#581c23] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <Link href="/admin" className="bg-[#f5d77f] hover:bg-[#ebd070] text-[#581c23] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md">
                Admin Area
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Promotional Banner */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-gradient-to-r from-[#4a151b] via-[#3b1014] to-[#4a151b] border border-[#f5d77f]/20 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#f5d77f]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-lg z-10">
              <span className="bg-[#f5d77f]/20 text-[#f5d77f] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Special Eid & Winter Offer
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#f5d77f] mt-3 mb-2">
                Discover Premium Quality Lifestyle Products
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Explore our exclusive collection of traditional wear, winter outfits, and daily essentials crafted with perfection.
              </p>
              <button 
                onClick={() => showPopup("Exploring collections...")}
                className="bg-[#f5d77f] text-[#581c23] px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-[#ebd070] transition shadow-lg"
              >
                Shop Now <ArrowRight size={14} />
              </button>
            </div>
            <div className="mt-6 md:mt-0 z-10 hidden md:block">
              <div className="w-48 h-36 rounded-xl overflow-hidden border-2 border-[#f5d77f]/30 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=400&auto=format&fit=crop" alt="Banner" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter & Price Sort Bar */}
        <section className="max-w-7xl mx-auto px-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#4a151b]/40 p-4 rounded-2xl border border-white/10">
            
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
                      isSelected 
                        ? 'bg-[#f5d77f] text-[#581c23] border-[#f5d77f] shadow-md' 
                        : 'bg-[#3b1014] text-gray-300 border-white/10 hover:bg-[#4a151b]'
                    }`}
                  >
                    <IconComponent size={14} className={isSelected ? 'text-[#581c23]' : 'text-[#f5d77f]'} />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Price Sorting Options */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <SlidersHorizontal size={14} className="text-[#f5d77f]" />
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#3b1014] text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#f5d77f]"
              >
                <option value="default">Sort by: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

          </div>
        </section>

        {/* Product Grid with Hover Effects */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((p) => (
              <div 
                key={p.id} 
                className="bg-[#4a151b] rounded-2xl overflow-hidden border border-white/10 shadow-lg group hover:border-[#f5d77f]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden relative h-56 bg-black/20">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute top-3 left-3 bg-[#581c23]/80 backdrop-blur-md text-[#f5d77f] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
                      {p.category.split(' ')[0]}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-gray-100 group-hover:text-[#f5d77f] transition line-clamp-1">{p.name}</h3>
                    <p className="text-sm font-extrabold text-[#f5d77f] mt-1">{p.price}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { setCartCount(prev => prev + 1); showPopup(`Added ${p.name} to cart!`); }}
                    className="w-full bg-[#3b1014] hover:bg-[#581c23] text-white py-2 rounded-xl text-[11px] font-bold border border-white/10 transition"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => showPopup(`Proceeding to checkout for ${p.name}`)}
                    className="w-full bg-[#f5d77f] hover:bg-[#ebd070] text-[#581c23] py-2 rounded-xl text-[11px] font-extrabold transition shadow-sm"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Professional Footer Section */}
      <footer className="bg-[#3b1014] border-t border-white/10 pt-12 pb-6 text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#f5d77f] flex items-center justify-center text-[#581c23] font-bold">SL</div>
              <span className="text-base font-extrabold text-[#f5d77f]">Sohoj Life</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Your ultimate destination for quality lifestyle products, clothing, and everyday essentials delivered right to your doorstep in Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider text-[#f5d77f]">Customer Care</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#" className="hover:text-[#f5d77f] transition">Help Center</a></li>
              <li><a href="#" className="hover:text-[#f5d77f] transition">Track Your Order</a></li>
              <li><a href="#" className="hover:text-[#f5d77f] transition">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-[#f5d77f] transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider text-[#f5d77f]">Contact Info</h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li className="flex items-center gap-1.5"><Headphones size={13} className="text-[#f5d77f]" /> Hotline: +880 1700-000000</li>
              <li>Email: support@sohojlife.com</li>
              <li>Tangail & Dhaka, Bangladesh</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider text-[#f5d77f]">Secure Payments</h4>
            <p className="text-[11px] text-gray-400 mb-3">We accept bKash, SSLCommerz, and Cash on Delivery.</p>
            <div className="flex gap-2">
              <span className="bg-[#4a151b] px-3 py-1.5 rounded-lg border border-white/10 font-bold text-[10px] text-[#f5d77f]">bKash</span>
              <span className="bg-[#4a151b] px-3 py-1.5 rounded-lg border border-white/10 font-bold text-[10px] text-white">COD</span>
              <span className="bg-[#4a151b] px-3 py-1.5 rounded-lg border border-white/10 font-bold text-[10px] text-blue-300">Visa</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 text-center text-[10px] text-gray-400">
          © {new Date().getFullYear()} Sohoj Life. All rights reserved. Developed with ❤️ for Hasib.
        </div>
      </footer>
    </div>
  );
}
