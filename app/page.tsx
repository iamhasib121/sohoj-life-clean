"use client";

import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  stock?: number;
}

interface CartItem extends Product {
  qty: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  itemsSummary: string;
  totalAmount: number;
  status: string;
}

export default function HomeStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  // Order Tracking
  const [trackPhone, setTrackPhone] = useState("");
  const [trackedOrders, setTrackedOrders] = useState<Order[]>([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Checkout Form
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Hero Slider
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    { title: "Curated for Every Occasion", subtitle: "খাঁটি মানসম্মত লাইফস্টাইল এবং প্রিমিয়াম কালেকশন।" },
    { title: "Exclusive Fashion & Lifestyle", subtitle: "আপনার দৈনন্দিন স্টাইলকে করুন আরও আকর্ষণীয়।" },
    { title: "Sohoj Life Express Delivery", subtitle: "দ্রুততম সময়ে আপনার দোরগোড়ায় পণ্য পৌঁছে দিচ্ছি।" }
  ];

  useEffect(() => {
    fetchStoreProducts();

    const savedWishlist = localStorage.getItem("sohoj_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Error loading wishlist from localStorage", e);
      }
    }

    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(bannerInterval);
  }, []);

  const fetchStoreProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(list);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.includes(productId)
        ? prevWishlist.filter(id => id !== productId)
        : [...prevWishlist, productId];

      localStorage.setItem("sohoj_wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "EID10") {
      setDiscount(0.10);
      setCouponMessage("🎉 অভিনন্দন! ১০% ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে।");
    } else if (code === "SOHOJ20") {
      setDiscount(0.20);
      setCouponMessage("🎉 অভিনন্দন! ২০% ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে।");
    } else {
      setDiscount(0);
      setCouponMessage("❌ ভুল কুপন কোড! (EID10 ব্যবহার করুন)");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = subtotal * discount;
  const totalAmount = Math.round(subtotal - discountAmount);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("আপনার কার্ট খালি!");
    if (!customerName || !phone || !address) return alert("দয়া করে নাম, ফোন নম্বর এবং ঠিকানা পূরণ করুন!");

    setOrderSubmitting(true);
    try {
      const itemsSummary = cart.map(item => `${item.name} (${item.qty} pcs)`).join(", ");

      await addDoc(collection(db, "orders"), {
        customerName,
        phone,
        address,
        itemsSummary,
        subtotal,
        discountAmount,
        totalAmount,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      setOrderSuccess(true);
      setCart([]);
      setDiscount(0);
      setCouponCode("");
    } catch (err: any) {
      alert("অর্ডার করার সময় সমস্যা হয়েছে: " + err.message);
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackPhone) return;
    setIsTrackingLoading(true);
    try {
      const q = query(collection(db, "orders"), where("phone", "==", trackPhone));
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      setTrackedOrders(orders);
    } catch (err) {
      console.error("Error tracking order:", err);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleWhatsAppOrder = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const phoneNumber = "8801700000000";
    const message = encodeURIComponent(`Hello Sohoj Life, I want to order this product:\nName: ${product.name}\nPrice: ৳${product.price}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Top Rated") return (b.rating || 4.5) - (a.rating || 4.5);
    return 0;
  });

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div style={{ backgroundColor: "#22050d", minHeight: "100vh", color: "#ffffff" }}>
      {/* Top Header */}
      <header style={{ backgroundColor: "#330814", borderColor: "rgba(255, 255, 255, 0.2)" }} className="border-b sticky top-0 z-40 px-4 md:px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: "#4a0d1e", borderColor: "rgba(255, 255, 255, 0.3)" }} className="relative p-2 rounded-xl border">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full p-0.5 text-[10px]">🍃</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-amber-400">Sohoj Life</h1>
            <p className="text-xs text-gray-300">Elevate Your Style with Luxury Essentials</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setIsTrackingOpen(true)} style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.3)" }} className="text-xs text-white px-3 py-2 rounded-lg border transition hover:bg-white/20">
            📦 Track Order
          </button>
          
          <button onClick={() => setIsWishlistOpen(true)} style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.3)" }} className="relative text-white px-3 py-2 rounded-lg border transition hover:bg-white/20 flex items-center gap-1 text-xs">
            ❤️ Wishlist
            {wishlist.length > 0 && (
              <span className="bg-amber-500 text-black font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {wishlist.length}
              </span>
            )}
          </button>

          <Link href="/admin" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.3)" }} className="text-xs text-white px-3 py-2 rounded-lg border transition hover:bg-white/20">
            Admin Portal
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 relative transition text-sm shadow-md">
            🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(to right, #4a0d1e, #22050d)", borderColor: "rgba(255, 255, 255, 0.15)" }} className="py-12 px-4 text-center border-b transition-all duration-500">
        <h2 className="text-2xl md:text-4xl font-extrabold text-amber-400 mb-2">{banners[currentBanner].title}</h2>
        <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base">{banners[currentBanner].subtitle}</p>
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, idx) => (
            <span key={idx} className={`h-2 rounded-full transition-all duration-300 ${currentBanner === idx ? "w-6 bg-amber-400" : "w-2 bg-amber-900"}`} />
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-96">
            <input 
              type="text" 
              placeholder="🔍 আপনার পছন্দের পণ্য সার্চ করুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: "#330814", borderColor: "#ffffff" }}
              className="w-full p-3 rounded-xl border-2 text-white text-sm focus:outline-none focus:border-amber-400 shadow-sm placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-white font-semibold">Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ backgroundColor: "#330814", borderColor: "#ffffff" }}
              className="border-2 text-white text-sm px-4 py-2 rounded-xl focus:outline-none focus:border-amber-400"
            >
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Top Rated">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {["All", "Men's Wear", "Women's Wear", "Kids' Wear", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={selectedCategory === cat ? {} : { backgroundColor: "#330814", borderColor: "rgba(255, 255, 255, 0.7)" }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === cat ? "bg-amber-500 text-black shadow-lg" : "text-white border hover:bg-white/10"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-gray-400">Showing {filteredProducts.length} products</p>
          <p className="text-xs text-amber-300">💡 টিপস: চেকআউটে কুপন কোড **EID10** ব্যবহার করে নিন ১০% ছাড়!</p>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-amber-300">প্রোডাক্ট লোড হচ্ছে...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">কোনো প্রোডাক্ট পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id} 
                onClick={() => setSelectedProduct(prod)}
                className="bg-white rounded-3xl overflow-hidden border border-amber-100 flex flex-col justify-between shadow-xl transition cursor-pointer group p-3 text-gray-900 relative"
              >
                <div>
                  <div className="h-72 overflow-hidden bg-gray-100 relative rounded-2xl">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-sm">
                      {prod.category || "Panjabi"}
                    </span>
                    <button 
                      onClick={(e) => toggleWishlist(prod.id, e)}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow transition text-lg"
                    >
                      {wishlist.includes(prod.id) ? "❤️" : "🤍"}
                    </button>
                    <div className="absolute inset-x-4 bottom-4">
                      <button 
                        onClick={(e) => addToCart(prod, e)} 
                        className="w-full bg-white hover:bg-gray-50 text-[#4a0d1e] font-semibold py-3 rounded-full text-sm shadow-md flex items-center justify-center gap-1.5 transition border border-gray-100"
                      >
                        <span className="text-lg font-bold">+</span> Quick Add
                      </button>
                    </div>
                  </div>

                  <div className="p-3 pt-4">
                    <h3 className="font-semibold text-base text-gray-900 group-hover:text-[#4a0d1e] transition line-clamp-1">{prod.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-amber-500 text-sm">★</span>
                      <span className="text-xs text-gray-700 font-medium">{prod.rating || "4.7"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-2 flex items-center justify-between mt-2 border-t border-gray-100">
                  <span className="text-[#4a0d1e] font-bold text-xl">৳{prod.price}</span>
                  <button 
                    onClick={(e) => addToCart(prod, e)} 
                    className="bg-[#4a0d1e] hover:bg-[#330814] text-white font-medium px-4 py-2.5 rounded-xl transition text-xs shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-bold z-10"
            >
              ✕
            </button>
            <div className="h-80 bg-gray-100 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">{selectedProduct.category}</span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{selectedProduct.name}</h3>
              <p className="text-2xl font-bold text-[#4a0d1e] mt-2">৳{selectedProduct.price}</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                প্রিমিয়াম কোয়ালিটির কাপড়ে তৈরি এই প্রোডাক্টটি আপনাকে দেবে সর্বোচ্চ আরাম এবং স্টাইলিশ লুক।
              </p>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 bg-[#4a0d1e] text-white py-3 rounded-xl font-bold hover:bg-[#330814] transition"
                >
                  🛒 Add to Cart
                </button>
                <button 
                  onClick={() => handleWhatsAppOrder(selectedProduct)}
                  className="bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-1"
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
          <div className="bg-[#330814] border-l border-white/20 w-full max-w-md h-full p-6 overflow-y-auto text-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                <h2 className="text-xl font-bold text-amber-400">❤️ Your Wishlist</h2>
                <button onClick={() => setIsWishlistOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>

              {wishlistProducts.length === 0 ? (
                <p className="text-center text-gray-400 py-10">আপনার উইশলিস্ট খালি!</p>
              ) : (
                <div className="space-y-4">
                  {wishlistProducts.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-[#4a0d1e]/50 p-3 rounded-xl border border-white/20">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-amber-400 text-sm font-bold">৳{item.price}</p>
                      </div>
                      <button onClick={(e) => addToCart(item, e)} className="bg-amber-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold">
                        Cart
                      </button>
                      <button onClick={(e) => toggleWishlist(item.id, e)} className="text-red-400 hover:text-red-300 text-sm">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer & Checkout */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
          <div className="bg-[#330814] border-l border-white/20 w-full max-w-md h-full p-6 overflow-y-auto text-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                <h2 className="text-xl font-bold text-amber-400">🛒 Shopping Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>

              {orderSuccess ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-amber-400">অর্ডার সফল হয়েছে!</h3>
                  <p className="text-sm text-gray-300 mt-2">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
                  <button onClick={() => { setOrderSuccess(false); setIsCartOpen(false); }} className="mt-6 bg-amber-500 text-black font-bold px-6 py-2.5 rounded-xl text-sm">
                    কেনাকাটা চালিয়ে যান
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-center text-gray-400 py-10">আপনার কার্ট একদম খালি!</p>
              ) : (
                <>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-[#4a0d1e]/50 p-3 rounded-xl border border-white/20">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-amber-400 text-sm font-bold">৳{item.price} x {item.qty}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-xs bg-red-950/40 p-2 rounded-lg">
                          মুছে ফেলুন
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="কুপন কোড (যেমন: EID10)" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-[#22050d] border border-white/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <button onClick={applyCoupon} className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-4 py-2 rounded-xl text-xs">
                        প্রয়োগ
                      </button>
                    </div>
                    {couponMessage && <p className="text-xs mt-2 text-amber-300">{couponMessage}</p>}
                  </div>

                  {/* Order Form */}
                  <form onSubmit={handleCheckout} className="mt-6 space-y-3 pt-4 border-t border-white/20">
                    <h3 className="font-bold text-amber-400 text-sm">ডেলিভারি তথ্য:</h3>
                    <input 
                      type="text" 
                      placeholder="আপনার নাম" 
                      required 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#22050d] border border-white/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <input 
                      type="tel" 
                      placeholder="মোবাইল নম্বর" 
                      required 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#22050d] border border-white/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <textarea 
                      placeholder="সম্পূর্ণ ঠিকানা" 
                      required 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#22050d] border border-white/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none h-20"
                    />

                    <div className="pt-2 text-xs space-y-1 text-gray-300">
                      <div className="flex justify-between"><span>Subtotal:</span><span>৳{subtotal}</span></div>
                      {discount > 0 && <div className="flex justify-between text-amber-400"><span>Discount:</span><span>-৳{discountAmount}</span></div>}
                      <div className="flex justify-between font-bold text-sm text-amber-400 pt-1 border-t border-white/20">
                        <span>Total:</span><span>৳{totalAmount}</span>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={orderSubmitting} 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition text-sm shadow-lg mt-4 disabled:opacity-50"
                    >
                      {orderSubmitting ? "অর্ডার প্রসেস হচ্ছে..." : `অর্ডার নিশ্চিত করুন (৳${totalAmount})`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Track Order Modal */}
      {isTrackingOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#330814] border border-white/20 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsTrackingOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <h3 className="text-xl font-bold text-amber-400 mb-4">📦 Track Your Order</h3>
            <form onSubmit={handleTrackOrder} className="flex gap-2 mb-6">
              <input 
                type="tel" 
                placeholder="আপনার মোবাইল নম্বর লিখুন" 
                value={trackPhone} 
                onChange={(e) => setTrackPhone(e.target.value)}
                className="flex-1 bg-[#22050d] border border-white/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="bg-amber-500 text-black font-bold px-4 py-2.5 rounded-xl text-xs">
                খুঁজুন
              </button>
            </form>

            {isTrackingLoading ? (
              <p className="text-center text-xs text-amber-200">খোঁজা হচ্ছে...</p>
            ) : trackedOrders.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {trackedOrders.map((ord) => (
                  <div key={ord.id} className="bg-[#22050d] p-3 rounded-xl border border-white/20 text-xs">
                    <div className="flex justify-between font-bold text-amber-400">
                      <span>অর্ডার # {ord.id.slice(0, 6)}</span>
                      <span className="bg-amber-900/50 px-2 py-0.5 rounded text-[10px]">{ord.status}</span>
                    </div>
                    <p className="text-gray-300 mt-1">{ord.itemsSummary}</p>
                    <p className="font-bold text-white mt-1">মোট: ৳{ord.totalAmount}</p>
                  </div>
                ))}
              </div>
            ) : trackPhone ? (
              <p className="text-center text-xs text-gray-400">কোনো অর্ডার পাওয়া যায়নি।</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
