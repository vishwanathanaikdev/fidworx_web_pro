import React, { useState, useEffect, useRef } from "react";
import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
import { getUserDataById } from "../../api/services/userService";
import { Link } from "react-router-dom";  
// import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
import Cookies from "js-cookie";
import { postVisitorData, postLeadData } from "../../api/services/visitorService";
import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GroupsScroller from "../../components/GroupsScroller";
import WishlistSidebar from "../../components/WishlistSidebar";
import { useLocation } from "react-router-dom";   

import AuthModal from "./component/AuthModal";
import LeadEnquiryModal from "./component/LeadEnquiryModal";

const MenuPage = ({ city = "" }) => {
  const location = useLocation();
  const incomingFilters = location.state?.filters || {};


  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
// pagination states
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [total, setTotal] = useState(0);


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

  //OTP flow states
const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
const [otp, setOtp] = useState("");
const [isNewVisitor, setIsNewVisitor] = useState(false);
const [authError, setAuthError] = useState(""); // For invalid OTP
const [visitorEmail, setVisitorEmail] = useState(""); // Email input
const [visitorName, setVisitorName] = useState(""); 
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  //model states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
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
    const fetchAll = async () => {
      try {
        const result = await searchManagedOffices(1, 100);
  
        const dataArray = Array.isArray(result) ? result : result.data || [];
        setAllData(dataArray);
  
        if (dataArray.length > 0) {
          setUserId(dataArray[0].assigned_agent || null);
          setOfficeId(dataArray[0]._id || null);
  
          const uniqueCities = [
            ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
          ];
          setCities(uniqueCities);
        } else {
          setUserId(null);
          setOfficeId(null);
          setCities([]);
        }
  
        console.log("***************************", dataArray);
      } catch (err) {
        console.error("Error fetching managed offices:", err);
        setAllData([]);
        setUserId(null);
        setOfficeId(null);
        setCities([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
      const { category, ...apiFilters } = filters;
      const cleanFilters = Object.fromEntries(
        Object.entries(apiFilters).filter(([_, v]) => v !== "")
      );
  
      const apiCall = getApiByCategory(filters.category);
  
      const result = await apiCall(page, pageSize, cleanFilters);
  
      // ✅ Support both array or object responses
      if (Array.isArray(result)) {
        setData(result);
        setTotal(result.length); // fallback if no total from backend
      } else {
        setData(result.data || []);
        setTotal(result.total || 0);
      }
  
      setLoading(false);
    };
  
    fetchData();
  }, [filters, page, pageSize]);
  
  const handleFilterChange = (key, value) => {
    let newFilters = { ...filters, [key]: value };
  
    if (key === "city") {
      newFilters.zone = "";
      newFilters.locationOfProperty = "";
    }
    if (key === "zone") {
      newFilters.locationOfProperty = "";
    }
  
    setFilters(newFilters);
    setPage(1); // ✅ Reset page
  
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
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

const handleSendOtp = async () => {
  setAuthError("");
  try {
    const res = await sendEmailOtp(visitorEmail);
    setIsNewVisitor(res.isNewVisitor);
    setAuthStep("otp");
  } catch (err) {
    setAuthError(err.message || "Failed to send OTP");
  }
};

const handleVerifyOtp = async () => {
  setAuthError("");
  if (!otp) return setAuthError("OTP is required");

  try {
    // Base payload
    let payload = {
      email: visitorEmail,
      otp: otp,
    };

    // Add extra fields if new visitor
    if (isNewVisitor) {
      if (!visitorName || !formData.mobile || !formData.city) {
        return setAuthError("All fields are required for new visitors");
      }
      payload = {
        ...payload,
        fullName: visitorName,
        mobile: formData.mobile,
        city: formData.city,
      };
    }

    const res = await verifyEmailOtp(payload);

    // Save visitorId in cookie
    const visitorId = res.data._id;
    Cookies.set("visitorId", visitorId, { expires: 7 });

    // Close Auth modal
    setIsModalOpen(false);

    // Open lead modal
    // setIsLeadModalOpen(true);

    console.log("Visitor logged in successfully:", res.data);
  } catch (err) {
    setAuthError(err.response?.data?.message || "Invalid OTP");
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

const handleSaveClick = (officeId) => {
  if (!visitorId) {
    setIsAuthModalOpen(true); // show login modal if not logged in
  } else {
    handleSave(officeId); // normal save
  }
};


const resetFilters = () => {
  // Reset all filters
  const reset = {
    city: "",
    zone: "",
    locationOfProperty: "",
    category: "managed",
    priceRange: "",
    areaSqft: "",
    seatingCapacity: "",
    furnishingLevel: "",
  };
  setFilters(reset);
  setPage(1);

  // Reset dependent dropdowns
  setZones([]);
  setLocations([]);

  // Reset URL
  navigate("/menu");

  // Optionally, fetch all data for default view
  const apiCall = getApiByCategory(reset.category);
  apiCall(1, pageSize, {}).then((result) => {
    if (Array.isArray(result)) {
      setData(result);
      setTotal(result.length);
    } else {
      setData(result.data || []);
      setTotal(result.total || 0);
    }
  });
};

  return (
    <div className="w-full">
      {/* Banner Section */}
      <div
        className="relative w-full h-[345px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
        }}
      >
            <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
        {/* Logo */}
        <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
        <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
            FidWorx
          </h1>
        </div>

        {/* Navigation */}
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
    setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
  }}
/>
</div>
      </div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative flex justify-center h-full">
          <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
           Find Your Requirement 
<span className="ml-6 text-orange-500">Here</span>

          </h1>
        </div>
      </div>   
{/* Overlapping Section with Toggle Buttons */}

  {/* Button Group */}
{/* Overlapping Section with Toggle Buttons */}
<div className="relative z-10 flex flex-col items-center -mt-30">
<div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
    {[
      { label: "Managed Office", value: "managed" },
      { label: "Office Space", value: "office" },
      { label: "Co-Working Space", value: "co-working" },
    ].map((cat) => (
      <button
        key={cat.value}
        onClick={() => {
          // Update both filters AND selectedCategory
          handleFilterChange("category", cat.value);
          setSelectedCategory(cat.value);
          setPage(1); // optional: reset pagination
        }}
        className={`flex-1 font-semibold ${
          selectedCategory === cat.value
            ? "text-white bg-orange-500"
            : "text-gray-700 bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {cat.label}
      </button>
    ))}
  </div>
</div>
{/* White box section (sticky + smooth expand/shrink from center) */}
<div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-10 top-20">
  <div className="grid grid-cols-7 gap-3">
    {/* City */}
    <div>
      <p className="mb-1 text-[12px] font-medium text-black">City</p>
      <select
        value={filters.city}
        onChange={(e) => handleFilterChange("city", e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
      >
        <option value="">Select City</option>
        {cities.map((city, idx) => (
          <option key={idx} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>

    {/* Zone */}
    <div>
      <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
      <select
        value={filters.zone}
        onChange={(e) => handleFilterChange("zone", e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        disabled={!filters.city}
      >
        <option value="">Select Zone</option>
        {zones.map((zone, idx) => (
          <option key={idx} value={zone}>
            {zone}
          </option>
        ))}
      </select>
    </div>

    {/* Location */}
    <div>
      <p className="mb-1 text-[12px] font-medium text-black">Location</p>
      <select
        value={filters.locationOfProperty}
        onChange={(e) =>
          handleFilterChange("locationOfProperty", e.target.value)
        }
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        disabled={!filters.zone}
      >
        <option value="">Select Location</option>
        {locations.map((loc, idx) => (
          <option key={idx} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>

    {/* Price */}
    <div>
      <p className="mb-1 text-[12px] font-medium text-black">Price</p>
      <select
        value={filters.priceRange}
        onChange={(e) => handleFilterChange("priceRange", e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
      >
        <option value="">Select Price Range</option>
        {priceOptions.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.display}
          </option>
        ))}
      </select>
    </div>

    {/* Area */}
    <div>
      <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
      <select
        value={filters.areaSqft}
        onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
      >
        <option value="">Select Area (Sqft)</option>
        {areaOptions.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.display}
          </option>
        ))}
      </select>
    </div>

    {/* Seating */}
    <div>
      <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
      <select
        value={filters.seatingCapacity}
        onChange={(e) =>
          handleFilterChange("seatingCapacity", e.target.value)
        }
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
      >
        <option value="">Select Seating Capacity</option>
        {seatingOptions.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.display}
          </option>
        ))}
      </select>
    </div>

    {/* Furnishing */}
    <div>
      <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
      <select
        value={filters.furnishingLevel}
        onChange={(e) =>
          handleFilterChange("furnishingLevel", e.target.value)
        }
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
      >
        <option value="">Select Furnishing</option>
        <option value="Ready to Move">Ready to Move</option>
        <option value="Fully Furnished">Fully Furnished</option>
        <option value="Semi Furnished">Semi Furnished</option>
      </select>
    </div>
  </div>
</div>
      {/* Cards + Right Panel Section */}
      <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
        {/* Left Side - Office Cards */}
        <div className="flex flex-col gap-6 w-[887px]">
        {loading ? (
    <div className="text-center py-10 text-gray-500">Loading...</div>
  ) : data.length === 0 ? (
    <div className="text-center py-10 text-gray-500 text-lg font-medium">
      No data found.
    </div>
  ) : (
        data.map((office, index) => {
        const currentImg =
        office.images?.[currentImageIndex[index] || 0] || "";


        const handleCardClick = (office) => {
          navigate(`/office/${office._id}?category=${selectedCategory}`, {
            state: {
              city: office?.location?.city || "",
              relatedProperties: data, 
            },
          });
        };              
  const isRestricted = !visitorId && index >= 3;

  return (
    <div
      key={office._id}
      className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
      // onClick={() => handleCardClick(office._id)} // ✅ click card
      onClick={() => handleCardClick(office)}
    >
      {/* Overlay for restricted users */}
      {isRestricted && (
        <div
          className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
            onClick={(e) => {
              e.stopPropagation();
              handleContactQuoteClick();
              setIsModalOpen(true);
            }}
          >
            Please Login to View the Space
          </button>
        </div>
      )}

      {/* Left Image Section */}
      <div
        className="relative w-[430px] h-[302px] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
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
              className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext(index, office.images.length);
              }}
              className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

          {/* Right Content Section */}
          <div className="relative flex-1 p-4">
            {/* Save Button */}
                        {/* Save Button */}
<div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
  <button
    onClick={() => {
      if (!visitorId) {
        handleContactQuoteClick(); // Prompt login
      } else {
        handleSave(office._id); // Save if logged in
      }
    }}
    className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
  >
    <span className="text-white">★</span>
  </button>

  {savedSpaces.includes(office._id) && (
    <span className="text-orange-500 text-[12px] mt-1">Saved</span>
  )}
</div>

            {/* Title */}
            <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
              {office.buildingName}
            </h2>

            {/* Type */}
            <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
              <span className="font-medium text-[#16607B] ">
                {office.type}
              </span>{" "}
              Space
            </p>

            {/* Location */}
            <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
              <MapPin size={14} className="text-[#dc8903] " />{" "}
              {office.location?.address}, {office.location?.city}
            </p>

            {/* Blue Box */}
            {/* <GroupsScroller
              groups={[
                  // Group 1
    <>
    <div className="flex flex-col w-[111px] items-center justify-center">
      <p className="text-[13px] text-white font-regular">Seater Offered</p>
      <span className="text-[14px] text-white font-bold">
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
              
            /> */}


            {/* Blue Box */}
{/* Blue Box */}
<GroupsScroller
  groups={[


    // Group 2
    <div className="flex justify-around w-full">
      {/* Floors - only for non-managed */}
      {office?.type !== "managed" && (
        <div className="flex flex-col w-[111px] items-center justify-center">
          <p className="text-[13px] text-white font-regular">Floors</p>
          <span className="text-[14px] text-white font-bold">
            {office.generalInfo.floors}
          </span>
        </div>
      )}

      {/* Furnishing */}
      <div className="flex flex-col w-[111px] items-center justify-center">
        <p className="text-[13px] text-white font-regular">Furnishing</p>
        <span className="text-[14px] text-white font-bold">
          {office.generalInfo.furnishingLevel}
        </span>
      </div>

      {/* Air Conditioning */}
      <div className="flex flex-col w-[111px] items-center justify-center">
        <p className="text-[13px] text-white font-regular">Air Conditioning</p>
        <span className="text-[14px] text-white font-bold">
          {office.amenities?.airConditioners ? "Yes" : "No"}
        </span>
      </div>

      {/* Parking */}
      <div className="flex flex-col w-[111px] items-center justify-center">
        <p className="text-[13px] text-white font-regular">Parking</p>
        <span className="text-[14px] text-white font-bold">
          {office.amenities?.parking ? "Yes" : "No"}
        </span>
      </div>
    </div>,

    // Group 3
    <div className="flex justify-around w-full">
      {/* Security */}
      <div className="flex flex-col w-[111px] items-center justify-center">
        <p className="text-[13px] text-white font-regular">Security24x7</p>
        <span className="text-[14px] text-white font-bold">
          {office.amenities?.security24x7 ? "Yes" : "No"}
        </span>
      </div>

      {/* Wifi */}
      <div className="flex flex-col w-[111px] items-center justify-center">
        <p className="text-[13px] text-white font-regular">Wifi</p>
        <span className="text-[14px] text-white font-bold">
          {office.amenities?.wifi ? "Yes" : "No"}
        </span>
      </div>

      {/* Washrooms */}
      <div className="flex flex-col w-[111px] items-center justify-center">
        <p className="text-[13px] text-white font-regular">Washrooms</p>
        <span className="text-[14px] text-white font-bold">
          {office.amenities?.washrooms ? "Yes" : "No"}
        </span>
      </div>

     
    </div>,
        // Group 1
        <div className="flex justify-around w-full">
        {/* Seater Offered */}
        <div className="flex flex-col w-[111px] items-center justify-center">
          <p className="text-[13px] text-white font-regular">Seater Offered</p>
          <span className="text-[14px] text-white font-bold">
            {office.generalInfo.seaterOffered}
          </span>
        </div>
  
        {/* Floor Size - only for non-managed */}
        {office?.type !== "managed" && (
          <div className="flex flex-col w-[111px] items-center justify-center">
            <p className="text-[13px] text-white font-regular">Floor Size</p>
            {(() => {
              const floorSize = office?.generalInfo?.floorSize || "";
              if (!floorSize) return <span className="text-[14px] text-white text-center">N/A</span>;
              const [value, unit] = floorSize.split(/ (.+)/);
              return (
                <span className="text-[14px] text-white text-center">
                  <span className="font-bold">{value}</span>{" "}
                  <span className="text-[12px] font-regular">{unit}</span>
                </span>
              );
            })()}
          </div>
        )}
  
        {/* Built-Up Area - only for non-managed */}
        {office?.type !== "managed" && (
          <div className="flex flex-col w-[111px] items-center justify-center">
            <p className="text-[13px] text-white font-regular">Built-Up Area</p>
            {(() => {
              const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
              if (!builtUp) return <span className="text-[14px] text-white text-center">N/A</span>;
              const [value, unit] = builtUp.split(/ (.+)/);
              return (
                <span className="text-[14px] text-white text-center">
                  <span className="font-bold">{value}</span>{" "}
                  <span className="text-[12px] font-regular">{unit}</span>
                </span>
              );
            })()}
          </div>
        )}
  
        {/* Lock-in */}
        <div className="flex flex-col w-[111px] items-center justify-center">
          <p className="text-[13px] text-white font-regular">Lock-in</p>
          <span className="text-[14px] text-white font-bold">
            {office.generalInfo.lockInPeriod}
          </span>
        </div>
         {/* View More */}
      <div className="flex flex-col w-[111px] items-center justify-center">
        <p className="text-[13px] text-white font-bold underline cursor-pointer">
          View More
        </p>
      </div>
      </div>,
  ]}
/>



            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[16px] text-[#16607B] ml-5">
                  Quoted Price
                </p>
                <p className="ml-5 text-[18px] font-bold text-gray-800">
                  ₹{office.generalInfo?.rentPerSeat}{" "}
                  <span className="text-[12px] text-[#16607B] font-regular">
                    / Seat
                  </span>
                </p>
              </div>
              <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
                 onClick={(e) => {
                  e.stopPropagation();
                  handleContactQuoteClick();
                }}// 🚫 prevent nav
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
        {/* Right Side - User Details Card */}
        <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
  {/* Intro Text */}
  <h2 className="mb-4 text-[12px] text-[#374151] font-bold text-center">
    Upgrade your Space office with {user?.fullName || "Our Team"} to get the best price and best deals for your office space.
  </h2>

  {/* Profile Section */}
  <div className="flex items-start justify-between w-full h-[166px] gap-2">
    {/* Left: Profile Image */}
    <div className="w-[94px] h-[94px] p-[5px] rounded-full border-2 border-gray-300 overflow-hidden">
      <img
        src={user?.profileImage || "https://via.placeholder.com/94"}
        alt={user?.fullName || "Handler"}
        className="object-cover w-full h-full rounded-full"
      />
    </div>

    {/* Right: Profile Details + Button */}
    <div className="flex flex-col items-center">
      <div className="flex flex-col space-y-1 ml-[70px]">
        <h3 className="text-[15px] font-bold text-[#374151]">{user?.fullName}</h3>
        <p className="text-[13px] text-gray-600">{user?.mobile}</p>
        <p className="text-[13px] text-gray-600">{user?.email}</p>
      </div>
  
      <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
    onClick={(e) => {
                  e.stopPropagation();
                  handleContactQuoteClick();
                }}// 🚫 prevent nav
              >
Contact {user?.fullName?.split(" ")[0]}
</button>

    </div>
  </div>

  {/* Info Box */}
  <div className="flex justify-center mt-6">
    <div className="w-[415px] h-[52px] bg-gray-100 rounded p-3 text-center text-[12px] text-gray-700 leading-snug">
      {user?.fullName} and team assisted{" "}
      <strong className="font-bold text-gray-900">500+ corporates</strong> in Bangalore to move into their new office.
    </div>
  </div>

  {/* Logos Section */}
  <div className="flex justify-center items-center mt-2 gap-[20px]">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s" alt="Logo1" className="w-[30px] h-[30px]" />
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9sr6IsCZ-qq-QNd2dQaZOXnIxcR4RxM3yw&s" alt="Logo2" className="w-[30px] h-[30px]" />
    <img src="https://static.vecteezy.com/system/resources/previews/054/241/154/non_2x/the-logo-for-the-company-which-is-called-the-green-leaf-vector.jpg" alt="Logo3" className="w-[30px] h-[30px]" />
    <img src="https://static.vecteezy.com/system/resources/previews/043/210/641/non_2x/a-person-standing-on-a-green-leaf-create-a-minimalistic-design-symbolizing-health-and-wellness-using-only-basic-shapes-and-colors-free-vector.jpg" alt="Logo4" className="w-[30px] h-[30px]" />
    <img src="https://static.vecteezy.com/system/resources/thumbnails/000/091/902/small_2x/free-golden-wings-logo-vector.jpg" alt="Logo5" className="w-[30px] h-[30px]" />
  </div>

  {/* Key Points Section */}
  <div className="mt-3 text-[12px] text-gray-700">
    <p className="mb-2 font-bold">
      Explore workspace solutions with our expert guidance:
    </p>
    <ul className="space-y-2">
      <li className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-600" />
        <span>Workspace selection & location strategy</span>
      </li>
      <li className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-600" />
        <span>Workspace tours</span>
      </li>
      <li className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-600" />
        <span>Layout design & customization assistance</span>
      </li>
      <li className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-600" />
        <span>Terms negotiations & deal signing</span>
      </li>
    </ul>

    {/* Button at bottom center */}
    <div className="flex justify-center mt-3">
        <button
          onClick={handleContactQuoteClick}
          className="w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
        >
          Contact Quote
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 py-10 border-t border-gray-200 mt-6">

{/* Pagination Controls */}
<div className="flex items-center">
  <button
    className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50 transition"
    onClick={() => setPage((p) => Math.max(p - 1, 1))}
    disabled={page === 1}
  >
    Prev
  </button>

  <span className="mx-4 text-gray-600 text-sm">
    Page <span className="font-semibold">{page}</span> of{" "}
    <span className="font-semibold">{Math.ceil(total / pageSize) || 1}</span>
  </span>

  <button
    className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-r-md hover:bg-gray-100 disabled:opacity-50 transition"
    onClick={() => setPage((p) => p + 1)}
    disabled={data.length < pageSize}
  >
    Next
  </button>
</div>

{/* Reset Filters Button */}
<button
  onClick={resetFilters}
  className="border border-gray-400 text-gray-700 font-medium px-5 py-2 rounded-md hover:bg-gray-100 transition"
>
  Reset Filters
</button>
</div>
  {/* Modal */}
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
<LeadEnquiryModal
  isOpen={isLeadModalOpen}
  onClose={() => setIsLeadModalOpen(false)}
  onSubmit={handleLeadSubmit}
  leadMessage={leadMessage}
  setLeadMessage={setLeadMessage}
/>
  </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;








//=====>> Old on fixing card slow


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
// // pagination states
// const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [total, setTotal] = useState(0);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

//   //OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); 
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   //model states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
// const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");
// const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };


//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const result = await searchManagedOffices(1, 100);
  
//         const dataArray = Array.isArray(result) ? result : result.data || [];
//         setAllData(dataArray);
  
//         if (dataArray.length > 0) {
//           setUserId(dataArray[0].assigned_agent || null);
//           setOfficeId(dataArray[0]._id || null);
  
//           const uniqueCities = [
//             ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         } else {
//           setUserId(null);
//           setOfficeId(null);
//           setCities([]);
//         }
  
//         console.log("***************************", dataArray);
//       } catch (err) {
//         console.error("Error fetching managed offices:", err);
//         setAllData([]);
//         setUserId(null);
//         setOfficeId(null);
//         setCities([]);
//       }
//     };
//     fetchAll();
//   }, []);
  

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
  
//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );
  
//       const apiCall = getApiByCategory(filters.category);
  
//       const result = await apiCall(page, pageSize, cleanFilters);
  
//       // ✅ Support both array or object responses
//       if (Array.isArray(result)) {
//         setData(result);
//         setTotal(result.length); // fallback if no total from backend
//       } else {
//         setData(result.data || []);
//         setTotal(result.total || 0);
//       }
  
//       setLoading(false);
//     };
  
//     fetchData();
//   }, [filters, page, pageSize]);
  
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };
  
//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }
  
//     setFilters(newFilters);
//     setPage(1); // ✅ Reset page
  
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };

//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };


// const resetFilters = () => {
//   // Reset all filters
//   const reset = {
//     city: "",
//     zone: "",
//     locationOfProperty: "",
//     category: "managed",
//     priceRange: "",
//     areaSqft: "",
//     seatingCapacity: "",
//     furnishingLevel: "",
//   };
//   setFilters(reset);
//   setPage(1);

//   // Reset dependent dropdowns
//   setZones([]);
//   setLocations([]);

//   // Reset URL
//   navigate("/menu");

//   // Optionally, fetch all data for default view
//   const apiCall = getApiByCategory(reset.category);
//   apiCall(1, pageSize, {}).then((result) => {
//     if (Array.isArray(result)) {
//       setData(result);
//       setTotal(result.length);
//     } else {
//       setData(result.data || []);
//       setTotal(result.total || 0);
//     }
//   });
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

//   {/* Button Group */}
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-10 flex flex-col items-center -mt-30">
// <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//     {[
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ].map((cat) => (
//       <button
//         key={cat.value}
//         onClick={() => {
//           // Update both filters AND selectedCategory
//           handleFilterChange("category", cat.value);
//           setSelectedCategory(cat.value);
//           setPage(1); // optional: reset pagination
//         }}
//         className={`flex-1 font-semibold ${
//           selectedCategory === cat.value
//             ? "text-white bg-orange-500"
//             : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//         }`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-10 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {loading ? (
//     <div className="text-center py-10 text-gray-500">Loading...</div>
//   ) : data.length === 0 ? (
//     <div className="text-center py-10 text-gray-500 text-lg font-medium">
//       No data found.
//     </div>
//   ) : (
//         data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";


//         const handleCardClick = (office) => {
//           navigate(`/office/${office._id}?category=${selectedCategory}`, {
//             state: {
//               city: office?.location?.city || "",
//               relatedProperties: data, 
//             },
//           });
//         };              
//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       // onClick={() => handleCardClick(office._id)} // ✅ click card
//       onClick={() => handleCardClick(office)}
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleContactQuoteClick();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//                         {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,
//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })
//   )}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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

//       <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 py-10 border-t border-gray-200 mt-6">

// {/* Pagination Controls */}
// <div className="flex items-center">
//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//     disabled={page === 1}
//   >
//     Prev
//   </button>

//   <span className="mx-4 text-gray-600 text-sm">
//     Page <span className="font-semibold">{page}</span> of{" "}
//     <span className="font-semibold">{Math.ceil(total / pageSize) || 1}</span>
//   </span>

//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-r-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => p + 1)}
//     disabled={data.length < pageSize}
//   >
//     Next
//   </button>
// </div>

// {/* Reset Filters Button */}
// <button
//   onClick={resetFilters}
//   className="border border-gray-400 text-gray-700 font-medium px-5 py-2 rounded-md hover:bg-gray-100 transition"
// >
//   Reset Filters
// </button>
// </div>
//   {/* Modal */}
//   {isAuthModalOpen && (
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
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//=======================>>>>>>below is the final one 






// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
// // pagination states
// const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [total, setTotal] = useState(0);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

//   //OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); 
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   //model states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
// const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");
// const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   // useEffect(() => {
//   //   const fetchAll = async () => {
//   //     const result = await searchManagedOffices(1, 100);
//   //     setAllData(result);
//   //     setUserId(result[0].assigned_agent);
//   //     setOfficeId(result[0]._id);
//   //     console.log("***************************",result)
//   //     const uniqueCities = [
//   //       ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//   //     ];
//   //     setCities(uniqueCities);
//   //   };
//   //   fetchAll();
//   // }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const result = await searchManagedOffices(1, 100);
  
//         const dataArray = Array.isArray(result) ? result : result.data || [];
//         setAllData(dataArray);
  
//         if (dataArray.length > 0) {
//           setUserId(dataArray[0].assigned_agent || null);
//           setOfficeId(dataArray[0]._id || null);
  
//           const uniqueCities = [
//             ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         } else {
//           setUserId(null);
//           setOfficeId(null);
//           setCities([]);
//         }
  
//         console.log("***************************", dataArray);
//       } catch (err) {
//         console.error("Error fetching managed offices:", err);
//         setAllData([]);
//         setUserId(null);
//         setOfficeId(null);
//         setCities([]);
//       }
//     };
//     fetchAll();
//   }, []);
  

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
  
//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );
  
//       const apiCall = getApiByCategory(filters.category);
  
//       const result = await apiCall(page, pageSize, cleanFilters);
  
//       // ✅ Support both array or object responses
//       if (Array.isArray(result)) {
//         setData(result);
//         setTotal(result.length); // fallback if no total from backend
//       } else {
//         setData(result.data || []);
//         setTotal(result.total || 0);
//       }
  
//       setLoading(false);
//     };
  
//     fetchData();
//   }, [filters, page, pageSize]);
  
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };
  
//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }
  
//     setFilters(newFilters);
//     setPage(1); // ✅ Reset page
  
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };

//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };


// const resetFilters = () => {
//   // Reset all filters
//   const reset = {
//     city: "",
//     zone: "",
//     locationOfProperty: "",
//     category: "managed",
//     priceRange: "",
//     areaSqft: "",
//     seatingCapacity: "",
//     furnishingLevel: "",
//   };
//   setFilters(reset);
//   setPage(1);

//   // Reset dependent dropdowns
//   setZones([]);
//   setLocations([]);

//   // Reset URL
//   navigate("/menu");

//   // Optionally, fetch all data for default view
//   const apiCall = getApiByCategory(reset.category);
//   apiCall(1, pageSize, {}).then((result) => {
//     if (Array.isArray(result)) {
//       setData(result);
//       setTotal(result.length);
//     } else {
//       setData(result.data || []);
//       setTotal(result.total || 0);
//     }
//   });
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

//   {/* Button Group */}
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-10 flex flex-col items-center -mt-30">
// <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//     {[
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ].map((cat) => (
//       <button
//         key={cat.value}
//         onClick={() => {
//           // Update both filters AND selectedCategory
//           handleFilterChange("category", cat.value);
//           setSelectedCategory(cat.value);
//           setPage(1); // optional: reset pagination
//         }}
//         className={`flex-1 font-semibold ${
//           selectedCategory === cat.value
//             ? "text-white bg-orange-500"
//             : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//         }`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-10 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";


//         const handleCardClick = (office) => {
//           navigate(`/office/${office._id}?category=${selectedCategory}`, {
//             state: {
//               city: office?.location?.city || "",
//               relatedProperties: data, 
//             },
//           });
//         };
        
        
//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       // onClick={() => handleCardClick(office._id)} // ✅ click card
//       onClick={() => handleCardClick(office)}
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleContactQuoteClick();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//                         {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,
//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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

//       <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 py-10 border-t border-gray-200 mt-6">

// {/* Pagination Controls */}
// <div className="flex items-center">
//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//     disabled={page === 1}
//   >
//     Prev
//   </button>

//   <span className="mx-4 text-gray-600 text-sm">
//     Page <span className="font-semibold">{page}</span> of{" "}
//     <span className="font-semibold">{Math.ceil(total / pageSize) || 1}</span>
//   </span>

//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-r-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => p + 1)}
//     disabled={data.length < pageSize}
//   >
//     Next
//   </button>
// </div>

// {/* Reset Filters Button */}
// <button
//   onClick={resetFilters}
//   className="border border-gray-400 text-gray-700 font-medium px-5 py-2 rounded-md hover:bg-gray-100 transition"
// >
//   Reset Filters
// </button>
// </div>
//   {/* Modal */}
//   {isAuthModalOpen && (
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
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//=============>>> All are done end version 1 for webuser below 

// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
// // pagination states
// const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [total, setTotal] = useState(0);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

//   //OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); 
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   //model states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
// const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");
// const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   // useEffect(() => {
//   //   const fetchAll = async () => {
//   //     const result = await searchManagedOffices(1, 100);
//   //     setAllData(result);
//   //     setUserId(result[0].assigned_agent);
//   //     setOfficeId(result[0]._id);
//   //     console.log("***************************",result)
//   //     const uniqueCities = [
//   //       ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//   //     ];
//   //     setCities(uniqueCities);
//   //   };
//   //   fetchAll();
//   // }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const result = await searchManagedOffices(1, 100);
  
//         const dataArray = Array.isArray(result) ? result : result.data || [];
//         setAllData(dataArray);
  
//         if (dataArray.length > 0) {
//           setUserId(dataArray[0].assigned_agent || null);
//           setOfficeId(dataArray[0]._id || null);
  
//           const uniqueCities = [
//             ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         } else {
//           setUserId(null);
//           setOfficeId(null);
//           setCities([]);
//         }
  
//         console.log("***************************", dataArray);
//       } catch (err) {
//         console.error("Error fetching managed offices:", err);
//         setAllData([]);
//         setUserId(null);
//         setOfficeId(null);
//         setCities([]);
//       }
//     };
//     fetchAll();
//   }, []);
  

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setLoading(true);

//   //     const { category, ...apiFilters } = filters;
//   //     const cleanFilters = Object.fromEntries(
//   //       Object.entries(apiFilters).filter(([_, v]) => v !== "")
//   //     );

//   //     const apiCall = getApiByCategory(filters.category);
//   //     const result = await apiCall(1, 10, cleanFilters);
//   //     setData(result);
//   //     setLoading(false);
//   //   };
//   //   fetchData();
//   // }, [filters]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
  
//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );
  
//       const apiCall = getApiByCategory(filters.category);
  
//       const result = await apiCall(page, pageSize, cleanFilters);
  
//       // ✅ Support both array or object responses
//       if (Array.isArray(result)) {
//         setData(result);
//         setTotal(result.length); // fallback if no total from backend
//       } else {
//         setData(result.data || []);
//         setTotal(result.total || 0);
//       }
  
//       setLoading(false);
//     };
  
//     fetchData();
//   }, [filters, page, pageSize]);
  
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };
  
//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }
  
//     setFilters(newFilters);
//     setPage(1); // ✅ Reset page
  
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };

//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };


// const resetFilters = () => {
//   // Reset all filters
//   const reset = {
//     city: "",
//     zone: "",
//     locationOfProperty: "",
//     category: "managed",
//     priceRange: "",
//     areaSqft: "",
//     seatingCapacity: "",
//     furnishingLevel: "",
//   };
//   setFilters(reset);
//   setPage(1);

//   // Reset dependent dropdowns
//   setZones([]);
//   setLocations([]);

//   // Reset URL
//   navigate("/menu");

//   // Optionally, fetch all data for default view
//   const apiCall = getApiByCategory(reset.category);
//   apiCall(1, pageSize, {}).then((result) => {
//     if (Array.isArray(result)) {
//       setData(result);
//       setTotal(result.length);
//     } else {
//       setData(result.data || []);
//       setTotal(result.total || 0);
//     }
//   });
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

//   {/* Button Group */}
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-10 flex flex-col items-center -mt-30">
// <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//     {[
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ].map((cat) => (
//       <button
//         key={cat.value}
//         onClick={() => {
//           // Update both filters AND selectedCategory
//           handleFilterChange("category", cat.value);
//           setSelectedCategory(cat.value);
//           setPage(1); // optional: reset pagination
//         }}
//         className={`flex-1 font-semibold ${
//           selectedCategory === cat.value
//             ? "text-white bg-orange-500"
//             : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//         }`}
//       >
//         {cat.label}
//       </button>
//     ))}
//   </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-10 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";


//         const handleCardClick = (office) => {
//           navigate(`/office/${office._id}?category=${selectedCategory}`, {
//             state: {
//               city: office?.location?.city || "",
//               relatedProperties: data, 
//             },
//           });
//         };
        
        
//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       // onClick={() => handleCardClick(office._id)} // ✅ click card
//       onClick={() => handleCardClick(office)}
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleContactQuoteClick();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//                         {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,
//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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

//       <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 py-10 border-t border-gray-200 mt-6">

// {/* Pagination Controls */}
// <div className="flex items-center">
//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//     disabled={page === 1}
//   >
//     Prev
//   </button>

//   <span className="mx-4 text-gray-600 text-sm">
//     Page <span className="font-semibold">{page}</span> of{" "}
//     <span className="font-semibold">{Math.ceil(total / pageSize) || 1}</span>
//   </span>

//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-r-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => p + 1)}
//     disabled={data.length < pageSize}
//   >
//     Next
//   </button>
// </div>

// {/* Reset Filters Button */}
// <button
//   onClick={resetFilters}
//   className="border border-gray-400 text-gray-700 font-medium px-5 py-2 rounded-md hover:bg-gray-100 transition"
// >
//   Reset Filters
// </button>
// </div>
//   {/* Modal */}
//   {isAuthModalOpen && (
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
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//========>>>> Old with Pagination managed space

// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
// // pagination states
// const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [total, setTotal] = useState(0);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

//   //OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); 
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   //model states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
// const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");
// const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   // useEffect(() => {
//   //   const fetchAll = async () => {
//   //     const result = await searchManagedOffices(1, 100);
//   //     setAllData(result);
//   //     setUserId(result[0].assigned_agent);
//   //     setOfficeId(result[0]._id);
//   //     console.log("***************************",result)
//   //     const uniqueCities = [
//   //       ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//   //     ];
//   //     setCities(uniqueCities);
//   //   };
//   //   fetchAll();
//   // }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const result = await searchManagedOffices(1, 100);
  
//         const dataArray = Array.isArray(result) ? result : result.data || [];
//         setAllData(dataArray);
  
//         if (dataArray.length > 0) {
//           setUserId(dataArray[0].assigned_agent || null);
//           setOfficeId(dataArray[0]._id || null);
  
//           const uniqueCities = [
//             ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         } else {
//           setUserId(null);
//           setOfficeId(null);
//           setCities([]);
//         }
  
//         console.log("***************************", dataArray);
//       } catch (err) {
//         console.error("Error fetching managed offices:", err);
//         setAllData([]);
//         setUserId(null);
//         setOfficeId(null);
//         setCities([]);
//       }
//     };
//     fetchAll();
//   }, []);
  

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setLoading(true);

//   //     const { category, ...apiFilters } = filters;
//   //     const cleanFilters = Object.fromEntries(
//   //       Object.entries(apiFilters).filter(([_, v]) => v !== "")
//   //     );

//   //     const apiCall = getApiByCategory(filters.category);
//   //     const result = await apiCall(1, 10, cleanFilters);
//   //     setData(result);
//   //     setLoading(false);
//   //   };
//   //   fetchData();
//   // }, [filters]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
  
//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );
  
//       const apiCall = getApiByCategory(filters.category);
  
//       const result = await apiCall(page, pageSize, cleanFilters);
  
//       // ✅ Support both array or object responses
//       if (Array.isArray(result)) {
//         setData(result);
//         setTotal(result.length); // fallback if no total from backend
//       } else {
//         setData(result.data || []);
//         setTotal(result.total || 0);
//       }
  
//       setLoading(false);
//     };
  
//     fetchData();
//   }, [filters, page, pageSize]);
  
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };
  
//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }
  
//     setFilters(newFilters);
//     setPage(1); // ✅ Reset page
  
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };

//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };


// const resetFilters = () => {
//   // Reset all filters
//   const reset = {
//     city: "",
//     zone: "",
//     locationOfProperty: "",
//     category: "managed",
//     priceRange: "",
//     areaSqft: "",
//     seatingCapacity: "",
//     furnishingLevel: "",
//   };
//   setFilters(reset);
//   setPage(1);

//   // Reset dependent dropdowns
//   setZones([]);
//   setLocations([]);

//   // Reset URL
//   navigate("/menu");

//   // Optionally, fetch all data for default view
//   const apiCall = getApiByCategory(reset.category);
//   apiCall(1, pageSize, {}).then((result) => {
//     if (Array.isArray(result)) {
//       setData(result);
//       setTotal(result.length);
//     } else {
//       setData(result.data || []);
//       setTotal(result.total || 0);
//     }
//   });
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-20 flex flex-col items-center -mt-30">
//   {/* Button Group */}
//   <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//   {[
//     { label: "Managed Office", value: "managed" },
//     { label: "Office Space", value: "office" },
//     { label: "Co-Working Space", value: "co-working" },
//   ].map((cat) => (
//     <button
//       key={cat.value}
//       onClick={() => handleFilterChange("category", cat.value)}
//       className={`flex-1 font-semibold ${
//         filters.category === cat.value
//           ? "text-white bg-orange-500"
//           : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//       }`}
//     >
//       {cat.label}
//     </button>
//   ))}
// </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-24 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//         const handleCardClick = (office) => {
//           navigate(`/office/${office._id}?category=${selectedCategory}`, {
//             state: {
//               city: office?.location?.city || "",
//               relatedProperties: data, // optional, if you want related cards access
//             },
//           });
//         };
        
//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       // onClick={() => handleCardClick(office._id)} // ✅ click card
//       onClick={() => handleCardClick(office)}
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleContactQuoteClick();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//                         {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,

//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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

//       <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 py-10 border-t border-gray-200 mt-6">

// {/* Pagination Controls */}
// <div className="flex items-center">
//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//     disabled={page === 1}
//   >
//     Prev
//   </button>

//   <span className="mx-4 text-gray-600 text-sm">
//     Page <span className="font-semibold">{page}</span> of{" "}
//     <span className="font-semibold">{Math.ceil(total / pageSize) || 1}</span>
//   </span>

//   <button
//     className="border border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-r-md hover:bg-gray-100 disabled:opacity-50 transition"
//     onClick={() => setPage((p) => p + 1)}
//     disabled={data.length < pageSize}
//   >
//     Next
//   </button>
// </div>

// {/* Reset Filters Button */}
// <button
//   onClick={resetFilters}
//   className="border border-gray-400 text-gray-700 font-medium px-5 py-2 rounded-md hover:bg-gray-100 transition"
// >
//   Reset Filters
// </button>
// </div>
//   {/* Modal */}
//   {isAuthModalOpen && (
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
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//========>>> pagination working raw 1

// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
// // pagination states
// const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [total, setTotal] = useState(0);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

//   //OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); 
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   //model states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
// const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");
// const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   // useEffect(() => {
//   //   const fetchAll = async () => {
//   //     const result = await searchManagedOffices(1, 100);
//   //     setAllData(result);
//   //     setUserId(result[0].assigned_agent);
//   //     setOfficeId(result[0]._id);
//   //     console.log("***************************",result)
//   //     const uniqueCities = [
//   //       ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//   //     ];
//   //     setCities(uniqueCities);
//   //   };
//   //   fetchAll();
//   // }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const result = await searchManagedOffices(1, 100);
  
//         const dataArray = Array.isArray(result) ? result : result.data || [];
//         setAllData(dataArray);
  
//         if (dataArray.length > 0) {
//           setUserId(dataArray[0].assigned_agent || null);
//           setOfficeId(dataArray[0]._id || null);
  
//           const uniqueCities = [
//             ...new Set(dataArray.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         } else {
//           setUserId(null);
//           setOfficeId(null);
//           setCities([]);
//         }
  
//         console.log("***************************", dataArray);
//       } catch (err) {
//         console.error("Error fetching managed offices:", err);
//         setAllData([]);
//         setUserId(null);
//         setOfficeId(null);
//         setCities([]);
//       }
//     };
//     fetchAll();
//   }, []);
  

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setLoading(true);

//   //     const { category, ...apiFilters } = filters;
//   //     const cleanFilters = Object.fromEntries(
//   //       Object.entries(apiFilters).filter(([_, v]) => v !== "")
//   //     );

//   //     const apiCall = getApiByCategory(filters.category);
//   //     const result = await apiCall(1, 10, cleanFilters);
//   //     setData(result);
//   //     setLoading(false);
//   //   };
//   //   fetchData();
//   // }, [filters]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
  
//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );
  
//       const apiCall = getApiByCategory(filters.category);
  
//       const result = await apiCall(page, pageSize, cleanFilters);
  
//       // ✅ Support both array or object responses
//       if (Array.isArray(result)) {
//         setData(result);
//         setTotal(result.length); // fallback if no total from backend
//       } else {
//         setData(result.data || []);
//         setTotal(result.total || 0);
//       }
  
//       setLoading(false);
//     };
  
//     fetchData();
//   }, [filters, page, pageSize]);
  

//   // Handle filter change
//   // const handleFilterChange = (key, value) => {
//   //   let newFilters = { ...filters, [key]: value };

//   //   if (key === "city") {
//   //     newFilters.zone = "";
//   //     newFilters.locationOfProperty = "";
//   //   }
//   //   if (key === "zone") {
//   //     newFilters.locationOfProperty = "";
//   //   }

//   //   setFilters(newFilters);

//   //   const query = new URLSearchParams(
//   //     Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//   //   ).toString();
//   //   navigate(query ? `/menu?${query}` : `/menu`);
//   // };
  

//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };
  
//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }
  
//     setFilters(newFilters);
//     setPage(1); // ✅ Reset page
  
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };

//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };


//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-20 flex flex-col items-center -mt-30">
//   {/* Button Group */}
//   <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//   {[
//     { label: "Managed Office", value: "managed" },
//     { label: "Office Space", value: "office" },
//     { label: "Co-Working Space", value: "co-working" },
//   ].map((cat) => (
//     <button
//       key={cat.value}
//       onClick={() => handleFilterChange("category", cat.value)}
//       className={`flex-1 font-semibold ${
//         filters.category === cat.value
//           ? "text-white bg-orange-500"
//           : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//       }`}
//     >
//       {cat.label}
//     </button>
//   ))}
// </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-24 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//         const handleCardClick = (office) => {
//           navigate(`/office/${office._id}?category=${selectedCategory}`, {
//             state: {
//               city: office?.location?.city || "",
//               relatedProperties: data, // optional, if you want related cards access
//             },
//           });
//         };
        
//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       // onClick={() => handleCardClick(office._id)} // ✅ click card
//       onClick={() => handleCardClick(office)}
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleContactQuoteClick();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//                         {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,

//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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
//       <div className="flex justify-center items-center py-6">
//   <button
//     className="border border-gray-400 px-4 py-2 rounded-l-md disabled:opacity-50"
//     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//     disabled={page === 1}
//   >
//     Prev
//   </button>

//   <span className="mx-4 text-gray-700">
//     Page {page} of {Math.ceil(total / pageSize) || 1}
//   </span>

//   <button
//     className="border border-gray-400 px-4 py-2 rounded-r-md disabled:opacity-50"
//     onClick={() => setPage((p) => p + 1)}
//     disabled={data.length < pageSize}
//   >
//     Next
//   </button>
// </div>

//   {/* Modal */}

//   {isAuthModalOpen && (
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
//   </div>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default MenuPage;
//================>>>>> Old one without pagination 



// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

//   //OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); 
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   //model states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
// const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");
// const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };




// // const handleContactQuote = async () => {
// //   const visitorId = Cookies.get("visitorId");

// //   if (visitorId) {
// //     console.log("Visitor already exists with ID:", visitorId);
// //     alert("Visitor already exists, we will reach you.");
// //     return; // stop here
// //   }

// //   // else open form modal
// //   setIsModalOpen(true);
// // };

// // const handleFormSubmit = async (e) => {
// //   e.preventDefault();

// //   try {
// //     const res = await postVisitorData(formData);
// //     console.log("Visitor created:", res);

// //     // store visitorId in cookies
// //     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

// //     alert("Thanks for login. Quote request submitted successfully!");
// //     setIsModalOpen(false);
// //   } catch (error) {
// //     console.error("Error submitting quote:", error);
// //     alert("Something went wrong, please try again.");
// //   }
// // };


// // const handleLeadSubmit = async (e) => {
// //   e.preventDefault();
// //   const visitorId = Cookies.get("visitorId");

// //   if (!visitorId) {
// //     alert("Visitor not found, please login first.");
// //     return;
// //   }

// //   try {
// //     const leadData = {
// //       propertyId: officeId,
// //       visitorId: visitorId,
// //       assignedAgentId: userId,
// //       message: leadMessage,
// //     };
// //     console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)

// //     const res = await postLeadData(leadData);
// //     console.log("Lead created:", res);

// //     alert("Your enquiry has been submitted successfully!");
// //     setIsLeadModalOpen(false);
// //     setLeadMessage("");
// //   } catch (error) {
// //     console.error("Error submitting lead:", error);
// //     alert("Something went wrong while submitting lead.");
// //   }
// // };

// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// // const handleCardClick = (officeId) => {
// //   navigate(`/office/${officeId}?category=${selectedCategory}`);
// // };

// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };


//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-20 flex flex-col items-center -mt-30">
//   {/* Button Group */}
//   <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//   {[
//     { label: "Managed Office", value: "managed" },
//     { label: "Office Space", value: "office" },
//     { label: "Co-Working Space", value: "co-working" },
//   ].map((cat) => (
//     <button
//       key={cat.value}
//       onClick={() => handleFilterChange("category", cat.value)}
//       className={`flex-1 font-semibold ${
//         filters.category === cat.value
//           ? "text-white bg-orange-500"
//           : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//       }`}
//     >
//       {cat.label}
//     </button>
//   ))}
// </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-24 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//         const handleCardClick = (office) => {
//           navigate(`/office/${office._id}?category=${selectedCategory}`, {
//             state: {
//               city: office?.location?.city || "",
//               relatedProperties: data, // optional, if you want related cards access
//             },
//           });
//         };
        

//   // const handleCardClick = (officeId) => {
//   //   if (!visitorId && index >= 3) {
//   //     // block navigation if not logged in & card is restricted
//   //     setIsModalOpen(true);
//   //     return;
//   //   }
//   //   // navigate(`/office/${officeId}?category=${filters.category}`);
//   //   navigate(`/office/${officeId}?category=${filters.category}`, {
//   //     state: {
//   //       city: filters.city,
//   //       relatedProperties: data, // only current filtered list
//   //     },
//   //   });
//   // };

//   // const handleCardClick = (officeId) => {
//   //   // Pass city and filtered list to Detail Page via state
//   //   navigate(`/office/${officeId}?category=${filters.category}`, {
//   //     state: {
//   //       city: filters.city,
//   //       relatedProperties: data, // only current filtered list
//   //     },
//   //   });
//   // };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       // onClick={() => handleCardClick(office._id)} // ✅ click card
//       onClick={() => handleCardClick(office)}
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleContactQuoteClick();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//                         {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,

//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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

//   {isAuthModalOpen && (
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
//   </div>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default MenuPage;








//===>> Old one updating city for related card

// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

//   //OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); 
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   //model states
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
// const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");
// const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };




// // const handleContactQuote = async () => {
// //   const visitorId = Cookies.get("visitorId");

// //   if (visitorId) {
// //     console.log("Visitor already exists with ID:", visitorId);
// //     alert("Visitor already exists, we will reach you.");
// //     return; // stop here
// //   }

// //   // else open form modal
// //   setIsModalOpen(true);
// // };

// // const handleFormSubmit = async (e) => {
// //   e.preventDefault();

// //   try {
// //     const res = await postVisitorData(formData);
// //     console.log("Visitor created:", res);

// //     // store visitorId in cookies
// //     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

// //     alert("Thanks for login. Quote request submitted successfully!");
// //     setIsModalOpen(false);
// //   } catch (error) {
// //     console.error("Error submitting quote:", error);
// //     alert("Something went wrong, please try again.");
// //   }
// // };


// // const handleLeadSubmit = async (e) => {
// //   e.preventDefault();
// //   const visitorId = Cookies.get("visitorId");

// //   if (!visitorId) {
// //     alert("Visitor not found, please login first.");
// //     return;
// //   }

// //   try {
// //     const leadData = {
// //       propertyId: officeId,
// //       visitorId: visitorId,
// //       assignedAgentId: userId,
// //       message: leadMessage,
// //     };
// //     console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)

// //     const res = await postLeadData(leadData);
// //     console.log("Lead created:", res);

// //     alert("Your enquiry has been submitted successfully!");
// //     setIsLeadModalOpen(false);
// //     setLeadMessage("");
// //   } catch (error) {
// //     console.error("Error submitting lead:", error);
// //     alert("Something went wrong while submitting lead.");
// //   }
// // };

// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };

// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };


//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-20 flex flex-col items-center -mt-30">
//   {/* Button Group */}
//   <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//   {[
//     { label: "Managed Office", value: "managed" },
//     { label: "Office Space", value: "office" },
//     { label: "Co-Working Space", value: "co-working" },
//   ].map((cat) => (
//     <button
//       key={cat.value}
//       onClick={() => handleFilterChange("category", cat.value)}
//       className={`flex-1 font-semibold ${
//         filters.category === cat.value
//           ? "text-white bg-orange-500"
//           : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//       }`}
//     >
//       {cat.label}
//     </button>
//   ))}
// </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-24 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleContactQuoteClick();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//                         {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,

//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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

//   {isAuthModalOpen && (
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

//   {/* <AuthModal
//   isOpen={isAuthModalOpen} // <-- correct state
//   onClose={() => setIsAuthModalOpen(false)}
//   onSuccess={() => setIsLeadModalOpen(true)}
// />

// <LeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// /> */}
//   </div>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default MenuPage;


/////========>>>> Comment removed one ----------->> Use this 

// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";

// import { useLocation } from "react-router-dom";   
// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);

// const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   //==>>Use this
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorIdState);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };
  
