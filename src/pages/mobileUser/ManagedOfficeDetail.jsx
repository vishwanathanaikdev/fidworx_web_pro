import React, { useState, useEffect, useRef } from "react";
// import { mockOfficeData } from "../data/mockOfficeData"; 
import { getManagedOfficeById } from "../../api/services/managedOfficeService";
import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
import Cookies from "js-cookie";

import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
import { useParams } from "react-router-dom";
import { getUserDataById } from "../../api/services/userService";
import MobileAuthModal from './mobileComponents/MobileAuthModal';
import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';

import GroupsScroller from "../../components/GroupsScroller";
// import OfficeHero from "../../components/OfficeHero";
import { Link, useLocation } from "react-router-dom"; 

import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Car,               // 🚗 Parking
  DoorOpen,          // 🚪 Reception Area
  Toilet,            // 🚻 Washrooms
  FireExtinguisher,  // 🔥 Fire Extinguisher
  Shield,            // 🛡️ Security
  Zap,               // ⚡ Power Backup
  Wind,  
  HeartPulse,
  Armchair,            // 🪑 Chairs & Desks
  BarChart3,      // 📊 Meeting Rooms
  Utensils,         // ❄️ Air Conditioning
  Monitor,           // 💻 Private Cabin
  Users,              
  Check,
  Section,

} from "lucide-react";
import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";
import MobileBottomNav from "./mobileComponents/MobileBottomNav";

const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
     const { id } = useParams();
      const location = useLocation();
      const currentPath = location.pathname; 
      const searchParams = new URLSearchParams(location.search);
      const category = searchParams.get("category") || "office";
    
      const [office, setOffice] = useState(null);
      const [loading, setLoading] = useState(true);
        const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
      const [activeTab, setActiveTab] = useState("transit"); // default Transit
      // const [expanded, setExpanded] = useState(null); // which label is expanded
      const [expanded, setExpanded] = useState({
        hospitals: false,
        restaurants: false,
        atms: false,
      });
    
      const [user, setUser] = useState(null);
      const [userId, setUserId] = useState(null);
      const [officeId, setOfficeId] = useState(null);
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [leadMessage, setLeadMessage] = useState("");
    const visitorId = Cookies.get("visitorId");
    const isRestricted = !visitorId;
    const [showFloors, setShowFloors] = useState(false);
    const [showText, setShowText] = useState(false);
    //save Space through card
   // Wishlist states
const [savedSpaces, setSavedSpaces] = useState([]);


    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//profile
useEffect(() => {
  const interval = setInterval(() => {
    setShowText((prev) => !prev); // toggle every 2 seconds
  }, 5000);

  return () => clearInterval(interval); // cleanup on unmount
}, []);


useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await getWishlistData(visitorId);
      if (res?.data) {
        const propertyIds = res.data.map((item) => item.propertyId);
        setSavedSpaces(propertyIds);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  if (visitorId) {
    fetchWishlist();
  }
}, [visitorId]);


    useEffect(() => {
      fetchOffice();
    }, [id, category]);
    
   
const relatedCity = location.state?.city || "";
const relatedProperties = location.state?.relatedProperties?.filter(
  (item) => item.location?.city === relatedCity
) || [];

console.log("Testing getting related properties",relatedProperties)


      const fetchOffice = async () => {
          try {
            let res = null;
            if (category === "managed") res = await getManagedOfficeById(id);
            else if (category === "office") res = await getOfficeSpaceById(id);
            else if (category === "co-working") res = await getCoWorkingSpaceById(id);
      
            setOffice(res);
            setUserId(res?.assigned_agent?._id);
            setOfficeId(res?._id);
          } catch (error) {
            console.error("Error fetching office detail:", error);
          } finally {
            setLoading(false);
          }
        };
      
      useEffect(() => {
        const fetchUser = async () => {
          try {
            if (userId) {
              const userData = await getUserDataById(userId);
              setUser(userData);
            }
          } catch (err) {
            console.error("Failed to fetch user:", err);
          }
        };
    
        fetchUser();
      }, [userId]);

    
    console.log("OFFICEEEEEEEEE data",user)
    console.log("OFFICEEEEEEEEE data",office?.location?.link)
      if (loading) return <p className="p-6">Loading...</p>;
      if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
      //icons
      const amenitiesIcons = {
        parking: { icon: Car, label: "Parking" },
        receptionArea: { icon: DoorOpen, label: "Reception Area" },
        washrooms: { icon: Toilet, label: "Washrooms" },
        fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
        security: { icon: Shield, label: "Security" },
        powerBackup: { icon: Zap, label: "Power Backup" },
        airConditioners: { icon: Wind, label: "Air Conditioning" },
        privateCabin: { icon: Monitor, label: "Private Cabin" },
        recreationArea: { icon: Users, label: "Recreation Area" },
        firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
        pantryArea: { icon: Utensils, label: "Pantry Area" },
        chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
        meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
      };
    
    
      function extractLatLng(link) {
        // Try to match coordinates after '@'
        let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
        if (!match) {
          // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
          match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
        }
      
        if (match) {
          return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
        }
        return null;
      }
      
      const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
      const coords = extractLatLng(url);
      
      if (coords) {
        const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
        console.log("Embed URL:", embedUrl);
      }
      
      const toggleExpand = (key) => {
        setExpanded(expanded === key ? null : key);
      };
      
  
    
    const handleContactQuote = async () => {
      const visitorId = Cookies.get("visitorId");
    
      if (visitorId) {
        console.log("Visitor already exists with ID:", visitorId);
        alert("Visitor already exists, we will reach you.");
        return; // stop here
      }
    
      // else open form modal
      setIsModalOpen(true);
    };
    
    const handleFormSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const res = await postVisitorData(formData);
        console.log("Visitor created:", res);
    
        // store visitorId in cookies
        Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
        alert("Thanks for login. Quote request submitted successfully!");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error submitting quote:", error);
        alert("Something went wrong, please try again.");
      }
    };
    
    
