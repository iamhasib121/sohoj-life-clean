'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Star, MessageCircle, ShieldCheck, Truck, Headphones, RotateCcw, X, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Quick View Modal State
  const [notification, setNotification] = useState<string | null>(null); // Pop-up Notification State

  const categories = [
    "All Products", 
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  const products = [
    { id: 1, name: "Premium Cotton Punjabi", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,850", rating: 4.7, image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=500&auto=format&fit=crop", description: "High-quality premium cotton fabric designed for comfort and elegance during festive occasions and daily wear.", sizes: ["M", "L", "XL", "XXL"] },
    { id: 2, name: "Slim Fit Formal Shirt", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,200", rating: 4.5, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=500&auto=format&fit=crop", description: "Professional slim-fit formal shirt tailored with fine cotton blend for office and formal events.", sizes: ["38", "40", "42", "44"] },
    { id: 3, name: "Graphic Print T-Shirt", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 650", rating: 4.3, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=500&auto=format&fit=crop", description: "Trendy graphic tee made with 100% breathable cotton for casual streetwear style.", sizes: ["S", "M", "L", "XL"] },
    { id: 4, name: "Jamdani Silk Saree", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 4,500", rating: 4.9, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop", description: "Traditional exquisite Jamdani silk saree featuring intricate traditional motifs and rich pallu.", sizes: ["Free Size"] },
    { id: 5, name: "Embroidered Salwar Kameez", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 2,800", rating: 4.6, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop", description: "Gorgeous embroidered salwar kameez set crafted with premium georgette and inner lining.", sizes: ["S", "M", "L", "XL"] },
    { id: 6, name: "Black Print Cotton Kurti", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 1,100", rating: 4.4, image: "https://images.unsplash.com/photo-1564584217132-2271fea3f357?q=80&w=500&auto=format&fit=crop", description: "Stylish everyday black print cotton kurti offering absolute comfort and modern aesthetic.", sizes: ["M", "L", "XL"] },
    { id: 7, name: "Floral Baby Dress", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 850", rating: 4.8, image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=500&auto=format&fit=crop", description: "Cute and soft floral baby dress designed with skin-friendly fabric for toddlers.", sizes: ["2-3 Years", "4-5 Years", "6-7 Years"] },
    { id: 8, name: "Party Tulle Frock", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 1,300", rating: 4.5, image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=500&auto=format&fit=crop", description: "Beautiful party wear tulle frock with bow detailing, perfect for birthdays and celebrations.", sizes: ["3-4 Years", "5-6 Years", "7-8 Years"] },
    { id: 9, name: "Cute Plush Teddy Toy", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 550", rating: 4.7, image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=500&auto=format&fit=crop", description: "Super soft, huggable plush teddy bear toy safe for kids of all ages.", sizes: ["Standard"] },
    { id: 10, name: "Padded Winter Jacket", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 3,200", rating: 4.9, image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop", description: "Heavy-duty windproof padded winter jacket engineered to keep you warm in extreme cold.", sizes: ["M", "L", "XL", "XXL"] },
    { id: 11, name: "Fleece Pullover Hoodie", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 1,600", rating: 4.6, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=500&auto=format&fit=crop", description: "Cozy fleece-lined pullover hoodie with kangaroo pocket for ultimate casual warmth.", sizes: ["S", "M", "L", "XL"] },
    { id: 12, name: "Cable Knit Woolen Sweater", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 1,400", rating: 4.4, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=500&auto=format&fit=crop", description: "Classic cable knit textured woolen sweater offering a sophisticated winter look.", sizes: ["M", "L", "XL"] },
    { id: 13, name: "Kacchi Mutton Biryani", category: "Food (ফুড)", price: "Tk 320", rating: 4.9, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop", description: "Authentic aromatic traditional Kacchi Mutton Biryani cooked with tender meat and premium spices.", sizes: ["Full Portion", "Half Portion"] },
    { id: 14, name: "Assorted Snacks Box", category: "Food (ফুড)", price: "Tk 250", rating: 4.7, image: "https://images.unsplash.com/photo-1599487484170-7c1e604581ed?q=80&w=500&auto=format&fit=crop", description: "Crunchy and delicious assorted traditional snacks box perfect for evening tea time.", sizes: ["500g Pack"] },
    { id: 15, name: "Traditional Misti Box", category: "Food (ফুড)", price: "Tk 400", rating: 4.8, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=500&auto=format&fit=crop", description: "Assorted premium traditional Bengali sweets made with pure chhena and rich syrup.", sizes: ["1 KG Box"] },
  ];

  // Trigger Pop-up Notification helper
  const showPopup = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // WhatsApp Order Function with Number selection (01303422278 & 01879955594)
  const handleWhatsAppOrder = (product: any, targetNumber: string, selectedSize?: string) => {
    const sizeText = selectedSize ? `\n*Size/Variant:* ${selectedSize}` : '';
    const message = `আসসালামু আলাইকুম, আমি এই প্রোডাক্টটি অর্ডার করতে চাই:\n\n*প্রোডাক্ট:* ${product.name}${sizeText}\n*দাম:* ${product.price}\n\nদয়া করে অর্ডারটি কনফার্ম করুন।`;
    const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
    showPopup(`Redirecting to WhatsApp for ${product.name}...`);
    window.open(url, '_blank');
  };

  // Live Search & Category Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#581c23] text-white font-sans selection:bg-[#f5d77f] selection:text-[#581c23] relative">
      
      {/* Pop-up Notification Animation Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#f5d77f] text-[#581c23] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-white/20">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar / Header */}
      <header className="border-b border-white/10 bg-[#4a151b] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-wider text-[#f5d77f] cursor-pointer" onClick={() => { setActiveCategory('All Products'); setSearchQuery(''); }}>Sohoj Life</span>
          </div>

          {/* Live Search Input Bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Search products (e.g., Punjabi, Saree, Biryani)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#3b1014] text-xs text-white placeholder-gray-400 px-4 py-2 pl-9 rounded-full border border-white/10 focus:outline-none focus:border-[#f5d77f] transition-all"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <button onClick={() => showPopup("Wishlist feature activated!")} className="hover:text-[#f5d77f] p-1.5 rounded-full hover:bg-white/10 transition"><Heart size={18}/></button>
            <button onClick={() => showPopup("Cart is ready for WhatsApp Checkout!")} className="hover:text-[#f5d77f] p-1.5 rounded-full hover:bg-white/10 transition relative"><ShoppingCart size={18}/></button>
            <button onClick={() => showPopup("Welcome, Valued Customer!")} className="hover:text-[#f5d77f] p-1.5 rounded-full hover:bg-white/10 transition"><User size={18}/></button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="px-4 pb-3 sm:hidden">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#3b1014] text-xs text-white placeholder-gray-400 px-4 py-2 pl-9 rounded-full border border-white/10 focus:outline-none focus:border-[#f5d77f]"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="text-center py-6 px-4 bg-[#421217] border-b border-white/10">
        <p className="text-xs text-gray-300 max-w-xl mx-auto">
          Crafted with care, delivered to your door. Authentic Bangladeshi artisan products & foods.
        </p>
        <div className="mt-3 flex justify-center gap-3">
          <button onClick={() => showPopup("Explore our latest arrivals below!")} className="bg-[#f5d77f] text-[#581c23] px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-yellow-400 transition shadow-md">Shop Now →</button>
        </div>
        <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mt-4 text-[11px] text-gray-300">
          <span>✦ New Arrivals Weekly</span>
          <span>✦ Handpicked Quality</span>
          <span>✦ 7-Day Easy Return</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
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
                  ? 'bg-[#f5d77f] text-[#581c23] font-bold shadow-lg scale-105' 
                  : 'bg-[#4a151b] text-gray-200 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-300 text-sm">
            No products found matching your search. Try searching something else!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div>
                  {/* Click on Image for Quick View Modal */}
                  <div className="h-44 w-full bg-gray-100 overflow-hidden relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition">Quick View</span>
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] text-gray-500 uppercase">{product.category.split(' ')[0]}</span>
                    <h3 onClick={() => setSelectedProduct(product)} className="text-xs font-semibold text-gray-800 line-clamp-1 mt-0.5 cursor-pointer hover:text-[#581c23]">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-gray-700 font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 pt-0 flex flex-col gap-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#581c23]">{product.price}</span>
                  </div>
                  {/* WhatsApp Order Buttons for both numbers (01303422278 & 01879955594) */}
                  <div className="grid grid-cols-2 gap-1">
                    <button 
                      onClick={() => handleWhatsAppOrder(product, "8801303422278")}
                      className="bg-[#25D366] text-white text-[10px] py-1.5 rounded font-medium hover:bg-[#20ba5a] flex items-center justify-center gap-1 shadow transition active:scale-95"
                      title="Order via WhatsApp 1"
                    >
                      <MessageCircle size={12} /> Order 1
                    </button>
                    <button 
                      onClick={() => handleWhatsAppOrder(product, "8801879955594")}
                      className="bg-[#128C7E] text-white text-[10px] py-1.5 rounded font-medium hover:bg-[#0f756b] flex items-center justify-center gap-1 shadow transition active:scale-95"
                      title="Order via WhatsApp 2"
                    >
                      <MessageCircle size={12} /> Order 2
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Quick View Modal (প্রোডাক্ট ডিটেইলস মোডাল) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full transition z-10"
            >
              <X size={18} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="h-64 sm:h-full bg-gray-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-semibold">{selectedProduct.category}</span>
                  <h3 className="text-base font-bold text-gray-900 mt-2">{selectedProduct.name}</h3>
                  <p className="text-sm font-bold text-[#581c23] mt-1">{selectedProduct.price}</p>
                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">{selectedProduct.description}</p>
                  
                  {/* Available Sizes */}
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-gray-700 block mb-1">Available Size / Variant:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedProduct.sizes?.map((size: string) => (
                        <span key={size} className="text-[10px] border border-gray-300 px-2.5 py-1 rounded-md bg-gray-50 text-gray-800 font-medium">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <span className="text-[10px] text-gray-500 text-center font-medium">Direct WhatsApp Order Buttons:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => { handleWhatsAppOrder(selectedProduct, "8801303422278"); setSelectedProduct(null); }}
                      className="bg-[#25D366] text-white text-xs py-2 rounded-lg font-semibold hover:bg-[#20ba5a] flex items-center justify-center gap-1 shadow"
                    >
                      <MessageCircle size={14} /> WhatsApp 1
                    </button>
                    <button 
                      onClick={() => { handleWhatsAppOrder(selectedProduct, "8801879955594"); setSelectedProduct(null); }}
                      className="bg-[#128C7E] text-white text-xs py-2 rounded-lg font-semibold hover:bg-[#0f756b] flex items-center justify-center gap-1 shadow"
                    >
                      <MessageCircle size={14} /> WhatsApp 2
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
