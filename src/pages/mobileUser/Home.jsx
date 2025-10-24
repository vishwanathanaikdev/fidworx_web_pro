import React, { useState, useRef , useEffect} from 'react';
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import WishlistSidebar from "../../components/WishlistSidebar";
import { searchManagedOffices } from "../../api/services/managedOfficeService";
import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
import { Menu, X } from "lucide-react";
import manged from "../../assets/imgthree.png";
import office from "../../assets/officeone.png";
import coworking from "../../assets/imtwo.png";
import bangalore from "../../assets/cities/bengalore.jpeg";
import mumbai from "../../assets/cities/mumbai.jpeg";
import kochi from "../../assets/cities/kochi.jpeg";
import noida from "../../assets/cities/noida.jpeg";
import hydarabad from "../../assets/cities/hydarabad.jpeg";
import dehli from "../../assets/cities/dehli.jpeg";
import chennai from "../../assets/cities/chennai.jpeg";
import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
import kochivideo from "../../assets/cities/bglrvideo.mp4";
import noidavideo from "../../assets/cities/noidavideo.mp4";
import dehlivideo from "../../assets/cities/dehlivideo.mp4";
import chennaivideo from "../../assets/cities/chennaivideo.mp4";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MobileAuthModal from './mobileComponents/MobileAuthModal';
import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
import MobileBottomNav from './mobileComponents/MobileBottomNav';
import { postVisitorData, postLeadData } from "../../api/services/visitorService";
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();
  const visitorId = Cookies.get("visitorId");
 const videoRef = useRef(null);
  // 🔹 Mobile Menu state
  const [menuOpen, setMenuOpen] = useState(false);
 const [text, setText] = useState("Manged office");
  // 🔹 Carousel state
   const images = [manged, office, coworking];  
const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
//video refs
 const mumbaiVideoRef = useRef(null);
  const hydarabadVideoRef = useRef(null);
  const kochiVideoRef = useRef(null);
  const noidaVideoRef = useRef(null);
  const dehliVideoRef = useRef(null);
  const chennaiVideoRef = useRef(null);
   const [selectedRequirement, setSelectedRequirement] = useState('');
// Data from API
    const [allData, setAllData] = useState([]);
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [locations, setLocations] = useState([]);

        // Modal states
        const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
        const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
        const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
        // Lead message
        const [leadMessage, setLeadMessage] = useState("");
        const [userId, setUserId] = useState(null);
        const [officeId, setOfficeId] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");



/////
const [isOpen, setIsOpen] = useState(false);
const [isHovered, setIsHovered] = useState(false);

const handleOpen = () => setIsOpen(true);
const handleClose = () => setIsOpen(false);

useEffect(() => {
    if (selectedCity) {
      const requirements = [...new Set(
        officeSpaces
          .filter(item => item.city === selectedCity)
          .map(item => item.type)
      )];
      setFilteredRequirements(requirements);
      setSelectedRequirement(''); // Reset requirement when city is changed
    }
  }, [selectedCity]);


   // Filter locations based on the selected city and requirement
    useEffect(() => {
      if (selectedCity && selectedRequirement) {
        const locations = officeSpaces
          .filter(item => item.city === selectedCity && item.type === selectedRequirement)
          .map(item => item.location);
        setFilteredLocations([...new Set(locations)]);
        setSelectedLocation(''); // Reset location when requirement is changed
      }
    }, [selectedCity, selectedRequirement]);

   const [filters, setFilters] = useState({
      city: "",
      zone: "",
      locationOfProperty: "",
      category: "",
    });


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

     useEffect(() => {
        const words = ["Manged office", "Coworking space","Office space", ];
        let index = 0;
        
        const interval = setInterval(() => {
          index = (index + 1) % words.length;
          setText(words[index]);
        }, 4000); // Change text every 3 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
      }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false); // start fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
        setFadeIn(true); // fade in new image
      }, 500); // match fade-out timing
    }, 4000); // ⏰ change every 4s

    return () => clearInterval(interval);
  }, [images.length]);


 // Handle filter changes
 const workspaceOptions = [
  { label: "Managed Office", value: "managed" },
  { label: "Office Space", value: "office" },
  { label: "Co-Working Space", value: "co-working" },
];
  
   // 🔥 Utility to get API function based on category
   const getApiByCategory = (category) => {
     if (category === "managed") return searchManagedOffices;
     if (category === "office") return searchOfficeSpaces;
     if (category === "co-working") return searchCoWorkingSpaceData;
     return searchManagedOffices; // default
   };
  
  
    
   // Fetch data whenever category changes
  useEffect(() => {
    if (!filters.category) return;
  
    const fetchData = async () => {
      const apiFn = getApiByCategory(filters.category);
      const result = await apiFn(1, 100); // page 1, size 100
      const data = result?.data || [];    // ✅ extract data array
  
      setAllData(data);
  
      // Extract unique cities
      const uniqueCities = [
        ...new Set(data.map((item) => item.location?.city).filter(Boolean))
      ];
      setCities(uniqueCities);
      setZones([]);
      setLocations([]);
    };
  
    fetchData();
  }, [filters.category]);
  
  

    const handleSelectCategory = (value) => {
      setFilters((prev) => ({
        ...prev,
        category: value,
        city: "",
        zone: "",
        locationOfProperty: "",
      }));
      setWorkspaceDropdownOpen(false);
    };
    
    const handleSelectCity = (city) => {
      setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
      setCityDropdownOpen(false);
    
      const cityZones = [
        ...new Set(
          allData
            .filter((item) => item.location?.city === city)
            .map((item) => item.location?.zone)
            .filter(Boolean)
        )
      ];
      setZones(cityZones);
      setLocations([]);
    };
    
    const handleSelectZone = (zone) => {
      setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
      setZoneDropdownOpen(false);
    
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
        )
      ];
      setLocations(zoneLocations);
    };
    
    
    
    // Location selection
    const handleSelectLocation = (loc) => {
      setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
      setLocationDropdownOpen(false);
    };
    
    
     // Search action
     const handleSearch = () => {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
      ).toString();
      navigate(query ? `/menu?${query}` : `/menu`);
    };
    
    const handleExplore = () => {
      navigate("/menu");
    };
    

   // Reset filters
   const clearAll = () => {
    setFilters({
      city: "",
      zone: "",
      locationOfProperty: "",
      category: "",
    });
    setCities([]);
    setZones([]);
    setLocations([]);
    setAllData([]);
  };

  const logos = [
  "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
  "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
 "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
  "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
   "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
    "https://www.maestro.com/assets/images/maestrologo.png",
    "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
  ];

  // Play the video on hover
  const handleMouseEnter = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    setIsHovered(true);
  };

  // Pause the video when hover ends
  const handleMouseLeave = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; 
    }
    setIsHovered(false);
  };

   const steps = [
        {
          title: "Share Your Requirements",
          subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
          image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
        },
        {
          title: "Get Customized Options",
          subtitle: "We’ll provide tailored workspace suggestions for you",
          image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        },
        {
          title: "Visit & Finalize",
          subtitle: "Tour shortlisted spaces and choose the best fit",
          image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
        },
        {
          title: "Move In Smoothly",
          subtitle: "We’ll assist with agreements and a hassle-free setup",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        },
      ];
      
      const [activeImage, setActiveImage] = useState(steps[0].image);