//visitor handlers
const handleContactQuoteClick = () => {
  const visitorId = Cookies.get("visitorId");
  if (visitorId) {
    // If cookie exists → open Lead Modal instead of alert
    setIsLeadModalOpen(true);
  } else {
    // Else → open Login modal
    setIsModalOpen(true);
  }
};
 const handleContactClick = () => {
  setIsProfileModalOpen(false)
    const visitor = Cookies.get("visitorId");
    if (visitor) {
      setIsLeadModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

    //model functions
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

// Function to handle clicking on a related property card
const handleRelatedPropertyClick = async (property) => {
  setOffice(property); // update office data
  setOfficeId(property._id);
  setUserId(property.assigned_agent || null);

  // fetch assigned agent data if exists
  if (property.assigned_agent) {
    try {
      const userData = await getUserDataById(property.assigned_agent);
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user for selected property:", err);
      setUser(null);
    }
  } else {
    setUser(null);
  }

  // Scroll to top or relevant section if needed
  window.scrollTo({ top: 0, behavior: "smooth" });
};


     // Floors list (assuming it's coming as array, else split string)
     {/* DetailBadge Component */}

const DetailBadge = ({ label, value }) => (
  <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
    <span className="text-[11px] text-gray-300">{label}</span>
    <span className="text-sm font-semibold text-white truncate">{value}</span>
  </div>
);


 // Toggle save/remove
 const handleSave = async (propertyId) => {
  try {
    if (savedSpaces.includes(propertyId)) {
      await deleteWishlistData({ visitorId, propertyId });
      setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
    } else {
      await postWishlistData({ visitorId, propertyId });
      setSavedSpaces((prev) => [...prev, propertyId]);
    }
  } catch (err) {
    console.error("Error updating wishlist:", err);
  }
};

//map function
function getEmbedLink(rawLink) {
  if (!rawLink) return "";

  // Try to match "@lat,lng," pattern
  let match = rawLink.match(/@([-0-9.]+),([-0-9.]+)/);
  if (match) {
    const lat = match[1];
    const lng = match[2];
    return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  // Fallback: try "!3dLAT!4dLNG" pattern
  match = rawLink.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
  if (match) {
    const lat = match[1];
    const lng = match[2];
    return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  // If parsing fails, return original link (not embeddable)
  return rawLink;
}

  return (

<div className="flex flex-col bg-gray-100">
  {/* Hero Component */}
  <OfficeHeroMobile  
  office={{ office }}
    onLoginRequired={() => {
      setIsAuthModalOpen(true);
      setIsLeadModalOpen(false); // hide wishlist if open
    }}
    onLogout={() => {
      Cookies.remove("visitorId");
    }}/>

  {/* Building Info Section: immediately below hero with 10px margin */}
  <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
    {/* Building Name */}
    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
      {office?.buildingName} ({category})
    </h1>

    {/* Location with icon */}
    <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
        />
      </svg>
      <span>{office?.location?.locationOfProperty}</span>
    </div>

    {/* Category Based Info */}
    {category === "Office" && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
        <div className="flex items-center gap-1 sm:gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>{office?.generalInfo?.furnishingLevel}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
          </svg>
          <span>{office?.location?.areaSqft} sqft</span>
        </div>
      </div>
    )}

    {category === "Warehouse" && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
        <div>Type: {office?.warehouseInfo?.type}</div>
        <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
      </div>
    )}

    {category === "Retail" && (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
        <div>Frontage: {office?.retailInfo?.frontage} ft</div>
        <div>Floor: {office?.retailInfo?.floor}</div>
      </div>
    )}
  </section>
  <div className="mt-4 px-4">
  {/* Title */}
  <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
    CENTER DETAILS
  </h2>

  {/* General Details card */}
  <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
    {/* Common Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
      {/* Managed Office */}
      {office?.type === "managed" && (
        <>
          <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
          <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
          <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
          <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
          <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
          <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
        </>
      )}

      {/* Office */}
      {office?.type === "office" && (
        <>
          <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
          <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
          <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
          <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
          <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
          <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
          {/* Expandable Floors */}
        {/* Expandable Floors */}
{/* Expandable Floors */}
<div className="col-span-2">
  <button
    onClick={() => setShowFloors(!showFloors)}
    className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
  >
    <span>Floors</span>
    <div className="flex items-center gap-2">
      <span className="text-gray-300 text-[11px]">
        {office?.generalInfo?.floors || "N/A"}
      </span>
      {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </div>
  </button>

  {showFloors && (
    <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
      <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
        {(Array.isArray(office?.generalInfo?.floorsName)
          ? office.generalInfo.floorsName
          : (office?.generalInfo?.floorsName || "").split(",")
        ).map((floor, i) => (
          <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
            {floor.trim()}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
        </>
      )}

      {/* Co-working */}
      {office?.type === "co-working" && (
        <>
          <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
          <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
          <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
          <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
          <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
          <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
          <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
          <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
          <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
          <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
          <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
        </>
      )}
    </div>
  </div>
</div>

{/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
<div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
  {/* Title */}
  <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
    Amenities
  </h2>

  {/* Compact Card Grid */}
  <div className="flex flex-wrap gap-2">
    {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
      const value = office?.amenities?.[key];
      if (value === true || value === "Yes") {
        return (
          <div
            key={key}
            className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
          >
            <Icon className="w-4 h-4 text-orange-500" />
            <span className="text-[12px] font-medium">{label}</span>
          </div>
        );
      }
      return null;
    })}
  </div>

  {/* Bottom Note */}
  <p className="mt-3 text-[10px] text-gray-400 leading-snug">
    ⚠️ Amenities may vary depending on availability.
  </p>
</div>
{/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
<div className="mt-10 w-full   max-w-[890px]">
  {/* Title */}
  <div className="pl-2.5">
  <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
  Location Details
</h2>
  </div>
  {/* Address */}
  <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-orange-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
      />
    </svg>
    <p className="text-[15px] font-medium text-gray-700">
      {office?.location?.address}
    </p>
  </div>

  {/* Main Container */}
  <div className="mt-6 flex flex-col lg:flex-row gap-6">
    {/* Left: Google Maps */}
    {/* <div className="flex-1 shadow-md rounded-lg overflow-hidden">
      {office?.location?.link ? (
        <iframe
          width="100%"
          height="350"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={
            coords
              ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
              : ""
          }
        />
      ) : (
        <p className="text-gray-600 p-4 text-sm">No map link available</p>
      )}
    </div> */}

<div className="h-85 w-full">
    <iframe
      title="office-location"
      src={getEmbedLink(office?.location?.link)}
      width="100%"
      height="100%"
      allowFullScreen
      loading="lazy"
      className="border-0 rounded-t-1xl"
    ></iframe>
  </div>

  <div className="p-2 flex justify-center bg-transparent">
    {office?.location?.link && (
      <a
        href={office.location.link.startsWith("http") ? office.location.link : `https://${office.location.link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-2 py-1.5 text-xs font-small bg-[#16607B] text-white rounded-md hover:bg-[#1a7598] transition-colors duration-200"
      >
        View on Map
      </a>
    )}
  </div>

    {/* Right: Transit / Public Facilities */}
    <div className="flex-1 bg-white shadow-md rounded-lg p-4">
      {/* Toggle Header */}
      <div className="flex gap-6 border-b pb-2 mb-3">
        <button
          className={`text-sm font-medium ${
            activeTab === "transit"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("transit")}
        >
          Transit
        </button>
        <button
          className={`text-sm font-medium ${
            activeTab === "publicFacilities"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("publicFacilities")}
        >
          Public Facilities
        </button>
      </div>

      {/* Content */}
      {activeTab === "transit" && (
        <div className="space-y-3">
          {/* Metro */}
          <div className="border-b pb-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand("metro")}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FaSubway size={16} className="text-orange-400" />
                <span className="text-sm font-medium">Metro Stations</span>
              </div>
              {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expanded === "metro" && (
              <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
                {office?.transit?.metroStations?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Bus */}
          <div className="border-b pb-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand("bus")}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FaBus size={16} className="text-orange-400" />
                <span className="text-sm font-medium">Bus Stations</span>
              </div>
              {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expanded === "bus" && (
              <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
                {office?.transit?.busStations?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Train */}
          <div className="border-b pb-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand("train")}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FaTrain size={16} className="text-orange-400" />
                <span className="text-sm font-medium">Train Stations</span>
              </div>
              {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expanded === "train" && (
              <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
                {office?.transit?.trainStations?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Airports */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand("airports")}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FaPlane size={16} className="text-orange-400" />
                <span className="text-sm font-medium">Airports</span>
              </div>
              {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expanded === "airports" && (
              <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
                {office?.transit?.airports?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === "publicFacilities" && (
        <div className="space-y-3">
          {/* Hospitals */}
          <div className="border-b pb-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand("hospitals")}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FaHospital size={16} className="text-orange-400" />
                <span className="text-sm font-medium">Hospitals</span>
              </div>
              {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expanded === "hospitals" && (
              <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
                {office?.publicFacilities?.hospitals?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Restaurants */}
          <div className="border-b pb-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand("restaurants")}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FaUtensils size={16} className="text-orange-400" />
                <span className="text-sm font-medium">Restaurants</span>
              </div>
              {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expanded === "restaurants" && (
              <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
                {office?.publicFacilities?.restaurants?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* ATMs */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand("atms")}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FaMoneyCheckAlt size={16} className="text-orange-400" />
                <span className="text-sm font-medium">ATMs</span>
              </div>
              {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expanded === "atms" && (
              <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
                {office?.publicFacilities?.atms?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
</div>




{/* ==================== Related Properties Section ==================== */}
<div className="mt-6 px-2">
  {relatedProperties.length > 0 && (
    <>
      <h2 className="text-lg font-semibold text-black mb-4">
        Other Spaces in {relatedCity}
      </h2>

      <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
        {relatedProperties.map((prop) => (
          <div
            key={prop._id}
            className="relative min-w-[250px] h-64 rounded-xl shadow-lg cursor-pointer overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
            onClick={() => handleRelatedPropertyClick(prop)}
          >
            {/* Background Image */}
            <img
              src={prop.images?.[0] || "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"}
              alt={prop.buildingName}
              className="w-full h-full object-cover"
            />

            {/* Overlay - only bottom portion */}
            <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-1">
              <h3 className="text-white text-sm font-bold truncate">
                {prop.buildingName}
              </h3>
              <p className="text-gray-300 text-[11px] truncate">
                {prop.location?.locationOfProperty}, {prop.location?.zone}
              </p>
              <p className="text-gray-300 text-[11px]">
                {prop.generalInfo?.seaterOffered} Seats | ₹{prop.generalInfo?.rentPerSeat}/seat
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {prop.generalInfo?.furnishingLevel && (
                  <span className="bg-black/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
                    {prop.generalInfo.furnishingLevel}
                  </span>
                )}
                {prop.availability_status && (
                  <span className="bg-green-200/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">
                    {prop.availability_status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>



{/* ==================== Reviews / Ratings Section ==================== */}
<div className="mt-6 px-4 pb-24 md:pb-10">
  <h2 className="text-lg font-semibold text-black mb-3">Reviews & Ratings</h2>

 
  <div className="flex items-center gap-2 mb-4">
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${
            star <= 4 ? "text-orange-500" : "text-gray-300"
          }`} 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.285-3.945a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.149a1 1 0 00.951-.69l1.285-3.946z" />
        </svg>
      ))}
    </div>
    <span className="text-sm text-gray-700">(120 Reviews)</span>
  </div>


  <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
    {[
      "Great Location",
      "Friendly Staff",
      "Well Maintained",
      "Affordable Pricing",
      "Excellent Amenities",
    ].map((highlight, idx) => (
      <div
        key={idx}
        className="flex-shrink-0 bg-[#07648c] backdrop-blur-md text-white text-xs px-3 py-1 rounded-full shadow-md"
      >
        {highlight}
      </div>
    ))}
  </div>
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





{/* Mobile Floating Action Buttons with Glass BG */}
{/* Mobile Floating Action Buttons with Glass BG */}
<div className="fixed bottom-13 left-0 w-full px-0 z-50 md:hidden">
  <div className=" p-2 flex gap-2 shadow-lg">
    {/* Enquire Button */}
    <button
      onClick={handleContactClick}
      className="flex-1 border-black-300 bg-orange-500 text-white py-2.5 text-sm rounded-lg font-medium shadow-md
      transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
    >
      Enquire Now
    </button>

    {/* Wishlist Button */}
    <button
  onClick={() => handleSave(office._id)}
  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
    savedSpaces.includes(office._id)
      ? "bg-black text-white"
      : "bg-gray-300 text-black"
  }`}
>
  <Bookmark
    size={18}
    className={`${
      savedSpaces.includes(office._id) ? "fill-white" : "fill-none"
    }`}
  />
  {savedSpaces.includes(office._id) ? "Saved" : "Add to Wishlist"}
</button>

  </div>
</div>




{/* Mobile Floating Profile Button */}
<div className="fixed bottom-28 right-6 z-50 md:hidden">
      <button
        onClick={() => setIsProfileModalOpen(true)}
        className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg flex items-center justify-center bg-black/40 backdrop-blur-md"
      >
        {showText ? (
          <span className="text-white font-semibold text-sm">Help</span>
        ) : (
          <img
            src={user?.profileImage || "https://via.placeholder.com/94"}
            alt={user?.fullName || "Handler"}
            className="object-cover w-full h-full"
          />
        )}
      </button>
    </div>



{/* Mobile Profile Modal */}
{isProfileModalOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
    <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
      {/* Close Button */}
      <button
        onClick={() => setIsProfileModalOpen(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
      >
        ✕
      </button>

      {/* Header */}
      <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
        Upgrade your Space office with {user?.fullName || "Our Team"}
        <br />
      <span> to get the best price and best deals for your space.</span>
      </h2>

      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mt-3">
        <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
          <img
            src={user?.profileImage || "https://via.placeholder.com/94"}
            alt={user?.fullName || "Handler"}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
        <p className="text-[10px] text-gray-600">{user?.mobile}</p>
        <p className="text-[10px] text-gray-600">{user?.email}</p>

        <button
          onClick={handleContactClick}
          className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
        >
          Contact {user?.fullName?.split(" ")[0]}
        </button>
      </div>

  {/* Logos Section */}
  <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
          alt="Logo1"
          className="w-[24px] h-[24px]"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
          alt="Logo2"
          className="w-[24px] h-[24px]"
        />
        <img
          src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
          alt="Logo3"
          className="w-[24px] h-[24px]"
        />
        <img
          src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
          alt="Logo4"
          className="w-[24px] h-[24px]"
        />
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
          alt="Logo5"
          className="w-[24px] h-[24px]"
        />
      </div>
      {/* Key Points Section */}
      <div className="mt-3 text-[10px] text-gray-700">
        <p className="mb-2 font-bold text-[10px]">
          Explore workspace solutions with our expert guidance:
        </p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-600" />
            <span>Workspace selection & location strategy</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-600" />
            <span>Workspace tours</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-600" />
            <span>Layout design & customization assistance</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-600" />
            <span>Terms negotiations & deal signing</span>
          </li>
        </ul>
      </div>

      {/* Info Box */}
      <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
        {user?.fullName} and team assisted{" "}
        <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
      </div>
    </div>
  </div>
)}
        {/* Example bottom nav if your mobile Figma uses it */}
<MobileBottomNav/>
</div>

  )
}

export default ManagedOfficeDetail








//=========>>> Map adding


// import React, { useState, useEffect, useRef } from "react";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";

// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';

// import GroupsScroller from "../../components/GroupsScroller";
// // import OfficeHero from "../../components/OfficeHero";
// import { Link, useLocation } from "react-router-dom"; 

// import {
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Bookmark,
//   Car,               // 🚗 Parking
//   DoorOpen,          // 🚪 Reception Area
//   Toilet,            // 🚻 Washrooms
//   FireExtinguisher,  // 🔥 Fire Extinguisher
//   Shield,            // 🛡️ Security
//   Zap,               // ⚡ Power Backup
//   Wind,  
//   HeartPulse,
//   Armchair,            // 🪑 Chairs & Desks
//   BarChart3,      // 📊 Meeting Rooms
//   Utensils,         // ❄️ Air Conditioning
//   Monitor,           // 💻 Private Cabin
//   Users,              
//   Check,
//   Section,

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";
// import MobileBottomNav from "./mobileComponents/MobileBottomNav";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       const location = useLocation();
//       const currentPath = location.pathname; 
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "office";
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
//         const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//       const [activeTab, setActiveTab] = useState("transit"); // default Transit
//       // const [expanded, setExpanded] = useState(null); // which label is expanded
//       const [expanded, setExpanded] = useState({
//         hospitals: false,
//         restaurants: false,
//         atms: false,
//       });
    
//       const [user, setUser] = useState(null);
//       const [userId, setUserId] = useState(null);
//       const [officeId, setOfficeId] = useState(null);
  
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [leadMessage, setLeadMessage] = useState("");
//     const visitorId = Cookies.get("visitorId");
//     const isRestricted = !visitorId;
//     const [showFloors, setShowFloors] = useState(false);
//     const [showText, setShowText] = useState(false);
//     //save Space through card
//    // Wishlist states
// const [savedSpaces, setSavedSpaces] = useState([]);


//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
// //profile
// useEffect(() => {
//   const interval = setInterval(() => {
//     setShowText((prev) => !prev); // toggle every 2 seconds
//   }, 5000);

//   return () => clearInterval(interval); // cleanup on unmount
// }, []);


// useEffect(() => {
//   const fetchWishlist = async () => {
//     try {
//       const res = await getWishlistData(visitorId);
//       if (res?.data) {
//         const propertyIds = res.data.map((item) => item.propertyId);
//         setSavedSpaces(propertyIds);
//       }
//     } catch (err) {
//       console.error("Error fetching wishlist:", err);
//     }
//   };

//   if (visitorId) {
//     fetchWishlist();
//   }
// }, [visitorId]);


//     useEffect(() => {
//       fetchOffice();
//     }, [id, category]);
    
   
// const relatedCity = location.state?.city || "";
// const relatedProperties = location.state?.relatedProperties?.filter(
//   (item) => item.location?.city === relatedCity
// ) || [];

// console.log("Testing getting related properties",relatedProperties)


//       const fetchOffice = async () => {
//           try {
//             let res = null;
//             if (category === "managed") res = await getManagedOfficeById(id);
//             else if (category === "office") res = await getOfficeSpaceById(id);
//             else if (category === "co-working") res = await getCoWorkingSpaceById(id);
      
//             setOffice(res);
//             setUserId(res?.assigned_agent?._id);
//             setOfficeId(res?._id);
//           } catch (error) {
//             console.error("Error fetching office detail:", error);
//           } finally {
//             setLoading(false);
//           }
//         };
      
//       useEffect(() => {
//         const fetchUser = async () => {
//           try {
//             if (userId) {
//               const userData = await getUserDataById(userId);
//               setUser(userData);
//             }
//           } catch (err) {
//             console.error("Failed to fetch user:", err);
//           }
//         };
    
//         fetchUser();
//       }, [userId]);

    
//     console.log("OFFICEEEEEEEEE data",user)
//     console.log("OFFICEEEEEEEEE data",office?.location?.link)
//       if (loading) return <p className="p-6">Loading...</p>;
//       if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
//       //icons
//       const amenitiesIcons = {
//         parking: { icon: Car, label: "Parking" },
//         receptionArea: { icon: DoorOpen, label: "Reception Area" },
//         washrooms: { icon: Toilet, label: "Washrooms" },
//         fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
//         security: { icon: Shield, label: "Security" },
//         powerBackup: { icon: Zap, label: "Power Backup" },
//         airConditioners: { icon: Wind, label: "Air Conditioning" },
//         privateCabin: { icon: Monitor, label: "Private Cabin" },
//         recreationArea: { icon: Users, label: "Recreation Area" },
//         firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
//         pantryArea: { icon: Utensils, label: "Pantry Area" },
//         chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
//         meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
//       };
    
    
//       function extractLatLng(link) {
//         // Try to match coordinates after '@'
//         let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
//         if (!match) {
//           // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
//           match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
//         }
      
//         if (match) {
//           return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
//         }
//         return null;
//       }
      
//       const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
//       const coords = extractLatLng(url);
      
//       if (coords) {
//         const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
//         console.log("Embed URL:", embedUrl);
//       }
      
//       const toggleExpand = (key) => {
//         setExpanded(expanded === key ? null : key);
//       };
      
  
    
//     const handleContactQuote = async () => {
//       const visitorId = Cookies.get("visitorId");
    
//       if (visitorId) {
//         console.log("Visitor already exists with ID:", visitorId);
//         alert("Visitor already exists, we will reach you.");
//         return; // stop here
//       }
    
//       // else open form modal
//       setIsModalOpen(true);
//     };
    
//     const handleFormSubmit = async (e) => {
//       e.preventDefault();
    
//       try {
//         const res = await postVisitorData(formData);
//         console.log("Visitor created:", res);
    
//         // store visitorId in cookies
//         Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
//         alert("Thanks for login. Quote request submitted successfully!");
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error submitting quote:", error);
//         alert("Something went wrong, please try again.");
//       }
//     };
    
    
// //visitor handlers
// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     // If cookie exists → open Lead Modal instead of alert
//     setIsLeadModalOpen(true);
//   } else {
//     // Else → open Login modal
//     setIsModalOpen(true);
//   }
// };
//  const handleContactClick = () => {
//   setIsProfileModalOpen(false)
//     const visitor = Cookies.get("visitorId");
//     if (visitor) {
//       setIsLeadModalOpen(true);
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };

//     //model functions
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

// // Function to handle clicking on a related property card
// const handleRelatedPropertyClick = async (property) => {
//   setOffice(property); // update office data
//   setOfficeId(property._id);
//   setUserId(property.assigned_agent || null);

//   // fetch assigned agent data if exists
//   if (property.assigned_agent) {
//     try {
//       const userData = await getUserDataById(property.assigned_agent);
//       setUser(userData);
//     } catch (err) {
//       console.error("Failed to fetch user for selected property:", err);
//       setUser(null);
//     }
//   } else {
//     setUser(null);
//   }

//   // Scroll to top or relevant section if needed
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//      // Floors list (assuming it's coming as array, else split string)
//      {/* DetailBadge Component */}

// const DetailBadge = ({ label, value }) => (
//   <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
//     <span className="text-[11px] text-gray-300">{label}</span>
//     <span className="text-sm font-semibold text-white truncate">{value}</span>
//   </div>
// );


//  // Toggle save/remove
//  const handleSave = async (propertyId) => {
//   try {
//     if (savedSpaces.includes(propertyId)) {
//       await deleteWishlistData({ visitorId, propertyId });
//       setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//     } else {
//       await postWishlistData({ visitorId, propertyId });
//       setSavedSpaces((prev) => [...prev, propertyId]);
//     }
//   } catch (err) {
//     console.error("Error updating wishlist:", err);
//   }
// };



//   return (

// <div className="flex flex-col bg-gray-100">
//   {/* Hero Component */}
//   <OfficeHeroMobile  
//   office={{ office }}
//     onLoginRequired={() => {
//       setIsAuthModalOpen(true);
//       setIsLeadModalOpen(false); // hide wishlist if open
//     }}
//     onLogout={() => {
//       Cookies.remove("visitorId");
//     }}/>

//   {/* Building Info Section: immediately below hero with 10px margin */}
//   <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
//     {/* Building Name */}
//     <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//       {office?.buildingName} ({category})
//     </h1>

//     {/* Location with icon */}
//     <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//         />
//       </svg>
//       <span>{office?.location?.locationOfProperty}</span>
//     </div>

//     {/* Category Based Info */}
//     {category === "Office" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <span>{office?.generalInfo?.furnishingLevel}</span>
//         </div>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//           </svg>
//           <span>{office?.location?.areaSqft} sqft</span>
//         </div>
//       </div>
//     )}

//     {category === "Warehouse" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Type: {office?.warehouseInfo?.type}</div>
//         <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
//       </div>
//     )}

//     {category === "Retail" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Frontage: {office?.retailInfo?.frontage} ft</div>
//         <div>Floor: {office?.retailInfo?.floor}</div>
//       </div>
//     )}
//   </section>
//   <div className="mt-4 px-4">
//   {/* Title */}
//   <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
//     CENTER DETAILS
//   </h2>

//   {/* General Details card */}
//   <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
//     {/* Common Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
//       {/* Managed Office */}
//       {office?.type === "managed" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//         </>
//       )}

//       {/* Office */}
//       {office?.type === "office" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           {/* Expandable Floors */}
//         {/* Expandable Floors */}
// {/* Expandable Floors */}
// <div className="col-span-2">
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
//   >
//     <span>Floors</span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-300 text-[11px]">
//         {office?.generalInfo?.floors || "N/A"}
//       </span>
//       {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//     </div>
//   </button>

//   {showFloors && (
//     <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
//       <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
//         {(Array.isArray(office?.generalInfo?.floorsName)
//           ? office.generalInfo.floorsName
//           : (office?.generalInfo?.floorsName || "").split(",")
//         ).map((floor, i) => (
//           <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
//             {floor.trim()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>
//         </>
//       )}

//       {/* Co-working */}
//       {office?.type === "co-working" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
//           <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
//           <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
//           <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
//           <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
//         </>
//       )}
//     </div>
//   </div>
// </div>

// {/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
// <div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
//   {/* Title */}
//   <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
//     Amenities
//   </h2>

//   {/* Compact Card Grid */}
//   <div className="flex flex-wrap gap-2">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div
//             key={key}
//             className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
//           >
//             <Icon className="w-4 h-4 text-orange-500" />
//             <span className="text-[12px] font-medium">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom Note */}
//   <p className="mt-3 text-[10px] text-gray-400 leading-snug">
//     ⚠️ Amenities may vary depending on availability.
//   </p>
// </div>
// {/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
// <div className="mt-10 w-full   max-w-[890px]">
//   {/* Title */}
//   <div className="pl-2.5">
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
//   Location Details
// </h2>
//   </div>
//   {/* Address */}
//   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-5 h-5 text-orange-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <p className="text-[15px] font-medium text-gray-700">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Main Container */}
//   <div className="mt-6 flex flex-col lg:flex-row gap-6">
//     {/* Left: Google Maps */}
//     <div className="flex-1 shadow-md rounded-lg overflow-hidden">
//       {office?.location?.link ? (
//         <iframe
//           width="100%"
//           height="350"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={
//             coords
//               ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//               : ""
//           }
//         />
//       ) : (
//         <p className="text-gray-600 p-4 text-sm">No map link available</p>
//       )}
//     </div>

//     {/* Right: Transit / Public Facilities */}
//     <div className="flex-1 bg-white shadow-md rounded-lg p-4">
//       {/* Toggle Header */}
//       <div className="flex gap-6 border-b pb-2 mb-3">
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "transit"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "publicFacilities"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-3">
//           {/* Metro */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaSubway size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaBus size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaTrain size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaPlane size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "publicFacilities" && (
//         <div className="space-y-3">
//           {/* Hospitals */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("hospitals")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaHospital size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Hospitals</span>
//               </div>
//               {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "hospitals" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.hospitals?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Restaurants */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("restaurants")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaUtensils size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Restaurants</span>
//               </div>
//               {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "restaurants" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.restaurants?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ATMs */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("atms")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaMoneyCheckAlt size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">ATMs</span>
//               </div>
//               {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "atms" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.atms?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>




// {/* ==================== Related Properties Section ==================== */}
// <div className="mt-6 px-2">
//   {relatedProperties.length > 0 && (
//     <>
//       <h2 className="text-lg font-semibold text-black mb-4">
//         Other Spaces in {relatedCity}
//       </h2>

//       <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
//         {relatedProperties.map((prop) => (
//           <div
//             key={prop._id}
//             className="relative min-w-[250px] h-64 rounded-xl shadow-lg cursor-pointer overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
//             onClick={() => handleRelatedPropertyClick(prop)}
//           >
//             {/* Background Image */}
//             <img
//               src={prop.images?.[0] || "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"}
//               alt={prop.buildingName}
//               className="w-full h-full object-cover"
//             />

//             {/* Overlay - only bottom portion */}
//             <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-1">
//               <h3 className="text-white text-sm font-bold truncate">
//                 {prop.buildingName}
//               </h3>
//               <p className="text-gray-300 text-[11px] truncate">
//                 {prop.location?.locationOfProperty}, {prop.location?.zone}
//               </p>
//               <p className="text-gray-300 text-[11px]">
//                 {prop.generalInfo?.seaterOffered} Seats | ₹{prop.generalInfo?.rentPerSeat}/seat
//               </p>
//               <div className="flex flex-wrap gap-1 mt-1">
//                 {prop.generalInfo?.furnishingLevel && (
//                   <span className="bg-black/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.generalInfo.furnishingLevel}
//                   </span>
//                 )}
//                 {prop.availability_status && (
//                   <span className="bg-green-200/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.availability_status}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   )}
// </div>



// {/* ==================== Reviews / Ratings Section ==================== */}
// <div className="mt-6 px-4 pb-24 md:pb-10">
//   <h2 className="text-lg font-semibold text-black mb-3">Reviews & Ratings</h2>

 
//   <div className="flex items-center gap-2 mb-4">
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           xmlns="http://www.w3.org/2000/svg"
//           className={`w-5 h-5 ${
//             star <= 4 ? "text-orange-500" : "text-gray-300"
//           }`} 
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.285-3.945a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.149a1 1 0 00.951-.69l1.285-3.946z" />
//         </svg>
//       ))}
//     </div>
//     <span className="text-sm text-gray-700">(120 Reviews)</span>
//   </div>


//   <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
//     {[
//       "Great Location",
//       "Friendly Staff",
//       "Well Maintained",
//       "Affordable Pricing",
//       "Excellent Amenities",
//     ].map((highlight, idx) => (
//       <div
//         key={idx}
//         className="flex-shrink-0 bg-[#07648c] backdrop-blur-md text-white text-xs px-3 py-1 rounded-full shadow-md"
//       >
//         {highlight}
//       </div>
//     ))}
//   </div>
//   {isAuthModalOpen && (
//         <MobileAuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//           onSuccess={() => {
//             setIsAuthModalOpen(false);
//             setIsLeadModalOpen(true);
//           }}
//         />
//       )}
    
// <MobileLeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
// </div>





// {/* Mobile Floating Action Buttons with Glass BG */}
// {/* Mobile Floating Action Buttons with Glass BG */}
// <div className="fixed bottom-13 left-0 w-full px-0 z-50 md:hidden">
//   <div className=" p-2 flex gap-2 shadow-lg">
//     {/* Enquire Button */}
//     <button
//       onClick={handleContactClick}
//       className="flex-1 border-black-300 bg-orange-500 text-white py-2.5 text-sm rounded-lg font-medium shadow-md
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Enquire Now
//     </button>

//     {/* Wishlist Button */}
//     <button
//   onClick={() => handleSave(office._id)}
//   className={`px-4 py-2 rounded-md flex items-center gap-2 ${
//     savedSpaces.includes(office._id)
//       ? "bg-black text-white"
//       : "bg-gray-300 text-black"
//   }`}
// >
//   <Bookmark
//     size={18}
//     className={`${
//       savedSpaces.includes(office._id) ? "fill-white" : "fill-none"
//     }`}
//   />
//   {savedSpaces.includes(office._id) ? "Saved" : "Add to Wishlist"}
// </button>

//   </div>
// </div>




// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-28 right-6 z-50 md:hidden">
//       <button
//         onClick={() => setIsProfileModalOpen(true)}
//         className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg flex items-center justify-center bg-black/40 backdrop-blur-md"
//       >
//         {showText ? (
//           <span className="text-white font-semibold text-sm">Help</span>
//         ) : (
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         )}
//       </button>
//     </div>



// {/* Mobile Profile Modal */}
// {isProfileModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
//     <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
//         Upgrade your Space office with {user?.fullName || "Our Team"}
//         <br />
//       <span> to get the best price and best deals for your space.</span>
//       </h2>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center mt-3">
//         <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[10px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[10px] text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactClick}
//           className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo1"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo2"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
//           alt="Logo3"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
//           alt="Logo4"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
//           alt="Logo5"
//           className="w-[24px] h-[24px]"
//         />
//       </div>
//       {/* Key Points Section */}
//       <div className="mt-3 text-[10px] text-gray-700">
//         <p className="mb-2 font-bold text-[10px]">
//           Explore workspace solutions with our expert guidance:
//         </p>
//         <ul className="space-y-1">
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace selection & location strategy</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace tours</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Layout design & customization assistance</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Terms negotiations & deal signing</span>
//           </li>
//         </ul>
//       </div>

//       {/* Info Box */}
//       <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}
//         {/* Example bottom nav if your mobile Figma uses it */}
// <MobileBottomNav/>
// </div>

//   )
// }

// export default ManagedOfficeDetail








//=====>>> Old one adding wishlist 



// import React, { useState, useEffect, useRef } from "react";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';

// import GroupsScroller from "../../components/GroupsScroller";
// // import OfficeHero from "../../components/OfficeHero";
// import { Link, useLocation } from "react-router-dom"; 

// import {
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Bookmark,
//   Car,               // 🚗 Parking
//   DoorOpen,          // 🚪 Reception Area
//   Toilet,            // 🚻 Washrooms
//   FireExtinguisher,  // 🔥 Fire Extinguisher
//   Shield,            // 🛡️ Security
//   Zap,               // ⚡ Power Backup
//   Wind,  
//   HeartPulse,
//   Armchair,            // 🪑 Chairs & Desks
//   BarChart3,      // 📊 Meeting Rooms
//   Utensils,         // ❄️ Air Conditioning
//   Monitor,           // 💻 Private Cabin
//   Users,              
//   Check,
//   Section,

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";
// import MobileBottomNav from "./mobileComponents/MobileBottomNav";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       const location = useLocation();
//       const currentPath = location.pathname; 
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "office";
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
//         const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//       const [activeTab, setActiveTab] = useState("transit"); // default Transit
//       // const [expanded, setExpanded] = useState(null); // which label is expanded
//       const [expanded, setExpanded] = useState({
//         hospitals: false,
//         restaurants: false,
//         atms: false,
//       });
    
//       const [user, setUser] = useState(null);
//       const [userId, setUserId] = useState(null);
//       const [officeId, setOfficeId] = useState(null);
  
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [leadMessage, setLeadMessage] = useState("");
//     const visitorId = Cookies.get("visitorId");
//     const isRestricted = !visitorId;
//     const [showFloors, setShowFloors] = useState(false);
//     const [showText, setShowText] = useState(false);
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
// //profile
// useEffect(() => {
//   const interval = setInterval(() => {
//     setShowText((prev) => !prev); // toggle every 2 seconds
//   }, 5000);

//   return () => clearInterval(interval); // cleanup on unmount
// }, []);

//     useEffect(() => {
//       fetchOffice();
//     }, [id, category]);
    
   
// const relatedCity = location.state?.city || "";
// const relatedProperties = location.state?.relatedProperties?.filter(
//   (item) => item.location?.city === relatedCity
// ) || [];

// console.log("Testing getting related properties",relatedProperties)


//       const fetchOffice = async () => {
//           try {
//             let res = null;
//             if (category === "managed") res = await getManagedOfficeById(id);
//             else if (category === "office") res = await getOfficeSpaceById(id);
//             else if (category === "co-working") res = await getCoWorkingSpaceById(id);
      
//             setOffice(res);
//             setUserId(res?.assigned_agent?._id);
//             setOfficeId(res?._id);
//           } catch (error) {
//             console.error("Error fetching office detail:", error);
//           } finally {
//             setLoading(false);
//           }
//         };
      
//       useEffect(() => {
//         const fetchUser = async () => {
//           try {
//             if (userId) {
//               const userData = await getUserDataById(userId);
//               setUser(userData);
//             }
//           } catch (err) {
//             console.error("Failed to fetch user:", err);
//           }
//         };
    
//         fetchUser();
//       }, [userId]);

    
//     console.log("OFFICEEEEEEEEE data",user)
//     console.log("OFFICEEEEEEEEE data",office?.location?.link)
//       if (loading) return <p className="p-6">Loading...</p>;
//       if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
//       //icons
//       const amenitiesIcons = {
//         parking: { icon: Car, label: "Parking" },
//         receptionArea: { icon: DoorOpen, label: "Reception Area" },
//         washrooms: { icon: Toilet, label: "Washrooms" },
//         fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
//         security: { icon: Shield, label: "Security" },
//         powerBackup: { icon: Zap, label: "Power Backup" },
//         airConditioners: { icon: Wind, label: "Air Conditioning" },
//         privateCabin: { icon: Monitor, label: "Private Cabin" },
//         recreationArea: { icon: Users, label: "Recreation Area" },
//         firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
//         pantryArea: { icon: Utensils, label: "Pantry Area" },
//         chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
//         meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
//       };
    
    
//       function extractLatLng(link) {
//         // Try to match coordinates after '@'
//         let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
//         if (!match) {
//           // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
//           match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
//         }
      
//         if (match) {
//           return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
//         }
//         return null;
//       }
      
//       const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
//       const coords = extractLatLng(url);
      
//       if (coords) {
//         const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
//         console.log("Embed URL:", embedUrl);
//       }
      
//       const toggleExpand = (key) => {
//         setExpanded(expanded === key ? null : key);
//       };
      
  
    
//     const handleContactQuote = async () => {
//       const visitorId = Cookies.get("visitorId");
    
//       if (visitorId) {
//         console.log("Visitor already exists with ID:", visitorId);
//         alert("Visitor already exists, we will reach you.");
//         return; // stop here
//       }
    
//       // else open form modal
//       setIsModalOpen(true);
//     };
    
//     const handleFormSubmit = async (e) => {
//       e.preventDefault();
    
//       try {
//         const res = await postVisitorData(formData);
//         console.log("Visitor created:", res);
    
//         // store visitorId in cookies
//         Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
//         alert("Thanks for login. Quote request submitted successfully!");
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error submitting quote:", error);
//         alert("Something went wrong, please try again.");
//       }
//     };
    
    
// //visitor handlers
// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     // If cookie exists → open Lead Modal instead of alert
//     setIsLeadModalOpen(true);
//   } else {
//     // Else → open Login modal
//     setIsModalOpen(true);
//   }
// };
//  const handleContactClick = () => {
//   setIsProfileModalOpen(false)
//     const visitor = Cookies.get("visitorId");
//     if (visitor) {
//       setIsLeadModalOpen(true);
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };

//     //model functions
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

// // Function to handle clicking on a related property card
// const handleRelatedPropertyClick = async (property) => {
//   setOffice(property); // update office data
//   setOfficeId(property._id);
//   setUserId(property.assigned_agent || null);

//   // fetch assigned agent data if exists
//   if (property.assigned_agent) {
//     try {
//       const userData = await getUserDataById(property.assigned_agent);
//       setUser(userData);
//     } catch (err) {
//       console.error("Failed to fetch user for selected property:", err);
//       setUser(null);
//     }
//   } else {
//     setUser(null);
//   }

//   // Scroll to top or relevant section if needed
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//      // Floors list (assuming it's coming as array, else split string)
//      {/* DetailBadge Component */}

// const DetailBadge = ({ label, value }) => (
//   <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
//     <span className="text-[11px] text-gray-300">{label}</span>
//     <span className="text-sm font-semibold text-white truncate">{value}</span>
//   </div>
// );




//   return (

// <div className="flex flex-col bg-gray-100">
//   {/* Hero Component */}
//   <OfficeHeroMobile  
//   office={{ office }}
//     onLoginRequired={() => {
//       setIsAuthModalOpen(true);
//       setIsLeadModalOpen(false); // hide wishlist if open
//     }}
//     onLogout={() => {
//       Cookies.remove("visitorId");
//     }}/>

//   {/* Building Info Section: immediately below hero with 10px margin */}
//   <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
//     {/* Building Name */}
//     <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//       {office?.buildingName} ({category})
//     </h1>

//     {/* Location with icon */}
//     <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//         />
//       </svg>
//       <span>{office?.location?.locationOfProperty}</span>
//     </div>

//     {/* Category Based Info */}
//     {category === "Office" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <span>{office?.generalInfo?.furnishingLevel}</span>
//         </div>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//           </svg>
//           <span>{office?.location?.areaSqft} sqft</span>
//         </div>
//       </div>
//     )}

//     {category === "Warehouse" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Type: {office?.warehouseInfo?.type}</div>
//         <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
//       </div>
//     )}

//     {category === "Retail" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Frontage: {office?.retailInfo?.frontage} ft</div>
//         <div>Floor: {office?.retailInfo?.floor}</div>
//       </div>
//     )}
//   </section>
//   <div className="mt-4 px-4">
//   {/* Title */}
//   <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
//     CENTER DETAILS
//   </h2>

//   {/* General Details card */}
//   <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
//     {/* Common Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
//       {/* Managed Office */}
//       {office?.type === "managed" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//         </>
//       )}

//       {/* Office */}
//       {office?.type === "office" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           {/* Expandable Floors */}
//         {/* Expandable Floors */}
// {/* Expandable Floors */}
// <div className="col-span-2">
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
//   >
//     <span>Floors</span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-300 text-[11px]">
//         {office?.generalInfo?.floors || "N/A"}
//       </span>
//       {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//     </div>
//   </button>

//   {showFloors && (
//     <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
//       <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
//         {(Array.isArray(office?.generalInfo?.floorsName)
//           ? office.generalInfo.floorsName
//           : (office?.generalInfo?.floorsName || "").split(",")
//         ).map((floor, i) => (
//           <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
//             {floor.trim()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>
//         </>
//       )}

//       {/* Co-working */}
//       {office?.type === "co-working" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
//           <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
//           <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
//           <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
//           <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
//         </>
//       )}
//     </div>
//   </div>
// </div>

// {/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
// <div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
//   {/* Title */}
//   <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
//     Amenities
//   </h2>

//   {/* Compact Card Grid */}
//   <div className="flex flex-wrap gap-2">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div
//             key={key}
//             className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
//           >
//             <Icon className="w-4 h-4 text-orange-500" />
//             <span className="text-[12px] font-medium">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom Note */}
//   <p className="mt-3 text-[10px] text-gray-400 leading-snug">
//     ⚠️ Amenities may vary depending on availability.
//   </p>
// </div>
// {/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
// <div className="mt-10 w-full   max-w-[890px]">
//   {/* Title */}
//   <div className="pl-2.5">
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
//   Location Details
// </h2>
//   </div>
//   {/* Address */}
//   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-5 h-5 text-orange-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <p className="text-[15px] font-medium text-gray-700">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Main Container */}
//   <div className="mt-6 flex flex-col lg:flex-row gap-6">
//     {/* Left: Google Maps */}
//     <div className="flex-1 shadow-md rounded-lg overflow-hidden">
//       {office?.location?.link ? (
//         <iframe
//           width="100%"
//           height="350"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={
//             coords
//               ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//               : ""
//           }
//         />
//       ) : (
//         <p className="text-gray-600 p-4 text-sm">No map link available</p>
//       )}
//     </div>

//     {/* Right: Transit / Public Facilities */}
//     <div className="flex-1 bg-white shadow-md rounded-lg p-4">
//       {/* Toggle Header */}
//       <div className="flex gap-6 border-b pb-2 mb-3">
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "transit"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "publicFacilities"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-3">
//           {/* Metro */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaSubway size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaBus size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaTrain size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaPlane size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "publicFacilities" && (
//         <div className="space-y-3">
//           {/* Hospitals */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("hospitals")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaHospital size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Hospitals</span>
//               </div>
//               {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "hospitals" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.hospitals?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Restaurants */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("restaurants")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaUtensils size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Restaurants</span>
//               </div>
//               {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "restaurants" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.restaurants?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ATMs */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("atms")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaMoneyCheckAlt size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">ATMs</span>
//               </div>
//               {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "atms" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.atms?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>




// {/* ==================== Related Properties Section ==================== */}
// <div className="mt-6 px-2">
//   {relatedProperties.length > 0 && (
//     <>
//       <h2 className="text-lg font-semibold text-black mb-4">
//         Other Spaces in {relatedCity}
//       </h2>

//       <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
//         {relatedProperties.map((prop) => (
//           <div
//             key={prop._id}
//             className="relative min-w-[250px] h-64 rounded-xl shadow-lg cursor-pointer overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
//             onClick={() => handleRelatedPropertyClick(prop)}
//           >
//             {/* Background Image */}
//             <img
//               src={prop.images?.[0] || "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"}
//               alt={prop.buildingName}
//               className="w-full h-full object-cover"
//             />

//             {/* Overlay - only bottom portion */}
//             <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-1">
//               <h3 className="text-white text-sm font-bold truncate">
//                 {prop.buildingName}
//               </h3>
//               <p className="text-gray-300 text-[11px] truncate">
//                 {prop.location?.locationOfProperty}, {prop.location?.zone}
//               </p>
//               <p className="text-gray-300 text-[11px]">
//                 {prop.generalInfo?.seaterOffered} Seats | ₹{prop.generalInfo?.rentPerSeat}/seat
//               </p>
//               <div className="flex flex-wrap gap-1 mt-1">
//                 {prop.generalInfo?.furnishingLevel && (
//                   <span className="bg-black/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.generalInfo.furnishingLevel}
//                   </span>
//                 )}
//                 {prop.availability_status && (
//                   <span className="bg-green-200/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.availability_status}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   )}
// </div>



// {/* ==================== Reviews / Ratings Section ==================== */}
// <div className="mt-6 px-4 pb-24 md:pb-10">
//   <h2 className="text-lg font-semibold text-black mb-3">Reviews & Ratings</h2>

 
//   <div className="flex items-center gap-2 mb-4">
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           xmlns="http://www.w3.org/2000/svg"
//           className={`w-5 h-5 ${
//             star <= 4 ? "text-orange-500" : "text-gray-300"
//           }`} 
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.285-3.945a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.149a1 1 0 00.951-.69l1.285-3.946z" />
//         </svg>
//       ))}
//     </div>
//     <span className="text-sm text-gray-700">(120 Reviews)</span>
//   </div>


//   <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
//     {[
//       "Great Location",
//       "Friendly Staff",
//       "Well Maintained",
//       "Affordable Pricing",
//       "Excellent Amenities",
//     ].map((highlight, idx) => (
//       <div
//         key={idx}
//         className="flex-shrink-0 bg-[#07648c] backdrop-blur-md text-white text-xs px-3 py-1 rounded-full shadow-md"
//       >
//         {highlight}
//       </div>
//     ))}
//   </div>
//   {isAuthModalOpen && (
//         <MobileAuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//           onSuccess={() => {
//             setIsAuthModalOpen(false);
//             setIsLeadModalOpen(true);
//           }}
//         />
//       )}
    
// <MobileLeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
// </div>





// {/* Mobile Floating Action Buttons with Glass BG */}
// {/* Mobile Floating Action Buttons with Glass BG */}
// <div className="fixed bottom-13 left-0 w-full px-0 z-50 md:hidden">
//   <div className=" p-2 flex gap-2 shadow-lg">
//     {/* Enquire Button */}
//     <button
//       onClick={handleContactClick}
//       className="flex-1 border-black-300 bg-orange-500 text-white py-2.5 text-sm rounded-lg font-medium shadow-md
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Enquire Now
//     </button>

//     {/* Wishlist Button */}
//     <button
//       className="flex-1 bg-white text-black py-2.5 text-sm rounded-lg font-medium shadow-md
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Add to Wishlist
//     </button>
//   </div>
// </div>




// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-28 right-6 z-50 md:hidden">
//       <button
//         onClick={() => setIsProfileModalOpen(true)}
//         className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg flex items-center justify-center bg-black/40 backdrop-blur-md"
//       >
//         {showText ? (
//           <span className="text-white font-semibold text-sm">Help</span>
//         ) : (
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         )}
//       </button>
//     </div>



// {/* Mobile Profile Modal */}
// {isProfileModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
//     <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
//         Upgrade your Space office with {user?.fullName || "Our Team"}
//         <br />
//       <span> to get the best price and best deals for your space.</span>
//       </h2>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center mt-3">
//         <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[10px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[10px] text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactClick}
//           className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo1"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo2"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
//           alt="Logo3"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
//           alt="Logo4"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
//           alt="Logo5"
//           className="w-[24px] h-[24px]"
//         />
//       </div>
//       {/* Key Points Section */}
//       <div className="mt-3 text-[10px] text-gray-700">
//         <p className="mb-2 font-bold text-[10px]">
//           Explore workspace solutions with our expert guidance:
//         </p>
//         <ul className="space-y-1">
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace selection & location strategy</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace tours</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Layout design & customization assistance</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Terms negotiations & deal signing</span>
//           </li>
//         </ul>
//       </div>

//       {/* Info Box */}
//       <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}
//         {/* Example bottom nav if your mobile Figma uses it */}
// <MobileBottomNav/>
// </div>

//   )
// }

// export default ManagedOfficeDetail








//=======>> All are good working on removing side navbar


// import React, { useState, useEffect, useRef } from "react";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';

// import GroupsScroller from "../../components/GroupsScroller";
// // import OfficeHero from "../../components/OfficeHero";
// import { useLocation } from "react-router-dom"; 

// import {
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Bookmark,
//   Car,               // 🚗 Parking
//   DoorOpen,          // 🚪 Reception Area
//   Toilet,            // 🚻 Washrooms
//   FireExtinguisher,  // 🔥 Fire Extinguisher
//   Shield,            // 🛡️ Security
//   Zap,               // ⚡ Power Backup
//   Wind,  
//   HeartPulse,
//   Armchair,            // 🪑 Chairs & Desks
//   BarChart3,      // 📊 Meeting Rooms
//   Utensils,         // ❄️ Air Conditioning
//   Monitor,           // 💻 Private Cabin
//   Users,              
//   Check,
//   Section,

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "office";
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
//         const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//       const [activeTab, setActiveTab] = useState("transit"); // default Transit
//       // const [expanded, setExpanded] = useState(null); // which label is expanded
//       const [expanded, setExpanded] = useState({
//         hospitals: false,
//         restaurants: false,
//         atms: false,
//       });
    
//       const [user, setUser] = useState(null);
//       const [userId, setUserId] = useState(null);
//       const [officeId, setOfficeId] = useState(null);
  
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [leadMessage, setLeadMessage] = useState("");
//     const visitorId = Cookies.get("visitorId");
//     const isRestricted = !visitorId;
//     const [showFloors, setShowFloors] = useState(false);
//     const [showText, setShowText] = useState(false);
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
// //profile
// useEffect(() => {
//   const interval = setInterval(() => {
//     setShowText((prev) => !prev); // toggle every 2 seconds
//   }, 5000);

//   return () => clearInterval(interval); // cleanup on unmount
// }, []);

//     useEffect(() => {
//       fetchOffice();
//     }, [id, category]);
    
   
// const relatedCity = location.state?.city || "";
// const relatedProperties = location.state?.relatedProperties?.filter(
//   (item) => item.location?.city === relatedCity
// ) || [];

// console.log("Testing getting related properties",relatedProperties)


//       const fetchOffice = async () => {
//           try {
//             let res = null;
//             if (category === "managed") res = await getManagedOfficeById(id);
//             else if (category === "office") res = await getOfficeSpaceById(id);
//             else if (category === "co-working") res = await getCoWorkingSpaceById(id);
      
//             setOffice(res);
//             setUserId(res?.assigned_agent?._id);
//             setOfficeId(res?._id);
//           } catch (error) {
//             console.error("Error fetching office detail:", error);
//           } finally {
//             setLoading(false);
//           }
//         };
      
//       useEffect(() => {
//         const fetchUser = async () => {
//           try {
//             if (userId) {
//               const userData = await getUserDataById(userId);
//               setUser(userData);
//             }
//           } catch (err) {
//             console.error("Failed to fetch user:", err);
//           }
//         };
    
//         fetchUser();
//       }, [userId]);

    
//     console.log("OFFICEEEEEEEEE data",user)
//     console.log("OFFICEEEEEEEEE data",office?.location?.link)
//       if (loading) return <p className="p-6">Loading...</p>;
//       if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
//       //icons
//       const amenitiesIcons = {
//         parking: { icon: Car, label: "Parking" },
//         receptionArea: { icon: DoorOpen, label: "Reception Area" },
//         washrooms: { icon: Toilet, label: "Washrooms" },
//         fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
//         security: { icon: Shield, label: "Security" },
//         powerBackup: { icon: Zap, label: "Power Backup" },
//         airConditioners: { icon: Wind, label: "Air Conditioning" },
//         privateCabin: { icon: Monitor, label: "Private Cabin" },
//         recreationArea: { icon: Users, label: "Recreation Area" },
//         firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
//         pantryArea: { icon: Utensils, label: "Pantry Area" },
//         chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
//         meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
//       };
    
    
//       function extractLatLng(link) {
//         // Try to match coordinates after '@'
//         let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
//         if (!match) {
//           // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
//           match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
//         }
      
//         if (match) {
//           return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
//         }
//         return null;
//       }
      
//       const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
//       const coords = extractLatLng(url);
      
//       if (coords) {
//         const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
//         console.log("Embed URL:", embedUrl);
//       }
      
//       const toggleExpand = (key) => {
//         setExpanded(expanded === key ? null : key);
//       };
      
  
    
//     const handleContactQuote = async () => {
//       const visitorId = Cookies.get("visitorId");
    
//       if (visitorId) {
//         console.log("Visitor already exists with ID:", visitorId);
//         alert("Visitor already exists, we will reach you.");
//         return; // stop here
//       }
    
//       // else open form modal
//       setIsModalOpen(true);
//     };
    
//     const handleFormSubmit = async (e) => {
//       e.preventDefault();
    
//       try {
//         const res = await postVisitorData(formData);
//         console.log("Visitor created:", res);
    
//         // store visitorId in cookies
//         Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
//         alert("Thanks for login. Quote request submitted successfully!");
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error submitting quote:", error);
//         alert("Something went wrong, please try again.");
//       }
//     };
    
    
// //visitor handlers
// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     // If cookie exists → open Lead Modal instead of alert
//     setIsLeadModalOpen(true);
//   } else {
//     // Else → open Login modal
//     setIsModalOpen(true);
//   }
// };
//  const handleContactClick = () => {
//   setIsProfileModalOpen(false)
//     const visitor = Cookies.get("visitorId");
//     if (visitor) {
//       setIsLeadModalOpen(true);
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };

//     //model functions
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

// // Function to handle clicking on a related property card
// const handleRelatedPropertyClick = async (property) => {
//   setOffice(property); // update office data
//   setOfficeId(property._id);
//   setUserId(property.assigned_agent || null);

//   // fetch assigned agent data if exists
//   if (property.assigned_agent) {
//     try {
//       const userData = await getUserDataById(property.assigned_agent);
//       setUser(userData);
//     } catch (err) {
//       console.error("Failed to fetch user for selected property:", err);
//       setUser(null);
//     }
//   } else {
//     setUser(null);
//   }

//   // Scroll to top or relevant section if needed
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//      // Floors list (assuming it's coming as array, else split string)
//      {/* DetailBadge Component */}

// const DetailBadge = ({ label, value }) => (
//   <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
//     <span className="text-[11px] text-gray-300">{label}</span>
//     <span className="text-sm font-semibold text-white truncate">{value}</span>
//   </div>
// );




//   return (

// <div className="flex flex-col bg-gray-100">
//   {/* Hero Component */}
//   <OfficeHeroMobile  
//   office={{ office }}
//     onLoginRequired={() => {
//       setIsAuthModalOpen(true);
//       setIsLeadModalOpen(false); // hide wishlist if open
//     }}
//     onLogout={() => {
//       Cookies.remove("visitorId");
//     }}/>

//   {/* Building Info Section: immediately below hero with 10px margin */}
//   <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
//     {/* Building Name */}
//     <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//       {office?.buildingName} ({category})
//     </h1>

//     {/* Location with icon */}
//     <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//         />
//       </svg>
//       <span>{office?.location?.locationOfProperty}</span>
//     </div>

//     {/* Category Based Info */}
//     {category === "Office" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <span>{office?.generalInfo?.furnishingLevel}</span>
//         </div>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//           </svg>
//           <span>{office?.location?.areaSqft} sqft</span>
//         </div>
//       </div>
//     )}

//     {category === "Warehouse" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Type: {office?.warehouseInfo?.type}</div>
//         <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
//       </div>
//     )}

//     {category === "Retail" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Frontage: {office?.retailInfo?.frontage} ft</div>
//         <div>Floor: {office?.retailInfo?.floor}</div>
//       </div>
//     )}
//   </section>
//   <div className="mt-4 px-4">
//   {/* Title */}
//   <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
//     CENTER DETAILS
//   </h2>

//   {/* General Details card */}
//   <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
//     {/* Common Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
//       {/* Managed Office */}
//       {office?.type === "managed" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//         </>
//       )}

//       {/* Office */}
//       {office?.type === "office" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           {/* Expandable Floors */}
//         {/* Expandable Floors */}
// {/* Expandable Floors */}
// <div className="col-span-2">
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
//   >
//     <span>Floors</span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-300 text-[11px]">
//         {office?.generalInfo?.floors || "N/A"}
//       </span>
//       {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//     </div>
//   </button>

//   {showFloors && (
//     <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
//       <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
//         {(Array.isArray(office?.generalInfo?.floorsName)
//           ? office.generalInfo.floorsName
//           : (office?.generalInfo?.floorsName || "").split(",")
//         ).map((floor, i) => (
//           <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
//             {floor.trim()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>


//         </>
//       )}

//       {/* Co-working */}
//       {office?.type === "co-working" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
//           <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
//           <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
//           <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
//           <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
//         </>
//       )}
//     </div>
//   </div>
// </div>

// {/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
// <div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
//   {/* Title */}
//   <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
//     Amenities
//   </h2>

//   {/* Compact Card Grid */}
//   <div className="flex flex-wrap gap-2">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div
//             key={key}
//             className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
//           >
//             <Icon className="w-4 h-4 text-orange-500" />
//             <span className="text-[12px] font-medium">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom Note */}
//   <p className="mt-3 text-[10px] text-gray-400 leading-snug">
//     ⚠️ Amenities may vary depending on availability.
//   </p>
// </div>
// {/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
// <div className="mt-10 w-full   max-w-[890px]">
//   {/* Title */}
//   <div className="pl-2.5">
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
//   Location Details
// </h2>

//   </div>



//   {/* Address */}
//   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-5 h-5 text-orange-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <p className="text-[15px] font-medium text-gray-700">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Main Container */}
//   <div className="mt-6 flex flex-col lg:flex-row gap-6">
//     {/* Left: Google Maps */}
//     <div className="flex-1 shadow-md rounded-lg overflow-hidden">
//       {office?.location?.link ? (
//         <iframe
//           width="100%"
//           height="350"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={
//             coords
//               ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//               : ""
//           }
//         />
//       ) : (
//         <p className="text-gray-600 p-4 text-sm">No map link available</p>
//       )}
//     </div>

//     {/* Right: Transit / Public Facilities */}
//     <div className="flex-1 bg-white shadow-md rounded-lg p-4">
//       {/* Toggle Header */}
//       <div className="flex gap-6 border-b pb-2 mb-3">
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "transit"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "publicFacilities"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-3">
//           {/* Metro */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaSubway size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaBus size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaTrain size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaPlane size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "publicFacilities" && (
//         <div className="space-y-3">
//           {/* Hospitals */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("hospitals")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaHospital size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Hospitals</span>
//               </div>
//               {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "hospitals" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.hospitals?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Restaurants */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("restaurants")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaUtensils size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Restaurants</span>
//               </div>
//               {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "restaurants" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.restaurants?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ATMs */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("atms")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaMoneyCheckAlt size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">ATMs</span>
//               </div>
//               {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "atms" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.atms?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>




// {/* ==================== Related Properties Section ==================== */}
// <div className="mt-6 px-2">
//   {relatedProperties.length > 0 && (
//     <>
//       <h2 className="text-lg font-semibold text-black mb-4">
//         Other Spaces in {relatedCity}
//       </h2>

//       <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
//         {relatedProperties.map((prop) => (
//           <div
//             key={prop._id}
//             className="relative min-w-[250px] h-64 rounded-xl shadow-lg cursor-pointer overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
//             onClick={() => handleRelatedPropertyClick(prop)}
//           >
//             {/* Background Image */}
//             <img
//               src={prop.images?.[0] || "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"}
//               alt={prop.buildingName}
//               className="w-full h-full object-cover"
//             />

//             {/* Overlay - only bottom portion */}
//             <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-1">
//               <h3 className="text-white text-sm font-bold truncate">
//                 {prop.buildingName}
//               </h3>
//               <p className="text-gray-300 text-[11px] truncate">
//                 {prop.location?.locationOfProperty}, {prop.location?.zone}
//               </p>
//               <p className="text-gray-300 text-[11px]">
//                 {prop.generalInfo?.seaterOffered} Seats | ₹{prop.generalInfo?.rentPerSeat}/seat
//               </p>
//               <div className="flex flex-wrap gap-1 mt-1">
//                 {prop.generalInfo?.furnishingLevel && (
//                   <span className="bg-black/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.generalInfo.furnishingLevel}
//                   </span>
//                 )}
//                 {prop.availability_status && (
//                   <span className="bg-green-200/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.availability_status}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   )}
// </div>



// {/* ==================== Reviews / Ratings Section ==================== */}
// <div className="mt-6 px-4 pb-24 md:pb-10">
//   <h2 className="text-lg font-semibold text-black mb-3">Reviews & Ratings</h2>

 
//   <div className="flex items-center gap-2 mb-4">
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           xmlns="http://www.w3.org/2000/svg"
//           className={`w-5 h-5 ${
//             star <= 4 ? "text-orange-500" : "text-gray-300"
//           }`} 
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.285-3.945a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.149a1 1 0 00.951-.69l1.285-3.946z" />
//         </svg>
//       ))}
//     </div>
//     <span className="text-sm text-gray-700">(120 Reviews)</span>
//   </div>


//   <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
//     {[
//       "Great Location",
//       "Friendly Staff",
//       "Well Maintained",
//       "Affordable Pricing",
//       "Excellent Amenities",
//     ].map((highlight, idx) => (
//       <div
//         key={idx}
//         className="flex-shrink-0 bg-[#07648c] backdrop-blur-md text-white text-xs px-3 py-1 rounded-full shadow-md"
//       >
//         {highlight}
//       </div>
//     ))}
//   </div>
//   {isAuthModalOpen && (
//         <MobileAuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//           onSuccess={() => {
//             setIsAuthModalOpen(false);
//             setIsLeadModalOpen(true);
//           }}
//         />
//       )}
    
// <MobileLeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
// </div>





// {/* Mobile Floating Action Buttons with Glass BG */}
// <div className="fixed bottom-0 left-0 w-full px-0 z-50 md:hidden">
//   <div className="bg-black/40 backdrop-blur-md p-3 flex gap-3 shadow-lg">
//     {/* Enquire Button */}
//     <button
//       onClick={handleContactClick}
//       className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-md 
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Enquire Now
//     </button>

//     {/* Wishlist Button */}
//     <button
//       className="flex-1 bg-white text-black py-3 rounded-xl font-semibold shadow-md 
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Add to Wishlist
//     </button>
//   </div>
// </div>



// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-28 right-6 z-50 md:hidden">
//       <button
//         onClick={() => setIsProfileModalOpen(true)}
//         className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg flex items-center justify-center bg-black/40 backdrop-blur-md"
//       >
//         {showText ? (
//           <span className="text-white font-semibold text-sm">Help</span>
//         ) : (
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         )}
//       </button>
//     </div>



// {/* Mobile Profile Modal */}
// {isProfileModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
//     <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
//         Upgrade your Space office with {user?.fullName || "Our Team"}
//         <br />
//       <span> to get the best price and best deals for your space.</span>
//       </h2>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center mt-3">
//         <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[10px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[10px] text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactClick}
//           className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo1"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo2"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
//           alt="Logo3"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
//           alt="Logo4"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
//           alt="Logo5"
//           className="w-[24px] h-[24px]"
//         />
//       </div>
//       {/* Key Points Section */}
//       <div className="mt-3 text-[10px] text-gray-700">
//         <p className="mb-2 font-bold text-[10px]">
//           Explore workspace solutions with our expert guidance:
//         </p>
//         <ul className="space-y-1">
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace selection & location strategy</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace tours</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Layout design & customization assistance</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Terms negotiations & deal signing</span>
//           </li>
//         </ul>
//       </div>

//       {/* Info Box */}
//       <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}

// </div>

//   )
// }

// export default ManagedOfficeDetail








//========>> Working on the login flow


// import React, { useState, useEffect, useRef } from "react";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";

// import GroupsScroller from "../../components/GroupsScroller";
// // import OfficeHero from "../../components/OfficeHero";
// import { useLocation } from "react-router-dom"; 

// import {
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Bookmark,
//   Car,               // 🚗 Parking
//   DoorOpen,          // 🚪 Reception Area
//   Toilet,            // 🚻 Washrooms
//   FireExtinguisher,  // 🔥 Fire Extinguisher
//   Shield,            // 🛡️ Security
//   Zap,               // ⚡ Power Backup
//   Wind,  
//   HeartPulse,
//   Armchair,            // 🪑 Chairs & Desks
//   BarChart3,      // 📊 Meeting Rooms
//   Utensils,         // ❄️ Air Conditioning
//   Monitor,           // 💻 Private Cabin
//   Users,              
//   Check,
//   Section,

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "office";
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
//         const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//       const [activeTab, setActiveTab] = useState("transit"); // default Transit
//       // const [expanded, setExpanded] = useState(null); // which label is expanded
//       const [expanded, setExpanded] = useState({
//         hospitals: false,
//         restaurants: false,
//         atms: false,
//       });
    
//       const [user, setUser] = useState(null);
//       const [userId, setUserId] = useState(null);
//       const [officeId, setOfficeId] = useState(null);
  
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [leadMessage, setLeadMessage] = useState("");
//     const visitorId = Cookies.get("visitorId");
//     const isRestricted = !visitorId;
//     const [showFloors, setShowFloors] = useState(false);
//     const [showText, setShowText] = useState(false);
// //profile
// useEffect(() => {
//   const interval = setInterval(() => {
//     setShowText((prev) => !prev); // toggle every 2 seconds
//   }, 5000);

//   return () => clearInterval(interval); // cleanup on unmount
// }, []);

//     useEffect(() => {
//       fetchOffice();
//     }, [id, category]);
    
   
// const relatedCity = location.state?.city || "";
// const relatedProperties = location.state?.relatedProperties?.filter(
//   (item) => item.location?.city === relatedCity
// ) || [];

// console.log("Testing getting related properties",relatedProperties)


//       const fetchOffice = async () => {
//           try {
//             let res = null;
//             if (category === "managed") res = await getManagedOfficeById(id);
//             else if (category === "office") res = await getOfficeSpaceById(id);
//             else if (category === "co-working") res = await getCoWorkingSpaceById(id);
      
//             setOffice(res);
//             setUserId(res?.assigned_agent?._id);
//             setOfficeId(res?._id);
//           } catch (error) {
//             console.error("Error fetching office detail:", error);
//           } finally {
//             setLoading(false);
//           }
//         };
      
//       useEffect(() => {
//         const fetchUser = async () => {
//           try {
//             if (userId) {
//               const userData = await getUserDataById(userId);
//               setUser(userData);
//             }
//           } catch (err) {
//             console.error("Failed to fetch user:", err);
//           }
//         };
    
//         fetchUser();
//       }, [userId]);

    
//     console.log("OFFICEEEEEEEEE data",user)
//     console.log("OFFICEEEEEEEEE data",office?.location?.link)
//       if (loading) return <p className="p-6">Loading...</p>;
//       if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
//       //icons
//       const amenitiesIcons = {
//         parking: { icon: Car, label: "Parking" },
//         receptionArea: { icon: DoorOpen, label: "Reception Area" },
//         washrooms: { icon: Toilet, label: "Washrooms" },
//         fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
//         security: { icon: Shield, label: "Security" },
//         powerBackup: { icon: Zap, label: "Power Backup" },
//         airConditioners: { icon: Wind, label: "Air Conditioning" },
//         privateCabin: { icon: Monitor, label: "Private Cabin" },
//         recreationArea: { icon: Users, label: "Recreation Area" },
//         firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
//         pantryArea: { icon: Utensils, label: "Pantry Area" },
//         chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
//         meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
//       };
    
    
//       function extractLatLng(link) {
//         // Try to match coordinates after '@'
//         let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
//         if (!match) {
//           // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
//           match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
//         }
      
//         if (match) {
//           return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
//         }
//         return null;
//       }
      
//       const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
//       const coords = extractLatLng(url);
      
//       if (coords) {
//         const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
//         console.log("Embed URL:", embedUrl);
//       }
      
//       const toggleExpand = (key) => {
//         setExpanded(expanded === key ? null : key);
//       };
      
    
    
//     //visitor handlers
//     const handleContactQuoteClick = () => {
     
//       const visitorId = Cookies.get("visitorId");
//       if (visitorId) {
//         // If cookie exists → open Lead Modal instead of alert
//         setIsLeadModalOpen(true);
      
//       } else {
//         // Else → open Login modal
        
//         setIsModalOpen(true);
//       }
//     };
    
    
//     const handleContactQuote = async () => {
//       const visitorId = Cookies.get("visitorId");
    
//       if (visitorId) {
//         console.log("Visitor already exists with ID:", visitorId);
//         alert("Visitor already exists, we will reach you.");
//         return; // stop here
//       }
    
//       // else open form modal
//       setIsModalOpen(true);
//     };
    
//     const handleFormSubmit = async (e) => {
//       e.preventDefault();
    
//       try {
//         const res = await postVisitorData(formData);
//         console.log("Visitor created:", res);
    
//         // store visitorId in cookies
//         Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
//         alert("Thanks for login. Quote request submitted successfully!");
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error submitting quote:", error);
//         alert("Something went wrong, please try again.");
//       }
//     };
    
    
//     const handleLeadSubmit = async (e) => {
//       e.preventDefault();
//       const visitorId = Cookies.get("visitorId");
    
//       if (!visitorId) {
//         alert("Visitor not found, please login first.");
//         return;
//       }
    
//       try {
//         const leadData = {
//           propertyId: officeId,
//           visitorId: visitorId,
//           assignedAgentId: userId,
//           message: leadMessage,
//         };
//         console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
    
//         const res = await postLeadData(leadData);
//         console.log("Lead created:", res);
    
//         alert("Your enquiry has been submitted successfully!");
//         setIsLeadModalOpen(false);
//         setLeadMessage("");
//       } catch (error) {
//         console.error("Error submitting lead:", error);
//         alert("Something went wrong while submitting lead.");
//       }
//     };
    
// // Function to handle clicking on a related property card
// const handleRelatedPropertyClick = async (property) => {
//   setOffice(property); // update office data
//   setOfficeId(property._id);
//   setUserId(property.assigned_agent || null);

//   // fetch assigned agent data if exists
//   if (property.assigned_agent) {
//     try {
//       const userData = await getUserDataById(property.assigned_agent);
//       setUser(userData);
//     } catch (err) {
//       console.error("Failed to fetch user for selected property:", err);
//       setUser(null);
//     }
//   } else {
//     setUser(null);
//   }

//   // Scroll to top or relevant section if needed
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//      // Floors list (assuming it's coming as array, else split string)
//      {/* DetailBadge Component */}

// const DetailBadge = ({ label, value }) => (
//   <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
//     <span className="text-[11px] text-gray-300">{label}</span>
//     <span className="text-sm font-semibold text-white truncate">{value}</span>
//   </div>
// );


//   return (

// <div className="flex flex-col bg-gray-100">
//   {/* Hero Component */}
//   <OfficeHeroMobile office={{ office }} />

//   {/* Building Info Section: immediately below hero with 10px margin */}
//   <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
//     {/* Building Name */}
//     <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//       {office?.buildingName} ({category})
//     </h1>

//     {/* Location with icon */}
//     <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//         />
//       </svg>
//       <span>{office?.location?.locationOfProperty}</span>
//     </div>

//     {/* Category Based Info */}
//     {category === "Office" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <span>{office?.generalInfo?.furnishingLevel}</span>
//         </div>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//           </svg>
//           <span>{office?.location?.areaSqft} sqft</span>
//         </div>
//       </div>
//     )}

//     {category === "Warehouse" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Type: {office?.warehouseInfo?.type}</div>
//         <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
//       </div>
//     )}

//     {category === "Retail" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Frontage: {office?.retailInfo?.frontage} ft</div>
//         <div>Floor: {office?.retailInfo?.floor}</div>
//       </div>
//     )}
//   </section>
//   <div className="mt-4 px-4">
//   {/* Title */}
//   <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
//     CENTER DETAILS
//   </h2>

//   {/* General Details card */}
//   <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
//     {/* Common Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
//       {/* Managed Office */}
//       {office?.type === "managed" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//         </>
//       )}

//       {/* Office */}
//       {office?.type === "office" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           {/* Expandable Floors */}
//         {/* Expandable Floors */}
// {/* Expandable Floors */}
// <div className="col-span-2">
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
//   >
//     <span>Floors</span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-300 text-[11px]">
//         {office?.generalInfo?.floors || "N/A"}
//       </span>
//       {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//     </div>
//   </button>

//   {showFloors && (
//     <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
//       <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
//         {(Array.isArray(office?.generalInfo?.floorsName)
//           ? office.generalInfo.floorsName
//           : (office?.generalInfo?.floorsName || "").split(",")
//         ).map((floor, i) => (
//           <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
//             {floor.trim()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>


//         </>
//       )}

//       {/* Co-working */}
//       {office?.type === "co-working" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
//           <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
//           <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
//           <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
//           <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
//         </>
//       )}
//     </div>
//   </div>
// </div>

// {/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
// <div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
//   {/* Title */}
//   <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
//     Amenities
//   </h2>

//   {/* Compact Card Grid */}
//   <div className="flex flex-wrap gap-2">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div
//             key={key}
//             className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
//           >
//             <Icon className="w-4 h-4 text-orange-500" />
//             <span className="text-[12px] font-medium">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom Note */}
//   <p className="mt-3 text-[10px] text-gray-400 leading-snug">
//     ⚠️ Amenities may vary depending on availability.
//   </p>
// </div>
// {/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
// <div className="mt-10 w-full   max-w-[890px]">
//   {/* Title */}
//   <div className="pl-2.5">
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
//   Location Details
// </h2>

//   </div>



//   {/* Address */}
//   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-5 h-5 text-orange-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <p className="text-[15px] font-medium text-gray-700">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Main Container */}
//   <div className="mt-6 flex flex-col lg:flex-row gap-6">
//     {/* Left: Google Maps */}
//     <div className="flex-1 shadow-md rounded-lg overflow-hidden">
//       {office?.location?.link ? (
//         <iframe
//           width="100%"
//           height="350"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={
//             coords
//               ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//               : ""
//           }
//         />
//       ) : (
//         <p className="text-gray-600 p-4 text-sm">No map link available</p>
//       )}
//     </div>

//     {/* Right: Transit / Public Facilities */}
//     <div className="flex-1 bg-white shadow-md rounded-lg p-4">
//       {/* Toggle Header */}
//       <div className="flex gap-6 border-b pb-2 mb-3">
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "transit"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "publicFacilities"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-3">
//           {/* Metro */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaSubway size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaBus size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaTrain size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaPlane size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "publicFacilities" && (
//         <div className="space-y-3">
//           {/* Hospitals */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("hospitals")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaHospital size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Hospitals</span>
//               </div>
//               {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "hospitals" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.hospitals?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Restaurants */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("restaurants")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaUtensils size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Restaurants</span>
//               </div>
//               {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "restaurants" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.restaurants?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ATMs */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("atms")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaMoneyCheckAlt size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">ATMs</span>
//               </div>
//               {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "atms" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.atms?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>




// {/* ==================== Related Properties Section ==================== */}
// <div className="mt-6 px-2">
//   {relatedProperties.length > 0 && (
//     <>
//       <h2 className="text-lg font-semibold text-black mb-4">
//         Other Spaces in {relatedCity}
//       </h2>

//       <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
//         {relatedProperties.map((prop) => (
//           <div
//             key={prop._id}
//             className="relative min-w-[250px] h-64 rounded-xl shadow-lg cursor-pointer overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
//             onClick={() => handleRelatedPropertyClick(prop)}
//           >
//             {/* Background Image */}
//             <img
//               src={prop.images?.[0] || "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"}
//               alt={prop.buildingName}
//               className="w-full h-full object-cover"
//             />

//             {/* Overlay - only bottom portion */}
//             <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-1">
//               <h3 className="text-white text-sm font-bold truncate">
//                 {prop.buildingName}
//               </h3>
//               <p className="text-gray-300 text-[11px] truncate">
//                 {prop.location?.locationOfProperty}, {prop.location?.zone}
//               </p>
//               <p className="text-gray-300 text-[11px]">
//                 {prop.generalInfo?.seaterOffered} Seats | ₹{prop.generalInfo?.rentPerSeat}/seat
//               </p>
//               <div className="flex flex-wrap gap-1 mt-1">
//                 {prop.generalInfo?.furnishingLevel && (
//                   <span className="bg-black/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.generalInfo.furnishingLevel}
//                   </span>
//                 )}
//                 {prop.availability_status && (
//                   <span className="bg-green-200/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.availability_status}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   )}
// </div>



// {/* ==================== Reviews / Ratings Section ==================== */}
// <div className="mt-6 px-4 pb-24 md:pb-10">
//   <h2 className="text-lg font-semibold text-black mb-3">Reviews & Ratings</h2>

 
//   <div className="flex items-center gap-2 mb-4">
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           xmlns="http://www.w3.org/2000/svg"
//           className={`w-5 h-5 ${
//             star <= 4 ? "text-orange-500" : "text-gray-300"
//           }`} 
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.285-3.945a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.149a1 1 0 00.951-.69l1.285-3.946z" />
//         </svg>
//       ))}
//     </div>
//     <span className="text-sm text-gray-700">(120 Reviews)</span>
//   </div>


//   <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
//     {[
//       "Great Location",
//       "Friendly Staff",
//       "Well Maintained",
//       "Affordable Pricing",
//       "Excellent Amenities",
//     ].map((highlight, idx) => (
//       <div
//         key={idx}
//         className="flex-shrink-0 bg-[#07648c] backdrop-blur-md text-white text-xs px-3 py-1 rounded-full shadow-md"
//       >
//         {highlight}
//       </div>
//     ))}
//   </div>
// </div>





// {/* Mobile Floating Action Buttons with Glass BG */}
// <div className="fixed bottom-0 left-0 w-full px-0 z-50 md:hidden">
//   <div className="bg-black/40 backdrop-blur-md p-3 flex gap-3 shadow-lg">
//     {/* Enquire Button */}
//     <button
//       className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-md 
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Enquire Now
//     </button>

//     {/* Wishlist Button */}
//     <button
//       className="flex-1 bg-white text-black py-3 rounded-xl font-semibold shadow-md 
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Add to Wishlist
//     </button>
//   </div>
// </div>



// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-28 right-6 z-50 md:hidden">
//       <button
//         onClick={() => setIsProfileModalOpen(true)}
//         className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg flex items-center justify-center bg-black/40 backdrop-blur-md"
//       >
//         {showText ? (
//           <span className="text-white font-semibold text-sm">Help</span>
//         ) : (
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         )}
//       </button>
//     </div>



