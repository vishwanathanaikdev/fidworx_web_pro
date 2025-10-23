// src/pages/mobileUser/AboutUs.jsx
import React, { useState, useRef , useEffect} from 'react';
import { Link,useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import WishlistSidebar from "../../components/WishlistSidebar";
import MobileAuthModal from './mobileComponents/MobileAuthModal';
import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
import { postVisitorData, postLeadData } from "../../api/services/visitorService";
import { searchManagedOffices } from "../../api/services/managedOfficeService";
import MobileBottomNav from './mobileComponents/MobileBottomNav';


export default function AboutUsMobile() {
const location = useLocation();
const currentPath = location.pathname; // e.g., "/", "/menu", "/about"

const visitorId = Cookies.get("visitorId");

   // Modal states
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
    // Lead message
    const [leadMessage, setLeadMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [officeId, setOfficeId] = useState(null);


  // 📦 Fetch default agent and property from managed offices
  // useEffect(() => {
  //   const fetchOfficeAndAgent = async () => {
  //     try {
  //       const result = await searchManagedOffices(1, 1); // just first office
  //       if (result && result.length > 0) {
  //         setUserId(result[0]?.assigned_agent);
  //         setOfficeId(result[0]?._id);
  //         console.log("Fetched office & agent for AboutUs:", result[0]);
  //       } else {
  //         console.warn("No managed offices found.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching office data:", error);
  //     }
  //   };
  //   fetchOfficeAndAgent();
  // }, []);

   useEffect(() => {
      const fetchOfficeAndAgent = async () => {
        try {
          const result = await searchManagedOffices(1, 1); // first office only
    
          // ✅ Use the new API structure
          const office = result?.data?.[0]; 
    
          if (office) {
            setUserId(office.assigned_agent || null);
            setOfficeId(office._id || null);
            console.log("Fetched office & agent for AboutUs:", office);
          } else {
            setUserId(null);
            setOfficeId(null);
            console.warn("No managed offices found.");
          }
        } catch (error) {
          console.error("Error fetching office data:", error);
          setUserId(null);
          setOfficeId(null);
        }
      };
    
      fetchOfficeAndAgent();
    }, []);

  // 🧠 Sync visitor ID if cookies change
  useEffect(() => {
    const interval = setInterval(() => {
      const currentVisitor = Cookies.get("visitorId");
      if (currentVisitor !== visitorIdState) {
        setVisitorIdState(currentVisitor);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [visitorIdState]);

  // 📬 Lead submission function

  const handleLeadSubmit = async (messageToSend) => {
    const visitorId = Cookies.get("visitorId");
    if (!visitorId) return false;
  
    try {
      const leadData = {
        propertyId: officeId,
        visitorId: visitorId,
        assignedAgentId: userId,
        message: messageToSend ?? leadMessage, // use passed message or fallback
      };
  
      await postLeadData(leadData);
      setLeadMessage(""); // reset message
      return true;
    } catch (error) {
      console.error("Error submitting lead:", error);
      return false;
    }
  };
  
  
 
  const handleGetQuoteClick = () => {
    const visitorId = Cookies.get("visitorId");
    if (visitorId) {
      setIsLeadModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 bg-[#16607B] px-4 py-3 text-white flex items-center justify-between">
        <h1 className="text-2xl font-bold">FidCo</h1>
    {/* 🔹 Header Bar */}
<div className="w-full h-[75px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
  {/* Logo */}
  <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
    FidWorx
  </h1>

  {/* Wishlist Sidebar at top-right */}
  <div>
  <WishlistSidebar
  visitorId={visitorIdState}
  onLoginRequired={() => setIsAuthModalOpen(true)}
  onLogout={() => {
    setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
  }}
/>
  </div>
</div>

      </div>

      <main className="px-4 py-6">
        <h2 className="text-2xl font-semibold text-[#16607B]">About Us</h2>
        <p className="mt-3 text-base text-gray-700">
          Mobile-optimized layout. Replace with your mobile Figma layout (stacked sections, larger tap targets, etc.).
        </p>
        <button onClick={handleGetQuoteClick} className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
      Get Started
    </button>
        {/* Example bottom nav if your mobile Figma uses it */}
 <MobileBottomNav/>

      </main>
      {isAuthModalOpen && (
        <MobileAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setIsLeadModalOpen(true);
          }}
        />
      )}
    
<MobileLeadEnquiryModal
  isOpen={isLeadModalOpen}
  onClose={() => setIsLeadModalOpen(false)}
  onSubmit={handleLeadSubmit}
  leadMessage={leadMessage}
  setLeadMessage={setLeadMessage}
/>
    </div>
  );
}








//+====================>>>Old one 

// // src/pages/mobileUser/AboutUs.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";

// export default function AboutUsMobile() {
//   const visitorId = Cookies.get("visitorId");

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Mobile top bar */}
//       <div className="sticky top-0 z-50 bg-[#16607B] px-4 py-3 text-white flex items-center justify-between">
//         <h1 className="text-2xl font-bold">FidCo</h1>
//         <div className="flex items-center gap-3">
//           <Link to="/menu" className="text-sm underline">Explore</Link>
//           <WishlistSidebar visitorId={visitorId} />
//         </div>
//       </div>

//       <main className="px-4 py-6">
//         <h2 className="text-2xl font-semibold text-[#16607B]">About Us</h2>
//         <p className="mt-3 text-base text-gray-700">
//           Mobile-optimized layout. Replace with your mobile Figma layout (stacked sections, larger tap targets, etc.).
//         </p>

//         {/* Example bottom nav if your mobile Figma uses it */}
//         <nav className="fixed inset-x-0 bottom-0 flex items-center justify-between px-6 py-2 bg-white border-t">
//           <Link to="/" className="text-sm">Home</Link>
//           <Link to="/menu" className="text-sm">Explore</Link>
//           <Link to="/about" className="text-sm text-orange-500">About</Link>
//         </nav>
//       </main>
//     </div>
//   );
// }
