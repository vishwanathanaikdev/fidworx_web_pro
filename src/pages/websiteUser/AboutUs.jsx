import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import AuthModal from "./component/AuthModal";
import LeadEnquiryModal from "./component/LeadEnquiryModal";
import WishlistSidebar from "../../components/WishlistSidebar";

import { searchManagedOffices } from "../../api/services/managedOfficeService";
import { postLeadData } from "../../api/services/visitorService";

export default function AboutUs() {
  // 🌐 State for cookies and data
  const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
  const [userId, setUserId] = useState(null);
  const [officeId, setOfficeId] = useState(null);
  const [leadMessage, setLeadMessage] = useState("");

  // 🧩 Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

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
  
  
  // 📞 Handle Contact Button Click
  const handleContactClick = () => {
    const visitor = Cookies.get("visitorId");
    if (visitor) {
      setIsLeadModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* 🔹 Header */}
      <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
      <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
        <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
            FidWorx
          </h1>
</div>

        <div className="flex items-center gap-6 text-sm text-white">
          <Link to="/" className="transition hover:text-orange-400">
            Home
          </Link>
          <Link to="/menu" className="transition hover:text-orange-400">
            Explore Spaces
          </Link>
          <Link to="/about" className="transition hover:text-orange-400">
            About Us
          </Link>
          <WishlistSidebar
            visitorId={visitorIdState}
            onLoginRequired={() => setIsAuthModalOpen(true)}
            onLogout={() => {
              setVisitorIdState(null);
            }}
          />
        </div>
      </div>

      {/* 🔹 Page Content */}
      <div className="flex flex-col items-center justify-center mt-32 px-6 text-center">
        <h1 className="text-4xl font-bold text-[#16607B]">About Us</h1>
        <p className="max-w-2xl mt-4 text-lg text-gray-700">
          Welcome to{" "}
          <span className="font-semibold text-orange-500">FidWorx</span>. We
          provide modern office solutions tailored for your business growth.
        </p>

        {/* 🧡 Contact Us Button */}
        <button
          onClick={handleContactClick}
          disabled={!userId || !officeId}
          className={`mt-8 px-6 py-3 rounded-xl font-semibold transition ${
            !userId || !officeId
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Contact Us
        </button>
      </div>

      {/* 🔹 Modals */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setIsLeadModalOpen(true);
          }}
        />
      )}

      {isLeadModalOpen && (
        <LeadEnquiryModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
          onSubmit={handleLeadSubmit}
          leadMessage={leadMessage}
          setLeadMessage={setLeadMessage}
        />
      )}
    </div>
  );
}







//============+>>> Old one adding models


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";
// import WishlistSidebar from "../../components/WishlistSidebar";

// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { postLeadData } from "../../api/services/visitorService";

// export default function AboutUs() {
//   // 🌐 State for cookies and data
//   const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   const [leadMessage, setLeadMessage] = useState("");

//   // 🧩 Modal states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

//   // 📦 Fetch default agent and property from managed offices
//   useEffect(() => {
//     const fetchOfficeAndAgent = async () => {
//       try {
//         const result = await searchManagedOffices(1, 1); // just first office
//         if (result && result.length > 0) {
//           setUserId(result[0]?.assigned_agent);
//           setOfficeId(result[0]?._id);
//           console.log("Fetched office & agent for AboutUs:", result[0]);
//         } else {
//           console.warn("No managed offices found.");
//         }
//       } catch (error) {
//         console.error("Error fetching office data:", error);
//       }
//     };
//     fetchOfficeAndAgent();
//   }, []);

//   // 🧠 Sync visitor ID if cookies change
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const currentVisitor = Cookies.get("visitorId");
//       if (currentVisitor !== visitorIdState) {
//         setVisitorIdState(currentVisitor);
//       }
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [visitorIdState]);

//   // 📬 Lead submission function

//   const handleLeadSubmit = async (messageToSend) => {
//     const visitorId = Cookies.get("visitorId");
//     if (!visitorId) return false;
  
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: messageToSend ?? leadMessage, // use passed message or fallback
//       };
  
//       await postLeadData(leadData);
//       setLeadMessage(""); // reset message
//       return true;
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       return false;
//     }
//   };
  
  
//   // 📞 Handle Contact Button Click
//   const handleContactClick = () => {
//     const visitor = Cookies.get("visitorId");
//     if (visitor) {
//       setIsLeadModalOpen(true);
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       {/* 🔹 Header */}
//       <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidCo
//           </h1>
//         </div>

//         <div className="flex items-center gap-6 text-sm text-white">
//           <Link to="/" className="transition hover:text-orange-400">
//             Home
//           </Link>
//           <Link to="/menu" className="transition hover:text-orange-400">
//             Explore Spaces
//           </Link>
//           <Link to="/about" className="transition hover:text-orange-400">
//             About Us
//           </Link>
//           <WishlistSidebar
//             visitorId={visitorIdState}
//             onLoginRequired={() => setIsAuthModalOpen(true)}
//             onLogout={() => {
//               setVisitorIdState(null);
//             }}
//           />
//         </div>
//       </div>

//       {/* 🔹 Page Content */}
//       <div className="flex flex-col items-center justify-center mt-32 px-6 text-center">
//         <h1 className="text-4xl font-bold text-[#16607B]">About Us</h1>
//         <p className="max-w-2xl mt-4 text-lg text-gray-700">
//           Welcome to{" "}
//           <span className="font-semibold text-orange-500">FidCo</span>. We
//           provide modern office solutions tailored for your business growth.
//         </p>

//         {/* 🧡 Contact Us Button */}
//         <button
//           onClick={handleContactClick}
//           disabled={!userId || !officeId}
//           className={`mt-8 px-6 py-3 rounded-xl font-semibold transition ${
//             !userId || !officeId
//               ? "bg-gray-400 cursor-not-allowed text-white"
//               : "bg-orange-500 text-white hover:bg-orange-600"
//           }`}
//         >
//           Contact Us
//         </button>
//       </div>

//       {/* 🔹 Modals */}
//       {isAuthModalOpen && (
//         <AuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//           onSuccess={() => {
//             setIsAuthModalOpen(false);
//             setIsLeadModalOpen(true);
//           }}
//         />
//       )}

//       {isLeadModalOpen && (
//         <LeadEnquiryModal
//           isOpen={isLeadModalOpen}
//           onClose={() => setIsLeadModalOpen(false)}
//           onSubmit={handleLeadSubmit}
//           leadMessage={leadMessage}
//           setLeadMessage={setLeadMessage}
//         />
//       )}
//     </div>
//   );
// }









//------------->>>> old



// import React, { useState, useRef , useEffect} from 'react';
// import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import AuthModal from './component/AuthModal';
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import LeadEnquiryModal from './component/LeadEnquiryModal';
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";

// export default function AboutUs() {
//   // const visitorId = Cookies.get("visitorId");

//   //Model states
//   // Modal states
//   const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

//   // Lead message
//   const [leadMessage, setLeadMessage] = useState("");
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);

// //auth Effects
// //Handle Auto-Login Refresh
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const current = Cookies.get("visitorId");
//       if (current !== visitorIdState) {
//         setVisitorIdState(current);
//       }
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [visitorIdState]);

//      //agent id and property id

//       // 🔥 Utility to get API function based on category
    

//     useEffect(() => {
//       const fetchAll = async () => {
//         const result = await searchManagedOffices(1, 100);
//         setAllData(result);
//         setUserId(result[0].assigned_agent);
//         setOfficeId(result[0]._id);
//         console.log("***************************",result)
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//       };
//       fetchAll();
//     }, []);
//   //Auth function
  
//   const handleLeadSubmit = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return false;
//     }
  
//     // 🔥 Prevent sending if agent or property not ready
//     if (!officeId || !userId) {
//       console.warn("Property or agent not ready yet — skipping lead submit.");
//       return false;
//     }
  
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("Submitting lead:", leadData);
//       await postLeadData(leadData);
//       return true;
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//       return false;
//     }
//   };
  
  
  
  
//   const handleGetQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       setIsLeadModalOpen(true);
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };
  
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidCo
//           </h1>
//         </div>
//         <div className="flex items-center gap-6 text-sm text-white">
//           <Link to="/" className="transition hover:text-orange-400">Home</Link>
//           <Link to="/menu" className="transition hover:text-orange-400">Explore Spaces</Link>
//           <Link to="/about" className="transition hover:text-orange-400">About Us</Link>
//           <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
//         </div>
//       </div>

//       {/* Page Content */}
//       <div className="flex flex-col items-center justify-center mt-32 px-6 text-center">
//         <h1 className="text-4xl font-bold text-[#16607B]">About Us</h1>
//         <p className="max-w-2xl mt-4 text-lg text-gray-700">
//           Welcome to <span className="font-semibold text-orange-500">FidCo</span>. We provide modern office solutions tailored for your business growth.
//         </p>

//         {/* Contact Us Button */}
//         <button
//   disabled={!userId || !officeId}
//   onClick={handleGetQuoteClick}
//   className={`mt-8 px-6 py-3 rounded-xl font-semibold transition ${
//     !userId || !officeId
//       ? "bg-gray-400 cursor-not-allowed"
//       : "bg-orange-500 text-white hover:bg-orange-600"
//   }`}
// >
//   Contact Us
// </button>

//       </div>
//       {/* ✅ Modals */}
//    {isAuthModalOpen && (
//         <AuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//           onSuccess={() => {
//             setIsAuthModalOpen(false);
//             setIsLeadModalOpen(true);
//           }}
//         />
//       )}

// <LeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
//     </div>
//   );
// }








//=== > Old one

// // src/pages/websiteUser/AboutUs.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";

// export default function AboutUs() {
//   const visitorId = Cookies.get("visitorId");

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">FidCo</h1>
//         </div>
//         <div className="flex items-center gap-6 text-sm text-white">
//           <Link to="/" className="transition hover:text-orange-400">Home</Link>
//           <Link to="/menu" className="transition hover:text-orange-400">Explore Spaces</Link>
//           <Link to="/about" className="transition hover:text-orange-400">About Us</Link>
//           <WishlistSidebar visitorId={visitorId} />
//         </div>
//       </div>

//       <h1 className="text-4xl font-bold text-[#16607B]">About Us</h1>
//       <p className="max-w-2xl mt-4 text-lg text-center text-gray-700">
//         Welcome to <span className="font-semibold text-orange-500">FidCo</span>. We provide modern office solutions tailored for your business growth.
//       </p>
//     </div>
//   );
// }