// {/* Mobile Profile Modal */}
// {isProfileModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
//     <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
//         Upgrade your Space office with {user?.fullName || "Our Team"}
//         <br />
//       <span> to get the best price and best deals for your space.</span>
//       </h2>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center mt-3">
//         <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[10px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[10px] text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactQuoteClick}
//           className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo1"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo2"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
//           alt="Logo3"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
//           alt="Logo4"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
//           alt="Logo5"
//           className="w-[24px] h-[24px]"
//         />
//       </div>
//       {/* Key Points Section */}
//       <div className="mt-3 text-[10px] text-gray-700">
//         <p className="mb-2 font-bold text-[10px]">
//           Explore workspace solutions with our expert guidance:
//         </p>
//         <ul className="space-y-1">
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace selection & location strategy</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace tours</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Layout design & customization assistance</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Terms negotiations & deal signing</span>
//           </li>
//         </ul>
//       </div>

//       {/* Info Box */}
//       <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}

// </div>

//   )
// }

// export default ManagedOfficeDetail








//=======+>> Navigate from wishlist not working detail page fixing issue



// import React, { useState, useEffect, useRef } from "react";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";

// import GroupsScroller from "../../components/GroupsScroller";
// // import OfficeHero from "../../components/OfficeHero";
// import { useLocation } from "react-router-dom"; 