//     if (visitorIdState) {
//       fetchWishlist();
//     } else {
//       setSavedSpaces([]); // ✅ clear saved state after logout
//     }
//   }, [visitorIdState]);
  
// //======>> Use this
//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };

//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };


// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// /////===========>>> Use this
// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };



// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };
// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>
//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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

//   <AuthModal
//   isOpen={isAuthModalOpen} // <-- correct state
//   onClose={() => setIsAuthModalOpen(false)}
//   onSuccess={() => setIsLeadModalOpen(true)}
// />

// <LeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;



//===============>>> Old all are login flow implemented




// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";

// import { useLocation } from "react-router-dom";   
// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);

// const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorIdState);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };
  
//     if (visitorIdState) {
//       fetchWishlist();
//     } else {
//       setSavedSpaces([]); // ✅ clear saved state after logout
//     }
//   }, [visitorIdState]);
  

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     // If cookie exists → open Lead Modal instead of alert
// //     setIsLeadModalOpen(true);
// //   } else {
// //     // Else → open Login modal
// //     setIsModalOpen(true);
// //   }
// // };

// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     setIsLeadModalOpen(true); // existing lead modal
// //   } else {
// //     setAuthStep("email"); // start email OTP flow
// //     setAuthError("");
// //     setVisitorEmail("");
// //     setVisitorName("");
// //     setOtp("");
// //     setIsModalOpen(true); // reuse modal for OTP
// //   }
// // };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };


// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// // const handleLeadSubmit = async (e) => {
// //   e.preventDefault();
// //   const visitorId = Cookies.get("visitorId");
// //   if (!visitorId) {
// //     alert("Visitor not found, please login first.");
// //     return;
// //   }
// //   try {
// //     const leadData = {
// //       propertyId: officeId,
// //       visitorId: visitorId,
// //       assignedAgentId: userId,
// //       message: leadMessage,
// //     };

// //     await postLeadData(leadData);

// //     // Close lead modal and show success modal
// //     setIsLeadModalOpen(false);
// //     setIsSuccessModalOpen(true);
// //     setLeadMessage("");
// //   } catch (error) {
// //     console.error("Error submitting lead:", error);
// //     alert("Something went wrong while submitting lead.");
// //   }
// // };


// const handleLeadSubmit = async (messageToSend) => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) return false;

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: messageToSend ?? leadMessage, // use passed message or fallback
//     };

//     await postLeadData(leadData);
//     setLeadMessage(""); // reset message
//     return true;
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     return false;
//   }
// };



// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };
// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>
//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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

//   <AuthModal
//   isOpen={isAuthModalOpen} // <-- correct state
//   onClose={() => setIsAuthModalOpen(false)}
//   onSuccess={() => setIsLeadModalOpen(true)}
// />

