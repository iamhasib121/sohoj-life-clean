'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Star, MessageCircle, CheckCircle2, Settings, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const categories = [
    "All Products", 
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  const products = [
    { id: 1, name: "Premium Cotton Punjabi", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,850", rating: 4.7, image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=500&auto=format&fit=crop", description: "High-quality premium cotton fabric designed for comfort and elegance during festive occasions and daily wear." },
    { id: 2, name: "Slim Fit Formal Shirt", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,200", rating: 4.5, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=500&auto=format&fit=crop", description: "Professional slim-fit formal shirt tailored with fine cotton blend for office and formal events." },
    { id: 3, name: "Graphic Print T-Shirt", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 650", rating: 4.3, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=500&auto=format&fit=crop", description: "Trendy graphic tee made with 100% breathable cotton for casual streetwear style." },
    { id: 4, name: "Jamdani Silk Saree", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 4,500", rating: 4.9, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop", description: "Traditional exquisite Jamdani silk saree featuring intricate traditional motifs and rich pallu." },
    { id: 5, name: "Embroidered Salwar Kameez", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 2,800", rating: 4.6, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500&auto=format&fit=crop", description: "Gorgeous embroidered salwar kameez set crafted with premium georgette and inner lining." },
    { id: 6, name: "Black Print Cotton Kurti", category: "Women's Wear (উমেনস ওয়্যার)", price: "Tk 1,100", rating: 4.4, image: "https://images.unsplash.com/photo-1564584217132-2271fea3f357?q=80&w=500&auto=format&fit=crop", description: "Stylish everyday black print cotton kurti offering absolute comfort and modern aesthetic." },
    { id: 7, name: "Floral Baby Dress", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 850", rating: 4.8, image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=500&auto=format&fit=crop", description: "Cute and soft floral baby dress designed with skin-friendly fabric for toddlers." },
    { id: 8, name: "Party Tulle Frock", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 1,300", rating: 4.5, image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=500&auto=format&fit=crop", description: "Beautiful party wear tulle frock with bow detailing, perfect for birthdays and celebrations." },
    { id: 9, name: "Cute Plush Teddy Toy", category: "Kids' Wear (কিডস ওয়্যার)", price: "Tk 550", rating: 4.7, image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=500&auto=format&fit=crop", description: "Super soft, huggable plush teddy bear toy safe for kids of all ages." },
    { id: 10, name: "Padded Winter Jacket", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 3,200", rating: 4.9, image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop", description: "Heavy-duty windproof padded winter jacket engineered to keep you warm in extreme cold." },
    { id: 11, name: "Fleece Pullover Hoodie", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 1,600", rating: 4.6, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=500&auto=format&fit=crop", description: "Cozy fleece-lined pullover hoodie with kangaroo pocket for ultimate casual warmth." },
    { id: 12, name: "Cable Knit Woolen Sweater", category: "Winter Jacket (উইন্টার জ্যাকেট)", price: "Tk 1,400", rating: 4.4, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=500&auto=format&fit=crop", description: "Classic cable knit textured woolen sweater offering a sophisticated winter look." },
    { id: 13, name: "Kacchi Mutton Biryani", category: "Food (ফুড)", price: "Tk 320", rating: 4.9, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop", description: "Authentic aromatic traditional Kacchi Mutton Biryani cooked with tender meat and premium spices." },
    { id: 14, name: "Assorted Snacks Box", category: "Food (ফুড)", price: "Tk 250", rating: 4.7, image: "https://images.unsplash.com/photo-1599487484170-7c1e604581ed?q=80&w=500&auto=format&fit=crop", description: "Crunchy and delicious assorted traditional snacks box perfect for evening tea time." },
    { id: 15, name: "Traditional Misti Box", category: "Food (ফুড)", price: "Tk 400", rating: 4.8, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=500&auto=format&fit=crop", description: "Assorted premium traditional Bengali sweets made with pure chhena and rich syrup." },
  ];

  const showPopup = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleWhatsAppOrder = (product: any, targetNumber: string) => {
    const message = `আসসালামু আলাইকুম, আমি এই প্রোডাক্টটি অর্ডার করতে চাই:\n\n*প্রোডাক্ট:* ${product.name}\n*দাম:* ${product.price}\n\nদয়া করে অর্ডারটি কনফার্ম করুন।`;
    const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
    showPopup(`Redirecting to WhatsApp for ${product.name}...`);
    window.open(url, '_blank');
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#581c23] text-white font-sans selection:bg-[#f5d77f] selection:text-[#581c23] relative">
      
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#f5d77f] text-[#581c23] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-white/20">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-[#4a151b] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-wider text-[#f5d77f] cursor-pointer" onClick={() => { setActiveCategory('All Products'); setSearchQuery(''); }}>Sohoj Life</span>
          </div>

          <div className="flex-1 max-w-md relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#3b1014] text-xs text-white placeholder-gray-400 px-4 py-2 pl-9 rounded-full border border-white/10 focus:outline-none focus:border-[#f5d77f] transition-all"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center space-x-3 text-sm">
            {/* Admin Link Secured */}
            <Link 
              href="/admin"
              className="bg-black/30 border border-white/10 text-[#f5d77f] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-black/50 transition"
            >
              <Lock size={12} /> Admin Area
            </Link>
            <button onClick={() => showPopup("Wishlist activated!")} className="hover:text-[#f5d77f] p-1.5 rounded-full hover:bg-white/10 transition hidden sm:block"><Heart size={18}/></button>
            <button onClick={() => showPopup("Cart ready!")} className="hover:text-[#f5d77f] p-1.5 rounded-full hover:bg-white/10 transition hidden sm:block"><ShoppingCart size={18}/></button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between group">
              <div>
                <div className="h-44 w-full bg-gray-100 overflow-hidden relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
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
                <span className="text-xs font-bold text-[#581c23]">{product.price}</span>
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={() => handleWhatsAppOrder(product, "8801303422278")} className="bg-[#25D366] text-white text-[10px] py-1.5 rounded font-medium flex items-center justify-center gap-1">
                    <MessageCircle size={12} /> Order 1
                  </button>
                  <button onClick={() => handleWhatsAppOrder(product, "8801879955594")} className="bg-[#128C7E] text-white text-[10px] py-1.5 rounded font-medium flex items-center justify-center gap-1">
                    <MessageCircle size={12} /> Order 2
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full z-10">✕</button>
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
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <button onClick={() => { handleWhatsAppOrder(selectedProduct, "8801303422278"); setSelectedProduct(null); }} className="bg-[#25D366] text-white text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1">
                    <MessageCircle size={14} /> WhatsApp 1
                  </button>
                  <button onClick={() => { handleWhatsAppOrder(selectedProduct, "8801879955594"); setSelectedProduct(null); }} className="bg-[#128C7E] text-white text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1">
                    <MessageCircle size={14} /> WhatsApp 2
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