//3d image 
      const [offset, setOffset] = useState(0);
      
      useEffect(() => {
        const handleScroll = () => {
          setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);



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
const handleGetQuoteClick = () => {
  const visitorId = Cookies.get("visitorId");
  if (visitorId) {
    setIsLeadModalOpen(true);
  } else {
    setIsAuthModalOpen(true);
  }
};
  return (
    <section className="relative w-full min-h-screen bg-black text-white">

      {/* 🔹 Header Bar */}
      <div className="w-full h-[70px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
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

      {/* 🔹 Background Carousel */}
<div className="absolute top-[98px] left-0 w-full h-[439px]">
  {/* Carousel Image */}
  <div
    className={`absolute top-0 left-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
      fadeIn ? "opacity-100" : "opacity-0"
    }`}
    style={{ backgroundImage: `url(${images[currentIndex]})` }}
  ></div>

  {/* Dark Transparent Overlay */}
  <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

  {/* Heading Text */}
<div className="relative z-10 flex flex-col items-center justify-start h-full text-white pt-5">
  <h1 className="text-[25px] sm:text-4xl md:text-5xl font-bold leading-tight mb-[3px]">
    Find your perfect
  </h1>
  {/* Horizontal Scrolling Text */}
  <div className="overflow-hidden w-[300px]">
    <div
      className="whitespace-nowrap animate-scroll-horizontal text-yellow-400 font-bold"
      style={{ fontSize: "26px" }}
    >
      {text}
    </div>
  </div>
  {/* 🔥 Mobile Search Box */}
<div className="flex flex-col w-full max-w-sm mx-auto gap-4 p-4 mt-6 border shadow-lg bg-white/10 backdrop-blur-md border-white/30 rounded-2xl">
  {/* Category Dropdown */}
  <div className="relative w-full">
    <div
      onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
      className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
    >
      {filters.category
        ? workspaceOptions.find((w) => w.value === filters.category)?.label
        : "Select Category"}
    </div>
    {workspaceDropdownOpen && (
      <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
        {workspaceOptions.map((opt) => (
          <div
            key={opt.value}
            onClick={() => handleSelectCategory(opt.value)}
            className="px-4 py-2 cursor-pointer hover:bg-orange-100"
          >
            {opt.label}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* City Dropdown */}
  <div className="relative w-full">
    <div
      onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
      className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
    >
      {filters.city || "Select City"}
    </div>
    {cityDropdownOpen && (
      <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
        {cities.map((city, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectCity(city)}
            className="px-4 py-2 cursor-pointer hover:bg-orange-100"
          >
            {city}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Zone Dropdown */}
  <div className="relative w-full">
    <div
      onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
      className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
    >
      {filters.zone || "Select Zone"}
    </div>
    {zoneDropdownOpen && (
      <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
        {zones.map((zone, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectZone(zone)}
            className="px-4 py-2 cursor-pointer hover:bg-orange-100"
          >
            {zone}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Location Dropdown */}
  <div className="relative w-full">
    <div
      onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
      className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
    >
      {filters.locationOfProperty || "Select Location"}
    </div>
    {locationDropdownOpen && (
      <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
        {locations.map((loc, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectLocation(loc)}
            className="px-4 py-2 cursor-pointer hover:bg-orange-100"
          >
            {loc}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Buttons */}
  <div className="flex items-center justify-between gap-4">
    <button
      onClick={handleSearch}
      className="flex-1 px-6 py-2 font-semibold text-white transition bg-orange-500 shadow-md rounded-xl hover:bg-orange-600"
    >
      Search
    </button>
    <button
      onClick={clearAll}
      className="flex items-center justify-center w-10 h-10 text-white transition bg-red-500 rounded-full shadow-md hover:bg-red-600"
      title="Clear All"
    >
      <X size={18} />
    </button>
  </div>
</div>

</div>
<section className="py-8 bg-gray-100 overflow-hidden w-full">
  {/* Heading */}
  <h2 className="text-[24px] font-bold text-center text-gray-800 mb-6 px-4">
    Trusted By <span className="text-orange-500">Leading Companies</span>
  </h2>

  {/* Scrolling logos */}
  <div className="relative w-full overflow-hidden">
    <div className="flex logo-slider">
      {[...logos, ...logos].map((logo, idx) => (
        <div
          key={idx}
          className="flex items-center justify-center min-w-[100px] sm:min-w-[140px] mx-4"
        >
          <img
            src={logo}
            alt="company logo"
            className="h-10 sm:h-12 md:h-16 object-contain opacity-80 hover:opacity-100 transition"
          />
        </div>
      ))}
    </div>
  </div>

  {/* Inline CSS for smooth scroll */}
  <style>{`
    .logo-slider {
      animation: scrollLeft 25s linear infinite;
    }
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
</section>

{/* 📍 City Cards Section */}
<section className="w-full py-8 bg-black">
  <div className="max-w-[95%] mx-auto flex flex-col gap-6">
    {/* ✅ Bangalore (Large) */}
    <div
      className="w-full h-[220px] sm:h-[280px] md:h-[340px] relative rounded-xl overflow-hidden"
      onMouseEnter={() => handleMouseEnter(videoRef)}
      onMouseLeave={() => handleMouseLeave(videoRef)}
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        playsInline
      >
        <source src={bglrvideo} type="video/mp4" />
      </video>
      <div className="absolute bottom-3 left-3 text-lg sm:text-xl font-bold text-white">
        Bangalore
      </div>
    </div>

    {/* ✅ Other Cities - Horizontal Slider */}
    <div className="relative">
      {/* Left Button */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
        onClick={() => {
          document.getElementById("cityScroll").scrollBy({ left: -200, behavior: "smooth" });
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Scrollable Cities */}
      <div
        id="cityScroll"
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
      >
        {/* Mumbai */}
        <div
          className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundImage: `url(${mumbai})` }}
          onMouseEnter={() => handleMouseEnter(mumbaiVideoRef)}
          onMouseLeave={() => handleMouseLeave(mumbaiVideoRef)}
        >
          <video
            ref={mumbaiVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
          >
            <source src={mubaivideo} type="video/mp4" />
          </video>
          <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
            Mumbai
          </div>
        </div>

        {/* Kochi */}
        <div
          className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundImage: `url(${kochi})` }}
          onMouseEnter={() => handleMouseEnter(kochiVideoRef)}
          onMouseLeave={() => handleMouseLeave(kochiVideoRef)}
        >
          <video
            ref={kochiVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
          >
            <source src={kochivideo} type="video/mp4" />
          </video>
          <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
            Kochi
          </div>
        </div>

        {/* Noida */}
        <div
          className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundImage: `url(${noida})` }}
          onMouseEnter={() => handleMouseEnter(noidaVideoRef)}
          onMouseLeave={() => handleMouseLeave(noidaVideoRef)}
        >
          <video
            ref={noidaVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
          >
            <source src={noidavideo} type="video/mp4" />
          </video>
          <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
            Noida
          </div>
        </div>

        {/* Hyderabad */}
        <div
          className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundImage: `url(${hydarabad})` }}
          onMouseEnter={() => handleMouseEnter(hydarabadVideoRef)}
          onMouseLeave={() => handleMouseLeave(hydarabadVideoRef)}
        >
          <video
            ref={hydarabadVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
          >
            <source src={hdbdvideo} type="video/mp4" />
          </video>
          <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
            Hyderabad
          </div>
        </div>

        {/* Delhi */}
        <div
          className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundImage: `url(${dehli})` }}
          onMouseEnter={() => handleMouseEnter(dehliVideoRef)}
          onMouseLeave={() => handleMouseLeave(dehliVideoRef)}
        >
          <video
            ref={dehliVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
          >
            <source src={dehlivideo} type="video/mp4" />
          </video>
          <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
            Delhi
          </div>
        </div>

        {/* Chennai */}
        <div
          className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundImage: `url(${chennai})` }}
          onMouseEnter={() => handleMouseEnter(chennaiVideoRef)}
          onMouseLeave={() => handleMouseLeave(chennaiVideoRef)}
        >
          <video
            ref={chennaiVideoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
          >
            <source src={chennaivideo} type="video/mp4" />
          </video>
          <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
            Chennai
          </div>
        </div>
      </div>

      {/* Right Button */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
        onClick={() => {
          document.getElementById("cityScroll").scrollBy({ left: 200, behavior: "smooth" });
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
</section>
<section className="w-full py-10 bg-gray-50">
  <div className="grid grid-cols-1 gap-6 px-4 max-w-md mx-auto">
    {/* Card 1 - Managed Office */}
    <div className="relative overflow-hidden shadow-md rounded-xl group">
      {/* Image */}
      <img
        src="https://e0.pxfuel.com/wallpapers/393/28/desktop-wallpaper-business-meetings-room.jpg"
        alt="Managed Office"
        className="w-full h-[300px] object-cover"
      />

      {/* Default Header */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
        <h3 className="text-lg font-bold">Managed Office</h3>
        <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
          Explore →
        </span>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
        <div>
          <h3 className="mb-2 text-xl font-bold">Managed Office</h3>
          <p className="text-sm">
            Fully serviced offices with modern amenities and flexible terms.
          </p>
          <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
            <li>We handle interiors, maintenance, and utilities</li>
            <li>Ready-to-use with all facilities included</li>
            <li>Perfect for businesses wanting zero setup hassle</li>
          </ul>
        </div>
        <button
          className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={handleExplore}
        >
          Explore
        </button>
      </div>
    </div>

    {/* Card 2 - Office Space */}
    <div className="relative overflow-hidden shadow-md rounded-xl group">
      <img
        src="https://wallpapers.com/images/hd/hd-office-background-1920-x-1080-bcynny890vbtg364.jpg"
        alt="Office Space"
        className="w-full h-[300px] object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
        <h3 className="text-lg font-bold">Office Space</h3>
        <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
          Explore →
        </span>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
        <div>
          <h3 className="mb-2 text-xl font-bold">Office Space</h3>
          <p className="text-sm">
            Dedicated office spaces designed for productivity and comfort.
          </p>
          <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
            <li>Entire space exclusively for your company</li>
            <li>You manage interiors, branding, and operations</li>
            <li>Best for companies wanting full ownership</li>
          </ul>
        </div>
        <button
          className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={handleExplore}
        >
          Explore
        </button>
      </div>
    </div>

    {/* Card 3 - Co-working Space */}
    <div className="relative overflow-hidden shadow-md rounded-xl group">
      <img
        src="https://media.istockphoto.com/id/1365567295/photo/business-colleagues-having-a-meeting-in-a-boardroom.jpg?s=612x612&w=0&k=20&c=R7dhmDVXrXl0A8ZLI0LOeVXf--jktfkCXGpM1xbuj2A="
        alt="Co-working Space"
        className="w-full h-[300px] object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
        <h3 className="text-lg font-bold">Co-working Space</h3>
        <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
          Explore →
        </span>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
        <div>
          <h3 className="mb-2 text-xl font-bold">Co-working Space</h3>
          <p className="text-sm">
            Collaborative workspaces for freelancers, startups, and teams.
          </p>
          <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
            <li>Dedicated seats & private cabins</li>
            <li>All facilities included — just bring your laptop</li>
            <li>Great for individuals and small teams</li>
          </ul>
        </div>
        <button
          className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={handleExplore}
        >
          Explore
        </button>
      </div>
    </div>
  </div>
</section>

{/* Section - Mobile Responsive */}
<section className="py-10  bg-gray-100">
  <div className="flex flex-col items-center gap-8 px-4 max-w-md mx-auto">
    {/* Top Image */}
    <div className="w-full">
      <img
        src={activeImage}
        alt="Workspace"
        className="w-full h-[220px] object-cover rounded-xl shadow-md transition-opacity duration-500 ease-in-out hover:opacity-90"
      />
    </div>

    {/* Content */}
    <div className="flex  flex-col w-full">
      {/* Title */}
      <h2 className="text-xl font-extrabold text-black mb-6 leading-snug text-center">
        Find and Book Your Perfect Workspace in{" "}
        <span className="text-orange-500">4 Easy Steps</span> with{" "}
        <span className="text-orange-500">FidWorx</span>
      </h2>

      {/* Steps */}
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group w-full bg-white shadow-sm rounded-lg p-3 flex items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setActiveImage(step.image)}
          >
            {/* Step Number */}
            <div className="flex items-center justify-center text-sm font-bold text-white bg-orange-500 rounded-full shadow-md w-8 h-8">
              {index + 1}
            </div>

            {/* Step Content */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
                {step.title}
              </h3>
              <p className="text-xs text-gray-600">{step.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-6 text-center">
        <button onClick={handleGetQuoteClick} className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-lg hover:bg-orange-600">
          Connect with Our Team Expert Today
        </button>
      </div>
    </div>
  </div>
</section>

{/* Number Section - Mobile Optimized */}
<section className="mt-[-5px] py-10 text-center bg-white">
  {/* Tagline */}
  <h2 className="mb-10 text-2xl text-gray-900 font-bold leading-snug sm:text-3xl md:text-4xl">
    India’s Premier Marketplace for{" "}
    <span className="text-orange-500">Flexible Workspaces</span>
  </h2>

  {/* Stats Grid */}
  <div className="grid max-w-5xl grid-cols-2 gap-8 mx-auto sm:grid-cols-2 md:grid-cols-4">
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
        1800+
      </h3>
      <p className="mt-1 text-sm text-gray-600 sm:text-base">Partner Spaces</p>
    </div>
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
        1000+
      </h3>
      <p className="mt-1 text-sm text-gray-600 sm:text-base">Clients Served</p>
    </div>
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
        30+
      </h3>
      <p className="mt-1 text-sm text-gray-600 sm:text-base">
        Cities Across India
      </p>
    </div>
    <div>
      <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
        25M+
      </h3>
      <p className="mt-1 text-sm text-gray-600 sm:text-base">
        Sqft of Office Space Options
      </p>
    </div>
  </div>
</section>

{/* Why Choose FidWorx Section */}
<div
  className="mt-10 relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>

  {/* Content Wrapper */}
  <div className="relative z-10 grid w-full grid-cols-1 gap-10 px-6 py-12 max-w-7xl md:grid-cols-2">
    {/* Left Side - Glass Feature Boxes */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {[
        {
          title: "Wide Network",
          desc: "Access 1000+ office spaces across prime locations.",
          logo: "https://cdn-icons-png.flaticon.com/512/883/883407.png",
        },
        {
          title: "Expert Guidance",
          desc: "Our consultants provide end-to-end assistance.",
          logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        },
        {
          title: "Zero Brokerage",
          desc: "Save money with no hidden fees or extra charges.",
          logo: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
        },
        {
          title: "Tailored Solutions",
          desc: "Get workspace solutions customized for your needs.",
          logo: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center p-6 text-center text-white transition-transform transform border shadow-lg backdrop-blur-md bg-white/10 border-white/30 rounded-2xl hover:-translate-y-2"
        >
          <img src={item.logo} alt={item.title} className="w-10 h-10 mb-3 sm:w-12 sm:h-12" />
          <h3 className="text-base font-semibold sm:text-lg">{item.title}</h3>
          <p className="mt-2 text-xs opacity-80 sm:text-sm">{item.desc}</p>
        </div>
      ))}
    </div>

    {/* Right Side - Heading & Content */}
    <div className="flex flex-col justify-center space-y-6 text-white">
      <h2 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl">
        Why choose <span className="text-orange-500">FidWorx?</span>
      </h2>
      <p className="text-sm leading-relaxed opacity-90 sm:text-base md:text-lg">
        We make your office-search a hassle-free experience. With in-depth knowledge, 
        let our workspace solution experts find what you're looking for.
      </p>
      <button onClick={handleGetQuoteClick} className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition bg-orange-500 shadow-lg hover:bg-orange-600 rounded-xl sm:px-6 sm:py-4 sm:text-lg">
        Claim Your Free Consultation with Zero Brokerage Offer Now! →
      </button>
    </div>
  </div>
</div>
{/* What is FidCo Section */}
<div className="flex justify-center items-center py-16 bg-black relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-black opacity-50 blur-2xl"></div>

      <div
        className={`relative bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-black border border-red-700/50 rounded-2xl p-6 w-[90%] text-gray-200 shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-700 transform ${
          isOpen || isHovered ? "scale-[1.01]" : "scale-100"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-white tracking-wide relative text-center cursor-pointer">
          What is{" "}
          <span className="text-red-500 drop-shadow-[0_0_10px_#ff1a1a]">
            FidWorx?
          </span>
        </h2>

        {/* Accent Line */}
        <div
          className={`w-8 h-1 mx-auto bg-red-500 rounded-full mt-3 transition-all duration-500 ${
            isOpen || isHovered ? "opacity-100 mb-6" : "opacity-0"
          }`}
        ></div>

        {/* Expandable Content */}
        <div
          className={`transition-all duration-700 ease-in-out overflow-hidden ${
            isOpen || isHovered ? "opacity-100 max-h-[1000px] mt-4" : "opacity-0 max-h-0"
          }`}
        >
          <p className="text-base text-gray-300 leading-relaxed text-center mb-6">
            <span className="text-red-400 font-semibold">FidWorx</span> is an
            innovative workspace platform by{" "}
            <span className="font-semibold text-white">Fidelitus Corp</span>,
            bridging modern design and business efficiency. It offers
            tailor-made workspace experiences that empower companies to thrive.
          </p>

          {/* Bullet Points */}
          <div className="flex flex-col gap-3 text-sm">
            {[
              "Provides Managed Offices as per client needs.",
              "Premium Office Spaces in top business zones.",
              "Flexible Co-working Spaces for startups & enterprises.",
              "Powered by Fidelitus Corp’s trusted transaction team.",
              "Focus on transparency, efficiency, and design excellence.",
            ].map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-2 bg-gradient-to-r from-red-900/10 to-transparent p-3 rounded-lg hover:bg-red-800/20 transition duration-300"
              >
                <div className="w-2 h-2 mt-[6px] rounded-full bg-red-500 shadow-[0_0_10px_#ff3333]"></div>
                <p className="text-gray-200 leading-snug">{point}</p>
              </div>
            ))}
          </div>

          {/* Subtle glow */}
          <div className="absolute -inset-1 rounded-2xl border border-red-700/30 blur-sm opacity-40 animate-pulse"></div>
        </div>
      </div>
    </div>
<section
      className="relative h-[40vh] flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
        backgroundAttachment: "scroll",
        backgroundPositionY: `${offset}px`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Text content */}
      <div className="relative z-10 px-4 text-center text-white">
        <h2 className="text-4xl font-bold md:text-6xl">
          Your Office Search,{" "}
          <span className="text-orange-500">Simplified By Experts</span>
        </h2>
      </div>
    </section>

{/* About Section */}
<section className="w-full py-16 bg-gray-100">
  <div className="px-6 mx-auto text-center max-w-5xl">
    {/* Heading */}
    <h2 className="mb-6 text-4xl font-bold text-gray-900">
      About <span className="text-orange-500">Us</span>
    </h2>

    {/* Description */}
    <p className="mb-10 text-lg leading-relaxed text-gray-700">
      We are a passionate team dedicated to solving complex problems with{" "}
      <span className="font-semibold text-gray-900">innovative solutions</span>.  
      With a strong focus on customer success, we help businesses transform 
      their operations, enhance efficiency, and achieve sustainable growth.
    </p>

    {/* CTA Button */}
    <button onClick={handleGetQuoteClick}  className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
      Get Started
    </button>
  </div>
</section>
<Footer/>
 <main className="px-4 py-6">
      
        {/* Example bottom nav if your mobile Figma uses it */}
        <MobileBottomNav/>
      </main>
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
  </section>
  );
};

export default Home;








//===============>>>> Old one having issue


// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate, Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import { Menu, X } from "lucide-react";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
// import MobileBottomNav from './mobileComponents/MobileBottomNav';
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";
// import Footer from './Footer';

// const Home = () => {
//   const navigate = useNavigate();
//   const visitorId = Cookies.get("visitorId");
//  const videoRef = useRef(null);
//   // 🔹 Mobile Menu state
//   const [menuOpen, setMenuOpen] = useState(false);
//  const [text, setText] = useState("Manged office");
//   // 🔹 Carousel state
//    const images = [manged, office, coworking];  
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
// //video refs
//  const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);
// // Data from API
//     const [allData, setAllData] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);

//         // Modal states
//         const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//         const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//         const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
//         // Lead message
//         const [leadMessage, setLeadMessage] = useState("");
//         const [userId, setUserId] = useState(null);
//         const [officeId, setOfficeId] = useState(null);




// /////
// const [isOpen, setIsOpen] = useState(false);
// const [isHovered, setIsHovered] = useState(false);

// const handleOpen = () => setIsOpen(true);
// const handleClose = () => setIsOpen(false);



//    const [filters, setFilters] = useState({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });


//             //agent id and property id
//             // useEffect(() => {
//             //   const fetchAll = async () => {
//             //     const result = await searchManagedOffices(1, 100);
//             //     setAllData(result);
//             //     setUserId(result[0].assigned_agent);
//             //     setOfficeId(result[0]._id);
//             //     console.log("***************************",result)
//             //     const uniqueCities = [
//             //       ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//             //     ];
//             //     setCities(uniqueCities);
//             //   };
//             //   fetchAll();
//             // }, []);


//              useEffect(() => {
//                   const fetchOfficeAndAgent = async () => {
//                     try {
//                       const result = await searchManagedOffices(1, 1); // first office only
                
//                       // ✅ Use the new API structure
//                       const office = result?.data?.[0]; 
                
//                       if (office) {
//                         setUserId(office.assigned_agent || null);
//                         setOfficeId(office._id || null);
//                         console.log("Fetched office & agent for AboutUs:", office);
//                       } else {
//                         setUserId(null);
//                         setOfficeId(null);
//                         console.warn("No managed offices found.");
//                       }
//                     } catch (error) {
//                       console.error("Error fetching office data:", error);
//                       setUserId(null);
//                       setOfficeId(null);
//                     }
//                   };
                
//                   fetchOfficeAndAgent();
//                 }, []);

//      useEffect(() => {
//         const words = ["Manged office", "Coworking space","Office space", ];
//         let index = 0;
        
//         const interval = setInterval(() => {
//           index = (index + 1) % words.length;
//           setText(words[index]);
//         }, 4000); // Change text every 3 seconds
    
//         return () => clearInterval(interval); // Cleanup on unmount
//       }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFadeIn(false); // start fade out
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
//         setFadeIn(true); // fade in new image
//       }, 500); // match fade-out timing
//     }, 4000); // ⏰ change every 4s

//     return () => clearInterval(interval);
//   }, [images.length]);

//    // Handle filter changes
//     const workspaceOptions = [
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ];
  
//     // 🔥 Utility to get API function based on category
//     const getApiByCategory = (category) => {
//       if (category === "managed") return searchManagedOffices;
//       if (category === "office") return searchOfficeSpaces;
//       if (category === "co-working") return searchCoWorkingSpaceData;
//       return searchManagedOffices; // default
//     };
  
  
    
//    // Fetch data whenever category changes
//     useEffect(() => {
//       if (!filters.category) return;
  
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
  
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
  
//       fetchData();
//     }, [filters.category]);
  
  
//    const handleSelectCategory = (value) => {
//     setFilters((prev) => ({
//       ...prev,
//       category: value,
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//     }));
//     setWorkspaceDropdownOpen(false);
//   };
  
  
//   const handleSelectCity = (city) => {
//     setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//     setCityDropdownOpen(false);
  
//     const cityZones = [
//       ...new Set(
//         allData
//           .filter((item) => item.location?.city === city)
//           .map((item) => item.location?.zone)
//           .filter(Boolean)
//       ),
//     ];
//     setZones(cityZones);
//     setLocations([]);
//   };
  
  
//   const handleSelectZone = (zone) => {
//     setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//     setZoneDropdownOpen(false);
  
//     const zoneLocations = [
//       ...new Set(
//         allData
//           .filter(
//             (item) =>
//               item.location?.city === filters.city &&
//               item.location?.zone === zone
//           )
//           .map((item) => item.location?.locationOfProperty)
//           .filter(Boolean)
//       ),
//     ];
//     setLocations(zoneLocations);
//   };
  
//   const handleSelectLocation = (loc) => {
//     setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     setLocationDropdownOpen(false);
//   };
//    // Search action
//    const handleSearch = () => {
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
//   const handleExplore = () => {
//     navigate("/menu");
//   };

//    // Reset filters
//    const clearAll = () => {
//     setFilters({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });
//     setCities([]);
//     setZones([]);
//     setLocations([]);
//     setAllData([]);
//   };

//   const logos = [
//   "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//   "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//   "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//    "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//     "https://www.maestro.com/assets/images/maestrologo.png",
//     "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//   ];

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

//    const steps = [
//         {
//           title: "Share Your Requirements",
//           subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
//           image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Get Customized Options",
//           subtitle: "We’ll provide tailored workspace suggestions for you",
//           image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Visit & Finalize",
//           subtitle: "Tour shortlisted spaces and choose the best fit",
//           image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
//         },
//         {
//           title: "Move In Smoothly",
//           subtitle: "We’ll assist with agreements and a hassle-free setup",
//           image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
//         },
//       ];
      
//       const [activeImage, setActiveImage] = useState(steps[0].image);


// //3d image 
//       const [offset, setOffset] = useState(0);
      
//       useEffect(() => {
//         const handleScroll = () => {
//           setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
//         };
      
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//       }, []);



//       //model functions
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
// const handleGetQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true);
//   } else {
//     setIsAuthModalOpen(true);
//   }
// };
//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">

//       {/* 🔹 Header Bar */}
//       <div className="w-full h-[70px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//   {/* Logo */}
//       <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
//       FidWorx
//      </h1>

//   {/* Wishlist Sidebar at top-right */}
//   <div>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
//   </div>
// </div>

//       {/* 🔹 Background Carousel */}
// <div className="absolute top-[98px] left-0 w-full h-[439px]">
//   {/* Carousel Image */}
//   <div
//     className={`absolute top-0 left-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
//       fadeIn ? "opacity-100" : "opacity-0"
//     }`}
//     style={{ backgroundImage: `url(${images[currentIndex]})` }}
//   ></div>

//   {/* Dark Transparent Overlay */}
//   <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

//   {/* Heading Text */}
// <div className="relative z-10 flex flex-col items-center justify-start h-full text-white pt-5">
//   <h1 className="text-[25px] sm:text-4xl md:text-5xl font-bold leading-tight mb-[3px]">
//     Find your perfect
//   </h1>
//   {/* Horizontal Scrolling Text */}
//   <div className="overflow-hidden w-[300px]">
//     <div
//       className="whitespace-nowrap animate-scroll-horizontal text-yellow-400 font-bold"
//       style={{ fontSize: "26px" }}
//     >
//       {text}
//     </div>
//   </div>
//   {/* 🔥 Mobile Search Box */}
// <div className="flex flex-col w-full max-w-sm mx-auto gap-4 p-4 mt-6 border shadow-lg bg-white/10 backdrop-blur-md border-white/30 rounded-2xl">
//   {/* Category Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.category
//         ? workspaceOptions.find((w) => w.value === filters.category)?.label
//         : "Select Category"}
//     </div>
//     {workspaceDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {workspaceOptions.map((opt) => (
//           <div
//             key={opt.value}
//             onClick={() => handleSelectCategory(opt.value)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {opt.label}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* City Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.city || "Select City"}
//     </div>
//     {cityDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {cities.map((city, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectCity(city)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {city}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Zone Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.zone || "Select Zone"}
//     </div>
//     {zoneDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {zones.map((zone, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectZone(zone)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {zone}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Location Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.locationOfProperty || "Select Location"}
//     </div>
//     {locationDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {locations.map((loc, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectLocation(loc)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {loc}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Buttons */}
//   <div className="flex items-center justify-between gap-4">
//     <button
//       onClick={handleSearch}
//       className="flex-1 px-6 py-2 font-semibold text-white transition bg-orange-500 shadow-md rounded-xl hover:bg-orange-600"
//     >
//       Search
//     </button>
//     <button
//       onClick={clearAll}
//       className="flex items-center justify-center w-10 h-10 text-white transition bg-red-500 rounded-full shadow-md hover:bg-red-600"
//       title="Clear All"
//     >
//       <X size={18} />
//     </button>
//   </div>
// </div>

// </div>
// <section className="py-8 bg-gray-100 overflow-hidden w-full">
//   {/* Heading */}
//   <h2 className="text-[24px] font-bold text-center text-gray-800 mb-6 px-4">
//     Trusted By <span className="text-orange-500">Leading Companies</span>
//   </h2>

//   {/* Scrolling logos */}
//   <div className="relative w-full overflow-hidden">
//     <div className="flex logo-slider">
//       {[...logos, ...logos].map((logo, idx) => (
//         <div
//           key={idx}
//           className="flex items-center justify-center min-w-[100px] sm:min-w-[140px] mx-4"
//         >
//           <img
//             src={logo}
//             alt="company logo"
//             className="h-10 sm:h-12 md:h-16 object-contain opacity-80 hover:opacity-100 transition"
//           />
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Inline CSS for smooth scroll */}
//   <style>{`
//     .logo-slider {
//       animation: scrollLeft 25s linear infinite;
//     }
//     @keyframes scrollLeft {
//       0% { transform: translateX(0); }
//       100% { transform: translateX(-50%); }
//     }
//   `}</style>
// </section>

// {/* 📍 City Cards Section */}
// <section className="w-full py-8 bg-black">
//   <div className="max-w-[95%] mx-auto flex flex-col gap-6">
//     {/* ✅ Bangalore (Large) */}
//     <div
//       className="w-full h-[220px] sm:h-[280px] md:h-[340px] relative rounded-xl overflow-hidden"
//       onMouseEnter={() => handleMouseEnter(videoRef)}
//       onMouseLeave={() => handleMouseLeave(videoRef)}
//     >
//       <video
//         ref={videoRef}
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         muted
//         playsInline
//       >
//         <source src={bglrvideo} type="video/mp4" />
//       </video>
//       <div className="absolute bottom-3 left-3 text-lg sm:text-xl font-bold text-white">
//         Bangalore
//       </div>
//     </div>

//     {/* ✅ Other Cities - Horizontal Slider */}
//     <div className="relative">
//       {/* Left Button */}
//       <button
//         className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
//         onClick={() => {
//           document.getElementById("cityScroll").scrollBy({ left: -200, behavior: "smooth" });
//         }}
//       >
//         <ChevronLeft size={20} />
//       </button>

//       {/* Scrollable Cities */}
//       <div
//         id="cityScroll"
//         className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
//       >
//         {/* Mumbai */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${mumbai})` }}
//           onMouseEnter={() => handleMouseEnter(mumbaiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(mumbaiVideoRef)}
//         >
//           <video
//             ref={mumbaiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={mubaivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Mumbai
//           </div>
//         </div>

//         {/* Kochi */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${kochi})` }}
//           onMouseEnter={() => handleMouseEnter(kochiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(kochiVideoRef)}
//         >
//           <video
//             ref={kochiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={kochivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Kochi
//           </div>
//         </div>

//         {/* Noida */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${noida})` }}
//           onMouseEnter={() => handleMouseEnter(noidaVideoRef)}
//           onMouseLeave={() => handleMouseLeave(noidaVideoRef)}
//         >
//           <video
//             ref={noidaVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={noidavideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Noida
//           </div>
//         </div>

//         {/* Hyderabad */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${hydarabad})` }}
//           onMouseEnter={() => handleMouseEnter(hydarabadVideoRef)}
//           onMouseLeave={() => handleMouseLeave(hydarabadVideoRef)}
//         >
//           <video
//             ref={hydarabadVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={hdbdvideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Hyderabad
//           </div>
//         </div>

//         {/* Delhi */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${dehli})` }}
//           onMouseEnter={() => handleMouseEnter(dehliVideoRef)}
//           onMouseLeave={() => handleMouseLeave(dehliVideoRef)}
//         >
//           <video
//             ref={dehliVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={dehlivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Delhi
//           </div>
//         </div>

//         {/* Chennai */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${chennai})` }}
//           onMouseEnter={() => handleMouseEnter(chennaiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(chennaiVideoRef)}
//         >
//           <video
//             ref={chennaiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={chennaivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Chennai
//           </div>
//         </div>
//       </div>

//       {/* Right Button */}
//       <button
//         className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
//         onClick={() => {
//           document.getElementById("cityScroll").scrollBy({ left: 200, behavior: "smooth" });
//         }}
//       >
//         <ChevronRight size={20} />
//       </button>
//     </div>
//   </div>
// </section>
// <section className="w-full py-10 bg-gray-50">
//   <div className="grid grid-cols-1 gap-6 px-4 max-w-md mx-auto">
//     {/* Card 1 - Managed Office */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       {/* Image */}
//       <img
//         src="https://e0.pxfuel.com/wallpapers/393/28/desktop-wallpaper-business-meetings-room.jpg"
//         alt="Managed Office"
//         className="w-full h-[300px] object-cover"
//       />

//       {/* Default Header */}
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Managed Office</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Managed Office</h3>
//           <p className="text-sm">
//             Fully serviced offices with modern amenities and flexible terms.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>We handle interiors, maintenance, and utilities</li>
//             <li>Ready-to-use with all facilities included</li>
//             <li>Perfect for businesses wanting zero setup hassle</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>

//     {/* Card 2 - Office Space */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       <img
//         src="https://wallpapers.com/images/hd/hd-office-background-1920-x-1080-bcynny890vbtg364.jpg"
//         alt="Office Space"
//         className="w-full h-[300px] object-cover"
//       />
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Office Space</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Office Space</h3>
//           <p className="text-sm">
//             Dedicated office spaces designed for productivity and comfort.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>Entire space exclusively for your company</li>
//             <li>You manage interiors, branding, and operations</li>
//             <li>Best for companies wanting full ownership</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>

//     {/* Card 3 - Co-working Space */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       <img
//         src="https://media.istockphoto.com/id/1365567295/photo/business-colleagues-having-a-meeting-in-a-boardroom.jpg?s=612x612&w=0&k=20&c=R7dhmDVXrXl0A8ZLI0LOeVXf--jktfkCXGpM1xbuj2A="
//         alt="Co-working Space"
//         className="w-full h-[300px] object-cover"
//       />
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Co-working Space</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Co-working Space</h3>
//           <p className="text-sm">
//             Collaborative workspaces for freelancers, startups, and teams.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>Dedicated seats & private cabins</li>
//             <li>All facilities included — just bring your laptop</li>
//             <li>Great for individuals and small teams</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>
//   </div>
// </section>

// {/* Section - Mobile Responsive */}
// <section className="py-10  bg-gray-100">
//   <div className="flex flex-col items-center gap-8 px-4 max-w-md mx-auto">
//     {/* Top Image */}
//     <div className="w-full">
//       <img
//         src={activeImage}
//         alt="Workspace"
//         className="w-full h-[220px] object-cover rounded-xl shadow-md transition-opacity duration-500 ease-in-out hover:opacity-90"
//       />
//     </div>

//     {/* Content */}
//     <div className="flex  flex-col w-full">
//       {/* Title */}
//       <h2 className="text-xl font-extrabold text-black mb-6 leading-snug text-center">
//         Find and Book Your Perfect Workspace in{" "}
//         <span className="text-orange-500">4 Easy Steps</span> with{" "}
//         <span className="text-orange-500">FidWorx</span>
//       </h2>

//       {/* Steps */}
//       <div className="flex flex-col gap-4">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="group w-full bg-white shadow-sm rounded-lg p-3 flex items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//             onMouseEnter={() => setActiveImage(step.image)}
//           >
//             {/* Step Number */}
//             <div className="flex items-center justify-center text-sm font-bold text-white bg-orange-500 rounded-full shadow-md w-8 h-8">
//               {index + 1}
//             </div>

//             {/* Step Content */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
//                 {step.title}
//               </h3>
//               <p className="text-xs text-gray-600">{step.subtitle}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//       <div className="mt-6 text-center">
//         <button onClick={handleGetQuoteClick} className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-lg hover:bg-orange-600">
//           Connect with Our Team Expert Today
//         </button>
//       </div>
//     </div>
//   </div>
// </section>

// {/* Number Section - Mobile Optimized */}
// <section className="mt-[-5px] py-10 text-center bg-white">
//   {/* Tagline */}
//   <h2 className="mb-10 text-2xl text-gray-900 font-bold leading-snug sm:text-3xl md:text-4xl">
//     India’s Premier Marketplace for{" "}
//     <span className="text-orange-500">Flexible Workspaces</span>
//   </h2>

//   {/* Stats Grid */}
//   <div className="grid max-w-5xl grid-cols-2 gap-8 mx-auto sm:grid-cols-2 md:grid-cols-4">
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         1800+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">Partner Spaces</p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         1000+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">Clients Served</p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         30+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">
//         Cities Across India
//       </p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         25M+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">
//         Sqft of Office Space Options
//       </p>
//     </div>
//   </div>
// </section>

// {/* Why Choose FidWorx Section */}
// <div
//   className="mt-10 relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//   {/* Content Wrapper */}
//   <div className="relative z-10 grid w-full grid-cols-1 gap-10 px-6 py-12 max-w-7xl md:grid-cols-2">
//     {/* Left Side - Glass Feature Boxes */}
//     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//       {[
//         {
//           title: "Wide Network",
//           desc: "Access 1000+ office spaces across prime locations.",
//           logo: "https://cdn-icons-png.flaticon.com/512/883/883407.png",
//         },
//         {
//           title: "Expert Guidance",
//           desc: "Our consultants provide end-to-end assistance.",
//           logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//         },
//         {
//           title: "Zero Brokerage",
//           desc: "Save money with no hidden fees or extra charges.",
//           logo: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
//         },
//         {
//           title: "Tailored Solutions",
//           desc: "Get workspace solutions customized for your needs.",
//           logo: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
//         },
//       ].map((item, i) => (
//         <div
//           key={i}
//           className="flex flex-col items-center p-6 text-center text-white transition-transform transform border shadow-lg backdrop-blur-md bg-white/10 border-white/30 rounded-2xl hover:-translate-y-2"
//         >
//           <img src={item.logo} alt={item.title} className="w-10 h-10 mb-3 sm:w-12 sm:h-12" />
//           <h3 className="text-base font-semibold sm:text-lg">{item.title}</h3>
//           <p className="mt-2 text-xs opacity-80 sm:text-sm">{item.desc}</p>
//         </div>
//       ))}
//     </div>

//     {/* Right Side - Heading & Content */}
//     <div className="flex flex-col justify-center space-y-6 text-white">
//       <h2 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl">
//         Why choose <span className="text-orange-500">FidWorx?</span>
//       </h2>
//       <p className="text-sm leading-relaxed opacity-90 sm:text-base md:text-lg">
//         We make your office-search a hassle-free experience. With in-depth knowledge, 
//         let our workspace solution experts find what you're looking for.
//       </p>
//       <button onClick={handleGetQuoteClick} className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition bg-orange-500 shadow-lg hover:bg-orange-600 rounded-xl sm:px-6 sm:py-4 sm:text-lg">
//         Claim Your Free Consultation with Zero Brokerage Offer Now! →
//       </button>
//     </div>
//   </div>
// </div>
// {/* What is FidCo Section */}
// <div className="flex justify-center items-center py-16 bg-black relative overflow-hidden">
//       {/* Animated background glow */}
//       <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-black opacity-50 blur-2xl"></div>

//       <div
//         className={`relative bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-black border border-red-700/50 rounded-2xl p-6 w-[90%] text-gray-200 shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-700 transform ${
//           isOpen || isHovered ? "scale-[1.01]" : "scale-100"
//         }`}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {/* Header */}
//         <h2 className="text-3xl font-extrabold text-white tracking-wide relative text-center cursor-pointer">
//           What is{" "}
//           <span className="text-red-500 drop-shadow-[0_0_10px_#ff1a1a]">
//             FidWorx?
//           </span>
//         </h2>

//         {/* Accent Line */}
//         <div
//           className={`w-8 h-1 mx-auto bg-red-500 rounded-full mt-3 transition-all duration-500 ${
//             isOpen || isHovered ? "opacity-100 mb-6" : "opacity-0"
//           }`}
//         ></div>

//         {/* Expandable Content */}
//         <div
//           className={`transition-all duration-700 ease-in-out overflow-hidden ${
//             isOpen || isHovered ? "opacity-100 max-h-[1000px] mt-4" : "opacity-0 max-h-0"
//           }`}
//         >
//           <p className="text-base text-gray-300 leading-relaxed text-center mb-6">
//             <span className="text-red-400 font-semibold">FidWorx</span> is an
//             innovative workspace platform by{" "}
//             <span className="font-semibold text-white">Fidelitus Corp</span>,
//             bridging modern design and business efficiency. It offers
//             tailor-made workspace experiences that empower companies to thrive.
//           </p>

//           {/* Bullet Points */}
//           <div className="flex flex-col gap-3 text-sm">
//             {[
//               "Provides Managed Offices as per client needs.",
//               "Premium Office Spaces in top business zones.",
//               "Flexible Co-working Spaces for startups & enterprises.",
//               "Powered by Fidelitus Corp’s trusted transaction team.",
//               "Focus on transparency, efficiency, and design excellence.",
//             ].map((point, index) => (
//               <div
//                 key={index}
//                 className="flex items-start gap-2 bg-gradient-to-r from-red-900/10 to-transparent p-3 rounded-lg hover:bg-red-800/20 transition duration-300"
//               >
//                 <div className="w-2 h-2 mt-[6px] rounded-full bg-red-500 shadow-[0_0_10px_#ff3333]"></div>
//                 <p className="text-gray-200 leading-snug">{point}</p>
//               </div>
//             ))}
//           </div>

//           {/* Subtle glow */}
//           <div className="absolute -inset-1 rounded-2xl border border-red-700/30 blur-sm opacity-40 animate-pulse"></div>
//         </div>
//       </div>
//     </div>
// <section
//       className="relative h-[40vh] flex items-center justify-center bg-center bg-cover"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
//         backgroundAttachment: "scroll",
//         backgroundPositionY: `${offset}px`,
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Text content */}
//       <div className="relative z-10 px-4 text-center text-white">
//         <h2 className="text-4xl font-bold md:text-6xl">
//           Your Office Search,{" "}
//           <span className="text-orange-500">Simplified By Experts</span>
//         </h2>
//       </div>
//     </section>

// {/* About Section */}
// <section className="w-full py-16 bg-gray-100">
//   <div className="px-6 mx-auto text-center max-w-5xl">
//     {/* Heading */}
//     <h2 className="mb-6 text-4xl font-bold text-gray-900">
//       About <span className="text-orange-500">Us</span>
//     </h2>

//     {/* Description */}
//     <p className="mb-10 text-lg leading-relaxed text-gray-700">
//       We are a passionate team dedicated to solving complex problems with{" "}
//       <span className="font-semibold text-gray-900">innovative solutions</span>.  
//       With a strong focus on customer success, we help businesses transform 
//       their operations, enhance efficiency, and achieve sustainable growth.
//     </p>

//     {/* CTA Button */}
//     <button onClick={handleGetQuoteClick}  className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
//       Get Started
//     </button>
//   </div>
// </section>
// <Footer/>
//  <main className="px-4 py-6">
      
//         {/* Example bottom nav if your mobile Figma uses it */}
//         <MobileBottomNav/>
//       </main>
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
//   </section>
//   );
// };

// export default Home;








//========>> Below is updated for login flow



// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate, Link ,useLocation} from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import { Menu, X } from "lucide-react";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";

// import Footer from './Footer';
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';
// import MobileBottomNav from './mobileComponents/MobileBottomNav';

// const Home = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
// const currentPath = location.pathname; // e.g., "/", "/menu", "/about"
//   const visitorId = Cookies.get("visitorId");
//  const videoRef = useRef(null);
//   // 🔹 Mobile Menu state
//   // const [menuOpen, setMenuOpen] = useState(false);
//  const [text, setText] = useState("Manged office");
//   // 🔹 Carousel state
//    const images = [manged, office, coworking];  
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
// //video refs
//  const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);
// // Data from API
//     const [allData, setAllData] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);

//     // Modal states
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     const [visitorIdState, setVisitorIdState] = useState(Cookies.get("visitorId"));
//     // Lead message
//     const [leadMessage, setLeadMessage] = useState("");
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);

//    const [filters, setFilters] = useState({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });

//         //agent id and property id
//       useEffect(() => {
//         const fetchAll = async () => {
//           const result = await searchManagedOffices(1, 100);
//           setAllData(result);
//           setUserId(result[0].assigned_agent);
//           setOfficeId(result[0]._id);
//           console.log("***************************",result)
//           const uniqueCities = [
//             ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         };
//         fetchAll();
//       }, []);

//      useEffect(() => {
//         const words = ["Manged office", "Coworking space","Office space", ];
//         let index = 0;
        
//         const interval = setInterval(() => {
//           index = (index + 1) % words.length;
//           setText(words[index]);
//         }, 4000); // Change text every 3 seconds
    
//         return () => clearInterval(interval); // Cleanup on unmount
//       }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFadeIn(false); // start fade out
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
//         setFadeIn(true); // fade in new image
//       }, 500); // match fade-out timing
//     }, 4000); // ⏰ change every 4s

//     return () => clearInterval(interval);
//   }, [images.length]);

//    // Handle filter changes
//     const workspaceOptions = [
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ];
  
//     // 🔥 Utility to get API function based on category
//     const getApiByCategory = (category) => {
//       if (category === "managed") return searchManagedOffices;
//       if (category === "office") return searchOfficeSpaces;
//       if (category === "co-working") return searchCoWorkingSpaceData;
//       return searchManagedOffices; // default
//     };
  
  
    
//    // Fetch data whenever category changes
//     useEffect(() => {
//       if (!filters.category) return;
  
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
  
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
  
//       fetchData();
//     }, [filters.category]);
  
  
//    const handleSelectCategory = (value) => {
//     setFilters((prev) => ({
//       ...prev,
//       category: value,
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//     }));
//     setWorkspaceDropdownOpen(false);
//   };
  
  
//   const handleSelectCity = (city) => {
//     setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//     setCityDropdownOpen(false);
  
//     const cityZones = [
//       ...new Set(
//         allData
//           .filter((item) => item.location?.city === city)
//           .map((item) => item.location?.zone)
//           .filter(Boolean)
//       ),
//     ];
//     setZones(cityZones);
//     setLocations([]);
//   };
  
  
//   const handleSelectZone = (zone) => {
//     setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//     setZoneDropdownOpen(false);
  
//     const zoneLocations = [
//       ...new Set(
//         allData
//           .filter(
//             (item) =>
//               item.location?.city === filters.city &&
//               item.location?.zone === zone
//           )
//           .map((item) => item.location?.locationOfProperty)
//           .filter(Boolean)
//       ),
//     ];
//     setLocations(zoneLocations);
//   };
  
//   const handleSelectLocation = (loc) => {
//     setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     setLocationDropdownOpen(false);
//   };
//    // Search action
//    const handleSearch = () => {
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
//   const handleExplore = () => {
//     navigate("/menu");
//   };

//    // Reset filters
//    const clearAll = () => {
//     setFilters({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });
//     setCities([]);
//     setZones([]);
//     setLocations([]);
//     setAllData([]);
//   };

//   const logos = [
//   "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//   "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//   "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//    "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//     "https://www.maestro.com/assets/images/maestrologo.png",
//     "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//   ];

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

//    const steps = [
//         {
//           title: "Share Your Requirements",
//           subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
//           image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Get Customized Options",
//           subtitle: "We’ll provide tailored workspace suggestions for you",
//           image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Visit & Finalize",
//           subtitle: "Tour shortlisted spaces and choose the best fit",
//           image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
//         },
//         {
//           title: "Move In Smoothly",
//           subtitle: "We’ll assist with agreements and a hassle-free setup",
//           image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
//         },
//       ];
      
//       const [activeImage, setActiveImage] = useState(steps[0].image);


// //3d image 
//       const [offset, setOffset] = useState(0);
      
//       useEffect(() => {
//         const handleScroll = () => {
//           setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
//         };
      
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//       }, []);

// //model functions
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
// const handleGetQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true);
//   } else {
//     setIsAuthModalOpen(true);
//   }
// };


//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">
//       {/* 🔹 Header Bar */}
    
//   {/* 🔹 Header Bar */}
//       <div className="w-full h-[75px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//   {/* Logo */}
//       <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
//       FidWorx
//      </h1>

//   {/* Wishlist Sidebar at top-right */}
//   <div>
//   <WishlistSidebar
//   visitorId={visitorIdState}
//   onLoginRequired={() => setIsAuthModalOpen(true)}
//   onLogout={() => {
//     setVisitorIdState(null); // ✅ hide wishlist icon in MenuPage
//   }}
// />
//   </div>
// </div>
//       {/* 🔹 Slide-in Mobile Menu */}
//       {/* 🔹 Background Carousel */}
// <div className="absolute top-[98px] left-0 w-full h-[439px]">
//   {/* Dark Transparent Overlay */}
//   <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
// {/* Section - Mobile Responsive */}
// <section className="py-10  bg-gray-100">
//   <div className="flex flex-col items-center gap-8 px-4 max-w-md mx-auto">
//     {/* Content */}
//     <div className="flex  flex-col w-full">
//       {/* Title */}
//       <h2 className="text-xl font-extrabold text-black mb-6 leading-snug text-center">
//         Find and Book Your Perfect Workspace in{" "}
//         <span className="text-orange-500">4 Easy Steps</span> with{" "}
//         <span className="text-orange-500">FidWorx</span>
//       </h2>

//       {/* Steps */}
//       <div className="flex flex-col gap-4">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="group w-full bg-white shadow-sm rounded-lg p-3 flex items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//             onMouseEnter={() => setActiveImage(step.image)}
//           >
//             {/* Step Number */}
//             <div className="flex items-center justify-center text-sm font-bold text-white bg-orange-500 rounded-full shadow-md w-8 h-8">
//               {index + 1}
//             </div>

//             {/* Step Content */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
//                 {step.title}
//               </h3>
//               <p className="text-xs text-gray-600">{step.subtitle}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//       <div className="mt-6 text-center">
//         <button  onClick={handleGetQuoteClick} className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-lg hover:bg-orange-600">
//           Connect Us
//         </button>
//       </div>
//     </div>
//   </div>
// </section>


// {/* Why Choose FidWorx Section */}
// <div
//   className="mt-10 relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-black bg-opacity-50"></div>
// </div>
// {/* What is FidCo Section */}
// <div className="flex items-center justify-center py-12 px-4 bg-gray-50">
//   <div className="relative w-72 sm:w-80 p-6 overflow-hidden transition-all duration-500 bg-white shadow-lg cursor-pointer group rounded-2xl hover:h-56">
//     {/* Default Heading */}
//     <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 transition-opacity duration-300 group-hover:opacity-0">
//       What is FidCo?
//     </h3>

//     {/* Hover Content */}
//     <div className="absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//       <p className="text-sm text-gray-600 sm:text-base">
//         FidCo is your trusted partner for flexible workspace solutions, 
//         connecting businesses with offices, co-working, and managed spaces across India.
//       </p>
//     </div>
//   </div>
// </div>
// <section
//       className="relative h-[40vh] flex items-center justify-center bg-center bg-cover"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
//         backgroundAttachment: "scroll",
//         backgroundPositionY: `${offset}px`,
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Text content */}
//       <div className="relative z-10 px-4 text-center text-white">
//         <h2 className="text-4xl font-bold md:text-6xl">
//           Your Office Search,{" "}
//           <span className="text-orange-500">Simplified By Experts</span>
//         </h2>
//       </div>
//     </section>

// {/* About Section */}
// <section className="w-full py-16 bg-gray-100">
//   <div className="px-6 mx-auto text-center max-w-5xl">
//     {/* CTA Button */}
//     <button onClick={handleGetQuoteClick} className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
//       Get Started
//     </button>
//   </div>
// </section>
// <Footer/>
//  <main className="px-4 py-6">
//         <h2 className="text-2xl font-semibold text-[#16607B]">About Us</h2>
//         <p className="mt-3 text-base text-gray-700">
//           Mobile-optimized layout. Replace with your mobile Figma layout (stacked sections, larger tap targets, etc.).
//         </p>
//         {/* Example bottom nav if your mobile Figma uses it */}
// <MobileBottomNav/>

//       </main>
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
//   </section>
//   );
// };

// export default Home;








//Updated the main flow for button working on wishlist


// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate, Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import { Menu, X } from "lucide-react";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { postVisitorData, postLeadData } from "../../api/services/visitorService";

// import Footer from './Footer';
// import MobileAuthModal from './mobileComponents/MobileAuthModal';
// import MobileLeadEnquiryModal from './mobileComponents/MobileLeadEnquiryModal';

// const Home = () => {
//   const navigate = useNavigate();
//   const visitorId = Cookies.get("visitorId");
//  const videoRef = useRef(null);
//   // 🔹 Mobile Menu state
//   const [menuOpen, setMenuOpen] = useState(false);
//  const [text, setText] = useState("Manged office");
//   // 🔹 Carousel state
//    const images = [manged, office, coworking];  
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
// //video refs
//  const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);
// // Data from API
//     const [allData, setAllData] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);

//     // Modal states
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//     const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//     // Lead message
//     const [leadMessage, setLeadMessage] = useState("");
//     const [userId, setUserId] = useState(null);
//     const [officeId, setOfficeId] = useState(null);

//    const [filters, setFilters] = useState({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });

//         //agent id and property id
//       useEffect(() => {
//         const fetchAll = async () => {
//           const result = await searchManagedOffices(1, 100);
//           setAllData(result);
//           setUserId(result[0].assigned_agent);
//           setOfficeId(result[0]._id);
//           console.log("***************************",result)
//           const uniqueCities = [
//             ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//           ];
//           setCities(uniqueCities);
//         };
//         fetchAll();
//       }, []);

//      useEffect(() => {
//         const words = ["Manged office", "Coworking space","Office space", ];
//         let index = 0;
        
//         const interval = setInterval(() => {
//           index = (index + 1) % words.length;
//           setText(words[index]);
//         }, 4000); // Change text every 3 seconds
    
//         return () => clearInterval(interval); // Cleanup on unmount
//       }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFadeIn(false); // start fade out
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
//         setFadeIn(true); // fade in new image
//       }, 500); // match fade-out timing
//     }, 4000); // ⏰ change every 4s

//     return () => clearInterval(interval);
//   }, [images.length]);

//    // Handle filter changes
//     const workspaceOptions = [
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ];
  
//     // 🔥 Utility to get API function based on category
//     const getApiByCategory = (category) => {
//       if (category === "managed") return searchManagedOffices;
//       if (category === "office") return searchOfficeSpaces;
//       if (category === "co-working") return searchCoWorkingSpaceData;
//       return searchManagedOffices; // default
//     };
  
  
    
//    // Fetch data whenever category changes
//     useEffect(() => {
//       if (!filters.category) return;
  
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
  
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
  
//       fetchData();
//     }, [filters.category]);
  
  
//    const handleSelectCategory = (value) => {
//     setFilters((prev) => ({
//       ...prev,
//       category: value,
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//     }));
//     setWorkspaceDropdownOpen(false);
//   };
  
  
//   const handleSelectCity = (city) => {
//     setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//     setCityDropdownOpen(false);
  
//     const cityZones = [
//       ...new Set(
//         allData
//           .filter((item) => item.location?.city === city)
//           .map((item) => item.location?.zone)
//           .filter(Boolean)
//       ),
//     ];
//     setZones(cityZones);
//     setLocations([]);
//   };
  
  
//   const handleSelectZone = (zone) => {
//     setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//     setZoneDropdownOpen(false);
  
//     const zoneLocations = [
//       ...new Set(
//         allData
//           .filter(
//             (item) =>
//               item.location?.city === filters.city &&
//               item.location?.zone === zone
//           )
//           .map((item) => item.location?.locationOfProperty)
//           .filter(Boolean)
//       ),
//     ];
//     setLocations(zoneLocations);
//   };
  
//   const handleSelectLocation = (loc) => {
//     setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     setLocationDropdownOpen(false);
//   };
//    // Search action
//    const handleSearch = () => {
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
//   const handleExplore = () => {
//     navigate("/menu");
//   };

//    // Reset filters
//    const clearAll = () => {
//     setFilters({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });
//     setCities([]);
//     setZones([]);
//     setLocations([]);
//     setAllData([]);
//   };

//   const logos = [
//   "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//   "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//   "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//    "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//     "https://www.maestro.com/assets/images/maestrologo.png",
//     "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//   ];

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

//    const steps = [
//         {
//           title: "Share Your Requirements",
//           subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
//           image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Get Customized Options",
//           subtitle: "We’ll provide tailored workspace suggestions for you",
//           image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Visit & Finalize",
//           subtitle: "Tour shortlisted spaces and choose the best fit",
//           image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
//         },
//         {
//           title: "Move In Smoothly",
//           subtitle: "We’ll assist with agreements and a hassle-free setup",
//           image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
//         },
//       ];
      
//       const [activeImage, setActiveImage] = useState(steps[0].image);


// //3d image 
//       const [offset, setOffset] = useState(0);
      
//       useEffect(() => {
//         const handleScroll = () => {
//           setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
//         };
      
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//       }, []);

// //model functions
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



// const handleGetQuoteClick = () => {
//   const visitorId = Cookies.get("visitorId");
//   if (visitorId) {
//     setIsLeadModalOpen(true);
//   } else {
//     setIsAuthModalOpen(true);
//   }
// };


//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">

//       {/* 🔹 Header Bar */}
//       <div className="w-full h-[98px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
//           FidWorx
//         </h1>

//         {/* Burger Icon */}
//         <button
//           className="text-white z-50"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* 🔹 Slide-in Mobile Menu */}
//       {menuOpen && (
//         <div className="fixed top-[98px] right-0 w-3/4 h-screen bg-blue-700 text-white shadow-lg z-40 p-6 space-y-6 animate-slide-in">
//           <Link
//             to="/"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             to="/menu"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Explore Spaces
//           </Link>
//           <Link
//             to="/about"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </Link>
//           <div>
//             <WishlistSidebar visitorId={visitorId} />
//           </div>
//         </div>
//       )}

//       {/* 🔹 Background Carousel */}
// <div className="absolute top-[98px] left-0 w-full h-[439px]">
//   {/* Dark Transparent Overlay */}
//   <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
// {/* Section - Mobile Responsive */}
// <section className="py-10  bg-gray-100">
//   <div className="flex flex-col items-center gap-8 px-4 max-w-md mx-auto">
//     {/* Content */}
//     <div className="flex  flex-col w-full">
//       {/* Title */}
//       <h2 className="text-xl font-extrabold text-black mb-6 leading-snug text-center">
//         Find and Book Your Perfect Workspace in{" "}
//         <span className="text-orange-500">4 Easy Steps</span> with{" "}
//         <span className="text-orange-500">FidWorx</span>
//       </h2>

//       {/* Steps */}
//       <div className="flex flex-col gap-4">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="group w-full bg-white shadow-sm rounded-lg p-3 flex items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//             onMouseEnter={() => setActiveImage(step.image)}
//           >
//             {/* Step Number */}
//             <div className="flex items-center justify-center text-sm font-bold text-white bg-orange-500 rounded-full shadow-md w-8 h-8">
//               {index + 1}
//             </div>

//             {/* Step Content */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
//                 {step.title}
//               </h3>
//               <p className="text-xs text-gray-600">{step.subtitle}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//       <div className="mt-6 text-center">
//         <button  onClick={handleGetQuoteClick} className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-lg hover:bg-orange-600">
//           Connect Us
//         </button>
//       </div>
//     </div>
//   </div>
// </section>


// {/* Why Choose FidWorx Section */}
// <div
//   className="mt-10 relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-black bg-opacity-50"></div>
// </div>
// {/* What is FidCo Section */}
// <div className="flex items-center justify-center py-12 px-4 bg-gray-50">
//   <div className="relative w-72 sm:w-80 p-6 overflow-hidden transition-all duration-500 bg-white shadow-lg cursor-pointer group rounded-2xl hover:h-56">
//     {/* Default Heading */}
//     <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 transition-opacity duration-300 group-hover:opacity-0">
//       What is FidCo?
//     </h3>

//     {/* Hover Content */}
//     <div className="absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//       <p className="text-sm text-gray-600 sm:text-base">
//         FidCo is your trusted partner for flexible workspace solutions, 
//         connecting businesses with offices, co-working, and managed spaces across India.
//       </p>
//     </div>
//   </div>
// </div>
// <section
//       className="relative h-[40vh] flex items-center justify-center bg-center bg-cover"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
//         backgroundAttachment: "scroll",
//         backgroundPositionY: `${offset}px`,
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Text content */}
//       <div className="relative z-10 px-4 text-center text-white">
//         <h2 className="text-4xl font-bold md:text-6xl">
//           Your Office Search,{" "}
//           <span className="text-orange-500">Simplified By Experts</span>
//         </h2>
//       </div>
//     </section>

// {/* About Section */}
// <section className="w-full py-16 bg-gray-100">
//   <div className="px-6 mx-auto text-center max-w-5xl">
//     {/* CTA Button */}
//     <button className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
//       Get Started
//     </button>
//   </div>
// </section>
// <Footer/>
//  <main className="px-4 py-6">
//         <h2 className="text-2xl font-semibold text-[#16607B]">About Us</h2>
//         <p className="mt-3 text-base text-gray-700">
//           Mobile-optimized layout. Replace with your mobile Figma layout (stacked sections, larger tap targets, etc.).
//         </p>
//         {/* Example bottom nav if your mobile Figma uses it */}
//         <nav className="fixed inset-x-0 bottom-0 flex items-center justify-between px-6 py-2 bg-white border-t">
//           <Link to="/" className=" text-black text-sm">Home</Link>
//           <Link to="/menu" className=" text-black *:text-sm">Explore</Link>
//           <Link to="/about" className="text-sm text-black">About</Link>
//         </nav>
//       </main>
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
//   </section>
//   );
// };

// export default Home;








//=============>> Importing the models basic below


// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate, Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import { Menu, X } from "lucide-react";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Footer from './Footer';

// const Home = () => {
//   const navigate = useNavigate();
//   const visitorId = Cookies.get("visitorId");
//  const videoRef = useRef(null);
//   // 🔹 Mobile Menu state
//   const [menuOpen, setMenuOpen] = useState(false);
//  const [text, setText] = useState("Manged office");
//   // 🔹 Carousel state
//    const images = [manged, office, coworking];  
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
// //video refs
//  const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);
// // Data from API
//     const [allData, setAllData] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);

//    const [filters, setFilters] = useState({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });

//      useEffect(() => {
//         const words = ["Manged office", "Coworking space","Office space", ];
//         let index = 0;
        
//         const interval = setInterval(() => {
//           index = (index + 1) % words.length;
//           setText(words[index]);
//         }, 4000); // Change text every 3 seconds
    
//         return () => clearInterval(interval); // Cleanup on unmount
//       }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFadeIn(false); // start fade out
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
//         setFadeIn(true); // fade in new image
//       }, 500); // match fade-out timing
//     }, 4000); // ⏰ change every 4s

//     return () => clearInterval(interval);
//   }, [images.length]);

//    // Handle filter changes
//     const workspaceOptions = [
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ];
  
//     // 🔥 Utility to get API function based on category
//     const getApiByCategory = (category) => {
//       if (category === "managed") return searchManagedOffices;
//       if (category === "office") return searchOfficeSpaces;
//       if (category === "co-working") return searchCoWorkingSpaceData;
//       return searchManagedOffices; // default
//     };
  
  
    
//    // Fetch data whenever category changes
//     useEffect(() => {
//       if (!filters.category) return;
  
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
  
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
  
//       fetchData();
//     }, [filters.category]);
  
  
//    const handleSelectCategory = (value) => {
//     setFilters((prev) => ({
//       ...prev,
//       category: value,
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//     }));
//     setWorkspaceDropdownOpen(false);
//   };
  
  
//   const handleSelectCity = (city) => {
//     setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//     setCityDropdownOpen(false);
  
//     const cityZones = [
//       ...new Set(
//         allData
//           .filter((item) => item.location?.city === city)
//           .map((item) => item.location?.zone)
//           .filter(Boolean)
//       ),
//     ];
//     setZones(cityZones);
//     setLocations([]);
//   };
  
  
//   const handleSelectZone = (zone) => {
//     setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//     setZoneDropdownOpen(false);
  
//     const zoneLocations = [
//       ...new Set(
//         allData
//           .filter(
//             (item) =>
//               item.location?.city === filters.city &&
//               item.location?.zone === zone
//           )
//           .map((item) => item.location?.locationOfProperty)
//           .filter(Boolean)
//       ),
//     ];
//     setLocations(zoneLocations);
//   };
  
//   const handleSelectLocation = (loc) => {
//     setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     setLocationDropdownOpen(false);
//   };
//    // Search action
//    const handleSearch = () => {
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
//   const handleExplore = () => {
//     navigate("/menu");
//   };

//    // Reset filters
//    const clearAll = () => {
//     setFilters({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });
//     setCities([]);
//     setZones([]);
//     setLocations([]);
//     setAllData([]);
//   };

//   const logos = [
//   "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//   "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//   "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//    "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//     "https://www.maestro.com/assets/images/maestrologo.png",
//     "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//   ];

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

//    const steps = [
//         {
//           title: "Share Your Requirements",
//           subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
//           image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Get Customized Options",
//           subtitle: "We’ll provide tailored workspace suggestions for you",
//           image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Visit & Finalize",
//           subtitle: "Tour shortlisted spaces and choose the best fit",
//           image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
//         },
//         {
//           title: "Move In Smoothly",
//           subtitle: "We’ll assist with agreements and a hassle-free setup",
//           image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
//         },
//       ];
      
//       const [activeImage, setActiveImage] = useState(steps[0].image);


// //3d image 
//       const [offset, setOffset] = useState(0);
      
//       useEffect(() => {
//         const handleScroll = () => {
//           setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
//         };
      
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//       }, []);
//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">

//       {/* 🔹 Header Bar */}
//       <div className="w-full h-[98px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
//           FidWorx
//         </h1>

//         {/* Burger Icon */}
//         <button
//           className="text-white z-50"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* 🔹 Slide-in Mobile Menu */}
//       {menuOpen && (
//         <div className="fixed top-[98px] right-0 w-3/4 h-screen bg-blue-700 text-white shadow-lg z-40 p-6 space-y-6 animate-slide-in">
//           <Link
//             to="/"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             to="/menu"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Explore Spaces
//           </Link>
//           <Link
//             to="/about"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </Link>
//           <div>
//             <WishlistSidebar visitorId={visitorId} />
//           </div>
//         </div>
//       )}

//       {/* 🔹 Background Carousel */}
// <div className="absolute top-[98px] left-0 w-full h-[439px]">
//   {/* Dark Transparent Overlay */}
//   <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
// {/* Section - Mobile Responsive */}
// <section className="py-10  bg-gray-100">
//   <div className="flex flex-col items-center gap-8 px-4 max-w-md mx-auto">
//     {/* Content */}
//     <div className="flex  flex-col w-full">
//       {/* Title */}
//       <h2 className="text-xl font-extrabold text-black mb-6 leading-snug text-center">
//         Find and Book Your Perfect Workspace in{" "}
//         <span className="text-orange-500">4 Easy Steps</span> with{" "}
//         <span className="text-orange-500">FidWorx</span>
//       </h2>

//       {/* Steps */}
//       <div className="flex flex-col gap-4">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="group w-full bg-white shadow-sm rounded-lg p-3 flex items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//             onMouseEnter={() => setActiveImage(step.image)}
//           >
//             {/* Step Number */}
//             <div className="flex items-center justify-center text-sm font-bold text-white bg-orange-500 rounded-full shadow-md w-8 h-8">
//               {index + 1}
//             </div>

//             {/* Step Content */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
//                 {step.title}
//               </h3>
//               <p className="text-xs text-gray-600">{step.subtitle}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//       <div className="mt-6 text-center">
//         <button className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-lg hover:bg-orange-600">
//           Connect Us
//         </button>
//       </div>
//     </div>
//   </div>
// </section>


// {/* Why Choose FidWorx Section */}
// <div
//   className="mt-10 relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-black bg-opacity-50"></div>
// </div>
// {/* What is FidCo Section */}
// <div className="flex items-center justify-center py-12 px-4 bg-gray-50">
//   <div className="relative w-72 sm:w-80 p-6 overflow-hidden transition-all duration-500 bg-white shadow-lg cursor-pointer group rounded-2xl hover:h-56">
//     {/* Default Heading */}
//     <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 transition-opacity duration-300 group-hover:opacity-0">
//       What is FidCo?
//     </h3>

//     {/* Hover Content */}
//     <div className="absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//       <p className="text-sm text-gray-600 sm:text-base">
//         FidCo is your trusted partner for flexible workspace solutions, 
//         connecting businesses with offices, co-working, and managed spaces across India.
//       </p>
//     </div>
//   </div>
// </div>
// <section
//       className="relative h-[40vh] flex items-center justify-center bg-center bg-cover"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
//         backgroundAttachment: "scroll",
//         backgroundPositionY: `${offset}px`,
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Text content */}
//       <div className="relative z-10 px-4 text-center text-white">
//         <h2 className="text-4xl font-bold md:text-6xl">
//           Your Office Search,{" "}
//           <span className="text-orange-500">Simplified By Experts</span>
//         </h2>
//       </div>
//     </section>

// {/* About Section */}
// <section className="w-full py-16 bg-gray-100">
//   <div className="px-6 mx-auto text-center max-w-5xl">
//     {/* CTA Button */}
//     <button className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
//       Get Started
//     </button>
//   </div>
// </section>
// <Footer/>
//  <main className="px-4 py-6">
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
// </div>
//   </section>
//   );
// };

// export default Home;








//=============>>> Implimenting the login flow






// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate, Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import { Menu, X } from "lucide-react";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Footer from './Footer';

// const Home = () => {
//   const navigate = useNavigate();
//   const visitorId = Cookies.get("visitorId");
//  const videoRef = useRef(null);
//   // 🔹 Mobile Menu state
//   const [menuOpen, setMenuOpen] = useState(false);
//  const [text, setText] = useState("Manged office");
//   // 🔹 Carousel state
//    const images = [manged, office, coworking];  
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
// //video refs
//  const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);
// // Data from API
//     const [allData, setAllData] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);

//    const [filters, setFilters] = useState({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });

//      useEffect(() => {
//         const words = ["Manged office", "Coworking space","Office space", ];
//         let index = 0;
        
//         const interval = setInterval(() => {
//           index = (index + 1) % words.length;
//           setText(words[index]);
//         }, 4000); // Change text every 3 seconds
    
//         return () => clearInterval(interval); // Cleanup on unmount
//       }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFadeIn(false); // start fade out
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
//         setFadeIn(true); // fade in new image
//       }, 500); // match fade-out timing
//     }, 4000); // ⏰ change every 4s

//     return () => clearInterval(interval);
//   }, [images.length]);

//    // Handle filter changes
//     const workspaceOptions = [
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ];
  
//     // 🔥 Utility to get API function based on category
//     const getApiByCategory = (category) => {
//       if (category === "managed") return searchManagedOffices;
//       if (category === "office") return searchOfficeSpaces;
//       if (category === "co-working") return searchCoWorkingSpaceData;
//       return searchManagedOffices; // default
//     };
  
  
    
//    // Fetch data whenever category changes
//     useEffect(() => {
//       if (!filters.category) return;
  
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
  
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
  
//       fetchData();
//     }, [filters.category]);
  
  
//    const handleSelectCategory = (value) => {
//     setFilters((prev) => ({
//       ...prev,
//       category: value,
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//     }));
//     setWorkspaceDropdownOpen(false);
//   };
  
  
//   const handleSelectCity = (city) => {
//     setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//     setCityDropdownOpen(false);
  
//     const cityZones = [
//       ...new Set(
//         allData
//           .filter((item) => item.location?.city === city)
//           .map((item) => item.location?.zone)
//           .filter(Boolean)
//       ),
//     ];
//     setZones(cityZones);
//     setLocations([]);
//   };
  
  
//   const handleSelectZone = (zone) => {
//     setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//     setZoneDropdownOpen(false);
  
//     const zoneLocations = [
//       ...new Set(
//         allData
//           .filter(
//             (item) =>
//               item.location?.city === filters.city &&
//               item.location?.zone === zone
//           )
//           .map((item) => item.location?.locationOfProperty)
//           .filter(Boolean)
//       ),
//     ];
//     setLocations(zoneLocations);
//   };
  
//   const handleSelectLocation = (loc) => {
//     setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     setLocationDropdownOpen(false);
//   };
//    // Search action
//    const handleSearch = () => {
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
//   const handleExplore = () => {
//     navigate("/menu");
//   };

//    // Reset filters
//    const clearAll = () => {
//     setFilters({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });
//     setCities([]);
//     setZones([]);
//     setLocations([]);
//     setAllData([]);
//   };

//   const logos = [
//   "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//   "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//   "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//    "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//     "https://www.maestro.com/assets/images/maestrologo.png",
//     "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//   ];

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

//    const steps = [
//         {
//           title: "Share Your Requirements",
//           subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
//           image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Get Customized Options",
//           subtitle: "We’ll provide tailored workspace suggestions for you",
//           image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Visit & Finalize",
//           subtitle: "Tour shortlisted spaces and choose the best fit",
//           image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
//         },
//         {
//           title: "Move In Smoothly",
//           subtitle: "We’ll assist with agreements and a hassle-free setup",
//           image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
//         },
//       ];
      
//       const [activeImage, setActiveImage] = useState(steps[0].image);


// //3d image 
//       const [offset, setOffset] = useState(0);
      
//       useEffect(() => {
//         const handleScroll = () => {
//           setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
//         };
      
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//       }, []);
//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">

//       {/* 🔹 Header Bar */}
//       <div className="w-full h-[98px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
//           FidWorx
//         </h1>

//         {/* Burger Icon */}
//         <button
//           className="text-white z-50"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* 🔹 Slide-in Mobile Menu */}
//       {menuOpen && (
//         <div className="fixed top-[98px] right-0 w-3/4 h-screen bg-blue-700 text-white shadow-lg z-40 p-6 space-y-6 animate-slide-in">
//           <Link
//             to="/"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             to="/menu"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Explore Spaces
//           </Link>
//           <Link
//             to="/about"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </Link>
//           <div>
//             <WishlistSidebar visitorId={visitorId} />
//           </div>
//         </div>
//       )}

//       {/* 🔹 Background Carousel */}
// <div className="absolute top-[98px] left-0 w-full h-[439px]">
//   {/* Carousel Image */}
//   <div
//     className={`absolute top-0 left-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
//       fadeIn ? "opacity-100" : "opacity-0"
//     }`}
//     style={{ backgroundImage: `url(${images[currentIndex]})` }}
//   ></div>

//   {/* Dark Transparent Overlay */}
//   <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

//   {/* Heading Text */}
// <div className="relative z-10 flex flex-col items-center justify-start h-full text-white pt-5">
//   <h1 className="text-[25px] sm:text-4xl md:text-5xl font-bold leading-tight mb-[3px]">
//     Find your perfect
//   </h1>
//   {/* Horizontal Scrolling Text */}
//   <div className="overflow-hidden w-[300px]">
//     <div
//       className="whitespace-nowrap animate-scroll-horizontal text-yellow-400 font-bold"
//       style={{ fontSize: "26px" }}
//     >
//       {text}
//     </div>
//   </div>
//   {/* 🔥 Mobile Search Box */}
// <div className="flex flex-col w-full max-w-sm mx-auto gap-4 p-4 mt-6 border shadow-lg bg-white/10 backdrop-blur-md border-white/30 rounded-2xl">
//   {/* Category Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.category
//         ? workspaceOptions.find((w) => w.value === filters.category)?.label
//         : "Select Category"}
//     </div>
//     {workspaceDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {workspaceOptions.map((opt) => (
//           <div
//             key={opt.value}
//             onClick={() => handleSelectCategory(opt.value)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {opt.label}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* City Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.city || "Select City"}
//     </div>
//     {cityDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {cities.map((city, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectCity(city)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {city}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Zone Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.zone || "Select Zone"}
//     </div>
//     {zoneDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {zones.map((zone, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectZone(zone)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {zone}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Location Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.locationOfProperty || "Select Location"}
//     </div>
//     {locationDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {locations.map((loc, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectLocation(loc)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {loc}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Buttons */}
//   <div className="flex items-center justify-between gap-4">
//     <button
//       onClick={handleSearch}
//       className="flex-1 px-6 py-2 font-semibold text-white transition bg-orange-500 shadow-md rounded-xl hover:bg-orange-600"
//     >
//       Search
//     </button>
//     <button
//       onClick={clearAll}
//       className="flex items-center justify-center w-10 h-10 text-white transition bg-red-500 rounded-full shadow-md hover:bg-red-600"
//       title="Clear All"
//     >
//       <X size={18} />
//     </button>
//   </div>
// </div>

// </div>
// <section className="py-8 bg-gray-100 overflow-hidden w-full">
//   {/* Heading */}
//   <h2 className="text-[24px] font-bold text-center text-gray-800 mb-6 px-4">
//     Trusted By <span className="text-orange-500">Leading Companies</span>
//   </h2>

//   {/* Scrolling logos */}
//   <div className="relative w-full overflow-hidden">
//     <div className="flex logo-slider">
//       {[...logos, ...logos].map((logo, idx) => (
//         <div
//           key={idx}
//           className="flex items-center justify-center min-w-[100px] sm:min-w-[140px] mx-4"
//         >
//           <img
//             src={logo}
//             alt="company logo"
//             className="h-10 sm:h-12 md:h-16 object-contain opacity-80 hover:opacity-100 transition"
//           />
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Inline CSS for smooth scroll */}
//   <style>{`
//     .logo-slider {
//       animation: scrollLeft 25s linear infinite;
//     }
//     @keyframes scrollLeft {
//       0% { transform: translateX(0); }
//       100% { transform: translateX(-50%); }
//     }
//   `}</style>
// </section>

// {/* 📍 City Cards Section */}
// <section className="w-full py-8 bg-black">
//   <div className="max-w-[95%] mx-auto flex flex-col gap-6">
//     {/* ✅ Bangalore (Large) */}
//     <div
//       className="w-full h-[220px] sm:h-[280px] md:h-[340px] relative rounded-xl overflow-hidden"
//       onMouseEnter={() => handleMouseEnter(videoRef)}
//       onMouseLeave={() => handleMouseLeave(videoRef)}
//     >
//       <video
//         ref={videoRef}
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         muted
//         playsInline
//       >
//         <source src={bglrvideo} type="video/mp4" />
//       </video>
//       <div className="absolute bottom-3 left-3 text-lg sm:text-xl font-bold text-white">
//         Bangalore
//       </div>
//     </div>

//     {/* ✅ Other Cities - Horizontal Slider */}
//     <div className="relative">
//       {/* Left Button */}
//       <button
//         className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
//         onClick={() => {
//           document.getElementById("cityScroll").scrollBy({ left: -200, behavior: "smooth" });
//         }}
//       >
//         <ChevronLeft size={20} />
//       </button>

//       {/* Scrollable Cities */}
//       <div
//         id="cityScroll"
//         className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
//       >
//         {/* Mumbai */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${mumbai})` }}
//           onMouseEnter={() => handleMouseEnter(mumbaiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(mumbaiVideoRef)}
//         >
//           <video
//             ref={mumbaiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={mubaivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Mumbai
//           </div>
//         </div>

//         {/* Kochi */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${kochi})` }}
//           onMouseEnter={() => handleMouseEnter(kochiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(kochiVideoRef)}
//         >
//           <video
//             ref={kochiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={kochivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Kochi
//           </div>
//         </div>

//         {/* Noida */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${noida})` }}
//           onMouseEnter={() => handleMouseEnter(noidaVideoRef)}
//           onMouseLeave={() => handleMouseLeave(noidaVideoRef)}
//         >
//           <video
//             ref={noidaVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={noidavideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Noida
//           </div>
//         </div>

//         {/* Hyderabad */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${hydarabad})` }}
//           onMouseEnter={() => handleMouseEnter(hydarabadVideoRef)}
//           onMouseLeave={() => handleMouseLeave(hydarabadVideoRef)}
//         >
//           <video
//             ref={hydarabadVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={hdbdvideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Hyderabad
//           </div>
//         </div>

//         {/* Delhi */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${dehli})` }}
//           onMouseEnter={() => handleMouseEnter(dehliVideoRef)}
//           onMouseLeave={() => handleMouseLeave(dehliVideoRef)}
//         >
//           <video
//             ref={dehliVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={dehlivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Delhi
//           </div>
//         </div>

//         {/* Chennai */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${chennai})` }}
//           onMouseEnter={() => handleMouseEnter(chennaiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(chennaiVideoRef)}
//         >
//           <video
//             ref={chennaiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={chennaivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Chennai
//           </div>
//         </div>
//       </div>

//       {/* Right Button */}
//       <button
//         className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
//         onClick={() => {
//           document.getElementById("cityScroll").scrollBy({ left: 200, behavior: "smooth" });
//         }}
//       >
//         <ChevronRight size={20} />
//       </button>
//     </div>
//   </div>
// </section>
// <section className="w-full py-10 bg-gray-50">
//   <div className="grid grid-cols-1 gap-6 px-4 max-w-md mx-auto">
//     {/* Card 1 - Managed Office */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       {/* Image */}
//       <img
//         src="https://e0.pxfuel.com/wallpapers/393/28/desktop-wallpaper-business-meetings-room.jpg"
//         alt="Managed Office"
//         className="w-full h-[300px] object-cover"
//       />

//       {/* Default Header */}
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Managed Office</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Managed Office</h3>
//           <p className="text-sm">
//             Fully serviced offices with modern amenities and flexible terms.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>We handle interiors, maintenance, and utilities</li>
//             <li>Ready-to-use with all facilities included</li>
//             <li>Perfect for businesses wanting zero setup hassle</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>

//     {/* Card 2 - Office Space */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       <img
//         src="https://wallpapers.com/images/hd/hd-office-background-1920-x-1080-bcynny890vbtg364.jpg"
//         alt="Office Space"
//         className="w-full h-[300px] object-cover"
//       />
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Office Space</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Office Space</h3>
//           <p className="text-sm">
//             Dedicated office spaces designed for productivity and comfort.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>Entire space exclusively for your company</li>
//             <li>You manage interiors, branding, and operations</li>
//             <li>Best for companies wanting full ownership</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>

//     {/* Card 3 - Co-working Space */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       <img
//         src="https://media.istockphoto.com/id/1365567295/photo/business-colleagues-having-a-meeting-in-a-boardroom.jpg?s=612x612&w=0&k=20&c=R7dhmDVXrXl0A8ZLI0LOeVXf--jktfkCXGpM1xbuj2A="
//         alt="Co-working Space"
//         className="w-full h-[300px] object-cover"
//       />
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Co-working Space</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Co-working Space</h3>
//           <p className="text-sm">
//             Collaborative workspaces for freelancers, startups, and teams.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>Dedicated seats & private cabins</li>
//             <li>All facilities included — just bring your laptop</li>
//             <li>Great for individuals and small teams</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>
//   </div>
// </section>

// {/* Section - Mobile Responsive */}
// <section className="py-10  bg-gray-100">
//   <div className="flex flex-col items-center gap-8 px-4 max-w-md mx-auto">
//     {/* Top Image */}
//     <div className="w-full">
//       <img
//         src={activeImage}
//         alt="Workspace"
//         className="w-full h-[220px] object-cover rounded-xl shadow-md transition-opacity duration-500 ease-in-out hover:opacity-90"
//       />
//     </div>

//     {/* Content */}
//     <div className="flex  flex-col w-full">
//       {/* Title */}
//       <h2 className="text-xl font-extrabold text-black mb-6 leading-snug text-center">
//         Find and Book Your Perfect Workspace in{" "}
//         <span className="text-orange-500">4 Easy Steps</span> with{" "}
//         <span className="text-orange-500">FidWorx</span>
//       </h2>

//       {/* Steps */}
//       <div className="flex flex-col gap-4">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="group w-full bg-white shadow-sm rounded-lg p-3 flex items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//             onMouseEnter={() => setActiveImage(step.image)}
//           >
//             {/* Step Number */}
//             <div className="flex items-center justify-center text-sm font-bold text-white bg-orange-500 rounded-full shadow-md w-8 h-8">
//               {index + 1}
//             </div>

//             {/* Step Content */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
//                 {step.title}
//               </h3>
//               <p className="text-xs text-gray-600">{step.subtitle}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//       <div className="mt-6 text-center">
//         <button className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-lg hover:bg-orange-600">
//           Connect with Our Team Expert Today
//         </button>
//       </div>
//     </div>
//   </div>
// </section>

// {/* Number Section - Mobile Optimized */}
// <section className="mt-[-5px] py-10 text-center bg-white">
//   {/* Tagline */}
//   <h2 className="mb-10 text-2xl text-gray-900 font-bold leading-snug sm:text-3xl md:text-4xl">
//     India’s Premier Marketplace for{" "}
//     <span className="text-orange-500">Flexible Workspaces</span>
//   </h2>

//   {/* Stats Grid */}
//   <div className="grid max-w-5xl grid-cols-2 gap-8 mx-auto sm:grid-cols-2 md:grid-cols-4">
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         1800+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">Partner Spaces</p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         1000+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">Clients Served</p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         30+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">
//         Cities Across India
//       </p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         25M+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">
//         Sqft of Office Space Options
//       </p>
//     </div>
//   </div>
// </section>

// {/* Why Choose FidWorx Section */}
// <div
//   className="mt-10 relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//   {/* Content Wrapper */}
//   <div className="relative z-10 grid w-full grid-cols-1 gap-10 px-6 py-12 max-w-7xl md:grid-cols-2">
//     {/* Left Side - Glass Feature Boxes */}
//     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//       {[
//         {
//           title: "Wide Network",
//           desc: "Access 1000+ office spaces across prime locations.",
//           logo: "https://cdn-icons-png.flaticon.com/512/883/883407.png",
//         },
//         {
//           title: "Expert Guidance",
//           desc: "Our consultants provide end-to-end assistance.",
//           logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//         },
//         {
//           title: "Zero Brokerage",
//           desc: "Save money with no hidden fees or extra charges.",
//           logo: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
//         },
//         {
//           title: "Tailored Solutions",
//           desc: "Get workspace solutions customized for your needs.",
//           logo: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
//         },
//       ].map((item, i) => (
//         <div
//           key={i}
//           className="flex flex-col items-center p-6 text-center text-white transition-transform transform border shadow-lg backdrop-blur-md bg-white/10 border-white/30 rounded-2xl hover:-translate-y-2"
//         >
//           <img src={item.logo} alt={item.title} className="w-10 h-10 mb-3 sm:w-12 sm:h-12" />
//           <h3 className="text-base font-semibold sm:text-lg">{item.title}</h3>
//           <p className="mt-2 text-xs opacity-80 sm:text-sm">{item.desc}</p>
//         </div>
//       ))}
//     </div>

//     {/* Right Side - Heading & Content */}
//     <div className="flex flex-col justify-center space-y-6 text-white">
//       <h2 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl">
//         Why choose <span className="text-orange-500">FidWorx?</span>
//       </h2>
//       <p className="text-sm leading-relaxed opacity-90 sm:text-base md:text-lg">
//         We make your office-search a hassle-free experience. With in-depth knowledge, 
//         let our workspace solution experts find what you're looking for.
//       </p>
//       <button className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition bg-orange-500 shadow-lg hover:bg-orange-600 rounded-xl sm:px-6 sm:py-4 sm:text-lg">
//         Claim Your Free Consultation with Zero Brokerage Offer Now! →
//       </button>
//     </div>
//   </div>
// </div>
// {/* What is FidCo Section */}
// <div className="flex items-center justify-center py-12 px-4 bg-gray-50">
//   <div className="relative w-72 sm:w-80 p-6 overflow-hidden transition-all duration-500 bg-white shadow-lg cursor-pointer group rounded-2xl hover:h-56">
//     {/* Default Heading */}
//     <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 transition-opacity duration-300 group-hover:opacity-0">
//       What is FidCo?
//     </h3>

//     {/* Hover Content */}
//     <div className="absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//       <p className="text-sm text-gray-600 sm:text-base">
//         FidCo is your trusted partner for flexible workspace solutions, 
//         connecting businesses with offices, co-working, and managed spaces across India.
//       </p>
//     </div>
//   </div>
// </div>
// <section
//       className="relative h-[40vh] flex items-center justify-center bg-center bg-cover"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
//         backgroundAttachment: "scroll",
//         backgroundPositionY: `${offset}px`,
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Text content */}
//       <div className="relative z-10 px-4 text-center text-white">
//         <h2 className="text-4xl font-bold md:text-6xl">
//           Your Office Search,{" "}
//           <span className="text-orange-500">Simplified By Experts</span>
//         </h2>
//       </div>
//     </section>