// <LeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//========OLd menu final one


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";

// import { useLocation } from "react-router-dom";   
// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);

// const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorIdState);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };
  
//     if (visitorIdState) {
//       fetchWishlist();
//     } else {
//       setSavedSpaces([]); // ✅ clear saved state after logout
//     }
//   }, [visitorIdState]);
  

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     // If cookie exists → open Lead Modal instead of alert
// //     setIsLeadModalOpen(true);
// //   } else {
// //     // Else → open Login modal
// //     setIsModalOpen(true);
// //   }
// // };

// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     setIsLeadModalOpen(true); // existing lead modal
// //   } else {
// //     setAuthStep("email"); // start email OTP flow
// //     setAuthError("");
// //     setVisitorEmail("");
// //     setVisitorName("");
// //     setOtp("");
// //     setIsModalOpen(true); // reuse modal for OTP
// //   }
// // };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };


// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// // const handleLeadSubmit = async (e) => {
// //   e.preventDefault();
// //   const visitorId = Cookies.get("visitorId");
// //   if (!visitorId) {
// //     alert("Visitor not found, please login first.");
// //     return;
// //   }
// //   try {
// //     const leadData = {
// //       propertyId: officeId,
// //       visitorId: visitorId,
// //       assignedAgentId: userId,
// //       message: leadMessage,
// //     };

