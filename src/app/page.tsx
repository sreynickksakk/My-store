import Footer from "@/components/HomePage/Footer";
import Navbar from "@/components/HomePage/Header";
import Banner from "@/components/HomePage/Banner";

import ProductList from "@/components/HomePage/ProductList";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />


      {/* Hero Section */}
      <Banner />

      {/* Products */}
      <ProductList />
      <Footer />
    </div>
  );
}