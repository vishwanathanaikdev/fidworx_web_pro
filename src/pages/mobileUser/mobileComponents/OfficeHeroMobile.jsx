import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import WishlistSidebar from "../../../components/WishlistSidebar";
import Cookies from "js-cookie";
import { FiMenu, FiX } from "react-icons/fi";



export default function OfficeHeroMobile({ office, visitorId, onLoginRequired, onLogout }) {
  // const visitorId = Cookies.get("visitorId");
  const [heroImage, setHeroImage] = useState(
    office.office.images?.[0] ||
      "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
  );
  const [showAll, setShowAll] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Update heroImage whenever office changes
  useEffect(() => {
    setHeroImage(
      office.office.images?.[0] ||
        "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
    );
  }, [office]);

  const thumbnails = office.office.images?.length
    ? office.office.images
    : [
        "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
        "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
      ];

  const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 3);

  return (
    <div className="w-full bg-[#fffffff0]">
      {/* Mobile Header */}
      <div className="w-full h-[70px] flex items-center justify-between px-4 bg-[#16607B]/80 text-white fixed top-0 z-50">
      <h1 className="text-2xl font-bold text-white glow-text drop-shadow-lg">
      FidWorx
     </h1>

        <div className="flex items-center gap-4">
        <WishlistSidebar
        visitorId={visitorId}       // ✅ now reactive
        onLoginRequired={onLoginRequired}  // only triggered on click
        onLogout={onLogout}
      />
        </div>
      </div>

      {/* Hero Image */}
      <div className="mt-[70px]  relative w-full h-[220px] shadow-lg">
        <img
          key={heroImage}
          src={heroImage}
          alt="Main Office"
          className="object-cover w-full h-full rounded-b-xl transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/10 rounded-b-xl"></div>
      </div>

      {/* Thumbnail Scroll */}
      <div className="flex gap-2 overflow-x-auto mt-2 px-4 pb-2">
        {visibleThumbnails.map((img, idx) => (
          <div
            key={idx}
            className={`w-[90px] h-[60px] rounded-md overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
              heroImage === img ? "border-orange-500" : "border-gray-200"
            }`}
            onClick={() => setHeroImage(img)}
          >
            <img
              src={img}
              alt={`Thumb ${idx + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}

        {!showAll && thumbnails.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center justify-center w-[90px] h-[60px] bg-orange-500 text-white rounded-md text-xs font-bold flex-shrink-0"
          >
            View More
          </button>
        )}
      </div>
    </div>
  );
}








//================>>> Old one for mobile wushlist update 


// import { useState,useEffect } from "react";
// import { Link } from "react-router-dom";
// import WishlistSidebar from "../../../components/WishlistSidebar";
// import Cookies from "js-cookie";
// import { FiMenu, FiX } from "react-icons/fi";



// export default function OfficeHeroMobile({ office }) {
//   const visitorId = Cookies.get("visitorId");
//   const [heroImage, setHeroImage] = useState(
//     office.office.images?.[0] ||
//       "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
//   );
//   const [showAll, setShowAll] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   // Update heroImage whenever office changes
//   useEffect(() => {
//     setHeroImage(
//       office.office.images?.[0] ||
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
//     );
//   }, [office]);

//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 3);

//   return (
//     <div className="w-full bg-[#fffffff0]">
//       {/* Mobile Header */}
//       <div className="w-full h-[60px] flex items-center justify-between px-4 bg-[#16607B]/80 text-white fixed top-0 z-50">
//         <h1 className="text-xl font-bold">FidWorx</h1>

//         <div className="flex items-center gap-4">
//           <WishlistSidebar visitorId={visitorId} />
//           <button
//             className="text-white text-2xl"
//             onClick={() => setIsDrawerOpen(true)}
//           >
//             <FiMenu />
//           </button>
//         </div>
//       </div>

//       {/* Hero Image */}
//       <div className="mt-[60px]  relative w-full h-[220px] shadow-lg">
//         <img
//           key={heroImage}
//           src={heroImage}
//           alt="Main Office"
//           className="object-cover w-full h-full rounded-b-xl transition-opacity duration-500"
//         />
//         <div className="absolute inset-0 bg-black/10 rounded-b-xl"></div>
//       </div>

//       {/* Thumbnail Scroll */}
//       <div className="flex gap-2 overflow-x-auto mt-2 px-4 pb-2">
//         {visibleThumbnails.map((img, idx) => (
//           <div
//             key={idx}
//             className={`w-[90px] h-[60px] rounded-md overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
//               heroImage === img ? "border-orange-500" : "border-gray-200"
//             }`}
//             onClick={() => setHeroImage(img)}
//           >
//             <img
//               src={img}
//               alt={`Thumb ${idx + 1}`}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ))}

//         {!showAll && thumbnails.length > 3 && (
//           <button
//             onClick={() => setShowAll(true)}
//             className="flex items-center justify-center w-[90px] h-[60px] bg-orange-500 text-white rounded-md text-xs font-bold flex-shrink-0"
//           >
//             View More
//           </button>
//         )}
//       </div>

//       {/* Navigation Drawer */}
//       {isDrawerOpen && (
//         <div className="fixed inset-0 bg-black/60 z-50">
//           <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//             <button
//               className="text-2xl text-gray-700 mb-6"
//               onClick={() => setIsDrawerOpen(false)}
//             >
//               <FiX />
//             </button>

//             <nav className="flex flex-col gap-6 text-lg font-semibold text-black">
//               <Link to="/" onClick={() => setIsDrawerOpen(false)}>
//                 Home
//               </Link>
//               <Link to="/menu" onClick={() => setIsDrawerOpen(false)}>
//                 Explore Spaces
//               </Link>
//               <Link to="/about" onClick={() => setIsDrawerOpen(false)}>
//                 About Us
//               </Link>
//             </nav>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









//.......>>>>=====>> Old 

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import WishlistSidebar from "../../../components/WishlistSidebar";
// import Cookies from "js-cookie";
// import { FiMenu, FiX } from "react-icons/fi";

// export default function OfficeHeroMobile({ office }) {
//   const visitorId = Cookies.get("visitorId");
//   const [heroImage, setHeroImage] = useState(
//     office.office.images?.[0] ||
//       "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
//   );
//   const [showAll, setShowAll] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 3);

//   return (
//     <div className="w-full bg-[#fffffff0]">
//       {/* Mobile Header */}
//       <div className="w-full h-[60px] flex items-center justify-between px-4 bg-[#16607B]/80 text-white fixed top-0 z-50">
//         <h1 className="text-xl font-bold">FidWorx</h1>

//         <div className="flex items-center gap-4">
//           <WishlistSidebar visitorId={visitorId} />
//           <button
//             className="text-white text-2xl"
//             onClick={() => setIsDrawerOpen(true)}
//           >
//             <FiMenu />
//           </button>
//         </div>
//       </div>

//       {/* Hero Image */}
//       <div className="mt-[60px]  relative w-full h-[220px] shadow-lg">
//         <img
//           key={heroImage}
//           src={heroImage}
//           alt="Main Office"
//           className="object-cover w-full h-full rounded-b-xl transition-opacity duration-500"
//         />
//         <div className="absolute inset-0 bg-black/10 rounded-b-xl"></div>
//       </div>

//       {/* Thumbnail Scroll */}
//       <div className="flex gap-2 overflow-x-auto mt-2 px-4 pb-2">
//         {visibleThumbnails.map((img, idx) => (
//           <div
//             key={idx}
//             className={`w-[90px] h-[60px] rounded-md overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
//               heroImage === img ? "border-orange-500" : "border-gray-200"
//             }`}
//             onClick={() => setHeroImage(img)}
//           >
//             <img
//               src={img}
//               alt={`Thumb ${idx + 1}`}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ))}

//         {!showAll && thumbnails.length > 3 && (
//           <button
//             onClick={() => setShowAll(true)}
//             className="flex items-center justify-center w-[90px] h-[60px] bg-orange-500 text-white rounded-md text-xs font-bold flex-shrink-0"
//           >
//             View More
//           </button>
//         )}
//       </div>

//       {/* Navigation Drawer */}
//       {isDrawerOpen && (
//         <div className="fixed inset-0 bg-black/60 z-50">
//           <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//             <button
//               className="text-2xl text-gray-700 mb-6"
//               onClick={() => setIsDrawerOpen(false)}
//             >
//               <FiX />
//             </button>

//             <nav className="flex flex-col gap-6 text-lg font-semibold text-black">
//               <Link to="/" onClick={() => setIsDrawerOpen(false)}>
//                 Home
//               </Link>
//               <Link to="/menu" onClick={() => setIsDrawerOpen(false)}>
//                 Explore Spaces
//               </Link>
//               <Link to="/about" onClick={() => setIsDrawerOpen(false)}>
//                 About Us
//               </Link>
//             </nav>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








//=========>>> Old 3


// import { useState } from "react";
// import { Link } from "react-router-dom";
// import WishlistSidebar from "../../../components/WishlistSidebar";
// import Cookies from "js-cookie";
// import { FiMenu, FiX } from "react-icons/fi";

// export default function OfficeHeroMobile({ office }) {
//   const visitorId = Cookies.get("visitorId");
//   const [heroImage, setHeroImage] = useState(
//     office.office.images?.[0] ||
//       "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg"
//   );
//   const [showAll, setShowAll] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 3);

//   return (
//     <div className="w-full bg-[#fffffff0] min-h-screen">
//       {/* Mobile Header */}
//       <div className="w-full h-[60px] flex items-center justify-between px-4 bg-[#16607B]/80 text-white fixed top-0 z-50">
//         <h1 className="text-xl font-bold">FidWorx</h1>

//         <div className="flex items-center gap-4">
//           <WishlistSidebar visitorId={visitorId} />
//           <button
//             className="text-white text-2xl"
//             onClick={() => setIsDrawerOpen(true)}
//           >
//             <FiMenu />
//           </button>
//         </div>
//       </div>

//       {/* Hero Image */}
//       <div className="mt-[60px] relative w-full h-[220px] shadow-lg">
//         <img
//           key={heroImage}
//           src={heroImage}
//           alt="Main Office"
//           className="object-cover w-full h-full rounded-b-xl transition-opacity duration-500"
//         />
//         <div className="absolute inset-0 bg-black/10 rounded-b-xl"></div>
//       </div>

//       {/* Thumbnail Scroll */}
//       <div className="flex gap-2 overflow-x-auto mt-2 px-4 pb-2">
//         {visibleThumbnails.map((img, idx) => (
//           <div
//             key={idx}
//             className={`w-[90px] h-[60px] rounded-md overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
//               heroImage === img ? "border-orange-500" : "border-gray-200"
//             }`}
//             onClick={() => setHeroImage(img)}
//           >
//             <img
//               src={img}
//               alt={`Thumb ${idx + 1}`}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ))}

//         {!showAll && thumbnails.length > 3 && (
//           <button
//             onClick={() => setShowAll(true)}
//             className="flex items-center justify-center w-[90px] h-[60px] bg-orange-500 text-white rounded-md text-xs font-bold flex-shrink-0"
//           >
//             View More
//           </button>
//         )}
//       </div>

//       {/* Navigation Drawer */}
//       {isDrawerOpen && (
//         <div className="fixed inset-0 bg-black/60 z-50">
//           <div className="absolute top-0 right-0 w-3/4 h-full bg-white p-6 shadow-lg">
//             <button
//               className="text-2xl text-gray-700 mb-6"
//               onClick={() => setIsDrawerOpen(false)}
//             >
//               <FiX />
//             </button>

//             <nav className="flex flex-col gap-6 text-lg font-semibold text-black">
//               <Link to="/" onClick={() => setIsDrawerOpen(false)}>
//                 Home
//               </Link>
//               <Link to="/menu" onClick={() => setIsDrawerOpen(false)}>
//                 Explore Spaces
//               </Link>
//               <Link to="/about" onClick={() => setIsDrawerOpen(false)}>
//                 About Us
//               </Link>
//             </nav>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






//========>>> Old 01

// import { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// // import WishlistSidebar from "./WishlistSidebar";
// import WishlistSidebar from "../../../components/WishlistSidebar";
// import Cookies from "js-cookie";

// export default function OfficeHeroMobile({ office }) {
//   const visitorId = Cookies.get("visitorId");

//   // Use office images or fallback
//   const thumbnails = office.office.images?.length
//     ? office.office.images
//     : [
//         "https://cdn.pixabay.com/photo/2015/04/20/06/46/office-730681_1280.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/26/interior-4406027_960_720.jpg",
//         "https://cdn.pixabay.com/photo/2019/08/14/15/27/interior-4406034_1280.jpg",
//         "https://cdn.pixabay.com/photo/2020/03/23/07/59/office-4959787_1280.jpg",
//       ];

//   const [heroImage, setHeroImage] = useState(thumbnails[0]);
//   const [showAll, setShowAll] = useState(false);

//   const handleThumbnailClick = (img) => setHeroImage(img);

//   // Only show first 3 thumbnails unless "View More" clicked
//   const visibleThumbnails = showAll ? thumbnails : thumbnails.slice(0, 3);

//   return (
//     <div className="w-full bg-[#388fa0]">
//       {/* Mobile Header */}
//       <div className="w-full h-[60px] flex items-center justify-between px-4 bg-[#16607B]/80 text-white fixed top-0 z-50">
//         <h1 className="text-xl font-bold">FidWorx</h1>
//         <div className="flex items-center gap-4">
//           <WishlistSidebar visitorId={visitorId} />
//         </div>
//       </div>

//       {/* Hero Image */}
//       <div className="mt-[60px] relative w-full h-[220px] shadow-lg">
//         <img
//           key={heroImage}
//           src={heroImage}
//           alt="Main Office"
//           className="object-cover w-full h-full rounded-b-xl transition-opacity duration-500"
//         />
//         <div className="absolute inset-0 bg-black/10 rounded-b-xl"></div>
//       </div>

//       {/* Thumbnail Scroll */}
//       <div className="flex gap-2 overflow-x-auto mt-2 px-4 pb-2">
//         {visibleThumbnails.map((img, idx) => (
//           <div
//             key={idx}
//             className={`w-[90px] h-[60px] rounded-md overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
//               heroImage === img ? "border-orange-500" : "border-gray-200"
//             }`}
//             onClick={() => handleThumbnailClick(img)}
//           >
//             <img
//               src={img}
//               alt={`Thumb ${idx + 1}`}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ))}

//         {/* View More Button */}
//         {!showAll && thumbnails.length > 3 && (
//           <button
//             onClick={() => setShowAll(true)}
//             className="flex items-center justify-center w-[90px] h-[60px] bg-orange-500 text-white rounded-md text-xs font-bold flex-shrink-0"
//           >
//             View More
//           </button>
//         )}
//       </div>

//       {/* Navigation Links (Optional for Mobile) */}
//       <div className="flex justify-around bg-white py-2 px-4 shadow-md mt-2">
//         <Link to="/" className="text-sm font-semibold text-[#16607B]">
//           Home
//         </Link>
//         <Link to="/menu" className="text-sm font-semibold text-[#16607B]">
//           Explore
//         </Link>
//         <Link to="/about" className="text-sm font-semibold text-[#16607B]">
//           About
//         </Link>
//       </div>
//     </div>
//   );
// }
