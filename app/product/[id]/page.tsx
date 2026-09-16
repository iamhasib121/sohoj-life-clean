"use client";

import React, { useState } from "react";

export default function PickabooProductPage() {
  // ১. একাধিক ছবিসহ ইমেজ গ্যালারি (১০টি থাম্বনেইল)
  const images = [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800",
    "https://images.unsplash.com/photo-1574944985070-8f30c4397e3c?q=80&w=800",
    "https://images.unsplash.com/photo-1533228876829-65c94e7b5025?q=80&w=800",
    "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=800",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800",
    "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=800",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");

  return (
    <div className="bg-[#f2f4f8] min-h-screen py-4 px-2 md:px-8 font-sans text-slate-800">
      
      {/* Top Banner (Pickaboo-style offer banner) */}
      <div className="max-w-[1400px] mx-auto mb-3 bg-gradient-to-r from-blue-900 via-indigo-800 to-sky-600 rounded-md text-white p-2.5 px-4 flex justify-between items-center text-xs md:text-sm font-semibold shadow-sm">
        <span>🔥 UP TO 44% OFF - Free Delivery & Official Warranty Available!</span>
        <span className="hidden md:block bg-yellow-400 text-slate-900 text-xs px-2 py-0.5 rounded font-bold">LIMITED OFFER</span>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ================= LEFT SECTION: Product Details & Images (8 Columns) ================= */}
        <div className="lg:col-span-8 bg-white p-4 md:p-6 rounded-md shadow-sm border border-slate-200">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Left Thumbnails List (Pickaboo Style Scrollable Thumbnails) */}
            <div className="md:col-span-2 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[480px] scrollbar-thin pr-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded border flex-shrink-0 p-1 bg-white transition ${
                    selectedImage === img
                      ? "border-blue-600 ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main Image Container */}
            <div className="md:col-span-10 flex flex-col items-center justify-center border border-slate-100 rounded-md p-4 relative min-h-[380px]">
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                NEW ARRIVAL
              </span>
              <img
                src={selectedImage}
                alt="Product Main"
                className="max-h-[380px] w-auto object-contain transition-all duration-200"
              />
            </div>

          </div>

          {/* Product Basic Info Below Image Section */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
              Redmi Note 12 Pro Max 5G 12GB/256GB with 2000 TK Rate Gift Voucher + Headphone Bundle (Travel Bag & Thermal Flask)
            </h1>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-black text-blue-600">৳ 64,999</span>
              <span className="text-sm text-slate-400 line-through">৳ 69,999</span>
              <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded">Special Discount</span>
            </div>

            {/* Promo Banner Card inside Page */}
            <div className="mt-4 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-md p-3 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-sky-900">Starting from ৳32,690</p>
                <p className="text-[11px] text-sky-700">Free Delivery + Installation Available</p>
              </div>
              <span className="text-xs font-extrabold bg-sky-600 text-white px-2 py-1 rounded">35% DISCOUNT</span>
            </div>

            {/* Color Variants Selector */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-600 block mb-2">Color</label>
              <div className="flex gap-2">
                {["Black", "Green", "Pink"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded text-xs font-semibold border ${
                      selectedColor === color
                        ? "border-blue-600 text-blue-600 bg-blue-50"
                        : "border-slate-300 text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Offer List */}
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-md p-3">
              <p className="text-xs font-bold text-slate-800 mb-2">Available Offers:</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>0% EMI available up to 12 months.</li>
                <li>Official 1 Year Brand Warranty included.</li>
                <li>Express 3-Hour Delivery in Dhaka City.</li>
              </ul>
            </div>
          </div>

          {/* Bottom Tabs (Specifications / Features) */}
          <div className="mt-8 border-t border-slate-200 pt-4">
            <div className="flex border-b border-slate-200 gap-6">
              {["specifications", "description", "warranty"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-xs md:text-sm font-bold uppercase transition ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              {activeTab === "specifications" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 border-b pb-1">
                    <span className="font-semibold text-slate-800">Display:</span> 6.67" AMOLED, 120Hz
                  </div>
                  <div className="grid grid-cols-2 border-b pb-1">
                    <span className="font-semibold text-slate-800">RAM/ROM:</span> 12GB / 256GB
                  </div>
                  <div className="grid grid-cols-2 border-b pb-1">
                    <span className="font-semibold text-slate-800">Camera:</span> 200MP Main + 16MP Front
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-slate-800">Battery:</span> 5000mAh, 120W Fast Charge
                  </div>
                </div>
              )}
              {activeTab === "description" && (
                <p>Enjoy flagship performance with the Redmi Note 12 Pro Max 5G featuring a high-refresh AMOLED display, ultrafast charging, and exceptional build quality.</p>
              )}
              {activeTab === "warranty" && (
                <p>1 Year official brand warranty with full service support across authorized service centers.</p>
              )}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SECTION: Cart Drawer / Action Panel (4 Columns) ================= */}
        <div className="lg:col-span-4">
          <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200 sticky top-4">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-800">Cart Summary</h3>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">1 Item Selected</span>
            </div>

            {/* Selected Item Preview */}
            <div className="flex gap-3 mb-4 p-2 bg-slate-50 rounded border border-slate-100">
              <img src={selectedImage} alt="cart-preview" className="w-14 h-14 object-contain rounded bg-white" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 line-clamp-2">Redmi Note 12 Pro Max 5G</p>
                <p className="text-slate-500 mt-1">Color: <span className="font-semibold text-slate-700">{selectedColor}</span></p>
                <p className="text-blue-600 font-extrabold mt-0.5">৳ 64,999</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Select Quantity</label>
              <div className="flex items-center border border-slate-300 rounded w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border-r text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border-l text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-b border-slate-100 py-3 mb-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳ {(64999 * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Delivery Charge</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-blue-600">৳ {(64999 * quantity).toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons (Pickaboo Style ADD TO CART & BUY NOW) */}
            <div className="space-y-2">
              <button
                onClick={() => alert("Item added to cart!")}
                className="w-full bg-white border border-blue-600 text-blue-600 font-bold py-2.5 rounded text-xs hover:bg-blue-50 transition shadow-sm"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => alert("Redirecting to checkout...")}
                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded text-xs hover:bg-blue-700 transition shadow-md"
              >
                BUY NOW
              </button>
            </div>

            {/* Extra Info */}
            <p className="text-[10px] text-slate-400 text-center mt-3">
              🔒 Safe & Secure Checkout with Pickaboo Guarantee
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