// {/* About Section */}
// <section className="w-full py-16 bg-gray-100">
//   <div className="px-6 mx-auto text-center max-w-5xl">
//     {/* Heading */}
//     <h2 className="mb-6 text-4xl font-bold text-gray-900">
//       About <span className="text-orange-500">Us</span>
//     </h2>

//     {/* Description */}
//     <p className="mb-10 text-lg leading-relaxed text-gray-700">
//       We are a passionate team dedicated to solving complex problems with{" "}
//       <span className="font-semibold text-gray-900">innovative solutions</span>.  
//       With a strong focus on customer success, we help businesses transform 
//       their operations, enhance efficiency, and achieve sustainable growth.
//     </p>

//     {/* CTA Button */}
//     <button className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
//       Get Started
//     </button>
//   </div>
// </section>
// <Footer/>
//  <main className="px-4 py-6">
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
// </div>
//   </section>
//   );
// };

// export default Home;








//below is old one but not used last time below one more code is there use it 







// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate, Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import { Menu, X } from "lucide-react";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";

// const Home = () => {
//   const navigate = useNavigate();
//   const visitorId = Cookies.get("visitorId");
//  const videoRef = useRef(null);
//   // 🔹 Mobile Menu state
//   const [menuOpen, setMenuOpen] = useState(false);
//  const [text, setText] = useState("Manged office");
//   // 🔹 Carousel state
//    const images = [manged, office, coworking];  
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
// //video refs
//  const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);
// // Data from API
//     const [allData, setAllData] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);

