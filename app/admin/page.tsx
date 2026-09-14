'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, CheckCircle2, ShieldAlert, LogIn, LogOut, PackagePlus, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const categories = [
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: "Men's Wear (মেনস ওয়্যার)",
    priceNum: '',
    price: '',
    image: '',
  });

  const showPopup = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(true);
      showPopup("Welcome back, Admin!");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) return;

    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        category: newProduct.category,
        priceNum: Number(newProduct.priceNum) || 1000,
        price: newProduct.price,
        image: newProduct.image,
        createdAt: new Date()
      });

      showPopup("Product published successfully!");
      setNewProduct({ name: '', category: categories[0], priceNum: '', price: '', image: '' });
    } catch (err) {
      console.error("Error adding product: ", err);
      showPopup("Failed to publish product!");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans p-6 md:p-10">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3.5 rounded-2xl shadow-2xl shadow-amber-500/20 flex items-center gap-3 text-sm font-bold backdrop-blur-md animate-fade-in border border-amber-400">
          <CheckCircle2 size={20} />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">Sohoj Life <span className="text-amber-400">Admin</span></h1>
              <p className="text-xs text-slate-400">Manage your store products and inventory seamlessly</p>
            </div>
          </div>
          <Link href="/" className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700/60 transition shadow-lg">
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>

        {!isAdmin ? (
          /* Login Card */
          <div className="max-w-md mx-auto bg-slate-900/90 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl shadow-black/50 backdrop-blur-xl mt-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600"></div>
            
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-inner">
                <ShieldAlert size={28} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Admin Authentication</h2>
              <p className="text-xs text-slate-400 mt-1">Please enter your credentials to access the control panel</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl mb-6 text-xs text-left break-words flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5 text-xs text-left">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Admin Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  className="w-full bg-slate-950/80 text-white px-4 py-3.5 rounded-xl border border-slate-800 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition text-sm" 
                  required 
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-slate-950/80 text-white px-4 py-3.5 rounded-xl border border-slate-800 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition text-sm" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-amber-300 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20 text-sm mt-2"
              >
                <LogIn size={16} /> Secure Login
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard Content Card */
          <div className="max-w-xl mx-auto bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600"></div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <PackagePlus size={18} /> Add New Product
              </h2>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">Live Database Connected</span>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Premium Cotton Panjabi" 
                  value={newProduct.name} 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                  className="w-full bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm" 
                  required 
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Category</label>
                <select 
                  value={newProduct.category} 
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                  className="w-full bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500/60 focus:outline-none text-sm"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Price Number (For Sorting)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1850" 
                    value={newProduct.priceNum} 
                    onChange={e => setNewProduct({...newProduct, priceNum: e.target.value})} 
                    className="w-full bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500/60 focus:outline-none text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Display Price</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tk 1,850" 
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                    className="w-full bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500/60 focus:outline-none text-sm" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Product Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/image.jpg" 
                  value={newProduct.image} 
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})} 
                  className="w-full bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500/60 focus:outline-none text-sm" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 py-3.5 rounded-xl font-extrabold hover:from-amber-300 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20 text-sm tracking-wide mt-2"
              >
                Publish Product to Store
              </button>
            </form>

            <button 
              onClick={() => setIsAdmin(false)} 
            className="w-full mt-6 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-xs"
            >
              <LogOut size={15} /> Logout Admin Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
