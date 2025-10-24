import React, { useState, useEffect, useRef } from "react";
import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
import { getUserDataById } from "../../api/services/userService";
import { Link } from "react-router-dom"; 
import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
import Cookies from "js-cookie";
import { postVisitorData, postLeadData } from "../../api/services/visitorService";
import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GroupsScroller from "../../components/GroupsScroller";
import { mockOfficeData } from "../../data/mockOfficeData";
import WishlistSidebar from "../../components/WishlistSidebar";
import MobileAuthModal from './mobileComponents/MobileAuthModal';
import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
import { useLocation } from "react-router-dom";   
import MobileFilters from "./mobileComponents/MobileFilters";
import { FaHome, FaCompass, FaInfoCircle } from "react-icons/fa";
import MobileBottomNav from "./mobileComponents/MobileBottomNav";


const MenuPage = () => {
  const location = useLocation();
  const currentPath = location.pathname; //

  const [isOpen, setIsOpen] = useState(false);
    const incomingFilters = location.state?.filters || {};
  
  
    const [allData, setAllData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const scrollContainerRef = useRef(null);
    // const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [officeId, setOfficeId] = useState(null);
    // const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("managed");
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [isSticky, setIsSticky] = useState(false);
    const filterRef = useRef(null);
  //save Space through card
    const [savedSpaces, setSavedSpaces] = useState([]);
  
    const [revealedCards, setRevealedCards] = useState({});
    
  // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
  const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
  const [masterZones, setMasterZones] = useState({});
  const [masterLocations, setMasterLocations] = useState({});
  
  const [allCities, setAllCities] = useState([]);
  
  const visitorId = Cookies.get("visitorId");
  // alert(visitorId)
  const isRestricted = visitorId;
  
  
  const [allZones, setAllZones] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  
    
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
  
   //pagination states
   const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [total, setTotal] = useState(0);


      // 🔹 separate state to hold filters coming from Home
      const [externalFilters, setExternalFilters] = useState(null);
      console.log("******************************* incoming filters",incomingFilters)
    // 👇 initialize filters with incomingFilters right away
  const initialNormalized = (() => {
    const raw = location.state?.filters || {};
    const facility =
      (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
    return {
      city: (raw.city || "").toString().trim(),
      zone: (raw.zone || "").toString().trim(),
      location: (raw.location || raw.locationOfProperty || "").toString().trim(),
      facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
      furnishingLevel: "",
      seatingCapacity: "",
      priceRange: "",
      priceRangeDisplay: "",
      areaSqft: "",
    };
  })();
  
  
  // const [filters, setFilters] = useState(initialNormalized);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadMessage, setLeadMessage] = useState("");
      const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
  
  //new code
  const queryParams = new URLSearchParams(location.search);
  const initialFilters = {};
  queryParams.forEach((value, key) => {
    initialFilters[key] = value;
  });
  
  const [filters, setFilters] = useState({
    city: initialFilters.city || "",
    zone: initialFilters.zone || "",
    locationOfProperty: initialFilters.locationOfProperty || "",
    category: initialFilters.category || "managed",
    priceRange: initialFilters.priceRange || "",
    areaSqft: initialFilters.areaSqft || "",
    seatingCapacity: initialFilters.seatingCapacity || "",
    furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
  });
  
  
   const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [locations, setLocations] = useState([]);
  
    const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
    const [otp, setOtp] = useState("");
    const [isNewVisitor, setIsNewVisitor] = useState(false);
    const [authError, setAuthError] = useState(""); // For invalid OTP
    const [visitorEmail, setVisitorEmail] = useState(""); // Email input
    const [visitorName, setVisitorName] = useState(""); // Only if new visitor
        const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

        const priceOptions = [
          { display: "Under ₹10,000", value: "1000-10000" },
          { display: "₹10,000 - ₹50,000", value: "10000-50000" },
          { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
        ];

    const areaOptions = [
      { display: "300 - 500 sqft", value: "300-500" },
      { display: "500 - 900 sqft", value: "500-900" },
      { display: "1200 - 2000 sqft", value: "1200-2000" },
    ];
  
    const seatingOptions = [
      { display: "10 - 50", value: "10-50" },
      { display: "50 - 100", value: "50-100" },
      { display: "100 - 500", value: "100-500" },
      { display: "500 - 1000", value: "500-1000" },
      { display: "1000 - 2000", value: "1000-2000" },
    ];
  
  // API toggle logic
    const getApiByCategory = (category) => {
      switch (category) {
        case "office":
          return searchOfficeSpaces;
        case "co-working":
          return searchCoWorkingSpaceData;
        default:
          return searchManagedOffices;
      }
    };

   


    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
    
        const { category, ...apiFilters } = filters;
        const cleanFilters = Object.fromEntries(
          Object.entries(apiFilters).filter(([_, v]) => v !== "")
        );
    
        const apiCall = getApiByCategory(filters.category);
        const result = await apiCall(page, pageSize, cleanFilters);
    
        // ✅ Update state with proper structure from service
        setData(result.data || []);
        setTotal(result.total || 0);
        setLoading(false);
      };
    
      fetchData();
    }, [filters, page,pageSize]);
    
   
    const handleSelectCity = (city) => {
      setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
      const cityZones = [
        ...new Set(
          allData
            .filter((item) => item.location?.city === city)
            .map((item) => item.location?.zone)
            .filter(Boolean)
        ),
      ];
      setZones(cityZones);
      setLocations([]);
    };

    
    const handleSelectZone = (zone) => {
      setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
      const zoneLocations = [
        ...new Set(
          allData
            .filter(
              (item) =>
                item.location?.city === filters.city &&
                item.location?.zone === zone
            )
            .map((item) => item.location?.locationOfProperty)
            .filter(Boolean)
        ),
      ];
      setLocations(zoneLocations);
    };
    
    const handleSelectLocation = (loc) => {
      setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
    };
    
   

    useEffect(() => {
      const fetchAll = async () => {
        try {
          const result = await searchManagedOffices(1, 100);
          const list = result.data || []; // ✅ ensure array
    
          setAllData(list);
    
          if (list.length > 0) {
            setUserId(list[0].assigned_agent);
            setOfficeId(list[0]._id);
          }
    
          console.log("✅ All managed offices:", list);
    
          const uniqueCities = [
            ...new Set(list.map((item) => item.location?.city).filter(Boolean)),
          ];
          setCities(uniqueCities);
        } catch (err) {
          console.error("Error fetching all managed offices:", err);
        }
      };
    
      fetchAll();
    }, []);
    
  
    // Update dependent dropdowns
    useEffect(() => {
      if (filters.city) {
        const cityZones = [
          ...new Set(
            allData
              .filter((item) => item.location?.city === filters.city)
              .map((item) => item.location?.zone)
              .filter(Boolean)
          ),
        ];
        setZones(cityZones);
      } else {
        setZones([]);
      }
  
      if (filters.city && filters.zone) {
        const zoneLocations = [
          ...new Set(
            allData
              .filter(
                (item) =>
                  item.location?.city === filters.city &&
                  item.location?.zone === filters.zone
              )
              .map((item) => item.location?.locationOfProperty)
              .filter(Boolean)
          ),
        ];
        setLocations(zoneLocations);
      } else {
        setLocations([]);
      }
    }, [filters.city, filters.zone, allData]);
  
    // Fetch data when filters change
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {

          const { category, ...apiFilters } = filters;
          const cleanFilters = Object.fromEntries(
            Object.entries(apiFilters).filter(([_, v]) => v !== "")
          );
          
          const apiCall = getApiByCategory(filters.category);
          const result = await apiCall(page, pageSize, cleanFilters);
      
          const safeData = Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
            ? result.data
            : [];
      
          setData(safeData);
          setTotal(result?.total || safeData.length);
        } catch (err) {
          console.error("Fetch error:", err);
          setData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData()
    }, [filters]);
  
    const handleFilterChange = (key, value) => {
      if (key === "city") handleSelectCity(value);
      else if (key === "zone") handleSelectZone(value);
      else if (key === "locationOfProperty") handleSelectLocation(value);
      else setFilters((prev) => ({ ...prev, [key]: value }));
    
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
      ).toString();
      navigate(query ? `/menu?${query}` : `/menu`);
    };
    
   
  console.log("OOOOOOOOFice",officeId)
      
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
     // helper to update filters + trigger search
  const updateFilters = (newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      // 🔥 call API immediately with updated filters
      handleSearch(updated);
      return updated;
    });
  };
  
     const isLoggedIn = false;
  
     const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
     useEffect(() => {
      const updateButtonVisibility = () => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          setShowLeftButton(scrollLeft > 0);
          setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
        }
      };
  
      const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
      };
  
  
      ////UI related Functions
      // Initial check
      updateButtonVisibility();
      
      // Add event listeners
      window.addEventListener('resize', updateButtonVisibility);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
      }
    
      // Cleanup
      return () => {
        window.removeEventListener('resize', updateButtonVisibility);
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
        }
      };
    }, []);
    useEffect(() => {
      const onScroll = () => {
        if (!filterRef.current) return;
        const { top } = filterRef.current.getBoundingClientRect();
       setIsSticky(top <= 0);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
     }, []);
     
    const handlePrev = (cardIndex, totalImages) => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardIndex]:
          prev[cardIndex] === 0
            ? totalImages - 1
            : (prev[cardIndex] || 0) - 1,
      }));
    };
  
    const handleNext = (cardIndex, totalImages) => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [cardIndex]:
          prev[cardIndex] === totalImages - 1
            ? 0
            : (prev[cardIndex] || 0) + 1,
      }));
    };
  
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
  
    // Toggle save/remove
    const handleSave = async (propertyId) => {
      try {
        if (savedSpaces.includes(propertyId)) {
          // remove
          await deleteWishlistData({ visitorId, propertyId });
          setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
        } else {
          // add
          await postWishlistData({ visitorId, propertyId });
          setSavedSpaces((prev) => [...prev, propertyId]);
        }
      } catch (err) {
        console.error("Error updating wishlist:", err);
      }
    };
  
    const handleReveal = (index, isRestricted) => {
      if (isRestricted) return; // don’t allow reveal if restricted
      setRevealedCards((prev) => ({ ...prev, [index]: true }));
    };
    
    const toggleDropdown = (dropdown) => {
      setOpenDropdown(openDropdown === dropdown ? null : dropdown);
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

  const handleCardClick = (officeId) => {
    // Pass city and filtered list to Detail Page via state
    navigate(`/office/${officeId}?category=${filters.category}`, {
      state: {
        city: filters.city,
        relatedProperties: data, // only current filtered list
      },
    });
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
 
  const handleContactQuoteClick = () => {
    setIsProfileModalOpen(false)
    const visitorId = Cookies.get("visitorId");
    if (visitorId) {
      setIsLeadModalOpen(true); // existing lead modal
    } else {
      setAuthStep("email");
      setAuthError("");
      setVisitorEmail("");
      setVisitorName("");
      setOtp("");
      setIsAuthModalOpen(true); // <-- use this state
    }
  };

  
  return (
    <section className="relative w-full min-h-screen bg-white text-white">
      <div
        className="relative w-full h-[300px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
        }}
      >
        {/* Navbar */}
        <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-white glow-text drop-shadow-lg">
      FidWorx
     </h1>
  
          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <WishlistSidebar
  visitorId={visitorIdState}
  onLoginRequired={() => setIsAuthModalOpen(true)}
  onLogout={() => {
    setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
  }}
/>
  
            {/* Hamburger */}

          </div>
        </div>
  
        {/* Mobile Drawer Menu */}
    
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
  
        {/* Banner Title */}
        <div className="relative flex justify-center items-center h-full text-center px-4">
          <h1 className="pt-16  text-2xl font-bold text-white">
            Find Your Requirement{" "}
            <span className=" mt-2 text-orange-500">Here</span>
          </h1>
        </div>
      </div>
  
{/* Overlapping Section with Toggle Buttons (Mobile) */}
<div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
  {/* Button Group */}
  <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
    {[
      { label: "Managed", value: "managed" },
      { label: "Office", value: "office" },
      { label: "Co-Working", value: "co-working" },
    ].map((cat, idx) => (
      <button
        key={cat.value}
        onClick={() => handleFilterChange("category", cat.value)}
        className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
          filters.category === cat.value
            ? "bg-orange-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
      >
        {cat.label}
      </button>
    ))}
  </div>
</div>
{/* Mobile Filters */}
<div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
  <MobileFilters
    filters={filters}
    handleFilterChange={handleFilterChange}
    cities={cities}
    zones={zones}
    locations={locations}
    priceOptions={priceOptions}
    areaOptions={areaOptions}
    seatingOptions={seatingOptions}
  />
</div>
<button
    onClick={() => {
      setFilters({
        city: "",
        zone: "",
        locationOfProperty: "",
        category: "managed",
        priceRange: "",
        areaSqft: "",
        seatingCapacity: "",
        furnishingLevel: "",
      });
      setPage(1);
    }}
    className="mt-2 px-4 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full shadow-sm"
  >
    Reset Filters
  </button>

  
{/* Mobile Cards Section */}
<div className="mt-6 px-4 space-y-6">

  {loading ? (
    <div className="text-center py-10 text-gray-500">Loading...</div>
  ) : data.length === 0 ? (
    <div className="text-center py-10 text-gray-500 text-lg font-medium">
      No data found.
    </div>
  ) : (
    data.map((office, index) => {
      const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
      const isRestricted = !visitorId && index >= 3;


    return (
      <div
        key={office._id}
        className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
        onClick={() => handleCardClick(office._id)}
      >
        {/* Restricted Overlay */}
        {/* {isRestricted && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            <button onClick={()=>{handleContactQuoteClick()}}  className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
              Please Login to View
            </button>
          </div>
        )} */}

{isRestricted && (
  <div
    className="absolute inset-0 flex items-center justify-center bg-black/60 z-30"
    onClick={(e) => {
      e.stopPropagation();
      setIsModalOpen(true);
    }}
  >
    <button
      onClick={() => handleContactQuoteClick()}
      className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded"
    >
      Please Login to View
    </button>
  </div>
)}


        {/* Image */}
        <div
          className="relative w-full h-48"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImg}
            alt={office.buildingName}
            className="object-cover w-full h-full"
          />
          {office.images?.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev(index, office.images.length);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext(index, office.images.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4 w-full relative">
          {/* Save */}
          <div
            className="absolute top-4 right-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleSave(office._id)}
              className={`w-7 h-7 flex items-center justify-center rounded ${
                savedSpaces.includes(office._id)
                  ? "bg-black text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              ★
            </button>
            {savedSpaces.includes(office._id) && (
              <span className="text-orange-500 text-[10px]">Saved</span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
          <p className="text-sm text-[#16607B]">{office.type} Space</p>
          <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
            <MapPin size={12} className="text-orange-500" />
            {office.location?.address}, {office.location?.city}
          </p>

          {/* Info Scroller */}
            {/* Blue Box */}
            <div className="mt-3 mx-[-4px]">
  <GroupsScroller
    className="w-full" // ✅ ensures scroller matches card width
    groups={[
      // Group 1
      <>
        <div className="flex flex-col w-[111px] items-center justify-center">
          <p className="text-[13px] text-white font-regular">Seater Offered</p>
          <span className="text-[13px] text-white font-bold">
            {office.generalInfo.seaterOffered}
          </span>
        </div>
               <div className="flex flex-col w-[111px] items-center justify-center">
             <p className="text-[13px] text-white font-regular">Floor Size</p>
             {(() => {
               const floorSize = office?.generalInfo?.floorSize || "";
               if (!floorSize) {
                 return <span className="text-[14px] text-white text-center">N/A</span>;
               }
               const [value, unit] = floorSize.split(/ (.+)/);
               return (
                 <span className="text-[14px] text-white text-center">
                   <span className="font-bold">{value}</span>{" "}
                   <span className="text-[12px] font-regular">{unit}</span>
                 </span>
               );
             })()}
           </div>
           
           <div className="flex flex-col w-[111px] items-center justify-center">
             <p className="text-[13px] text-white font-regular">Built-Up Area</p>
             {(() => {
               const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
               if (!builtUp) {
                 return <span className="text-[14px] text-white text-center">N/A</span>;
               }
               const [value, unit] = builtUp.split(/ (.+)/);
               return (
                 <span className="text-center text-white">
                   <span className="text-[14px] font-bold">{value}</span>{" "}
                   <span className="text-[12px] font-regular">{unit}</span>
                 </span>
               );
             })()}
           </div>
           
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Lock-in</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.generalInfo.lockInPeriod}
                 </span>
               </div>
             </>,
           
             // Group 2
             <>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Floors</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.generalInfo.floors}
                 </span>
               </div>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Furnishing</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.generalInfo.furnishingLevel}
                 </span>
               </div>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Air Conditioning</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.amenities?.airConditioners ? "Yes" : "No"}
                 </span>
               </div>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Parking</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.amenities?.parking ? "Yes" : "No"}
                 </span>
               </div>
             </>,
           
             // Group 3
             <>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Security24x7</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.amenities?.security24x7 ? "Yes" : "No"}
                 </span>
               </div>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Wifi</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.amenities?.wifi ? "Yes" : "No"}
                 </span>
               </div>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-regular">Washrooms</p>
                 <span className="text-[14px] text-white font-bold">
                   {office.amenities?.washrooms ? "Yes" : "No"}
                 </span>
               </div>
               <div className="flex flex-col w-[111px] items-center justify-center">
                 <p className="text-[13px] text-white font-bold underline cursor-pointer">
                   View More
                 </p>
               </div>
             </>,
                         ]}
                         
                       />
           </div>
          {/* Price & CTA */}
          <div className="mt-[-15px]">
            <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
            <p className="text-lg font-bold text-gray-800">
            ₹{office.generalInfo?.rentPerSeat}
              <span className="text-xs text-[#16607B]"> / Seat</span>
            </p>
              {/* <p className="text-lg font-bold text-gray-800">
            {office.generalInfo?.rentPerSeat}
              <span className="text-xs text-[#16607B]"> / Seat</span>
            </p> */}
            <button
              // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
                className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
              onClick={(e) => {
                e.stopPropagation();
                handleContactQuoteClick();
              }}
            >
              Get Best Price
            </button>
          </div>
        </div>
      </div>
    );
  })
)}
</div>
{/* Mobile Floating Profile Button */}
<div className="fixed bottom-20 right-6 z-50 md:hidden">
  <button
    onClick={() => setIsProfileModalOpen(true)}
    className="w-14 h-14 rounded-full border-2 border-orange-500 overflow-hidden shadow-lg"
  >
    <img
      src={user?.profileImage || "https://via.placeholder.com/94"}
      alt={user?.fullName || "Handler"}
      className="object-cover w-full h-full"
    />
  </button>
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
          onClick={handleContactQuoteClick}
          className="mt-3 w-full py-2 bg-orange-500 text-white font-bold text-[10px] rounded hover:bg-orange-600 transition"
        >
          Contact123 {user?.fullName?.split(" ")[0]}
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
        {/* ✅ Mobile Pagination */}
      
  {/* Pagination */}
  <div className="flex justify-center mt-6 mb-6">
  <div className="flex items-center gap-3 bg-white px-3 py-2 shadow-md rounded-full">
    {/* Prev */}
    <button
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      disabled={page === 1}
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        page === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      Prev
    </button>

    {/* Page */}
    <span className="text-gray-700 text-sm font-medium">
      {page} / {Math.ceil(total / pageSize) || 1}
    </span>

    {/* Next */}
    <button
      onClick={() => setPage((p) => p + 1)}
      disabled={page * pageSize >= total}
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        page * pageSize >= total
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      Next
    </button>

    {/* Reset */}
    <button
      onClick={() => {
        setFilters({
          city: "",
          zone: "",
          locationOfProperty: "",
          category: "managed",
          priceRange: "",
          areaSqft: "",
          seatingCapacity: "",
          furnishingLevel: "",
        });
        setPage(1);
      }}
      className="px-3 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
    >
      Reset
    </button>
  </div>
</div>

<div className="flex justify-center mt-6 mb-6">
<h1>Fidelituscorp site have the all right </h1>
</div>
 <MobileBottomNav/>
    </section>
  ); 
}
export default MenuPage








//====>> fixin the seatch issue 


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";
// import { FaHome, FaCompass, FaInfoCircle } from "react-icons/fa";
// import MobileBottomNav from "./mobileComponents/MobileBottomNav";


// const MenuPage = () => {
//   const location = useLocation();
//   const currentPath = location.pathname; //

//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
//    //pagination states
//    const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [total, setTotal] = useState(0);


//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
//       const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
//     const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
//     const [otp, setOtp] = useState("");
//     const [isNewVisitor, setIsNewVisitor] = useState(false);
//     const [authError, setAuthError] = useState(""); // For invalid OTP
//     const [visitorEmail, setVisitorEmail] = useState(""); // Email input
//     const [visitorName, setVisitorName] = useState(""); // Only if new visitor
//         const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     // useEffect(() => {
//     //   if (!filters.category) return;
    
//     //   const fetchData = async () => {
//     //     const apiFn = getApiByCategory(filters.category);
//     //     const result = await apiFn(1, 100);
//     //     setAllData(result);
    
//     //     // Extract unique cities
//     //     const uniqueCities = [
//     //       ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//     //     ];
//     //     setCities(uniqueCities);
//     //     setZones([]);
//     //     setLocations([]);
//     //   };
    
//     //   fetchData();
//     // }, [filters.category]);


//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
    
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
    
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(page, pageSize, cleanFilters);
    
//         // ✅ Update state with proper structure from service
//         setData(result.data || []);
//         setTotal(result.total || 0);
//         setLoading(false);
//       };
    
//       fetchData();
//     }, [filters, page]);
    
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
//     // useEffect(() => {
//     //  const fetchAll = async () => {
//     //        try {
//     //          const result = await searchManagedOffices(1, 100);
       
//     //          const dataArray = Array.isArray(result) ? result : result.data || [];
//     //          setAllData(dataArray);
       
//     //          if (dataArray.length > 0) {
//     //            setUserId(dataArray[0].assigned_agent || null);
//     //            setOfficeId(dataArray[0]._id || null);
       
//     //            const uniqueCities = [
//     //              ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
//     //            ];
//     //            setCities(uniqueCities);
//     //          } else {
//     //            setUserId(null);
//     //            setOfficeId(null);
//     //            setCities([]);
//     //          }
       
//     //          console.log("***************************", dataArray);
//     //        } catch (err) {
//     //          console.error("Error fetching managed offices:", err);
//     //          setAllData([]);
//     //          setUserId(null);
//     //          setOfficeId(null);
//     //          setCities([]);
//     //        }
//     //      };
//     //      fetchAll();
//     // }, []);

//     useEffect(() => {
//       const fetchAll = async () => {
//         try {
//           const result = await searchManagedOffices(1, 100);
//           const list = result.data || []; // ✅ ensure array
    
//           setAllData(list);
    
//           if (list.length > 0) {
//             setUserId(list[0].assigned_agent);
//             setOfficeId(list[0]._id);
//           }
    
//           console.log("✅ All managed offices:", list);
    
//           const uniqueCities = [
//             ...new Set(list.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         } catch (err) {
//           console.error("Error fetching all managed offices:", err);
//         }
//       };
    
//       fetchAll();
//     }, []);
    
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
//         try {

//           const { category, ...apiFilters } = filters;
//           const cleanFilters = Object.fromEntries(
//             Object.entries(apiFilters).filter(([_, v]) => v !== "")
//           );
          
//           const apiCall = getApiByCategory(filters.category);
//           const result = await apiCall(page, pageSize, cleanFilters);
      
//           const safeData = Array.isArray(result)
//             ? result
//             : Array.isArray(result?.data)
//             ? result.data
//             : [];
      
//           setData(safeData);
//           setTotal(result?.total || safeData.length);
//         } catch (err) {
//           console.error("Fetch error:", err);
//           setData([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData()
//     }, [filters]);
  
//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };

//   const handleCardClick = (officeId) => {
//     // Pass city and filtered list to Detail Page via state
//     navigate(`/office/${officeId}?category=${filters.category}`, {
//       state: {
//         city: filters.city,
//         relatedProperties: data, // only current filtered list
//       },
//     });
//   };
  

//   //model functions
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
 
//   const handleContactQuoteClick = () => {
//     setIsProfileModalOpen(false)
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       setIsLeadModalOpen(true); // existing lead modal
//     } else {
//       setAuthStep("email");
//       setAuthError("");
//       setVisitorEmail("");
//       setVisitorName("");
//       setOtp("");
//       setIsAuthModalOpen(true); // <-- use this state
//     }
//   };
//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white glow-text drop-shadow-lg">
//       FidWorx
//      </h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
  
//             {/* Hamburger */}

//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
    
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// <button
//     onClick={() => {
//       setFilters({
//         city: "",
//         zone: "",
//         locationOfProperty: "",
//         category: "managed",
//         priceRange: "",
//         areaSqft: "",
//         seatingCapacity: "",
//         furnishingLevel: "",
//       });
//       setPage(1);
//     }}
//     className="mt-2 px-4 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full shadow-sm"
//   >
//     Reset Filters
//   </button>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {/* {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button onClick={()=>{handleContactQuoteClick()}}  className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )} */}

// {isRestricted && (
//   <div
//     className="absolute inset-0 flex items-center justify-center bg-black/60 z-30"
//     onClick={(e) => {
//       e.stopPropagation();
//       setIsModalOpen(true);
//     }}
//   >
//     <button
//       onClick={() => handleContactQuoteClick()}
//       className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded"
//     >
//       Please Login to View
//     </button>
//   </div>
// )}


//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
// </div>
// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-20 right-6 z-50 md:hidden">
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
// {isAuthModalOpen && (
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
//           Contact123 {user?.fullName?.split(" ")[0]}
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
//         {/* ✅ Mobile Pagination */}
      
//   {/* Pagination */}
//   <div className="flex justify-center mt-6 mb-6">
//   <div className="flex items-center gap-3 bg-white px-3 py-2 shadow-md rounded-full">
//     {/* Prev */}
//     <button
//       onClick={() => setPage((p) => Math.max(p - 1, 1))}
//       disabled={page === 1}
//       className={`px-3 py-1 text-xs font-semibold rounded-full ${
//         page === 1
//           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//           : "bg-orange-500 text-white hover:bg-orange-600"
//       }`}
//     >
//       Prev
//     </button>

//     {/* Page */}
//     <span className="text-gray-700 text-sm font-medium">
//       {page} / {Math.ceil(total / pageSize) || 1}
//     </span>

//     {/* Next */}
//     <button
//       onClick={() => setPage((p) => p + 1)}
//       disabled={page * pageSize >= total}
//       className={`px-3 py-1 text-xs font-semibold rounded-full ${
//         page * pageSize >= total
//           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//           : "bg-orange-500 text-white hover:bg-orange-600"
//       }`}
//     >
//       Next
//     </button>

//     {/* Reset */}
//     <button
//       onClick={() => {
//         setFilters({
//           city: "",
//           zone: "",
//           locationOfProperty: "",
//           category: "managed",
//           priceRange: "",
//           areaSqft: "",
//           seatingCapacity: "",
//           furnishingLevel: "",
//         });
//         setPage(1);
//       }}
//       className="px-3 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
//     >
//       Reset
//     </button>
//   </div>
// </div>

// <div className="flex justify-center mt-6 mb-6">
// <h1>Fidelituscorp site have the all right </h1>
// </div>
//  <MobileBottomNav/>
//     </section>
//   ); 
// }
// export default MenuPage








//===========>>> Old pagination done modifyning UI 



// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";
// import { FaHome, FaCompass, FaInfoCircle } from "react-icons/fa";
// import MobileBottomNav from "./mobileComponents/MobileBottomNav";


// const MenuPage = () => {
//   const location = useLocation();
//   const currentPath = location.pathname; //

//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
//    //pagination states
//    const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [total, setTotal] = useState(0);


//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
//       const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
//     const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
//     const [otp, setOtp] = useState("");
//     const [isNewVisitor, setIsNewVisitor] = useState(false);
//     const [authError, setAuthError] = useState(""); // For invalid OTP
//     const [visitorEmail, setVisitorEmail] = useState(""); // Email input
//     const [visitorName, setVisitorName] = useState(""); // Only if new visitor
//         const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     // useEffect(() => {
//     //   if (!filters.category) return;
    
//     //   const fetchData = async () => {
//     //     const apiFn = getApiByCategory(filters.category);
//     //     const result = await apiFn(1, 100);
//     //     setAllData(result);
    
//     //     // Extract unique cities
//     //     const uniqueCities = [
//     //       ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//     //     ];
//     //     setCities(uniqueCities);
//     //     setZones([]);
//     //     setLocations([]);
//     //   };
    
//     //   fetchData();
//     // }, [filters.category]);


//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
    
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
    
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(page, pageSize, cleanFilters);
    
//         // ✅ Update state with proper structure from service
//         setData(result.data || []);
//         setTotal(result.total || 0);
//         setLoading(false);
//       };
    
//       fetchData();
//     }, [filters, page]);
    
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
//     // useEffect(() => {
//     //  const fetchAll = async () => {
//     //        try {
//     //          const result = await searchManagedOffices(1, 100);
       
//     //          const dataArray = Array.isArray(result) ? result : result.data || [];
//     //          setAllData(dataArray);
       
//     //          if (dataArray.length > 0) {
//     //            setUserId(dataArray[0].assigned_agent || null);
//     //            setOfficeId(dataArray[0]._id || null);
       
//     //            const uniqueCities = [
//     //              ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
//     //            ];
//     //            setCities(uniqueCities);
//     //          } else {
//     //            setUserId(null);
//     //            setOfficeId(null);
//     //            setCities([]);
//     //          }
       
//     //          console.log("***************************", dataArray);
//     //        } catch (err) {
//     //          console.error("Error fetching managed offices:", err);
//     //          setAllData([]);
//     //          setUserId(null);
//     //          setOfficeId(null);
//     //          setCities([]);
//     //        }
//     //      };
//     //      fetchAll();
//     // }, []);

//     useEffect(() => {
//       const fetchAll = async () => {
//         try {
//           const result = await searchManagedOffices(1, 100);
//           const list = result.data || []; // ✅ ensure array
    
//           setAllData(list);
    
//           if (list.length > 0) {
//             setUserId(list[0].assigned_agent);
//             setOfficeId(list[0]._id);
//           }
    
//           console.log("✅ All managed offices:", list);
    
//           const uniqueCities = [
//             ...new Set(list.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         } catch (err) {
//           console.error("Error fetching all managed offices:", err);
//         }
//       };
    
//       fetchAll();
//     }, []);
    
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
//         try {

//           const { category, ...apiFilters } = filters;
//           const cleanFilters = Object.fromEntries(
//             Object.entries(apiFilters).filter(([_, v]) => v !== "")
//           );

//           const apiCall = getApiByCategory(filters.category);
//           const result = await apiCall(page, pageSize, cleanFilters);
      
//           const safeData = Array.isArray(result)
//             ? result
//             : Array.isArray(result?.data)
//             ? result.data
//             : [];
      
//           setData(safeData);
//           setTotal(result?.total || safeData.length);
//         } catch (err) {
//           console.error("Fetch error:", err);
//           setData([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData()
//     }, [filters]);
  
//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };

//   const handleCardClick = (officeId) => {
//     // Pass city and filtered list to Detail Page via state
//     navigate(`/office/${officeId}?category=${filters.category}`, {
//       state: {
//         city: filters.city,
//         relatedProperties: data, // only current filtered list
//       },
//     });
//   };
  

//   //model functions
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
 
//   const handleContactQuoteClick = () => {
//     setIsProfileModalOpen(false)
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       setIsLeadModalOpen(true); // existing lead modal
//     } else {
//       setAuthStep("email");
//       setAuthError("");
//       setVisitorEmail("");
//       setVisitorName("");
//       setOtp("");
//       setIsAuthModalOpen(true); // <-- use this state
//     }
//   };
//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white glow-text drop-shadow-lg">
//       FidWorx
//      </h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
  
//             {/* Hamburger */}

//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
    
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {/* {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button onClick={()=>{handleContactQuoteClick()}}  className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )} */}

// {isRestricted && (
//   <div
//     className="absolute inset-0 flex items-center justify-center bg-black/60 z-30"
//     onClick={(e) => {
//       e.stopPropagation();
//       setIsModalOpen(true);
//     }}
//   >
//     <button
//       onClick={() => handleContactQuoteClick()}
//       className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded"
//     >
//       Please Login to View
//     </button>
//   </div>
// )}


//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
// </div>
// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-20 right-6 z-50 md:hidden">
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
// {isAuthModalOpen && (
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
//           Contact123 {user?.fullName?.split(" ")[0]}
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
//         {/* ✅ Mobile Pagination */}
//         <div className="flex flex-col items-center gap-3 mt-8 mb-6">
//   {/* Pagination */}
//   <div className="flex justify-between items-center bg-white w-full max-w-sm px-4 py-3 shadow-md rounded-xl">
//     <button
//       onClick={() => setPage((p) => Math.max(p - 1, 1))}
//       disabled={page === 1}
//       className={`px-4 py-2 text-sm font-semibold rounded-lg ${
//         page === 1
//           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//           : "bg-orange-500 text-white hover:bg-orange-600"
//       }`}
//     >
//       Prev
//     </button>
//     <span className="text-gray-700 text-sm font-medium">
//       Page {page} of {Math.ceil(total / pageSize) || 1}
//     </span>
//     <button
//       onClick={() => setPage((p) => p + 1)}
//       disabled={page * pageSize >= total}
//       className={`px-4 py-2 text-sm font-semibold rounded-lg ${
//         page * pageSize >= total
//           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//           : "bg-orange-500 text-white hover:bg-orange-600"
//       }`}
//     >
//       Next
//     </button>
//   </div>

//   {/* Reset Filters */}
//   <button
//     onClick={() => {
//       setFilters({
//         city: "",
//         zone: "",
//         locationOfProperty: "",
//         category: "managed",
//         priceRange: "",
//         areaSqft: "",
//         seatingCapacity: "",
//         furnishingLevel: "",
//       });
//       setPage(1);
//     }}
//     className="px-5 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm"
//   >
//     Reset Filters
//   </button>
// </div>


//  <MobileBottomNav/>
//     </section>
//   ); 
// }
// export default MenuPage








//==========+>>> Working on pagination 



// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";
// import { FaHome, FaCompass, FaInfoCircle } from "react-icons/fa";
// import MobileBottomNav from "./mobileComponents/MobileBottomNav";


// const MenuPage = () => {
//   const location = useLocation();
//   const currentPath = location.pathname; //

//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
//       const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
//     const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
//     const [otp, setOtp] = useState("");
//     const [isNewVisitor, setIsNewVisitor] = useState(false);
//     const [authError, setAuthError] = useState(""); // For invalid OTP
//     const [visitorEmail, setVisitorEmail] = useState(""); // Email input
//     const [visitorName, setVisitorName] = useState(""); // Only if new visitor
//         const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   // const handleContactQuoteClick = () => {
//   //   const visitorId = Cookies.get("visitorId");
//   //   if (visitorId) {
//   //     // If cookie exists → open Lead Modal instead of alert
//   //     setIsLeadModalOpen(true);
//   //   } else {
//   //     // Else → open Login modal
//   //     setIsModalOpen(true);
//   //   }
//   // };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };


//  //Detail page navigate with data
//   // const handleCardClick = (officeId) => {
//   //   navigate(`/office/${officeId}?category=${filters.category}`);
//   // };

//   const handleCardClick = (officeId) => {
//     // Pass city and filtered list to Detail Page via state
//     navigate(`/office/${officeId}?category=${filters.category}`, {
//       state: {
//         city: filters.city,
//         relatedProperties: data, // only current filtered list
//       },
//     });
//   };
  

//   //model functions
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
 
//   const handleContactQuoteClick = () => {
//     setIsProfileModalOpen(false)
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       setIsLeadModalOpen(true); // existing lead modal
//     } else {
//       setAuthStep("email");
//       setAuthError("");
//       setVisitorEmail("");
//       setVisitorName("");
//       setOtp("");
//       setIsAuthModalOpen(true); // <-- use this state
//     }
//   };
//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white glow-text drop-shadow-lg">
//       FidWorx
//      </h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
  
//             {/* Hamburger */}

//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
    
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {/* {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button onClick={()=>{handleContactQuoteClick()}}  className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )} */}

// {isRestricted && (
//   <div
//     className="absolute inset-0 flex items-center justify-center bg-black/60 z-30"
//     onClick={(e) => {
//       e.stopPropagation();
//       setIsModalOpen(true);
//     }}
//   >
//     <button
//       onClick={() => handleContactQuoteClick()}
//       className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded"
//     >
//       Please Login to View
//     </button>
//   </div>
// )}


//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
// </div>
// {/* Mobile Floating Profile Button */}
// <div className="fixed bottom-20 right-6 z-50 md:hidden">
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
// {isAuthModalOpen && (
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
//           Contact123 {user?.fullName?.split(" ")[0]}
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
//  <MobileBottomNav/>
//     </section>
//   ); 
// }
// export default MenuPage








//=============>>> All are done working on removing side menu 



// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
//       const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
//     const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
//     const [otp, setOtp] = useState("");
//     const [isNewVisitor, setIsNewVisitor] = useState(false);
//     const [authError, setAuthError] = useState(""); // For invalid OTP
//     const [visitorEmail, setVisitorEmail] = useState(""); // Email input
//     const [visitorName, setVisitorName] = useState(""); // Only if new visitor
//         const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   // const handleContactQuoteClick = () => {
//   //   const visitorId = Cookies.get("visitorId");
//   //   if (visitorId) {
//   //     // If cookie exists → open Lead Modal instead of alert
//   //     setIsLeadModalOpen(true);
//   //   } else {
//   //     // Else → open Login modal
//   //     setIsModalOpen(true);
//   //   }
//   // };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };


//  //Detail page navigate with data
//   // const handleCardClick = (officeId) => {
//   //   navigate(`/office/${officeId}?category=${filters.category}`);
//   // };

//   const handleCardClick = (officeId) => {
//     // Pass city and filtered list to Detail Page via state
//     navigate(`/office/${officeId}?category=${filters.category}`, {
//       state: {
//         city: filters.city,
//         relatedProperties: data, // only current filtered list
//       },
//     });
//   };
  

//   //model functions
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
 
//   const handleContactQuoteClick = () => {
//     setIsProfileModalOpen(false)
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       setIsLeadModalOpen(true); // existing lead modal
//     } else {
//       setAuthStep("email");
//       setAuthError("");
//       setVisitorEmail("");
//       setVisitorName("");
//       setOtp("");
//       setIsAuthModalOpen(true); // <-- use this state
//     }
//   };
//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )}

//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
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
// {isAuthModalOpen && (
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
//           Contact123 {user?.fullName?.split(" ")[0]}
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
//     </section>
//   ); 
// }
// export default MenuPage








//====================>>>> Old one updating login flow


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
  
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
    
//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   const handleContactQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       // If cookie exists → open Lead Modal instead of alert
//       setIsLeadModalOpen(true);
//     } else {
//       // Else → open Login modal
//       setIsModalOpen(true);
//     }
//   };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };
//   const handleLeadSubmit = async (e) => {
//     e.preventDefault();
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
  
//       const res = await postLeadData(leadData);
//       console.log("Lead created:", res);
  
//       alert("Your enquiry has been submitted successfully!");
//       setIsLeadModalOpen(false);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   }; 

//  //Detail page navigate with data
//   // const handleCardClick = (officeId) => {
//   //   navigate(`/office/${officeId}?category=${filters.category}`);
//   // };

//   const handleCardClick = (officeId) => {
//     // Pass city and filtered list to Detail Page via state
//     navigate(`/office/${officeId}?category=${filters.category}`, {
//       state: {
//         city: filters.city,
//         relatedProperties: data, // only current filtered list
//       },
//     });
//   };
  

//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar visitorId={visitorId} />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )}

//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
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
//     </section>
//   ); 
// }
// export default MenuPage








//=========================>>>> Updating for bottom cards 




// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
  
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
    
//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     // Handle filter change
//     // const handleFilterChange = (key, value) => {
//     //   let newFilters = { ...filters, [key]: value };
  
//     //   if (key === "city") {
//     //     newFilters.zone = "";
//     //     newFilters.locationOfProperty = "";
//     //   }
//     //   if (key === "zone") {
//     //     newFilters.locationOfProperty = "";
//     //   }
  
//     //   setFilters(newFilters);
  
//     //   const query = new URLSearchParams(
//     //     Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     //   ).toString();
//     //   navigate(query ? `/menu?${query}` : `/menu`);
//     // };
    

//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   const handleContactQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       // If cookie exists → open Lead Modal instead of alert
//       setIsLeadModalOpen(true);
//     } else {
//       // Else → open Login modal
//       setIsModalOpen(true);
//     }
//   };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };
//   const handleLeadSubmit = async (e) => {
//     e.preventDefault();
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
  
//       const res = await postLeadData(leadData);
//       console.log("Lead created:", res);
  
//       alert("Your enquiry has been submitted successfully!");
//       setIsLeadModalOpen(false);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   }; 
//   // const handleCardClick = (officeId) => {
//   //   navigate(`/office/${officeId}?category=${selectedCategory}`);
//   // };
//   const handleCardClick = (officeId) => {
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar visitorId={visitorId} />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )}

//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
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



//     </section>
//   ); 
// }
// export default MenuPage








//=========>>> Category fixing


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(true)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
  
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
    
//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     // Handle filter change
//     // const handleFilterChange = (key, value) => {
//     //   let newFilters = { ...filters, [key]: value };
  
//     //   if (key === "city") {
//     //     newFilters.zone = "";
//     //     newFilters.locationOfProperty = "";
//     //   }
//     //   if (key === "zone") {
//     //     newFilters.locationOfProperty = "";
//     //   }
  
//     //   setFilters(newFilters);
  
//     //   const query = new URLSearchParams(
//     //     Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     //   ).toString();
//     //   navigate(query ? `/menu?${query}` : `/menu`);
//     // };
    

//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   const handleContactQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       // If cookie exists → open Lead Modal instead of alert
//       setIsLeadModalOpen(true);
//     } else {
//       // Else → open Login modal
//       setIsModalOpen(true);
//     }
//   };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };
//   const handleLeadSubmit = async (e) => {
//     e.preventDefault();
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
  
//       const res = await postLeadData(leadData);
//       console.log("Lead created:", res);
  
//       alert("Your enquiry has been submitted successfully!");
//       setIsLeadModalOpen(false);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   }; 
//   const handleCardClick = (officeId) => {
//     navigate(`/office/${officeId}?category=${selectedCategory}`);
//   };

//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar visitorId={visitorId} />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )}

//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
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



//     </section>
//   ); 
// }
// export default MenuPage








//===============>>>> all are intigrated right card and cards working on pagination 



// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(true)
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
  
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
    
//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     // Handle filter change
//     // const handleFilterChange = (key, value) => {
//     //   let newFilters = { ...filters, [key]: value };
  
//     //   if (key === "city") {
//     //     newFilters.zone = "";
//     //     newFilters.locationOfProperty = "";
//     //   }
//     //   if (key === "zone") {
//     //     newFilters.locationOfProperty = "";
//     //   }
  
//     //   setFilters(newFilters);
  
//     //   const query = new URLSearchParams(
//     //     Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     //   ).toString();
//     //   navigate(query ? `/menu?${query}` : `/menu`);
//     // };
    

//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   const handleContactQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       // If cookie exists → open Lead Modal instead of alert
//       setIsLeadModalOpen(true);
//     } else {
//       // Else → open Login modal
//       setIsModalOpen(true);
//     }
//   };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };
//   const handleLeadSubmit = async (e) => {
//     e.preventDefault();
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
  
//       const res = await postLeadData(leadData);
//       console.log("Lead created:", res);
  
//       alert("Your enquiry has been submitted successfully!");
//       setIsLeadModalOpen(false);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   }; 
//   const handleCardClick = (officeId) => {
//     navigate(`/office/${officeId}?category=${selectedCategory}`);
//   };

//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar visitorId={visitorId} />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
// {/* Mobile Cards Section */}
// <div className="mt-6 px-4 space-y-6">
//   {data.map((office, index) => {
//     const currentImg = office.images?.[currentImageIndex[index] || 0] || "";
//     const isRestricted = !visitorId && index >= 3;

//     return (
//       <div
//         key={office._id}
//         className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden w-full"
//         onClick={() => handleCardClick(office._id)}
//       >
//         {/* Restricted Overlay */}
//         {isRestricted && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             <button className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded">
//               Please Login to View
//             </button>
//           </div>
//         )}

//         {/* Image */}
//         <div
//           className="relative w-full h-48"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={currentImg}
//             alt={office.buildingName}
//             className="object-cover w-full h-full"
//           />
//           {office.images?.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrev(index, office.images.length);
//                 }}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNext(index, office.images.length);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white rounded-full"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4 w-full relative">
//           {/* Save */}
//           <div
//             className="absolute top-4 right-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => handleSave(office._id)}
//               className={`w-7 h-7 flex items-center justify-center rounded ${
//                 savedSpaces.includes(office._id)
//                   ? "bg-black text-white"
//                   : "bg-gray-300 text-white"
//               }`}
//             >
//               ★
//             </button>
//             {savedSpaces.includes(office._id) && (
//               <span className="text-orange-500 text-[10px]">Saved</span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-lg font-bold text-[#16607B]">{office.buildingName}</h2>
//           <p className="text-sm text-[#16607B]">{office.type} Space</p>
//           <p className="text-xs text-[#16607B] flex items-center gap-1 mb-3">
//             <MapPin size={12} className="text-orange-500" />
//             {office.location?.address}, {office.location?.city}
//           </p>

//           {/* Info Scroller */}
//             {/* Blue Box */}
//             <div className="mt-3 mx-[-4px]">
//   <GroupsScroller
//     className="w-full" // ✅ ensures scroller matches card width
//     groups={[
//       // Group 1
//       <>
//         <div className="flex flex-col w-[111px] items-center justify-center">
//           <p className="text-[13px] text-white font-regular">Seater Offered</p>
//           <span className="text-[13px] text-white font-bold">
//             {office.generalInfo.seaterOffered}
//           </span>
//         </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Floor Size</p>
//              {(() => {
//                const floorSize = office?.generalInfo?.floorSize || "";
//                if (!floorSize) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = floorSize.split(/ (.+)/);
//                return (
//                  <span className="text-[14px] text-white text-center">
//                    <span className="font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//            <div className="flex flex-col w-[111px] items-center justify-center">
//              <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//              {(() => {
//                const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//                if (!builtUp) {
//                  return <span className="text-[14px] text-white text-center">N/A</span>;
//                }
//                const [value, unit] = builtUp.split(/ (.+)/);
//                return (
//                  <span className="text-center text-white">
//                    <span className="text-[14px] font-bold">{value}</span>{" "}
//                    <span className="text-[12px] font-regular">{unit}</span>
//                  </span>
//                );
//              })()}
//            </div>
           
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Lock-in</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.lockInPeriod}
//                  </span>
//                </div>
//              </>,
           
//              // Group 2
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Floors</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.floors}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Furnishing</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.generalInfo.furnishingLevel}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.airConditioners ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Parking</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.parking ? "Yes" : "No"}
//                  </span>
//                </div>
//              </>,
           
//              // Group 3
//              <>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Security24x7</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.security24x7 ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Wifi</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.wifi ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-regular">Washrooms</p>
//                  <span className="text-[14px] text-white font-bold">
//                    {office.amenities?.washrooms ? "Yes" : "No"}
//                  </span>
//                </div>
//                <div className="flex flex-col w-[111px] items-center justify-center">
//                  <p className="text-[13px] text-white font-bold underline cursor-pointer">
//                    View More
//                  </p>
//                </div>
//              </>,
//                          ]}
                         
//                        />
//            </div>
//           {/* Price & CTA */}
//           <div className="mt-[-15px]">
//             <p className="text-sm font-bold text-[#16607B]">Quoted Price</p>
//             <p className="text-lg font-bold text-gray-800">
//             ₹{office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p>
//               {/* <p className="text-lg font-bold text-gray-800">
//             {office.generalInfo?.rentPerSeat}
//               <span className="text-xs text-[#16607B]"> / Seat</span>
//             </p> */}
//             <button
//               // className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600"
//                 className="mt-3 w-full py-2 bg-black text-white text-sm font-semibold rounded hover:bg-green-600 active:scale-95 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleContactQuoteClick();
//               }}
//             >
//               Get Best Price
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   })}
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
//     <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm relative">
//       {/* Close Button */}
//       <button
//         onClick={() => setIsProfileModalOpen(false)}
//         className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//       >
//         ✕
//       </button>