//    const [filters, setFilters] = useState({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });

//      useEffect(() => {
//         const words = ["Manged office", "Coworking space","Office space", ];
//         let index = 0;
        
//         const interval = setInterval(() => {
//           index = (index + 1) % words.length;
//           setText(words[index]);
//         }, 4000); // Change text every 3 seconds
    
//         return () => clearInterval(interval); // Cleanup on unmount
//       }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFadeIn(false); // start fade out
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
//         setFadeIn(true); // fade in new image
//       }, 500); // match fade-out timing
//     }, 4000); // ⏰ change every 4s

//     return () => clearInterval(interval);
//   }, [images.length]);

//    // Handle filter changes
//     const workspaceOptions = [
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ];
  
//     // 🔥 Utility to get API function based on category
//     const getApiByCategory = (category) => {
//       if (category === "managed") return searchManagedOffices;
//       if (category === "office") return searchOfficeSpaces;
//       if (category === "co-working") return searchCoWorkingSpaceData;
//       return searchManagedOffices; // default
//     };
  
  
    
//    // Fetch data whenever category changes
//     useEffect(() => {
//       if (!filters.category) return;
  
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
  
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
  
//       fetchData();
//     }, [filters.category]);
  
  
//    const handleSelectCategory = (value) => {
//     setFilters((prev) => ({
//       ...prev,
//       category: value,
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//     }));
//     setWorkspaceDropdownOpen(false);
//   };
  
  
//   const handleSelectCity = (city) => {
//     setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//     setCityDropdownOpen(false);
  