// import {
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Bookmark,
//   Car,               // 🚗 Parking
//   DoorOpen,          // 🚪 Reception Area
//   Toilet,            // 🚻 Washrooms
//   FireExtinguisher,  // 🔥 Fire Extinguisher
//   Shield,            // 🛡️ Security
//   Zap,               // ⚡ Power Backup
//   Wind,  
//   HeartPulse,
//   Armchair,            // 🪑 Chairs & Desks
//   BarChart3,      // 📊 Meeting Rooms
//   Utensils,         // ❄️ Air Conditioning
//   Monitor,           // 💻 Private Cabin
//   Users,              
//   Check,
//   Section,

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "office"; 
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
//         const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//       const [activeTab, setActiveTab] = useState("transit"); // default Transit
//       // const [expanded, setExpanded] = useState(null); // which label is expanded
//       const [expanded, setExpanded] = useState({
//         hospitals: false,
//         restaurants: false,
//         atms: false,
//       });
    
//       const [user, setUser] = useState(null);
//       const [userId, setUserId] = useState(null);
//       const [officeId, setOfficeId] = useState(null);
  
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [leadMessage, setLeadMessage] = useState("");
//     const visitorId = Cookies.get("visitorId");
//     const isRestricted = !visitorId;
//     const [showFloors, setShowFloors] = useState(false);
//     const [showText, setShowText] = useState(false);
// //profile
// useEffect(() => {
//   const interval = setInterval(() => {
//     setShowText((prev) => !prev); // toggle every 2 seconds
//   }, 5000);

