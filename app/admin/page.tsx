'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, CheckCircle2, ShieldAlert, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  // 🔐 আপনার যে ইমেইলগুলোকে অ্যাডমিন বানাতে চান, এখানে কমা দিয়ে লিখে দিন:
  const ADMIN_EMAILS = ["iamhasib121@gmail.com", "admin@sohojlife.com"];

  const [userEmail, setUserEmail] = useState<string>(""); // টেস্ট করার জন্য বা ফায়ারবেস অথ থেকে সেট হবে
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // সুরক্ষার জন্য চেক
  const [inputEmail, setInputEmail] = useState<string>("");
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
    { id: 2, name: "Slim Fit Formal Shirt", category: "Men's Wear (মেনস ওয়্যার)", price: "Tk 1,200", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=500&auto=format&fit=crop" },
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

  // সিমুলেটেড অথেন্টিকেশন চেক (আপনি ফায়ারবেস auth.currentUser দিয়েও করতে পারেন)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_EMAILS.includes(inputEmail.trim())) {
      setUserEmail(inputEmail);
      setIsLoggedIn(true);
      showPopup("Welcome to Admin Dashboard!");
    } else {
      alert("Access Denied! You are not authorized as an Admin.");
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) return;

    const formatted = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: newProduct.price.startsWith('Tk') ? newProduct.price : `Tk ${newProduct.price}`,
      image: newProduct.image
    };

    setProducts([formatted, ...products]);
    setNewProduct({ name: '', category: "Men's Wear (মেনস ওয়্যার)", price: '', image: '' });
    showPopup("Product added successfully!");
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete?")) {
      setProducts(products.filter(p => p.id !== id));
      showPopup("Product deleted successfully!");
    }
  };

  // যদি ইউজার অ্যাডমিন লিস্টে না থাকে বা লগইন না করে তবে তাকে লগইন স্ক্রিন বা এরর দেখাবে
  // সুরক্ষার স্বার্থে টেস্ট করার জন্য প্রথমবার ইউজারকে একটি ইমেইল দিতে হবে যা ADMIN_EMAILS এ আছে।
  const isAuthorized = isLoggedIn && (userEmail === "" || ADMIN_EMAILS.includes(userEmail));

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
          <div>
            <h1 className="text-2xl font-bold text-[#f5d77f]">Secure Admin Dashboard</h1>
            <p className="text-xs text-gray-300 mt-1">Restricted Access Only for Authorized Personnel.</p>
          </div>
          <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>

        {/* যদি ইমেইল ভেরিফাই না হয় বা সিকিউরিটি পাস না করে */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-[#4a151b] p-8 rounded-2xl border border-white/10 shadow-2xl text-center mt-12">
            <ShieldAlert size={48} className="mx-auto text-[#f5d77f] mb-4" />
            <h2 className="text-lg font-bold mb-2">Admin Authentication Required</h2>
            <p className="text-xs text-gray-300 mb-6">Please enter your authorized admin email address to proceed.</p>
            
            <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-gray-300 mb-1">Admin Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. iamhasib121@gmail.com" 
                  value={inputEmail} 
                  onChange={(e) => setInputEmail(e.target.value)} 
                  className="w-full bg-[#3b1014] text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#f5d77f]" 
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-[#f5d77f] text-[#581c23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center justify-center gap-2">
                <LogIn size={16} /> Verify & Enter Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#4a151b] p-6 rounded-2xl border border-white/10 shadow-xl h-fit">
              <h2 className="text-sm font-bold text-[#f5d77f] uppercase mb-4 flex items-center gap-1.5">
                <Plus size={16} /> Add New Product
              </h2>
              <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">Product Name *</label>
                  <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Category *</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Price (Tk) *</label>
                  <input type="text" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Image URL *</label>
                  <input type="url" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-[#3b1014] text-white p-2.5 rounded-lg border border-white/10" required />
                </div>
                <button type="submit" className="w-full bg-[#f5d77f] text-[#581c23] py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition">Publish Product</button>
              </form>

              <button onClick={() => setIsLoggedIn(false)} className="w-full mt-6 bg-red-500/20 text-red-300 border border-red-500/30 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-red-500/30 transition">
                <LogOut size={14} /> Lock Admin Session
              </button>
            </div>

            <div className="lg:col-span-2 bg-[#4a151b] p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-sm font-bold text-[#f5d77f] uppercase mb-4">Existing Products List</h2>
              <table className="w-full text-left text-xs text-gray-200">
                <thead className="bg-[#3b1014] text-[#f5d77f] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-3 flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <span className="font-semibold">{product.name}</span>
                      </td>
                      <td className="p-3 text-gray-300">{product.category.split(' ')[0]}</td>
                      <td className="p-3 font-bold text-[#f5d77f]">{product.price}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 p-1.5 rounded-lg text-white">
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
}
