"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const phoneNumber = "8801700000000"; // আপনার হোয়াটসঅ্যাপ নাম্বারটি এখানে বসিয়ে দিন
  const message = "Hello! I want to know more about your products.";
  
  const handleChatClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleChatClick}
        className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 animate-bounce"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
