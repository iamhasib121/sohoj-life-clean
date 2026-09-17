import Header from "@/components/Header";
import FlashSaleTimer from "@/components/FlashSaleTimer";
import ProductDetails from "@/components/ProductDetails";
import FaqSection from "@/components/FaqSection";
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
      )}
    </div>
  );
}
