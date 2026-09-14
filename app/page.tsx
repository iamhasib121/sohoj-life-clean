'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, SlidersHorizontal, ArrowRight, Headphones, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function StoreFront() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortOrder, setSortOrder] = useState("default");
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [notification, setNotification] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch products from Firebase Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // যদি ডাটাবেজে প্রোডাক্ট না থাকে, তবে ডিফল্ট কিছু ডেমো প্রোডাক্ট দেখাবে
        if (productsList.length > 0) {
          setProducts(productsList);
        } else {
          setProducts([
            { id: "1", name: "Premium Cotton Punjabi", category: "Men's Wear (মেনস ওয়্যার)", priceNum: 1850, price: "Tk 1,850", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=500&auto=format&fit=crop" },
            { id: "2", name: "Jamdani Silk Saree", category: "Women's Wear (উমেনস ওয়্যার)", priceNum: 4500, price: "Tk 4,500", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => selectedCategory === "All Products" || p.category === selectedCategory);
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-high") return Number(a.priceNum) - Number(b.priceNum);
    if (sortOrder === "high-low") return Number(b.priceNum) - Number(a.priceNum);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#581c23] text-white font-sans flex flex-col justify-between">
      {notification && (
        <div className="fixed top-5 right-4 z-50 bg-[#f5d77f] text-[#581c23] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold transition-all">
          <Check size={16} />
          <span>{notification}</span>
        </div>
      )}

      <div>
        {/* Header */}
        <header className="border-b border-white/10 bg-[#4a151b]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f5d77f] to-[#d4af37] flex items-center justify-center shadow-lg shadow-black/30">
                <span className="text-[#581c23] font-black text-xl tracking-wider">SL</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-wide text-[#f5d77f]">Sohoj Life</h1>
                <p className="text-[10px] text-gray-300 tracking-wider uppercase">Your Trusted Lifestyle Store</p>
              </div>
            </div>

            <div className="flex-1 max-w-md hidden md:flex items-center relative">
              <Search size={16} className="absolute left-3.5 text-gray-400" />
              <input type="text" placeholder="Search products..." className="w-full bg-[#3b1014] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#f5d77f]" />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => { setWishlistCount(p => p + 1); showPopup("Added to Wishlist!"); }} className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10">
                <Heart size={18} className="text-[#f5d77f]" />
                {wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>}
              </button>

              <button onClick={() => { setCartCount(p => p + 1); showPopup("Added to Cart!"); }} className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10">
                <ShoppingBag size={18} className="text-[#f5d77f]" />
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#f5d77f] text-[#581c23] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </button>

              <Link href="/admin" className="bg-[#f5d77f] hover:bg-[#ebd070] text-[#581c23] px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md">
                Admin Area
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-gradient-to-r from-[#4a151b] via-[#3b1014] to-[#4a151b] border border-[#f5d77f]/20 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="max-w-lg z-10">
              <span className="bg-[#f5d77f]/20 text-[#f5d77f] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">Special Offer</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#f5d77f] mt-3 mb-2">Discover Premium Quality Lifestyle Products</h2>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">Explore our exclusive collection of traditional wear, winter outfits, and daily essentials crafted with perfection.</p>
              <button onClick={() => showPopup("Exploring collections...")} className="bg-[#f5d77f] text-[#581c23] px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-[#ebd070] transition shadow-lg">
                Shop Now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Categories & Filter */}
        <section className="max-w-7xl mx-auto px-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#4a151b]/40 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${isSelected ? 'bg-[#f5d77f] text-[#581c23] border-[#f5d77f]' : 'bg-[#3b1014] text-gray-300 border-white/10'}`}>
                    <IconComponent size={14} className={isSelected ? 'text-[#581c23]' : 'text-[#f5d77f]'} />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <SlidersHorizontal size={14} className="text-[#f5d77f]" />
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-[#3b1014] text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none">
                <option value="default">Sort by: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          {loading ? (
            <p className="text-center text-xs text-[#f5d77f] py-12">Loading products from database...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((p) => (
                <div key={p.id} className="bg-[#4a151b] rounded-2xl overflow-hidden border border-white/10 shadow-lg group hover:border-[#f5d77f]/40 transition flex flex-col justify-between">
                  <div>
                    <div className="overflow-hidden relative h-56 bg-black/20">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xs font-bold text-gray-100 line-clamp-1">{p.name}</h3>
                      <p className="text-sm font-extrabold text-[#f5d77f] mt-1">{p.price}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button onClick={() => showPopup(`Added to cart`)} className="bg-[#3b1014] hover:bg-[#581c23] text-white py-2 rounded-xl text-[11px] font-bold border border-white/10">Add to Cart</button>
                    <button onClick={() => showPopup(`Checkout`)} className="bg-[#f5d77f] text-[#581c23] py-2 rounded-xl text-[11px] font-extrabold">Order Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#3b1014] border-t border-white/10 pt-12 pb-6 text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#f5d77f] flex items-center justify-center text-[#581c23] font-bold">SL</div>
              <span className="text-base font-extrabold text-[#f5d77f]">Sohoj Life</span>
            </div>
            <p className="text-[11px] text-gray-400">Your ultimate destination for quality lifestyle products in Bangladesh.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-[11px] text-[#f5d77f]">Customer Care</h4>
            <ul className="space-y-2 text-[11px]"><li>Help Center</li><li>Track Order</li></ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-[11px] text-[#f5d77f]">Contact Info</h4>
            <p className="text-[11px] text-gray-400">Hotline: +880 1700-000000<br/>Tangail & Dhaka, Bangladesh</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-[11px] text-[#f5d77f]">Secure Payments</h4>
            <div className="flex gap-2"><span className="bg-[#4a151b] px-3 py-1.5 rounded-lg text-[10px] text-[#f5d77f] font-bold">bKash</span><span className="bg-[#4a151b] px-3 py-1.5 rounded-lg text-[10px] text-white font-bold">COD</span></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 text-center text-[10px] text-gray-400">
          © {new Date().getFullYear()} Sohoj Life. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
