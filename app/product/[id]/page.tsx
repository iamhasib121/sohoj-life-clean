"use client";

import React, { useState } from "react";

export default function PremiumPickabooPage() {
  const images = [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800",
    "https://images.unsplash.com/photo-1574944985070-8f30c4397e3c?q=80&w=800",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedVariant, setSelectedVariant] = useState("12GB / 256GB");
  const [selectedColor, setSelectedColor] = useState("Graphite Black");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");

  return (
    <div className="bg-[#f4f6f9] min-h-screen py-4 px-2 lg:px-10 text-slate-800 font-sans pb-20 lg:pb-6">
      
      {/* Top Discount Banner */}
      <div className="max-w-[1440px] mx-auto mb-3 bg-gradient-to-r from-blue-900 via-sky-800 to-blue-600 rounded-lg text-white p-2.5 px-4 flex justify-between items-center text-xs md:text-sm shadow-sm">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded">OFFER</span>
          <span className="font-semibold">Get 2,000 TK Instant Cashback on Card Payment!</span>
        </div>
        <span className="hidden md:inline text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">Express Delivery Available</span>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ================= LEFT & MIDDLE: GALLERY & PRODUCT DETAILS (8 Cols) ================= */}
        <div className="lg:col-span-8 bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200/80">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* 1. Left Vertical Thumbnails */}
            <div className="md:col-span-2 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[460px] scrollbar-thin pr-1 order-2 md:order-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 p-1 bg-slate-50 transition-all flex-shrink-0 relative overflow-hidden ${
                    selectedImage === img
                      ? "border-blue-600 shadow-sm scale-95"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* 2. Main Large Image with Badges */}
            <div className="md:col-span-10 border border-slate-100 rounded-xl p-6 bg-slate-50/50 flex items-center justify-center relative min-h-[360px] order-1 md:order-2 group">
              <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                Official Stock
              </span>
              <img
                src={selectedImage}
                alt="Product Main"
                className="max-h-[380px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

          </div>

          {/* Product Overview Details */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 leading-snug">
              Redmi Note 12 Pro Max 5G (12GB RAM, 256GB Storage) - Official Warranty
            </h1>

            {/* Rating & Stock Status */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center text-amber-500 font-bold">
                ★★★★☆ <span className="text-slate-500 ml-1.5">(4.8 / 5.0 - 124 Reviews)</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">In Stock</span>
            </div>

            {/* Pricing Section */}
            <div className="mt-4 flex items-baseline gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <span className="text-3xl font-black text-blue-600">৳ 64,999</span>
              <span className="text-base text-slate-400 line-through">৳ 69,999</span>
              <span className="text-xs font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-md">Save ৳5,000</span>
            </div>

            {/* Storage Variants */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Variant</label>
              <div className="flex gap-2.5">
                {["8GB / 128GB", "12GB / 256GB"].map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                      selectedVariant === variant
                        ? "border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Color: <span className="text-slate-800">{selectedColor}</span></label>
              <div className="flex gap-2.5">
                {["Graphite Black", "Ocean Blue", "Aurora Purple"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      selectedColor === color
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Specifications & Description Tabs */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <div className="flex border-b border-slate-200 gap-8">
              {["specifications", "description", "warranty"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition relative ${
                    activeTab === tab
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-4 text-xs md:text-sm text-slate-600">
              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg">
                  <div><span className="font-bold text-slate-800">Processor:</span> Snapdragon 778G 5G</div>
                  <div><span className="font-bold text-slate-800">Display:</span> 6.67" 120Hz AMOLED</div>
                  <div><span className="font-bold text-slate-800">Rear Camera:</span> 200MP + 8MP + 2MP</div>
                  <div><span className="font-bold text-slate-800">Battery:</span> 5000mAh (120W Turbo)</div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR: CART & CHECKOUT CARD (4 Cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Main Cart Summary Panel */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 sticky top-4">
            
            <h3 className="font-extrabold text-sm text-slate-800 border-b pb-3 mb-4">Order Summary</h3>

            {/* Mini Selected Item Card */}
            <div className="flex gap-3 mb-4 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <img src={selectedImage} alt="preview" className="w-12 h-12 object-contain bg-white rounded p-1 border" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 line-clamp-1">Redmi Note 12 Pro Max 5G</p>
                <p className="text-slate-500 mt-0.5">{selectedVariant} | {selectedColor}</p>
                <p className="text-blue-600 font-extrabold mt-1">৳ 64,999</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Quantity</label>
              <div className="flex items-center border border-slate-300 rounded-lg w-fit overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border-r text-sm transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border-l text-sm transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2 border-t border-b border-slate-100 py-3 mb-5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">৳ {(64999 * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Delivery Charge</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-blue-600">৳ {(64999 * quantity).toLocaleString()}</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2.5">
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg text-xs tracking-wider transition shadow-sm uppercase">
                🛒 Add To Cart
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xs tracking-wider transition shadow-md uppercase">
                ⚡ Buy Now
              </button>
            </div>

            {/* Guarantee / Service Highlights */}
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>🛡️</span> 100% Authentic
              </div>
              <div className="flex items-center gap-1.5">
                <span>🔄</span> 7 Days Return
              </div>
              <div className="flex items-center gap-1.5">
                <span>🚚</span> Express Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <span>💳</span> EMI Available
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 px-4 flex gap-3 z-50 shadow-lg">
        <button className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-lg text-xs uppercase">
          Add To Cart
        </button>
        <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg text-xs uppercase">
          Buy Now
        </button>
      </div>

    </div>
  );
}