// //     await postLeadData(leadData);

// //     // Close lead modal and show success modal
// //     setIsLeadModalOpen(false);
// //     setIsSuccessModalOpen(true);
// //     setLeadMessage("");
// //   } catch (error) {
// //     console.error("Error submitting lead:", error);
// //     alert("Something went wrong while submitting lead.");
// //   }
// // };


// const handleLeadSubmit = async () => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) {
//     alert("Visitor not found, please login first.");
//     return false;
//   }
//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId,
//       assignedAgentId: userId,
//       message: leadMessage,
//     };
//     await postLeadData(leadData);
//     return true; // ✅ indicates success
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     alert("Something went wrong while submitting lead.");
//     return false;
//   }
// };


// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };
// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>
//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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

//   <AuthModal
//   isOpen={isAuthModalOpen} // <-- correct state
//   onClose={() => setIsAuthModalOpen(false)}
//   onSuccess={() => setIsLeadModalOpen(true)}
// />


// <LeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//=============>>> Old home changes


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";

// import { useLocation } from "react-router-dom";   
// import AuthModal from "./component/AuthModal";
// import LeadEnquiryModal from "./component/LeadEnquiryModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);

// const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     // If cookie exists → open Lead Modal instead of alert
// //     setIsLeadModalOpen(true);
// //   } else {
// //     // Else → open Login modal
// //     setIsModalOpen(true);
// //   }
// // };

// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     setIsLeadModalOpen(true); // existing lead modal
// //   } else {
// //     setAuthStep("email"); // start email OTP flow
// //     setAuthError("");
// //     setVisitorEmail("");
// //     setVisitorName("");
// //     setOtp("");
// //     setIsModalOpen(true); // reuse modal for OTP
// //   }
// // };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };


// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// // const handleLeadSubmit = async (e) => {
// //   e.preventDefault();
// //   const visitorId = Cookies.get("visitorId");
// //   if (!visitorId) {
// //     alert("Visitor not found, please login first.");
// //     return;
// //   }
// //   try {
// //     const leadData = {
// //       propertyId: officeId,
// //       visitorId: visitorId,
// //       assignedAgentId: userId,
// //       message: leadMessage,
// //     };

// //     await postLeadData(leadData);

// //     // Close lead modal and show success modal
// //     setIsLeadModalOpen(false);
// //     setIsSuccessModalOpen(true);
// //     setLeadMessage("");
// //   } catch (error) {
// //     console.error("Error submitting lead:", error);
// //     alert("Something went wrong while submitting lead.");
// //   }
// // };


// const handleLeadSubmit = async () => {
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) {
//     alert("Visitor not found, please login first.");
//     return false;
//   }
//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId,
//       assignedAgentId: userId,
//       message: leadMessage,
//     };
//     await postLeadData(leadData);
//     return true; // ✅ indicates success
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     alert("Something went wrong while submitting lead.");
//     return false;
//   }
// };


// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };
// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar 
//   visitorId={visitorId} 
//   onLoginRequired={handleContactQuoteClick} 
// />

// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>
//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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

//   <AuthModal
//   isOpen={isAuthModalOpen} // <-- correct state
//   onClose={() => setIsAuthModalOpen(false)}
//   onSuccess={() => setIsLeadModalOpen(true)}
// />


// <LeadEnquiryModal
//   isOpen={isLeadModalOpen}
//   onClose={() => setIsLeadModalOpen(false)}
//   onSubmit={handleLeadSubmit}
//   leadMessage={leadMessage}
//   setLeadMessage={setLeadMessage}
// />
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








///----------->>> One reusable done working on 2

// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";

// import { useLocation } from "react-router-dom";   
// import AuthModal from "./component/AuthModal";

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);

// const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     // If cookie exists → open Lead Modal instead of alert
// //     setIsLeadModalOpen(true);
// //   } else {
// //     // Else → open Login modal
// //     setIsModalOpen(true);
// //   }
// // };

// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     setIsLeadModalOpen(true); // existing lead modal
// //   } else {
// //     setAuthStep("email"); // start email OTP flow
// //     setAuthError("");
// //     setVisitorEmail("");
// //     setVisitorName("");
// //     setOtp("");
// //     setIsModalOpen(true); // reuse modal for OTP
// //   }
// // };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email");
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsAuthModalOpen(true); // <-- use this state
//   }
// };


// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleLeadSubmit = async (e) => {
//   e.preventDefault();
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) {
//     alert("Visitor not found, please login first.");
//     return;
//   }
//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: leadMessage,
//     };

//     await postLeadData(leadData);

//     // Close lead modal and show success modal
//     setIsLeadModalOpen(false);
//     setIsSuccessModalOpen(true);
//     setLeadMessage("");
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     alert("Something went wrong while submitting lead.");
//   }
// };


// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };
// const handleSaveClick = (officeId) => {
//   if (!visitorId) {
//     setIsAuthModalOpen(true); // show login modal if not logged in
//   } else {
//     handleSave(officeId); // normal save
//   }
// };

//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar visitorId={visitorId} /> {/* ✅ also fixed visitorId */}
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>
//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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

//   <AuthModal
//   isOpen={isAuthModalOpen} // <-- correct state
//   onClose={() => setIsAuthModalOpen(false)}
//   onSuccess={() => setIsLeadModalOpen(true)}
// />


// {/* Lead Modal */}
// {isLeadModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
      
//       <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//         Send Your Enquiry
//       </h2>
//       <p className="text-sm text-gray-500 text-center mb-5">
//         Let us know your interest. Our team will reach out soon.
//       </p>

//       <form onSubmit={handleLeadSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your message (optional)"
//           value={leadMessage}
//           onChange={(e) => setLeadMessage(e.target.value)}
//           className="w-full h-[60px] px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
//         />

//         <p className="text-[13px] text-gray-500 mb-4 leading-[18px]">
//           After you submit a workspace enquiry to us, we may share your details with workspace providers,
//           who may contact you to follow up on your enquiry. Please read our{" "}
//           <span className="text-blue-600 cursor-pointer hover:underline">
//             Privacy Policy
//           </span>{" "}
//           for details of how we process the information.
//         </p>

//         <div className="flex justify-between gap-4">
//           <button
//             type="button"
//             onClick={() => {
//               handleLeadSubmit(); // Trigger submit even on Cancel
//               setIsLeadModalOpen(false);
//             }}
//             className="w-1/2 h-[50px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="w-1/2 h-[50px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

// {/* Success Modal */}
// {isSuccessModalOpen && (
//   <div
//     className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm cursor-pointer"
//     onClick={() => setIsSuccessModalOpen(false)}
//   >
//     <div className="bg-white rounded-2xl w-[450px] max-w-[90%] p-8 shadow-2xl text-center transition-all duration-300">
//       <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//         Thank you for Reaching Out
//       </h2>
//       <p className="text-sm text-gray-600 leading-relaxed mb-6">
//         Our team will get back to you within 24 hours with your personalised quote.
//       </p>
//       <button
//         className="mt-4 w-full h-[50px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
//         onClick={() => setIsSuccessModalOpen(false)}
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )}
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//------->> Making reusable compoennet




// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);

// const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     // If cookie exists → open Lead Modal instead of alert
// //     setIsLeadModalOpen(true);
// //   } else {
// //     // Else → open Login modal
// //     setIsModalOpen(true);
// //   }
// // };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email"); // start email OTP flow
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsModalOpen(true); // reuse modal for OTP
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };

// const handleLeadSubmit = async (e) => {
//   e.preventDefault();
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) {
//     alert("Visitor not found, please login first.");
//     return;
//   }
//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: leadMessage,
//     };

//     await postLeadData(leadData);

//     // Close lead modal and show success modal
//     setIsLeadModalOpen(false);
//     setIsSuccessModalOpen(true);
//     setLeadMessage("");
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     alert("Something went wrong while submitting lead.");
//   }
// };


// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };


//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar visitorId={visitorId} /> {/* ✅ also fixed visitorId */}
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
// <div className="absolute flex flex-col items-center top-4 right-4" onClick={(e) => e.stopPropagation()}>
//   <button
//     onClick={() => {
//       if (!visitorId) {
//         handleContactQuoteClick(); // Prompt login
//       } else {
//         handleSave(office._id); // Save if logged in
//       }
//     }}
//     className={`w-8 h-8 rounded flex items-center justify-center ${savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"}`}
//   >
//     <span className="text-white">★</span>
//   </button>

//   {savedSpaces.includes(office._id) && (
//     <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//   )}
// </div>
//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
      
//       {/* STEP 1: Email Entry */}
//       {authStep === "email" && (
//         <>
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//             Please login to continue
//           </h2>
//           <p className="text-lg text-gray-500 mb-6 text-center">
//             Get started to grab the best offers on top workspace
//           </p>

//           <input
//             type="email"
//             placeholder="Please enter your email"
//             value={visitorEmail}
//             onChange={(e) => setVisitorEmail(e.target.value)}
//             className="w-full h-[64px] border border-gray-300 rounded-xl px-5 text-[16px] placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
//           />

//           {authError && (
//             <p className="text-red-500 text-sm mb-3 text-center">{authError}</p>
//           )}

//           <p className="text-[14px] text-gray-600 text-center mb-6 leading-[20px]">
//             By proceeding, you agree to Fidelitus Corp{" "}
//             <span className="text-blue-600 cursor-pointer hover:underline">
//               Terms and Conditions
//             </span>{" "}
//             and that you have read our{" "}
//             <span className="text-blue-600 cursor-pointer hover:underline">
//               Privacy Policy
//             </span>.
//           </p>

//           <div className="flex justify-between gap-4">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="w-1/2 h-[60px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSendOtp}
//               className="w-1/2 h-[60px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
//             >
//               Send OTP
//             </button>
//           </div>
//         </>
//       )}
// {/* STEP 2: OTP Entry */}
// {authStep === "otp" && (
//   <>
//     {/* Header */}
//     <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//       {isNewVisitor ? "Sign Up" : "Enter OTP"}
//     </h2>

//     {/* Email info with edit */}
//     <p className="text-md text-orange-500 mb-4 text-center">
//       Please enter OTP sent on <span className="font-medium">{visitorEmail}</span>{" "}
//       <span
//         className="ml-2 text-blue-600 cursor-pointer underline"
//         onClick={() => setAuthStep("email")}
//       >
//         Edit
//       </span>
//     </p>

//     {/* New Visitor: Name, Mobile, City */}
//     {isNewVisitor && (
//       <div className="space-y-3 mb-6">
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={visitorName}
//           onChange={(e) => setVisitorName(e.target.value)}
//           className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <input
//           type="text"
//           placeholder="Mobile Number"
//           value={formData.mobile}
//           onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//           className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <input
//           type="text"
//           placeholder="City"
//           value={formData.city}
//           onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//           className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//       </div>
//     )}
//     {/* OTP Inputs */}
// <div className="flex justify-center gap-3 my-4">
//   {[...Array(6)].map((_, idx) => (
//     <input
//       key={idx}
//       type="text"
//       maxLength={1}
//       value={otp[idx] || ""}
//       onChange={(e) => {
//         const val = e.target.value.replace(/[^0-9]/g, "");
//         let newOtp = otp.split("");
//         newOtp[idx] = val;
//         setOtp(newOtp.join(""));
//         if (val && idx < 5) {
//           document.getElementById(`otp-${idx + 1}`)?.focus();
//         }
//       }}
//       id={`otp-${idx}`}
//       className="w-10 h-12 text-center text-lg border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//     />
//   ))}
// </div>

// {/* Invalid OTP Error */}
// {authError && (
//   <p className="text-red-500 text-center text-sm mb-4">
//     {authError}
//   </p>
// )}

//     {/* Resend OTP */}
//     <p className="text-sm text-gray-500 text-center mb-4">
//   Didn't receive OTP?{" "}
//   <span
//     className="text-blue-600 cursor-pointer underline"
//     onClick={() => {
//       handleSendOtp();  // send OTP again
//       setOtp("");       // clear all OTP boxes
//     }}
//   >
//     Resend OTP
//   </span>
// </p>
//     {/* Terms & Privacy */}
//     <p className="text-[10px] text-gray-600 text-center mb-3 leading-[20px]">
//     By submitting your enquiry, your details may be shared with workspace providers who may contact you. Please review our {" "}
//       <span className="text-blue-600 cursor-pointer hover:underline">
//         Privacy Policy
//       </span>{" "}
//       and{" "}
//       <span className="text-blue-600 cursor-pointer hover:underline">
//         Terms and Conditions
//       </span>{" "}
//  for how we handle your information.
//     </p>

//     {/* Buttons */}
//     <div className="flex justify-between gap-4">
//       <button
//         onClick={() => setIsModalOpen(false)}
//         className="w-1/2 h-[55px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
//       >
//         Cancel
//       </button>
//       <button
//         onClick={handleVerifyOtp}
//         className="w-1/2 h-[55px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
//       >
//         Verify OTP
//       </button>
//     </div>
//   </>
// )}
//     </div>
//   </div>
// )}

// {/* Lead Modal */}
// {isLeadModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
      
//       <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//         Send Your Enquiry
//       </h2>
//       <p className="text-sm text-gray-500 text-center mb-5">
//         Let us know your interest. Our team will reach out soon.
//       </p>

//       <form onSubmit={handleLeadSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your message (optional)"
//           value={leadMessage}
//           onChange={(e) => setLeadMessage(e.target.value)}
//           className="w-full h-[60px] px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
//         />

//         <p className="text-[13px] text-gray-500 mb-4 leading-[18px]">
//           After you submit a workspace enquiry to us, we may share your details with workspace providers,
//           who may contact you to follow up on your enquiry. Please read our{" "}
//           <span className="text-blue-600 cursor-pointer hover:underline">
//             Privacy Policy
//           </span>{" "}
//           for details of how we process the information.
//         </p>

//         <div className="flex justify-between gap-4">
//           <button
//             type="button"
//             onClick={() => {
//               handleLeadSubmit(); // Trigger submit even on Cancel
//               setIsLeadModalOpen(false);
//             }}
//             className="w-1/2 h-[50px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="w-1/2 h-[50px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

// {/* Success Modal */}
// {isSuccessModalOpen && (
//   <div
//     className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm cursor-pointer"
//     onClick={() => setIsSuccessModalOpen(false)}
//   >
//     <div className="bg-white rounded-2xl w-[450px] max-w-[90%] p-8 shadow-2xl text-center transition-all duration-300">
//       <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//         Thank you for Reaching Out
//       </h2>
//       <p className="text-sm text-gray-600 leading-relaxed mb-6">
//         Our team will get back to you within 24 hours with your personalised quote.
//       </p>
//       <button
//         className="mt-4 w-full h-[50px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
//         onClick={() => setIsSuccessModalOpen(false)}
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )}
//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//=========================>>>> Old all are UI set ready to add whole compoennet







// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);

// const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     // If cookie exists → open Lead Modal instead of alert
// //     setIsLeadModalOpen(true);
// //   } else {
// //     // Else → open Login modal
// //     setIsModalOpen(true);
// //   }
// // };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email"); // start email OTP flow
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsModalOpen(true); // reuse modal for OTP
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// // const handleVerifyOtp = async () => {
// //   setAuthError(""); // Clear previous errors
// //   try {
// //     const payload = {
// //       email: visitorEmail,
// //       otp: otp,
// //     };
// //     const res = await verifyEmailOtp(payload);

// //     // Extract visitor ID from response
// //     const visitorId = res.data._id;

// //     // Store visitorId in cookie (expires in 7 days)
// //     Cookies.set("visitorId", visitorId, { expires: 7 });

// //     // Close Auth modal
// //     setIsModalOpen(false);

// //     // Open lead modal to proceed
// //     setIsLeadModalOpen(true);

// //     console.log("Visitor logged in successfully:", res.data);
// //   } catch (err) {
// //     setAuthError(err.response?.data?.message || "Invalid OTP");
// //   }
// // };


// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     // setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };


// // const handleLeadSubmit = async (e) => {
// //   e.preventDefault();
// //   const visitorId = Cookies.get("visitorId");
// //  if (!visitorId) {
// //     alert("Visitor not found, please login first.");
// //     return;
// //   }
// //   try {
// //     const leadData = {
// //       propertyId: officeId,
// //       visitorId: visitorId,
// //       assignedAgentId: userId,
// //       message: leadMessage,
// //     };
// //     console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)

// //     const res = await postLeadData(leadData);
// //     console.log("Lead created:", res);
// //     alert("Your enquiry has been submitted successfully!");
// //     setIsLeadModalOpen(false);
// //     setLeadMessage("");
// //   } catch (error) {
// //     console.error("Error submitting lead:", error);
// //     alert("Something went wrong while submitting lead.");
// //   }
// // };


// const handleLeadSubmit = async (e) => {
//   e.preventDefault();
//   const visitorId = Cookies.get("visitorId");
//   if (!visitorId) {
//     alert("Visitor not found, please login first.");
//     return;
//   }
//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: leadMessage,
//     };

//     await postLeadData(leadData);

//     // Close lead modal and show success modal
//     setIsLeadModalOpen(false);
//     setIsSuccessModalOpen(true);
//     setLeadMessage("");
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     alert("Something went wrong while submitting lead.");
//   }
// };


// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };


//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar visitorId={visitorId} /> {/* ✅ also fixed visitorId */}
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
   
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//             <div className="absolute flex flex-col items-center top-4 right-4"
//                onClick={(e) => e.stopPropagation()} // 🚫 prevent nav
//             >
//              <button
//   onClick={() => handleSave(office._id)}
//   className={`w-8 h-8 rounded flex items-center justify-center 
//   ${
//     savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"
//   }`}
// >
//   <span className="text-white">★</span>
// </button>

//               {savedSpaces.includes(office._id) && (
//                 <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//               )}
//             </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
      
//       {/* STEP 1: Email Entry */}
//       {authStep === "email" && (
//         <>
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//             Please login to continue
//           </h2>
//           <p className="text-lg text-gray-500 mb-6 text-center">
//             Get started to grab the best offers on top workspace
//           </p>

//           <input
//             type="email"
//             placeholder="Please enter your email"
//             value={visitorEmail}
//             onChange={(e) => setVisitorEmail(e.target.value)}
//             className="w-full h-[64px] border border-gray-300 rounded-xl px-5 text-[16px] placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
//           />

//           {authError && (
//             <p className="text-red-500 text-sm mb-3 text-center">{authError}</p>
//           )}

//           <p className="text-[14px] text-gray-600 text-center mb-6 leading-[20px]">
//             By proceeding, you agree to Fidelitus Corp{" "}
//             <span className="text-blue-600 cursor-pointer hover:underline">
//               Terms and Conditions
//             </span>{" "}
//             and that you have read our{" "}
//             <span className="text-blue-600 cursor-pointer hover:underline">
//               Privacy Policy
//             </span>.
//           </p>

//           <div className="flex justify-between gap-4">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="w-1/2 h-[60px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSendOtp}
//               className="w-1/2 h-[60px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
//             >
//               Send OTP
//             </button>
//           </div>
//         </>
//       )}

//       {/* STEP 2: OTP Entry */}
//      {/* STEP 2: OTP Entry */}
// {/* STEP 2: OTP Entry */}
// {authStep === "otp" && (
//   <>
//     {/* Header */}
//     <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//       {isNewVisitor ? "Sign Up" : "Enter OTP"}
//     </h2>

//     {/* Email info with edit */}
//     <p className="text-md text-orange-500 mb-4 text-center">
//       Please enter OTP sent on <span className="font-medium">{visitorEmail}</span>{" "}
//       <span
//         className="ml-2 text-blue-600 cursor-pointer underline"
//         onClick={() => setAuthStep("email")}
//       >
//         Edit
//       </span>
//     </p>

//     {/* New Visitor: Name, Mobile, City */}
//     {isNewVisitor && (
//       <div className="space-y-3 mb-6">
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={visitorName}
//           onChange={(e) => setVisitorName(e.target.value)}
//           className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <input
//           type="text"
//           placeholder="Mobile Number"
//           value={formData.mobile}
//           onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//           className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         <input
//           type="text"
//           placeholder="City"
//           value={formData.city}
//           onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//           className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//       </div>
//     )}

//     {/* OTP Inputs */}
//     {/* <div className="flex justify-center gap-3 my-4">
//       {[...Array(6)].map((_, idx) => (
//         <input
//           key={idx}
//           type="text"
//           maxLength={1}
//           value={otp[idx] || ""}
//           onChange={(e) => {
//             const val = e.target.value.replace(/[^0-9]/g, "");
//             let newOtp = otp.split("");
//             newOtp[idx] = val;
//             setOtp(newOtp.join(""));
//             if (val && idx < 5) {
//               document.getElementById(`otp-${idx + 1}`)?.focus();
//             }
//           }}
//           id={`otp-${idx}`}
//           className="w-10 h-12 text-center text-lg border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//       ))}
//     </div> */}
//     {/* OTP Inputs */}
// <div className="flex justify-center gap-3 my-4">
//   {[...Array(6)].map((_, idx) => (
//     <input
//       key={idx}
//       type="text"
//       maxLength={1}
//       value={otp[idx] || ""}
//       onChange={(e) => {
//         const val = e.target.value.replace(/[^0-9]/g, "");
//         let newOtp = otp.split("");
//         newOtp[idx] = val;
//         setOtp(newOtp.join(""));
//         if (val && idx < 5) {
//           document.getElementById(`otp-${idx + 1}`)?.focus();
//         }
//       }}
//       id={`otp-${idx}`}
//       className="w-10 h-12 text-center text-lg border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//     />
//   ))}
// </div>

// {/* Invalid OTP Error */}
// {authError && (
//   <p className="text-red-500 text-center text-sm mb-4">
//     {authError}
//   </p>
// )}

//     {/* Resend OTP */}
//     <p className="text-sm text-gray-500 text-center mb-4">
//   Didn't receive OTP?{" "}
//   <span
//     className="text-blue-600 cursor-pointer underline"
//     onClick={() => {
//       handleSendOtp();  // send OTP again
//       setOtp("");       // clear all OTP boxes
//     }}
//   >
//     Resend OTP
//   </span>
// </p>
//     {/* Terms & Privacy */}
//     <p className="text-[10px] text-gray-600 text-center mb-3 leading-[20px]">
//     By submitting your enquiry, your details may be shared with workspace providers who may contact you. Please review our {" "}
//       <span className="text-blue-600 cursor-pointer hover:underline">
//         Privacy Policy
//       </span>{" "}
//       and{" "}
//       <span className="text-blue-600 cursor-pointer hover:underline">
//         Terms and Conditions
//       </span>{" "}
//  for how we handle your information.
//     </p>

//     {/* Buttons */}
//     <div className="flex justify-between gap-4">
//       <button
//         onClick={() => setIsModalOpen(false)}
//         className="w-1/2 h-[55px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
//       >
//         Cancel
//       </button>
//       <button
//         onClick={handleVerifyOtp}
//         className="w-1/2 h-[55px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
//       >
//         Verify OTP
//       </button>
//     </div>
//   </>
// )}
//     </div>
//   </div>
// )}

// {/* Lead Modal */}
// {isLeadModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
      
//       <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//         Send Your Enquiry
//       </h2>
//       <p className="text-sm text-gray-500 text-center mb-5">
//         Let us know your interest. Our team will reach out soon.
//       </p>

//       <form onSubmit={handleLeadSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your message (optional)"
//           value={leadMessage}
//           onChange={(e) => setLeadMessage(e.target.value)}
//           className="w-full h-[60px] px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
//         />

//         <p className="text-[13px] text-gray-500 mb-4 leading-[18px]">
//           After you submit a workspace enquiry to us, we may share your details with workspace providers,
//           who may contact you to follow up on your enquiry. Please read our{" "}
//           <span className="text-blue-600 cursor-pointer hover:underline">
//             Privacy Policy
//           </span>{" "}
//           for details of how we process the information.
//         </p>

//         <div className="flex justify-between gap-4">
//           <button
//             type="button"
//             onClick={() => {
//               handleLeadSubmit(); // Trigger submit even on Cancel
//               setIsLeadModalOpen(false);
//             }}
//             className="w-1/2 h-[50px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="w-1/2 h-[50px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

// {/* Success Modal */}
// {isSuccessModalOpen && (
//   <div
//     className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm cursor-pointer"
//     onClick={() => setIsSuccessModalOpen(false)}
//   >
//     <div className="bg-white rounded-2xl w-[450px] max-w-[90%] p-8 shadow-2xl text-center transition-all duration-300">
//       <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//         Thank you for Reaching Out
//       </h2>
//       <p className="text-sm text-gray-600 leading-relaxed mb-6">
//         Our team will get back to you within 24 hours with your personalised quote.
//       </p>
//       <button
//         className="mt-4 w-full h-[50px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
//         onClick={() => setIsSuccessModalOpen(false)}
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )}




//   </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuPage;








//========================>>>> Redesigning model UI


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// // import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   // OTP flow states
// const [authStep, setAuthStep] = useState("email"); // "email" | "otp"
// const [otp, setOtp] = useState("");
// const [isNewVisitor, setIsNewVisitor] = useState(false);
// const [authError, setAuthError] = useState(""); // For invalid OTP
// const [visitorEmail, setVisitorEmail] = useState(""); // Email input
// const [visitorName, setVisitorName] = useState(""); // Only if new visitor

//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
// // const handleContactQuoteClick = () => {
// //   const visitorId = Cookies.get("visitorId");
// //   if (visitorId) {
// //     // If cookie exists → open Lead Modal instead of alert
// //     setIsLeadModalOpen(true);
// //   } else {
// //     // Else → open Login modal
// //     setIsModalOpen(true);
// //   }
// // };

// const handleContactQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true); // existing lead modal
//   } else {
//     setAuthStep("email"); // start email OTP flow
//     setAuthError("");
//     setVisitorEmail("");
//     setVisitorName("");
//     setOtp("");
//     setIsModalOpen(true); // reuse modal for OTP
//   }
// };

