'use client';

import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ShoppingBag, Trash2, Plus, LogOut, Lock, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  priceNum: number;
  price: string;
  image: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Dashboard States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState("Men's Wear (মেনস ওয়্যার)");
  const [priceNum, setPriceNum] = useState('');
  const [image, setImage] = useState('');

  const categories = [
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        fetchProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError("লগইন ব্যর্থ হয়েছে! ইমেল বা পাসওয়ার্ড সঠিক নয়।");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const list: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceNum || !image) {
      alert("দয়া করে সব ফিল্ড পূরণ করুন।");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        category,
        priceNum: Number(priceNum),
        price: `Tk ${Number(priceNum).toLocaleString()}`,
        image
      });
      alert("প্রোডাক্ট সফলভাবে যোগ করা হয়েছে!");
      setName('');
      setPriceNum('');
      setImage('');
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("প্রোডাক্ট যোগ করতে সমস্যা হয়েছে।");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি ডিলিট করতে চান?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#2D060B] flex items-center justify-center text-[#D4AF37]">Loading...</div>;
  }

  // ইউজার লগইন করা না থাকলে সুন্দর লগইন পেজ দেখাবে
  if (!user) {
    return (
      <div className="min-h-screen bg-[#2D060B] flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full bg-[#3F060D] border border-[#5C111C] p-8 rounded-2xl shadow-2xl text-white">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full mb-3">
              <Lock size={24} />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Admin Login</h1>
            <p className="text-xs text-zinc-400 mt-1">Sohoj Life Management Portal</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs mb-4 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sohojlife.com"
                  className="w-full bg-[#2D060B] text-white pl-10 pr-4 py-3 rounded-xl border border-[#5C111C] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#2D060B] text-white pl-10 pr-4 py-3 rounded-xl border border-[#5C111C] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#c29d30] text-black font-black py-3 rounded-xl transition shadow-lg mt-2 cursor-pointer"
            >
              Login to Dashboard
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-zinc-400 hover:text-[#D4AF37] text-xs flex items-center justify-center gap-1.5 transition">
              <ArrowLeft size={14} /> Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // লগইন করা থাকলে ড্যাশবোর্ড দেখাবে
  return (
    <div className="min-h-screen bg-[#2D060B] text-white font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#3F060D] border border-[#5C111C] p-4 rounded-2xl mb-8 shadow-lg">
          <Link href="/" className="text-zinc-300 hover:text-[#D4AF37] text-xs flex items-center gap-1.5 font-medium transition">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <h1 className="text-sm md:text-base font-black text-[#D4AF37] flex items-center gap-2">
            <ShoppingBag size={18} /> Sohoj Life Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-500/20 transition cursor-pointer"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Add Product Form */}
        <div className="bg-[#3F060D] border border-[#5C111C] p-6 rounded-2xl mb-8 shadow-xl">
          <h2 className="text-sm font-black text-[#D4AF37] mb-4 flex items-center gap-2">
            <Plus size={16} /> Add New Product
          </h2>
          
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 mb-1">Product Name</label>
              <input 
                type="text" 
                placeholder="e.g. Premium Panjabi" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#2D060B] text-white p-3 rounded-xl border border-[#5C111C] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#2D060B] text-white p-3 rounded-xl border border-[#5C111C] focus:outline-none focus:border-[#D4AF37]"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="blocktext-zinc-300 mb-1">Price (Number only, e.g. 1850)</label>
              <input 
                type="number" 
                placeholder="1850" 
                value={priceNum} 
                onChange={e => setPriceNum(e.target.value)}
                className="w-full bg-[#2D060B] text-white p-3 rounded-xl border border-[#5C111C] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1">Image URL (Unsplash or direct link)</label>
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/..." 
                value={image} 
                onChange={e => setImage(e.target.value)}
                className="w-full bg-[#2D060B] text-white p-3 rounded-xl border border-[#5C111C] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button 
                type="submit" 
                className="w-full bg-[#D4AF37] hover:bg-[#c29d30] text-black font-black py-3.5 rounded-xl shadow transition cursor-pointer"
              >
                Save Product to Database
              </button>
            </div>
          </form>
        </div>

        {/* Existing Products List */}
        <div className="bg-[#3F060D] border border-[#5C111C] p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-black text-[#D4AF37] mb-4">
            Manage Existing Products ({products.length})
          </h2>

          {loading ? (
            <p className="text-zinc-400 text-xs text-center py-6">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-zinc-400 text-xs text-center py-6">No products found in database.</p>
          ) : (
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between bg-[#2D060B] p-3 rounded-xl border border-[#5C111C]">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{product.name}</h4>
                      <p className="text-[#D4AF37] text-[11px]">{product.price} • <span className="text-zinc-400">{product.category}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