//       {/* Profile Section */}
//       <div className="flex flex-col items-center text-center">
//         <div className="w-[94px] h-[94px] rounded-full border-2 border-gray-300 overflow-hidden mb-3">
//           <img
//             src={user?.profileImage || "https://via.placeholder.com/94"}
//             alt={user?.fullName || "Handler"}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-lg font-bold text-[#374151]">{user?.fullName}</h3>
//         <p className="text-sm text-gray-600">{user?.mobile}</p>
//         <p className="text-sm text-gray-600">{user?.email}</p>

//         <button
//           onClick={handleContactQuoteClick}
//           className="mt-4 w-full py-2 bg-orange-500 text-white font-bold text-sm rounded hover:bg-orange-600 transition"
//         >
//           Contact {user?.fullName?.split(" ")[0]}
//         </button>
//       </div>

//       {/* Info Box */}
//       <div className="mt-4 text-xs text-gray-700 bg-gray-100 rounded p-3">
//         {user?.fullName} and team assisted{" "}
//         <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore.
//       </div>
//     </div>
//   </div>
// )}
// {/* Right Side - User Details Card (Desktop Only) */}
// <div className="hidden md:block sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//      <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Intro Text */}
//   <h2 className="mb-4 text-[12px] text-[#374151] font-bold text-center">
//     Upgrade your Space office with {user?.fullName || "Our Team"} to get the best price and best deals for your office space.
//   </h2>

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
  
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>