//     const cityZones = [
//       ...new Set(
//         allData
//           .filter((item) => item.location?.city === city)
//           .map((item) => item.location?.zone)
//           .filter(Boolean)
//       ),
//     ];
//     setZones(cityZones);
//     setLocations([]);
//   };
  
  
//   const handleSelectZone = (zone) => {
//     setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//     setZoneDropdownOpen(false);
  
//     const zoneLocations = [
//       ...new Set(
//         allData
//           .filter(
//             (item) =>
//               item.location?.city === filters.city &&
//               item.location?.zone === zone
//           )
//           .map((item) => item.location?.locationOfProperty)
//           .filter(Boolean)
//       ),
//     ];
//     setLocations(zoneLocations);
//   };
  
//   const handleSelectLocation = (loc) => {
//     setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     setLocationDropdownOpen(false);
//   };
//    // Search action
//    const handleSearch = () => {
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
//   const handleExplore = () => {
//     navigate("/menu");
//   };

//    // Reset filters
//    const clearAll = () => {
//     setFilters({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });
//     setCities([]);
//     setZones([]);
//     setLocations([]);
//     setAllData([]);
//   };

//   const logos = [
//     "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//     "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//   "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//    "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//     "https://www.maestro.com/assets/images/maestrologo.png",
//     "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//   ];

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

//   return (

//     <div className="relative w-full min-h-screen bg-black text-white">
//     {/* 🔹 Header (Sticky) */}
//     <div className="w-full h-[98px] bg-blue-600/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
//           FidWorx
//         </h1>

//         {/* Burger Icon */}
//         <button
//           className="text-white z-50"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* 🔹 Slide-in Mobile Menu */}
//       {menuOpen && (
//         <div className="fixed top-[98px] right-0 w-3/4 h-screen bg-blue-700 text-white shadow-lg z-40 p-6 space-y-6 animate-slide-in">
//           <Link
//             to="/"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             to="/menu"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Explore Spaces
//           </Link>
//           <Link
//             to="/about"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </Link>
//           <div>
//             <WishlistSidebar visitorId={visitorId} />
//           </div>
//         </div>
//       )}

//     {/* 🔹 Page Scrollable Content */}
//     <div className="pt-[98px]">
//       {/* Background Carousel + Search */}
//       <div className="relative w-full h-[439px]">
//         <div
//           className={`absolute top-0 left-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
//             fadeIn ? "opacity-100" : "opacity-0"
//           }`}
//           style={{ backgroundImage: `url(${images[currentIndex]})` }}
//         ></div>
//         <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
        
//         {/* Heading + Search */}
//         {/* 🔥 Mobile Search Box */}
// <div className="flex flex-col w-full max-w-sm mx-auto gap-4 p-4 mt-6 border shadow-lg bg-white/10 backdrop-blur-md border-white/30 rounded-2xl">
//   {/* Category Dropdown */}
  
//   <div className="relative w-full">
//     <div
//       onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.category
//         ? workspaceOptions.find((w) => w.value === filters.category)?.label
//         : "Select Category"}
//     </div>
//     {workspaceDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {workspaceOptions.map((opt) => (
//           <div
//             key={opt.value}
//             onClick={() => handleSelectCategory(opt.value)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {opt.label}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* City Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.city || "Select City"}
//     </div>
//     {cityDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {cities.map((city, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectCity(city)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {city}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Zone Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.zone || "Select Zone"}
//     </div>
//     {zoneDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {zones.map((zone, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectZone(zone)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {zone}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Location Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.locationOfProperty || "Select Location"}
//     </div>
//     {locationDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {locations.map((loc, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectLocation(loc)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {loc}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Buttons */}
//   <div className="flex items-center justify-between gap-4">
//     <button
//       onClick={handleSearch}
//       className="flex-1 px-6 py-2 font-semibold text-white transition bg-orange-500 shadow-md rounded-xl hover:bg-orange-600"
//     >
//       Search
//     </button>
//     <button
//       onClick={clearAll}
//       className="flex items-center justify-center w-10 h-10 text-white transition bg-red-500 rounded-full shadow-md hover:bg-red-600"
//       title="Clear All"
//     >
//       <X size={18} />
//     </button>
//   </div>
// </div>
//       </div>

//       {/* Trusted Companies */}
//       <section className="py-8 bg-gray-100 overflow-hidden w-full">
//   {/* Heading */}
//   <h2 className="text-[24px] font-bold text-center text-gray-800 mb-6 px-4">
//     Trusted By <span className="text-orange-500">Leading Companies</span>
//   </h2>

//   {/* Scrolling logos */}
//   <div className="relative w-full overflow-hidden">
//     <div className="flex logo-slider">
//       {[...logos, ...logos].map((logo, idx) => (
//         <div
//           key={idx}
//           className="flex items-center justify-center min-w-[100px] sm:min-w-[140px] mx-4"
//         >
//           <img
//             src={logo}
//             alt="company logo"
//             className="h-10 sm:h-12 md:h-16 object-contain opacity-80 hover:opacity-100 transition"
//           />
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Inline CSS for smooth scroll */}
//   <style>{`
//     .logo-slider {
//       animation: scrollLeft 25s linear infinite;
//     }
//     @keyframes scrollLeft {
//       0% { transform: translateX(0); }
//       100% { transform: translateX(-50%); }
//     }
//   `}</style>
// </section>

// <section className="w-full py-8 bg-black">
//   <div className="max-w-[95%] mx-auto flex flex-col gap-6">
//     {/* ✅ Bangalore (Large) */}
//     <div
//       className="w-full h-[220px] sm:h-[280px] md:h-[340px] relative rounded-xl overflow-hidden"
//       onMouseEnter={() => handleMouseEnter(videoRef)}
//       onMouseLeave={() => handleMouseLeave(videoRef)}
//     >
//       <video
//         ref={videoRef}
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         muted
//         playsInline
//       >
//         <source src={bglrvideo} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <div className="absolute bottom-3 left-3 text-lg sm:text-xl font-bold text-white">
//         Bangalore
//       </div>
//     </div>

//     {/* ✅ Other Cities Grid (stacked on mobile) */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       {/* Mumbai */}
//       <div
//         className="w-full h-[180px] sm:h-[200px] relative rounded-xl overflow-hidden"
//         style={{ backgroundImage: `url(${mumbai})` }}
//         onMouseEnter={() => handleMouseEnter(mumbaiVideoRef)}
//         onMouseLeave={() => handleMouseLeave(mumbaiVideoRef)}
//       >
//         <video
//           ref={mumbaiVideoRef}
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           muted
//           playsInline
//         >
//           <source src={mubaivideo} type="video/mp4" />
//         </video>
//         <div className="absolute bottom-3 left-3 text-lg font-bold text-white">
//           Mumbai
//         </div>
//       </div>

