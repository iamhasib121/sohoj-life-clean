"use client";
import { STORE_CONFIG } from "../app/storeConfig";
import React from "react";

export default function FloatingWhatsApp() {
  const phoneNumber = STORE_CONFIG.whatsappNumber;
  const message = "Hello! I want to know more about your products.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
      aria-label="WhatsApp Chat"
    >
      💬
    </button>
  );
}