//   {/* Info Box */}
//   <div className="flex justify-center mt-6">
//     <div className="w-[415px] h-[52px] bg-gray-100 rounded p-3 text-center text-[12px] text-gray-700 leading-snug">
//       {user?.fullName} and team assisted{" "}
//       <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore to move into their new office.
//     </div>
//   </div>

//   {/* Logos Section */}
//   <div className="flex justify-center items-center mt-2 gap-[20px]">
//     <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s" alt="Logo1" className="w-[30px] h-[30px]" />
//     <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s" alt="Logo2" className="w-[30px] h-[30px]" />
//     <img src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg" alt="Logo3" className="w-[30px] h-[30px]" />
//     <img src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg" alt="Logo4" className="w-[30px] h-[30px]" />
//     <img src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg" alt="Logo5" className="w-[30px] h-[30px]" />
//   </div>

//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
//     <p className="mb-2 font-bold">
//       Explore workspace solutions with our expert guidance:
//     </p>
//     <ul className="space-y-2">
//       <li className="flex items-center gap-2">
//         <Check className="w-4 h-4 text-green-600" />
//         <span>Workspace selection & location strategy</span>
//       </li>
//       <li className="flex items-center gap-2">
//         <Check className="w-4 h-4 text-green-600" />
//         <span>Workspace tours</span>
//       </li>
//       <li className="flex items-center gap-2">
//         <Check className="w-4 h-4 text-green-600" />
//         <span>Layout design & customization assistance</span>
//       </li>
//       <li className="flex items-center gap-2">
//         <Check className="w-4 h-4 text-green-600" />
//         <span>Terms negotiations & deal signing</span>
//       </li>
//     </ul>

