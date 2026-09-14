'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, X, Plus, Minus, MessageCircle, ExternalLink, ShieldCheck, Star, Heart, User } from 'lucide-react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

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
      message += `${index + 1}. ${item.name} (${item.price}) x ${item.quantity} = Tk ${item.priceNum * item.quantity}\n`;
    });

    message += `\n💰 *Total Amount:* Tk ${cartTotal.toLocaleString()}\n`;
    message += `🚚 *Payment Method:* Cash on Delivery`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#2D060B] text-[#D4AF37] py-2 px-4 text-center text-xs font-medium border-b border-[#5C111C]">
        ✨ Free Express Shipping on Orders Over Tk 2,000 — Cash on Delivery available
      </div>

      {/* Navbar matching clean design */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-[#3F0C13] text-[#D4AF37] font-black px-2.5 py-1 rounded text-xs shadow">SL</div>
            <div>
              <span className="text-zinc-900 font-bold tracking-tight text-sm block leading-none">Sohoj <span className="text-[#3F0C13]">Life</span></span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-semibold block mt-0.5">PREMIUM LIFESTYLE</span>
            </div>
          </Link>

          {/* Action Icons */}
          <div className="flex items-center gap-4 text-zinc-700">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-[#3F0C13] transition"
              title="Search"
            >
              <Search size={18} />
            </button>

            <button 
              onClick={() => alert("Wishlist feature coming soon!")}
              className="p-2 hover:text-[#3F0C13] transition relative"
              title="Wishlist"
            >
              <Heart size={18} />
            </button>

            <Link 
              href="/admin" 
              className="p-2 hover:text-[#3F0C13] transition flex items-center gap-1"
              title="Admin Login"
            >
              <User size={18} />
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:text-[#3F0C13] transition relative flex items-center"
              title="Cart"
            >
              <ShoppingBag size={18} />
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3F0C13] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="bg-zinc-100 px-6 py-3 border-t border-zinc-200 flex items-center justify-center">
            <div className="w-full max-w-xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search products across store..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-zinc-900 placeholder-zinc-400 pl-10 pr-10 py-2 rounded-full border border-zinc-300 focus:border-[#3F0C13] focus:outline-none text-xs transition shadow-sm"
                autoFocus
              />
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner Section */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#3F0C13] to-[#5C111C] rounded-2xl p-8 md:p-12 text-center text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none"></div>
          
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">CURATED FOR EVERY OCCASION</span>
          <h1 className="text-2xl md:text-4xl font-black mb-3 tracking-tight text-white">
            Elevate Your Style <br className="hidden md:block" /> With Luxury Essentials
          </h1>
          <p className="text-zinc-200 text-xs md:text-sm max-w-xl mx-auto mb-8 font-light">
            Discover our exclusive curated collection of premium traditional wear, executive winter outfits, and elite lifestyle products.
          </p>

          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#D4AF37] hover:bg-[#c29d30] text-black px-6 py-2.5 rounded-full text-xs font-black shadow-lg transition transform hover:-translate-y-0.5"
            >
              Explore Collection →
            </button>
          </div>
        </div>

        {/* Shop By Category Section */}
        <div id="shop" className="text-center mb-8">
          <span className="text-[10px] text-[#3F0C13] font-bold uppercase tracking-widest block mb-1">SHOP BY CATEGORY</span>
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Curated for Every Occasion</h2>
          
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat 
                    ? 'bg-[#3F0C13] text-white shadow' 
                    : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 px-2 text-xs text-zinc-600">
            <span>Showing {filteredProducts.length} products</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-zinc-700 px-3 py-1.5 rounded-full border border-zinc-200 text-xs focus:outline-none shadow-sm"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl h-64 animate-pulse border border-zinc-200"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-xs">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-bold text-zinc-800 text-xs line-clamp-1 mb-1">{product.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-amber-500 text-[10px] mb-1">
                      <Star size={10} fill="currentColor" /> <span>4.9</span>
                    </div>
                    <p className="text-xs font-black text-[#3F0C13]">{product.price}</p>
                  </div>
                </div>
                <div className="p-3 pt-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#3F0C13] hover:bg-[#581c25] text-white py-2 rounded-lg font-bold text-[11px] transition shadow"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Features Bar */}
      <div className="bg-white border-t border-zinc-200 py-6 px-4 mt-16 text-center text-zinc-700 text-xs shadow-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="font-bold text-[#3F0C13] block mb-0.5">Cash on Delivery</span>
            <span className="text-[10px] text-zinc-500">Pay when it arrives</span>
          </div>
          <div>
            <span className="font-bold text-[#3F0C13] block mb-0.5">Fast Delivery</span>
            <span className="text-[10px] text-zinc-500">All nationwide</span>
          </div>
          <div>
            <span className="font-bold text-[#3F0C13] block mb-0.5">Secure Checkout</span>
            <span className="text-[10px] text-zinc-500">100% safe payments</span>
          </div>
          <div>
            <span className="font-bold text-[#3F0C13] block mb-0.5">24/7 Support</span>
            <span className="text-[10px] text-zinc-500">Always here to help</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Details */}
      <footer className="bg-zinc-900 text-zinc-400 py-8 px-6 text-xs border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#D4AF37] text-black font-black px-2 py-0.5 rounded text-xs">SL</div>
              <span className="text-white font-bold">Sohoj Life</span>
            </div>
            <p className="text-[11px] max-w-xs text-zinc-400">
              Your trusted destination for premium lifestyle and authentic Bengali fashion — making everyday life simple and beautiful.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <span className="text-white font-bold block mb-2 text-[11px]">SHOP</span>
              <ul className="space-y-1 text-[11px] text-zinc-400">
                <li>Men's Wear</li>
                <li>Women's Wear</li>
                <li>Kids' Wear</li>
                <li>Winter Jackets</li>
                <li>Food</li>
              </ul>
            </div>
            <div>
              <span className="text-white font-bold block mb-2 text-[11px]">COMPANY</span>
              <ul className="space-y-1 text-[11px] text-zinc-400">
                <li>About Us</li>
                <li>Our Story</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <span className="text-white font-bold block mb-2 text-[11px]">SUPPORT</span>
              <ul className="space-y-1 text-[11px] text-zinc-400">
                <li>Contact</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white text-zinc-900 border-l border-zinc-200 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-[#3F0C13]" /> Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-black p-1 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 text-xs">Your cart is empty</div>
              ) : (
                <>
                  <div className="space-y-3 my-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-zinc-900 text-xs truncate">{item.name}</h4>
                          <p className="text-[#3F0C13] text-xs font-bold">{item.price}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-zinc-200 rounded text-zinc-800"><Minus size={10} /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-zinc-200 rounded text-zinc-800"><Plus size={10} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleWhatsAppCheckout} className="space-y-3 pt-4 border-t border-zinc-200 text-xs">
                    <h3 className="font-bold text-[#3F0C13]">Checkout Details</h3>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-50 text-zinc-900 p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#3F0C13]"
                      required
                    />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-zinc-50 text-zinc-900 p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#3F0C13]"
                      required
                    />
                    <textarea 
                      placeholder="Delivery Address" 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-50 text-zinc-900 p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-[#3F0C13] resize-none"
                      required
                    ></textarea>

                    <div className="flex justify-between items-center font-bold text-sm pt-2">
                      <span className="text-zinc-600">Total:</span>
                      <span className="text-[#3F0C13]">Tk {cartTotal.toLocaleString()}</span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                    >
                      <MessageCircle size={16} /> Order via WhatsApp <ExternalLink size={14} />
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
}