// const handleSendOtp = async () => {
//   setAuthError("");
//   try {
//     const res = await sendEmailOtp(visitorEmail);
//     setIsNewVisitor(res.isNewVisitor);
//     setAuthStep("otp");
//   } catch (err) {
//     setAuthError(err.message || "Failed to send OTP");
//   }
// };

// // const handleVerifyOtp = async () => {
// //   setAuthError(""); // Clear previous errors
// //   try {
// //     const payload = {
// //       email: visitorEmail,
// //       otp: otp,
// //     };
// //     const res = await verifyEmailOtp(payload);

// //     // Extract visitor ID from response
// //     const visitorId = res.data._id;

// //     // Store visitorId in cookie (expires in 7 days)
// //     Cookies.set("visitorId", visitorId, { expires: 7 });

// //     // Close Auth modal
// //     setIsModalOpen(false);

// //     // Open lead modal to proceed
// //     setIsLeadModalOpen(true);

// //     console.log("Visitor logged in successfully:", res.data);
// //   } catch (err) {
// //     setAuthError(err.response?.data?.message || "Invalid OTP");
// //   }
// // };


// const handleVerifyOtp = async () => {
//   setAuthError("");
//   if (!otp) return setAuthError("OTP is required");

//   try {
//     // Base payload
//     let payload = {
//       email: visitorEmail,
//       otp: otp,
//     };

//     // Add extra fields if new visitor
//     if (isNewVisitor) {
//       if (!visitorName || !formData.mobile || !formData.city) {
//         return setAuthError("All fields are required for new visitors");
//       }
//       payload = {
//         ...payload,
//         fullName: visitorName,
//         mobile: formData.mobile,
//         city: formData.city,
//       };
//     }

//     const res = await verifyEmailOtp(payload);

//     // Save visitorId in cookie
//     const visitorId = res.data._id;
//     Cookies.set("visitorId", visitorId, { expires: 7 });

//     // Close Auth modal
//     setIsModalOpen(false);

//     // Open lead modal
//     setIsLeadModalOpen(true);

//     console.log("Visitor logged in successfully:", res.data);
//   } catch (err) {
//     setAuthError(err.response?.data?.message || "Invalid OTP");
//   }
// };

// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };


// const handleLeadSubmit = async (e) => {
//   e.preventDefault();
//   const visitorId = Cookies.get("visitorId");

//   if (!visitorId) {
//     alert("Visitor not found, please login first.");
//     return;
//   }

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: leadMessage,
//     };
//     console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)

//     const res = await postLeadData(leadData);
//     console.log("Lead created:", res);

//     alert("Your enquiry has been submitted successfully!");
//     setIsLeadModalOpen(false);
//     setLeadMessage("");
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     alert("Something went wrong while submitting lead.");
//   }
// };


// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };


//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar visitorId={visitorId} /> {/* ✅ also fixed visitorId */}
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}

// {/* White box section (sticky + smooth expand/shrink from center) */}

//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {/* Left Image Section */}
   
//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//             <div className="absolute flex flex-col items-center top-4 right-4"
//                onClick={(e) => e.stopPropagation()} // 🚫 prevent nav
//             >
//              <button
//   onClick={() => handleSave(office._id)}
//   className={`w-8 h-8 rounded flex items-center justify-center 
//   ${
//     savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"
//   }`}
// >
//   <span className="text-white">★</span>
// </button>

//               {savedSpaces.includes(office._id) && (
//                 <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//               )}
//             </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
         

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
//   {/* Profile Section */}
//   <div className="flex items-start justify-between w-full h-[166px] gap-2">
//     <div className="flex flex-col items-center">
//       <button className="mt-2 w-[244px] h-[31px] bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition" 
//     onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
// Contact11 {user?.fullName?.split(" ")[0]}
// </button>

//     </div>
//   </div>
//   {/* Key Points Section */}
//   <div className="mt-3 text-[12px] text-gray-700">
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
//       {authStep === "email" && (
//         <>
//           <h2 className="mb-4 text-lg font-bold">Enter your Email</h2>
//           <input
//             type="email"
//             placeholder="Email"
//             value={visitorEmail}
//             onChange={(e) => setVisitorEmail(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//             required
//           />
//           {authError && <p className="text-red-500 mb-2">{authError}</p>}
//           <div className="flex justify-end mt-3">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="px-4 py-2 mr-2 bg-gray-300 rounded"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSendOtp}
//               className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
//             >
//               Send OTP
//             </button>
//           </div>
//         </>
//       )}

// {authStep === "otp" && (
//   <>
//     {isNewVisitor && (
//       <>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={visitorName}
//           onChange={(e) => setVisitorName(e.target.value)}
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
//         <input
//           type="text"
//           placeholder="City"
//           value={formData.city}
//           onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//           className="w-full p-2 mb-2 border rounded"
//           required
//         />
//       </>
//     )}
//     <h2 className="mb-4 text-lg font-bold">Enter OTP</h2>
//     <input
//       type="text"
//       placeholder="OTP"
//       value={otp}
//       onChange={(e) => setOtp(e.target.value)}
//       className="w-full p-2 mb-2 border rounded"
//       required
//     />
//     {authError && <p className="text-red-500 mb-2">{authError}</p>}
//     <div className="flex justify-end mt-3">
//       <button
//         onClick={() => setIsModalOpen(false)}
//         className="px-4 py-2 mr-2 bg-gray-300 rounded"
//       >
//         Cancel
//       </button>
//       <button
//         onClick={handleVerifyOtp}
//         className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
//       >
//         Verify OTP
//       </button>
//     </div>
//   </>
// )}

//     </div>
//   </div>
// )}


// {/* Lead Modal */}
// {isLeadModalOpen && (
//   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
//     <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative z-[10000]">
//       <h2 className="mb-4 text-lg font-bold">Send Your Enquiry</h2>
//       {/* <form onSubmit={handleLeadSubmit}>
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
//             type="submit"
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
//       </form> */}
//       <form onSubmit={handleLeadSubmit}>
//   <input
//     type="text"
//     placeholder="Enter your message (optional)"
//     value={leadMessage}
//     onChange={(e) => setLeadMessage(e.target.value)}
//     className="w-full p-2 mb-4 border rounded"
//   />
  
//   <div className="flex justify-end space-x-2">
//     {/* Cancel Button triggers the same function */}
//     <button
//       type="button"
//       onClick={() => {
//         handleLeadSubmit(); // Trigger the same function
//         setIsLeadModalOpen(false); // Close modal
//       }}
//       className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//     >
//       Cancel
//     </button>

//     {/* Submit Button */}
//     <button
//       type="submit"
//       className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
//     >
//       Submit
//     </button>
//   </div>
// </form>

//     </div>
//   </div>
// )}

//   </div>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default MenuPage;








//===============>>> LOgin and register implementing


// import React, { useState, useEffect, useRef } from "react";
// import { getManagedOffices ,searchManagedOffices} from "../../api/services/managedOfficeService";
// import {  searchOfficeSpaces} from "../../api/services/officeSpaceService";
// import {  searchCoWorkingSpaceData} from "../../api/services/coWorkingSpaceService";
// import { getUserDataById } from "../../api/services/userService";
// import { Link } from "react-router-dom";  
// // import { postWishlistData, deleteWishlistData } from "../api/services/wishlistServise";
// import { getWishlistData, postWishlistData, deleteWishlistData } from "../../api/services/wishlistServise";
// import Cookies from "js-cookie";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import { MapPin, ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import GroupsScroller from "../../components/GroupsScroller";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { useLocation } from "react-router-dom";   

// const MenuPage = ({ city = "" }) => {
//   const location = useLocation();
//   const incomingFilters = location.state?.filters || {};


//   const [allData, setAllData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);


//   const scrollContainerRef = useRef(null);
//   // const [data, setData] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [officeId, setOfficeId] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("managed");
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [isSticky, setIsSticky] = useState(false);
//   const filterRef = useRef(null);
// //save Space through card
//   const [savedSpaces, setSavedSpaces] = useState([]);

//   const [revealedCards, setRevealedCards] = useState({});
  
// // const [cities, setCities] = useState([]);         // ✅ dynamic list if needed
// const [masterCities, setMasterCities] = useState([]); // ✅ store from initial fetch
// const [masterZones, setMasterZones] = useState({});
// const [masterLocations, setMasterLocations] = useState({});

// const [allCities, setAllCities] = useState([]);

// const visitorId = Cookies.get("visitorId");
// // alert(visitorId)
// const isRestricted = visitorId;


// const [allZones, setAllZones] = useState([]);
// const [allLocations, setAllLocations] = useState([]);

  
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);

 
//     // 🔹 separate state to hold filters coming from Home
//     const [externalFilters, setExternalFilters] = useState(null);
//     console.log("******************************* incoming filters",incomingFilters)
//   // 👇 initialize filters with incomingFilters right away
// const initialNormalized = (() => {
//   const raw = location.state?.filters || {};
//   const facility =
//     (raw.facilityType || raw["What are you looking for"] || "").toString().trim();

//   return {
//     city: (raw.city || "").toString().trim(),
//     zone: (raw.zone || "").toString().trim(),
//     location: (raw.location || raw.locationOfProperty || "").toString().trim(),
//     facilityType: facility.toLowerCase() === "what are you looking for" ? "" : facility,
//     furnishingLevel: "",
//     seatingCapacity: "",
//     priceRange: "",
//     priceRangeDisplay: "",
//     areaSqft: "",
//   };
// })();


// // const [filters, setFilters] = useState(initialNormalized);
// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
// const [leadMessage, setLeadMessage] = useState("");


// //new code
// const queryParams = new URLSearchParams(location.search);
// const initialFilters = {};
// queryParams.forEach((value, key) => {
//   initialFilters[key] = value;
// });

// const [filters, setFilters] = useState({
//   city: initialFilters.city || "",
//   zone: initialFilters.zone || "",
//   locationOfProperty: initialFilters.locationOfProperty || "",
//   category: initialFilters.category || "managed",
//   priceRange: initialFilters.priceRange || "",
//   areaSqft: initialFilters.areaSqft || "",
//   seatingCapacity: initialFilters.seatingCapacity || "",
//   furnishingLevel: initialFilters.furnishingLevel || "", // ✅ new filter
// });


//  const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const priceOptions = [
//     { display: "Under ₹10,000", value: "1000-10000" },
//     { display: "₹10,000 - ₹50,000", value: "10000-50000" },
//     { display: "₹50,000 - ₹1,00,000", value: "50000-100000" },
//   ];

//   const areaOptions = [
//     { display: "300 - 500 sqft", value: "300-500" },
//     { display: "500 - 900 sqft", value: "500-900" },
//     { display: "1200 - 2000 sqft", value: "1200-2000" },
//   ];

//   const seatingOptions = [
//     { display: "10 - 50", value: "10-50" },
//     { display: "50 - 100", value: "50-100" },
//     { display: "100 - 500", value: "100-500" },
//     { display: "500 - 1000", value: "500-1000" },
//     { display: "1000 - 2000", value: "1000-2000" },
//   ];

// // API toggle logic
//   const getApiByCategory = (category) => {
//     switch (category) {
//       case "office":
//         return searchOfficeSpaces;
//       case "co-working":
//         return searchCoWorkingSpaceData;
//       default:
//         return searchManagedOffices;
//     }
//   };

//   // Fetch all data (for dropdowns)
//   useEffect(() => {
//     const fetchAll = async () => {
//       const result = await searchManagedOffices(1, 100);
//       setAllData(result);
//       setUserId(result[0].assigned_agent);
//       setOfficeId(result[0]._id);
//       console.log("***************************",result)
//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//     };
//     fetchAll();
//   }, []);

//   // Update dependent dropdowns
//   useEffect(() => {
//     if (filters.city) {
//       const cityZones = [
//         ...new Set(
//           allData
//             .filter((item) => item.location?.city === filters.city)
//             .map((item) => item.location?.zone)
//             .filter(Boolean)
//         ),
//       ];
//       setZones(cityZones);
//     } else {
//       setZones([]);
//     }

//     if (filters.city && filters.zone) {
//       const zoneLocations = [
//         ...new Set(
//           allData
//             .filter(
//               (item) =>
//                 item.location?.city === filters.city &&
//                 item.location?.zone === filters.zone
//             )
//             .map((item) => item.location?.locationOfProperty)
//             .filter(Boolean)
//         ),
//       ];
//       setLocations(zoneLocations);
//     } else {
//       setLocations([]);
//     }
//   }, [filters.city, filters.zone, allData]);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const { category, ...apiFilters } = filters;
//       const cleanFilters = Object.fromEntries(
//         Object.entries(apiFilters).filter(([_, v]) => v !== "")
//       );