//   return () => clearInterval(interval); // cleanup on unmount
// }, []);

//     useEffect(() => {
//       fetchOffice();
//     }, [id, category]);
    
   
// const relatedCity = location.state?.city || "";
// const relatedProperties = location.state?.relatedProperties?.filter(
//   (item) => item.location?.city === relatedCity
// ) || [];

// console.log("Testing getting related properties",relatedProperties)

      
//       const fetchOffice = async () => {
//         try {
//           let res = null;
//           if (category === "managed") {
//             res = await getManagedOfficeById(id);
//           } else if (category === "office") {
//             res = await getOfficeSpaceById(id);
//           } else if (category === "co-working") {
//             res = await getCoWorkingSpaceById(id);
//           }
      
//           setOffice(res);
//           setUserId(res?.assigned_agent);
//           setOfficeId(res?._id);
//         } catch (error) {
//           console.error("Error fetching office detail:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
      
      
//       useEffect(() => {
//         const fetchUser = async () => {
//           try {
//             if (userId) {
//               const userData = await getUserDataById(userId);
//               setUser(userData);
//             }
//           } catch (err) {
//             console.error("Failed to fetch user:", err);
//           }
//         };
    
//         fetchUser();
//       }, [userId]);
    
//     console.log("OFFICEEEEEEEEE data",user)
//     console.log("OFFICEEEEEEEEE data",office?.location?.link)
//       if (loading) return <p className="p-6">Loading...</p>;
//       if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
//       //icons
//       const amenitiesIcons = {
//         parking: { icon: Car, label: "Parking" },
//         receptionArea: { icon: DoorOpen, label: "Reception Area" },
//         washrooms: { icon: Toilet, label: "Washrooms" },
//         fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
//         security: { icon: Shield, label: "Security" },
//         powerBackup: { icon: Zap, label: "Power Backup" },
//         airConditioners: { icon: Wind, label: "Air Conditioning" },
//         privateCabin: { icon: Monitor, label: "Private Cabin" },
//         recreationArea: { icon: Users, label: "Recreation Area" },
//         firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
//         pantryArea: { icon: Utensils, label: "Pantry Area" },
//         chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
//         meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
//       };
    
    
//       function extractLatLng(link) {
//         // Try to match coordinates after '@'
//         let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
//         if (!match) {
//           // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
//           match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
//         }
      
