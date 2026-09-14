"use client";

import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import Link from "next/link";

export default function HomeStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  
  // Real Wishlist State (LocalStorage দিয়ে সেভ করা থাকবে)
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");

  // Coupon & Discount States
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  // Order Tracking States
  const [trackPhone, setTrackPhone] = useState("");
  const [trackedOrders, setTrackedOrders] = useState<any[]>([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Product Details Modal State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Checkout Form States
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Hero Slider Banner Index
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    { title: "Curated for Every Occasion", subtitle: "খাঁটি মানসম্মত লাইফস্টাইল এবং প্রিমিয়াম কালেকশন।" },
    { title: "Exclusive Fashion & Lifestyle", subtitle: "আপনার দৈনন্দিন স্টাইলকে করুন আরও আকর্ষণীয়।" },
    { title: "Sohoj Life Express Delivery", subtitle: "দ্রুততম সময়ে আপনার দোরগোড়ায় পণ্য পৌঁছে দিচ্ছি।" }
  ];

  useEffect(() => {
    fetchStoreProducts();
    // LocalStorage থেকে আগের সেভ করা উইশলিস্ট লোড করা
    const savedWishlist = localStorage.getItem("sohoj_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
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
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updatedWishlist;
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter(id => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("sohoj_wishlist", JSON.stringify(updatedWishlist));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "EID10") {
      setDiscount(0.10);
      setCouponMessage("🎉 অভিনন্দন! ১০% ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে।");
    } else if (couponCode.toUpperCase() === "SOHOJ20") {
      setDiscount(0.20);
      setCouponMessage("🎉 অভিনন্দন! ২০% ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে।");
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
    if (cart.length === 0) {
      alert("আপনার কার্ট খালি!");
      return;
    }
    if (!customerName || !phone || !address) {
      alert("দয়া করে নাম, ফোন নম্বর এবং ঠিকানা পূরণ করুন!");
      return;
    }

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
      alert("অর্ডার করার সময় সমস্যা হয়েছে: " + err.message);
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
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrackedOrders(orders);
    } catch (err) {
      console.error("Error tracking order:", err);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleWhatsAppOrder = (product: any, e?: React.MouseEvent) => {
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
    <div className="min-h-screen bg-[#22050d] text-white">
      {/* Top Header */}
      <header className="bg-[#330814] border-b border-amber-900/40 sticky top-0 z-40 px-4 md:px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative bg-[#4a0d1e] p-2 rounded-xl border border-amber-600/40">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full p-0.5 text-[10px]">🍃</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-amber-400">Sohoj Life</h1>
            <p className="text-xs text-amber-200/70">Elevate Your Style with Luxury Essentials</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsTrackingOpen(true)}
            className="text-xs bg-amber-900/30 hover:bg-amber-900/60 text-amber-200 px-3 py-2 rounded-lg border border-amber-600/35 transition"
          >
            📦 Track Order
          </button>
          
          {/* Wishlist Button with Badge */}
          <button 
            onClick={() => setIsWishlistOpen(true)}
            className="relative bg-amber-900/30 hover:bg-amber-900/60 text-amber-200 px-3 py-2 rounded-lg border border-amber-600/35 transition flex items-center gap-1 text-xs"
          >
            ❤️ Wishlist
            {wishlist.length > 0 && (
              <span className="bg-amber-500 text-black font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {wishlist.length}
              </span>
            )}
          </button>

          <Link href="/admin" className="text-xs bg-amber-900/30 hover:bg-amber-900/60 text-amber-200 px-3 py-2 rounded-lg border border-amber-600/35 transition">
            Admin Portal
          </Link>

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 relative transition text-sm shadow-md"
          >
            🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </button>
        </div>
      </header>

      {/* Hero Slider Banner */}
      <div className="bg-gradient-to-r from-[#4a0d1e] to-[#22050d] py-12 px-4 text-center border-b border-amber-900/30 transition-all duration-500">
        <h2 className="text-2xl md:text-4xl font-extrabold text-amber-400 mb-2">{banners[currentBanner].title}</h2>
        <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base">{banners[currentBanner].subtitle}</p>
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, idx) => (
            <span key={idx} className={`h-2 rounded-full transition-all duration-300 ${currentBanner === idx ? "w-6 bg-amber-400" : "w-2 bg-amber-900"}`} />
          ))}
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-96">
            <input 
              type="text" 
              placeholder="🔍 আপনার পছন্দের পণ্য সার্চ করুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#330814] border border-amber-600/40 text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-amber-200 font-semibold">Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#330814] border border-amber-600/40 text-amber-200 text-sm px-4 py-2 rounded-xl focus:outline-none focus:border-amber-400"
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
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === cat ? "bg-amber-500 text-black shadow-lg" : "bg-[#330814] text-amber-200 border border-amber-900/40 hover:border-amber-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Products Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-gray-400">Showing {filteredProducts.length} products</p>
          <p className="text-xs text-amber-300">💡 টিপস: চেকআউটে কুপন কোড **EID10** ব্যবহার করে নিন ১০% ছাড়!</p>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-amber-300">প্রোডাক্ট লোড হচ্ছে...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">কোনো প্রোডাক্ট পাওয়া যায়নি।</div>
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

                    {/* Wishlist Heart Button */}
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

      {/* WISHLIST DRAWER MODAL */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#330814] h-full p-6 flex flex-col justify-between border-l border-amber-600/35 overflow-y-auto shadow-2xl text-white">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-amber-900/50 pb-4">
                <h2 className="text-xl font-bold text-amber-400">❤️ Your Wishlist ({wishlistProducts.length})</h2>
                <button onClick={() => setIsWishlistOpen(false)} className="text-gray-400 hover:text-white text-lg font-bold">✕</button>
              </div>

              {wishlistProducts.length === 0 ? (
                <p className="text-gray-400 text-center py-12">আপনার উইশলিস্টে কোনো প্রডাক্ট নেই।</p>
              ) : (
                <div className="space-y-4">
                  {wishlistProducts.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#22050d] p-3 rounded-lg border border-amber-900/40">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <h4 className="font-semibold text-sm text-amber-200 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-amber-300 font-bold">৳{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { addToCart(item); }} 
                          className="bg-amber-500 hover:bg-amber-600 text-black text-xs px-3 py-1.5 rounded font-bold shadow"
                        >
                          Add
                        </button>
                        <button 
                          onClick={(e) => toggleWishlist(item.id, e)} 
                          className="text-red-400 hover:text-red-300 text-sm font-bold p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsWishlistOpen(false)} 
              className="mt-6 w-full bg-[#22050d] border border-amber-600/40 text-amber-300 py-2.5 rounded-xl text-sm font-semibold"
            >
              Close Wishlist
            </button>
          </div>
        </div>
      )}

      {/* ORDER TRACKING MODAL */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#330814] border border-amber-600/40 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setIsTrackingOpen(false); setTrackedOrders([]); setTrackPhone(""); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold bg-[#22050d] w-8 h-8 rounded-full flex items-center justify-center border border-amber-900/40"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-amber-400 mb-4">📦 Order Tracking</h2>
            <p className="text-xs text-gray-300 mb-4">আপনার অর্ডার বর্তমান অবস্থা দেখতে আপনার মোবাইল নম্বরটি লিখুন:</p>
            
            <form onSubmit={handleTrackOrder} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="মোবাইল নম্বর (Phone Number)" 
                value={trackPhone} 
                onChange={(e) => setTrackPhone(e.target.value)} 
                className="flex-1 p-2.5 rounded-xl bg-[#22050d] border border-amber-600/40 text-sm text-white"
                required 
              />
              <button 
                type="submit" 
                disabled={isTrackingLoading}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition"
              >
                {isTrackingLoading ? "Searching..." : "Track"}
              </button>
            </form>

            {trackedOrders.length > 0 ? (
              <div className="space-y-4">
                {trackedOrders.map((ord) => (
                  <div key={ord.id} className="bg-[#22050d] p-4 rounded-xl border border-amber-900/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-amber-400 font-semibold">অর্ডার আইডি: {ord.id.slice(0, 8)}...</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${ord.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'}`}>
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">{ord.itemsSummary}</p>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 border-t border-amber-900/30 pt-2">
                      <span>রিসিভার: {ord.customerName}</span>
                      <span className="text-amber-300 font-bold">মোট: ৳{ord.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : trackPhone && !isTrackingLoading ? (
              <p className="text-center text-gray-400 py-6">এই নম্বরে কোনো অর্ডার পাওয়া যায়নি।</p>
            ) : null}
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#330814] border border-amber-600/40 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl text-white">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold bg-[#22050d] w-8 h-8 rounded-full flex items-center justify-center border border-amber-900/40"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full md:w-48 h-48 object-cover rounded-xl border border-amber-900/40" />
              <div>
                <span className="text-xs text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded">{selectedProduct.category}</span>
                <h2 className="text-xl font-bold text-white mt-2">{selectedProduct.name}</h2>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-400">★</span>
                  <span className="text-xs text-gray-300">{selectedProduct.rating || "4.7"} / 5.0</span>
                </div>
                <p className="text-2xl font-extrabold text-amber-300 mt-1">৳{selectedProduct.price}</p>
                <p className="text-sm text-gray-300 mt-2">স্টক স্ট্যাটাস: <span className="text-green-400 font-semibold">{selectedProduct.stock || 10} পিস এভেইলেবল</span></p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl text-sm transition shadow-lg"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => handleWhatsAppOrder(selectedProduct)} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-xl text-sm transition shadow-lg"
              >
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER CART & CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#330814] h-full p-6 flex flex-col justify-between border-l border-amber-600/35 overflow-y-auto shadow-2xl text-white">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-amber-900/50 pb-4">
                <h2 className="text-xl font-bold text-amber-400">Your Shopping Cart</h2>
                <button onClick={() => { setIsCartOpen(false); setOrderSuccess(false); }} className="text-gray-400 hover:text-white text-lg font-bold">✕</button>
              </div>

              {orderSuccess ? (
                <div className="bg-green-500/20 border border-green-500 text-green-300 p-6 rounded-xl text-center my-12 shadow-lg">
                  <h3 className="text-xl font-bold mb-2">🎉 অর্ডার সফল হয়েছে!</h3>
                  <p className="text-sm">খুব শীঘ্রই আমাদের প্রতিনিধি আপনার দেওয়া নম্বরে যোগাযোগ করবেন। ধন্যবাদ!</p>
                  <button onClick={() => { setOrderSuccess(false); setIsCartOpen(false); }} className="mt-6 bg-amber-500 text-black font-bold px-6 py-2 rounded-lg shadow-md">
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-gray-400 text-center py-12">আপনার কার্ট খালি রয়েছে।</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#22050d] p-3 rounded-lg border border-amber-900/40">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <h4 className="font-semibold text-sm text-amber-200">{item.name}</h4>
                          <p className="text-xs text-gray-400">৳{item.price} × {item.qty}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-sm font-bold p-1">🗑️</button>
                    </div>
                  ))}

                  <div className="bg-[#22050d] p-3 rounded-xl border border-amber-900/40 mt-4">
                    <label className="text-xs font-bold text-amber-300 block mb-2">Have a Promo Code? (Use EID10)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter Code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 p-2 rounded bg-[#330814] border border-amber-600/40 text-xs text-white uppercase"
                      />
                      <button 
                        onClick={applyCoupon}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-2 rounded text-xs transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && <p className="text-[11px] mt-2 font-medium text-amber-300">{couponMessage}</p>}
                  </div>

                  <div className="border-t border-amber-900/50 pt-4 mt-6 space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Subtotal:</span>
                      <span>৳{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-xs text-green-400">
                        <span>Discount ({discount * 100}%):</span>
                        <span>-৳{Math.round(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-amber-300 mb-6 pt-2 border-t border-amber-900/30">
                      <span>Total:</span>
                      <span>৳{totalAmount}</span>
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-3">
                      <h3 className="text-sm font-bold text-amber-400 mb-2">Checkout Details (Cash on Delivery)</h3>
                      <input 
                        type="text" 
                        placeholder="আপনার নাম (Full Name)" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                        className="w-full p-2.5 rounded bg-[#22050d] border border-amber-600/40 text-sm text-white"
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="মোবাইল নম্বর (Phone Number)" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="w-full p-2.5 rounded bg-[#22050d] border border-amber-600/40 text-sm text-white"
                        required 
                      />
                      <textarea 
                        placeholder="ডেলিভারি ঠিকানা (Full Address)" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        rows={2} 
                        className="w-full p-2.5 rounded bg-[#22050d] border border-amber-600/40 text-sm text-white"
                        required 
                      />
                      <button 
                        type="submit" 
                        disabled={orderSubmitting}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition text-sm mt-2 shadow-lg"
                      >
                        {orderSubmitting ? "Processing..." : "Confirm Order (COD)"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
