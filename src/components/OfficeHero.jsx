// OfficeHero.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import WishlistSidebar from "./WishlistSidebar";
import Cookies from "js-cookie";

export default function OfficeHero({ office, visitorId, onLoginRequired, onLogout }) {
  // const visitorId = Cookies.get("visitorId");
  const thumbnails = office.office.images?.length
    ? office.office.images
    : [
        "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
        "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
      ];

  const [heroImage, setHeroImage] = useState(thumbnails[0]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef(null);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  const handleThumbnailClick = (img) => {
    setHeroImage(img);
    setFirstLoad(false);
  };


// Update hero image when thumbnails change (new office)
useEffect(() => {
  setHeroImage(thumbnails[0]);
  setFirstLoad(true); // reset firstLoad overlay if you want
}, [thumbnails]);


  const scrollUp = () => {
    if (scrollRef.current) {
      const height = scrollRef.current.clientHeight;
      scrollRef.current.scrollBy({ top: -height, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      const height = scrollRef.current.clientHeight;
      scrollRef.current.scrollBy({ top: height, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowUp(el.scrollTop > 0);
    setShowDown(el.scrollTop + el.clientHeight < el.scrollHeight);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 2);

  return (
    <div className="relative w-full p-4 mt-0 bg-[#388fa0] rounded-b-xl">
      {/* Header Bar */}
      <div className="w-full h-[85px] bg-[#16607B]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
        <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
          <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
            FidWorx
          </h1>
        </div>

        <div className="flex items-center gap-6 text-sm text-white">
          <Link to="/" className="transition hover:text-orange-400">Home</Link>
          <Link to="/menu" className="transition hover:text-orange-400">Explore Spaces</Link>
          <Link to="/about" className="transition hover:text-orange-400">About Us</Link>

          {/* ✅ Pass both props to WishlistSidebar */}
          <WishlistSidebar
        visitorId={visitorId}       // ✅ now reactive
        onLoginRequired={onLoginRequired}  // only triggered on click
        onLogout={onLogout}
      />
        </div>
      </div>

      {/* Main Section */}
      <div className="relative w-full p-4 mt-15 top-3 bg-[white]/80 rounded-b-xl shadow-2xl shadow-black/40">
        <div className="flex gap-6">
          {/* Hero Image */}
          <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img
              key={heroImage}
              src={heroImage}
              alt="Main Office"
              className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
            />
            <div
              className={`absolute inset-0 transition-colors duration-700 ${
                firstLoad ? "bg-black/30" : "bg-black/10"
              }`}
            ></div>
          </div>

          {/* Thumbnail list */}
          <div className="relative flex-1 h-[400px]">
            {showUp && (
              <button
                onClick={scrollUp}
                className="absolute top-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60]"
              >
                <ChevronUp className="w-5 h-5 text-white" />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="grid h-full grid-cols-1 gap-4 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
            >
              {visibleThumbnails.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleThumbnailClick(img)}
                  className={`w-full h-[190px] rounded-lg overflow-hidden shadow cursor-pointer hover:scale-105 transition ${
                    heroImage === img ? "ring-4 ring-[#16607B]" : ""
                  }`}
                >
                  <img
                    src={img}
                    alt={`Office ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}

              {!showAll && thumbnails.length > 2 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="px-3 py-1 text-white bg-orange-500 rounded-md shadow-md hover:bg-orange-600"
                >
                  View More
                </button>
              )}
            </div>

            {showDown && (
              <button
                onClick={scrollDown}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60]"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








//=====>> Fixing isue

// // OfficeHero.jsx
// import { useState, useRef, useEffect } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import { Link } from "react-router-dom";
// import WishlistSidebar from "./WishlistSidebar";
// import Cookies from "js-cookie";

// export default function OfficeHero({ office, visitorId, onLoginRequired, onLogout }) {
//   // const visitorId = Cookies.get("visitorId");
//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);
//   const [showAll, setShowAll] = useState(false);
//   const scrollRef = useRef(null);
//   const [showUp, setShowUp] = useState(false);
//   const [showDown, setShowDown] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false);
//   };

//   const scrollUp = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: -height, behavior: "smooth" });
//     }
//   };

//   const scrollDown = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: height, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setShowUp(el.scrollTop > 0);
//     setShowDown(el.scrollTop + el.clientHeight < el.scrollHeight);
//   };

//   useEffect(() => {
//     handleScroll();
//   }, []);

//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 2);

//   return (
//     <div className="relative w-full p-4 mt-0 bg-[#388fa0] rounded-b-xl">
//       {/* Header Bar */}
//       <div className="w-full h-[85px] bg-[#16607B]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidWorx
//           </h1>
//         </div>

//         <div className="flex items-center gap-6 text-sm text-white">
//           <Link to="/" className="transition hover:text-orange-400">Home</Link>
//           <Link to="/menu" className="transition hover:text-orange-400">Explore Spaces</Link>
//           <Link to="/about" className="transition hover:text-orange-400">About Us</Link>

//           {/* ✅ Pass both props to WishlistSidebar */}
//           <WishlistSidebar
//         visitorId={visitorId}       // ✅ now reactive
//         onLoginRequired={onLoginRequired}  // only triggered on click
//         onLogout={onLogout}
//       />
//         </div>
//       </div>

//       {/* Main Section */}
//       <div className="relative w-full p-4 mt-15 top-3 bg-[white]/80 rounded-b-xl shadow-2xl shadow-black/40">
//         <div className="flex gap-6">
//           {/* Hero Image */}
//           <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
//             <img
//               key={heroImage}
//               src={heroImage}
//               alt="Main Office"
//               className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//             />
//             <div
//               className={`absolute inset-0 transition-colors duration-700 ${
//                 firstLoad ? "bg-black/30" : "bg-black/10"
//               }`}
//             ></div>
//           </div>

//           {/* Thumbnail list */}
//           <div className="relative flex-1 h-[400px]">
//             {showUp && (
//               <button
//                 onClick={scrollUp}
//                 className="absolute top-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60]"
//               >
//                 <ChevronUp className="w-5 h-5 text-white" />
//               </button>
//             )}

//             <div
//               ref={scrollRef}
//               onScroll={handleScroll}
//               className="grid h-full grid-cols-1 gap-4 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
//             >
//               {visibleThumbnails.map((img, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => handleThumbnailClick(img)}
//                   className={`w-full h-[190px] rounded-lg overflow-hidden shadow cursor-pointer hover:scale-105 transition ${
//                     heroImage === img ? "ring-4 ring-[#16607B]" : ""
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Office ${idx + 1}`}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//               ))}

//               {!showAll && thumbnails.length > 2 && (
//                 <button
//                   onClick={() => setShowAll(true)}
//                   className="px-3 py-1 text-white bg-orange-500 rounded-md shadow-md hover:bg-orange-600"
//                 >
//                   View More
//                 </button>
//               )}
//             </div>

//             {showDown && (
//               <button
//                 onClick={scrollDown}
//                 className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60]"
//               >
//                 <ChevronDown className="w-5 h-5 text-white" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









//=========>>> Updating the Authmodel open function


// import { useState, useRef, useEffect } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import { Link } from "react-router-dom";  
// import WishlistSidebar from "./WishlistSidebar";
// import Cookies from "js-cookie";

// export default function OfficeHero({ office }) {
//   const visitorId = Cookies.get("visitorId");
//   // Prefer office images if available, else fallback to default thumbnails
//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);
//   const [showAll, setShowAll] = useState(false);

//   const scrollRef = useRef(null);
//   const [showUp, setShowUp] = useState(false);
//   const [showDown, setShowDown] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false);
//   };

//   // Scroll handlers
//   const scrollUp = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: -height, behavior: "smooth" });
//     }
//   };

//   const scrollDown = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: height, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setShowUp(el.scrollTop > 0);
//     setShowDown(el.scrollTop + el.clientHeight < el.scrollHeight);
//   };

//   useEffect(() => {
//     handleScroll(); // run once on mount
//   }, []);

//   // Decide what to show
//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 2);

//   return (
//     <div className="relative w-full p-4 mt-0 bg-[#388fa0] rounded-b-xl">
//       {/* Header Bar */}
//       <div className="w-full h-[85px] bg-[#16607B]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-4xl font-bold text-center text-white glow-text drop-shadow-lg">
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

//       {/* Main Section */}
//       <div className="relative w-full p-4 mt-15 top-3 bg-[white]/80 rounded-b-xl shadow-2xl shadow-black/40">

//         <div className="flex gap-6">
//           {/* Hero Image */}
//           <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
//             <img
//               key={heroImage}
//               src={heroImage}
//               alt="Main Office"
//               className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//             />

//             {/* Overlay */}
//             <div
//               className={`absolute inset-0 transition-colors duration-700 ${
//                 firstLoad ? "bg-black/30" : "bg-black/10"
//               }`}
//             ></div>
//           </div>

//           {/* Thumbnail Grid (Vertical + Scrollable with Up/Down buttons) */}
//           <div className="relative flex-1 h-[400px]">
//             {/* Up Button */}
//             {showUp && (
//               <button
//                 onClick={scrollUp}
//                 className="absolute top-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//               >
//                 <ChevronUp className="w-5 h-5 text-white" />
//               </button>
//             )}

//             <div
//               ref={scrollRef}
//               onScroll={handleScroll}
//               className="grid h-full grid-cols-1 gap-4 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
//             >
//               {visibleThumbnails.map((img, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => handleThumbnailClick(img)}
//                   className={`w-full h-[190px] rounded-lg overflow-hidden shadow cursor-pointer 
//                     hover:scale-105 transition ${
//                       heroImage === img ? "ring-4 ring-[#16607B]" : ""
//                     }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Office ${idx + 1}`}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//               ))}

//               {/* "View More" button after 2 images if more exist */}
//               {!showAll && thumbnails.length > 2 && (
//                 <button
//                   onClick={() => setShowAll(true)}
//                   className="px-3 py-1 text-white transition bg-orange-500 rounded-md shadow-md hover:bg-orange-600"
//                 >
//                   View More
//                 </button>
//               )}
//             </div>

//             {/* Down Button */}
//             {showDown && (
//               <button
//                 onClick={scrollDown}
//                 className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//               >
//                 <ChevronDown className="w-5 h-5 text-white" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








//==================+>> working on navigate


// import { useState, useRef, useEffect } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import WishlistSidebar from "./WishlistSidebar";
// import Cookies from "js-cookie";

// export default function OfficeHero({ office }) {
//   const visitorId = Cookies.get("visitorId");
//   // Prefer office images if available, else fallback to default thumbnails
//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);
//   const [showAll, setShowAll] = useState(false);

//   const scrollRef = useRef(null);
//   const [showUp, setShowUp] = useState(false);
//   const [showDown, setShowDown] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false);
//   };

//   // Scroll handlers
//   const scrollUp = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: -height, behavior: "smooth" });
//     }
//   };

//   const scrollDown = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: height, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setShowUp(el.scrollTop > 0);
//     setShowDown(el.scrollTop + el.clientHeight < el.scrollHeight);
//   };

//   useEffect(() => {
//     handleScroll(); // run once on mount
//   }, []);

//   // Decide what to show
//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 2);

//   return (
//     <div className="relative w-full p-4 mt-0 bg-[#7b7a7a] rounded-b-xl">
//       {/* Header Bar */}
//       <div className="w-full h-[85px] bg-[#16607B]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidCo
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//           <button className="transition hover:text-orange-400">Home</button>
//           <button className="transition hover:text-orange-400">About Us</button>
//           <WishlistSidebar visitorId={{visitorId}}/>
//         </div>
//       </div>

//       {/* Main Section */}
//       <div className="relative w-full p-4 mt-15 top-3 bg-[white]/80 rounded-b-xl shadow-2xl shadow-black/40">

//         <div className="flex gap-6">
//           {/* Hero Image */}
//           <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
//             <img
//               key={heroImage}
//               src={heroImage}
//               alt="Main Office"
//               className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//             />

//             {/* Overlay */}
//             <div
//               className={`absolute inset-0 transition-colors duration-700 ${
//                 firstLoad ? "bg-black/30" : "bg-black/10"
//               }`}
//             ></div>
//           </div>

//           {/* Thumbnail Grid (Vertical + Scrollable with Up/Down buttons) */}
//           <div className="relative flex-1 h-[400px]">
//             {/* Up Button */}
//             {showUp && (
//               <button
//                 onClick={scrollUp}
//                 className="absolute top-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//               >
//                 <ChevronUp className="w-5 h-5 text-white" />
//               </button>
//             )}

//             <div
//               ref={scrollRef}
//               onScroll={handleScroll}
//               className="grid h-full grid-cols-1 gap-4 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
//             >
//               {visibleThumbnails.map((img, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => handleThumbnailClick(img)}
//                   className={`w-full h-[190px] rounded-lg overflow-hidden shadow cursor-pointer 
//                     hover:scale-105 transition ${
//                       heroImage === img ? "ring-4 ring-[#16607B]" : ""
//                     }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Office ${idx + 1}`}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//               ))}

//               {/* "View More" button after 2 images if more exist */}
//               {!showAll && thumbnails.length > 2 && (
//                 <button
//                   onClick={() => setShowAll(true)}
//                   className="px-3 py-1 text-white transition bg-orange-500 rounded-md shadow-md hover:bg-orange-600"
//                 >
//                   View More
//                 </button>
//               )}
//             </div>

//             {/* Down Button */}
//             {showDown && (
//               <button
//                 onClick={scrollDown}
//                 className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//               >
//                 <ChevronDown className="w-5 h-5 text-white" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








//=====================================>>>> Ui chnges


// import { useState, useRef, useEffect } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";

// export default function OfficeHero({ office }) {
//   // Prefer office images if available, else fallback to default thumbnails
//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);
//   const [showAll, setShowAll] = useState(false);

//   const scrollRef = useRef(null);
//   const [showUp, setShowUp] = useState(false);
//   const [showDown, setShowDown] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false);
//   };

//   // Scroll handlers
//   const scrollUp = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: -height, behavior: "smooth" });
//     }
//   };

//   const scrollDown = () => {
//     if (scrollRef.current) {
//       const height = scrollRef.current.clientHeight;
//       scrollRef.current.scrollBy({ top: height, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setShowUp(el.scrollTop > 0);
//     setShowDown(el.scrollTop + el.clientHeight < el.scrollHeight);
//   };

//   useEffect(() => {
//     handleScroll(); // run once on mount
//   }, []);

//   // Decide what to show
//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 2);

//   return (
//     <div className="relative w-full p-4 mt-0 bg-[#b0b0b0] rounded-b-xl">
//       {/* Header Bar */}
//       <div className="w-full h-[85px] bg-[[#a9a9a9]]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidCo
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//           <button className="transition hover:text-orange-400">Home</button>
//           <button className="transition hover:text-orange-400">About Us</button>
//           <button className="transition hover:text-orange-400">User</button>
//         </div>
//       </div>

//       {/* Main Section */}
//       <div className="relative w-full p-4 mt-10 top-3 bg-[#9b9a9aef] rounded-b-xl shadow-2xl shadow-black/40">

//         <div className="flex gap-6">
//           {/* Hero Image */}
//           <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
//             <img
//               key={heroImage}
//               src={heroImage}
//               alt="Main Office"
//               className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//             />

//             {/* Overlay */}
//             <div
//               className={`absolute inset-0 transition-colors duration-700 ${
//                 firstLoad ? "bg-black/30" : "bg-black/10"
//               }`}
//             ></div>
//           </div>

//           {/* Thumbnail Grid (Vertical + Scrollable with Up/Down buttons) */}
//           <div className="relative flex-1 h-[400px]">
//             {/* Up Button */}
//             {showUp && (
//               <button
//                 onClick={scrollUp}
//                 className="absolute top-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//               >
//                 <ChevronUp className="w-5 h-5 text-white" />
//               </button>
//             )}

//             <div
//               ref={scrollRef}
//               onScroll={handleScroll}
//               className="grid h-full grid-cols-1 gap-4 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
//             >
//               {visibleThumbnails.map((img, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => handleThumbnailClick(img)}
//                   className={`w-full h-[190px] rounded-lg overflow-hidden shadow cursor-pointer 
//                     hover:scale-105 transition ${
//                       heroImage === img ? "ring-4 ring-orange-400" : ""
//                     }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Office ${idx + 1}`}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//               ))}

//               {/* "View More" button after 2 images if more exist */}
//               {!showAll && thumbnails.length > 2 && (
//                 <button
//                   onClick={() => setShowAll(true)}
//                   className="px-3 py-1 text-white transition bg-orange-500 rounded-md shadow-md hover:bg-orange-600"
//                 >
//                   View More
//                 </button>
//               )}
//             </div>

//             {/* Down Button */}
//             {showDown && (
//               <button
//                 onClick={scrollDown}
//                 className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//               >
//                 <ChevronDown className="w-5 h-5 text-white" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









//==========================================>>>>> Verticle scroll

// import { useState } from "react";

// export default function OfficeHero({ office }) {
//   // Prefer office images if available, else fallback to default thumbnails
//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);
//   const [showAll, setShowAll] = useState(false);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false);
//   };

//   // Decide what to show
//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 2);

//   return (
//     <div className="relative w-full p-4 mt-0 bg-[#b0b0b0] rounded-b-xl">
//       {/* Header Bar */}
//       <div className="w-full h-[85px] bg-[[#a9a9a9]]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//         {/* Logo */}
//         <div className="z-10 text-lg font-bold tracking-wide text-white left-4">
//           <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//             FidCo
//           </h1>
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center gap-6 text-sm text-white">
//           <button className="transition hover:text-orange-400">Home</button>
//           <button className="transition hover:text-orange-400">About Us</button>
//           <button className="transition hover:text-orange-400">User</button>
//         </div>
//       </div>

//       {/* Main Section */}
//       <div className="relative w-full p-4 mt-10 top-3 bg-[#9b9a9aef] rounded-b-xl">
//         <div className="flex gap-6">
//           {/* Hero Image */}
//           <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
//             <img
//               key={heroImage}
//               src={heroImage}
//               alt="Main Office"
//               className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//             />

//             {/* Overlay */}
//             <div
//               className={`absolute inset-0 transition-colors duration-700 ${
//                 firstLoad ? "bg-black/30" : "bg-black/10"
//               }`}
//             ></div>
//           </div>

//           {/* Thumbnail Grid (Vertical + Scrollable) */}
//           <div className="flex-1 h-[400px] overflow-y-auto grid grid-cols-1 gap-4 pr-2 relative">
//             {visibleThumbnails.map((img, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => handleThumbnailClick(img)}
//                 className={`w-full h-[190px] rounded-lg overflow-hidden shadow cursor-pointer 
//                   hover:scale-105 transition ${
//                     heroImage === img ? "ring-4 ring-orange-400" : ""
//                   }`}
//               >
//                 <img
//                   src={img}
//                   alt={`Office ${idx + 1}`}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//             ))}

//             {/* "View More" button after 2 images if more exist */}
//             {!showAll && thumbnails.length > 2 && (
//               <button
//                 onClick={() => setShowAll(true)}
//                 className="absolute px-3 py-1 text-white transition transform -translate-x-1/2 bg-orange-500 rounded-md shadow-md bottom-2 left-1/2 hover:bg-orange-600"
//               >
//                 View More
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










//=======================>> getting data 


// import { useState } from "react";

// export default function OfficeHero({ office }) {
//   // Prefer office images if available, else fallback to default thumbnails
//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg", 
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false);
//   };
//   console.log("office data ",office)
//   console.log("Images array:", office.office.images);
//   console.log("@@@@@@@",thumbnails)

//   return (
// <div className="relative w-full p-4 mt-0 bg-[#b0b0b0] rounded-b-xl">
//   {/* Floating Brand Logo */}
// {/* Header Bar */}
// <div className="w-full h-[85px] bg-[[#a9a9a9]]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//   {/* Logo */}
//   <div className="z-10 text-lg font-bold tracking-wide text-white left-4" >
//     <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//       FidCo
//     </h1>
//   </div>
 

//   {/* Future Navigation Items */}
//   <div className="flex items-center gap-6 text-sm text-white">
//     <button className="transition hover:text-orange-400">Home</button>
//     <button className="transition hover:text-orange-400">About Us</button>
//     <button className="transition hover:text-orange-400">User</button>
//   </div>
// </div>

// {/* Main Section */}
// <div className="relative w-full p-4 mt-10 top-3 bg-[#9b9a9aef] rounded-b-xl">
//   {/* Flex Layout: Hero (left) + Grid (right) */}
//   <div className="flex gap-6">
//     {/* Hero Image */}
//     <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
//       <img
//         key={heroImage}
//         src={heroImage}
//         alt="Main Office"
//         className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//       />

//       {/* Overlay */}
//       <div
//         className={`absolute inset-0 transition-colors duration-700 ${
//           firstLoad ? "bg-black/30" : "bg-black/10"
//         }`}
//       ></div>
//     </div>

//     {/* Thumbnail Grid */}
//     <div className="flex-1 h-[400px] grid grid-cols-3 gap-4 pr-2">
//     {thumbnails.map((img, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => handleThumbnailClick(img)}
//                 className={`w-full rounded-lg overflow-hidden shadow cursor-pointer 
//                   hover:scale-105 transition ${
//                     heroImage === img ? "ring-4 ring-orange-400" : ""
//                   }`}
//               >
//                 <img
//                   src={img}
//                   alt={`Office ${idx + 1}`}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//             ))}
//     </div>
//   </div>
// </div>
// </div>
//   );
// }








//===============================>> without bind data


// import { useState } from "react";

// export default function OfficeHero({ office, city }) {
//   const thumbnails = [
//     "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg", // default hero
//     "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//     "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//     "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//     "https://th.bing.com/th/id/OIP.Rl1E59yqaM6ODSfBhA7ITQHaEe?w=274&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
//     "https://tse4.mm.bing.net/th/id/OIP.6L76gHQvyYeUHVKO72Zd2AAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
//   ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false); // remove overlay intensity after first interaction
//   };

//   return (
// <div className="relative w-full p-4 mt-0 bg-[#b0b0b0] rounded-b-xl">
//   {/* Floating Brand Logo */}
//   {/* <div className="absolute z-30 top-4 left-4">
//     <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//       FidCo
//     </h1>
//   </div> */}

//   {/* Floating Brand Logo */}
// {/* Header Bar */}
// <div className="w-full h-[85px] bg-[[#a9a9a9]]/60 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
//   {/* Logo */}
//   {/* <div className="absolute z-10 top-4 left-4">
//           <h1 className="text-6xl font-bold text-center text-white glow-text">
//             FidCo
//           </h1>
//         </div> */}
//   <div className="z-10 text-lg font-bold tracking-wide text-white left-4" >
//     <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//       FidCo
//     </h1>
//   </div>
 

//   {/* Future Navigation Items */}
//   <div className="flex items-center gap-6 text-sm text-white">
//     <button className="transition hover:text-orange-400">Home</button>
//     <button className="transition hover:text-orange-400">About Us</button>
//     <button className="transition hover:text-orange-400">User</button>
//   </div>
// </div>

// {/* Main Section */}
// <div className="relative w-full p-4 mt-10 top-3 bg-[#9b9a9aef] rounded-b-xl">
//   {/* Flex Layout: Hero (left) + Grid (right) */}
//   <div className="flex gap-6">
//     {/* Hero Image */}
//     <div className="relative w-[800px] h-[400px] rounded-xl overflow-hidden shadow-lg">
//       <img
//         key={heroImage}
//         src={heroImage}
//         alt="Main Office"
//         className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//       />

//       {/* Overlay */}
//       <div
//         className={`absolute inset-0 transition-colors duration-700 ${
//           firstLoad ? "bg-black/30" : "bg-black/10"
//         }`}
//       ></div>

//       {/* Hero Title */}
//       <h1
//         className={`absolute text-3xl font-bold bottom-6 left-6 transition-all duration-700 ${
//           firstLoad ? "text-white" : "text-gray-100 drop-shadow"
//         }`}
//       >
//         {office?.buildingName}{" "}
//         <span className="text-orange-400">{city}</span>
//       </h1>
//     </div>

//     {/* Thumbnail Grid */}
//     <div className="flex-1 h-[400px] grid grid-cols-3 gap-4 pr-2">
//       {thumbnails.map((img, idx) => (
//         <div
//           key={idx}
//           onClick={() => handleThumbnailClick(img)}
//           className={`w-full rounded-lg overflow-hidden shadow cursor-pointer 
//             hover:scale-105 transition ${
//               heroImage === img ? "ring-4 ring-orange-400" : ""
//             }`}
//         >
//           <img
//             src={img}
//             alt={`Office ${idx + 1}`}
//             className="object-cover w-full h-full"
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>
// </div>
//   );
// }








//===========================================>>>>>> Old

// import { useState } from "react";

// export default function OfficeHero({ office, city }) {
//   const thumbnails = [
//     "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg", // default hero
//     "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//     "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//     "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//     "https://th.bing.com/th/id/OIP.Rl1E59yqaM6ODSfBhA7ITQHaEe?w=274&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
//     "https://tse4.mm.bing.net/th/id/OIP.6L76gHQvyYeUHVKO72Zd2AAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
//   ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false); // remove overlay intensity after first interaction
//   };

//   return (
// <div className="relative w-full max-w-[1500px] mx-auto mt-0 bg-black rounded-xl p-4">
//   {/* Floating Brand Logo */}
//   <div className="absolute z-30 top-4 left-4">
//     <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//       FidCo
//     </h1>
//   </div>

//   {/* Flex Layout: Hero (left) + Grid (right) */}
//   <div className="flex gap-6">
//     {/* Hero Image */}
//     <div className="relative w-[900px] h-[500px] rounded-xl overflow-hidden shadow-lg">
//       <img
//         key={heroImage}
//         src={heroImage}
//         alt="Main Office"
//         className="object-cover w-full h-full transition-opacity duration-700 opacity-100"
//       />

//       {/* Overlay */}
//       <div
//         className={`absolute inset-0 transition-colors duration-700 ${
//           firstLoad ? "bg-black/30" : "bg-black/10"
//         }`}
//       ></div>

//       {/* Hero Title */}
//       <h1
//         className={`absolute text-3xl font-bold bottom-6 left-6 transition-all duration-700 ${
//           firstLoad ? "text-white" : "text-gray-100 drop-shadow"
//         }`}
//       >
//         {office?.buildingName}{" "}
//         <span className="text-orange-400">{city}</span>
//       </h1>
//     </div>

//     {/* Thumbnail Grid (Scrollable) */}
//     <div className="flex-1 h-[300px]  grid grid-cols-3 gap-4 pr-2">
//       {thumbnails.map((img, idx) => (
//         <div
//           key={idx}
//           onClick={() => handleThumbnailClick(img)}
//           className={`w-full h-[100px] rounded-lg overflow-hidden shadow cursor-pointer 
//             hover:scale-105 transition ${
//               heroImage === img ? "ring-4 ring-orange-400" : ""
//             }`}
//         >
//           <img
//             src={img}
//             alt={`Office ${idx + 1}`}
//             className="object-cover w-full h-full"
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

//   );
// }















//===============>>>>

// import { useState } from "react";

// export default function OfficeHero({ office, city }) {
//   const thumbnails = [
//     "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg", // default hero
//     "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//     "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//     "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//     "https://th.bing.com/th/id/OIP.Rl1E59yqaM6ODSfBhA7ITQHaEe?w=274&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
//     "https://tse4.mm.bing.net/th/id/OIP.6L76gHQvyYeUHVKO72Zd2AAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
//   ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [firstLoad, setFirstLoad] = useState(true);

//   const handleThumbnailClick = (img) => {
//     setHeroImage(img);
//     setFirstLoad(false); // remove overlay after first interaction
//   };

//   return (
//     <div className="relative w-full max-w-[1350px] mx-auto mt-6">
//       {/* Floating Brand Logo */}
//       <div className="absolute z-30 top-4 left-4">
//         <h1 className="text-6xl font-bold text-center text-white glow-text drop-shadow-lg">
//           FidCo
//         </h1>
//       </div>

//       {/* Hero Image */}
//       <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
//         <img
//           src={heroImage}
//           alt="Main Office"
//           className="object-cover w-full h-full transition-all duration-500"
//         />

//         {/* Show overlay only on first load */}
//         {firstLoad && <div className="absolute inset-0 bg-black/20"></div>}

//         {/* Hero Title */}
//         {firstLoad && (
//           <h1 className="absolute text-3xl font-bold text-white bottom-6 left-6">
//             {office?.buildingName}{" "}
//             <span className="text-orange-400">{city}</span>
//           </h1>
//         )}
//       </div>

//       {/* Thumbnail Grid */}
//       <div className="grid grid-cols-6 gap-4 mt-4">
//         {thumbnails.map((img, idx) => (
//           <div
//             key={idx}
//             onClick={() => handleThumbnailClick(img)}
//             className={`w-full h-[100px] rounded-lg overflow-hidden shadow cursor-pointer 
//               hover:scale-105 transition ${
//                 heroImage === img ? "ring-4 ring-orange-400" : ""
//               }`}
//           >
//             <img
//               src={img}
//               alt={`Office ${idx + 1}`}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