//       const apiCall = getApiByCategory(filters.category);
//       const result = await apiCall(1, 10, cleanFilters);
//       setData(result);
//       setLoading(false);
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (key, value) => {
//     let newFilters = { ...filters, [key]: value };

//     if (key === "city") {
//       newFilters.zone = "";
//       newFilters.locationOfProperty = "";
//     }
//     if (key === "zone") {
//       newFilters.locationOfProperty = "";
//     }

//     setFilters(newFilters);

//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
 
// console.log("OOOOOOOOFice",officeId)
    
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (userId) {
//           const userData = await getUserDataById(userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);
//    // helper to update filters + trigger search
// const updateFilters = (newFilters) => {
//   setFilters((prev) => {
//     const updated = { ...prev, ...newFilters };
//     // 🔥 call API immediately with updated filters
//     handleSearch(updated);
//     return updated;
//   });
// };

//    const isLoggedIn = false;

//    const scrollAmount = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : 444;

//    useEffect(() => {
//     const updateButtonVisibility = () => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         setShowLeftButton(scrollLeft > 0);
//         setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
//       }
//     };

//     const handleFilterChange = (field, value) => {
//       setFilters((prev) => ({ ...prev, [field]: value }));
//     };


//     ////UI related Functions
//     // Initial check
//     updateButtonVisibility();
    
//     // Add event listeners
//     window.addEventListener('resize', updateButtonVisibility);
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener('scroll', updateButtonVisibility);
//     }
  
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', updateButtonVisibility);
//       if (scrollContainerRef.current) {
//         scrollContainerRef.current.removeEventListener('scroll', updateButtonVisibility);
//       }
//     };
//   }, []);
//   useEffect(() => {
//     const onScroll = () => {
//       if (!filterRef.current) return;
//       const { top } = filterRef.current.getBoundingClientRect();
//      setIsSticky(top <= 0);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//    }, []);
   
//   const handlePrev = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === 0
//           ? totalImages - 1
//           : (prev[cardIndex] || 0) - 1,
//     }));
//   };

//   const handleNext = (cardIndex, totalImages) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [cardIndex]:
//         prev[cardIndex] === totalImages - 1
//           ? 0
//           : (prev[cardIndex] || 0) + 1,
//     }));
//   };


//   // const handleSave = (id) => {
//   //   alert("saved")
//   //   setSavedSpaces((prev) =>
//   //     prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
//   //   );
//   // };
//    useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await getWishlistData(visitorId);
//         if (res?.data) {
//           const propertyIds = res.data.map((item) => item.propertyId);
//           setSavedSpaces(propertyIds);
//         }
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };

//     if (visitorId) {
//       fetchWishlist();
//     }
//   }, [visitorId]);

//   // Toggle save/remove
//   const handleSave = async (propertyId) => {
//     try {
//       if (savedSpaces.includes(propertyId)) {
//         // remove
//         await deleteWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         // add
//         await postWishlistData({ visitorId, propertyId });
//         setSavedSpaces((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Error updating wishlist:", err);
//     }
//   };

//   const handleReveal = (index, isRestricted) => {
//     if (isRestricted) return; // don’t allow reveal if restricted
//     setRevealedCards((prev) => ({ ...prev, [index]: true }));
//   };
  
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

// // Button handler
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


// const handleContactQuote = async () => {
//   const visitorId = Cookies.get("visitorId");

//   if (visitorId) {
//     console.log("Visitor already exists with ID:", visitorId);
//     alert("Visitor already exists, we will reach you.");
//     return; // stop here
//   }

//   // else open form modal
//   setIsModalOpen(true);
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await postVisitorData(formData);
//     console.log("Visitor created:", res);

//     // store visitorId in cookies
//     Cookies.set("visitorId", res.data._id, { expires: 7 }); // expires in 7 days

//     alert("Thanks for login. Quote request submitted successfully!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error submitting quote:", error);
//     alert("Something went wrong, please try again.");
//   }
// };


// const handleLeadSubmit = async (e) => {
//   e.preventDefault();
//   const visitorId = Cookies.get("visitorId");

//   if (!visitorId) {
//     alert("Visitor not found, please login first.");
//     return;
//   }

//   try {
//     const leadData = {
//       propertyId: officeId,
//       visitorId: visitorId,
//       assignedAgentId: userId,
//       message: leadMessage,
//     };
//     console.log("leaaaaaaaaaaaad Daattaaaaaas",leadData)

//     const res = await postLeadData(leadData);
//     console.log("Lead created:", res);

//     alert("Your enquiry has been submitted successfully!");
//     setIsLeadModalOpen(false);
//     setLeadMessage("");
//   } catch (error) {
//     console.error("Error submitting lead:", error);
//     alert("Something went wrong while submitting lead.");
//   }
// };


// const handleCardClick = (officeId) => {
//   navigate(`/office/${officeId}?category=${selectedCategory}`);
// };


//   return (
//     <div className="w-full">
//       {/* Banner Section */}
//       <div
//         className="relative w-full h-[345px] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://static.vecteezy.com/system/resources/previews/005/522/083/large_2x/3d-render-modern-office-design-manager-room-interior-wall-mockup-free-photo.jpg')",
//         }}
//       >
//             <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//   <Link to="/" className="transition hover:text-orange-400">
//     Home
//   </Link>
//   <Link to="/menu" className="transition hover:text-orange-400">
//     Explore Spaces
//   </Link>
//   <Link to="/about" className="transition hover:text-orange-400">
//     About Us
//   </Link>
//   <WishlistSidebar visitorId={visitorId} /> {/* ✅ also fixed visitorId */}
// </div>
//       </div>
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative flex justify-center h-full">
//           <h1 className="pt-20 mt-10 text-4xl font-bold text-white">
//            Find Your Requirement 
// <span className="ml-6 text-orange-500">Here</span>

//           </h1>
//         </div>
//       </div>   
// {/* Overlapping Section with Toggle Buttons */}
// <div className="relative z-20 flex flex-col items-center -mt-30">
//   {/* Button Group */}
//   <div className="shadow-lg flex w-[511px] h-[51px] overflow-hidden space-x-[5px] p-[5px]">
//   {[
//     { label: "Managed Office", value: "managed" },
//     { label: "Office Space", value: "office" },
//     { label: "Co-Working Space", value: "co-working" },
//   ].map((cat) => (
//     <button
//       key={cat.value}
//       onClick={() => handleFilterChange("category", cat.value)}
//       className={`flex-1 font-semibold ${
//         filters.category === cat.value
//           ? "text-white bg-orange-500"
//           : "text-gray-700 bg-gray-100 hover:bg-gray-200"
//       }`}
//     >
//       {cat.label}
//     </button>
//   ))}
// </div>
// </div>
// {/* White box section (sticky + smooth expand/shrink from center) */}
// <div className="sticky px-4 py-3 mx-auto bg-white rounded-lg shadow-md z-24 top-20">
//   <div className="grid grid-cols-7 gap-3">
//     {/* City */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">City</p>
//       <select
//         value={filters.city}
//         onChange={(e) => handleFilterChange("city", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select City</option>
//         {cities.map((city, idx) => (
//           <option key={idx} value={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Zone */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Zone</p>
//       <select
//         value={filters.zone}
//         onChange={(e) => handleFilterChange("zone", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.city}
//       >
//         <option value="">Select Zone</option>
//         {zones.map((zone, idx) => (
//           <option key={idx} value={zone}>
//             {zone}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Location */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Location</p>
//       <select
//         value={filters.locationOfProperty}
//         onChange={(e) =>
//           handleFilterChange("locationOfProperty", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//         disabled={!filters.zone}
//       >
//         <option value="">Select Location</option>
//         {locations.map((loc, idx) => (
//           <option key={idx} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Price */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Price</p>
//       <select
//         value={filters.priceRange}
//         onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Price Range</option>
//         {priceOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Area */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Area (Sqft)</p>
//       <select
//         value={filters.areaSqft}
//         onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Area (Sqft)</option>
//         {areaOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Seating */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Seating</p>
//       <select
//         value={filters.seatingCapacity}
//         onChange={(e) =>
//           handleFilterChange("seatingCapacity", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Seating Capacity</option>
//         {seatingOptions.map((opt, idx) => (
//           <option key={idx} value={opt.value}>
//             {opt.display}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Furnishing */}
//     <div>
//       <p className="mb-1 text-[12px] font-medium text-black">Furnishing</p>
//       <select
//         value={filters.furnishingLevel}
//         onChange={(e) =>
//           handleFilterChange("furnishingLevel", e.target.value)
//         }
//         className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
//       >
//         <option value="">Select Furnishing</option>
//         <option value="Ready to Move">Ready to Move</option>
//         <option value="Fully Furnished">Fully Furnished</option>
//         <option value="Semi Furnished">Semi Furnished</option>
//       </select>
//     </div>
//   </div>
// </div>
//       {/* Cards + Right Panel Section */}
//       <div className="max-w-[1350px] mx-auto mt-10 flex gap-6">
//         {/* Left Side - Office Cards */}
//         <div className="flex flex-col gap-6 w-[887px]">
//         {data.map((office, index) => {
//         const currentImg =
//         office.images?.[currentImageIndex[index] || 0] || "";

//   const handleCardClick = (officeId) => {
//     if (!visitorId && index >= 3) {
//       // block navigation if not logged in & card is restricted
//       setIsModalOpen(true);
//       return;
//     }
//     navigate(`/office/${officeId}?category=${filters.category}`);
//   };

//   const isRestricted = !visitorId && index >= 3;

//   return (
//     <div
//       key={office._id}
//       className="group relative flex w-[887px] h-[302px] bg-white border shadow-md rounded-lg overflow-hidden"
//       onClick={() => handleCardClick(office._id)} // ✅ click card
//     >
//       {/* Overlay for restricted users */}
//       {isRestricted && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-2 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsModalOpen(true);
//           }}
//         >
//           <button
//             className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//           >
//             Please Login to View the Space
//           </button>
//         </div>
//       )}

//       {/* Left Image Section */}
//       <div
//         className="relative w-[430px] h-[302px] overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // 🚫 prevent nav when clicking image controls
//       >
//         <img
//           src={currentImg}
//           alt={office.buildingName}
//           className="object-cover w-full h-full"
//         />
//         {office.images?.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handlePrev(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black left-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNext(index, office.images.length);
//               }}
//               className="absolute p-2 text-white -translate-y-1/2 bg-black right-2 top-1/2 bg-opacity-40"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//           {/* Right Content Section */}
//           <div className="relative flex-1 p-4">
//             {/* Save Button */}
//             <div className="absolute flex flex-col items-center top-4 right-4"
//                onClick={(e) => e.stopPropagation()} // 🚫 prevent nav
//             >
//              <button
//   onClick={() => handleSave(office._id)}
//   className={`w-8 h-8 rounded flex items-center justify-center 
//   ${
//     savedSpaces.includes(office._id) ? "bg-black" : "bg-gray-300"
//   }`}
// >
//   <span className="text-white">★</span>
// </button>

//               {savedSpaces.includes(office._id) && (
//                 <span className="text-orange-500 text-[12px] mt-1">Saved</span>
//               )}
//             </div>

//             {/* Title */}
//             <h2 className="text-[20px]  text-[#16607B] font-bold mb-1 ml-5">
//               {office.buildingName}
//             </h2>

//             {/* Type */}
//             <p className="text-[14px] text-[#16607B]  mb-1 ml-5">
//               <span className="font-medium text-[#16607B] ">
//                 {office.type}
//               </span>{" "}
//               Space
//             </p>

//             {/* Location */}
//             <p className="text-[13px] text-[#16607B] flex items-center gap-1 mb-4 ml-5">
//               <MapPin size={14} className="text-[#dc8903] " />{" "}
//               {office.location?.address}, {office.location?.city}
//             </p>

//             {/* Blue Box */}
//             <GroupsScroller
//               groups={[
//                   // Group 1
//     <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Seater Offered</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.seaterOffered}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Floor Size</p>
//   {(() => {
//     const floorSize = office?.generalInfo?.floorSize || "";
//     if (!floorSize) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = floorSize.split(/ (.+)/);
//     return (
//       <span className="text-[14px] text-white text-center">
//         <span className="font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

// <div className="flex flex-col w-[111px] items-center justify-center">
//   <p className="text-[13px] text-white font-regular">Built-Up Area</p>
//   {(() => {
//     const builtUp = office?.generalInfo?.totalBuiltUpArea || "";
//     if (!builtUp) {
//       return <span className="text-[14px] text-white text-center">N/A</span>;
//     }
//     const [value, unit] = builtUp.split(/ (.+)/);
//     return (
//       <span className="text-center text-white">
//         <span className="text-[14px] font-bold">{value}</span>{" "}
//         <span className="text-[12px] font-regular">{unit}</span>
//       </span>
//     );
//   })()}
// </div>

//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Lock-in</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.lockInPeriod}
//       </span>
//     </div>
//   </>,

//   // Group 2
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Floors</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.floors}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Furnishing</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.generalInfo.furnishingLevel}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Air Conditioning</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.airConditioners ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Parking</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.parking ? "Yes" : "No"}
//       </span>
//     </div>
//   </>,

//   // Group 3
//   <>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Security24x7</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.security24x7 ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Wifi</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.wifi ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-regular">Washrooms</p>
//       <span className="text-[14px] text-white font-bold">
//         {office.amenities?.washrooms ? "Yes" : "No"}
//       </span>
//     </div>
//     <div className="flex flex-col w-[111px] items-center justify-center">
//       <p className="text-[13px] text-white font-bold underline cursor-pointer">
//         View More
//       </p>
//     </div>
//   </>,
//               ]}
              
//             />

//             {/* Price Section */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-[16px] text-[#16607B] ml-5">
//                   Quoted Price
//                 </p>
//                 <p className="ml-5 text-[18px] font-bold text-gray-800">
//                   ₹{office.generalInfo?.rentPerSeat}{" "}
//                   <span className="text-[12px] text-[#16607B] font-regular">
//                     / Seat
//                   </span>
//                 </p>
//               </div>
//               <button className="w-[193px] h-[51px] bg-black text-white hover:bg-green-600 transition"
//                  onClick={(e) => {
//                   e.stopPropagation();
//                   handleContactQuoteClick();
//                 }}// 🚫 prevent nav
//               >
//                 Get Best Price
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//         </div>
//         {/* Right Side - User Details Card */}
//         <div className="sticky top-40 z-10 w-[443px] h-[500px] bg-white shadow-lg rounded-lg p-6 flex flex-col">
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
//       </div>
      
//     </div>
//   );
// };

// export default MenuPage;








//=========================+>>>> Test responsive





// export default function MenuPage() {
//     return (
//       <div className="h-screen flex items-center justify-center bg-blue-100">
//         <h1 className="text-4xl font-bold text-blue-800">
//           Desktop Menu Page 🍽️
//         </h1>
//       </div>
//     );
//   }
  