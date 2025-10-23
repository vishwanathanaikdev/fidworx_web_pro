// src/pages/tabUser/AboutUs.jsx
import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import WishlistSidebar from "../../components/WishlistSidebar";

export default function AboutUsTablet() {
  const visitorId = Cookies.get("visitorId");

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-[#16607B] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">FidCo</h1>
          <nav className="flex items-center gap-5 text-base">
            <Link to="/" className="hover:text-orange-400">Home</Link>
            <Link to="/menu" className="hover:text-orange-400">Explore</Link>
            <Link to="/about" className="hover:text-orange-400">About</Link>
            <WishlistSidebar visitorId={visitorId} />
          </nav>
        </div>
      </header>

      <main className="px-6 py-10">
        <h2 className="text-3xl font-bold text-[#16607B]">About Us</h2>
        <p className="max-w-3xl mt-4 text-lg text-gray-700">
          Tailored tablet layout. Replace this with your tablet Figma structure.
        </p>
      </main>
    </div>
  );
}
