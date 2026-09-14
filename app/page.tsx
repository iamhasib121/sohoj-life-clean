'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Sparkles, ArrowRight, X, Plus, Minus, MessageCircle, ExternalLink, ShieldCheck, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-[#3F0C13] text-[#2D2D2D] font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#2D060B] text-[#D4AF37] py-2 px-4 text-center text-xs font-semibold tracking-wider border-b border-[#5C111C] flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-[#D4AF37]" /> <span>Free Express Shipping on Orders Over Tk 2,000</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#3F0C13]/95 backdrop-blur-md border-b border-[#5C111C] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-white flex items-center justify-center font-black text-lg shadow">
              SL
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Sohoj <span className="text-[#D4AF37]">Life</span></span>
              <span className="block text-[9px] text-[#D4AF37] uppercase tracking-widest font-semibold">Premium Brand</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2D060B] text-white placeholder-zinc-400 pl-11 pr-4 py-2.5 rounded-full border border-[#5C111C] focus:border-[#D4AF37] focus:outline-none text-xs transition shadow-inner"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#2D060B] hover:bg-[#5C111C] text-white px-4.5 py-2.5 rounded-full border border-[#5C111C] flex items-center gap-2 transition text-xs font-bold shadow"
            >
              <ShoppingBag size={16} className="text-[#D4AF37]" />
              <span className="text-white">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <Link 
              href="/admin" 
              className="bg-[#D4AF37] hover:bg-[#c29d30] text-black px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide transition shadow flex items-center gap-1.5"
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2D060B] to-[#4F101A] border border-[#5C111C] p-10 md:p-14 mb-12 shadow-2xl text-center flex flex-col items-center justify-center">
          <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2">Curated for Every Occasion</span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Elevate Your Style <br /><span className="text-[#D4AF37]">With Luxury Essentials</span>
          </h1>
          <p className="text-zinc-300 text-xs md:text-sm max-w-md mb-8 leading-relaxed">
            Discover our exclusive curated collection of premium traditional wear, executive winter outfits, and elite lifestyle products.
          </p>
          <button 
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#D4AF37] hover:bg-[#c29d30] text-black px-7 py-3 rounded-full font-bold text-xs tracking-wider transition shadow-lg flex items-center gap-2"
          >
            Explore Collection <ArrowRight size={16} />
          </button>
        </div>

        {/* Categories Section */}
        <div id="shop" className="text-center mb-8">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Shop By Category</span>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1 mb-6">Curated for Every Occasion</h2>
          
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                  selectedCategory === cat 
                    ? 'bg-[#D4AF37] text-black shadow-md' 
                    : 'bg-[#2D060B] hover:bg-[#5C111C] text-zinc-300 border border-[#5C111C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#2D060B] text-zinc-300 px-4 py-2 rounded-full border border-[#5C111C] text-xs font-semibold focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid (White Cards Style matching reference) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#2D060B] rounded-2xl border border-[#5C111C]">
            <p className="text-zinc-400 text-xs">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-zinc-900 text-xs line-clamp-1 mb-1">{product.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-amber-500 text-[10px] mb-1">
                      <Star size={12} fill="currentColor" /> <span>4.9</span>
                    </div>
                    <p className="text-sm font-black text-[#581c25]">{product.price}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#3F0C13] hover:bg-[#581c25] text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow"
                  >
                    <ShoppingBag size={14} className="text-[#D4AF37]" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Features */}
      <div className="bg-[#2D060B] border-t border-[#5C111C] py-8 px-6 mt-16 text-center text-zinc-300 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#D4AF37] mb-1">Cash on Delivery</span>
            <span className="text-[11px] text-zinc-400">Pay when it arrives</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#D4AF37] mb-1">Fast Delivery</span>
            <span className="text-[11px] text-zinc-400">All over Bangladesh</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#D4AF37] mb-1">Secure Checkout</span>
            <span className="text-[11px] text-zinc-400">100% safe payments</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#D4AF37] mb-1">24/7 Support</span>
            <span className="text-[11px] text-zinc-400">Always here to help</span>
          </div>
        </div>
      </div>

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
