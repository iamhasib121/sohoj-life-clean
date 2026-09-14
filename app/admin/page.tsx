'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, CheckCircle2, ShieldAlert, LogIn, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';

// ফায়ারবেস সঠিক রিলেটিভ পাথ দিয়ে ইমপোর্ট করা হলো
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export default function AdminPage() {
  // 🔐 আপনার ফায়ারবেস ইমেইলটি এখানে দেওয়া আছে যা দিয়ে অ্যাডমিন এক্সেস দেওয়া হবে
  const ADMIN_EMAILS = ["iamhasib121@gmail.com"];

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
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

  // ফায়ারবেস অথ স্টেট ট্র্যাক করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email || "")) {
        setUser(currentUser);
      } else {
        setUser(null);
        if (currentUser) {
          signOut(auth);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ফায়ারবেস দিয়ে লগইন হ্যান্ডেল করা
  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!ADMIN_EMAILS.includes(inputEmail.trim())) {
      setAuthError("Access Denied: This email is not authorized as an admin.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, inputEmail.trim(), inputPassword.trim());
      showPopup("Successfully logged into Admin Dashboard!");
    } catch (error: any) {
      setAuthError(error.message || "Failed to login. Check your email & password.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showPopup("Logged out successfully.");
    } catch (error) {
      console.error("Logout error", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#581c23] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-[#f5d77f]" size={32} />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-[#f5d77f]">Firebase Secure Admin Dashboard</h1>
            <p className="text-xs text-gray-300 mt-1">Protected by Firebase Authentication.</p>
          </div>
          <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>

        {!user ? (
          <div className="max-w-md mx-auto bg-[#4a151b] p-8 rounded-2xl border border-white/10 shadow-2xl text-center mt-12">
            <ShieldAlert size={48} className="mx-auto text-[#f5d77f] mb-4" />
            <h2 className="text-lg font-bold mb-2">Admin Sign In</h2>
            <p className="text-xs text-gray-300 mb-6">Log in with your Firebase admin credentials.</p>
            
            {authError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg text-xs mb-4">
                {authError}
              </div>
            )}

            <form onSubmit={handleFirebaseLogin} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="iamhasib121@gmail.com" 
                  value={inputEmail} 
                  onChange={(e) => setInputEmail(e.target.value)} 
                  className="w-full bg-[#3b1014] text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#f5d77f]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={inputPassword} 
                  onChange={(e) => setInputPassword(e.target.value)} 
                  className="w-full bg-[#3b1014] text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#f5d77f]" 
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-[#f5d77f] text-[#581c23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center justify-center gap-2">
                <LogIn size={16} /> Sign In
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

              <div className="mt-6 pt-4 border-t border-white/10 text-xs">
                <p className="text-gray-300 mb-2 truncate">Logged in as: <span className="text-[#f5d77f] font-semibold">{user.email}</span></p>
                <button onClick={handleLogout} className="w-full bg-red-500/20 text-red-300 border border-red-500/30 py-2 rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-red-500/30 transition">
                  <LogOut size={14} /> Logout
                </button>
              </div>
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
