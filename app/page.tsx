import Header from "@/components/Header";
import FlashSaleTimer from "@/components/FlashSaleTimer";
import ProductDetails from "@/components/ProductDetails"; // 👈 এখান থেকে এটি কল হচ্ছে
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <FlashSaleTimer />
        <section className="my-6">
          <ProductDetails /> {/* 👈 এখানে প্রোডাক্ট ডিটেইলস সেকশনটি রেন্ডার হচ্ছে */}
        </section>
        <main className="my-10">
          <FaqSection />
        </main>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
