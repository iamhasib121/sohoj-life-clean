'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Star, ArrowRight, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All Products');

  const categories = [
    "All Products", 
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  const products = [
    { id: 1, name: "Premium Cotton Punjabi", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,850", rating: 4.7, image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=500&auto=format&fit=crop" },
    { id: 2, name: "Slim Fit Formal Shirt", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,200", rating: 4.5, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=500&auto=format&fit=crop" },
    { id: 3, name: "Graphic Print T-Shirt", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 650", rating: 4.3, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=500&auto=format&fit=crop" },
    { id: 4, name: "Jamdani Silk Saree", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 4,500", rating: 4.9, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop" },
    { id: 5, name: "Embroidered Salwar Kameez", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 2,800", rating: 4.6, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop" },
    { id: 6, name: "Black Print Cotton Kurti", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 1,100", rating: 4.4, image: "https://images.unsplash.com/photo-1564584217132-2271fea3f357?q=80&w=500&auto=format&fit=crop" },
    { id: 7, name: "Floral Baby Dress", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 850", rating: 4.8, image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=500&auto=format&fit=crop" },
    { id: 8, name: "Party Tulle Frock", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 1,300", rating: 4.5, image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=500&auto=format&fit=crop" },
    { id: 9, name: "Cute Plush Teddy Toy", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 550", rating: 4.7, image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=500&auto=format&fit=crop" },
    { id: 10, name: "Padded Winter Jacket", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 3,200", rating: 4.9, image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop" },
    { id: 11, name: "Fleece Pullover Hoodie", category: "Winter Jacket (উইন্টার জ্যাケット)", price: "Tk 1,600", rating: 4.6, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=500&auto=format&fit=crop" },
    { id: 12, name: "Cable Knit Woolen Sweater", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 1,400", rating: 4.4, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=500&auto=format&fit=crop" },
    { id: 13, name: "Kacchi Mutton Biryani", category: "Food (ফুড)", price: "Tk 320", rating: 4.9, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop" },
    { id: 14, name: "Assorted Snacks Box", category: "Food (ফুড)", price: "Tk 250", rating: 4.7, image: "https://images.unsplash.com/photo-1599487484170-7c1e604581ed?q=80&w=500&auto=format&fit=crop" },
    { id: 15, name: "Traditional Misti Box", category: "Food (ফুড)", price: "Tk 400", rating: 4.8, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=500&auto=format&fit=crop" },
  ];

  const filteredProducts = activeCategory === 'All Products' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#581c23] text-white font-sans">
      {/* Top Bar / Header */}
      <header className="border-b border-white/10 bg-[#4a151b] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wider text-[#f5d77f]">Sohoj Life</span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <button className="hover:text-[#f5d77f] flex items-center gap-1"><Search size={18}/></button>
            <button className="hover:text-[#f5d77f] flex items-center gap-1"><Heart size={18}/></button>
            <button className="hover:text-[#f5d77f] flex items-center gap-1"><ShoppingCart size={18}/></button>
            <button className="hover:text-[#f5d77f] flex items-center gap-1"><User size={18}/></button>
          </div>
        </div>
      </header>

      {/* Hero Banner text */}
      <div className="text-center py-6 px-4 bg-[#421217] border-b border-white/10">
        <p className="text-xs text-gray-300 max-w-xl mx-auto">
          Crafted with care, delivered to your door. Artisan Bangladeshi products.
        </p>
        <div className="mt-3 flex justify-center gap-3">
          <button className="bg-[#f5d77f] text-[#581c23] px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-yellow-400">Shop Now →</button>
          <button className="border border-white/30 px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-white/10">Explore Categories</button>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-[11px] text-gray-300">
          <span>✦ New Arrivals Weekly</span>
          <span>✦ Handpicked Quality</span>
          <span>✦ 7-Day Easy Return</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-[#f5d77f]">Shop by Category</p>
          <h2 className="text-2xl font-serif font-bold mt-1">Curated for Every Occasion</h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-[#f5d77f] text-[#581c23] font-bold shadow-lg' 
                  : 'bg-[#4a151b] text-gray-200 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-md flex flex-col justify-between group">
              <div>
                <div className="h-44 w-full bg-gray-100 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-3">
                  <span className="text-[10px] text-gray-500 uppercase">{product.category.split(' ')[0]}</span>
                  <h3 className="text-xs font-semibold text-gray-800 line-clamp-1 mt-0.5">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-gray-700 font-medium">{product.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 pt-0 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-[#581c23]">{product.price}</span>
                <button className="bg-[#581c23] text-white text-[10px] px-2.5 py-1.5 rounded hover:bg-[#4a151b] font-medium">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Features Footer Strip */}
      <div className="border-t border-b border-white/10 my-12 py-6 bg-[#4a151b]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs">
          <div className="flex flex-col items-center gap-1">
            <Truck size={20} className="text-[#f5d77f]" />
            <span className="font-semibold">Cash on Delivery</span>
            <span className="text-[10px] text-gray-300">Pay when it arrives</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RotateCcw size={20} className="text-[#f5d77f]" />
            <span className="font-semibold">Fast Delivery</span>
            <span className="text-[10px] text-gray-300">72-78 hrs nationwide</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck size={20} className="text-[#f5d77f]" />
            <span className="font-semibold">Secure Checkout</span>
            <span className="text-[10px] text-gray-300">100% safe payments</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Headphones size={20} className="text-[#f5d77f]" />
            <span className="font-semibold">24/7 Support</span>
            <span className="text-[10px] text-gray-300">Always here to help</span>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#421217] pt-10 pb-6 text-xs text-gray-300 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Sohoj Life</h4>
            <p className="text-[11px] leading-relaxed text-gray-300">
              Your trusted destination for premium fashion and authentic Bengali flavours — making everyday life simple and beautiful.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-2 uppercase text-[11px] tracking-wider">Shop</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>Men's Wear</li>
              <li>Women's Wear</li>
              <li>Kid's Wear</li>
              <li>Winter</li>
              <li>Food</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-2 uppercase text-[11px] tracking-wider">Company</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>About Us</li>
              <li>Our Story</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-2 uppercase text-[11px] tracking-wider">Support</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>Contact</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between text-[10px] text-gray-400">
          <p>© 2026 Sohoj Life. All rights reserved.</p>
          <p>Made with love in Bangladesh</p>
        </div>
      </footer>
    </div>
  );
}