//     {/* Button at bottom center */}
//     <div className="flex justify-center mt-3">
//         <button
//           onClick={handleContactQuoteClick}
//           className="w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
//         >
//           Contact Quote
//         </button>
//       </div>
//   {/* Modal */}
//   {isModalOpen && (
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

//   </div>
//         </div>
// </div>
//     </section>
//   ); 
// }
// export default MenuPage








//==============+>>> All are working as expected filters



// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
  
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
  
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
    
//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     // Handle filter change
//     // const handleFilterChange = (key, value) => {
//     //   let newFilters = { ...filters, [key]: value };
  
//     //   if (key === "city") {
//     //     newFilters.zone = "";
//     //     newFilters.locationOfProperty = "";
//     //   }
//     //   if (key === "zone") {
//     //     newFilters.locationOfProperty = "";
//     //   }
  
//     //   setFilters(newFilters);
  
//     //   const query = new URLSearchParams(
//     //     Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     //   ).toString();
//     //   navigate(query ? `/menu?${query}` : `/menu`);
//     // };
    

//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   const handleContactQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       // If cookie exists → open Lead Modal instead of alert
//       setIsLeadModalOpen(true);
//     } else {
//       // Else → open Login modal
//       setIsModalOpen(true);
//     }
//   };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };
//   const handleLeadSubmit = async (e) => {
//     e.preventDefault();
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
  
