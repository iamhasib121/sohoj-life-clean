'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, CheckCircle2, ShieldAlert, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';

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

  const [products, setProducts] = useState([
    { id: 1, name: "Premium Cotton Punjabi", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,850", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=500&auto=format&fit=crop" },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: "Men's Wear (মেনস ওয়্যার)",
    price: '',
    image: '',
  });

  const showPopup = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "iamhasib121@gmail.com" && password) {
      setIsAdmin(true);
      showPopup("Logged in successfully!");
    } else {
      setError("Invalid email or password!");
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
            {error && <p className="bg-red-500/20 text-red-200 p-2 rounded mb-4 text-xs">{error}</p>}
            
            <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="iamhasib121@gmail.com" 
                  className="w-full bg-[#3b1014] text-white p-3 rounded-lg border border-white/10" 
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter password" 
                  className="w-full bg-[#3b1014] text-white p-3 rounded-lg border border-white/10" 
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-[#f5d77f] text-[#581c23] py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                <LogIn size={16} /> Login
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#4a151b] p-6 rounded-2xl border border-white/10 shadow-xl h-fit">
              <h2 className="text-sm font-bold text-[#f5d77f] uppercase mb-4 flex items-center gap-1.5">
                <Plus size={16} /> Add Product
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newProduct.name || !newProduct.price || !newProduct.image) return;
                setProducts([{ id: Date.now(), ...newProduct }, ...products]);
                setNewProduct({ name: '', category: categories[0], price: '', image: '' });
                showPopup("Product added!");
              }} className="space-y-4 text-xs">
                <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Price (e.g. Tk 1,200)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                <input type="url" placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                <button type="submit" className="w-full bg-[#f5d77f] text-[#581c23] py-2.5 rounded-lg font-bold">Publish</button>
              </form>
              <button onClick={() => setIsAdmin(false)} className="w-full mt-6 bg-red-500/20 text-red-300 py-2 rounded-lg font-semibold flex items-center justify-center gap-1">
                <LogOut size={14} /> Logout
              </button>
            </div>

            <div className="lg:col-span-2 bg-[#4a151b] p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-sm font-bold text-[#f5d77f] uppercase mb-4">Products List</h2>
              <table className="w-full text-left text-xs text-gray-200">
                <thead className="bg-[#3b1014] text-[#f5d77f] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <span className="font-semibold">{p.name}</span>
                      </td>
                      <td className="p-3 font-bold text-[#f5d77f]">{p.price}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="bg-red-600 p-1.5 rounded-lg text-white">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
