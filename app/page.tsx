"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase"; // আপনার ফায়ারবেস পাথ ঠিক রাখবেন
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function HomeStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Checkout Form States
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchStoreProducts();
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

  // Add to Cart
  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  // Remove from Cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Total Calculation
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Handle Order Submit
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
        totalAmount,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      setOrderSuccess(true);
      setCart([]);
    } catch (err: any) {
      alert("অর্ডার করার সময় সমস্যা হয়েছে: " + err.message);
    } finally {
      setOrderSubmitting(false);
    }
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#22050d] text-white">
      {/* Top Header */}
      <header className="bg-[#330814] border-b border-amber-900/40 sticky top-0 z-40 px-4 md:px-8 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-amber-400">Sohoj Life</h1>
          <p className="text-xs text-amber-200/70">Elevate Your Style with Luxury Essentials</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xs bg-amber-900/30 hover:bg-amber-900/60 text-amber-200 px-3 py-2 rounded-lg border border-amber-600/30">
            Admin Portal
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 relative transition"
          >
            🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#4a0d1e] to-[#22050d] py-12 px-4 text-center border-b border-amber-900/30">
        <h2 className="text-3xl md:text-5xl font-extrabold text-amber-400 mb-3">Curated for Every Occasion</h2>
        <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base">খাঁটি মানসম্মত লাইফস্টাইল এবং প্রিমিয়াম কালেকশন এখন আপনার হাতের মুঠোয়।</p>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-2 justify-center">
        {["All", "Men's Wear", "Women's Wear", "Kids' Wear", "Accessories"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === cat ? "bg-amber-500 text-black" : "bg-[#330814] text-amber-200 border border-amber-900/40"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Products Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20 text-amber-300">প্রোডাক্ট লোড হচ্ছে...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে প্রোডাক্ট যোগ করুন।</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-[#330814] rounded-xl overflow-hidden border border-amber-600/30 flex flex-col justify-between shadow-lg hover:border-amber-400 transition">
                <div>
                  <div className="h-48 overflow-hidden bg-black/40">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-amber-400 bg-amber-950/60 px-2 py-1 rounded">{prod.category}</span>
                    <h3 className="font-bold text-lg text-white mt-2">{prod.name}</h3>
                    <p className="text-amber-200 font-semibold mt-1">৳{prod.price}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button 
                    onClick={() => addToCart(prod)} 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg transition text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* SLIDE-OVER CART & CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#330814] h-full p-6 flex flex-col justify-between border-l border-amber-600/35 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-amber-900/50 pb-4">
                <h2 className="text-xl font-bold text-amber-400">Your Shopping Cart</h2>
                <button onClick={() => { setIsCartOpen(false); setOrderSuccess(false); }} className="text-gray-400 hover:text-white text-lg font-bold">✕</button>
              </div>

              {orderSuccess ? (
                <div className="bg-green-500/20 border border-green-500 text-green-300 p-6 rounded-xl text-center my-12">
                  <h3 className="text-xl font-bold mb-2">🎉 অর্ডার সফল হয়েছে!</h3>
                  <p className="text-sm">খুব শীঘ্রই আমাদের প্রতিনিধি আপনার দেওয়া নম্বরে যোগাযোগ করবেন। ধন্যবাদ!</p>
                  <button onClick={() => { setOrderSuccess(false); setIsCartOpen(false); }} className="mt-6 bg-amber-500 text-black font-bold px-6 py-2 rounded-lg">
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

                  <div className="border-t border-amber-900/50 pt-4 mt-6">
                    <div className="flex justify-between font-bold text-lg text-amber-300 mb-6">
                      <span>Total:</span>
                      <span>৳{totalAmount}</span>
                    </div>

                    {/* Checkout Form */}
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
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition text-sm mt-2"
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