//       const res = await postLeadData(leadData);
//       console.log("Lead created:", res);
  
//       alert("Your enquiry has been submitted successfully!");
//       setIsLeadModalOpen(false);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   }; 
//   const handleCardClick = (officeId) => {
//     navigate(`/office/${officeId}?category=${selectedCategory}`);
//   };

//   return (
//     <section className="relative w-full min-h-screen bg-white text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar visitorId={visitorId} />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
//     </section>
//   ); 
// }
// export default MenuPage








//===================>>> Filters working as expected.



// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
  
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
  
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
    
//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };

//     useEffect(() => {
//       if (!filters.category) return;
    
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
    
//         // Extract unique cities
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
    
//       fetchData();
//     }, [filters.category]);
   
//     const handleSelectCity = (city) => {
//       setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
    
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//       setLocations([]);
//     };

    
//     const handleSelectZone = (zone) => {
//       setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
    
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     };
    
//     const handleSelectLocation = (loc) => {
//       setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     };
    
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     // Handle filter change
//     // const handleFilterChange = (key, value) => {
//     //   let newFilters = { ...filters, [key]: value };
  
//     //   if (key === "city") {
//     //     newFilters.zone = "";
//     //     newFilters.locationOfProperty = "";
//     //   }
//     //   if (key === "zone") {
//     //     newFilters.locationOfProperty = "";
//     //   }
  
