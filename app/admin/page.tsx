'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, CheckCircle2, ShieldAlert, LogIn, LogOut } from 'lucide-react';
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
      showPopup("Logged in successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message); // ফায়ারবেসের আসল এরর মেসেজ স্ক্রিনে দেখাবে
    }
  };

  // Add Product to Firestore
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

      showPopup("Product published to database successfully!");
      setNewProduct({ name: '', category: categories[0], priceNum: '', price: '', image: '' });
    } catch (err) {
      console.error("Error adding product: ", err);
      showPopup("Failed to add product!");
    }
  };

  return (
    <div className="min-h-screen bg-[#581c23] text-white font-sans p-6">
      {notification && (
        <div className="fixed top-5 right-4 z-50 bg-[#f5d77f] text-[#581c23] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold text-[#f5d77f]">Sohoj Life Admin Dashboard</h1>
          <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>

        {!isAdmin ? (
          <div className="max-w-md mx-auto bg-[#4a151b] p-8 rounded-2xl border border-white/10 shadow-2xl text-center mt-12">
            <ShieldAlert size={48} className="mx-auto text-[#f5d77f] mb-4" />
            <h2 className="text-lg font-bold mb-2">Admin Sign In</h2>
            {error && <p className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-xs text-left break-words">{error}</p>}
            
            <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter admin email" className="w-full bg-[#3b1014] text-white p-3 rounded-lg border border-white/10 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full bg-[#3b1014] text-white p-3 rounded-lg border border-white/10 focus:outline-none" required />
              </div>
              <button type="submit" className="w-full bg-[#f5d77f] text-[#581c23] py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#ebd070] transition">
                <LogIn size={16} /> Login
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-xl mx-auto">
            <div className="bg-[#4a151b] p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-sm font-bold text-[#f5d77f] uppercase mb-4 flex items-center gap-1.5">
                <Plus size={16} /> Add Product to Database
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" placeholder="Price Number for sorting (e.g. 1850)" value={newProduct.priceNum} onChange={e => setNewProduct({...newProduct, priceNum: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                <input type="text" placeholder="Display Price (e.g. Tk 1,850)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                <input type="url" placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                <button type="submit" className="w-full bg-[#f5d77f] text-[#581c23] py-2.5 rounded-lg font-bold">Publish to Database</button>
              </form>
              <button onClick={() => setIsAdmin(false)} className="w-full mt-6 bg-red-500/20 text-red-300 py-2 rounded-lg font-semibold flex items-center justify-center gap-1">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