//       {/* Kochi */}
//       <div
//         className="w-full h-[180px] sm:h-[200px] relative rounded-xl overflow-hidden"
//         style={{ backgroundImage: `url(${kochi})` }}
//         onMouseEnter={() => handleMouseEnter(kochiVideoRef)}
//         onMouseLeave={() => handleMouseLeave(kochiVideoRef)}
//       >
//         <video
//           ref={kochiVideoRef}
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           muted
//           playsInline
//         >
//           <source src={kochivideo} type="video/mp4" />
//         </video>
//         <div className="absolute bottom-3 left-3 text-lg font-bold text-white">
//           Kochi
//         </div>
//       </div>

//       {/* Noida */}
//       <div
//         className="w-full h-[180px] sm:h-[200px] relative rounded-xl overflow-hidden"
//         style={{ backgroundImage: `url(${noida})` }}
//         onMouseEnter={() => handleMouseEnter(noidaVideoRef)}
//         onMouseLeave={() => handleMouseLeave(noidaVideoRef)}
//       >
//         <video
//           ref={noidaVideoRef}
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           muted
//           playsInline
//         >
//           <source src={noidavideo} type="video/mp4" />
//         </video>
//         <div className="absolute bottom-3 left-3 text-lg font-bold text-white">
//           Noida
//         </div>
//       </div>

//       {/* Hyderabad */}
//       <div
//         className="w-full h-[180px] sm:h-[200px] relative rounded-xl overflow-hidden"
//         style={{ backgroundImage: `url(${hydarabad})` }}
//         onMouseEnter={() => handleMouseEnter(hydarabadVideoRef)}
//         onMouseLeave={() => handleMouseLeave(hydarabadVideoRef)}
//       >
//         <video
//           ref={hydarabadVideoRef}
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           muted
//           playsInline
//         >
//           <source src={hdbdvideo} type="video/mp4" />
//         </video>
//         <div className="absolute bottom-3 left-3 text-lg font-bold text-white">
//           Hyderabad
//         </div>
//       </div>

//       {/* Delhi */}
//       <div
//         className="w-full h-[180px] sm:h-[200px] relative rounded-xl overflow-hidden"
//         style={{ backgroundImage: `url(${dehli})` }}
//         onMouseEnter={() => handleMouseEnter(dehliVideoRef)}
//         onMouseLeave={() => handleMouseLeave(dehliVideoRef)}
//       >
//         <video
//           ref={dehliVideoRef}
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           muted
//           playsInline
//         >
//           <source src={dehlivideo} type="video/mp4" />
//         </video>
//         <div className="absolute bottom-3 left-3 text-lg font-bold text-white">
//           Delhi
//         </div>
//       </div>

//       {/* Chennai */}
//       <div
//         className="w-full h-[180px] sm:h-[200px] relative rounded-xl overflow-hidden"
//         style={{ backgroundImage: `url(${chennai})` }}
//         onMouseEnter={() => handleMouseEnter(chennaiVideoRef)}
//         onMouseLeave={() => handleMouseLeave(chennaiVideoRef)}
//       >
//         <video
//           ref={chennaiVideoRef}
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           muted
//           playsInline
//         >
//           <source src={chennaivideo} type="video/mp4" />
//         </video>
//         <div className="absolute bottom-3 left-3 text-lg font-bold text-white">
//           Chennai
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
//     </div>
//   </div>
// );
// }



// export default Home;








//=====================>>>> Old 1 mobile
//below one is used last time 

// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate, Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import { Menu, X } from "lucide-react";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Footer from './Footer';

// const Home = () => {
//   const navigate = useNavigate();
//   const visitorId = Cookies.get("visitorId");
//  const videoRef = useRef(null);
//   // 🔹 Mobile Menu state
//   const [menuOpen, setMenuOpen] = useState(false);
//  const [text, setText] = useState("Manged office");
//   // 🔹 Carousel state
//    const images = [manged, office, coworking];  
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
// //video refs
//  const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);
// // Data from API
//     const [allData, setAllData] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [zones, setZones] = useState([]);
//     const [locations, setLocations] = useState([]);

//    const [filters, setFilters] = useState({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });

//      useEffect(() => {
//         const words = ["Manged office", "Coworking space","Office space", ];
//         let index = 0;
        
//         const interval = setInterval(() => {
//           index = (index + 1) % words.length;
//           setText(words[index]);
//         }, 4000); // Change text every 3 seconds
    
//         return () => clearInterval(interval); // Cleanup on unmount
//       }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFadeIn(false); // start fade out
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length); // switch image
//         setFadeIn(true); // fade in new image
//       }, 500); // match fade-out timing
//     }, 4000); // ⏰ change every 4s

//     return () => clearInterval(interval);
//   }, [images.length]);

//    // Handle filter changes
//     const workspaceOptions = [
//       { label: "Managed Office", value: "managed" },
//       { label: "Office Space", value: "office" },
//       { label: "Co-Working Space", value: "co-working" },
//     ];
  
//     // 🔥 Utility to get API function based on category
//     const getApiByCategory = (category) => {
//       if (category === "managed") return searchManagedOffices;
//       if (category === "office") return searchOfficeSpaces;
//       if (category === "co-working") return searchCoWorkingSpaceData;
//       return searchManagedOffices; // default
//     };
  
  
    
//    // Fetch data whenever category changes
//     useEffect(() => {
//       if (!filters.category) return;
  
//       const fetchData = async () => {
//         const apiFn = getApiByCategory(filters.category);
//         const result = await apiFn(1, 100);
//         setAllData(result);
  
//         const uniqueCities = [
//           ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//         ];
//         setCities(uniqueCities);
//         setZones([]);
//         setLocations([]);
//       };
  
//       fetchData();
//     }, [filters.category]);
  
  
//    const handleSelectCategory = (value) => {
//     setFilters((prev) => ({
//       ...prev,
//       category: value,
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//     }));
//     setWorkspaceDropdownOpen(false);
//   };
  
  
//   const handleSelectCity = (city) => {
//     setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//     setCityDropdownOpen(false);
  
//     const cityZones = [
//       ...new Set(
//         allData
//           .filter((item) => item.location?.city === city)
//           .map((item) => item.location?.zone)
//           .filter(Boolean)
//       ),
//     ];
//     setZones(cityZones);
//     setLocations([]);
//   };
  
  
//   const handleSelectZone = (zone) => {
//     setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//     setZoneDropdownOpen(false);
  
//     const zoneLocations = [
//       ...new Set(
//         allData
//           .filter(
//             (item) =>
//               item.location?.city === filters.city &&
//               item.location?.zone === zone
//           )
//           .map((item) => item.location?.locationOfProperty)
//           .filter(Boolean)
//       ),
//     ];
//     setLocations(zoneLocations);
//   };
  
//   const handleSelectLocation = (loc) => {
//     setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//     setLocationDropdownOpen(false);
//   };
//    // Search action
//    const handleSearch = () => {
//     const query = new URLSearchParams(
//       Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//     ).toString();
//     navigate(query ? `/menu?${query}` : `/menu`);
//   };
  
//   const handleExplore = () => {
//     navigate("/menu");
//   };

//    // Reset filters
//    const clearAll = () => {
//     setFilters({
//       city: "",
//       zone: "",
//       locationOfProperty: "",
//       category: "",
//     });
//     setCities([]);
//     setZones([]);
//     setLocations([]);
//     setAllData([]);
//   };

//   const logos = [
//   "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//   "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//   "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//    "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//     "https://www.maestro.com/assets/images/maestrologo.png",
//     "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//   ];

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

//    const steps = [
//         {
//           title: "Share Your Requirements",
//           subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
//           image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Get Customized Options",
//           subtitle: "We’ll provide tailored workspace suggestions for you",
//           image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           title: "Visit & Finalize",
//           subtitle: "Tour shortlisted spaces and choose the best fit",
//           image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
//         },
//         {
//           title: "Move In Smoothly",
//           subtitle: "We’ll assist with agreements and a hassle-free setup",
//           image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
//         },
//       ];
      
//       const [activeImage, setActiveImage] = useState(steps[0].image);


// //3d image 
//       const [offset, setOffset] = useState(0);
      
//       useEffect(() => {
//         const handleScroll = () => {
//           setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
//         };
      
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//       }, []);
//   return (
//     <section className="relative w-full min-h-screen bg-black text-white">

//       {/* 🔹 Header Bar */}
//       <div className="w-full h-[98px] bg-[#09658a]/90 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <h1 className="text-3xl font-bold text-white glow-text drop-shadow-lg">
//           FidWorx
//         </h1>

//         {/* Burger Icon */}
//         <button
//           className="text-white z-50"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* 🔹 Slide-in Mobile Menu */}
//       {menuOpen && (
//         <div className="fixed top-[98px] right-0 w-3/4 h-screen bg-blue-700 text-white shadow-lg z-40 p-6 space-y-6 animate-slide-in">
//           <Link
//             to="/"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             to="/menu"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             Explore Spaces
//           </Link>
//           <Link
//             to="/about"
//             className="block text-lg font-semibold hover:text-orange-400"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </Link>
//           <div>
//             <WishlistSidebar visitorId={visitorId} />
//           </div>
//         </div>
//       )}

//       {/* 🔹 Background Carousel */}
// <div className="absolute top-[98px] left-0 w-full h-[439px]">
//   {/* Carousel Image */}
//   <div
//     className={`absolute top-0 left-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
//       fadeIn ? "opacity-100" : "opacity-0"
//     }`}
//     style={{ backgroundImage: `url(${images[currentIndex]})` }}
//   ></div>

//   {/* Dark Transparent Overlay */}
//   <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

//   {/* Heading Text */}
// <div className="relative z-10 flex flex-col items-center justify-start h-full text-white pt-5">
//   <h1 className="text-[25px] sm:text-4xl md:text-5xl font-bold leading-tight mb-[3px]">
//     Find your perfect
//   </h1>
//   {/* Horizontal Scrolling Text */}
//   <div className="overflow-hidden w-[300px]">
//     <div
//       className="whitespace-nowrap animate-scroll-horizontal text-yellow-400 font-bold"
//       style={{ fontSize: "26px" }}
//     >
//       {text}
//     </div>
//   </div>
//   {/* 🔥 Mobile Search Box */}
// <div className="flex flex-col w-full max-w-sm mx-auto gap-4 p-4 mt-6 border shadow-lg bg-white/10 backdrop-blur-md border-white/30 rounded-2xl">
//   {/* Category Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.category
//         ? workspaceOptions.find((w) => w.value === filters.category)?.label
//         : "Select Category"}
//     </div>
//     {workspaceDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {workspaceOptions.map((opt) => (
//           <div
//             key={opt.value}
//             onClick={() => handleSelectCategory(opt.value)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {opt.label}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* City Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.city || "Select City"}
//     </div>
//     {cityDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {cities.map((city, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectCity(city)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {city}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Zone Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.zone || "Select Zone"}
//     </div>
//     {zoneDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {zones.map((zone, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectZone(zone)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {zone}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Location Dropdown */}
//   <div className="relative w-full">
//     <div
//       onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
//       className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//     >
//       {filters.locationOfProperty || "Select Location"}
//     </div>
//     {locationDropdownOpen && (
//       <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//         {locations.map((loc, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleSelectLocation(loc)}
//             className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//           >
//             {loc}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Buttons */}
//   <div className="flex items-center justify-between gap-4">
//     <button
//       onClick={handleSearch}
//       className="flex-1 px-6 py-2 font-semibold text-white transition bg-orange-500 shadow-md rounded-xl hover:bg-orange-600"
//     >
//       Search
//     </button>
//     <button
//       onClick={clearAll}
//       className="flex items-center justify-center w-10 h-10 text-white transition bg-red-500 rounded-full shadow-md hover:bg-red-600"
//       title="Clear All"
//     >
//       <X size={18} />
//     </button>
//   </div>
// </div>

// </div>
// <section className="py-8 bg-gray-100 overflow-hidden w-full">
//   {/* Heading */}
//   <h2 className="text-[24px] font-bold text-center text-gray-800 mb-6 px-4">
//     Trusted By <span className="text-orange-500">Leading Companies</span>
//   </h2>

//   {/* Scrolling logos */}
//   <div className="relative w-full overflow-hidden">
//     <div className="flex logo-slider">
//       {[...logos, ...logos].map((logo, idx) => (
//         <div
//           key={idx}
//           className="flex items-center justify-center min-w-[100px] sm:min-w-[140px] mx-4"
//         >
//           <img
//             src={logo}
//             alt="company logo"
//             className="h-10 sm:h-12 md:h-16 object-contain opacity-80 hover:opacity-100 transition"
//           />
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Inline CSS for smooth scroll */}
//   <style>{`
//     .logo-slider {
//       animation: scrollLeft 25s linear infinite;
//     }
//     @keyframes scrollLeft {
//       0% { transform: translateX(0); }
//       100% { transform: translateX(-50%); }
//     }
//   `}</style>
// </section>

// {/* 📍 City Cards Section */}
// <section className="w-full py-8 bg-black">
//   <div className="max-w-[95%] mx-auto flex flex-col gap-6">
//     {/* ✅ Bangalore (Large) */}
//     <div
//       className="w-full h-[220px] sm:h-[280px] md:h-[340px] relative rounded-xl overflow-hidden"
//       onMouseEnter={() => handleMouseEnter(videoRef)}
//       onMouseLeave={() => handleMouseLeave(videoRef)}
//     >
//       <video
//         ref={videoRef}
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         muted
//         playsInline
//       >
//         <source src={bglrvideo} type="video/mp4" />
//       </video>
//       <div className="absolute bottom-3 left-3 text-lg sm:text-xl font-bold text-white">
//         Bangalore
//       </div>
//     </div>

//     {/* ✅ Other Cities - Horizontal Slider */}
//     <div className="relative">
//       {/* Left Button */}
//       <button
//         className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
//         onClick={() => {
//           document.getElementById("cityScroll").scrollBy({ left: -200, behavior: "smooth" });
//         }}
//       >
//         <ChevronLeft size={20} />
//       </button>

//       {/* Scrollable Cities */}
//       <div
//         id="cityScroll"
//         className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
//       >
//         {/* Mumbai */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${mumbai})` }}
//           onMouseEnter={() => handleMouseEnter(mumbaiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(mumbaiVideoRef)}
//         >
//           <video
//             ref={mumbaiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={mubaivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Mumbai
//           </div>
//         </div>

//         {/* Kochi */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${kochi})` }}
//           onMouseEnter={() => handleMouseEnter(kochiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(kochiVideoRef)}
//         >
//           <video
//             ref={kochiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={kochivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Kochi
//           </div>
//         </div>

//         {/* Noida */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${noida})` }}
//           onMouseEnter={() => handleMouseEnter(noidaVideoRef)}
//           onMouseLeave={() => handleMouseLeave(noidaVideoRef)}
//         >
//           <video
//             ref={noidaVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={noidavideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Noida
//           </div>
//         </div>

//         {/* Hyderabad */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${hydarabad})` }}
//           onMouseEnter={() => handleMouseEnter(hydarabadVideoRef)}
//           onMouseLeave={() => handleMouseLeave(hydarabadVideoRef)}
//         >
//           <video
//             ref={hydarabadVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={hdbdvideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Hyderabad
//           </div>
//         </div>

//         {/* Delhi */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${dehli})` }}
//           onMouseEnter={() => handleMouseEnter(dehliVideoRef)}
//           onMouseLeave={() => handleMouseLeave(dehliVideoRef)}
//         >
//           <video
//             ref={dehliVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={dehlivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Delhi
//           </div>
//         </div>

//         {/* Chennai */}
//         <div
//           className="min-w-[173px] h-[130px] relative rounded-xl overflow-hidden flex-shrink-0"
//           style={{ backgroundImage: `url(${chennai})` }}
//           onMouseEnter={() => handleMouseEnter(chennaiVideoRef)}
//           onMouseLeave={() => handleMouseLeave(chennaiVideoRef)}
//         >
//           <video
//             ref={chennaiVideoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//           >
//             <source src={chennaivideo} type="video/mp4" />
//           </video>
//           <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
//             Chennai
//           </div>
//         </div>
//       </div>

//       {/* Right Button */}
//       <button
//         className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
//         onClick={() => {
//           document.getElementById("cityScroll").scrollBy({ left: 200, behavior: "smooth" });
//         }}
//       >
//         <ChevronRight size={20} />
//       </button>
//     </div>
//   </div>
// </section>
// <section className="w-full py-10 bg-gray-50">
//   <div className="grid grid-cols-1 gap-6 px-4 max-w-md mx-auto">
//     {/* Card 1 - Managed Office */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       {/* Image */}
//       <img
//         src="https://e0.pxfuel.com/wallpapers/393/28/desktop-wallpaper-business-meetings-room.jpg"
//         alt="Managed Office"
//         className="w-full h-[300px] object-cover"
//       />

//       {/* Default Header */}
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Managed Office</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Managed Office</h3>
//           <p className="text-sm">
//             Fully serviced offices with modern amenities and flexible terms.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>We handle interiors, maintenance, and utilities</li>
//             <li>Ready-to-use with all facilities included</li>
//             <li>Perfect for businesses wanting zero setup hassle</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>

//     {/* Card 2 - Office Space */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       <img
//         src="https://wallpapers.com/images/hd/hd-office-background-1920-x-1080-bcynny890vbtg364.jpg"
//         alt="Office Space"
//         className="w-full h-[300px] object-cover"
//       />
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Office Space</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Office Space</h3>
//           <p className="text-sm">
//             Dedicated office spaces designed for productivity and comfort.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>Entire space exclusively for your company</li>
//             <li>You manage interiors, branding, and operations</li>
//             <li>Best for companies wanting full ownership</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>

//     {/* Card 3 - Co-working Space */}
//     <div className="relative overflow-hidden shadow-md rounded-xl group">
//       <img
//         src="https://media.istockphoto.com/id/1365567295/photo/business-colleagues-having-a-meeting-in-a-boardroom.jpg?s=612x612&w=0&k=20&c=R7dhmDVXrXl0A8ZLI0LOeVXf--jktfkCXGpM1xbuj2A="
//         alt="Co-working Space"
//         className="w-full h-[300px] object-cover"
//       />
//       <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-black/60">
//         <h3 className="text-lg font-bold">Co-working Space</h3>
//         <span className="flex items-center gap-1 text-orange-500 text-sm font-semibold cursor-pointer">
//           Explore →
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       <div className="absolute inset-x-0 bottom-0 h-[250px] flex flex-col justify-end p-4 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/70 backdrop-blur-md group-hover:translate-y-0">
//         <div>
//           <h3 className="mb-2 text-xl font-bold">Co-working Space</h3>
//           <p className="text-sm">
//             Collaborative workspaces for freelancers, startups, and teams.
//           </p>
//           <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
//             <li>Dedicated seats & private cabins</li>
//             <li>All facilities included — just bring your laptop</li>
//             <li>Great for individuals and small teams</li>
//           </ul>
//         </div>
//         <button
//           className="px-4 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleExplore}
//         >
//           Explore
//         </button>
//       </div>
//     </div>
//   </div>
// </section>

// {/* Section - Mobile Responsive */}
// <section className="py-10  bg-gray-100">
//   <div className="flex flex-col items-center gap-8 px-4 max-w-md mx-auto">
//     {/* Top Image */}
//     <div className="w-full">
//       <img
//         src={activeImage}
//         alt="Workspace"
//         className="w-full h-[220px] object-cover rounded-xl shadow-md transition-opacity duration-500 ease-in-out hover:opacity-90"
//       />
//     </div>

//     {/* Content */}
//     <div className="flex  flex-col w-full">
//       {/* Title */}
//       <h2 className="text-xl font-extrabold text-black mb-6 leading-snug text-center">
//         Find and Book Your Perfect Workspace in{" "}
//         <span className="text-orange-500">4 Easy Steps</span> with{" "}
//         <span className="text-orange-500">FidWorx</span>
//       </h2>

//       {/* Steps */}
//       <div className="flex flex-col gap-4">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="group w-full bg-white shadow-sm rounded-lg p-3 flex items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//             onMouseEnter={() => setActiveImage(step.image)}
//           >
//             {/* Step Number */}
//             <div className="flex items-center justify-center text-sm font-bold text-white bg-orange-500 rounded-full shadow-md w-8 h-8">
//               {index + 1}
//             </div>

//             {/* Step Content */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
//                 {step.title}
//               </h3>
//               <p className="text-xs text-gray-600">{step.subtitle}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//       <div className="mt-6 text-center">
//         <button className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-lg hover:bg-orange-600">
//           Connect with Our Team Expert Today
//         </button>
//       </div>
//     </div>
//   </div>
// </section>

// {/* Number Section - Mobile Optimized */}
// <section className="mt-[-5px] py-10 text-center bg-white">
//   {/* Tagline */}
//   <h2 className="mb-10 text-2xl text-gray-900 font-bold leading-snug sm:text-3xl md:text-4xl">
//     India’s Premier Marketplace for{" "}
//     <span className="text-orange-500">Flexible Workspaces</span>
//   </h2>