//     //   setFilters(newFilters);
  
//     //   const query = new URLSearchParams(
//     //     Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     //   ).toString();
//     //   navigate(query ? `/menu?${query}` : `/menu`);
//     // };
    

//     const handleFilterChange = (key, value) => {
//       if (key === "city") handleSelectCity(value);
//       else if (key === "zone") handleSelectZone(value);
//       else if (key === "locationOfProperty") handleSelectLocation(value);
//       else setFilters((prev) => ({ ...prev, [key]: value }));
    
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   const handleContactQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       // If cookie exists → open Lead Modal instead of alert
//       setIsLeadModalOpen(true);
//     } else {
//       // Else → open Login modal
//       setIsModalOpen(true);
//     }
//   };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 
  
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };
//   const handleLeadSubmit = async (e) => {
//     e.preventDefault();
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
  
//       const res = await postLeadData(leadData);
//       console.log("Lead created:", res);
  
//       alert("Your enquiry has been submitted successfully!");
//       setIsLeadModalOpen(false);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   }; 
//   const handleCardClick = (officeId) => {
//     navigate(`/office/${officeId}?category=${selectedCategory}`);
//   };

//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar visitorId={visitorId} />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
//     </section>
//   ); 
// }
// export default MenuPage








//===================================>>> 100 % working 





// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom"; 
// import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons 
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import { mockOfficeData } from "../../data/mockOfficeData";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   
// import MobileFilters from "./mobileComponents/MobileFilters";

// const MenuPage = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//     const incomingFilters = location.state?.filters || {};
  
  
//     const [allData, setAllData] = useState([]);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
  
  
//     const scrollContainerRef = useRef(null);
//     // const [data, setData] = useState([]);
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const [selectedCategory, setSelectedCategory] = useState("managed");
//     const [showLeftButton, setShowLeftButton] = useState(false);
//     const [showRightButton, setShowRightButton] = useState(true);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState({});
//     const [isSticky, setIsSticky] = useState(false);
//     const filterRef = useRef(null);
//   //save Space through card
//     const [savedSpaces, setSavedSpaces] = useState([]);
  
//     const [revealedCards, setRevealedCards] = useState({});
    
//   // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
//   const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
//   const [masterZones, setMasterZones] = useState({});
//   const [masterLocations, setMasterLocations] = useState({});
  
//   const [allCities, setAllCities] = useState([]);
  
//   const visitorId = Cookies.get("visitorId");
//   // alert(visitorId)
//   const isRestricted = visitorId;
  
  
//   const [allZones, setAllZones] = useState([]);
//   const [allLocations, setAllLocations] = useState([]);
  
    
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedZone, setSelectedZone] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);
  
   
//       // 🔹 separate state to hold filters coming from Home
//       const [externalFilters, setExternalFilters] = useState(null);
//       console.log("******************************* incoming filters",incomingFilters)
//     // 👇 initialize filters with incomingFilters right away
//   const initialNormalized = (() => {
//     const raw = location.state?.filters || {};
//     const facility =
//       (raw.facilityType || raw["What are you looking for"] || "").toString().trim();
  
//     return {
//       city: (raw.city || "").toString().trim(),
//       zone: (raw.zone || "").toString().trim(),
//       location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//       facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//       furnishingLevel: "",
//       seatingCapacity: "",
//       priceRange: "",
//       priceRangeDisplay: "",
//       areaSqft: "",
//     };
//   })();
  
  
//   // const [filters, setFilters] = useState(initialNormalized);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [leadMessage, setLeadMessage] = useState("");
  
  
//   //new code
//   const queryParams = new URLSearchParams(location.search);
//   const initialFilters = {};
//   queryParams.forEach((value, key) => {
//     initialFilters[key] = value;
//   });
  
//   const [filters, setFilters] = useState({
//     city: initialFilters.city || "",
//     zone: initialFilters.zone || "",
//     locationOfProperty: initialFilters.locationOfProperty || "",
//     category: initialFilters.category || "managed",
//     priceRange: initialFilters.priceRange || "",
//     areaSqft: initialFilters.areaSqft || "",
//     seatingCapacity: initialFilters.seatingCapacity || "",
//     furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
//   });
  
  
//    const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);
  
//     const priceOptions = [
//       { display: "Under ₹10,000", value: "1000-10000" },
//       { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//       { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//     ];
  
//     const areaOptions = [
//       { display: "300 - 500 sqft", value: "300-500" },
//       { display: "500 - 900 sqft", value: "500-900" },
//       { display: "1200 - 2000 sqft", value: "1200-2000" },
//     ];
  
//     const seatingOptions = [
//       { display: "10 - 50", value: "10-50" },
//       { display: "50 - 100", value: "50-100" },
//       { display: "100 - 500", value: "100-500" },
//       { display: "500 - 1000", value: "500-1000" },
//       { display: "1000 - 2000", value: "1000-2000" },
//     ];
  
//   // API toggle logic
//     const getApiByCategory = (category) => {
//       switch (category) {
//         case "office":
//           return searchOfficeSpaces;
//         case "co-working":
//           return searchCoWorkingSpaceData;
//         default:
//           return searchManagedOffices;
//       }
//     };
  
//     // Fetch all data (for dropdowns)
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
  
//     // Update dependent dropdowns
//     useEffect(() => {
//       if (filters.city) {
//         const cityZones = [
//           ...new Set(
//             allData
//               .filter((item) => item.location?.city === filters.city)
//               .map((item) => item.location?.zone)
//               .filter(Boolean)
//           ),
//         ];
//         setZones(cityZones);
//       } else {
//         setZones([]);
//       }
  
//       if (filters.city && filters.zone) {
//         const zoneLocations = [
//           ...new Set(
//             allData
//               .filter(
//                 (item) =>
//                   item.location?.city === filters.city &&
//                   item.location?.zone === filters.zone
//               )
//               .map((item) => item.location?.locationOfProperty)
//               .filter(Boolean)
//           ),
//         ];
//         setLocations(zoneLocations);
//       } else {
//         setLocations([]);
//       }
//     }, [filters.city, filters.zone, allData]);
  
