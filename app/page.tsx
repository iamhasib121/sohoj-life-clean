'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { ShoppingBag, Search, X, Plus, Minus, MessageCircle, ExternalLink, ShieldCheck, Star, Heart, UserRound } from 'lucide-react';
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

  const handleWhatsAppCheckout = (e: FormEvent) => {
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

  // Logo styled to match the supplied Sohoj Life reference.
  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9 rounded-full bg-[#4a0b17] border-2 border-[#d4af37] flex items-center justify-center shadow-sm">
        <span className="text-[#d4af37] font-black text-[11px] tracking-tight">SL</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#d4af37] border-2 border-[#eee8e9]" />
      </div>
      <div className="leading-none">
        <div className="text-[#4a0b17] font-black text-[15px] tracking-tight">
          Sohoj <span className="text-[#a27a12]">Life</span>
        </div>
        <div className="mt-1 text-[6px] tracking-[0.24em] font-bold text-[#a27a12] uppercase">
          Premium Lifestyle
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#292526] font-sans selection:bg-[#4a0b17] selection:text-white">
      {/* Top announcement strip */}
      <div className="h-2 bg-[#4a0b17]" />
      <div className="h-7 bg-[#eee8e9] border-b border-[#ddd5d7] flex items-center justify-center px-4 text-[8px] font-semibold text-[#5b3b40]">
        <span>✦ Free delivery on orders over Tk 2,000 — Cash on Delivery available ✦</span>
      </div>

      {/* Reference-style header */}
      <header className="h-14 bg-[#f4eff0] border-b border-[#ded6d8]">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="w-24" />
          <Logo />
          <div className="flex items-center gap-4 text-[#75676a]">
            <button aria-label="Search" className="hover:text-[#4a0b17] transition">
              <Search size={13} strokeWidth={1.8} />
            </button>
            <button aria-label="Wishlist" className="hover:text-[#4a0b17] transition">
              <Heart size={13} strokeWidth={1.8} />
            </button>
            <button aria-label="Account" className="hover:text-[#4a0b17] transition">
              <UserRound size={13} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
              className="relative hover:text-[#4a0b17] transition"
            >
              <ShoppingBag size={13} strokeWidth={1.8} />
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="absolute -top-2 -right-2 min-w-3 h-3 px-0.5 rounded-full bg-[#4a0b17] text-white text-[6px] flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Maroon hero exactly in the visual position of the reference */}
      <section className="bg-[#4a0b17] text-white">
        <div className="max-w-6xl mx-auto px-6 h-40 flex flex-col items-center justify-center text-center">
          <p className="text-[8px] text-[#d4af37] uppercase tracking-[0.22em] font-bold">
            SIMPLE • AUTHENTIC • PREMIUM
          </p>
          <h1 className="mt-1 text-[19px] font-black tracking-tight">
            Everyday essentials, selected for you
          </h1>
          <p className="mt-1 text-[8px] text-[#eadfe1]">
            Quality fashion, kids' products and food — delivered across Bangladesh.
          </p>
          <div className="flex items-center gap-2.5 mt-3">
            <button
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#d4af37] hover:bg-[#c39e2e] text-[#2d070d] px-5 py-1.5 rounded-full text-[8px] font-black shadow transition"
            >
              Shop Now →
            </button>
            <button
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-[#d4af37] text-[#f0d76d] hover:bg-white/5 px-5 py-1.5 rounded-full text-[8px] font-black transition"
            >
              Explore Categories
            </button>
          </div>
          <div className="flex items-center gap-5 mt-4 text-[7px] text-[#e7dadd] font-semibold">
            <span>✦ New Arrivals Weekly</span>
            <span>✦ Handpicked Quality</span>
            <span>✦ 7-Day Easy Returns</span>
          </div>
        </div>
      </section>

      {/* Main catalogue */}
      <main id="shop" className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="text-center mb-6">
          <span className="text-[7px] text-[#a27a12] font-bold uppercase tracking-[0.28em] block mb-1">
            SHOP BY CATEGORY
          </span>
          <h2 className="text-[20px] font-black text-[#201b1c] tracking-tight">
            Curated for Every Occasion
          </h2>
        </div>

        <div className="flex justify-center items-center gap-1.5 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[8px] font-bold transition border ${
                selectedCategory === cat
                  ? 'bg-[#4a0b17] text-white border-[#4a0b17] shadow-sm'
                  : 'bg-white text-[#665b5d] border-[#d8d2d3] hover:border-[#4a0b17] hover:text-[#4a0b17]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-3 text-[8px] text-[#81777a]">
          <span>Showing <strong>{filteredProducts.length}</strong> products</span>
          <div className="flex items-center gap-2">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-[#5d5355] px-2.5 py-1 rounded-full border border-[#d8d2d3] text-[8px] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {[1,2,3,4,5,6,7,8].map((n) => (
              <div key={n} className="bg-[#f0eeee] rounded-lg h-60 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#faf8f8] rounded-xl border border-[#e5dfe0]">
            <p className="text-[#999092] text-xs">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-[#ded9da] overflow-hidden shadow-[0_2px_8px_rgba(50,30,35,0.10)] hover:shadow-[0_5px_14px_rgba(50,30,35,0.16)] transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square bg-[#f0efed] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-white/95 border border-[#e3dddd] text-[#5b4448] rounded-full px-1.5 py-0.5 text-[6px] font-bold">
                      {index < 4 ? 'New' : index % 3 === 0 ? 'Best Seller' : 'New'}
                    </span>
                  </div>
                  <div className="px-2.5 pt-2 pb-1.5">
                    <h3 className="font-bold text-[#31292b] text-[8px] line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#c58c12] text-[7px] mb-1">
                      <Star size={8} fill="currentColor" />
                      <span>4.9</span>
                    </div>
                    <p className="text-[10px] font-black text-[#4a0b17]">
                      {product.price}
                    </p>
                  </div>
                </div>
                <div className="px-2.5 pb-2.5">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#4a0b17] hover:bg-[#621323] text-white py-1.5 rounded-full font-bold text-[7px] transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Feature strip */}
      <section className="border-t border-[#e7e2e3] bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="mx-auto mb-1.5 w-7 h-7 rounded-full bg-[#f1e7e9] flex items-center justify-center text-[#4a0b17] text-[10px]">▣</div>
            <span className="font-bold text-[#4a0b17] block text-[8px]">Cash on Delivery</span>
            <span className="text-[7px] text-[#8b8183]">Pay when it arrives</span>
          </div>
          <div>
            <div className="mx-auto mb-1.5 w-7 h-7 rounded-full bg-[#f1e7e9] flex items-center justify-center text-[#4a0b17] text-[10px]">▸</div>
            <span className="font-bold text-[#4a0b17] block text-[8px]">Fast Delivery</span>
            <span className="text-[7px] text-[#8b8183]">All nationwide</span>
          </div>
          <div>
            <div className="mx-auto mb-1.5 w-7 h-7 rounded-full bg-[#f1e7e9] flex items-center justify-center text-[#4a0b17] text-[10px]">◉</div>
            <span className="font-bold text-[#4a0b17] block text-[8px]">Secure Checkout</span>
            <span className="text-[7px] text-[#8b8183]">100% safe payments</span>
          </div>
          <div>
            <div className="mx-auto mb-1.5 w-7 h-7 rounded-full bg-[#f1e7e9] flex items-center justify-center text-[#4a0b17] text-[10px]">◌</div>
            <span className="font-bold text-[#4a0b17] block text-[8px]">24/7 Support</span>
            <span className="text-[7px] text-[#8b8183]">Always here to help</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4a0b17] text-[#d9cacc] py-8 px-6 border-t border-[#5d1825]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8">
          <div>
            <div className="mb-3"><Logo /></div>
            <p className="text-[8px] leading-4 max-w-xs text-[#cdbdc0]">
              Your trusted destination for premium lifestyle and authentic Bengali fashion — making everyday life simple and beautiful.
            </p>
          </div>
          <div>
            <span className="text-[#d4af37] font-bold block mb-2 text-[8px]">SHOP</span>
            <ul className="space-y-1 text-[8px] text-[#cdbdc0]">
              <li>Men's Wear</li><li>Women's Wear</li><li>Kids' Wear</li><li>Winter Jackets</li><li>Food</li>
            </ul>
          </div>
          <div>
            <span className="text-[#d4af37] font-bold block mb-2 text-[8px]">COMPANY</span>
            <ul className="space-y-1 text-[8px] text-[#cdbdc0]">
              <li>About Us</li><li>Our Story</li><li>Careers</li><li>Blog</li>
            </ul>
          </div>
          <div>
            <span className="text-[#d4af37] font-bold block mb-2 text-[8px]">SUPPORT</span>
            <ul className="space-y-1 text-[8px] text-[#cdbdc0]">
              <li>Contact</li><li>Shipping</li><li>Returns</li><li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-7 pt-3 border-t border-[#68202c] text-center text-[7px] text-[#bca9ac]">
          © 2026 Sohoj Life. All rights reserved.
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white text-zinc-900 border-l border-zinc-200 h-full p-5 flex flex-col overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h2 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                <ShoppingBag size={15} className="text-[#3F0C13]" />
                Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-black p-1 rounded-lg">
                <X size={17} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 text-xs">Your cart is empty</div>
            ) : (
              <div className="flex-1">
                <div className="space-y-3 my-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-zinc-900 text-[10px] truncate">{item.name}</h4>
                        <p className="text-[#3F0C13] text-[10px] font-bold">{item.price}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-zinc-200 rounded text-zinc-800">
                            <Minus size={10} />
                          </button>
                          <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-zinc-200 rounded text-zinc-800">
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleWhatsAppCheckout} className="space-y-2.5 pt-4 border-t border-zinc-200 text-[10px]">
                  <h3 className="font-bold text-[#3F0C13]">Checkout Details</h3>

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#3F0C13]"
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#3F0C13]"
                    required
                  />

                  <textarea
                    placeholder="Delivery Address"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-50 text-zinc-900 p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#3F0C13] resize-none"
                    required
                  />

                  <div className="flex justify-between items-center font-bold text-xs pt-1">
                    <span className="text-zinc-600">Total:</span>
                    <span className="text-[#3F0C13]">Tk {cartTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle size={15} />
                    Order via WhatsApp
                    <ExternalLink size={13} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

}