//   {/* Stats Grid */}
//   <div className="grid max-w-5xl grid-cols-2 gap-8 mx-auto sm:grid-cols-2 md:grid-cols-4">
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         1800+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">Partner Spaces</p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         1000+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">Clients Served</p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         30+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">
//         Cities Across India
//       </p>
//     </div>
//     <div>
//       <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
//         25M+
//       </h3>
//       <p className="mt-1 text-sm text-gray-600 sm:text-base">
//         Sqft of Office Space Options
//       </p>
//     </div>
//   </div>
// </section>

// {/* Why Choose FidWorx Section */}
// <div
//   className="mt-10 relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//   {/* Content Wrapper */}
//   <div className="relative z-10 grid w-full grid-cols-1 gap-10 px-6 py-12 max-w-7xl md:grid-cols-2">
//     {/* Left Side - Glass Feature Boxes */}
//     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//       {[
//         {
//           title: "Wide Network",
//           desc: "Access 1000+ office spaces across prime locations.",
//           logo: "https://cdn-icons-png.flaticon.com/512/883/883407.png",
//         },
//         {
//           title: "Expert Guidance",
//           desc: "Our consultants provide end-to-end assistance.",
//           logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//         },
//         {
//           title: "Zero Brokerage",
//           desc: "Save money with no hidden fees or extra charges.",
//           logo: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
//         },
//         {
//           title: "Tailored Solutions",
//           desc: "Get workspace solutions customized for your needs.",
//           logo: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
//         },
//       ].map((item, i) => (
//         <div
//           key={i}
//           className="flex flex-col items-center p-6 text-center text-white transition-transform transform border shadow-lg backdrop-blur-md bg-white/10 border-white/30 rounded-2xl hover:-translate-y-2"
//         >
//           <img src={item.logo} alt={item.title} className="w-10 h-10 mb-3 sm:w-12 sm:h-12" />
//           <h3 className="text-base font-semibold sm:text-lg">{item.title}</h3>
//           <p className="mt-2 text-xs opacity-80 sm:text-sm">{item.desc}</p>
//         </div>
//       ))}
//     </div>

//     {/* Right Side - Heading & Content */}
//     <div className="flex flex-col justify-center space-y-6 text-white">
//       <h2 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl">
//         Why choose <span className="text-orange-500">FidWorx?</span>
//       </h2>
//       <p className="text-sm leading-relaxed opacity-90 sm:text-base md:text-lg">
//         We make your office-search a hassle-free experience. With in-depth knowledge, 
//         let our workspace solution experts find what you're looking for.
//       </p>
//       <button className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition bg-orange-500 shadow-lg hover:bg-orange-600 rounded-xl sm:px-6 sm:py-4 sm:text-lg">
//         Claim Your Free Consultation with Zero Brokerage Offer Now! →
//       </button>
//     </div>
//   </div>
// </div>
// {/* What is FidCo Section */}
// <div className="flex items-center justify-center py-12 px-4 bg-gray-50">
//   <div className="relative w-72 sm:w-80 p-6 overflow-hidden transition-all duration-500 bg-white shadow-lg cursor-pointer group rounded-2xl hover:h-56">
//     {/* Default Heading */}
//     <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 transition-opacity duration-300 group-hover:opacity-0">
//       What is FidCo?
//     </h3>

//     {/* Hover Content */}
//     <div className="absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//       <p className="text-sm text-gray-600 sm:text-base">
//         FidCo is your trusted partner for flexible workspace solutions, 
//         connecting businesses with offices, co-working, and managed spaces across India.
//       </p>
//     </div>
//   </div>
// </div>
// <section
//       className="relative h-[40vh] flex items-center justify-center bg-center bg-cover"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
//         backgroundAttachment: "scroll",
//         backgroundPositionY: `${offset}px`,
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Text content */}
//       <div className="relative z-10 px-4 text-center text-white">
//         <h2 className="text-4xl font-bold md:text-6xl">
//           Your Office Search,{" "}
//           <span className="text-orange-500">Simplified By Experts</span>
//         </h2>
//       </div>
//     </section>

// {/* About Section */}
// <section className="w-full py-16 bg-gray-100">
//   <div className="px-6 mx-auto text-center max-w-5xl">
//     {/* Heading */}
//     <h2 className="mb-6 text-4xl font-bold text-gray-900">
//       About <span className="text-orange-500">Us</span>
//     </h2>

//     {/* Description */}
//     <p className="mb-10 text-lg leading-relaxed text-gray-700">
//       We are a passionate team dedicated to solving complex problems with{" "}
//       <span className="font-semibold text-gray-900">innovative solutions</span>.  
//       With a strong focus on customer success, we help businesses transform 
//       their operations, enhance efficiency, and achieve sustainable growth.
//     </p>

//     {/* CTA Button */}
//     <button className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg">
//       Get Started
//     </button>
//   </div>
// </section>
// <Footer/>


// </div>
//   </section>
//   );
// };

// export default Home;










//=======================>>> Old 







// import React, { useState, useRef , useEffect} from 'react';
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";  
// // import bangalore from "../assets/cities/bengalore.jpeg";
// import bangalore from "../../assets/cities/bengalore.jpeg";
// import mumbai from "../../assets/cities/mumbai.jpeg";
// import kochi from "../../assets/cities/kochi.jpeg";
// import noida from "../../assets/cities/noida.jpeg";
// import hydarabad from "../../assets/cities/hydarabad.jpeg";
// import dehli from "../../assets/cities/dehli.jpeg";
// import Cookies from "js-cookie";
// import manged from "../../assets/imgthree.png";
// import office from "../../assets/officeone.png";
// import coworking from "../../assets/imtwo.png";
// import { searchManagedOffices } from "../../api/services/managedOfficeService";
// import { searchOfficeSpaces } from "../../api/services/officeSpaceService";
// import { searchCoWorkingSpaceData } from "../../api/services/coWorkingSpaceService";
// import chennai from "../../assets/cities/chennai.jpeg";
// import bglrvideo from "../../assets/cities/hdbdvideo.mp4";
// import mubaivideo from "../../assets/cities/mumbaivideo.mp4";
// import hdbdvideo from "../../assets/cities/hydarabadvideo.mp4";
// import kochivideo from "../../assets/cities/bglrvideo.mp4";
// import noidavideo from "../../assets/cities/noidavideo.mp4";
// import dehlivideo from "../../assets/cities/dehlivideo.mp4";
// import chennaivideo from "../../assets/cities/chennaivideo.mp4";
// import { officeSpaces } from '../../data/mockData';
// import { X } from "lucide-react";
// import WishlistSidebar from '../../components/WishlistSidebar';


// const Home = () => {
//   const navigate = useNavigate();
//   // States for hover effects
//   const [isHovered, setIsHovered] = useState(false);
// const visitorId = Cookies.get("visitorId");
//   // Refs for controlling the video playback
//   const videoRef = useRef(null);

//   const [bgImage, setBgImage] = useState(bangalore); // Initial background image
//   const [fadeIn, setFadeIn] = useState(false); 

//   const [text, setText] = useState("Manged office");
  
//   const mumbaiVideoRef = useRef(null);
//   const hydarabadVideoRef = useRef(null);
//   const kochiVideoRef = useRef(null);
//   const noidaVideoRef = useRef(null);
//   const dehliVideoRef = useRef(null);
//   const chennaiVideoRef = useRef(null);

//   const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
//   const [isRequirementDropdownOpen, setIsRequirementDropdownOpen] = useState(false);
//   const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);


//   const [selectedRequirement, setSelectedRequirement] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [filteredRequirements, setFilteredRequirements] = useState([]);
//   const [filteredLocations, setFilteredLocations] = useState([]);
//   //search options
//   const [spaceType, setSpaceType] = useState("");
//   const [city, setCity] = useState("");
//   // const [locations, setLocations] = useState([]);


 
//   const [selectedOption, setSelectedOption] = useState("What are you looking for");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedLocations, setSelectedLocations] = useState("");



//   // Data from API
//   const [allData, setAllData] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [locations, setLocations] = useState([]);


//  const [filters, setFilters] = useState({
//     city: "",
//     zone: "",
//     locationOfProperty: "",
//     category: "",
//   });

// // inside Home component state
// const [selectedZone, setSelectedZone] = useState("");
// const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
// const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
// const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

// //  const workspaceOptions = [ "Managed Space","Office Space","Co-Working Space"];

// //=========================>>>>Mobile UI updates
// const [menuOpen, setMenuOpen] = useState(false);


//   // Extract unique cities from the mock data
//   // const cities = [...new Set(officeSpaces.map(item => item.city))];
// /////3d effects
// const [offset, setOffset] = useState(0);

// useEffect(() => {
//   const handleScroll = () => {
//     setOffset(window.scrollY * 0.5); // adjust speed here (0.3–0.6 looks good)
//   };

//   window.addEventListener("scroll", handleScroll);
//   return () => window.removeEventListener("scroll", handleScroll);
// }, []);
//   // Filter requirements based on the selected city
//   useEffect(() => {
//     if (selectedCity) {
//       const requirements = [...new Set(
//         officeSpaces
//           .filter(item => item.city === selectedCity)
//           .map(item => item.type)
//       )];
//       setFilteredRequirements(requirements);
//       setSelectedRequirement(''); // Reset requirement when city is changed
//     }
//   }, [selectedCity]);

//   // Filter locations based on the selected city and requirement
//   useEffect(() => {
//     if (selectedCity && selectedRequirement) {
//       const locations = officeSpaces
//         .filter(item => item.city === selectedCity && item.type === selectedRequirement)
//         .map(item => item.location);
//       setFilteredLocations([...new Set(locations)]);
//       setSelectedLocation(''); // Reset location when requirement is changed
//     }
//   }, [selectedCity, selectedRequirement]);

//   // Toggle the dropdown visibility
//   const toggleDropdown = (dropdown) => {
//     if (dropdown === 'city') {
//       setIsCityDropdownOpen(!isCityDropdownOpen);
//       setIsRequirementDropdownOpen(false);
//       setIsLocationDropdownOpen(false);
//     } else if (dropdown === 'requirement') {
//       setIsRequirementDropdownOpen(!isRequirementDropdownOpen);
//       setIsCityDropdownOpen(false);
//       setIsLocationDropdownOpen(false);
//     } else if (dropdown === 'location') {
//       setIsLocationDropdownOpen(!isLocationDropdownOpen);
//       setIsCityDropdownOpen(false);
//       setIsRequirementDropdownOpen(false);
//     }
//   };

 

  

//   // Play the video on hover
//   const handleMouseEnter = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//     setIsHovered(true);
//   };

//   // Pause the video when hover ends
//   const handleMouseLeave = (videoRef) => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0; 
//     }
//     setIsHovered(false);
//   };

    
//     const images = [manged, office, coworking];  
  
  
//     useEffect(() => {
//       const timer = setInterval(() => {
//         setFadeIn(false); // Start fading out the current image
//         setTimeout(() => {
//           setBgImage((prevImage) => {
//             const currentIndex = images.indexOf(prevImage);  // Find current image index
//             const nextIndex = (currentIndex + 1) % images.length;  // Get next image index, cycle through 0, 1, 2...
//             return images[nextIndex];  // Return next image in the array
//           });
//           setFadeIn(true); // Start fading in the new image
//         }, 100); // Delay to let the fade-out finish before changing the image
//       }, 4000); // Change background every 3 seconds
  
//       // Cleanup interval when the component unmounts
//       return () => clearInterval(timer);
//     }, []);


//     useEffect(() => {
//       const words = ["Manged office", "Coworking space","Office space", ];
//       let index = 0;
      
//       const interval = setInterval(() => {
//         index = (index + 1) % words.length;
//         setText(words[index]);
//       }, 4000); // Change text every 3 seconds
  
//       return () => clearInterval(interval); // Cleanup on unmount
//     }, []);


//     const steps = [
//       {
//         title: "Share Your Requirements",
//         subtitle: "Tell us your needs and a dedicated adviser will handle the rest",
//         image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
//       },
//       {
//         title: "Get Customized Options",
//         subtitle: "We’ll provide tailored workspace suggestions for you",
//         image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
//       },
//       {
//         title: "Visit & Finalize",
//         subtitle: "Tour shortlisted spaces and choose the best fit",
//         image: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?cs=srgb&dl=pexels-pixabay-37347.jpg&fm=jpg",
//       },
//       {
//         title: "Move In Smoothly",
//         subtitle: "We’ll assist with agreements and a hassle-free setup",
//         image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
//       },
//     ];
    
//     const [activeImage, setActiveImage] = useState(steps[0].image);
//     useEffect(() => {
//       const scroller = document.querySelector(".logo-slider");
//       scroller.addEventListener("mouseenter", () => {
//         scroller.style.animationPlayState = "paused";
//       });
//       scroller.addEventListener("mouseleave", () => {
//         scroller.style.animationPlayState = "running";
//       });
//     }, []);

//     const logos = [
//       "https://cdn.brandfetch.io/idmwKhVApy/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1755410431282",
//       "https://cdn.brandfetch.io/id3Wnmm8UV/w/213/h/35/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1667635954847",
//    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5dUf36OoL_il99-lPDiiRmdE58O23SHdWg&s",
//     "https://www.ufomoviez.com/sites/default/files/2019-09/ufo-download_logo.jpg",
//      "https://www.recove.in/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
//       "https://www.maestro.com/assets/images/maestrologo.png",
//       "https://cdn.brandfetch.io/id5SQZAHZ-/w/4036/h/1564/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1752213992773"
//     ];


// //----------->> Search function

//  // UI Dropdowns

//  // Handle filter changes
//   const workspaceOptions = [
//     { label: "Managed Office", value: "managed" },
//     { label: "Office Space", value: "office" },
//     { label: "Co-Working Space", value: "co-working" },
//   ];

//   // 🔥 Utility to get API function based on category
//   const getApiByCategory = (category) => {
//     if (category === "managed") return searchManagedOffices;
//     if (category === "office") return searchOfficeSpaces;
//     if (category === "co-working") return searchCoWorkingSpaceData;
//     return searchManagedOffices; // default
//   };


  
//  // Fetch data whenever category changes
//   useEffect(() => {
//     if (!filters.category) return;

//     const fetchData = async () => {
//       const apiFn = getApiByCategory(filters.category);
//       const result = await apiFn(1, 100);
//       setAllData(result);

//       const uniqueCities = [
//         ...new Set(result.map((item) => item.location?.city).filter(Boolean)),
//       ];
//       setCities(uniqueCities);
//       setZones([]);
//       setLocations([]);
//     };

//     fetchData();
//   }, [filters.category]);


//  const handleSelectCategory = (value) => {
//   setFilters((prev) => ({
//     ...prev,
//     category: value,
//     city: "",
//     zone: "",
//     locationOfProperty: "",
//   }));
//   setWorkspaceDropdownOpen(false);
// };


// const handleSelectCity = (city) => {
//   setFilters((prev) => ({ ...prev, city, zone: "", locationOfProperty: "" }));
//   setCityDropdownOpen(false);

//   const cityZones = [
//     ...new Set(
//       allData
//         .filter((item) => item.location?.city === city)
//         .map((item) => item.location?.zone)
//         .filter(Boolean)
//     ),
//   ];
//   setZones(cityZones);
//   setLocations([]);
// };


// const handleSelectZone = (zone) => {
//   setFilters((prev) => ({ ...prev, zone, locationOfProperty: "" }));
//   setZoneDropdownOpen(false);

//   const zoneLocations = [
//     ...new Set(
//       allData
//         .filter(
//           (item) =>
//             item.location?.city === filters.city &&
//             item.location?.zone === zone
//         )
//         .map((item) => item.location?.locationOfProperty)
//         .filter(Boolean)
//     ),
//   ];
//   setLocations(zoneLocations);
// };

// const handleSelectLocation = (loc) => {
//   setFilters((prev) => ({ ...prev, locationOfProperty: loc }));
//   setLocationDropdownOpen(false);
// };
//  // Search action
//  const handleSearch = () => {
//   const query = new URLSearchParams(
//     Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
//   ).toString();
//   navigate(query ? `/menu?${query}` : `/menu`);
// };

// const handleExplore = () => {
//   navigate("/menu");
// };


//  // Reset filters
//  const clearAll = () => {
//   setFilters({
//     city: "",
//     zone: "",
//     locationOfProperty: "",
//     category: "",
//   });
//   setCities([]);
//   setZones([]);
//   setLocations([]);
//   setAllData([]);
// };



//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Hero Section */}
//    <section className="relative flex flex-col items-center justify-center w-full h-screen px-6 text-center text-white bg-black">
//       {/* Background overlays */}
//   <div className="absolute top-0 left-0 z-0 w-full h-full bg-black opacity-40"></div>
//   <div
//     className={`absolute top-0 left-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
//       fadeIn ? "opacity-100" : "opacity-0"
//     }`}
//     style={{ backgroundImage: `url(${bgImage})` }}
//   ></div>
//   <div className="absolute top-0 left-0 z-0 w-full h-full bg-black opacity-40"></div>

//   {/* Logo */}
//   {/* Header Bar */}
//   <div className="w-full h-[85px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//         <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
// </div>
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

//   {/* Heading */}
//   <div className="relative z-5">
//     <div className="flex items-center justify-center mb-20 space-x-6">
//       <h1 className="text-5xl font-bold leading-tight">Find your perfect</h1>
//       <div className="mt-1 mb-2 yellow-bold-text scroll-vertical-container">
//         <div
//           className="yellow-bold-text scroll-vertical"
//           style={{ fontSize: "43px" }}
//         >
//           {text}
//         </div>
//       </div>
//     </div>
//   </div>
//   {/* 🔥 Search Box Section */}
  
//       {/* 🔥 Search Box */}
//         <div className="flex flex-wrap items-center justify-center gap-4 p-6 border shadow-lg bg-white/10 backdrop-blur-md border-white/30 rounded-2xl">
//           {/* Category Dropdown */}
//           <div className="relative w-60">
//             <div
//               onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
//               className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//             >
//               {filters.category
//                 ? workspaceOptions.find((w) => w.value === filters.category)
//                     ?.label
//                 : "Select Category"}
//             </div>
//             {workspaceDropdownOpen && (
//               <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//                 {workspaceOptions.map((opt) => (
//                   <div
//                     key={opt.value}
//                     onClick={() => handleSelectCategory(opt.value)}
//                     className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//                   >
//                     {opt.label}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* City Dropdown */}
//           <div className="relative w-60">
//             <div
//               onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
//               className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//             >
//               {filters.city || "Select City"}
//             </div>
//             {cityDropdownOpen && (
//               <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//                 {cities.map((city, idx) => (
//                   <div
//                     key={idx}
//                     onClick={() => handleSelectCity(city)}
//                     className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//                   >
//                     {city}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Zone Dropdown */}
//           <div className="relative w-60">
//             <div
//               onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
//               className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//             >
//               {filters.zone || "Select Zone"}
//             </div>
//             {zoneDropdownOpen && (
//               <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//                 {zones.map((zone, idx) => (
//                   <div
//                     key={idx}
//                     onClick={() => handleSelectZone(zone)}
//                     className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//                   >
//                     {zone}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Location Dropdown */}
//           <div className="relative w-60">
//             <div
//               onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
//               className="w-full px-4 py-2 text-white border cursor-pointer bg-white/20 rounded-xl border-white/50"
//             >
//               {filters.locationOfProperty || "Select Location"}
//             </div>
//             {locationDropdownOpen && (
//               <div className="absolute z-20 w-full mt-2 overflow-y-auto text-black shadow-lg bg-white/90 rounded-xl max-h-48">
//                 {locations.map((loc, idx) => (
//                   <div
//                     key={idx}
//                     onClick={() => handleSelectLocation(loc)}
//                     className="px-4 py-2 cursor-pointer hover:bg-orange-100"
//                   >
//                     {loc}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Buttons */}
//           <button
//             onClick={handleSearch}
//             className="px-6 py-2 font-semibold text-white transition bg-orange-500 shadow-md rounded-xl hover:bg-orange-600"
//           >
//             Search
//           </button>
//           <button
//             onClick={clearAll}
//             className="flex items-center justify-center w-10 h-10 text-white transition bg-red-500 rounded-full shadow-md hover:bg-red-600"
//             title="Clear All"
//           >
//             <X size={18} />
//           </button>
//         </div>
// </section>

// <section className="py-12 overflow-hidden bg-gray-100">
//       {/* Heading */}
//       <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 md:text-3xl">
//         Trusted By <span className="text-orange-500">Leading Companies</span>
//       </h2>

//       {/* Scrolling logos */}
//       <div className="relative w-full overflow-hidden">
//         <div className="flex logo-slider">
//           {[...logos, ...logos].map((logo, idx) => (
//             <div
//               key={idx}
//               className="flex items-center justify-center min-w-[150px] mx-6"
//             >
//               <img
//                 src={logo}
//                 alt="company logo"
//                 className="object-contain h-12 transition md:h-16 opacity-80 hover:opacity-100"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Inline CSS for smooth scroll */}
//       <style>{`
//         .logo-slider {
//           animation: scrollLeft 25s linear infinite;
//         }
//         @keyframes scrollLeft {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//       `}</style>
//     </section>