//     // Fetch data when filters change
//     useEffect(() => {
//       const fetchData = async () => {
//         setLoading(true);
  
//         const { category, ...apiFilters } = filters;
//         const cleanFilters = Object.fromEntries(
//           Object.entries(apiFilters).filter(([_, v]) => v !== "")
//         );
  
//         const apiCall = getApiByCategory(filters.category);
//         const result = await apiCall(1, 10, cleanFilters);
//         setData(result);
//         setLoading(false);
//       };
//       fetchData();
//     }, [filters]);
  
//     // Handle filter change
//     const handleFilterChange = (key, value) => {
//       let newFilters = { ...filters, [key]: value };
  
//       if (key === "city") {
//         newFilters.zone = "";
//         newFilters.locationOfProperty = "";
//       }
//       if (key === "zone") {
//         newFilters.locationOfProperty = "";
//       }
  
//       setFilters(newFilters);
  
//       const query = new URLSearchParams(
//         Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//       ).toString();
//       navigate(query ? `/menu?${query}` : `/menu`);
//     };
    
   
//   console.log("OOOOOOOOFice",officeId)
      
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           if (userId) {
//             const userData = await getUserDataById(userId);
//             setUser(userData);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user:", err);
//         }
//       };
  
//       fetchUser();
//     }, [userId]);
//      // helper to update filters + trigger search
//   const updateFilters = (newFilters) => {
//     setFilters((prev) => {
//       const updated = { ...prev, ...newFilters };
//       // 🔥 call API immediately with updated filters
//       handleSearch(updated);
//       return updated;
//     });
//   };
  
//      const isLoggedIn = false;
  
//      const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;
  
//      useEffect(() => {
//       const updateButtonVisibility = () => {
//         if (scrollContainerRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//           setShowLeftButton(scrollLeft > 0);
//           setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       };
  
//       const handleFilterChange = (field, value) => {
//         setFilters((prev) => ({ ...prev, [field]: value }));
//       };
  
  
//       ////UI related Functions
//       // Initial check
//       updateButtonVisibility();
      
//       // Add event listeners
//       window.addEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//       }
    
//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', updateButtonVisibility);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//         }
//       };
//     }, []);
//     useEffect(() => {
//       const onScroll = () => {
//         if (!filterRef.current) return;
//         const { top } = filterRef.current.getBoundingClientRect();
//        setIsSticky(top <= 0);
//       };
//       window.addEventListener("scroll", onScroll, { passive: true });
//       return () => window.removeEventListener("scroll", onScroll);
//      }, []);
     
//     const handlePrev = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === 0
//             ? totalImages - 1
//             : (prev[cardIndex] || 0) - 1,
//       }));
//     };
  
//     const handleNext = (cardIndex, totalImages) => {
//       setCurrentImageIndex((prev) => ({
//         ...prev,
//         [cardIndex]:
//           prev[cardIndex] === totalImages - 1
//             ? 0
//             : (prev[cardIndex] || 0) + 1,
//       }));
//     };
  
  
//     // const handleSave = (id) => {
//     //   alert("saved")
//     //   setSavedSpaces((prev) =>
//     //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//     //   );
//     // };
//      useEffect(() => {
//       const fetchWishlist = async () => {
//         try {
//           const res = await getWishlistData(visitorId);
//           if (res?.data) {
//             const propertyIds = res.data.map((item) => item.propertyId);
//             setSavedSpaces(propertyIds);
//           }
//         } catch (err) {
//           console.error("Error fetching wishlist:", err);
//         }
//       };
  
//       if (visitorId) {
//         fetchWishlist();
//       }
//     }, [visitorId]);
  
//     // Toggle save/remove
//     const handleSave = async (propertyId) => {
//       try {
//         if (savedSpaces.includes(propertyId)) {
//           // remove
//           await deleteWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//         } else {
//           // add
//           await postWishlistData({ visitorId, propertyId });
//           setSavedSpaces((prev) => [...prev, propertyId]);
//         }
//       } catch (err) {
//         console.error("Error updating wishlist:", err);
//       }
//     };
  
//     const handleReveal = (index, isRestricted) => {
//       if (isRestricted) return; // don’t allow reveal if restricted
//       setRevealedCards((prev) => ({ ...prev, [index]: true }));
//     };
    
//     const toggleDropdown = (dropdown) => {
//       setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//     };
  
//   // Button handler
//   const handleContactQuoteClick = () => {
//     const visitorId = Cookies.get("visitorId");
//     if (visitorId) {
//       // If cookie exists → open Lead Modal instead of alert
//       setIsLeadModalOpen(true);
//     } else {
//       // Else → open Login modal
//       setIsModalOpen(true);
//     }
//   };
  
  
//   const handleContactQuote = async () => {
//     const visitorId = Cookies.get("visitorId");
  
//     if (visitorId) {
//       console.log("Visitor already exists with ID:", visitorId);
//       alert("Visitor already exists, we will reach you.");
//       return; // stop here
//     }
  
//     // else open form modal
//     setIsModalOpen(true);
//   }; 

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await postVisitorData(formData);
//       console.log("Visitor created:", res);
  
//       // store visitorId in cookies
//       Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days
  
//       alert("Thanks for login. Quote request submitted successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       alert("Something went wrong, please try again.");
//     }
//   };
//   const handleLeadSubmit = async (e) => {
//     e.preventDefault();
//     const visitorId = Cookies.get("visitorId");
  
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }
  
//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId: visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)
  
//       const res = await postLeadData(leadData);
//       console.log("Lead created:", res);
  
//       alert("Your enquiry has been submitted successfully!");
//       setIsLeadModalOpen(false);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   }; 
//   const handleCardClick = (officeId) => {
//     navigate(`/office/${officeId}?category=${selectedCategory}`);
//   };

//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">
//       <div
//         className="relative w-full h-[300px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//         {/* Navbar */}
//         <div className="w-full h-[70px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//           {/* Logo */}
//           <h1 className="text-2xl font-bold text-white">FidWorx</h1>
  
//           {/* Right icons */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist */}
//             <WishlistSidebar visitorId={visitorId} />
  
//             {/* Hamburger */}
//             <button
//               className="text-white text-2xl"
//               onClick={() => setIsOpen(true)}
//             >
//               <FiMenu />
//             </button>
//           </div>
//         </div>
  
//         {/* Mobile Drawer Menu */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/60 z-50">
//             <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//               {/* Close button */}
//               <button
//                 className="text-2xl text-gray-700 mb-6"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FiX />
//               </button>
  
//               {/* Links */}
//               <nav className="flex text-black flex-col gap-6 text-lg font-semibold">
//                 <Link to="/" onClick={() => setIsOpen(false)}>
//                   Home
//                 </Link>
//                 <Link to="/menu" onClick={() => setIsOpen(false)}>
//                   Explore Spaces
//                 </Link>
//                 <Link to="/about" onClick={() => setIsOpen(false)}>
//                   About Us
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         )}
  
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>
  
//         {/* Banner Title */}
//         <div className="relative flex justify-center items-center h-full text-center px-4">
//           <h1 className="pt-16  text-2xl font-bold text-white">
//             Find Your Requirement{" "}
//             <span className=" mt-2 text-orange-500">Here</span>
//           </h1>
//         </div>
//       </div>
  
// {/* Overlapping Section with Toggle Buttons (Mobile) */}
// <div className="relative z-20 flex flex-col items-center -mt-[20px] px-4">
//   {/* Button Group */}
//   <div className="flex w-full max-w-md h-[44px] shadow-md bg-white border border-gray-300">
//     {[
//       { label: "Managed", value: "managed" },
//       { label: "Office", value: "office" },
//       { label: "Co-Working", value: "co-working" },
//     ].map((cat, idx) => (
//       <button
//         key={cat.value}
//         onClick={() => handleFilterChange("category", cat.value)}
//         className={`flex-1 text-xs sm:text-sm font-medium transition-all duration-300 ${
//           filters.category === cat.value
//             ? "bg-orange-500 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//         } ${idx !== 2 ? "border-r border-gray-300" : ""}`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* Mobile Filters */}
// <div className="mt-[5px] w-full max-w-[540px] mx-auto px-4">
//   <MobileFilters
//     filters={filters}
//     handleFilterChange={handleFilterChange}
//     cities={cities}
//     zones={zones}
//     locations={locations}
//     priceOptions={priceOptions}
//     areaOptions={areaOptions}
//     seatingOptions={seatingOptions}
//   />
// </div>
//     </section>
//   ); 
// }
// export default MenuPage










////==================================>>>>


// export default function MenuPage() {
//     return (
//       <div className="h-screen flex items-center justify-center bg-pink-100">
        // <h1 className="text-2xl font-bold text-pink-800">
        //   Mobile Menu Page 📱
        // </h1>
//       </div>
//     );
//   }
  