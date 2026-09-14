"use client";

import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

// TypeScript Interfaces
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
    
    // LocalStorage থেকে উইশলিস্ট লোড
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

  // Safe Cart Update
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

  // Wishlist Toggle Logic
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
          <button onClick={() => setIsTrackingOpen(true)} className="text-xs bg-amber-900/30 hover:bg-amber-900/60 text-amber-200 px-3 py-2 rounded-lg border border-amber-600/35 transition">
            📦 Track Order
          </button>
          
          <button onClick={() => setIsWishlistOpen(true)} className="relative bg-amber-900/30 hover:bg-amber-900/60 text-amber-200 px-3 py-2 rounded-lg border border-amber-600/35 transition flex items-center gap-1 text-xs">
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

          <button onClick={() => setIsCartOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 relative transition text-sm shadow-md">
            🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#4a0d1e] to-[#22050d] py-12 px-4 text-center border-b border-amber-900/30 transition-all duration-500">
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
    </div>
  );
}
