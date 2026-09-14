"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/app/firebase"; // আপনার প্রজেক্টের ফায়ারবেস পাথ অনুযায়ী ঠিক করে নিবেন
import { 
  collection, 
  addFirestore, // বা addDoc
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Product Form States
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Men's Wear");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchProducts();
        fetchOrders();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Save or Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !image) {
      alert("দয়া করে সব ফিল্ড পূরণ করুন!");
      return;
    }

    try {
      if (editingId) {
        // Update
        const docRef = doc(db, "products", editingId);
        await updateDoc(docRef, {
          name,
          category,
          price: Number(price),
          stock: Number(stock),
          image,
        });
        alert("প্রোডাক্ট সফলভাবে আপডেট হয়েছে!");
        setEditingId(null);
      } else {
        // Add New
        await addDoc(collection(db, "products"), {
          name,
          category,
          price: Number(price),
          stock: Number(stock),
          image,
          createdAt: serverTimestamp(),
        });
        alert("নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে!");
      }

      // Reset Form
      setName("");
      setPrice("");
      setStock("10");
      setImage("");
      fetchProducts();
    } catch (err: any) {
      alert("ত্রুটি: " + err.message);
    }
  };

  // Edit Trigger
  const handleEditClick = (prod: any) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category || "Men's Wear");
    setPrice(prod.price);
    setStock(prod.stock || 10);
    setImage(prod.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত এই প্রোডাক্টটি ডিলিট করতে চান?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, { status: newStatus });
      alert("অর্ডার স্ট্যাটাস আপডেট হয়েছে!");
      fetchOrders();
    } catch (err: any) {
      alert("সমস্যা হয়েছে: " + err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#330814] text-white flex items-center justify-center">লোড হচ্ছে...</div>;
  }

  // Login Screen if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#330814] flex items-center justify-center p-4">
        <div className="bg-[#4a0d1e] p-8 rounded-xl shadow-2xl w-full max-w-md border border-amber-600/30">
          <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">Admin Login</h2>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-amber-200 text-sm mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 rounded bg-[#330814] border border-amber-600/40 text-white focus:outline-none focus:border-amber-400"
                required 
              />
            </div>
            <div>
              <label className="block text-amber-200 text-sm mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3 rounded bg-[#330814] border border-amber-600/40 text-white focus:outline-none focus:border-amber-400"
                required 
              />
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold p-3 rounded transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#22050d] text-white p-4 md:p-8">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-[#330814] p-4 rounded-xl border border-amber-600/30 mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-amber-400">Sohoj Life Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="text-sm bg-amber-900/40 hover:bg-amber-900/70 px-4 py-2 rounded text-amber-200">
            Back to Store
          </button>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold">
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30">
          <h3 className="text-gray-400 text-sm">Total Products</h3>
          <p className="text-3xl font-bold text-amber-400 mt-2">{products.length}</p>
        </div>
        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30">
          <h3 className="text-gray-400 text-sm">Customer Orders</h3>
          <p className="text-3xl font-bold text-amber-400 mt-2">{orders.length}</p>
        </div>
        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30">
          <h3 className="text-gray-400 text-sm">Admin Status</h3>
          <p className="text-lg font-semibold text-green-400 mt-2">● Active & Secure</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6 border-b border-amber-900/40 pb-3">
        <button 
          onClick={() => setActiveTab("products")} 
          className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === "products" ? "bg-amber-500 text-black" : "bg-[#330814] text-amber-200"}`}
        >
          Manage Products
        </button>
        <button 
          onClick={() => setActiveTab("orders")} 
          className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === "orders" ? "bg-amber-500 text-black" : "bg-[#330814] text-amber-200"}`}
        >
          Manage Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === "products" && (
        <div>
          {/* Add / Edit Form */}
          <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30 mb-8">
            <h2 className="text-lg font-bold text-amber-400 mb-4">
              {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
            </h2>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-amber-200 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Premium Panjabi" 
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm text-amber-200 mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                >
                  <option value="Men's Wear">Men's Wear (মেনস ওয়্যার)</option>
                  <option value="Women's Wear">Women's Wear (উমেনস ওয়্যার)</option>
                  <option value="Kids' Wear">Kids' Wear (কিডস ওয়্যার)</option>
                  <option value="Accessories">Accessories (অ্যাক্সেসরিজ)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-amber-200 mb-1">Price (Tk)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="1850" 
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm text-amber-200 mb-1">Stock Quantity</label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  placeholder="10" 
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-amber-200 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)} 
                  placeholder="https://i.ibb.co/... or ImgBB link" 
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required 
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold p-3 rounded transition">
                  {editingId ? "Update Product" : "Save Product to Database"}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setName(""); setPrice(""); setImage(""); }} 
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30">
            <h2 className="text-lg font-bold text-amber-400 mb-4">Manage Existing Products ({products.length})</h2>
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-gray-400 text-center py-4">কোনো প্রোডাক্ট পাওয়া যায়নি। উপরে ফর্ম থেকে নতুন প্রোডাক্ট যুক্ত করুন।</p>
              ) : (
                products.map((prod) => (
                  <div key={prod.id} className="flex flex-col md:flex-row justify-between items-center bg-[#22050d] p-4 rounded-lg border border-amber-900/30 gap-4">
                    <div className="flex items-center gap-4">
                      <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-md border border-amber-600/30" />
                      <div>
                        <h4 className="font-bold text-amber-200">{prod.name}</h4>
                        <p className="text-sm text-gray-400">Category: {prod.category} | Price: ৳{prod.price} | Stock: {prod.stock || 10}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(prod)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(prod.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30">
          <h2 className="text-lg font-bold text-amber-400 mb-4">Customer Orders List</h2>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">এখনো কোনো অর্ডার আসেনি।</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#22050d] p-4 rounded-lg border border-amber-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-amber-300">Customer: {order.customerName || "N/A"}</h4>
                    <p className="text-sm text-gray-300">Phone: {order.phone} | Address: {order.address}</p>
                    <p className="text-xs text-amber-500 mt-1">Items: {order.itemsSummary || "General Order"} | Total: ৳{order.totalAmount}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={order.status || "Pending"} 
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="bg-[#330814] border border-amber-600/40 text-amber-200 p-2 rounded text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
