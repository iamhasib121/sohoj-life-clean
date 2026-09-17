"use client";

import Link from "next/link";
import { Share2, MessageCircle, Video, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b7300] text-white pt-12 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-wider mb-3">EKOMART</h2>
          <p className="text-sm text-green-100 leading-relaxed mb-6">
            Your trusted online grocery store for fresh and quality daily essentials. We deliver premium grocery products at affordable prices with fast and reliable delivery service.
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition" aria-label="Facebook">
              <Share2 className="w-4 h-4" />
            </Link>
            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition" aria-label="Twitter">
              <MessageCircle className="w-4 h-4" />
            </Link>
            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition" aria-label="Youtube">
              <Video className="w-4 h-4" />
            </Link>
            <Link href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition" aria-label="Instagram">
              <Globe className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-green-600 pb-2 inline-block">Shop Links</h3>
          <ul className="space-y-2 text-sm text-green-100">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/shop" className="hover:underline">Shop</Link></li>
            <li><Link href="/deals" className="hover:underline">Deals & Offers</Link></li>
            <li><Link href="/organic" className="hover:underline">Organic Products</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-green-600 pb-2 inline-block">Customer Service</h3>
          <ul className="space-y-2 text-sm text-green-100">
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/return-policy" className="hover:underline">Return Policy</Link></li>
            <li><Link href="/track-order" className="hover:underline">Track Order</Link></li>
            <li><Link href="/shipping-policy" className="hover:underline">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-green-600 pb-2 inline-block">Information</h3>
          <ul className="space-y-2 text-sm text-green-100">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link href="/return-policy" className="hover:underline">Return Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Payment Gateway Logos & Copyright */}
      <div className="border-t border-green-800 pt-6 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-green-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span>Pay With</span>
          <div className="bg-white px-3 py-1.5 rounded flex items-center gap-2 text-gray-800 font-semibold text-[10px]">
            <span className="text-blue-800">VISA</span>
            <span className="text-red-600">MasterCard</span>
            <span className="text-pink-600">bKash</span>
            <span className="text-orange-600">Nagad</span>
            <span className="text-green-700">SSLCommerz</span>
          </div>
        </div>
        <p>© 2026 EkoMart. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
