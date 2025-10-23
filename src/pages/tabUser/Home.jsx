import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import WishlistSidebar from "../../components/WishlistSidebar";

export default function Home() {
  const visitorId = Cookies.get("visitorId");

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="w-full h-[75px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
        <h1 className="text-3xl font-bold text-white">FidCo</h1>
        <nav className="flex items-center gap-4 text-white text-sm">
          <Link to="/" className="hover:text-orange-400">Home</Link>
          <Link to="/menu" className="hover:text-orange-400">Explore</Link>
          <Link to="/about" className="hover:text-orange-400">About</Link>
          <WishlistSidebar visitorId={visitorId} />
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center h-[80vh] bg-gradient-to-r from-[#16607B] to-[#0D3A4D] px-4">
        <h2 className="text-4xl font-bold text-white">Your Workspace Awaits</h2>
        <p className="mt-3 text-base text-gray-200 max-w-md">
          Explore managed offices and coworking spaces tailored for you.
        </p>
        <Link
          to="/menu"
          className="mt-5 px-5 py-2 bg-orange-500 text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="p-5 bg-white shadow-md rounded-2xl text-center">
          <h3 className="text-lg font-bold text-[#16607B]">Managed Offices</h3>
          <p className="mt-2 text-gray-600 text-sm">Move-in ready offices.</p>
        </div>
        <div className="p-5 bg-white shadow-md rounded-2xl text-center">
          <h3 className="text-lg font-bold text-[#16607B]">Co-working Spaces</h3>
          <p className="mt-2 text-gray-600 text-sm">Creative workspaces.</p>
        </div>
        <div className="p-5 bg-white shadow-md rounded-2xl text-center col-span-2">
          <h3 className="text-lg font-bold text-[#16607B]">Virtual Offices</h3>
          <p className="mt-2 text-gray-600 text-sm">Work remotely with presence.</p>
        </div>
      </section>
    </div>
  );
}
