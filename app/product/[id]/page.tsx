"use client";

import React, { useState } from "react";

export default function ProductDetailsPage() {
  // প্রোডাক্ট ইমেজ লিস্ট (গ্যালারি)
  const images = [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [selectedWarranty, setSelectedWarranty] = useState("1 Year Brand Warranty");

  return (
    <div className="bg-slate-100 min-h-screen py-6 px-4 md:px-12 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        
        {/* Main Grid: Left Thumbnails + Center Main Image + Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1. Left Vertical Thumbnails & Main Image Section (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Vertical Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[450px] scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition ${
                    selectedImage === img ? "border-blue-600 shadow-sm" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image Display */}
            <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden relative bg-slate-50 flex items-center justify-center p-4 min-h-[380px]">
              <img
                src={selectedImage}
                alt="Product Main"
                className="max-h-[400px] w-auto object-contain transition-all duration-300"
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                NEW ARRIVAL
              </span>
            </div>
          </div>

          {/* 2. Right Product Information & Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Redmi Note 12 Pro Max 5G (12GB/256GB) + 2000 TK Rate TK Voucher + Bundle Offer
              </h1>

              {/* Price Section */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-extrabold text-blue-600">৳ 64,999</span>
                <span className="text-sm text-slate-400 line-through">৳ 69,999</span>
                <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded">7% OFF</span>
              </div>

              <hr className="my-4 border-slate-200" />

              {/* Color Options */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Color: <span className="text-slate-900 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {["Black", "Blue", "White"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-1.5 rounded-lg border text-xs font-medium transition ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50 text-blue-600 font-bold"
                          : "border-slate-300 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Quantity</label>
                <div className="flex items-center border border-slate-300 rounded-lg w-fit bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-lg font-bold transition rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-lg font-bold transition rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Warranty & Services */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Warranty Options</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["1 Year Brand Warranty", "1 Year Screen Replacement (+৳999)"].map((warranty) => (
                    <button
                      key={warranty}
                      onClick={() => setSelectedWarranty(warranty)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition ${
                        selectedWarranty === warranty
                          ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {warranty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offer & Highlights Box */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Available Offers</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Get 2000 Tk Gift Voucher on Prepaid Order.</li>
                  <li>Free Travel Bag & Thermal Flask Bundle.</li>
                  <li>0% EMI available up to 12 months.</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => alert(`Added ${quantity} item(s) to Cart`)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
              >
                🛒 ADD TO CART
              </button>
              
              <button
                onClick={() => alert("Proceeding to Direct Checkout")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                ⚡ BUY NOW
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