//         if (match) {
//           return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
//         }
//         return null;
//       }
      
//       const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
//       const coords = extractLatLng(url);
      
//       if (coords) {
//         const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
//         console.log("Embed URL:", embedUrl);
//       }
      
//       const toggleExpand = (key) => {
//         setExpanded(expanded === key ? null : key);
//       };
      
    
    
//     //visitor handlers
//     const handleContactQuoteClick = () => {
//       const visitorId = Cookies.get("visitorId");
//       if (visitorId) {
//         // If cookie exists → open Lead Modal instead of alert
//         setIsLeadModalOpen(true);
//       } else {
//         // Else → open Login modal
//         setIsModalOpen(true);
//       }
//     };
    
    
//     const handleContactQuote = async () => {
//       const visitorId = Cookies.get("visitorId");
    
//       if (visitorId) {
//         console.log("Visitor already exists with ID:", visitorId);
//         alert("Visitor already exists, we will reach you.");
//         return; // stop here
//       }
    
//       // else open form modal
//       setIsModalOpen(true);
//     };
    
//     const handleFormSubmit = async (e) => {
//       e.preventDefault();
    
//       try {
//         const res = await postVisitorData(formData);
//         console.log("Visitor created:", res);
    
//         // store visitorId in cookies
//         Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
//         alert("Thanks for login. Quote request submitted successfully!");
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error submitting quote:", error);
//         alert("Something went wrong, please try again.");
//       }
//     };
    
    
//     const handleLeadSubmit = async (e) => {
//       e.preventDefault();
//       const visitorId = Cookies.get("visitorId");
    
//       if (!visitorId) {
//         alert("Visitor not found, please login first.");
//         return;
//       }
    
//       try {
//         const leadData = {
//           propertyId: officeId,
//           visitorId: visitorId,
//           assignedAgentId: userId,
//           message: leadMessage,
//         };
//         console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
    
//         const res = await postLeadData(leadData);
//         console.log("Lead created:", res);
    
//         alert("Your enquiry has been submitted successfully!");
//         setIsLeadModalOpen(false);
//         setLeadMessage("");
//       } catch (error) {
//         console.error("Error submitting lead:", error);
//         alert("Something went wrong while submitting lead.");
//       }
//     };
    
// // Function to handle clicking on a related property card
// const handleRelatedPropertyClick = async (property) => {
//   setOffice(property); // update office data
//   setOfficeId(property._id);
//   setUserId(property.assigned_agent || null);

//   // fetch assigned agent data if exists
//   if (property.assigned_agent) {
//     try {
//       const userData = await getUserDataById(property.assigned_agent);
//       setUser(userData);
//     } catch (err) {
//       console.error("Failed to fetch user for selected property:", err);
//       setUser(null);
//     }
//   } else {
//     setUser(null);
//   }

//   // Scroll to top or relevant section if needed
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//      // Floors list (assuming it's coming as array, else split string)
//      {/* DetailBadge Component */}

// const DetailBadge = ({ label, value }) => (
//   <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
//     <span className="text-[11px] text-gray-300">{label}</span>
//     <span className="text-sm font-semibold text-white truncate">{value}</span>
//   </div>
// );


//   return (

// <div className="flex flex-col bg-gray-100">
//   {/* Hero Component */}
//   <OfficeHeroMobile office={{ office }} />

//   {/* Building Info Section: immediately below hero with 10px margin */}
//   <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
//     {/* Building Name */}
//     <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//       {office?.buildingName} ({category})
//     </h1>

//     {/* Location with icon */}
//     <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//         />
//       </svg>
//       <span>{office?.location?.locationOfProperty}</span>
//     </div>

//     {/* Category Based Info */}
//     {category === "Office" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <span>{office?.generalInfo?.furnishingLevel}</span>
//         </div>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//           </svg>
//           <span>{office?.location?.areaSqft} sqft</span>
//         </div>
//       </div>
//     )}

//     {category === "Warehouse" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Type: {office?.warehouseInfo?.type}</div>
//         <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
//       </div>
//     )}

//     {category === "Retail" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Frontage: {office?.retailInfo?.frontage} ft</div>
//         <div>Floor: {office?.retailInfo?.floor}</div>
//       </div>
//     )}
//   </section>
//   <div className="mt-4 px-4">
//   {/* Title */}
//   <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
//     CENTER DETAILS
//   </h2>

//   {/* General Details card */}
//   <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
//     {/* Common Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
//       {/* Managed Office */}
//       {office?.type === "managed" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//         </>
//       )}

//       {/* Office */}
//       {office?.type === "office" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           {/* Expandable Floors */}
//         {/* Expandable Floors */}
// {/* Expandable Floors */}
// <div className="col-span-2">
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
//   >
//     <span>Floors</span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-300 text-[11px]">
//         {office?.generalInfo?.floors || "N/A"}
//       </span>
//       {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//     </div>
//   </button>

//   {showFloors && (
//     <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
//       <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
//         {(Array.isArray(office?.generalInfo?.floorsName)
//           ? office.generalInfo.floorsName
//           : (office?.generalInfo?.floorsName || "").split(",")
//         ).map((floor, i) => (
//           <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
//             {floor.trim()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>


//         </>
//       )}

//       {/* Co-working */}
//       {office?.type === "co-working" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
//           <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
//           <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
//           <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
//           <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
//         </>
//       )}
//     </div>
//   </div>
// </div>

// {/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
// <div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
//   {/* Title */}
//   <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
//     Amenities
//   </h2>

//   {/* Compact Card Grid */}
//   <div className="flex flex-wrap gap-2">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div
//             key={key}
//             className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
//           >
//             <Icon className="w-4 h-4 text-orange-500" />
//             <span className="text-[12px] font-medium">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom Note */}
//   <p className="mt-3 text-[10px] text-gray-400 leading-snug">
//     ⚠️ Amenities may vary depending on availability.
//   </p>
// </div>
// {/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
// <div className="mt-10 w-full   max-w-[890px]">
//   {/* Title */}
//   <div className="pl-2.5">
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
//   Location Details
// </h2>

//   </div>



//   {/* Address */}
//   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-5 h-5 text-orange-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <p className="text-[15px] font-medium text-gray-700">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Main Container */}
//   <div className="mt-6 flex flex-col lg:flex-row gap-6">
//     {/* Left: Google Maps */}
//     <div className="flex-1 shadow-md rounded-lg overflow-hidden">
//       {office?.location?.link ? (
//         <iframe
//           width="100%"
//           height="350"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={
//             coords
//               ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//               : ""
//           }
//         />
//       ) : (
//         <p className="text-gray-600 p-4 text-sm">No map link available</p>
//       )}
//     </div>

//     {/* Right: Transit / Public Facilities */}
//     <div className="flex-1 bg-white shadow-md rounded-lg p-4">
//       {/* Toggle Header */}
//       <div className="flex gap-6 border-b pb-2 mb-3">
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "transit"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "publicFacilities"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-3">
//           {/* Metro */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaSubway size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaBus size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaTrain size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaPlane size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "publicFacilities" && (
//         <div className="space-y-3">
//           {/* Hospitals */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("hospitals")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaHospital size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Hospitals</span>
//               </div>
//               {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "hospitals" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.hospitals?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Restaurants */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("restaurants")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaUtensils size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Restaurants</span>
//               </div>
//               {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "restaurants" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.restaurants?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ATMs */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("atms")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaMoneyCheckAlt size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">ATMs</span>
//               </div>
//               {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "atms" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.atms?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>




// {/* ==================== Related Properties Section ==================== */}
// <div className="mt-6 px-2">
//   {relatedProperties.length > 0 && (
//     <>
//       <h2 className="text-lg font-semibold text-black mb-4">
//         Other Spaces in {relatedCity}
//       </h2>

//       <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
//         {relatedProperties.map((prop) => (
//           <div
//             key={prop._id}
//             className="relative min-w-[250px] h-64 rounded-xl shadow-lg cursor-pointer overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
//             onClick={() => handleRelatedPropertyClick(prop)}
//           >
//             {/* Background Image */}
//             <img
//               src={prop.images?.[0] || "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"}
//               alt={prop.buildingName}
//               className="w-full h-full object-cover"
//             />

//             {/* Overlay - only bottom portion */}
//             <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-1">
//               <h3 className="text-white text-sm font-bold truncate">
//                 {prop.buildingName}
//               </h3>
//               <p className="text-gray-300 text-[11px] truncate">
//                 {prop.location?.locationOfProperty}, {prop.location?.zone}
//               </p>
//               <p className="text-gray-300 text-[11px]">
//                 {prop.generalInfo?.seaterOffered} Seats | ₹{prop.generalInfo?.rentPerSeat}/seat
//               </p>
//               <div className="flex flex-wrap gap-1 mt-1">
//                 {prop.generalInfo?.furnishingLevel && (
//                   <span className="bg-black/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.generalInfo.furnishingLevel}
//                   </span>
//                 )}
//                 {prop.availability_status && (
//                   <span className="bg-green-200/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">
//                     {prop.availability_status}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   )}
// </div>



// {/* ==================== Reviews / Ratings Section ==================== */}
// <div className="mt-6 px-4 pb-24 md:pb-10">
//   <h2 className="text-lg font-semibold text-black mb-3">Reviews & Ratings</h2>

 
//   <div className="flex items-center gap-2 mb-4">
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <svg
//           key={star}
//           xmlns="http://www.w3.org/2000/svg"
//           className={`w-5 h-5 ${
//             star <= 4 ? "text-orange-500" : "text-gray-300"
//           }`} 
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.285-3.945a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.149a1 1 0 00.951-.69l1.285-3.946z" />
//         </svg>
//       ))}
//     </div>
//     <span className="text-sm text-gray-700">(120 Reviews)</span>
//   </div>


//   <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
//     {[
//       "Great Location",
//       "Friendly Staff",
//       "Well Maintained",
//       "Affordable Pricing",
//       "Excellent Amenities",
//     ].map((highlight, idx) => (
//       <div
//         key={idx}
//         className="flex-shrink-0 bg-[#07648c] backdrop-blur-md text-white text-xs px-3 py-1 rounded-full shadow-md"
//       >
//         {highlight}
//       </div>
//     ))}
//   </div>
// </div>





// {/* Mobile Floating Action Buttons with Glass BG */}
// <div className="fixed bottom-0 left-0 w-full px-0 z-50 md:hidden">
//   <div className="bg-black/40 backdrop-blur-md p-3 flex gap-3 shadow-lg">
//     {/* Enquire Button */}
//     <button
//       className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-md 
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Enquire Now
//     </button>

//     {/* Wishlist Button */}
//     <button
//       className="flex-1 bg-white text-black py-3 rounded-xl font-semibold shadow-md 
//       transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
//     >
//       Add to Wishlist
//     </button>
//   </div>
// </div>



// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-28 right-6 z-50 md:hidden">
//       <button
//         onClick={() => setIsProfileModalOpen(true)}
//         className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg flex items-center justify-center bg-black/40 backdrop-blur-md"
//       >
//         {showText ? (
//           <span className="text-white font-semibold text-sm">Help</span>
//         ) : (
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         )}
//       </button>
//     </div>



