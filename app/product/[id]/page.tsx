'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Check } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface Product {
  id: string;
  name: string;
  category: string;
  priceNum: number;
  price: string;
  image: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    // LocalStorage বা State-এ কার্ট হ্যান্ডেল করার জন্য হোমপেজের লজিক এখানেও ব্যবহার করতে পারেন
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3F0C13] text-white flex items-center justify-center text-xs">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#3F0C13] text-white flex flex-col items-center justify-center text-xs gap-4">
        <p>Product not found.</p>
        <button onClick={() => router.push('/')} className="bg-[#D4AF37] text-black font-bold px-4 py-2 rounded-full">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3F0C13] text-white font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.push('/')} 
          className="flex items-center gap-2 text-xs text-[#D4AF37] hover:underline font-bold mb-6"
        >
          <ArrowLeft size={16} /> Back to Store
        </button>

        <div className="bg-[#2D060B] border border-[#5C111C] rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
          <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-[#5C111C]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block mb-2">{product.category}</span>
              <h1 className="text-xl md:text-2xl font-black mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                <Star size={14} fill="currentColor" /> <span>4.9 (120+ Reviews)</span>
              </div>

              <div className="text-xl font-black text-[#D4AF37] mb-6">{product.price}</div>

              <p className="text-zinc-300 text-xs leading-relaxed mb-6 font-light">
                Experience ultimate comfort and premium elegance with this meticulously crafted item from Sohoj Life. Designed for modern lifestyle and authentic style.
              </p>

              <div className="space-y-2 text-xs text-zinc-300 border-t border-[#5C111C] pt-4 mb-6">
                <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#D4AF37]" /> 100% Authentic Quality Guaranteed</div>
                <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#D4AF37]" /> Easy 7-Day Returns & Exchanges</div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow ${
                added ? 'bg-emerald-600 text-white' : 'bg-[#D4AF37] hover:bg-[#c29d30] text-black'
              }`}
            >
              {added ? <><Check size={16} /> Added to Cart Successfully!</> : <><ShoppingBag size={16} /> Add to Cart Now</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
