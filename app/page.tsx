import Header from "@/components/Header";
import FlashSaleTimer from "@/components/FlashSaleTimer";
import ProductDetails from "@/components/ProductDetails.jsx";
import FaqSection from "@/components/FaqSection";
import CustomerReviews from "@/components/CustomerReviews"; // 👈 কাস্টমার রিভিউ ইম্পোর্ট করলাম
//import SocialShare from "@/components/SocialShare";           // 👈 সোশ্যাল শেয়ার ইম্পোর্ট করলাম
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 1. Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Flash Sale Banner with Timer */}
        <FlashSaleTimer />

        {/* Featured Product Detail Section */}
        <section className="my-6">
          <ProductDetails />
        </section>

        {/* Social Share Section */}
        <div className="max-w-7xl mx-auto px-4">
          <SocialShare />
        </div>

        {/* Customer Reviews Section */}
        <section className="my-8">
          <CustomerReviews />
        </section>

        {/* FAQ Section */}
        <section className="my-10">
          <FaqSection />
        </section>
      </main>

      {/* 2. Floating WhatsApp Chat */}
      <FloatingWhatsApp />

      {/* 3. Professional Footer */}
      <Footer />
    </div>
  );
}
