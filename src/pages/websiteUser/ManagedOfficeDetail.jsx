import React, { useState, useEffect, useRef } from "react";
// import { mockOfficeData } from "../data/mockOfficeData"; 
import { getManagedOfficeById } from "../../api/services/managedOfficeService";
import { Link,useLocation } from "react-router-dom";
import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
import Cookies from "js-cookie";
import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
import { useParams } from "react-router-dom";
import { getUserDataById } from "../../api/services/userService";

import GroupsScroller from "../../components/GroupsScroller";
import OfficeHero from "../../components/OfficeHero";
import AuthModal from "./component/AuthModal";
import LeadEnquiryModal from "./component/LeadEnquiryModal";


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

} from "lucide-react";
import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
     const { id } = useParams();
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      const category = searchParams.get("category") || "managed"; 
    
      const [office, setOffice] = useState(null);
      const [loading, setLoading] = useState(true);
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
      // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  //related card
const [relatedProperties, setRelatedProperties] = useState([]);
const [relatedCity, setRelatedCity] = useState("");
 
    useEffect(() => {
      fetchOffice();
    }, [id, category]);
    

    useEffect(() => {
      const state = location.state || {};
      const city = state.city || "";
      const properties = state.relatedProperties || [];
    
      console.log("City from state:", city);
      setRelatedCity(city);
      const filtered = properties.filter(item => item.location?.city === city);
      setRelatedProperties(filtered);
    }, [location.state]);
    
      const fetchOffice = async () => {
        try {
          let res = null;

          if (category === "managed") {
            res = await getManagedOfficeById(id);
          } else if (category === "office") {
            res = await getOfficeSpaceById(id);
          } else if (category === "co-working") {
            res = await getCoWorkingSpaceById(id);
          }
      
          setOffice(res);
          setUserId(res?.assigned_agent?._id);
          setOfficeId(res?._id);
        } catch (error) {
          console.error("Error fetching office detail:", error);
        } finally {
          setLoading(false);
        }
      };
      
    
      console.log("@@@@@@@@@@###########==============",userId)
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



    // // Function to handle clicking on a related property card
const handleRelatedPropertyClick = async (property) => {
  setOffice(property);
  setOfficeId(property._id);
  setUserId(property.assigned_agent || null);

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

  window.scrollTo({ top: 0, behavior: "smooth" });
};
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
    

    const handleContactClick = () => {
      const visitor = Cookies.get("visitorId");
      if (visitor) {
        setIsLeadModalOpen(true);
      } else {
        setIsAuthModalOpen(true);
      }
    };
    
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
    
     // Floors list (assuming it's coming as array, else split string)
  return (

<div className=" h-screen w-full">
<OfficeHero
  office={{ office }}
  onLoginRequired={() => {
    setIsAuthModalOpen(true);
    setIsLeadModalOpen(false); // hide wishlist if open
  }}
  onLogout={() => {
    Cookies.remove("visitorId");
  }}
/>
{/* Breadcrumb Navigation */}
<div className="px-6 mt-4">
  <h1 className="text-[18px] font-bold text-orange-500 flex items-center gap-2">
    <span className="cursor-pointer hover:underline">Home</span>
    <span className="text-gray-500">{'>'}</span>

    {/* Show type dynamically */}
    {office?.type === "managed" && (
      <span className="cursor-pointer hover:underline">Managed Space</span>
    )}
    {office?.type === "office" && (
      <span className="cursor-pointer hover:underline">Office Space</span>
    )}
    {office?.type === "co-working" && (
      <span className="cursor-pointer hover:underline">Co Working Space</span>
    )}

    <span className="text-gray-500">{'>'}</span>
    <span className="text-orange">{office?.buildingName}</span>
  </h1>
</div>
      {/* Left + Right Side Section */}
      <div className="w-full px-6 mt-10 flex flex-col lg:flex-row gap-6">
        {/* Left Side - Managed Office all data section */}
        <div className="flex-1 flex flex-col gap-6">
   {/* Office Detail Section */}
   <div className="mt-[2px] flex flex-col items-start space-y-[5px]">
  {/* Building Name */}
  <h1 className="text-[25px] font-bold text-gray-900">
    {office?.buildingName} ({category})
  </h1>

  {/* Location with icon */}
  <div className="flex items-center gap-2 text-[16px] text-gray-700">
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
    <div className="flex items-center gap-8 text-[16px] text-gray-700">
      {/* Furnishing Level */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>{office?.generalInfo?.furnishingLevel}</span>
      </div>

      {/* Area Sqft */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-orange-500"
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
    <div className="flex items-center gap-8 text-[16px] text-gray-700">
      {/* Warehouse Type */}
      <div className="flex items-center gap-2">
        <span>Type: {office?.warehouseInfo?.type}</span>
      </div>
      {/* Capacity */}
      <div className="flex items-center gap-2">
        <span>Capacity: {office?.warehouseInfo?.capacity} tons</span>
      </div>
    </div>
  )}

  {category === "Retail" && (
    <div className="flex items-center gap-8 text-[16px] text-gray-700">
      {/* Frontage */}
      <div className="flex items-center gap-2">
        <span>Frontage: {office?.retailInfo?.frontage} ft</span>
      </div>
      {/* Floor */}
      <div className="flex items-center gap-2">
        <span>Floor: {office?.retailInfo?.floor}</span>
      </div>
    </div>
  )}
</div>


{/* ===== CENTER DETAILS Section ===== */}
<div className="mt-6">
  {/* Title with underline */}
  <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
    CENTER DETAILS
  </h2>

  {/* General Details subtitle */}
  <h3 className="text-[16px] font-semibold text-black mt-5">
    General Details
  </h3>

  {/* Conditional Rendering for manage type */}
{office?.type === "managed" && (
  <div className="w-full h-[160px] bg-[#5290A3] p-4">
    {/* Two rows of details */}
    <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
      {/* Row 1 */}
      <div>
        <p className="text-white text-[14px] font-regular">Seater Offered</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.seaterOffered || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.rentPerSeat
            ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Power And Backup</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.powerAndBackup || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Lock In Period</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.lockInPeriod || "N/A"}
        </p>
      </div>

      {/* Row 2 */}
      <div>
        <p className="text-white text-[14px] font-regular">Furnishing Level</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.furnishingLevel || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">OC Availability</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.ocAvailability === true
            ? "Yes"
            : office?.generalInfo?.ocAvailability === false
            ? "No"
            : "N/A"}
        </p>
      </div>
    </div>
  </div>
)}

{office?.type === "office" && (
  <div className="mt-2 w-full max-w-[890px] h-[160px] bg-[#5290A3] p-4">
    {/* Two rows of details */}
    <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
      {/* Row 1 */}
      <div>
        <p className="text-white text-[14px] font-regular">Seater Offered1234</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.seaterOffered || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.rentPerSeat
            ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Floor Size</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.floorSize || "N/A"}
        </p>
      </div>

{/* Floors with expand/collapse */}
<div className="relative">
  <p className="text-white text-[14px] font-regular">Floors</p>
  <button
    onClick={() => setShowFloors(!showFloors)}
    className="flex items-center gap-1 text-[15px] font-bold focus:outline-none"
  >
    {office?.generalInfo?.floors || "N/A"}
    <span className="ml-2 text-[10px] text-white-800 underline">View Floors</span>
    {showFloors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>

  {/* Dropdown (overlapping) */}
  {showFloors && (
    <ul className="absolute left-0 mt-1 w-44 bg-[#3b7688] rounded-md shadow-lg z-50 p-2">
      {(Array.isArray(office?.generalInfo?.floorsName)
        ? office.generalInfo.floorsName
        : (office?.generalInfo?.floorsName || "").split(",")
      ).map((floor, index) => (
        <li
          key={index}
          className="text-[12px] text-white py-1 px-2 hover:bg-[#2e5c6a] rounded"
        >
          {floor.trim()}
        </li>
      ))}
    </ul>
  )}
</div>
      <div>
        <p className="text-white text-[14px] font-regular">Lock In Period</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.lockInPeriod || "N/A"}
        </p>
      </div>

      {/* Row 2 */}
      <div>
        <p className="text-white text-[14px] font-regular">Furnishing Level</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.furnishingLevel || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">OC Availability</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.ocAvailability === true
            ? "Yes"
            : office?.generalInfo?.ocAvailability === false
            ? "No"
            : "N/A"}
        </p>
      </div>
    </div>
  </div>
)}

