"use client";

import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import Link from "next/link";
import { uploadDemoProducts } from "./seed"; // Seed Script Import

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
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 md:px-8 py-3.5 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-slate-800 border border-slate-700 rounded-xl">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 rounded-full p-0.5 text-[10px] font-bold">🍃</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Sohoj <span className="text-amber-400">Life</span></h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">Elevate Your Style with Luxury Essentials</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* 🟢 ডেমো প্রোডাক্ট আপলোড করার বাটন 🟢 */}
            <button 
              onClick={async () => {
                await uploadDemoProducts();
                fetchStoreProducts();
              }} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-lg transition shadow-md"
            >
              ➕ Upload 40 Products
            </button>

            <button onClick={() => setIsTrackingOpen(true)} className="text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition">
              📦 Track Order
            </button>
            
            <button onClick={() => setIsWishlistOpen(true)} className="relative text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5">
              ❤️ Wishlist
              {wishlist.length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                  {wishlist.length}
                </span>
              )}
            </button>

            <Link href="/admin" className="text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition hidden sm:block">
              Admin Portal
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition text-xs md:text-sm shadow-md">
              🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
            </button>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 text-center border-b border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full transform -translate-y-1/2"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-medium mb-3">
              New Season Collections ✨
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {banners[currentBanner].title}
            </h2>
            <p className="text-slate-300 text-sm md:text-base font-light">{banners[currentBanner].subtitle}</p>
            <div className="flex justify-center gap-2 mt-5">
              {banners.map((_, idx) => (
                <span key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentBanner === idx ? "w-6 bg-amber-400" : "w-2 bg-slate-700"}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full md:w-96 relative">
              <input 
                type="text" 
                placeholder="🔍 আপনার পছন্দের পণ্য সার্চ করুন..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm placeholder-slate-400 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 text-slate-800 text-xs md:text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Top Rated">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {["All", "Men's Wear", "Women's Wear", "Kids' Wear", "Accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition shadow-sm ${
                  selectedCategory === cat 
                    ? "bg-slate-900 text-amber-400 font-semibold shadow-md" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-slate-500 font-medium">Showing {filteredProducts.length} products</p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
              💡 টিপস: চেকআউটে কুপন কোড <strong className="font-bold">EID10</strong> ব্যবহার করে নিন ১০% ছাড়!
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-20 text-slate-500 font-medium">প্রোডাক্ট লোড হচ্ছে...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400">কোনো প্রোডাক্ট পাওয়া যায়নি। উপরের "Upload 40 Products" বাটনে ক্লিক করুন।</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group p-3 text-slate-900 relative"
                >
                  <div>
                    <div className="h-72 overflow-hidden bg-slate-100 relative rounded-xl">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm border border-slate-200/50">
                        {prod.category || "General"}
                      </span>
                      <button 
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow transition text-sm"
                      >
                        {wishlist.includes(prod.id) ? "❤️" : "🤍"}
                      </button>
                      
                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button 
                          onClick={(e) => addToCart(prod, e)} 
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg flex items-center justify-center gap-1 transition"
                        >
                          <span className="text-amber-400 font-bold">+</span> Quick Add
                        </button>
                      </div>
                    </div>

                    <div className="p-2 pt-3">
                      <h3 className="font-semibold text-sm text-slate-900 group-hover:text-amber-600 transition line-clamp-1">{prod.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-amber-500 text-xs">★</span>
                        <span className="text-xs text-slate-500 font-medium">{prod.rating || "4.8"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 pt-2 flex items-center justify-between mt-2 border-t border-slate-100">
                    <span className="text-slate-900 font-extrabold text-lg">৳{prod.price}</span>
                    <button 
                      onClick={(e) => addToCart(prod, e)} 
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl transition text-xs shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer & Feature Badges */}
      <div>
        <section className="bg-white border-t border-b border-slate-200 py-8 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs md:text-sm">Cash on Delivery</h4>
                <p className="text-[11px] text-slate-500">Pay when it arrives</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs md:text-sm">Fast Delivery</h4>
                <p className="text-[11px] text-slate-500">24–72 hrs nationwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs md:text-sm">Secure Checkout</h4>
                <p className="text-[11px] text-slate-500">100% safe payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs md:text-sm">24/7 Support</h4>
                <p className="text-[11px] text-slate-500">Always here to help</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 px-4 md:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Sohoj <span className="text-amber-400">Life</span></h3>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Your trusted destination for premium fashion and authentic Bengali flavours — making everyday life simple and beautiful.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">SHOP</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setSelectedCategory("Men's Wear")} className="hover:text-amber-400 transition">Men's Wear</button></li>
                <li><button onClick={() => setSelectedCategory("Women's Wear")} className="hover:text-amber-400 transition">Women's Wear</button></li>
                <li><button onClick={() => setSelectedCategory("Kids' Wear")} className="hover:text-amber-400 transition">Kids' Wear</button></li>
                <li><button onClick={() => setSelectedCategory("Accessories")} className="hover:text-amber-400 transition">Accessories</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">COMPANY</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-amber-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Our Story</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">SUPPORT</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-amber-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Shipping</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Returns</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
            <p>© 2026 Sohoj Life. All rights reserved.</p>
            <p>Made with care in Bangladesh 🇧🇩</p>
          </div>
        </footer>
      </div>

      {/* Modals & Drawers */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-slate-200">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-3 right-3 bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 transition"
            >
              ✕
            </button>
            <div className="h-80 bg-slate-100 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">{selectedProduct.category}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedProduct.name}</h3>
              <p className="text-2xl font-black text-amber-600 mt-1">৳{selectedProduct.price}</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                প্রিমিয়াম কোয়ালিটির কাপড়ে তৈরি এই প্রোডাক্টটি আপনাকে দেবে সর্বোচ্চ আরাম এবং স্টাইলিশ লুক।
              </p>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition text-sm shadow-md"
                >
                  🛒 Add to Cart
                </button>
                <button 
                  onClick={() => handleWhatsAppOrder(selectedProduct)}
                  className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition text-sm flex items-center gap-1 shadow-md"
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isWishlistOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto text-slate-900 flex flex-col justify-between shadow-2xl border-l border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">❤️ Your Wishlist</h2>
                <button onClick={() => setIsWishlistOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
              </div>

              {wishlistProducts.length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-sm">আপনার উইশলিস্ট খালি!</p>
              ) : (
                <div className="space-y-3">
                  {wishlistProducts.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-xs text-slate-800 line-clamp-1">{item.name}</h4>
                        <p className="text-slate-900 text-xs font-bold mt-0.5">৳{item.price}</p>
                      </div>
                      <button onClick={(e) => addToCart(item, e)} className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold">
                        Cart
                      </button>
                      <button onClick={(e) => toggleWishlist(item.id, e)} className="text-slate-400 hover:text-rose-500 text-sm px-1">
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

      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto text-slate-900 flex flex-col justify-between shadow-2xl border-l border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">🛒 Shopping Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
              </div>

              {orderSuccess ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-lg font-bold text-slate-900">অর্ডার সফল হয়েছে!</h3>
                  <p className="text-xs text-slate-500 mt-2">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
                  <button onClick={() => { setOrderSuccess(false); setIsCartOpen(false); }} className="mt-6 bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md">
                    কেনাকাটা চালিয়ে যান
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-sm">আপনার কার্ট একদম খালি!</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs text-slate-800 line-clamp-1">{item.name}</h4>
                          <p className="text-amber-600 text-xs font-bold mt-0.5">৳{item.price} x {item.qty}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:text-rose-700 text-xs bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                          মুছুন
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="কুপন কোড (যেমন: EID10)" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button onClick={applyCoupon} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs">
                        প্রয়োগ
                      </button>
                    </div>
                    {couponMessage && <p className="text-[11px] mt-2 text-emerald-600 font-medium">{couponMessage}</p>}
                  </div>

                  <form onSubmit={handleCheckout} className="mt-5 space-y-2.5 pt-3 border-t border-slate-100">
                    <h3 className="font-bold text-slate-900 text-xs">ডেলিভারি তথ্য:</h3>
                    <input 
                      type="text" 
                      placeholder="আপনার নাম" 
                      required 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input 
                      type="tel" 
                      placeholder="মোবাইল নম্বর" 
                      required 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <textarea 
                      placeholder="সম্পূর্ণ ঠিকানা" 
                      required 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 h-16"
                    />

                    <div className="pt-2 text-xs space-y-1 text-slate-600">
                      <div className="flex justify-between"><span>Subtotal:</span><span>৳{subtotal}</span></div>
                      {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount:</span><span>-৳{discountAmount}</span></div>}
                      <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
                        <span>Total Amount:</span><span>৳{totalAmount}</span>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={orderSubmitting} 
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition text-xs shadow-md mt-3 disabled:opacity-50"
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

      {isTrackingOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsTrackingOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg">✕</button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">📦 Track Your Order</h3>
            <form onSubmit={handleTrackOrder} className="flex gap-2 mb-4">
              <input 
                type="tel" 
                placeholder="আপনার মোবাইল নম্বর লিখুন" 
                value={trackPhone} 
                onChange={(e) => setTrackPhone(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button type="submit" className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm">
                খুঁজুন
              </button>
            </form>

            {isTrackingLoading ? (
              <p className="text-center text-xs text-slate-500">খোঁজা হচ্ছে...</p>
            ) : trackedOrders.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {trackedOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>অর্ডার # {ord.id.slice(0, 6)}</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">{ord.status}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{ord.itemsSummary}</p>
                    <p className="font-bold text-slate-900 mt-1">মোট: ৳{ord.totalAmount}</p>
                  </div>
                ))}
              </div>
            ) : trackPhone ? (
              <p className="text-center text-xs text-slate-400">কোনো অর্ডার পাওয়া যায়নি।</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
