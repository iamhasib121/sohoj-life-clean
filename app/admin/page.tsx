'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

interface Product {
  id: string;
  name: string;
  category: string;
  priceNum: number;
  price: string;
  image: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState("Men's Wear (মেনস ওয়্যার)");
  const [priceNum, setPriceNum] = useState('');
  const [image, setImage] = useState('');
  const [adding, setAdding] = useState(false);

  const categories = [
    "Men's Wear (মেনস ওয়্যার)", 
    "Women's Wear (উমেনস ওয়্যার)", 
    "Kids' Wear (কিডস ওয়্যার)", 
    "Winter Jacket (উইন্টার জ্যাকেট)", 
    "Food (ফুড)"
  ];

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        productList.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceNum || !image) {
      alert("দয়া করে সব তথ্য পূরণ করুন।");
      return;
    }

    setAdding(true);
    try {
      const num = Number(priceNum);
      await addDoc(collection(db, "products"), {
        name,
        category,
        priceNum: num,
        price: `Tk ${num.toLocaleString()}`,
        image
      });

      setName('');
      setPriceNum('');
      setImage('');
      fetchProducts();
      alert("প্রোডাক্ট সফলভাবে যোগ করা হয়েছে!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("প্রোডাক্ট যোগ করতে সমস্যা হয়েছে।");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি ডিলিট করতে চান?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#3F0C13] text-white font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#5C111C]">
          <Link href="/" className="flex items-center gap-2 text-xs text-[#D4AF37] hover:underline font-bold">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#D4AF37]" />
            <h1 className="text-lg font-black tracking-tight">Sohoj Life Admin Dashboard</h1>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-[#2D060B] border border-[#5C111C] p-6 rounded-2xl mb-8 shadow-xl">
          <h2 className="text-sm font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
            <Plus size={16} /> Add New Product
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Product Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Panjabi"
                className="w-full bg-[#3F0C13] text-white p-2.5 rounded-xl border border-[#5C111C] focus:border-[#D4AF37] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#3F0C13] text-white p-2.5 rounded-xl border border-[#5C111C] focus:border-[#D4AF37] focus:outline-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Price (Number only, e.g. 1850)</label>
              <input 
                type="number" 
                value={priceNum} 
                onChange={(e) => setPriceNum(e.target.value)}
                placeholder="1850"
                className="w-full bg-[#3F0C13] text-white p-2.5 rounded-xl border border-[#5C111C] focus:border-[#D4AF37] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Image URL (Unsplash or direct link)</label>
              <input 
                type="text" 
                value={image} 
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#3F0C13] text-white p-2.5 rounded-xl border border-[#5C111C] focus:border-[#D4AF37] focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button 
                type="submit" 
                disabled={adding}
                className="w-full bg-[#D4AF37] hover:bg-[#c29d30] text-black font-bold py-3 rounded-xl transition shadow"
              >
                {adding ? "Adding Product..." : "Save Product to Database"}
              </button>
            </div>
          </form>
        </div>

        {/* Product List Table */}
        <div className="bg-[#2D060B] border border-[#5C111C] p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Package size={16} className="text-[#D4AF37]" /> Manage Existing Products ({products.length})
          </h2>

          {loading ? (
            <p className="text-xs text-zinc-400 text-center py-6">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-6">No products found in database.</p>
          ) : (
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-[#3F0C13] p-3 rounded-xl border border-[#5C111C]">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{p.name}</h4>
                      <p className="text-[11px] text-[#D4AF37] font-semibold">{p.price} • <span className="text-zinc-400">{p.category}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-950/60 hover:bg-red-900 text-red-300 p-2 rounded-lg border border-red-900/50 transition"
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