// {/* Mobile Profile Modal */}
// {isProfileModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
//     <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
//         Upgrade your Space office with {user?.fullName || "Our Team"}
//         <br />
//       <span> to get the best price and best deals for your space.</span>
//       </h2>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center mt-3">
//         <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[10px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[10px] text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactQuoteClick}
//           className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo1"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo2"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
//           alt="Logo3"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
//           alt="Logo4"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
//           alt="Logo5"
//           className="w-[24px] h-[24px]"
//         />
//       </div>
//       {/* Key Points Section */}
//       <div className="mt-3 text-[10px] text-gray-700">
//         <p className="mb-2 font-bold text-[10px]">
//           Explore workspace solutions with our expert guidance:
//         </p>
//         <ul className="space-y-1">
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace selection & location strategy</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace tours</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Layout design & customization assistance</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Terms negotiations & deal signing</span>
//           </li>
//         </ul>
//       </div>

//       {/* Info Box */}
//       <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}

// </div>

//   )
// }

// export default ManagedOfficeDetail








//========================>>> All are working good 100%


// import React, { useState, useEffect, useRef } from "react";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";

// import GroupsScroller from "../../components/GroupsScroller";
// // import OfficeHero from "../../components/OfficeHero";
// import { useLocation } from "react-router-dom"; 

// import {
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Bookmark,
//   Car,               // 🚗 Parking
//   DoorOpen,          // 🚪 Reception Area
//   Toilet,            // 🚻 Washrooms
//   FireExtinguisher,  // 🔥 Fire Extinguisher
//   Shield,            // 🛡️ Security
//   Zap,               // ⚡ Power Backup
//   Wind,  
//   HeartPulse,
//   Armchair,            // 🪑 Chairs & Desks
//   BarChart3,      // 📊 Meeting Rooms
//   Utensils,         // ❄️ Air Conditioning
//   Monitor,           // 💻 Private Cabin
//   Users,              
//   Check,
//   Section,

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "office"; 
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
//         const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//       const [activeTab, setActiveTab] = useState("transit"); // default Transit
//       // const [expanded, setExpanded] = useState(null); // which label is expanded
//       const [expanded, setExpanded] = useState({
//         hospitals: false,
//         restaurants: false,
//         atms: false,
//       });
    
//       const [user, setUser] = useState(null);
//       const [userId, setUserId] = useState(null);
//       const [officeId, setOfficeId] = useState(null);
    
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [leadMessage, setLeadMessage] = useState("");
//     const visitorId = Cookies.get("visitorId");
//     const isRestricted = !visitorId;
//     const [showFloors, setShowFloors] = useState(false);
    
//     useEffect(() => {
//       fetchOffice();
//     }, [id, category]);
    
   
// const relatedCity = location.state?.city || "";
// const relatedProperties = location.state?.relatedProperties?.filter(
//   (item) => item.location?.city === relatedCity
// ) || [];

// console.log("Testing getting related properties",relatedProperties)

      
//       const fetchOffice = async () => {
//         try {
//           let res = null;
//           if (category === "managed") {
//             res = await getManagedOfficeById(id);
//           } else if (category === "office") {
//             res = await getOfficeSpaceById(id);
//           } else if (category === "co-working") {
//             res = await getCoWorkingSpaceById(id);
//           }
      
//           setOffice(res);
//           setUserId(res?.assigned_agent);
//           setOfficeId(res?._id);
//         } catch (error) {
//           console.error("Error fetching office detail:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
      
      
//       useEffect(() => {
//         const fetchUser = async () => {
//           try {
//             if (userId) {
//               const userData = await getUserDataById(userId);
//               setUser(userData);
//             }
//           } catch (err) {
//             console.error("Failed to fetch user:", err);
//           }
//         };
    
//         fetchUser();
//       }, [userId]);
    
//     console.log("OFFICEEEEEEEEE data",user)
//     console.log("OFFICEEEEEEEEE data",office?.location?.link)
//       if (loading) return <p className="p-6">Loading...</p>;
//       if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
//       //icons
//       const amenitiesIcons = {
//         parking: { icon: Car, label: "Parking" },
//         receptionArea: { icon: DoorOpen, label: "Reception Area" },
//         washrooms: { icon: Toilet, label: "Washrooms" },
//         fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
//         security: { icon: Shield, label: "Security" },
//         powerBackup: { icon: Zap, label: "Power Backup" },
//         airConditioners: { icon: Wind, label: "Air Conditioning" },
//         privateCabin: { icon: Monitor, label: "Private Cabin" },
//         recreationArea: { icon: Users, label: "Recreation Area" },
//         firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
//         pantryArea: { icon: Utensils, label: "Pantry Area" },
//         chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
//         meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
//       };
    
    
//       function extractLatLng(link) {
//         // Try to match coordinates after '@'
//         let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
//         if (!match) {
//           // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
//           match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
//         }
      
//         if (match) {
//           return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
//         }
//         return null;
//       }
      
//       const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
//       const coords = extractLatLng(url);
      
//       if (coords) {
//         const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
//         console.log("Embed URL:", embedUrl);
//       }
      
//       const toggleExpand = (key) => {
//         setExpanded(expanded === key ? null : key);
//       };
      
    
    
//     //visitor handlers
//     const handleContactQuoteClick = () => {
//       const visitorId = Cookies.get("visitorId");
//       if (visitorId) {
//         // If cookie exists → open Lead Modal instead of alert
//         setIsLeadModalOpen(true);
//       } else {
//         // Else → open Login modal
//         setIsModalOpen(true);
//       }
//     };
    
    
//     const handleContactQuote = async () => {
//       const visitorId = Cookies.get("visitorId");
    
//       if (visitorId) {
//         console.log("Visitor already exists with ID:", visitorId);
//         alert("Visitor already exists, we will reach you.");
//         return; // stop here
//       }
    
//       // else open form modal
//       setIsModalOpen(true);
//     };
    
//     const handleFormSubmit = async (e) => {
//       e.preventDefault();
    
//       try {
//         const res = await postVisitorData(formData);
//         console.log("Visitor created:", res);
    
//         // store visitorId in cookies
//         Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
//         alert("Thanks for login. Quote request submitted successfully!");
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error submitting quote:", error);
//         alert("Something went wrong, please try again.");
//       }
//     };
    
    
//     const handleLeadSubmit = async (e) => {
//       e.preventDefault();
//       const visitorId = Cookies.get("visitorId");
    
//       if (!visitorId) {
//         alert("Visitor not found, please login first.");
//         return;
//       }
    
//       try {
//         const leadData = {
//           propertyId: officeId,
//           visitorId: visitorId,
//           assignedAgentId: userId,
//           message: leadMessage,
//         };
//         console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
    
//         const res = await postLeadData(leadData);
//         console.log("Lead created:", res);
    
//         alert("Your enquiry has been submitted successfully!");
//         setIsLeadModalOpen(false);
//         setLeadMessage("");
//       } catch (error) {
//         console.error("Error submitting lead:", error);
//         alert("Something went wrong while submitting lead.");
//       }
//     };
    
// // Function to handle clicking on a related property card
// const handleRelatedPropertyClick = async (property) => {
//   setOffice(property); // update office data
//   setOfficeId(property._id);
//   setUserId(property.assigned_agent || null);

//   // fetch assigned agent data if exists
//   if (property.assigned_agent) {
//     try {
//       const userData = await getUserDataById(property.assigned_agent);
//       setUser(userData);
//     } catch (err) {
//       console.error("Failed to fetch user for selected property:", err);
//       setUser(null);
//     }
//   } else {
//     setUser(null);
//   }

//   // Scroll to top or relevant section if needed
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//      // Floors list (assuming it's coming as array, else split string)
//      {/* DetailBadge Component */}

// const DetailBadge = ({ label, value }) => (
//   <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
//     <span className="text-[11px] text-gray-300">{label}</span>
//     <span className="text-sm font-semibold text-white truncate">{value}</span>
//   </div>
// );

//   return (

// <div className="flex flex-col bg-gray-100">
//   {/* Hero Component */}
//   <OfficeHeroMobile office={{ office }} />

//   {/* Building Info Section: immediately below hero with 10px margin */}
//   <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
//     {/* Building Name */}
//     <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//       {office?.buildingName} ({category})
//     </h1>

//     {/* Location with icon */}
//     <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//         />
//       </svg>
//       <span>{office?.location?.locationOfProperty}</span>
//     </div>

//     {/* Category Based Info */}
//     {category === "Office" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <span>{office?.generalInfo?.furnishingLevel}</span>
//         </div>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//           </svg>
//           <span>{office?.location?.areaSqft} sqft</span>
//         </div>
//       </div>
//     )}

//     {category === "Warehouse" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Type: {office?.warehouseInfo?.type}</div>
//         <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
//       </div>
//     )}

//     {category === "Retail" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Frontage: {office?.retailInfo?.frontage} ft</div>
//         <div>Floor: {office?.retailInfo?.floor}</div>
//       </div>
//     )}
//   </section>
//   <div className="mt-4 px-4">
//   {/* Title */}
//   <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
//     CENTER DETAILS
//   </h2>

//   {/* General Details card */}
//   <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
//     {/* Common Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
//       {/* Managed Office */}
//       {office?.type === "managed" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//         </>
//       )}

//       {/* Office */}
//       {office?.type === "office" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           {/* Expandable Floors */}
//         {/* Expandable Floors */}
// {/* Expandable Floors */}
// <div className="col-span-2">
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
//   >
//     <span>Floors</span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-300 text-[11px]">
//         {office?.generalInfo?.floors || "N/A"}
//       </span>
//       {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//     </div>
//   </button>

//   {showFloors && (
//     <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
//       <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
//         {(Array.isArray(office?.generalInfo?.floorsName)
//           ? office.generalInfo.floorsName
//           : (office?.generalInfo?.floorsName || "").split(",")
//         ).map((floor, i) => (
//           <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
//             {floor.trim()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>


//         </>
//       )}

//       {/* Co-working */}
//       {office?.type === "co-working" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
//           <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
//           <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
//           <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
//           <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
//         </>
//       )}
//     </div>
//   </div>
// </div>

// {/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
// <div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
//   {/* Title */}
//   <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
//     Amenities
//   </h2>

//   {/* Compact Card Grid */}
//   <div className="flex flex-wrap gap-2">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div
//             key={key}
//             className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
//           >
//             <Icon className="w-4 h-4 text-orange-500" />
//             <span className="text-[12px] font-medium">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom Note */}
//   <p className="mt-3 text-[10px] text-gray-400 leading-snug">
//     ⚠️ Amenities may vary depending on availability.
//   </p>
// </div>
// {/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
// <div className="mt-10 w-full   max-w-[890px]">
//   {/* Title */}
//   <div className="pl-2.5">
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
//   Location Details
// </h2>

//   </div>



//   {/* Address */}
//   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-5 h-5 text-orange-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <p className="text-[15px] font-medium text-gray-700">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Main Container */}
//   <div className="mt-6 flex flex-col lg:flex-row gap-6">
//     {/* Left: Google Maps */}
//     <div className="flex-1 shadow-md rounded-lg overflow-hidden">
//       {office?.location?.link ? (
//         <iframe
//           width="100%"
//           height="350"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={
//             coords
//               ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//               : ""
//           }
//         />
//       ) : (
//         <p className="text-gray-600 p-4 text-sm">No map link available</p>
//       )}
//     </div>

//     {/* Right: Transit / Public Facilities */}
//     <div className="flex-1 bg-white shadow-md rounded-lg p-4">
//       {/* Toggle Header */}
//       <div className="flex gap-6 border-b pb-2 mb-3">
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "transit"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "publicFacilities"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-3">
//           {/* Metro */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaSubway size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaBus size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaTrain size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaPlane size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "publicFacilities" && (
//         <div className="space-y-3">
//           {/* Hospitals */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("hospitals")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaHospital size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Hospitals</span>
//               </div>
//               {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "hospitals" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.hospitals?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Restaurants */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("restaurants")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaUtensils size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Restaurants</span>
//               </div>
//               {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "restaurants" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.restaurants?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ATMs */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("atms")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaMoneyCheckAlt size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">ATMs</span>
//               </div>
//               {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "atms" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.atms?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>
// {/* ==================== Related Properties Section ==================== */}
// <div className="mt-6 px-4">
//   {relatedProperties.length > 0 && (
//     <>
//       <h2 className="text-lg font-semibold text-black mb-4">
//         Other Spaces in {relatedCity}
//       </h2>
//       <div className="relative">


// <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
//   {relatedProperties.map((prop) => (
//     <div
//       key={prop._id}
//       className="min-w-[250px] bg-black/40 backdrop-blur-md border border-amber-200/80 rounded-xl shadow-lg flex-shrink-0 hover:bg-black/50 transition duration-300 cursor-pointer"
//       onClick={() => handleRelatedPropertyClick(prop)} // 👈 here
//     >
//       {/* Image */}
//       <div className="w-full h-40 rounded-t-xl overflow-hidden">
//         <img
//           src={prop.images?.[0] || ""}
//           alt={prop.buildingName}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Content */}
//       <div className="p-3 flex flex-col gap-1">
//         <h3 className="text-sm font-semibold text-white truncate">
//           {prop.buildingName}
//         </h3>
//         <span className="text-[11px] text-gray-300">
//           {prop.location?.locationOfProperty}, {prop.location?.zone}
//         </span>
//         <span className="text-[11px] text-gray-300">
//           {prop.generalInfo?.seaterOffered} Seats | ₹
//           {prop.generalInfo?.rentPerSeat}/seat
//         </span>
//         <div className="flex flex-wrap gap-1 mt-1">
//           {prop.generalInfo?.furnishingLevel && (
//             <span className="bg-black-200/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
//               {prop.generalInfo.furnishingLevel}
//             </span>
//           )}
//           {prop.availability_status && (
//             <span className="bg-green-200/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">
//               {prop.availability_status}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
// </div>
//     </>
//   )}
// </div>

// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-6 right-6 z-50 md:hidden">
//   <button
//     onClick={() => setIsProfileModalOpen(true)}
//     className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg"
//   >
//     <img
//       src={user?.profileImage || "https://via.placeholder.com/94"}
//       alt={user?.fullName || "Handler"}
//       className="object-cover w-full h-full"
//     />
//   </button>
// </div>

// {/* Mobile Profile Modal */}
// {isProfileModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
//     <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
//         Upgrade your Space office with {user?.fullName || "Our Team"}
//         <br />
//       <span> to get the best price and best deals for your space.</span>
//       </h2>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center mt-3">
//         <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[10px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[10px] text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactQuoteClick}
//           className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo1"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo2"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
//           alt="Logo3"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
//           alt="Logo4"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
//           alt="Logo5"
//           className="w-[24px] h-[24px]"
//         />
//       </div>
//       {/* Key Points Section */}
//       <div className="mt-3 text-[10px] text-gray-700">
//         <p className="mb-2 font-bold text-[10px]">
//           Explore workspace solutions with our expert guidance:
//         </p>
//         <ul className="space-y-1">
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace selection & location strategy</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace tours</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Layout design & customization assistance</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Terms negotiations & deal signing</span>
//           </li>
//         </ul>
//       </div>

//       {/* Info Box */}
//       <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}

// </div>



//   )
// }

// export default ManagedOfficeDetail








//================>>>> all are good updating the extra features







// import React, { useState, useEffect, useRef } from "react";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";

// import GroupsScroller from "../../components/GroupsScroller";
// // import OfficeHero from "../../components/OfficeHero";


// import {
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Bookmark,
//   Car,               // 🚗 Parking
//   DoorOpen,          // 🚪 Reception Area
//   Toilet,            // 🚻 Washrooms
//   FireExtinguisher,  // 🔥 Fire Extinguisher
//   Shield,            // 🛡️ Security
//   Zap,               // ⚡ Power Backup
//   Wind,  
//   HeartPulse,
//   Armchair,            // 🪑 Chairs & Desks
//   BarChart3,      // 📊 Meeting Rooms
//   Utensils,         // ❄️ Air Conditioning
//   Monitor,           // 💻 Private Cabin
//   Users,              
//   Check,
//   Section,

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import OfficeHeroMobile from "./mobileComponents/OfficeHeroMobile";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "office"; 
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
//         const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//       const [activeTab, setActiveTab] = useState("transit"); // default Transit
//       // const [expanded, setExpanded] = useState(null); // which label is expanded
//       const [expanded, setExpanded] = useState({
//         hospitals: false,
//         restaurants: false,
//         atms: false,
//       });
    
//       const [user, setUser] = useState(null);
//       const [userId, setUserId] = useState(null);
//       const [officeId, setOfficeId] = useState(null);
    
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [leadMessage, setLeadMessage] = useState("");
//     const visitorId = Cookies.get("visitorId");
//     const isRestricted = !visitorId;
//     const [showFloors, setShowFloors] = useState(false);
    
