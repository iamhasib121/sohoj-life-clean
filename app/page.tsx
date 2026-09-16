'use client';

import React, { useState } from 'react';
import {
  ShoppingCart, Heart, Search, Star, MessageCircle, CheckCircle2,
  Lock, Truck, ShieldCheck, RotateCcw, Phone, MapPin,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────
   ⚙️  এখানে শুধু এই কয়েকটা লাইন বদলালেই পুরো সাইটে বদলে যাবে
   ───────────────────────────────────────────────────────── */
const WHATSAPP_1 = "8801303422278";        // ← আপনার নম্বর (৮৮০ দিয়ে শুরু, + বা 0 ছাড়া)
const WHATSAPP_2 = "8801879955594";        // ← বন্ধুর নম্বর
const FACEBOOK_PAGE = "https://facebook.com/";  // ← আপনার ফেসবুক পেজের লিংক
const SHOP_ADDRESS = "ঢাকা, বাংলাদেশ";
const DELIVERY_INSIDE = "৬০";
const DELIVERY_OUTSIDE = "১২০";
/* ───────────────────────────────────────────────────────── */

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  inStock: boolean;
  sizes?: string[];
  images: string[];
  description: string;
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const categories = [
    "All Products",
    "Men's Wear (মেনস ওয়্যার)",
    "Women's Wear (উমেনস ওয়্যার)",
    "Kids' Wear (কিডস ওয়্যার)",
    "Winter Jacket (উইন্টার জ্যাকেট)",
    "Food (ফুড)"
  ];

  const products: Product[] = [
    {
      id: 1, name: "Premium Cotton Punjabi", category: "Men's Wear (মেনস ওয়্যার)",
      price: 1850, oldPrice: 2200, rating: 4.7, inStock: true, sizes: ["M", "L", "XL", "XXL"],
      images: [
        "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop",
      ],
      description: "High-quality premium cotton fabric designed for comfort and elegance during festive occasions and daily wear."
    },
    {
      id: 2, name: "Slim Fit Formal Shirt", category: "Men's Wear (মেনস ওয়্যার)",
      price: 1200, oldPrice: 1500, rating: 4.5, inStock: true, sizes: ["S", "M", "L", "XL"],
      images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop"],
      description: "Professional slim-fit formal shirt tailored with fine cotton blend for office and formal events."
    },
    {
      id: 3, name: "Graphic Print T-Shirt", category: "Men's Wear (মেনস ওয়্যার)",
      price: 650, rating: 4.3, inStock: true, sizes: ["M", "L", "XL"],
      images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop"],
      description: "Trendy graphic tee made with 100% breathable cotton for casual streetwear style."
    },
    {
      id: 4, name: "Jamdani Silk Saree", category: "Women's Wear (উমেনস ওয়্যার)",
      price: 4500, oldPrice: 5500, rating: 4.9, inStock: true,
      images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop"],
      description: "Traditional exquisite Jamdani silk saree featuring intricate traditional motifs and rich pallu."
    },
    {
      id: 5, name: "Embroidered Salwar Kameez", category: "Women's Wear (উমেনস ওয়্যার)",
      price: 2800, rating: 4.6, inStock: true, sizes: ["S", "M", "L"],
      images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop"],
      description: "Gorgeous embroidered salwar kameez set crafted with premium georgette and inner lining."
    },
    {
      id: 6, name: "Black Print Cotton Kurti", category: "Women's Wear (উমেনস ওয়্যার)",
      price: 1100, oldPrice: 1350, rating: 4.4, inStock: false, sizes: ["M", "L", "XL"],
      images: ["https://images.unsplash.com/photo-1564584217132-2271fea3f357?q=80&w=600&auto=format&fit=crop"],
      description: "Stylish everyday black print cotton kurti offering absolute comfort and modern aesthetic."
    },
    {
      id: 7, name: "Floral Baby Dress", category: "Kids' Wear (কিডস ওয়্যার)",
      price: 850, rating: 4.8, inStock: true, sizes: ["1-2y", "3-4y", "5-6y"],
      images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop"],
      description: "Cute and soft floral baby dress designed with skin-friendly fabric for toddlers."
    },
    {
      id: 8, name: "Party Tulle Frock", category: "Kids' Wear (কিডস ওয়্যার)",
      price: 1300, oldPrice: 1600, rating: 4.5, inStock: true, sizes: ["2-3y", "4-5y", "6-7y"],
      images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop"],
      description: "Beautiful party wear tulle frock with bow detailing, perfect for birthdays and celebrations."
    },
    {
      id: 9, name: "Cute Plush Teddy Toy", category: "Kids' Wear (কিডস ওয়্যার)",
      price: 550, rating: 4.7, inStock: true,
      images: ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=600&auto=format&fit=crop"],
      description: "Super soft, huggable plush teddy bear toy safe for kids of all ages."
    },
    {
      id: 10, name: "Padded Winter Jacket", category: "Winter Jacket (উইন্টার জ্যাকেট)",
      price: 3200, oldPrice: 3800, rating: 4.9, inStock: true, sizes: ["M", "L", "XL", "XXL"],
      images: ["https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop"],
      description: "Heavy-duty windproof padded winter jacket engineered to keep you warm in extreme cold."
    },
    {
      id: 11, name: "Fleece Pullover Hoodie", category: "Winter Jacket (উইন্টার জ্যাকেট)",
      price: 1600, rating: 4.6, inStock: true, sizes: ["M", "L", "XL"],
      images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"],
      description: "Cozy fleece-lined pullover hoodie with kangaroo pocket for ultimate casual warmth."
    },
    {
      id: 12, name: "Cable Knit Woolen Sweater", category: "Winter Jacket (উইন্টার জ্যাকেট)",
      price: 1400, oldPrice: 1750, rating: 4.4, inStock: true, sizes: ["M", "L", "XL"],
      images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"],
      description: "Classic cable knit textured woolen sweater offering a sophisticated winter look."
    },
    {
      id: 13, name: "Kacchi Mutton Biryani", category: "Food (ফুড)",
      price: 320, rating: 4.9, inStock: true,
      images: ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop"],
      description: "Authentic aromatic traditional Kacchi Mutton Biryani cooked with tender meat and premium spices."
    },
    {
      id: 14, name: "Assorted Snacks Box", category: "Food (ফুড)",
      price: 250, rating: 4.7, inStock: true,
      images: ["https://images.unsplash.com/photo-1599487484170-7c1e604581ed?q=80&w=600&auto=format&fit=crop"],
      description: "Crunchy and delicious assorted traditional snacks box perfect for evening tea time."
    },
    {
      id: 15, name: "Traditional Misti Box", category: "Food (ফুড)",
      price: 400, oldPrice: 480, rating: 4.8, inStock: true,
      images: ["https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop"],
      description: "Assorted premium traditional Bengali sweets made with pure chhena and rich syrup."
    },
  ];

  const showPopup = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const formatPrice = (n: number) => `Tk ${n.toLocaleString('en-US')}`;

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);
    setSelectedSize(product.sizes?.[0] ?? '');
  };

  const handleWhatsAppOrder = (product: Product, targetNumber: string, size?: string) => {
    const sizeLine = size ? `\n*সাইজ:* ${size}` : '';
    const message =
      `আসসালামু আলাইকুম, আমি এই প্রোডাক্টটি অর্ডার করতে চাই:\n\n` +
      `*প্রোডাক্ট:* ${product.name}\n` +
      `*দাম:* ${formatPrice(product.price)}${sizeLine}\n\n` +
      `দয়া করে অর্ডারটি কনফার্ম করুন।`;
    const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
    showPopup(`WhatsApp-এ নিয়ে যাওয়া হচ্ছে...`);
    window.open(url, '_blank');
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const discountPercent = (p: Product) =>
    p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#581c23] text-white font-sans selection:bg-[#f5d77f] selection:text-[#581c23]">

      {notification && (
        <div className="fixed top-20 right-4 z-[60] bg-[#f5d77f] text-[#581c23] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-white/20">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Delivery strip ── */}
      <div className="bg-[#3b1014] text-[#f5d77f] text-[11px] py-2 px-4 text-center border-b border-white/5">
        🚚 ঢাকার ভেতরে ডেলিভারি চার্জ {DELIVERY_INSIDE}৳ • ঢাকার বাইরে {DELIVERY_OUTSIDE}৳ • ক্যাশ অন ডেলিভারি
      </div>

      {/* ── Header ── */}
      <header className="border-b border-white/10 bg-[#4a151b]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <span
            className="text-xl font-extrabold tracking-wider text-[#f5d77f] cursor-pointer shrink-0"
            onClick={() => { setActiveCategory('All Products'); setSearchQuery(''); }}
          >
            Sohoj Life
          </span>

          <div className="flex-1 max-w-md relative hidden sm:block">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#3b1014] text-xs text-white placeholder-gray-400 px-4 py-2 pl-9 rounded-full border border-white/10 focus:outline-none focus:border-[#f5d77f] transition-all"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center space-x-3 text-sm shrink-0">
            <Link
              href="/admin"
              className="bg-black/30 border border-white/10 text-[#f5d77f] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-black/50 transition"
            >
              <Lock size={12} /> Admin
            </Link>
            <button onClick={() => showPopup("Wishlist শীঘ্রই আসছে!")} className="hover:text-[#f5d77f] p-1.5 rounded-full hover:bg-white/10 transition hidden sm:block"><Heart size={18} /></button>
            <button onClick={() => showPopup("Cart শীঘ্রই আসছে!")} className="hover:text-[#f5d77f] p-1.5 rounded-full hover:bg-white/10 transition hidden sm:block"><ShoppingCart size={18} /></button>
          </div>
        </div>

        {/* mobile search */}
        <div className="sm:hidden px-4 pb-3 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#3b1014] text-xs text-white placeholder-gray-400 px-4 py-2 pl-9 rounded-full border border-white/10 focus:outline-none focus:border-[#f5d77f]"
          />
          <Search size={15} className="absolute left-7 top-2.5 text-gray-400" />
        </div>
      </header>

      {/* ── Hero banner ── */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#4a151b] via-[#6b2129] to-[#4a151b] border border-[#f5d77f]/20 px-6 py-10 sm:py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#f5d77f_0%,transparent_45%)]" />
          <div className="relative">
            <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-[#f5d77f] border border-[#f5d77f]/40 rounded-full px-3 py-1 mb-4">
              নতুন কালেকশন
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
              পোশাক ও খাবার — <span className="text-[#f5d77f]">এক জায়গায়</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-3 max-w-lg mx-auto">
              বাছাই করা পণ্য, সরাসরি হোয়াটসঅ্যাপে অর্ডার। সারা বাংলাদেশে হোম ডেলিভারি।
            </p>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 bg-[#f5d77f] text-[#581c23] px-6 py-2.5 rounded-full text-xs font-bold hover:brightness-110 transition"
            >
              এখনই কিনুন
            </button>
          </div>
        </div>

        {/* trust badges */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: <Truck size={16} />, t: "দ্রুত ডেলিভারি", s: "১-৩ দিনে" },
            { icon: <ShieldCheck size={16} />, t: "অরিজিনাল পণ্য", s: "গ্যারান্টিসহ" },
            { icon: <RotateCcw size={16} />, t: "সহজ রিটার্ন", s: "৩ দিনের ভেতর" },
          ].map(b => (
            <div key={b.t} className="bg-[#4a151b] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-[#f5d77f] flex justify-center mb-1">{b.icon}</div>
              <p className="text-[11px] font-bold">{b.t}</p>
              <p className="text-[10px] text-gray-400">{b.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <main id="products" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#f5d77f] text-[#581c23] font-bold shadow-lg scale-105'
                  : 'bg-[#4a151b] text-gray-200 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">কিছু পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg flex flex-col group">
                <div
                  className="h-44 w-full bg-gray-100 overflow-hidden relative cursor-pointer"
                  onClick={() => openProduct(product)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.oldPrice && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      -{discountPercent(product)}%
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <span className="text-white text-[11px] font-bold border border-white/60 px-3 py-1 rounded">
                        Stock Out
                      </span>
                    </div>
                  )}
                  {product.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">
                      {product.images.length} ছবি
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <span className="text-[10px] text-gray-500 uppercase">{product.category.split(' ')[0]}</span>
                  <h3
                    onClick={() => openProduct(product)}
                    className="text-xs font-semibold text-gray-800 line-clamp-1 mt-0.5 cursor-pointer hover:text-[#581c23]"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-gray-700 font-medium">{product.rating}</span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xs font-bold text-[#581c23]">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1 mt-3 mt-auto pt-3">
                    <button
                      disabled={!product.inStock}
                      onClick={() => handleWhatsAppOrder(product, WHATSAPP_1)}
                      className="bg-[#25D366] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[10px] py-1.5 rounded font-medium flex items-center justify-center gap-1"
                    >
                      <MessageCircle size={12} /> Order 1
                    </button>
                    <button
                      disabled={!product.inStock}
                      onClick={() => handleWhatsAppOrder(product, WHATSAPP_2)}
                      className="bg-[#128C7E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[10px] py-1.5 rounded font-medium flex items-center justify-center gap-1"
                    >
                      <MessageCircle size={12} /> Order 2
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── About ── */}
      <section className="bg-[#4a151b] border-y border-white/10 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-bold text-[#f5d77f] mb-3">আমাদের সম্পর্কে</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Sohoj Life একটি ছোট পারিবারিক উদ্যোগ। আমরা বাছাই করা পোশাক আর ঘরে তৈরি খাবার
            সরাসরি আপনার দরজায় পৌঁছে দিই। প্রতিটি পণ্য নিজে হাতে বাছাই করা, তাই মান নিয়ে
            আপোস নেই। অর্ডার করতে হোয়াটসঅ্যাপে মেসেজ দিন — আমরা দ্রুত উত্তর দিই।
          </p>
        </div>
      </section>

      {/* ── Delivery info ── */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-[#f5d77f] mb-5 text-center">ডেলিভারি ও পেমেন্ট</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#4a151b] border border-white/10 rounded-xl p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Truck size={14} className="text-[#f5d77f]" /> ডেলিভারি</h3>
              <ul className="text-gray-300 space-y-1.5 leading-relaxed">
                <li>• ঢাকার ভেতরে: ১-২ দিন, চার্জ {DELIVERY_INSIDE}৳</li>
                <li>• ঢাকার বাইরে: ৩-৫ দিন, চার্জ {DELIVERY_OUTSIDE}৳</li>
                <li>• খাবারের আইটেম শুধু ঢাকায় ডেলিভারি হয়</li>
              </ul>
            </div>
            <div className="bg-[#4a151b] border border-white/10 rounded-xl p-5">
              <h3 className="font-bold mb-2 flex items-center gap-2"><ShieldCheck size={14} className="text-[#f5d77f]" /> পেমেন্ট</h3>
              <ul className="text-gray-300 space-y-1.5 leading-relaxed">
                <li>• ক্যাশ অন ডেলিভারি</li>
                <li>• বিকাশ / নগদ / রকেট</li>
                <li>• ঢাকার বাইরে ২০% অগ্রিম লাগতে পারে</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#3b1014] border-t border-white/10 py-10 px-4">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-xs">
          <div>
            <h3 className="text-[#f5d77f] font-extrabold text-lg mb-2">Sohoj Life</h3>
            <p className="text-gray-400 leading-relaxed">
              পোশাক ও খাবারের বিশ্বস্ত অনলাইন ঠিকানা।
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-gray-200">যোগাযোগ</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#f5d77f]" />
                <a href={`https://wa.me/${WHATSAPP_1}`} target="_blank" rel="noreferrer" className="hover:text-[#f5d77f]">
                  +{WHATSAPP_1}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#f5d77f]" />
                <a href={`https://wa.me/${WHATSAPP_2}`} target="_blank" rel="noreferrer" className="hover:text-[#f5d77f]">
                  +{WHATSAPP_2}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-[#f5d77f]" /> {SHOP_ADDRESS}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-gray-200">আমাদের ফলো করুন</h4>
            <a
              href={FACEBOOK_PAGE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#4a151b] border border-white/10 px-4 py-2 rounded-lg hover:border-[#f5d77f] transition text-gray-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#f5d77f]">
  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"/>
</svg> Facebook Page
            </a>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-500 mt-8 pt-6 border-t border-white/5">
          © {new Date().getFullYear()} Sohoj Life. সর্বস্বত্ব সংরক্ষিত।
        </p>
      </footer>

      {/* ── Product modal ── */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}
        >
          <div className="bg-white text-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-white/90 hover:bg-gray-200 text-gray-700 p-1.5 rounded-full z-20 shadow"
            >
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* image carousel */}
              <div className="relative h-72 sm:h-auto bg-gray-100">
                <img
                  src={selectedProduct.images[modalImageIndex]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover sm:min-h-[22rem]"
                />
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setModalImageIndex(i => (i === 0 ? selectedProduct.images.length - 1 : i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setModalImageIndex(i => (i === selectedProduct.images.length - 1 ? 0 : i + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                      {selectedProduct.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setModalImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition ${i === modalImageIndex ? 'bg-[#581c23]' : 'bg-white/70'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* details */}
              <div className="p-6 flex flex-col">
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-semibold w-fit">
                  {selectedProduct.category}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2">{selectedProduct.name}</h3>

                <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-gray-700 font-medium">{selectedProduct.rating}</span>
                  <span className="text-gray-400 ml-1">
                    · {selectedProduct.inStock ? 'In Stock' : 'Stock Out'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-lg font-bold text-[#581c23]">{formatPrice(selectedProduct.price)}</p>
                  {selectedProduct.oldPrice && (
                    <>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(selectedProduct.oldPrice)}</span>
                      <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">
                        -{discountPercent(selectedProduct)}%
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-gray-600 mt-3 leading-relaxed">{selectedProduct.description}</p>

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold text-gray-700 mb-2">সাইজ বাছুন</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${
                            selectedSize === s
                              ? 'bg-[#581c23] text-white border-[#581c23]'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-[#581c23]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <button
                    disabled={!selectedProduct.inStock}
                    onClick={() => { handleWhatsAppOrder(selectedProduct, WHATSAPP_1, selectedSize); setSelectedProduct(null); }}
                    className="bg-[#25D366] disabled:bg-gray-300 text-white text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
                  >
                    <MessageCircle size={14} /> WhatsApp 1
                  </button>
                  <button
                    disabled={!selectedProduct.inStock}
                    onClick={() => { handleWhatsAppOrder(selectedProduct, WHATSAPP_2, selectedSize); setSelectedProduct(null); }}
                    className="bg-[#128C7E] disabled:bg-gray-300 text-white text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
                  >
                    <MessageCircle size={14} /> WhatsApp 2
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
