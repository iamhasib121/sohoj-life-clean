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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-zinc-300 py-2.5 px-4 text-center text-xs font-semibold tracking-wider border-b border-zinc-800 flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-amber-400" /> <span>Enjoy Free Express Shipping on Orders Over Tk 2,000</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-lg tracking-tighter">
              SL
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">Sohoj Life</span>
              <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Luxury Store</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/80 text-white pl-11 pr-4 py-2.5 rounded-full border border-zinc-800 focus:border-white focus:outline-none text-xs transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-zinc-900 hover:bg-zinc-800 text-white px-4.5 py-2.5 rounded-full border border-zinc-800 flex items-center gap-2 transition text-xs font-semibold"
            >
              <ShoppingBag size={16} className="text-amber-400" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <Link 
              href="/admin" 
              className="bg-white hover:bg-zinc-200 text-black px-4.5 py-2.5 rounded-full text-xs font-bold transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800/80 p-10 md:p-16 mb-12 flex flex-col items-start justify-center">
          <div className="max-w-2xl relative z-10">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3 block">New Collection 2026</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
              Refined Style. <br />Exquisite Quality.
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mb-8 max-w-lg leading-relaxed font-normal">
              Explore our curated selection of premium traditional wear, jackets, and essential lifestyle goods.
            </p>
            <button 
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white hover:bg-zinc-200 text-black px-7 py-3.5 rounded-full font-bold text-xs tracking-wide transition flex items-center gap-2"
            >
              Shop Collection <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div id="shop" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold transition ${
                  selectedCategory === cat 
                    ? 'bg-white text-black font-bold' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 text-zinc-300 px-4 py-2.5 rounded-full border border-zinc-800 text-xs focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-zinc-900/40 rounded-2xl h-80 animate-pulse border border-zinc-800/40"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500 text-sm">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-xs line-clamp-1 mb-1">{product.name}</h3>
                    <p className="text-sm font-bold text-amber-400">{product.price}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-zinc-900 hover:bg-white hover:text-black text-zinc-200 py-3 rounded-xl font-bold text-xs transition border border-zinc-800 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={16} className="text-amber-400" /> Your Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 text-xs">Your bag is empty</div>
              ) : (
                <>
                  <div className="space-y-3 my-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-900">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-xs truncate">{item.name}</h4>
                          <p className="text-amber-400 text-xs font-medium">{item.price}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-zinc-800 rounded text-zinc-300"><Minus size={10} /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-zinc-800 rounded text-zinc-300"><Plus size={10} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleWhatsAppCheckout} className="space-y-3 pt-4 border-t border-zinc-900 text-xs">
                    <h3 className="font-bold text-zinc-300">Checkout Details</h3>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-900 text-white p-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-white"
                      required
                    />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-zinc-900 text-white p-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-white"
                      required
                    />
                    <textarea 
                      placeholder="Delivery Address" 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 text-white p-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-white resize-none"
                      required
                    ></textarea>

                    <div className="flex justify-between items-center font-bold text-sm pt-2">
                      <span className="text-zinc-400">Total:</span>
                      <span className="text-amber-400">Tk {cartTotal.toLocaleString()}</span>
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