//     useEffect(() => {
//       fetchOffice();
//     }, [id, category]);
    
    
//       // const fetchOffice = async () => {
//       //   try {
//       //     let res = null;
      
//       //     if (category === "office") {
//       //       res = await getManagedOfficeById(id);
//       //     } else if (category === "managed") {
//       //       res = await getOfficeSpaceById(id);
//       //     } else if (category === "co-working") {
//       //       res = await getCoWorkingSpaceById(id);
//       //     }
      
//       //     setOffice(res);
//       //     setUserId(res?.assigned_agent);
//       //     setOfficeId(res?._id);
//       //   } catch (error) {
//       //     console.error("Error fetching office detail:", error);
//       //   } finally {
//       //     setLoading(false);
//       //   }
//       // };
      
//       const fetchOffice = async () => {
//         try {
//           let res = null;
//           if (category === "managed") {
//             res = await getManagedOfficeById(id);
//           } else if (category === "office") {
//             res = await getOfficeSpaceById(id);
//           } else if (category === "co-working") {
//             res = await getCoWorkingSpaceById(id);
//           }
      
//           setOffice(res);
//           setUserId(res?.assigned_agent);
//           setOfficeId(res?._id);
//         } catch (error) {
//           console.error("Error fetching office detail:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
      
      
//       useEffect(() => {
//         const fetchUser = async () => {
//           try {
//             if (userId) {
//               const userData = await getUserDataById(userId);
//               setUser(userData);
//             }
//           } catch (err) {
//             console.error("Failed to fetch user:", err);
//           }
//         };
    
//         fetchUser();
//       }, [userId]);
    
//     console.log("OFFICEEEEEEEEE data",user)
//     console.log("OFFICEEEEEEEEE data",office?.location?.link)
//       if (loading) return <p className="p-6">Loading...</p>;
//       if (!office) return <p className="p-6 text-red-600">Office not found</p>;
    
    
    
//       //icons
//       const amenitiesIcons = {
//         parking: { icon: Car, label: "Parking" },
//         receptionArea: { icon: DoorOpen, label: "Reception Area" },
//         washrooms: { icon: Toilet, label: "Washrooms" },
//         fireExtinguisher: { icon: FireExtinguisher, label: "Fire Extinguisher" },
//         security: { icon: Shield, label: "Security" },
//         powerBackup: { icon: Zap, label: "Power Backup" },
//         airConditioners: { icon: Wind, label: "Air Conditioning" },
//         privateCabin: { icon: Monitor, label: "Private Cabin" },
//         recreationArea: { icon: Users, label: "Recreation Area" },
//         firstAidKit: { icon: HeartPulse, label: "First Aid Kit" },
//         pantryArea: { icon: Utensils, label: "Pantry Area" },
//         chairsDesks: { icon: Armchair, label: "Chairs & Desks" },
//         meetingRooms: { icon: BarChart3, label: "Meeting Rooms" },
//       };
    
    
//       function extractLatLng(link) {
//         // Try to match coordinates after '@'
//         let match = link.match(/@([-0-9.]+),([-0-9.]+)/);
        
//         if (!match) {
//           // Fallback: try matching !3dLAT!4dLNG (some URLs use this format)
//           match = link.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
//         }
      
//         if (match) {
//           return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
//         }
//         return null;
//       }
      
//       const url = "https://www.google.com/maps/place/Shree+Banashankari+Devi+Temple/@12.94295,77.5251944,13208m/data=!3m1!1e3!4m10!1m2!2m1!1sbanashankari+temple+location!3m6!1s0x3bae3e25b3e186b1:0x530077327406000f!8m2!3d12.915605!4d77.5732254!15sChxiYW5hc2hhbmthcmkgdGVtcGxlIGxvY2F0aW9uWhUiE2JhbmFzaGFua2FyaSB0ZW1wbGWSAQxoaW5kdV90ZW1wbGWqATwQATIfEAEiG2cAIKyXgR-hIf-gNb51cCI8R9Z7JqLDR1WTtTIXEAIiE2JhbmFzaGFua2FyaSB0ZW1wbGXgAQA!16s%2Fg%2F11dfldc10j?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";
      
//       const coords = extractLatLng(url);
      
//       if (coords) {
//         const embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&center=${coords.lat},${coords.lng}&zoom=15&maptype=roadmap`;
//         console.log("Embed URL:", embedUrl);
//       }
      
//       const toggleExpand = (key) => {
//         setExpanded(expanded === key ? null : key);
//       };
      
    
    
//     //visitor handlers
//     const handleContactQuoteClick = () => {
//       const visitorId = Cookies.get("visitorId");
//       if (visitorId) {
//         // If cookie exists → open Lead Modal instead of alert
//         setIsLeadModalOpen(true);
//       } else {
//         // Else → open Login modal
//         setIsModalOpen(true);
//       }
//     };
    
    
//     const handleContactQuote = async () => {
//       const visitorId = Cookies.get("visitorId");
    
//       if (visitorId) {
//         console.log("Visitor already exists with ID:", visitorId);
//         alert("Visitor already exists, we will reach you.");
//         return; // stop here
//       }
    
//       // else open form modal
//       setIsModalOpen(true);
//     };
    
//     const handleFormSubmit = async (e) => {
//       e.preventDefault();
    
//       try {
//         const res = await postVisitorData(formData);
//         console.log("Visitor created:", res);
    
//         // store visitorId in cookies
//         Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
    
//         alert("Thanks for login. Quote request submitted successfully!");
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error("Error submitting quote:", error);
//         alert("Something went wrong, please try again.");
//       }
//     };
    
    
//     const handleLeadSubmit = async (e) => {
//       e.preventDefault();
//       const visitorId = Cookies.get("visitorId");
    
//       if (!visitorId) {
//         alert("Visitor not found, please login first.");
//         return;
//       }
    
//       try {
//         const leadData = {
//           propertyId: officeId,
//           visitorId: visitorId,
//           assignedAgentId: userId,
//           message: leadMessage,
//         };
//         console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
    
//         const res = await postLeadData(leadData);
//         console.log("Lead created:", res);
    
//         alert("Your enquiry has been submitted successfully!");
//         setIsLeadModalOpen(false);
//         setLeadMessage("");
//       } catch (error) {
//         console.error("Error submitting lead:", error);
//         alert("Something went wrong while submitting lead.");
//       }
//     };
    
//      // Floors list (assuming it's coming as array, else split string)
//      {/* DetailBadge Component */}
// // const DetailBadge = ({ label, value }) => (
// //   <div className="bg-[#1f5777] shadow-lg rounded-lg p-2 flex flex-col items-start hover:bg-[#477c8b] transition">
// //     <span className="text-[10px] text-gray-300">{label}</span>
// //     <span className="text-sm font-semibold text-white truncate">{value}</span>
// //   </div>
// // );

// const DetailBadge = ({ label, value }) => (
//   <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-3 flex flex-col items-start border border-amber-200/80 hover:bg-black/50 transition duration-300">
//     <span className="text-[11px] text-gray-300">{label}</span>
//     <span className="text-sm font-semibold text-white truncate">{value}</span>
//   </div>
// );

//   return (

// <div className="flex flex-col bg-gray-100">
//   {/* Hero Component */}
//   <OfficeHeroMobile office={{ office }} />

//   {/* Building Info Section: immediately below hero with 10px margin */}
//   <section className="mt-[10px] flex flex-col items-start space-y-2 px-4 sm:px-6">
//     {/* Building Name */}
//     <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//       {office?.buildingName} ({category})
//     </h1>

//     {/* Location with icon */}
//     <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-700">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//         />
//       </svg>
//       <span>{office?.location?.locationOfProperty}</span>
//     </div>

//     {/* Category Based Info */}
//     {category === "Office" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <span>{office?.generalInfo?.furnishingLevel}</span>
//         </div>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//           </svg>
//           <span>{office?.location?.areaSqft} sqft</span>
//         </div>
//       </div>
//     )}

//     {category === "Warehouse" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Type: {office?.warehouseInfo?.type}</div>
//         <div>Capacity: {office?.warehouseInfo?.capacity} tons</div>
//       </div>
//     )}

//     {category === "Retail" && (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 text-sm sm:text-base text-gray-700 mt-1">
//         <div>Frontage: {office?.retailInfo?.frontage} ft</div>
//         <div>Floor: {office?.retailInfo?.floor}</div>
//       </div>
//     )}
//   </section>
//   <div className="mt-4 px-4">
//   {/* Title */}
//   <h2 className="text-orange-500 text-lg font-bold border-b-2 border-black inline-block pb-1 mb-3">
//     CENTER DETAILS
//   </h2>

//   {/* General Details card */}
//   <div className="bg-[#0c6585] rounded-xl shadow-lg p-3 space-y-3">
//     {/* Common Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-white text-xs sm:text-sm">
//       {/* Managed Office */}
//       {office?.type === "managed" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Power/Backup" value={office?.generalInfo?.powerAndBackup || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//         </>
//       )}

//       {/* Office */}
//       {office?.type === "office" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Floor Size" value={office?.generalInfo?.floorSize || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           {/* Expandable Floors */}
//         {/* Expandable Floors */}
// {/* Expandable Floors */}
// <div className="col-span-2">
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="bg-black/40 backdrop-blur-md shadow-lg rounded-xl border border-amber-300/80 hover:bg-black/50 transition duration-300 w-full  px-3 py-2 flex items-center justify-between text-white text-xs sm:text-sm font-medium"
//   >
//     <span>Floors</span>
//     <div className="flex items-center gap-2">
//       <span className="text-gray-300 text-[11px]">
//         {office?.generalInfo?.floors || "N/A"}
//       </span>
//       {showFloors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//     </div>
//   </button>

//   {showFloors && (
//     <div className="mt-2 bg-[#ffff] rounded-lg shadow-inner p-2">
//       <ul className="divide-y divide-gray-300 text-gray-700 text-xs">
//         {(Array.isArray(office?.generalInfo?.floorsName)
//           ? office.generalInfo.floorsName
//           : (office?.generalInfo?.floorsName || "").split(",")
//         ).map((floor, i) => (
//           <li key={i} className="py-1 px-2 hover:bg-gray-200 rounded">
//             {floor.trim()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>


//         </>
//       )}

//       {/* Co-working */}
//       {office?.type === "co-working" && (
//         <>
//           <DetailBadge label="Seater" value={office?.generalInfo?.seaterOffered || "N/A"} />
//           <DetailBadge label="Rent/Seat" value={office?.generalInfo?.rentPerSeat ? `Rs.${office.generalInfo.rentPerSeat}/-` : "N/A"} />
//           <DetailBadge label="Desk Type" value={office?.generalInfo?.deskTypes || "N/A"} />
//           <DetailBadge label="Lock In" value={office?.generalInfo?.lockInPeriod || "N/A"} />
//           <DetailBadge label="Furnishing" value={office?.generalInfo?.furnishingLevel || "N/A"} />
//           <DetailBadge label="OC Available" value={office?.generalInfo?.ocAvailability ? "Yes" : "No"} />
//           <DetailBadge label="Day Pass" value={office?.generalInfo?.dayPassPrice || "N/A"} />
//           <DetailBadge label="Reception" value={office?.generalInfo?.receptionHours || "N/A"} />
//           <DetailBadge label="Maintenance" value={office?.generalInfo?.maintenanceCharges ? `Rs.${office.generalInfo.maintenanceCharges}/-` : "N/A"} />
//           <DetailBadge label="Membership" value={office?.generalInfo?.membershipPlans || "N/A"} />
//           <DetailBadge label="Rent Price" value={office?.generalInfo?.rentPrice ? `Rs.${office.generalInfo.rentPrice}/-` : "N/A"} />
//         </>
//       )}
//     </div>
//   </div>
// </div>

// {/* ===== AMENITIES SECTION (Compact Advanced Mobile UI) ===== */}
// <div className="mt-6 w-full max-w-[890px] bg-white p-3 shadow-sm rounded-lg">
//   {/* Title */}
//   <h2 className="text-[16px] font-semibold text-gray-800 mb-3">
//     Amenities
//   </h2>

//   {/* Compact Card Grid */}
//   <div className="flex flex-wrap gap-2">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div
//             key={key}
//             className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-700"
//           >
//             <Icon className="w-4 h-4 text-orange-500" />
//             <span className="text-[12px] font-medium">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom Note */}
//   <p className="mt-3 text-[10px] text-gray-400 leading-snug">
//     ⚠️ Amenities may vary depending on availability.
//   </p>
// </div>
// {/* ===== LOCATION DETAILS SECTION (Updated Design) ===== */}
// <div className="mt-10 w-full   max-w-[890px]">
//   {/* Title */}
//   <div className="pl-2.5">
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1 mt-30 ">
//   Location Details
// </h2>

//   </div>



//   {/* Address */}
//   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-5 h-5 text-orange-500"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 22s8-4.5 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <p className="text-[15px] font-medium text-gray-700">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Main Container */}
//   <div className="mt-6 flex flex-col lg:flex-row gap-6">
//     {/* Left: Google Maps */}
//     <div className="flex-1 shadow-md rounded-lg overflow-hidden">
//       {office?.location?.link ? (
//         <iframe
//           width="100%"
//           height="350"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={
//             coords
//               ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//               : ""
//           }
//         />
//       ) : (
//         <p className="text-gray-600 p-4 text-sm">No map link available</p>
//       )}
//     </div>

//     {/* Right: Transit / Public Facilities */}
//     <div className="flex-1 bg-white shadow-md rounded-lg p-4">
//       {/* Toggle Header */}
//       <div className="flex gap-6 border-b pb-2 mb-3">
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "transit"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`text-sm font-medium ${
//             activeTab === "publicFacilities"
//               ? "text-orange-500 border-b-2 border-orange-500"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-3">
//           {/* Metro */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaSubway size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaBus size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaTrain size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaPlane size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "publicFacilities" && (
//         <div className="space-y-3">
//           {/* Hospitals */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("hospitals")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaHospital size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Hospitals</span>
//               </div>
//               {expanded === "hospitals" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "hospitals" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.hospitals?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Restaurants */}
//           <div className="border-b pb-2">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("restaurants")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaUtensils size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">Restaurants</span>
//               </div>
//               {expanded === "restaurants" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "restaurants" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.restaurants?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* ATMs */}
//           <div>
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleExpand("atms")}
//             >
//               <div className="flex items-center gap-2 text-gray-700">
//                 <FaMoneyCheckAlt size={16} className="text-orange-400" />
//                 <span className="text-sm font-medium">ATMs</span>
//               </div>
//               {expanded === "atms" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded === "atms" && (
//               <ul className="mt-2 pl-6 space-y-1 text-xs text-gray-500">
//                 {office?.publicFacilities?.atms?.map((item, idx) => (
//                   <li key={idx}>• {item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </div>

// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-6 right-6 z-50 md:hidden">
//   <button
//     onClick={() => setIsProfileModalOpen(true)}
//     className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg"
//   >
//     <img
//       src={user?.profileImage || "https://via.placeholder.com/94"}
//       alt={user?.fullName || "Handler"}
//       className="object-cover w-full h-full"
//     />
//   </button>
// </div>

// {/* Mobile Profile Modal */}
// {isProfileModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 md:hidden">
//     <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-sm relative overflow-y-auto max-h-[90vh]">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <h2 className="text-[10px] text-[#374151] font-bold text-center mb-2 leading-snug">
//         Upgrade your Space office with {user?.fullName || "Our Team"}
//         <br />
//       <span> to get the best price and best deals for your space.</span>
//       </h2>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center mt-3">
//         <div className="w-[80px] h-[80px] rounded-full border border-gray-300 overflow-hidden mb-2">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-[12px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[10px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[10px] text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactQuoteClick}
//           className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[10px] flex-wrap">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo1"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s"
//           alt="Logo2"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg"
//           alt="Logo3"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg"
//           alt="Logo4"
//           className="w-[24px] h-[24px]"
//         />
//         <img
//           src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg"
//           alt="Logo5"
//           className="w-[24px] h-[24px]"
//         />
//       </div>
//       {/* Key Points Section */}
//       <div className="mt-3 text-[10px] text-gray-700">
//         <p className="mb-2 font-bold text-[10px]">
//           Explore workspace solutions with our expert guidance:
//         </p>
//         <ul className="space-y-1">
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace selection & location strategy</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Workspace tours</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Layout design & customization assistance</span>
//           </li>
//           <li className="flex items-center gap-2">
//             <Check className="w-3 h-3 text-green-600" />
//             <span>Terms negotiations & deal signing</span>
//           </li>
//         </ul>
//       </div>

//       {/* Info Box */}
//       <div className="mt-3 text-[10px] text-gray-700 bg-gray-100 rounded p-2">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}

// </div>



//   )
// }

// export default ManagedOfficeDetail














//=============>> Base dev

// export default function ManagedOfficeDetail() {
//     return (
//       <div className="h-screen flex items-center justify-center bg-pink-100">
//         <h1 className="text-2xl font-bold text-pink-800">
//           Mobile Menu Page 📱
//         </h1>
//       </div>
//     );
//   }
  