//       {/* Cards Section */}
//       <section className="w-full py-8 bg-black">
//         <div className="flex items-center justify-center mx-auto px-15 max-w-10xl">
//           {/* Large Image Card */}
//           <div
//             className="w-full sm:w-[700px] sm:h-[421px] h-[auto] ml-4 relative"
//             onMouseEnter={() => handleMouseEnter(videoRef)}
//             onMouseLeave={() => handleMouseLeave(videoRef)}
//           >
//             <video
//               ref={videoRef}
//               className="absolute top-0 left-0 object-cover w-full h-full"
//               muted
//             >
//               <source src={bglrvideo} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <div className="absolute text-xl font-bold text-white bottom-2 left-2">
//               Bangalore
//             </div>
//           </div>

//           {/* Small Images Section */}
//           <div className="flex flex-wrap justify-center gap-4 ml-8">
//             {/* Mumbai Video Card */}
//             <div
//               className="w-[295px] h-[205px] bg-cover bg-center relative"
//               style={{ backgroundImage: `url(${mumbai})` }}
//               onMouseEnter={() => handleMouseEnter(mumbaiVideoRef)}
//               onMouseLeave={() => handleMouseLeave(mumbaiVideoRef)}
//             >
//               <video
//                 ref={mumbaiVideoRef}
//                 className="absolute top-0 left-0 object-cover w-full h-full"
//                 muted
//               >
//                 <source src={mubaivideo} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <div className="absolute text-xl font-bold text-white bottom-2 left-2">
//                 Mumbai
//               </div>
//             </div>

//             {/* Kochi Video Card */}
//             <div
//               className="w-[295px] h-[205px] bg-cover bg-center relative"
//               style={{ backgroundImage: `url(${kochi})` }}
//               onMouseEnter={() => handleMouseEnter(kochiVideoRef)}
//               onMouseLeave={() => handleMouseLeave(kochiVideoRef)}
//             >
//               <video
//                 ref={kochiVideoRef}
//                 className="absolute top-0 left-0 object-cover w-full h-full"
//                 muted
//               >
//                 <source src={kochivideo} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <div className="absolute text-xl font-bold text-white bottom-2 left-2">
//                 Kochi
//               </div>
//             </div>

//             {/* Noida Video Card */}
//             <div
//               className="w-[295px] h-[205px] bg-cover bg-center relative"
//               style={{ backgroundImage: `url(${noida})` }}
//               onMouseEnter={() => handleMouseEnter(noidaVideoRef)}
//               onMouseLeave={() => handleMouseLeave(noidaVideoRef)}
//             >
//               <video
//                 ref={noidaVideoRef}
//                 className="absolute top-0 left-0 object-cover w-full h-full"
//                 muted
//               >
//                 <source src={noidavideo} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <div className="absolute text-xl font-bold text-white bottom-2 left-2">
//                 Noida
//               </div>
//             </div>

//             {/* Hyderabad Video Card */}
//             <div
//               className="w-[295px] h-[205px] bg-cover bg-center relative"
//               style={{ backgroundImage: `url(${hydarabad})` }}
//               onMouseEnter={() => handleMouseEnter(hydarabadVideoRef)}
//               onMouseLeave={() => handleMouseLeave(hydarabadVideoRef)}
//             >
//               <video
//                 ref={hydarabadVideoRef}
//                 className="absolute top-0 left-0 object-cover w-full h-full"
//                 muted
//               >
//                 <source src={hdbdvideo} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <div className="absolute text-xl font-bold text-white bottom-2 left-2">
//                 Hyderabad
//               </div>
//             </div>

//             {/* Delhi Video Card */}
//             <div
//               className="w-[295px] h-[205px] bg-cover bg-center relative"
//               style={{ backgroundImage: `url(${dehli})` }}
//               onMouseEnter={() => handleMouseEnter(dehliVideoRef)}
//               onMouseLeave={() => handleMouseLeave(dehliVideoRef)}
//             >
//               <video
//                 ref={dehliVideoRef}
//                 className="absolute top-0 left-0 object-cover w-full h-full"
//                 muted
//               >
//                 <source src={dehlivideo} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <div className="absolute text-xl font-bold text-white bottom-2 left-2">
//                 Delhi
//               </div>
//             </div>

//             {/* Chennai Video Card */}
//             <div
//               className="w-[295px] h-[205px] bg-cover bg-center relative"
//               style={{ backgroundImage: `url(${chennai})` }}
//               onMouseEnter={() => handleMouseEnter(chennaiVideoRef)}
//               onMouseLeave={() => handleMouseLeave(chennaiVideoRef)}
//             >
//               <video
//                 ref={chennaiVideoRef}
//                 className="absolute top-0 left-0 object-cover w-full h-full"
//                 muted
//               >
//                 <source src={chennaivideo} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <div className="absolute text-xl font-bold text-white bottom-2 left-2">
//                 Chennai
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="w-full py-16 bg-gray-50">
//   <div className="grid grid-cols-1 gap-8 px-4 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-3">

//     {/* Card 1 - Managed Office */}
//  {/* Managed Office */}
// <div className="relative overflow-hidden shadow-lg rounded-xl group">
//   {/* Image */}
//   <img
//     src="https://e0.pxfuel.com/wallpapers/393/28/desktop-wallpaper-business-meetings-room.jpg"
//     alt="Managed Office"
//     className="w-full h-[500px] object-cover"
//   />

//   {/* Default Header + Button */}
//   <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 text-white bg-black/60 backdrop-blur-sm">
//     <h3 className="text-2xl font-bold">Managed Office</h3>
//     <span className="flex items-center gap-1 font-bold text-orange-500 cursor-pointer">
//     Explore <span className="text-xl">→</span>
//   </span>
//   </div>

//   {/* Hover Overlay */}
//   <div className="absolute inset-x-0 bottom-0 h-[300px] flex flex-col justify-end p-6 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/60 backdrop-blur-md group-hover:translate-y-0">

//     <div>
//       <h3 className="mb-4 text-2xl font-bold">Managed Office</h3>
//       <p>
//         Fully serviced offices with modern amenities and flexible terms.
//       </p>
//       <ul className="mt-4 space-y-1 text-sm list-disc list-inside">
//         <li>We handle interiors, maintenance, and utilities</li>
//         <li>Ready-to-use with all facilities included</li>
//         <li>Perfect for businesses wanting zero setup hassle</li>
//       </ul>
//     </div>
//     <button className="px-6 py-3 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600" 
//     onClick={handleExplore}
//     >
//       Explore
//     </button>
//   </div>
// </div>


// {/* Office Space */}
// <div className="relative overflow-hidden shadow-lg rounded-xl group">
//   {/* Image */}
//   <img
//     src="https://wallpapers.com/images/hd/hd-office-background-1920-x-1080-bcynny890vbtg364.jpg"
//     alt="Office Space"
//     className="w-full h-[500px] object-cover"
//   />

//   {/* Default Header + Button */}
// {/* Default Header + Explore Text */}
// <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 text-white bg-black/60 backdrop-blur-sm">
//   <h3 className="text-2xl font-bold">Office Space</h3>
//   <span className="flex items-center gap-1 font-bold text-orange-500 cursor-pointer">
//     Explore <span className="text-xl">→</span>
//   </span>
// </div>


//   {/* Hover Overlay */}
//   <div className="absolute inset-x-0 bottom-0 h-[300px] flex flex-col justify-end p-6 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/60 backdrop-blur-md group-hover:translate-y-0">


//     <div>
//       <h3 className="mb-2 text-2xl font-bold">Office Space</h3>
//       <p className="text-sm text-gray-200">
//         Dedicated office spaces designed for productivity and comfort.
//       </p>
//       <ul className="mt-2 space-y-1 text-sm text-gray-200 list-disc list-inside">
//         <li>Entire space exclusively for your company</li>
//         <li>You manage interiors, branding, and operations</li>
//         <li>Best for companies wanting full ownership of their setup</li>
//       </ul>
//     </div>
//     <button className="px-4 py-2 mt-4 transition bg-blue-500 rounded-lg hover:bg-blue-600">
//       Explore
//     </button>
//   </div>
// </div>



//     {/* Card 3 - Co-working Space */}
//     <div className="relative overflow-hidden shadow-lg rounded-xl group">
//   {/* Image */}
//   <img
//     src="https://media.istockphoto.com/id/1365567295/photo/business-colleagues-having-a-meeting-in-a-boardroom.jpg?s=612x612&w=0&k=20&c=R7dhmDVXrXl0A8ZLI0LOeVXf--jktfkCXGpM1xbuj2A="
//     alt="Co-working Space"
//     className="w-full h-[500px] object-cover"
//   />

//   {/* Default Header + Button */}
//   <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 text-white bg-black/60 backdrop-blur-sm">
//   <h3 className="text-2xl font-bold">Co-working Space</h3>
//   <span className="flex items-center gap-1 font-bold text-orange-500 cursor-pointer">
//     Explore <span className="text-xl">→</span>
//   </span>
// </div>




//   {/* Hover Overlay */}
//   <div className="absolute inset-x-0 bottom-0 h-[300px] flex flex-col justify-end p-6 text-white transition-all duration-500 ease-in-out translate-y-full bg-black/60 backdrop-blur-md group-hover:translate-y-0">

//     <div>
//       <h3 className="mb-4 text-2xl font-bold">Co-working Space</h3>
//       <p>
//         Collaborative workspaces for freelancers, startups, and teams.
//       </p>
//       <ul className="mt-4 space-y-1 text-sm list-disc list-inside">
//         <li>Dedicated seats & private cabins</li>
//         <li>All facilities included — just bring your laptop</li>
//         <li>Great for individuals, freelancers, and small teams</li>
//       </ul>
//     </div>
//     <button className="px-6 py-3 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
//       Explore
//     </button>
//   </div>
// </div>



//   </div>
// </section>


// {/* Section static */}
// <section className="flex items-center justify-center py-10 bg-gradient-to-r from-gray-50 to-gray-100">
//       <div className="container flex flex-wrap items-center gap-8 mx-auto lg:flex-nowrap">
//         {/* Left Side Image */}
//         <div className="flex-shrink-0">
//           <img
//             src={activeImage}
//             alt="Workspace"
//              className="w-[550px] h-[500px] object-cover rounded-2xl shadow-lg transition-opacity duration-500 ease-in-out hover:opacity-90"
//           />
//         </div>

//         {/* Right Side Content */}
//         <div className="flex flex-col justify-center">
//           {/* Title */}
//           <h2 className="text-3xl font-extrabold text-gray-800 mb-6 leading-snug w-[480px]">
//             Find and Book Your Perfect Workspace in <br />
//             <span className="text-orange-500">4 Easy Steps</span> with{" "}
//             <span className="text-orange-600">FidWorx</span>
//           </h2>

//           {/* Steps */}
//           <div className="flex flex-col gap-8">
//             {steps.map((step, index) => (
//               <div
//                 key={index}
//                 className="group w-[600px] bg-white shadow-md rounded-xl p-4 flex items-start gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//                 onMouseEnter={() => setActiveImage(step.image)}
//               >
//                 {/* Step Number */}
//                 <div className="flex items-center justify-center text-base font-bold text-white bg-orange-500 rounded-full shadow-md w-9 h-9">
//                   {index + 1}
//                 </div>

//                 {/* Step Content */}
//                 <div>
//                   <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
//                     {step.title}
//                   </h3>
//                   <p className="text-sm text-gray-600">{step.subtitle}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Button */}
//           <div className="mt-6">
//             <button className="px-6 py-3 font-semibold text-white transition-colors duration-300 bg-orange-500 shadow-md rounded-xl hover:bg-orange-600">
//               Connect with Our Team Expert Today
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>


// {/* Number section */}
// <section className="py-16 text-center bg-white">
//   {/* Tagline */}
//   <h2 className="mb-12 text-3xl font-bold md:text-4xl">
//     India’s Premier Marketplace for{" "}
//     <span className="text-orange-500">Flexible Workspaces</span>
//   </h2>

//   {/* Stats Grid */}
//   <div className="grid max-w-6xl grid-cols-2 gap-8 mx-auto md:grid-cols-4">
//     <div>
//       <h3 className="text-4xl font-extrabold text-gray-900 md:text-5xl">1800+</h3>
//       <p className="mt-2 text-gray-600">Partner Spaces</p>
//     </div>
//     <div>
//       <h3 className="text-4xl font-extrabold text-gray-900 md:text-5xl">1000+</h3>
//       <p className="mt-2 text-gray-600">Clients Served</p>
//     </div>
//     <div>
//       <h3 className="text-4xl font-extrabold text-gray-900 md:text-5xl">30+</h3>
//       <p className="mt-2 text-gray-600">Cities Across India</p>
//     </div>
//     <div>
//       <h3 className="text-4xl font-extrabold text-gray-900 md:text-5xl">25M+</h3>
//       <p className="mt-2 text-gray-600">Sqft of Office Space Options</p>
//     </div>
//   </div>
// </section>

// <div
//   className="relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
//   }}
// >
//   {/* Overlay for dark tint */}
//   <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//   {/* Content Wrapper */}
//   <div className="relative z-10 grid items-center w-full grid-cols-1 gap-8 px-6 max-w-7xl md:grid-cols-2">
//     {/* Left Side - 4 Glass Boxes */}
//     <div className="grid grid-cols-2 gap-6">
//       {[
//         {
//           title: "Wide Network",
//           desc: "Access 1000+ office spaces across prime locations.",
//           logo: "https://cdn-icons-png.flaticon.com/512/883/883407.png",
//         },
//         {
//           title: "Expert Guidance",
//           desc: "Our consultants provide end-to-end assistance.",
//           logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//         },
//         {
//           title: "Zero Brokerage",
//           desc: "Save money with no hidden fees or extra charges.",
//           logo: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
//         },
//         {
//           title: "Tailored Solutions",
//           desc: "Get workspace solutions customized for your needs.",
//           logo: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
//         },
//       ].map((item, i) => (
//         <div
//           key={i}
//           className="flex flex-col items-center p-6 text-center text-white transition-transform transform border shadow-lg backdrop-blur-md bg-white/10 border-white/30 rounded-2xl hover:-translate-y-2"
//         >
//           <img src={item.logo} alt={item.title} className="w-12 h-12 mb-3" />
//           <h3 className="text-lg font-semibold">{item.title}</h3>
//           <p className="mt-2 text-sm opacity-80">{item.desc}</p>
//         </div>
//       ))}
//     </div>

//     {/* Right Side - Heading & Text */}
//     <div className="space-y-6 text-white">
//       <h2 className="text-4xl font-bold">
//         Why choose <span className="text-orange-500">FidWorx?</span>
//       </h2>
//       <p className="text-lg leading-relaxed opacity-90">
//         We make your office-search a hassle-free experience. With in-depth knowledge, 
//         let our workspace solution experts find what you're looking for.
//       </p>
//       <button className="flex items-center gap-2 px-6 py-4 text-lg font-semibold text-white transition bg-orange-500 shadow-lg hover:bg-orange-600 rounded-xl">
//         Claim Your Free Consultation with Zero Brokerage Offer Now! →
//       </button>
//     </div>
//   </div>
// </div>


// <div className="flex items-center justify-center py-16">
//   <div className="relative p-6 overflow-hidden transition-all duration-500 bg-white shadow-lg cursor-pointer group rounded-2xl w-80 hover:h-60">
//     <h3 className="text-xl font-bold text-center transition-opacity duration-300 group-hover:opacity-0">
//       What is FidCo?
//     </h3>

//     {/* <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-gray-700 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
//       <p className="text-center">
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//       </p>
//       <p className="text-center">
//         Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//       </p>
//       <p className="text-center">
//         Ut enim ad minim veniam, quis nostrud exercitation ullamco.
//       </p>
//     </div> */}
//   </div>
// </div>

// {/*3d image scroll */}
// <section
//       className="relative h-[80vh] flex items-center justify-center bg-center bg-cover"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
//         backgroundAttachment: "scroll", // not fixed, we'll animate instead
//         backgroundPositionY: `${offset}px`, // this makes the image move up/down
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Text content */}
//       <div className="relative z-10 px-4 text-center text-white">
        
//         <h2 className="text-4xl font-bold md:text-6xl">
//           Your Office Search,{" "}
//           <span className="text-orange-500">Simplified By Experts</span>
//         </h2>
//       </div>
//     </section>

//     {/* About Section */}
//     <section className="w-full py-12 bg-gray-200">
//         <div className="px-6 mx-auto text-center max-w-7xl">
//           <h2 className="mb-4 text-3xl font-semibold text-gray-800">
//             About Us
//           </h2>
//           <p className="mb-8 text-lg text-gray-700">
//             We are a passionate team dedicated to solving complex problems with innovative solutions. With a focus on customer success, we help businesses transform their operations and achieve growth.
//           </p>
//           <button className="px-6 py-3 text-lg font-semibold text-white transition duration-300 bg-blue-600 rounded-full hover:bg-blue-700">
//             Get Started
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
   
//       <footer className="pt-12 pb-6 bg-[#16607B] border-t border-gray-200">
// <div className="px-6 mb-10 text-center md:text-left">
//   <h1 className="text-5xl md:text-6xl font-extrabold tracking-wider text-white relative inline-block drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
//     <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-white to-teal-200">
//       Fidco
//     </span>
//     <span className="absolute text-white left-1 top-1 opacity-10">Fidco</span>
//   </h1>
//   <p className="mt-2 text-sm tracking-widest text-gray-300 uppercase">Redefining Real Estate</p>
// </div>
        
//         <div className="grid grid-cols-1 gap-10 px-6 mx-auto text-sm text-white max-w-7xl md:grid-cols-4">
//           <div>
//             <h4 className="mb-4 font-semibold text-white">Bangalore</h4>
//             <p className="mb-2">
//               Fidelitus Corp, Brigade Software Park, No. 43, Ground/First Block,
//               <br />
//               27th Cross, Banashankari 2nd Stage,
//               <br />
//               Bangalore - 560070, Karnataka.
//             </p>
//             <p className="mb-1">📞 +91 9663022237</p>
//             <p>✉️ info@fidelituscorp.com</p>
//           </div>
//           <div>
//             <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
//             <ul className="space-y-2">
//               <li>Home</li>
//               <li>About</li>
//               <li>Why Us</li>
//               <li>Contact Us</li>
//               <li>Our Blogs</li>
//               <li>Careers</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="mb-4 font-semibold text-white">Services</h4>
//             <ul className="space-y-2">
//               <li>HR Labs</li>
//               <li>Projects</li>
//               <li>Facility Management</li>
//               <li>Fidelitus Gallery</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="mb-4 font-semibold text-white">Transactions</h4>
//             <ul className="mb-4 space-y-2">
//               <li>Shilpa Foundation</li>
//             </ul>
//             <div className="flex space-x-4 text-white">
//               <a href="#">
//                 <i className="fab fa-facebook" />
//               </a>
//               <a href="#">
//                 <i className="fab fa-instagram" />
//               </a>
//               <a href="#">
//                 <i className="fab fa-linkedin" />
//               </a>
//             </div>
//           </div>
//         </div>
//         <div className="pt-4 mt-12 text-xs text-center text-white border-t border-gray-200">
//           ©️ 2025 Fidelitus Real Estate Transaction Services. All Rights Reserved
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;








//==================>>>>>> Updateing for mobile


// import React from "react";
// import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import WishlistSidebar from "../../components/WishlistSidebar";

// export default function Home() {
//   const visitorId = Cookies.get("visitorId");

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="w-full h-[75px] bg-[#16607B]/30 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         <h1 className="text-3xl font-bold text-white">FidCo</h1>
//         <nav className="flex items-center gap-4 text-white text-sm">
//           <Link to="/" className="hover:text-orange-400">Home</Link>
//           <Link to="/menu" className="hover:text-orange-400">Explore</Link>
//           <Link to="/about" className="hover:text-orange-400">About</Link>
//           <WishlistSidebar visitorId={visitorId} />
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <section className="flex flex-col items-center justify-center text-center h-[80vh] bg-gradient-to-r from-[#16607B] to-[#0D3A4D] px-4">
//         <h2 className="text-4xl font-bold text-white">Your Workspace Awaits</h2>
//         <p className="mt-3 text-base text-gray-200 max-w-md">
//           Explore managed offices and coworking spaces tailored for you.
//         </p>
//         <Link
//           to="/menu"
//           className="mt-5 px-5 py-2 bg-orange-500 text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 transition"
//         >
//           Get Started
//         </Link>
//       </section>

//       {/* Features Section */}
//       <section className="py-12 px-4 grid grid-cols-2 gap-6 max-w-4xl mx-auto">
//         <div className="p-5 bg-white shadow-md rounded-2xl text-center">
//           <h3 className="text-lg font-bold text-[#16607B]">Managed Offices</h3>
//           <p className="mt-2 text-gray-600 text-sm">Move-in ready offices.</p>
//         </div>
//         <div className="p-5 bg-white shadow-md rounded-2xl text-center">
//           <h3 className="text-lg font-bold text-[#16607B]">Co-working Spaces</h3>
//           <p className="mt-2 text-gray-600 text-sm">Creative workspaces.</p>
//         </div>
//         <div className="p-5 bg-white shadow-md rounded-2xl text-center col-span-2">
//           <h3 className="text-lg font-bold text-[#16607B]">Virtual Offices</h3>
//           <p className="mt-2 text-gray-600 text-sm">Work remotely with presence.</p>
//         </div>
//       </section>
//     </div>
//   );
// }