{office?.type === "co-working" && (
  <div className="mt-2 w-full max-w-[890px] h-[190px] bg-[#5290A3] p-4">
    {/* Two rows of details */}
    <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
      {/* Row 1 */}
      <div>
        <p className="text-white text-[14px] font-regular">Seater Offered</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.seaterOffered || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.rentPerSeat
            ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Desk Type</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.deskTypes || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Lock In Period</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.lockInPeriod || "N/A"}
        </p>
      </div>

      {/* Row 2 */}
      <div>
        <p className="text-white text-[14px] font-regular">Furnishing Level</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.furnishingLevel || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">OC Availability</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.ocAvailability === true
            ? "Yes"
            : office?.generalInfo?.ocAvailability === false
            ? "No"
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Day Pass Price</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.dayPassPrice || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Reciption Hours</p>
        <p className="text-[15px] font-bold">
          {office?.generalInfo?.receptionHours || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Maintanance Charge</p>
        <p className="text-[15px] font-bold">
         {`Rs.${office.generalInfo.maintenanceCharges}/- ` || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Memebership Plans</p>
        <p className="text-[15px] font-bold">
         {office?.generalInfo?.membershipPlans || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Mem</p>
        <p className="text-[15px] font-bold">
         {office?.generalInfo?.membershipPlans || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-white text-[14px] font-regular">Rent Price</p>
        <p className="text-[15px] font-bold">
        {`Rs.${office.generalInfo.rentPrice}/- `|| "N/A"}
        </p>
      </div>
    </div>
  </div>
)}


{/* ===== ABOUT SECTION ===== */}
<div className="mt-6 w-full max-w-[890px] min-h-[250px] bg-slate-100 p-4 shadow-lg rounded-xl">
  {/* Top notice bar */}
  <div className="w-full h-[30px] flex items-center mb-4">
    <p className="text-[16px] text-gray-800 font-bold">
      Amenities
    </p>
  </div>

  {/* Amenities Grid */}
  <div className="grid grid-cols-3 gap-5 text-gray-900">
    {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
      const value = office?.amenities?.[key];
      if (value === true || value === "Yes") {
        return (
          <div key={key} className="flex items-center gap-2">
            <Icon className="w-6 h-6 text-orange-500" />
            <span className="text-[14px]">{label}</span>
          </div>
        );
      }
      return null;
    })}
  </div>

  {/* Bottom notice bar */}
  <div className="w-full mt-5 h-[30px] flex items-center">
    <p className="text-[10px] text-gray-500 font-medium">
      Some amenities are limited and subject to availability at the workspace...
    </p>
  </div>
</div>



{/* ===== LOCATION DETAILS SECTION ===== */}
<div className="mt-10 ">
  {/* Title with underline */}
  <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
    Location details
  </h2>

  {/* Address with icon */}
  <div className="flex items-center gap-2 mt-5">
    {/* Location Icon */}
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

    <p className="text-[16px] text-orange-500 font-medium">
      {office?.location?.address}
    </p>
  </div>

  {/* Placeholder Box */}
  {/* <div className="mt-5 w-[890px] min-h-[400px] bg-black p-4">
  </div> */}

  {/* Placeholder Box */}
{/* Placeholder Box */}
<div className="mt-5 w-full max-w-[890px] min-h-[400px] bg-black p-4 flex gap-4">
  {/* Left side: Google Maps */}
  <div className="flex-1">
  {office?.location?.link ? (
<iframe
  width="100%"
  height="400"
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
    <p className="text-white">No map link available</p>
  )}
</div>


  {/* Right side (empty for now) */}
  <div className="flex-1 bg-gray-800 rounded-md">
  <div className="flex-1 p-3 text-xs text-white bg-gray-900 rounded-md">
      {/* Toggle Header */}
      <div className="flex gap-4 text-[14px] mb-3">
        <button
          className={`pb-1 ${activeTab === "transit" ? "border-b-2 border-orange-500" : ""}`}
          onClick={() => setActiveTab("transit")}
        >
          Transit
        </button>
        <button
          className={`pb-1 ${activeTab === "publicFacilities" ? "border-b-2 border-orange-500" : ""}`}
          onClick={() => setActiveTab("publicFacilities")}
        >
          Public Facilities
        </button>
      </div>

      {/* Content */}
      {activeTab === "transit" && (
        <div className="space-y-2">
          {/* Metro */}
          <div>
            <div
              className="flex items-center justify-between text-orange-400 cursor-pointer"
              onClick={() => toggleExpand("metro")}
            >
              <div className="flex items-center gap-2">
                <FaSubway size={14} />
                <span className="text-[10px]">Metro Stations</span>
              </div>
              {expanded === "metro" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {expanded === "metro" && (
              <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
                {office?.transit?.metroStations?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Bus */}
          <div>
            <div
              className="flex items-center justify-between text-orange-400 cursor-pointer"
              onClick={() => toggleExpand("bus")}
            >
              <div className="flex items-center gap-2">
                <FaBus size={14} />
                <span className="text-[10px]">Bus Stations</span>
              </div>
              {expanded === "bus" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {expanded === "bus" && (
              <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
                {office?.transit?.busStations?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Train */}
          <div>
            <div
              className="flex items-center justify-between text-orange-400 cursor-pointer"
              onClick={() => toggleExpand("train")}
            >
              <div className="flex items-center gap-2">
                <FaTrain size={14} />
                <span className="text-[10px]">Train Stations</span>
              </div>
              {expanded === "train" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {expanded === "train" && (
              <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
                {office?.transit?.trainStations?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Airports */}
          <div>
            <div
              className="flex items-center justify-between text-orange-400 cursor-pointer"
              onClick={() => toggleExpand("airports")}
            >
              <div className="flex items-center gap-2">
                <FaPlane size={14} />
                <span className="text-[10px]">Airports</span>
              </div>
              {expanded === "airports" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {expanded === "airports" && (
              <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
                {office?.transit?.airports?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
{activeTab === "publicFacilities" && (
  <div className="space-y-2">
    {/* Hospitals */}
    <div>
      <div
        className="flex items-center justify-between text-orange-400 cursor-pointer"
        onClick={() => toggleExpand("hospitals")}
      >
        <div className="flex items-center gap-2">
          <FaHospital size={14} />
          <span className="text-[10px]">Hospitals</span>
        </div>
        {expanded === "hospitals" ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
      </div>
      {expanded === "hospitals" && (
        <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
          {office?.publicFacilities?.hospitals?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>

    {/* Restaurants */}
    <div>
      <div
        className="flex items-center justify-between text-orange-400 cursor-pointer"
        onClick={() => toggleExpand("restaurants")}
      >
        <div className="flex items-center gap-2">
          <FaUtensils size={14} />
          <span className="text-[10px]">Restaurants</span>
        </div>
        {expanded === "restaurants" ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
      </div>
      {expanded === "restaurants" && (
        <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
          {office?.publicFacilities?.restaurants?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>

    {/* ATMs */}
    <div>
      <div
        className="flex items-center justify-between text-orange-400 cursor-pointer"
        onClick={() => toggleExpand("atms")}
      >
        <div className="flex items-center gap-2">
          <FaMoneyCheckAlt size={14} />
          <span className="text-[10px]">ATMs</span>
        </div>
        {expanded === "atms" ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
      </div>
      {expanded === "atms" && (
        <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
          {office?.publicFacilities?.atms?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}
    </div>
  </div>
</div>
</div>
</div>
   </div>
        {/* Right Side - User Details Card */}
     {/* Right Side - User Details Card */}
<div className="w-full lg:max-w-[443px] flex-shrink-0">
  {/* Intro Text */}
  <h2 className="mb-4 text-xs sm:text-sm text-[#374151] font-bold text-center leading-snug">
    Upgrade your Space office with Vishwa and Team to get the best price and best deals for your office space.
  </h2>

  {/* Profile Section */}
  <div className="flex items-start justify-between w-full min-h-[166px] gap-4">
    {/* Left: Profile Image */}
    <div className="w-24 h-24 p-1.5 rounded-full border-2 border-gray-300 overflow-hidden flex-shrink-0">
      <img
        src={user?.profileImage || "https://via.placeholder.com/94"}
        alt={user?.fullName || "Handler"}
        className="object-cover w-full h-full rounded-full"
      />
    </div>

    {/* Right: Profile Details + Button */}
    <div className="flex flex-col flex-1 items-center">
      <div className="flex flex-col items-center space-y-1 text-center">
        <h3 className="text-sm sm:text-base font-bold text-[#374151]">{user?.fullName}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{user?.mobile}</p>
        <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
      </div>

      {isRestricted && (
        <button
          className="mt-3 w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true); // open login modal
          }}
        >
          Contact {user?.fullName?.split(" ")[0]}
        </button>
      )}
    </div>
  </div>

  {/* Info Box */}
  <div className="flex justify-center mt-6">
    <div className="w-full bg-gray-100 rounded p-3 text-center text-xs sm:text-sm text-gray-700 leading-snug">
      Vishwa and team assisted <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore to move into their new office.
    </div>
  </div>

  {/* Logos Section */}
  <div className="flex justify-center items-center mt-3 gap-5 flex-wrap">
    {[
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
      "https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg",
      "https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg",
      "https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg",
    ].map((logo, idx) => (
      <img key={idx} src={logo} alt={`Logo${idx}`} className="w-8 h-8 object-contain" />
    ))}
  </div>

  {/* Key Points Section */}
  <div className="mt-4 text-xs sm:text-sm text-gray-700">
    <p className="mb-2 font-bold">Explore workspace solutions with our expert guidance:</p>
    <ul className="space-y-2">
      {[
        "Workspace selection & location strategy",
        "Workspace tours",
        "Layout design & customization assistance",
        "Terms negotiations & deal signing",
      ].map((point, idx) => (
        <li key={idx} className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* Button at bottom center */}
  <div className="flex justify-center mt-4">
    <button
       onClick={handleContactClick}
      className="w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
    >
      Contact Quote
    </button>
  </div>
</div>

      </div>
      {/* ==================== Related Properties Section ==================== */}
{relatedProperties?.length > 0 && (
  <div className="mt-12 px-6">
    <h2 className="text-xl font-semibold text-[#222] mb-6">
      Other Spaces in {relatedCity}
    </h2>

    {/* Horizontal Scroll Row */}
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {relatedProperties.map((prop) => (
        <div
          key={prop._id}
          className="relative min-w-[360px] max-w-[380px] rounded-2xl shadow-lg cursor-pointer  transform hover:scale-[1.03] hover:shadow-xl transition-transform duration-300 flex-shrink-0"
          onClick={() => handleRelatedPropertyClick(prop)}
        >
          {/* Image */}
          <img
            src={
              prop.images?.[0] ||
              "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
            }
            alt={prop.buildingName}
            className="w-full h-64 object-cover"
          />

          {/* Overlay Bottom Info */}
          <div className="absolute bottom-0 left-0 w-full bg-black/40 p-4 backdrop-blur-sm">
            <h3 className="text-white text-base font-bold truncate">
              {prop.buildingName}
            </h3>
            <p className="text-gray-300 text-sm truncate">
              {prop.location?.locationOfProperty}, {prop.location?.zone}
            </p>
            <p className="text-gray-200 text-sm mt-1">
              {prop.generalInfo?.seaterOffered} Seats | ₹
              {prop.generalInfo?.rentPerSeat}/seat
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {prop.generalInfo?.furnishingLevel && (
                <span className="bg-black/30 text-amber-300 text-[11px] px-2 py-0.5 rounded-full">
                  {prop.generalInfo.furnishingLevel}
                </span>
              )}
              {prop.availability_status && (
                <span className="bg-green-200/20 text-green-300 text-[11px] px-2 py-0.5 rounded-full">
                  {prop.availability_status}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

            {/* ✅ Modals */}
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

  )
}

export default ManagedOfficeDetail








//=====>> Login and related card done 



// import React, { useState, useEffect } from "react";
// import { Check } from "lucide-react";
// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";
// import { Link,useLocation } from "react-router-dom";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import GroupsScroller from "../../components/GroupsScroller";
// import OfficeHero from "../../components/OfficeHero";


// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//   const { id } = useParams();
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const category = searchParams.get("category") || "managed";

//   const [office, setOffice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   const [leadMessage, setLeadMessage] = useState("");
//   const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

//   // Modal states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// //related card
// const [relatedProperties, setRelatedProperties] = useState([]);
// const [relatedCity, setRelatedCity] = useState("");
// const visitorId = Cookies.get("visitorId");


//   useEffect(() => {
//     fetchOffice();
//   }, [id, category]);



//   // useEffect(() => {
//   //   // Assuming location.state is passed when navigating to this page
//   //   const state = location.state || {};
//   //   const city = state.city || "";
//   //   const properties = state.relatedProperties || [];
//   // console.log("ciiiiii============>> Ty ", city)
//   //   setRelatedCity(city);
//   //   // Filter only properties from the same city
//   //   const filtered = properties.filter(
//   //     (item) => item.location?.city === city
//   //   );
//   //   setRelatedProperties(filtered);
//   // }, [location.state]);

//   useEffect(() => {
//     const state = location.state || {};
//     const city = state.city || "";
//     const properties = state.relatedProperties || [];
  
//     console.log("City from state:", city);
//     setRelatedCity(city);
//     const filtered = properties.filter(item => item.location?.city === city);
//     setRelatedProperties(filtered);
//   }, [location.state]);
  
  


// console.log("Testing getting related properties",relatedProperties)


//   const fetchOffice = async () => {
//     try {
//       let res = null;
//       if (category === "managed") res = await getManagedOfficeById(id);
//       else if (category === "office") res = await getOfficeSpaceById(id);
//       else if (category === "co-working") res = await getCoWorkingSpaceById(id);

//       setOffice(res);
//       setUserId(res?.assigned_agent?._id);
//       setOfficeId(res?._id);
//     } catch (error) {
//       console.error("Error fetching office detail:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!userId) return;
//       try {
//         const userData = await getUserDataById(userId);
//         setUser(userData);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };
//     fetchUser();
//   }, [userId]);

//   const handleContactClick = () => {
//     const visitor = Cookies.get("visitorId");
//     if (visitor) {
//       setIsLeadModalOpen(true);
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };

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
  
// // // Function to handle clicking on a related property card
// const handleRelatedPropertyClick = async (property) => {
//   setOffice(property);
//   setOfficeId(property._id);
//   setUserId(property.assigned_agent || null);

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

//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//   if (loading) return <p className="p-6">Loading...</p>;
//   if (!office) return <p className="p-6 text-red-600">Office not found</p>;



//   return (
//     <div className="h-screen w-full">
//  <OfficeHero
//   office={{ office }}
//   onLoginRequired={() => {
//     setIsAuthModalOpen(true);
//     setIsLeadModalOpen(false); // hide wishlist if open
//   }}
//   onLogout={() => {
//     Cookies.remove("visitorId");
//   }}
// />



//       <div className="px-6 mt-4">
//         <h1 className="text-[18px] font-bold text-orange-500 flex items-center gap-2">
//         <Link to="/" className="cursor-pointer hover:underline">
//       Home
//     </Link>
//     <span className="text-gray-500">{">"}</span>
//     <Link
//       to="/menu" 
//       className="cursor-pointer hover:underline capitalize"
//     >
//       {category} Space
//     </Link>
//           <span className="text-gray-500">{">"}</span>
//           <span className="text-orange">{office?.buildingName}</span>
//         </h1>
//       </div>

//       <div className="w-full px-6 mt-10 flex flex-col lg:flex-row gap-6">
//         <div className="flex-1 flex flex-col gap-6">{/* office details */}</div>

//         {/* Right Side - Agent Info */}
//         <div className="w-full lg:max-w-[443px] flex-shrink-0">
//           <h2 className="mb-4 text-xs sm:text-sm text-[#374151] font-bold text-center leading-snug">
//             Upgrade your workspace with Vishwa and Team to get the best price
//             and deals for your office.
//           </h2>

//           <div className="flex items-start justify-between w-full min-h-[166px] gap-4">
//             <div className="w-24 h-24 p-1.5 rounded-full border-2 border-gray-300 overflow-hidden flex-shrink-0">
//               <img
//                 src={user?.profileImage || "https://via.placeholder.com/94"}
//                 alt={user?.fullName || "Handler"}
//                 className="object-cover w-full h-full rounded-full"
//               />
//             </div>

//             <div className="flex flex-col flex-1 items-center">
//               <div className="flex flex-col items-center space-y-1 text-center">
//                 <h3 className="text-sm sm:text-base font-bold text-[#374151]">
//                   {user?.fullName}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-600">{user?.mobile}</p>
//                 <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
//               </div>

//               <button
//                 className="mt-3 w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactClick();
//                 }}
//               >
//                 Contact {user?.fullName?.split(" ")[0]}
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-center mt-6">
//             <div className="w-full bg-gray-100 rounded p-3 text-center text-xs sm:text-sm text-gray-700 leading-snug">
//               Vishwa and team assisted{" "}
//               <strong className="font-bold text-gray-900">
//                 500+ corporates
//               </strong>{" "}
//               in Bangalore to move into their new office.
//             </div>
//           </div>

//           <div className="flex justify-center mt-4">
//             <button
//               onClick={handleContactClick}
//               className="w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//             >
//               Contact Quote
//             </button>
//           </div>
//         </div>
//       </div>

// {/* ==================== Related Properties Section ==================== */}
// {relatedProperties?.length > 0 && (
//   <div className="mt-12 px-6">
//     <h2 className="text-xl font-semibold text-[#222] mb-6">
//       Other Spaces in {relatedCity}
//     </h2>

//     {/* Horizontal Scroll Row */}
//     <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//       {relatedProperties.map((prop) => (
//         <div
//           key={prop._id}
//           className="relative min-w-[360px] max-w-[380px] rounded-2xl shadow-lg cursor-pointer  transform hover:scale-[1.03] hover:shadow-xl transition-transform duration-300 flex-shrink-0"
//           onClick={() => handleRelatedPropertyClick(prop)}
//         >
//           {/* Image */}
//           <img
//             src={
//               prop.images?.[0] ||
//               "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
//             }
//             alt={prop.buildingName}
//             className="w-full h-64 object-cover"
//           />

//           {/* Overlay Bottom Info */}
//           <div className="absolute bottom-0 left-0 w-full bg-black/40 p-4 backdrop-blur-sm">
//             <h3 className="text-white text-base font-bold truncate">
//               {prop.buildingName}
//             </h3>
//             <p className="text-gray-300 text-sm truncate">
//               {prop.location?.locationOfProperty}, {prop.location?.zone}
//             </p>
//             <p className="text-gray-200 text-sm mt-1">
//               {prop.generalInfo?.seaterOffered} Seats | ₹
//               {prop.generalInfo?.rentPerSeat}/seat
//             </p>

//             <div className="flex flex-wrap gap-2 mt-2">
//               {prop.generalInfo?.furnishingLevel && (
//                 <span className="bg-black/30 text-amber-300 text-[11px] px-2 py-0.5 rounded-full">
//                   {prop.generalInfo.furnishingLevel}
//                 </span>
//               )}
//               {prop.availability_status && (
//                 <span className="bg-green-200/20 text-green-300 text-[11px] px-2 py-0.5 rounded-full">
//                   {prop.availability_status}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )}


//       {/* ✅ Modals */}
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
// };

// export default ManagedOfficeDetail;








//===========>>> Old login flow done working on the related card




// import React, { useState, useEffect } from "react";
// import { Check } from "lucide-react";
// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";
// import { Link } from "react-router-dom";
// // import { mockOfficeData } from "../data/mockOfficeData"; 
// import { getManagedOfficeById } from "../../api/services/managedOfficeService";
// import { getOfficeSpaceById } from "../../api/services/officeSpaceService";
// import { getCoWorkingSpaceById } from "../../api/services/coWorkingSpaceService";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// // import { MapPin, ChevronLeft, ChevronRight , Bookmark, Check,  } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { getUserDataById } from "../../api/services/userService";
// import WishlistSidebar from "../../components/WishlistSidebar";

// import GroupsScroller from "../../components/GroupsScroller";
// import OfficeHero from "../../components/OfficeHero";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//   const { id } = useParams();
//   const searchParams = new URLSearchParams(location.search);
//   const category = searchParams.get("category") || "managed";

//   const [office, setOffice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   const [leadMessage, setLeadMessage] = useState("");
//   const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

//   // Modal states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

//   const visitorId = Cookies.get("visitorId");

//   useEffect(() => {
//     fetchOffice();
//   }, [id, category]);

//   const fetchOffice = async () => {
//     try {
//       let res = null;
//       if (category === "managed") res = await getManagedOfficeById(id);
//       else if (category === "office") res = await getOfficeSpaceById(id);
//       else if (category === "co-working") res = await getCoWorkingSpaceById(id);

//       setOffice(res);
//       setUserId(res?.assigned_agent?._id);
//       setOfficeId(res?._id);
//     } catch (error) {
//       console.error("Error fetching office detail:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!userId) return;
//       try {
//         const userData = await getUserDataById(userId);
//         setUser(userData);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };
//     fetchUser();
//   }, [userId]);

//   const handleContactClick = () => {
//     const visitor = Cookies.get("visitorId");
//     if (visitor) {
//       setIsLeadModalOpen(true);
//     } else {
//       setIsAuthModalOpen(true);
//     }
//   };

//   // const handleLeadSubmit = async () => {
//   //   const visitorId = Cookies.get("visitorId");
//   //   if (!visitorId) return false;

//   //   try {
//   //     const leadData = {
//   //       propertyId: officeId,
//   //       visitorId: visitorId,
//   //       assignedAgentId: userId,
//   //       message: leadMessage,
//   //     };

//   //     await postLeadData(leadData);
//   //     setLeadMessage("");
//   //     return true; // ✅ Success
//   //   } catch (error) {
//   //     console.error("Error submitting lead:", error);
//   //     return false; // ❌ Fail
//   //   }
//   // };

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
  

//   if (loading) return <p className="p-6">Loading...</p>;
//   if (!office) return <p className="p-6 text-red-600">Office not found</p>;

//   return (
//     <div className="h-screen w-full">
//  <OfficeHero
//   office={{ office }}
//   onLoginRequired={() => {
//     setIsAuthModalOpen(true);
//     setIsLeadModalOpen(false); // hide wishlist if open
//   }}
//   onLogout={() => {
//     Cookies.remove("visitorId");
//   }}
// />



//       <div className="px-6 mt-4">
//         <h1 className="text-[18px] font-bold text-orange-500 flex items-center gap-2">
//         <Link to="/" className="cursor-pointer hover:underline">
//       Home
//     </Link>
//     <span className="text-gray-500">{">"}</span>
//     <Link
//       to="/menu" 
//       className="cursor-pointer hover:underline capitalize"
//     >
//       {category} Space
//     </Link>
//           <span className="text-gray-500">{">"}</span>
//           <span className="text-orange">{office?.buildingName}</span>
//         </h1>
//       </div>

//       <div className="w-full px-6 mt-10 flex flex-col lg:flex-row gap-6">
//         <div className="flex-1 flex flex-col gap-6">{/* office details */}</div>

//         {/* Right Side - Agent Info */}
//         <div className="w-full lg:max-w-[443px] flex-shrink-0">
//           <h2 className="mb-4 text-xs sm:text-sm text-[#374151] font-bold text-center leading-snug">
//             Upgrade your workspace with Vishwa and Team to get the best price
//             and deals for your office.
//           </h2>

//           <div className="flex items-start justify-between w-full min-h-[166px] gap-4">
//             <div className="w-24 h-24 p-1.5 rounded-full border-2 border-gray-300 overflow-hidden flex-shrink-0">
//               <img
//                 src={user?.profileImage || "https://via.placeholder.com/94"}
//                 alt={user?.fullName || "Handler"}
//                 className="object-cover w-full h-full rounded-full"
//               />
//             </div>

//             <div className="flex flex-col flex-1 items-center">
//               <div className="flex flex-col items-center space-y-1 text-center">
//                 <h3 className="text-sm sm:text-base font-bold text-[#374151]">
//                   {user?.fullName}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-600">{user?.mobile}</p>
//                 <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
//               </div>

//               <button
//                 className="mt-3 w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactClick();
//                 }}
//               >
//                 Contact {user?.fullName?.split(" ")[0]}
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-center mt-6">
//             <div className="w-full bg-gray-100 rounded p-3 text-center text-xs sm:text-sm text-gray-700 leading-snug">
//               Vishwa and team assisted{" "}
//               <strong className="font-bold text-gray-900">
//                 500+ corporates
//               </strong>{" "}
//               in Bangalore to move into their new office.
//             </div>
//           </div>

//           <div className="flex justify-center mt-4">
//             <button
//               onClick={handleContactClick}
//               className="w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//             >
//               Contact Quote
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Modals */}
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
// };

// export default ManagedOfficeDetail;









///+++>>>> Old


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
// import OfficeHero from "../../components/OfficeHero";


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

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "managed"; 
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
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
//           setUserId(res?.assigned_agent?._id);
//           setOfficeId(res?._id);
//         } catch (error) {
//           console.error("Error fetching office detail:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
      
    
//       console.log("@@@@@@@@@@###########==============",userId)
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
//   return (

// <div className=" h-screen w-full">
// <OfficeHero office={{office}}/>
// {/* Breadcrumb Navigation */}
// <div className="px-6 mt-4">
//   <h1 className="text-[18px] font-bold text-orange-500 flex items-center gap-2">
//     <span className="cursor-pointer hover:underline">Home</span>
//     <span className="text-gray-500">{'>'}</span>

//     {/* Show type dynamically */}
//     {office?.type === "managed" && (
//       <span className="cursor-pointer hover:underline">Managed Space</span>
//     )}
//     {office?.type === "office" && (
//       <span className="cursor-pointer hover:underline">Office Space</span>
//     )}
//     {office?.type === "co-working" && (
//       <span className="cursor-pointer hover:underline">Co Working Space</span>
//     )}

//     <span className="text-gray-500">{'>'}</span>
//     <span className="text-orange">{office?.buildingName}</span>
//   </h1>
// </div>
//       {/* Left + Right Side Section */}
//       <div className="w-full px-6 mt-10 flex flex-col lg:flex-row gap-6">
//         {/* Left Side - Managed Office all data section */}
//         <div className="flex-1 flex flex-col gap-6">
//    {/* Office Detail Section */}
// {/* ===== CENTER DETAILS Section ===== */}
//    </div>
//         {/* Right Side - User Details Card */}
//      {/* Right Side - User Details Card */}
// <div className="w-full lg:max-w-[443px] flex-shrink-0">
//   {/* Intro Text */}
//   <h2 className="mb-4 text-xs sm:text-sm text-[#374151] font-bold text-center leading-snug">
//     Upgrade your Space office with Vishwa and Team to get the best price and best deals for your office space.
//   </h2>

//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full min-h-[166px] gap-4">
//     {/* Left: Profile Image */}
//     <div className="w-24 h-24 p-1.5 rounded-full border-2 border-gray-300 overflow-hidden flex-shrink-0">
//       <img
//         src={user?.profileImage || "https://via.placeholder.com/94"}
//         alt={user?.fullName || "Handler"}
//         className="object-cover w-full h-full rounded-full"
//       />
//     </div>

//     {/* Right: Profile Details + Button */}
//     <div className="flex flex-col flex-1 items-center">
//       <div className="flex flex-col items-center space-y-1 text-center">
//         <h3 className="text-sm sm:text-base font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-xs sm:text-sm text-gray-600">{user?.mobile}</p>
//         <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
//       </div>

//       {isRestricted && (
//         <button
//           className="mt-3 w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true); // open login modal
//           }}
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       )}
//     </div>
//   </div>

//   {/* Info Box */}
//   <div className="flex justify-center mt-6">
//     <div className="w-full bg-gray-100 rounded p-3 text-center text-xs sm:text-sm text-gray-700 leading-snug">
//       Vishwa and team assisted <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore to move into their new office.
//     </div>
//   </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-3 gap-5 flex-wrap">
//     {[
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
//       "https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg",
//       "https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg",
//       "https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg",
//     ].map((logo, idx) => (
//       <img key={idx} src={logo} alt={`Logo${idx}`} className="w-8 h-8 object-contain" />
//     ))}
//   </div>

//   {/* Key Points Section */}
//   <div className="mt-4 text-xs sm:text-sm text-gray-700">
//     <p className="mb-2 font-bold">Explore workspace solutions with our expert guidance:</p>
//     <ul className="space-y-2">
//       {[
//         "Workspace selection & location strategy",
//         "Workspace tours",
//         "Layout design & customization assistance",
//         "Terms negotiations & deal signing",
//       ].map((point, idx) => (
//         <li key={idx} className="flex items-center gap-2">
//           <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
//           <span>{point}</span>
//         </li>
//       ))}
//     </ul>
//   </div>

//   {/* Button at bottom center */}
//   <div className="flex justify-center mt-4">
//     <button
//       onClick={handleContactQuoteClick}
//       className="w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//     >
//       Contact Quote
//     </button>
//   </div>
// </div>
//       </div>   
//     </div>

//   )
// }

// export default ManagedOfficeDetail








//=======================>>>> Implementing the login flow 


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
// import OfficeHero from "../../components/OfficeHero";


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

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "managed"; 
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
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
//           setUserId(res?.assigned_agent?._id);
//           setOfficeId(res?._id);
//         } catch (error) {
//           console.error("Error fetching office detail:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
      
    
//       console.log("@@@@@@@@@@###########==============",userId)
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
//   return (

// <div className=" h-screen w-full">
// <OfficeHero office={{office}}/>
// {/* Breadcrumb Navigation */}
// <div className="px-6 mt-4">
//   <h1 className="text-[18px] font-bold text-orange-500 flex items-center gap-2">
//     <span className="cursor-pointer hover:underline">Home</span>
//     <span className="text-gray-500">{'>'}</span>

//     {/* Show type dynamically */}
//     {office?.type === "managed" && (
//       <span className="cursor-pointer hover:underline">Managed Space</span>
//     )}
//     {office?.type === "office" && (
//       <span className="cursor-pointer hover:underline">Office Space</span>
//     )}
//     {office?.type === "co-working" && (
//       <span className="cursor-pointer hover:underline">Co Working Space</span>
//     )}

//     <span className="text-gray-500">{'>'}</span>
//     <span className="text-orange">{office?.buildingName}</span>
//   </h1>
// </div>
//       {/* Left + Right Side Section */}
//       <div className="w-full px-6 mt-10 flex flex-col lg:flex-row gap-6">
//         {/* Left Side - Managed Office all data section */}
//         <div className="flex-1 flex flex-col gap-6">
//    {/* Office Detail Section */}
//    <div className="mt-[2px] flex flex-col items-start space-y-[5px]">
//   {/* Building Name */}
//   <h1 className="text-[25px] font-bold text-gray-900">
//     {office?.buildingName} ({category})
//   </h1>

//   {/* Location with icon */}
//   <div className="flex items-center gap-2 text-[16px] text-gray-700">
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
//         strokeWidth={2}
//         d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <span>{office?.location?.locationOfProperty}</span>
//   </div>

//   {/* Category Based Info */}
//   {category === "Office" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Furnishing Level */}
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 text-orange-500"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//         <span>{office?.generalInfo?.furnishingLevel}</span>
//       </div>

//       {/* Area Sqft */}
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 text-orange-500"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//         </svg>
//         <span>{office?.location?.areaSqft} sqft</span>
//       </div>
//     </div>
//   )}

//   {category === "Warehouse" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Warehouse Type */}
//       <div className="flex items-center gap-2">
//         <span>Type: {office?.warehouseInfo?.type}</span>
//       </div>
//       {/* Capacity */}
//       <div className="flex items-center gap-2">
//         <span>Capacity: {office?.warehouseInfo?.capacity} tons</span>
//       </div>
//     </div>
//   )}

//   {category === "Retail" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Frontage */}
//       <div className="flex items-center gap-2">
//         <span>Frontage: {office?.retailInfo?.frontage} ft</span>
//       </div>
//       {/* Floor */}
//       <div className="flex items-center gap-2">
//         <span>Floor: {office?.retailInfo?.floor}</span>
//       </div>
//     </div>
//   )}
// </div>


// {/* ===== CENTER DETAILS Section ===== */}
// <div className="mt-6">
//   {/* Title with underline */}
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
//     CENTER DETAILS
//   </h2>

//   {/* General Details subtitle */}
//   <h3 className="text-[16px] font-semibold text-black mt-5">
//     General Details
//   </h3>

//   {/* Conditional Rendering for manage type */}
// {office?.type === "managed" && (
//   <div className="w-full h-[160px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Power And Backup</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.powerAndBackup || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}

// {office?.type === "office" && (
//   <div className="mt-2 w-full max-w-[890px] h-[160px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered1234</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Floor Size</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.floorSize || "N/A"}
//         </p>
//       </div>

// {/* Floors with expand/collapse */}
// <div className="relative">
//   <p className="text-white text-[14px] font-regular">Floors</p>
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="flex items-center gap-1 text-[15px] font-bold focus:outline-none"
//   >
//     {office?.generalInfo?.floors || "N/A"}
//     <span className="ml-2 text-[10px] text-white-800 underline">View Floors</span>
//     {showFloors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//   </button>

//   {/* Dropdown (overlapping) */}
//   {showFloors && (
//     <ul className="absolute left-0 mt-1 w-44 bg-[#3b7688] rounded-md shadow-lg z-50 p-2">
//       {(Array.isArray(office?.generalInfo?.floorsName)
//         ? office.generalInfo.floorsName
//         : (office?.generalInfo?.floorsName || "").split(",")
//       ).map((floor, index) => (
//         <li
//           key={index}
//           className="text-[12px] text-white py-1 px-2 hover:bg-[#2e5c6a] rounded"
//         >
//           {floor.trim()}
//         </li>
//       ))}
//     </ul>
//   )}
// </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}

// {office?.type === "co-working" && (
//   <div className="mt-2 w-full max-w-[890px] h-[190px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Desk Type</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.deskTypes || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Day Pass Price</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.dayPassPrice || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Reciption Hours</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.receptionHours || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Maintanance Charge</p>
//         <p className="text-[15px] font-bold">
//          {`Rs.${office.generalInfo.maintenanceCharges}/- ` || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Memebership Plans</p>
//         <p className="text-[15px] font-bold">
//          {office?.generalInfo?.membershipPlans || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Mem</p>
//         <p className="text-[15px] font-bold">
//          {office?.generalInfo?.membershipPlans || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Price</p>
//         <p className="text-[15px] font-bold">
//         {`Rs.${office.generalInfo.rentPrice}/- `|| "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}


// {/* ===== ABOUT SECTION ===== */}
// <div className="mt-6 w-full max-w-[890px] min-h-[250px] bg-slate-100 p-4 shadow-lg rounded-xl">
//   {/* Top notice bar */}
//   <div className="w-full h-[30px] flex items-center mb-4">
//     <p className="text-[16px] text-gray-800 font-bold">
//       Amenities
//     </p>
//   </div>

//   {/* Amenities Grid */}
//   <div className="grid grid-cols-3 gap-5 text-gray-900">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div key={key} className="flex items-center gap-2">
//             <Icon className="w-6 h-6 text-orange-500" />
//             <span className="text-[14px]">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom notice bar */}
//   <div className="w-full mt-5 h-[30px] flex items-center">
//     <p className="text-[10px] text-gray-500 font-medium">
//       Some amenities are limited and subject to availability at the workspace...
//     </p>
//   </div>
// </div>



// {/* ===== LOCATION DETAILS SECTION ===== */}
// <div className="mt-10 ">
//   {/* Title with underline */}
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
//     Location details
//   </h2>

//   {/* Address with icon */}
//   <div className="flex items-center gap-2 mt-5">
//     {/* Location Icon */}
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

//     <p className="text-[16px] text-orange-500 font-medium">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Placeholder Box */}
//   {/* <div className="mt-5 w-[890px] min-h-[400px] bg-black p-4">
//   </div> */}

//   {/* Placeholder Box */}
// {/* Placeholder Box */}
// <div className="mt-5 w-full max-w-[890px] min-h-[400px] bg-black p-4 flex gap-4">
//   {/* Left side: Google Maps */}
//   <div className="flex-1">
//   {office?.location?.link ? (
// <iframe
//   width="100%"
//   height="400"
//   style={{ border: 0 }}
//   loading="lazy"
//   allowFullScreen
//   referrerPolicy="no-referrer-when-downgrade"
//   src={
//     coords
//       ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//       : ""
//   }
// />
//   ) : (
//     <p className="text-white">No map link available</p>
//   )}
// </div>


//   {/* Right side (empty for now) */}
//   <div className="flex-1 bg-gray-800 rounded-md">
//   <div className="flex-1 p-3 text-xs text-white bg-gray-900 rounded-md">
//       {/* Toggle Header */}
//       <div className="flex gap-4 text-[14px] mb-3">
//         <button
//           className={`pb-1 ${activeTab === "transit" ? "border-b-2 border-orange-500" : ""}`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`pb-1 ${activeTab === "publicFacilities" ? "border-b-2 border-orange-500" : ""}`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-2">
//           {/* Metro */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaSubway size={14} />
//                 <span className="text-[10px]">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaBus size={14} />
//                 <span className="text-[10px]">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaTrain size={14} />
//                 <span className="text-[10px]">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaPlane size={14} />
//                 <span className="text-[10px]">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
// {activeTab === "publicFacilities" && (
//   <div className="space-y-2">
//     {/* Hospitals */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("hospitals")}
//       >
//         <div className="flex items-center gap-2">
//           <FaHospital size={14} />
//           <span className="text-[10px]">Hospitals</span>
//         </div>
//         {expanded === "hospitals" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "hospitals" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.hospitals?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>

//     {/* Restaurants */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("restaurants")}
//       >
//         <div className="flex items-center gap-2">
//           <FaUtensils size={14} />
//           <span className="text-[10px]">Restaurants</span>
//         </div>
//         {expanded === "restaurants" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "restaurants" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.restaurants?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>

//     {/* ATMs */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("atms")}
//       >
//         <div className="flex items-center gap-2">
//           <FaMoneyCheckAlt size={14} />
//           <span className="text-[10px]">ATMs</span>
//         </div>
//         {expanded === "atms" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "atms" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.atms?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   </div>
// )}
//     </div>
//   </div>
// </div>
// </div>
// </div>
//    </div>
//         {/* Right Side - User Details Card */}
//      {/* Right Side - User Details Card */}
// <div className="w-full lg:max-w-[443px] flex-shrink-0">
//   {/* Intro Text */}
//   <h2 className="mb-4 text-xs sm:text-sm text-[#374151] font-bold text-center leading-snug">
//     Upgrade your Space office with Vishwa and Team to get the best price and best deals for your office space.
//   </h2>

//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full min-h-[166px] gap-4">
//     {/* Left: Profile Image */}
//     <div className="w-24 h-24 p-1.5 rounded-full border-2 border-gray-300 overflow-hidden flex-shrink-0">
//       <img
//         src={user?.profileImage || "https://via.placeholder.com/94"}
//         alt={user?.fullName || "Handler"}
//         className="object-cover w-full h-full rounded-full"
//       />
//     </div>

//     {/* Right: Profile Details + Button */}
//     <div className="flex flex-col flex-1 items-center">
//       <div className="flex flex-col items-center space-y-1 text-center">
//         <h3 className="text-sm sm:text-base font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-xs sm:text-sm text-gray-600">{user?.mobile}</p>
//         <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
//       </div>

//       {isRestricted && (
//         <button
//           className="mt-3 w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true); // open login modal
//           }}
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       )}
//     </div>
//   </div>

//   {/* Info Box */}
//   <div className="flex justify-center mt-6">
//     <div className="w-full bg-gray-100 rounded p-3 text-center text-xs sm:text-sm text-gray-700 leading-snug">
//       Vishwa and team assisted <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore to move into their new office.
//     </div>
//   </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-3 gap-5 flex-wrap">
//     {[
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
//       "https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg",
//       "https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg",
//       "https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg",
//     ].map((logo, idx) => (
//       <img key={idx} src={logo} alt={`Logo${idx}`} className="w-8 h-8 object-contain" />
//     ))}
//   </div>

//   {/* Key Points Section */}
//   <div className="mt-4 text-xs sm:text-sm text-gray-700">
//     <p className="mb-2 font-bold">Explore workspace solutions with our expert guidance:</p>
//     <ul className="space-y-2">
//       {[
//         "Workspace selection & location strategy",
//         "Workspace tours",
//         "Layout design & customization assistance",
//         "Terms negotiations & deal signing",
//       ].map((point, idx) => (
//         <li key={idx} className="flex items-center gap-2">
//           <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
//           <span>{point}</span>
//         </li>
//       ))}
//     </ul>
//   </div>

//   {/* Button at bottom center */}
//   <div className="flex justify-center mt-4">
//     <button
//       onClick={handleContactQuoteClick}
//       className="w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//     >
//       Contact Quote
//     </button>
//   </div>
// </div>

//       </div>
      
//     </div>

//   )
// }

// export default ManagedOfficeDetail








//====================>>>> old backend



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
// import OfficeHero from "../../components/OfficeHero";


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

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "managed"; 
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
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
//   return (

// <div className=" h-screen w-full">
// <OfficeHero office={{office}}/>
// {/* Breadcrumb Navigation */}
// <div className="px-6 mt-4">
//   <h1 className="text-[18px] font-bold text-orange-500 flex items-center gap-2">
//     <span className="cursor-pointer hover:underline">Home</span>
//     <span className="text-gray-500">{'>'}</span>

//     {/* Show type dynamically */}
//     {office?.type === "managed" && (
//       <span className="cursor-pointer hover:underline">Managed Space</span>
//     )}
//     {office?.type === "office" && (
//       <span className="cursor-pointer hover:underline">Office Space</span>
//     )}
//     {office?.type === "co-working" && (
//       <span className="cursor-pointer hover:underline">Co Working Space</span>
//     )}

//     <span className="text-gray-500">{'>'}</span>
//     <span className="text-orange">{office?.buildingName}</span>
//   </h1>
// </div>
//       {/* Left + Right Side Section */}
//       <div className="w-full px-6 mt-10 flex flex-col lg:flex-row gap-6">
//         {/* Left Side - Managed Office all data section */}
//         <div className="flex-1 flex flex-col gap-6">
//    {/* Office Detail Section */}
//    <div className="mt-[2px] flex flex-col items-start space-y-[5px]">
//   {/* Building Name */}
//   <h1 className="text-[25px] font-bold text-gray-900">
//     {office?.buildingName} ({category})
//   </h1>

//   {/* Location with icon */}
//   <div className="flex items-center gap-2 text-[16px] text-gray-700">
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
//         strokeWidth={2}
//         d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <span>{office?.location?.locationOfProperty}</span>
//   </div>

//   {/* Category Based Info */}
//   {category === "Office" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Furnishing Level */}
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 text-orange-500"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//         <span>{office?.generalInfo?.furnishingLevel}</span>
//       </div>

//       {/* Area Sqft */}
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 text-orange-500"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//         </svg>
//         <span>{office?.location?.areaSqft} sqft</span>
//       </div>
//     </div>
//   )}

//   {category === "Warehouse" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Warehouse Type */}
//       <div className="flex items-center gap-2">
//         <span>Type: {office?.warehouseInfo?.type}</span>
//       </div>
//       {/* Capacity */}
//       <div className="flex items-center gap-2">
//         <span>Capacity: {office?.warehouseInfo?.capacity} tons</span>
//       </div>
//     </div>
//   )}

//   {category === "Retail" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Frontage */}
//       <div className="flex items-center gap-2">
//         <span>Frontage: {office?.retailInfo?.frontage} ft</span>
//       </div>
//       {/* Floor */}
//       <div className="flex items-center gap-2">
//         <span>Floor: {office?.retailInfo?.floor}</span>
//       </div>
//     </div>
//   )}
// </div>


// {/* ===== CENTER DETAILS Section ===== */}
// <div className="mt-6">
//   {/* Title with underline */}
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
//     CENTER DETAILS
//   </h2>

//   {/* General Details subtitle */}
//   <h3 className="text-[16px] font-semibold text-black mt-5">
//     General Details
//   </h3>

//   {/* Conditional Rendering for manage type */}
// {office?.type === "managed" && (
//   <div className="w-full h-[160px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Power And Backup</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.powerAndBackup || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}

// {office?.type === "office" && (
//   <div className="mt-2 w-full max-w-[890px] h-[160px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered1234</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Floor Size</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.floorSize || "N/A"}
//         </p>
//       </div>

// {/* Floors with expand/collapse */}
// <div className="relative">
//   <p className="text-white text-[14px] font-regular">Floors</p>
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="flex items-center gap-1 text-[15px] font-bold focus:outline-none"
//   >
//     {office?.generalInfo?.floors || "N/A"}
//     <span className="ml-2 text-[10px] text-white-800 underline">View Floors</span>
//     {showFloors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//   </button>

//   {/* Dropdown (overlapping) */}
//   {showFloors && (
//     <ul className="absolute left-0 mt-1 w-44 bg-[#3b7688] rounded-md shadow-lg z-50 p-2">
//       {(Array.isArray(office?.generalInfo?.floorsName)
//         ? office.generalInfo.floorsName
//         : (office?.generalInfo?.floorsName || "").split(",")
//       ).map((floor, index) => (
//         <li
//           key={index}
//           className="text-[12px] text-white py-1 px-2 hover:bg-[#2e5c6a] rounded"
//         >
//           {floor.trim()}
//         </li>
//       ))}
//     </ul>
//   )}
// </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}

// {office?.type === "co-working" && (
//   <div className="mt-2 w-full max-w-[890px] h-[190px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Desk Type</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.deskTypes || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Day Pass Price</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.dayPassPrice || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Reciption Hours</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.receptionHours || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Maintanance Charge</p>
//         <p className="text-[15px] font-bold">
//          {`Rs.${office.generalInfo.maintenanceCharges}/- ` || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Memebership Plans</p>
//         <p className="text-[15px] font-bold">
//          {office?.generalInfo?.membershipPlans || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Mem</p>
//         <p className="text-[15px] font-bold">
//          {office?.generalInfo?.membershipPlans || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Price</p>
//         <p className="text-[15px] font-bold">
//         {`Rs.${office.generalInfo.rentPrice}/- `|| "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}


// {/* ===== ABOUT SECTION ===== */}
// <div className="mt-6 w-full max-w-[890px] min-h-[250px] bg-slate-100 p-4 shadow-lg rounded-xl">
//   {/* Top notice bar */}
//   <div className="w-full h-[30px] flex items-center mb-4">
//     <p className="text-[16px] text-gray-800 font-bold">
//       Amenities
//     </p>
//   </div>

//   {/* Amenities Grid */}
//   <div className="grid grid-cols-3 gap-5 text-gray-900">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div key={key} className="flex items-center gap-2">
//             <Icon className="w-6 h-6 text-orange-500" />
//             <span className="text-[14px]">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom notice bar */}
//   <div className="w-full mt-5 h-[30px] flex items-center">
//     <p className="text-[10px] text-gray-500 font-medium">
//       Some amenities are limited and subject to availability at the workspace...
//     </p>
//   </div>
// </div>



// {/* ===== LOCATION DETAILS SECTION ===== */}
// <div className="mt-10 ">
//   {/* Title with underline */}
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
//     Location details
//   </h2>

//   {/* Address with icon */}
//   <div className="flex items-center gap-2 mt-5">
//     {/* Location Icon */}
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

//     <p className="text-[16px] text-orange-500 font-medium">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Placeholder Box */}
//   {/* <div className="mt-5 w-[890px] min-h-[400px] bg-black p-4">
//   </div> */}

//   {/* Placeholder Box */}
// {/* Placeholder Box */}
// <div className="mt-5 w-full max-w-[890px] min-h-[400px] bg-black p-4 flex gap-4">
//   {/* Left side: Google Maps */}
//   <div className="flex-1">
//   {office?.location?.link ? (
// <iframe
//   width="100%"
//   height="400"
//   style={{ border: 0 }}
//   loading="lazy"
//   allowFullScreen
//   referrerPolicy="no-referrer-when-downgrade"
//   src={
//     coords
//       ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//       : ""
//   }
// />
//   ) : (
//     <p className="text-white">No map link available</p>
//   )}
// </div>


//   {/* Right side (empty for now) */}
//   <div className="flex-1 bg-gray-800 rounded-md">
//   <div className="flex-1 p-3 text-xs text-white bg-gray-900 rounded-md">
//       {/* Toggle Header */}
//       <div className="flex gap-4 text-[14px] mb-3">
//         <button
//           className={`pb-1 ${activeTab === "transit" ? "border-b-2 border-orange-500" : ""}`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`pb-1 ${activeTab === "publicFacilities" ? "border-b-2 border-orange-500" : ""}`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-2">
//           {/* Metro */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaSubway size={14} />
//                 <span className="text-[10px]">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaBus size={14} />
//                 <span className="text-[10px]">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaTrain size={14} />
//                 <span className="text-[10px]">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaPlane size={14} />
//                 <span className="text-[10px]">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
// {activeTab === "publicFacilities" && (
//   <div className="space-y-2">
//     {/* Hospitals */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("hospitals")}
//       >
//         <div className="flex items-center gap-2">
//           <FaHospital size={14} />
//           <span className="text-[10px]">Hospitals</span>
//         </div>
//         {expanded === "hospitals" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "hospitals" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.hospitals?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>

//     {/* Restaurants */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("restaurants")}
//       >
//         <div className="flex items-center gap-2">
//           <FaUtensils size={14} />
//           <span className="text-[10px]">Restaurants</span>
//         </div>
//         {expanded === "restaurants" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "restaurants" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.restaurants?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>

//     {/* ATMs */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("atms")}
//       >
//         <div className="flex items-center gap-2">
//           <FaMoneyCheckAlt size={14} />
//           <span className="text-[10px]">ATMs</span>
//         </div>
//         {expanded === "atms" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "atms" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.atms?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   </div>
// )}
//     </div>
//   </div>
// </div>
// </div>

// </div>
//    </div>

//         {/* Right Side - User Details Card */}
//      {/* Right Side - User Details Card */}
// <div className="w-full lg:max-w-[443px] flex-shrink-0">
//   {/* Intro Text */}
//   <h2 className="mb-4 text-xs sm:text-sm text-[#374151] font-bold text-center leading-snug">
//     Upgrade your Space office with Vishwa and Team to get the best price and best deals for your office space.
//   </h2>

//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full min-h-[166px] gap-4">
//     {/* Left: Profile Image */}
//     <div className="w-24 h-24 p-1.5 rounded-full border-2 border-gray-300 overflow-hidden flex-shrink-0">
//       <img
//         src={user?.profileImage || "https://via.placeholder.com/94"}
//         alt={user?.fullName || "Handler"}
//         className="object-cover w-full h-full rounded-full"
//       />
//     </div>

//     {/* Right: Profile Details + Button */}
//     <div className="flex flex-col flex-1 items-center">
//       <div className="flex flex-col items-center space-y-1 text-center">
//         <h3 className="text-sm sm:text-base font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-xs sm:text-sm text-gray-600">{user?.mobile}</p>
//         <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
//       </div>

//       {isRestricted && (
//         <button
//           className="mt-3 w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true); // open login modal
//           }}
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       )}
//     </div>
//   </div>

//   {/* Info Box */}
//   <div className="flex justify-center mt-6">
//     <div className="w-full bg-gray-100 rounded p-3 text-center text-xs sm:text-sm text-gray-700 leading-snug">
//       Vishwa and team assisted <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore to move into their new office.
//     </div>
//   </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-3 gap-5 flex-wrap">
//     {[
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s",
//       "https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg",
//       "https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg",
//       "https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg",
//     ].map((logo, idx) => (
//       <img key={idx} src={logo} alt={`Logo${idx}`} className="w-8 h-8 object-contain" />
//     ))}
//   </div>

//   {/* Key Points Section */}
//   <div className="mt-4 text-xs sm:text-sm text-gray-700">
//     <p className="mb-2 font-bold">Explore workspace solutions with our expert guidance:</p>
//     <ul className="space-y-2">
//       {[
//         "Workspace selection & location strategy",
//         "Workspace tours",
//         "Layout design & customization assistance",
//         "Terms negotiations & deal signing",
//       ].map((point, idx) => (
//         <li key={idx} className="flex items-center gap-2">
//           <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
//           <span>{point}</span>
//         </li>
//       ))}
//     </ul>
//   </div>

//   {/* Button at bottom center */}
//   <div className="flex justify-center mt-4">
//     <button
//       onClick={handleContactQuoteClick}
//       className="w-56 h-8 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition"
//     >
//       Contact Quote
//     </button>
//   </div>
// </div>

//       </div>
      
//     </div>

//   )
// }

// export default ManagedOfficeDetail








//==================>>> Making responsive

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
// import OfficeHero from "../../components/OfficeHero";


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

// } from "lucide-react";
// import { FaSubway, FaBus, FaTrain, FaPlane, FaHospital, FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const ManagedOfficeDetail = ({ city = "Bangalore" }) => {
//      const { id } = useParams();
//       // const location = useLocation();
//       const searchParams = new URLSearchParams(location.search);
//       const category = searchParams.get("category") || "managed"; 
    
//       const [office, setOffice] = useState(null);
//       const [loading, setLoading] = useState(true);
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
//   return (

// <div className=" h-screen w-full">
// <OfficeHero office={{office}}/>
// {/* Breadcrumb Navigation */}
// <div className="px-6 mt-4">
//   <h1 className="text-[18px] font-bold text-orange-500 flex items-center gap-2">
//     <span className="cursor-pointer hover:underline">Home</span>
//     <span className="text-gray-500">{'>'}</span>

//     {/* Show type dynamically */}
//     {office?.type === "managed" && (
//       <span className="cursor-pointer hover:underline">Managed Space</span>
//     )}
//     {office?.type === "office" && (
//       <span className="cursor-pointer hover:underline">Office Space</span>
//     )}
//     {office?.type === "co-working" && (
//       <span className="cursor-pointer hover:underline">Co Working Space</span>
//     )}

//     <span className="text-gray-500">{'>'}</span>
//     <span className="text-orange">{office?.buildingName}</span>
//   </h1>
// </div>
//       {/* Left + Right Side Section */}
// <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Managed Office all data section */}
//  <div className="flex flex-col gap- w-[887px]">
//    {/* Office Detail Section */}
//    <div className="mt-[2px] flex flex-col items-start space-y-[5px]">
//   {/* Building Name */}
//   <h1 className="text-[25px] font-bold text-gray-900">
//     {office?.buildingName} ({category})
//   </h1>

//   {/* Location with icon */}
//   <div className="flex items-center gap-2 text-[16px] text-gray-700">
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
//         strokeWidth={2}
//         d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z"
//       />
//     </svg>
//     <span>{office?.location?.locationOfProperty}</span>
//   </div>

//   {/* Category Based Info */}
//   {category === "Office" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Furnishing Level */}
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 text-orange-500"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//         <span>{office?.generalInfo?.furnishingLevel}</span>
//       </div>

//       {/* Area Sqft */}
//       <div className="flex items-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 text-orange-500"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
//         </svg>
//         <span>{office?.location?.areaSqft} sqft</span>
//       </div>
//     </div>
//   )}

//   {category === "Warehouse" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Warehouse Type */}
//       <div className="flex items-center gap-2">
//         <span>Type: {office?.warehouseInfo?.type}</span>
//       </div>
//       {/* Capacity */}
//       <div className="flex items-center gap-2">
//         <span>Capacity: {office?.warehouseInfo?.capacity} tons</span>
//       </div>
//     </div>
//   )}

//   {category === "Retail" && (
//     <div className="flex items-center gap-8 text-[16px] text-gray-700">
//       {/* Frontage */}
//       <div className="flex items-center gap-2">
//         <span>Frontage: {office?.retailInfo?.frontage} ft</span>
//       </div>
//       {/* Floor */}
//       <div className="flex items-center gap-2">
//         <span>Floor: {office?.retailInfo?.floor}</span>
//       </div>
//     </div>
//   )}
// </div>


// {/* ===== CENTER DETAILS Section ===== */}
// <div className="mt-6">
//   {/* Title with underline */}
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
//     CENTER DETAILS
//   </h2>

//   {/* General Details subtitle */}
//   <h3 className="text-[16px] font-semibold text-black mt-5">
//     General Details
//   </h3>

//   {/* Conditional Rendering for manage type */}
// {office?.type === "managed" && (
//   <div className="mt-2 w-[890px] h-[160px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Power And Backup</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.powerAndBackup || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}

// {office?.type === "office" && (
//   <div className="mt-2 w-[890px] h-[160px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered1234</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Floor Size</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.floorSize || "N/A"}
//         </p>
//       </div>

// {/* Floors with expand/collapse */}
// <div className="relative">
//   <p className="text-white text-[14px] font-regular">Floors</p>
//   <button
//     onClick={() => setShowFloors(!showFloors)}
//     className="flex items-center gap-1 text-[15px] font-bold focus:outline-none"
//   >
//     {office?.generalInfo?.floors || "N/A"}
//     <span className="ml-2 text-[10px] text-white-800 underline">View Floors</span>
//     {showFloors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//   </button>

//   {/* Dropdown (overlapping) */}
//   {showFloors && (
//     <ul className="absolute left-0 mt-1 w-44 bg-[#3b7688] rounded-md shadow-lg z-50 p-2">
//       {(Array.isArray(office?.generalInfo?.floorsName)
//         ? office.generalInfo.floorsName
//         : (office?.generalInfo?.floorsName || "").split(",")
//       ).map((floor, index) => (
//         <li
//           key={index}
//           className="text-[12px] text-white py-1 px-2 hover:bg-[#2e5c6a] rounded"
//         >
//           {floor.trim()}
//         </li>
//       ))}
//     </ul>
//   )}
// </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}

// {office?.type === "co-working" && (
//   <div className="mt-2 w-[890px] h-[190px] bg-[#5290A3] p-4">
//     {/* Two rows of details */}
//     <div className="grid grid-cols-4 text-white gap-x-6 gap-y-4">
//       {/* Row 1 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Seater Offered</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.seaterOffered || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Per Seat</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.rentPerSeat
//             ? `Rs.${office.generalInfo.rentPerSeat}/- Per seat`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Desk Type</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.deskTypes || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Lock In Period</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.lockInPeriod || "N/A"}
//         </p>
//       </div>

//       {/* Row 2 */}
//       <div>
//         <p className="text-white text-[14px] font-regular">Furnishing Level</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.furnishingLevel || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">OC Availability</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.ocAvailability === true
//             ? "Yes"
//             : office?.generalInfo?.ocAvailability === false
//             ? "No"
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Day Pass Price</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.dayPassPrice || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Reciption Hours</p>
//         <p className="text-[15px] font-bold">
//           {office?.generalInfo?.receptionHours || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Maintanance Charge</p>
//         <p className="text-[15px] font-bold">
//          {`Rs.${office.generalInfo.maintenanceCharges}/- ` || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Memebership Plans</p>
//         <p className="text-[15px] font-bold">
//          {office?.generalInfo?.membershipPlans || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Mem</p>
//         <p className="text-[15px] font-bold">
//          {office?.generalInfo?.membershipPlans || "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-white text-[14px] font-regular">Rent Price</p>
//         <p className="text-[15px] font-bold">
//         {`Rs.${office.generalInfo.rentPrice}/- `|| "N/A"}
//         </p>
//       </div>
//     </div>
//   </div>
// )}


// {/* ===== ABOUT SECTION ===== */}
// <div className="mt-6 w-[890px] min-h-[250px] bg-slate-100 p-4 shadow-lg rounded-xl">
//   {/* Top notice bar */}
//   <div className="w-full h-[30px] flex items-center mb-4">
//     <p className="text-[16px] text-gray-800 font-bold">
//       Amenities
//     </p>
//   </div>

//   {/* Amenities Grid */}
//   <div className="grid grid-cols-3 gap-5 text-gray-900">
//     {Object.entries(amenitiesIcons).map(([key, { icon: Icon, label }]) => {
//       const value = office?.amenities?.[key];
//       if (value === true || value === "Yes") {
//         return (
//           <div key={key} className="flex items-center gap-2">
//             <Icon className="w-6 h-6 text-orange-500" />
//             <span className="text-[14px]">{label}</span>
//           </div>
//         );
//       }
//       return null;
//     })}
//   </div>

//   {/* Bottom notice bar */}
//   <div className="w-full mt-5 h-[30px] flex items-center">
//     <p className="text-[10px] text-gray-500 font-medium">
//       Some amenities are limited and subject to availability at the workspace...
//     </p>
//   </div>
// </div>



// {/* ===== LOCATION DETAILS SECTION ===== */}
// <div className="mt-10">
//   {/* Title with underline */}
//   <h2 className="text-orange-500 text-[20px] font-bold border-b-2 border-black inline-block pb-1">
//     Location details
//   </h2>

//   {/* Address with icon */}
//   <div className="flex items-center gap-2 mt-5">
//     {/* Location Icon */}
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

//     <p className="text-[16px] text-orange-500 font-medium">
//       {office?.location?.address}
//     </p>
//   </div>

//   {/* Placeholder Box */}
//   {/* <div className="mt-5 w-[890px] min-h-[400px] bg-black p-4">
//   </div> */}

//   {/* Placeholder Box */}
// {/* Placeholder Box */}
// <div className="mt-5 w-[890px] min-h-[400px] bg-black p-4 flex gap-4">
//   {/* Left side: Google Maps */}
//   <div className="flex-1">
//   {office?.location?.link ? (
// <iframe
//   width="100%"
//   height="400"
//   style={{ border: 0 }}
//   loading="lazy"
//   allowFullScreen
//   referrerPolicy="no-referrer-when-downgrade"
//   src={
//     coords
//       ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyA37ZueJby7P9oCrPv_rfJoSo69clN3xW8&q=${coords}`
//       : ""
//   }
// />
//   ) : (
//     <p className="text-white">No map link available</p>
//   )}
// </div>


//   {/* Right side (empty for now) */}
//   <div className="flex-1 bg-gray-800 rounded-md">
//   <div className="flex-1 p-3 text-xs text-white bg-gray-900 rounded-md">
//       {/* Toggle Header */}
//       <div className="flex gap-4 text-[14px] mb-3">
//         <button
//           className={`pb-1 ${activeTab === "transit" ? "border-b-2 border-orange-500" : ""}`}
//           onClick={() => setActiveTab("transit")}
//         >
//           Transit
//         </button>
//         <button
//           className={`pb-1 ${activeTab === "publicFacilities" ? "border-b-2 border-orange-500" : ""}`}
//           onClick={() => setActiveTab("publicFacilities")}
//         >
//           Public Facilities
//         </button>
//       </div>

//       {/* Content */}
//       {activeTab === "transit" && (
//         <div className="space-y-2">
//           {/* Metro */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("metro")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaSubway size={14} />
//                 <span className="text-[10px]">Metro Stations</span>
//               </div>
//               {expanded === "metro" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "metro" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.metroStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Bus */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("bus")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaBus size={14} />
//                 <span className="text-[10px]">Bus Stations</span>
//               </div>
//               {expanded === "bus" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "bus" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.busStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Train */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("train")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaTrain size={14} />
//                 <span className="text-[10px]">Train Stations</span>
//               </div>
//               {expanded === "train" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "train" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.trainStations?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Airports */}
//           <div>
//             <div
//               className="flex items-center justify-between text-orange-400 cursor-pointer"
//               onClick={() => toggleExpand("airports")}
//             >
//               <div className="flex items-center gap-2">
//                 <FaPlane size={14} />
//                 <span className="text-[10px]">Airports</span>
//               </div>
//               {expanded === "airports" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//             {expanded === "airports" && (
//               <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//                 {office?.transit?.airports?.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
// {activeTab === "publicFacilities" && (
//   <div className="space-y-2">
//     {/* Hospitals */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("hospitals")}
//       >
//         <div className="flex items-center gap-2">
//           <FaHospital size={14} />
//           <span className="text-[10px]">Hospitals</span>
//         </div>
//         {expanded === "hospitals" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "hospitals" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.hospitals?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>

//     {/* Restaurants */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("restaurants")}
//       >
//         <div className="flex items-center gap-2">
//           <FaUtensils size={14} />
//           <span className="text-[10px]">Restaurants</span>
//         </div>
//         {expanded === "restaurants" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "restaurants" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.restaurants?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>

//     {/* ATMs */}
//     <div>
//       <div
//         className="flex items-center justify-between text-orange-400 cursor-pointer"
//         onClick={() => toggleExpand("atms")}
//       >
//         <div className="flex items-center gap-2">
//           <FaMoneyCheckAlt size={14} />
//           <span className="text-[10px]">ATMs</span>
//         </div>
//         {expanded === "atms" ? (
//           <ChevronUp size={14} />
//         ) : (
//           <ChevronDown size={14} />
//         )}
//       </div>
//       {expanded === "atms" && (
//         <ul className="ml-6 mt-1 space-y-1 text-[10px] text-gray-300">
//           {office?.publicFacilities?.atms?.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   </div>
// )}
//     </div>
//   </div>
// </div>



// </div>

// </div>
//    </div>

//         {/* Right Side - User Details Card */}
//        <div className="sticky top-26 z-30 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Intro Text */}
//   <h2 className=" mb-4 text-[12px] text-[#374151] font-bold text-center">
//   Upgrade your Space office with Vishwa and Team to get the best price and best deals for your office space.
// </h2>

//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     {/* Left: Profile Image */}
//     <div className="w-[94px] h-[94px] p-[5px] rounded-full border-2 border-gray-300 overflow-hidden">
//       <img
//         src={user?.profileImage || "https://via.placeholder.com/94"}
//         alt={user?.fullName || "Handler"}
//         className="object-cover w-full h-full rounded-full"
//       />
//     </div>

//     {/* Right: Profile Details + Button */}
//     <div className="flex flex-col items-center">
//       <div className="flex flex-col space-y-1 ml-[70px]">
//         <h3 className="text-[15px] font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-[13px] text-gray-600">{user?.mobile}</p>
//         <p className="text-[13px] text-gray-600">{user?.email}</p>
//       </div>

//       {/* Button below profile details */}
//       {isRestricted && (
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//   onClick={(e) => {
//     e.stopPropagation();
//     setIsModalOpen(true); // open login modal
//   }}
// >
// Contact {user?.fullName?.split(" ")[0]}
// </button>
//     )}
//     </div>
//   </div>

 
// {/* Info Box */}
// <div className="flex justify-center mt-6">
//   <div className="w-[415px] h-[52px] bg-gray-100 rounded p-3 text-center text-[12px] text-gray-700 leading-snug">
//     Vishwa and team assisted <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore to move into their new office.
//   </div>
// </div>
//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[20px]">
//   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s" alt="Logo1" className="w-[30px] h-[30px]" />
//   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s" alt="Logo2" className="w-[30px] h-[30px]" />
//   <img src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg" alt="Logo3" className="w-[30px] h-[30px]" />
//   <img src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg" alt="Logo4" className="w-[30px] h-[30px]" />
//   <img src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg" alt="Logo5" className="w-[30px] h-[30px]" />
// </div>

// {/* Key Points Section */}
// <div className="mt-3 text-[12px] text-gray-700">
//   <p className="mb-2 font-bold">
//     Explore workspace solutions with our expert guidance:
//   </p>
//   <ul className="space-y-2">
//     <li className="flex items-center gap-2">
//       <Check className="w-4 h-4 text-green-600" />
//       <span>Workspace selection & location strategy</span>
//     </li>
//     <li className="flex items-center gap-2">
//       <Check className="w-4 h-4 text-green-600" />
//       <span>Workspace tours</span>
//     </li>
//     <li className="flex items-center gap-2">
//       <Check className="w-4 h-4 text-green-600" />
//       <span>Layout design & customization assistance</span>
//     </li>
//     <li className="flex items-center gap-2">
//       <Check className="w-4 h-4 text-green-600" />
//       <span>Terms negotiations & deal signing</span>
//     </li>
//   </ul>
//   {/* Button at bottom center */}
//  {/* Button at bottom center */}
//  <div className="flex justify-center mt-3">
//         <button
//           onClick={handleContactQuoteClick}
//           className="w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
//         >
//           Contact Quote
//         </button>
//       </div>
//     {/* Modal */}
//     {isModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
//     <div className="bg-white rounded-lg p-6 w-[350px] relative z-[10000]">
//       <h2 className="mb-4 text-lg font-bold">Enter your details</h2>
//       <form onSubmit={handleFormSubmit}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={formData.fullName}
//           onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//           className="w-full p-2 mb-2 border rounded"
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="w-full p-2 mb-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           placeholder="Mobile"
//           value={formData.mobile}
//           onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//           className="w-full p-2 mb-2 border rounded"
//           required
//         />
//         <div className="flex justify-end mt-3">
//           <button
//             type="button"
//             onClick={() => setIsModalOpen(false)}
//             className="px-4 py-2 mr-2 bg-gray-300 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

// {/* Lead Modal */}
// {isLeadModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
//     <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative z-[10000]">
//       <h2 className="mb-4 text-lg font-bold">Send Your Enquiry</h2>
//       <form onSubmit={handleLeadSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your message"
//           value={leadMessage}
//           onChange={(e) => setLeadMessage(e.target.value)}
//           className="w-full p-2 mb-4 border rounded"
//           required
//         />
//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             onClick={() => setIsLeadModalOpen(false)}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}
// </div>
//        </div>
//       </div>
      
//     </div>

//   )
// }

// export default ManagedOfficeDetail









//=============>>> Old one basic dev





// export default function ManagedOfficeDetail() {
//     return (
//       <div className="h-screen flex items-center justify-center bg-blue-100">
//         <h1 className="text-4xl font-bold text-blue-800">
//           Desktop Menu Page 🍽️
//         </h1>
//       </div>
//     );
//   }
  