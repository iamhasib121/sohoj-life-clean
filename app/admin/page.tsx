"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

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
  const [activeTab, setActiveTab] = useState<"products" | "orders">(
    "products"
  );

  // Admin email from environment variable
  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase() || "";

  // =========================
  // AUTH STATE
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (!currentUser) {
        setUser(null);
        setUnauthorized(false);
        setLoading(false);
        return;
      }

      const currentEmail = currentUser.email?.trim().toLowerCase() || "";

      // If admin email is configured, enforce it.
      if (adminEmail && currentEmail !== adminEmail) {
        setUser(null);
        setUnauthorized(true);
        await signOut(auth);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setUnauthorized(false);

      try {
        await Promise.all([fetchProducts(), fetchOrders()]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [adminEmail]);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnauthorized(false);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const loggedInEmail =
        credential.user.email?.trim().toLowerCase() || "";

      if (adminEmail && loggedInEmail !== adminEmail) {
        await signOut(auth);
        setError("এই email দিয়ে Admin Panel-এ প্রবেশের অনুমতি নেই।");
        setUnauthorized(true);
        return;
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (err?.code === "auth/invalid-credential") {
        setError("Email অথবা password সঠিক নয়।");
      } else if (err?.code === "auth/too-many-requests") {
        setError("অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।");
      } else {
        setError(err?.message || "Login করতে সমস্যা হয়েছে।");
      }
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProducts([]);
      setOrders([]);
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err?.message || "Logout করতে সমস্যা হয়েছে।");
    }
  };

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));

      const list = querySnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setProducts(list);
    } catch (err: any) {
      console.error("Error fetching products:", err);
    }
  };

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));

      const list = querySnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setOrders(list);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
    }
  };

  // =========================
  // RESET PRODUCT FORM
  // =========================
  const resetProductForm = () => {
    setEditingId(null);
    setName("");
    setCategory("Men's Wear");
    setPrice("");
    setStock("10");
    setImage("");
  };

  // =========================
  // SAVE / UPDATE PRODUCT
  // =========================
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price || !image.trim()) {
      alert("দয়া করে Product Name, Price এবং Image URL পূরণ করুন!");
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert("সঠিক Price দিন।");
      return;
    }

    if (Number.isNaN(numericStock) || numericStock < 0) {
      alert("সঠিক Stock Quantity দিন।");
      return;
    }

    try {
      if (editingId) {
        const productRef = doc(db, "products", editingId);

        await updateDoc(productRef, {
          name: name.trim(),
          category,
          price: numericPrice,
          stock: numericStock,
          image: image.trim(),
          updatedAt: serverTimestamp(),
        });

        alert("প্রোডাক্ট সফলভাবে আপডেট হয়েছে!");
      } else {
        await addDoc(collection(db, "products"), {
          name: name.trim(),
          category,
          price: numericPrice,
          stock: numericStock,
          image: image.trim(),
          createdAt: serverTimestamp(),
        });

        alert("নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে!");
      }

      resetProductForm();
      await fetchProducts();
    } catch (err: any) {
      console.error("Save product error:", err);
      alert("ত্রুটি: " + (err?.message || "Unknown error"));
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEditClick = (prod: any) => {
    setEditingId(prod.id);
    setName(prod.name || "");
    setCategory(prod.category || "Men's Wear");
    setPrice(String(prod.price ?? ""));
    setStock(String(prod.stock ?? 10));
    setImage(prod.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDeleteProduct = async (id: string) => {
    const confirmed = confirm(
      "আপনি কি নিশ্চিত এই প্রোডাক্টটি ডিলিট করতে চান?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", id));

      alert("প্রোডাক্ট ডিলিট হয়েছে।");

      await fetchProducts();
    } catch (err: any) {
      console.error("Delete product error:", err);
      alert("প্রোডাক্ট ডিলিট করতে সমস্যা হয়েছে: " + err.message);
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      const orderRef = doc(db, "orders", orderId);

      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      alert("অর্ডার স্ট্যাটাস আপডেট হয়েছে!");

      await fetchOrders();
    } catch (err: any) {
      console.error("Update order error:", err);
      alert("সমস্যা হয়েছে: " + (err?.message || "Unknown error"));
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#330814] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400 mb-2">
            Sohoj Life
          </div>
          <div className="text-gray-300">লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN SCREEN
  // =========================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#330814] flex items-center justify-center p-4">
        <div className="bg-[#4a0d1e] p-8 rounded-xl shadow-2xl w-full max-w-md border border-amber-600/30">
          <h2 className="text-2xl font-bold text-center text-amber-400 mb-2">
            Admin Login
          </h2>

          <p className="text-center text-gray-400 text-sm mb-6">
            Sohoj Life Admin Panel
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {unauthorized && (
            <div className="bg-orange-500/20 border border-orange-500 text-orange-300 p-3 rounded mb-4 text-sm">
              এই account-এর Admin Panel access নেই।
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-amber-200 text-sm mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-[#330814] border border-amber-600/40 text-white focus:outline-none focus:border-amber-400"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-amber-200 text-sm mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-[#330814] border border-amber-600/40 text-white focus:outline-none focus:border-amber-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold p-3 rounded transition"
            >
              Login
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full mt-4 bg-[#330814] hover:bg-[#22050d] border border-amber-600/30 text-amber-300 p-3 rounded transition"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================
  return (
    <div className="min-h-screen bg-[#22050d] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#330814] p-4 rounded-xl border border-amber-600/30 mb-8 shadow-md">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-amber-400">
            Sohoj Life Admin Dashboard
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Logged in as: {user.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-sm bg-amber-900/40 hover:bg-amber-900/70 px-4 py-2 rounded text-amber-200"
          >
            Back to Store
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30 shadow-lg">
          <h3 className="text-gray-400 text-sm">Total Products</h3>

          <p className="text-3xl font-bold text-amber-400 mt-2">
            {products.length}
          </p>
        </div>

        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30 shadow-lg">
          <h3 className="text-gray-400 text-sm">Customer Orders</h3>

          <p className="text-3xl font-bold text-amber-400 mt-2">
            {orders.length}
          </p>
        </div>

        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30 shadow-lg">
          <h3 className="text-gray-400 text-sm">Admin Status</h3>

          <p className="text-lg font-semibold text-green-400 mt-2">
            ● Active & Secure
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-amber-900/40 pb-3">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "products"
              ? "bg-amber-500 text-black shadow-lg"
              : "bg-[#330814] text-amber-200"
          }`}
        >
          Manage Products
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "orders"
              ? "bg-amber-500 text-black shadow-lg"
              : "bg-[#330814] text-amber-200"
          }`}
        >
          Manage Orders ({orders.length})
        </button>
      </div>

      {/* =========================
          PRODUCTS TAB
      ========================= */}
      {activeTab === "products" && (
        <div>
          {/* Product Form */}
          <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30 mb-8 shadow-xl">
            <h2 className="text-lg font-bold text-amber-400 mb-4">
              {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
            </h2>

            <form
              onSubmit={handleSaveProduct}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Name */}
              <div>
                <label className="block text-sm text-amber-200 mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Panjabi"
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-amber-200 mb-1">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                >
                  <option value="Men's Wear">
                    Men's Wear (মেনস ওয়্যার)
                  </option>

                  <option value="Women's Wear">
                    Women's Wear (উমেনস ওয়্যার)
                  </option>

                  <option value="Kids' Wear">
                    Kids' Wear (কিডস ওয়্যার)
                  </option>

                  <option value="Accessories">
                    Accessories (অ্যাক্সেসরিজ)
                  </option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-amber-200 mb-1">
                  Price (Tk)
                </label>

                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1850"
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm text-amber-200 mb-1">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required
                />
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label className="block text-sm text-amber-200 mb-1">
                  Image URL
                </label>

                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://i.ibb.co/... or direct image link"
                  className="w-full p-3 rounded bg-[#22050d] border border-amber-600/40 text-white"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold p-3 rounded transition"
                >
                  {editingId
                    ? "Update Product"
                    : "Save Product to Database"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Products */}
          <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30 shadow-xl">
            <h2 className="text-lg font-bold text-amber-400 mb-4">
              Manage Existing Products ({products.length})
            </h2>

            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  কোনো প্রোডাক্ট পাওয়া যায়নি।
                </p>
              ) : (
                products.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col md:flex-row justify-between items-center bg-[#22050d] p-4 rounded-lg border border-amber-900/30 gap-4"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={prod.image}
                        alt={prod.name || "Product"}
                        className="w-16 h-16 object-cover rounded-md border border-amber-600/30"
                      />

                      <div>
                        <h4 className="font-bold text-amber-200">
                          {prod.name}
                        </h4>

                        <p className="text-sm text-gray-400">
                          Category: {prod.category || "N/A"} | Price: ৳
                          {prod.price ?? 0} | Stock: {prod.stock ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(prod)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold"
                      >
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

      {/* =========================
          ORDERS TAB
      ========================= */}
      {activeTab === "orders" && (
        <div className="bg-[#330814] p-6 rounded-xl border border-amber-600/30 shadow-xl">
          <h2 className="text-lg font-bold text-amber-400 mb-4">
            Customer Orders List
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              এখনো কোনো অর্ডার আসেনি।
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#22050d] p-4 rounded-lg border border-amber-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="w-full">
                    <h4 className="font-bold text-amber-300">
                      Customer: {order.customerName || "N/A"}
                    </h4>

                    <p className="text-sm text-gray-300 mt-1">
                      Phone: {order.phone || "N/A"}
                    </p>

                    <p className="text-sm text-gray-300">
                      Address: {order.address || "N/A"}
                    </p>

                    <p className="text-xs text-amber-500 mt-2">
                      Items: {order.itemsSummary || "General Order"} | Total:
                      ৳{order.totalAmount ?? 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        handleUpdateOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
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
