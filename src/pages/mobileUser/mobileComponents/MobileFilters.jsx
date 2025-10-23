import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function MobileFilters({
  filters,
  handleFilterChange,
  cities,
  zones,
  locations,
  priceOptions,
  areaOptions,
  seatingOptions,
}) {
  const [activeFilter, setActiveFilter] = useState(null);
  const scrollRef = useRef(null);
  const optionScrollRef = useRef(null);

  // Scroll function
  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  // Filter definitions
  const filterOptions = {
    city: cities,
    zone: zones,
    locationOfProperty: locations,
    priceRange: priceOptions.map((opt) => opt.display),
    areaSqft: areaOptions.map((opt) => opt.display),
    seatingCapacity: seatingOptions.map((opt) => opt.display),
    furnishingLevel: ["Ready to Move", "Fully Furnished", "Semi Furnished"],
  };

  return (
    <div className="mt-4 px-2 space-y-3">
      {/* Main Filter Buttons */}
      <div className="relative flex items-center w-full border border-t-gray-200 rounded-md">
        <button
          onClick={() => scroll(scrollRef, "left")}
          className="absolute left-0 z-10 bg-black/50 p-1 text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-2 w-full"
        >
          {Object.keys(filterOptions).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() =>
                setActiveFilter(activeFilter === filterKey ? null : filterKey)
              }
              className={`px-3 py-1 border text-[10px] rounded-md font-medium whitespace-nowrap ${
                activeFilter === filterKey
                  ? "bg-orange-500 text-white border-orange-500"
                  : "text-orange-500 border-gray-300 bg-white"
              }`}
            >
              {filterKey.replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll(scrollRef, "right")}
          className="absolute right-0 z-10 bg-black/50 p-1 text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Options Row */}
      {activeFilter && (
        <div className="relative flex items-center w-full border border-t-gray-200 rounded-md">
          <button
            onClick={() => scroll(optionScrollRef, "left")}
            className="absolute left-0 z-10 bg-black/50 p-1 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div
            ref={optionScrollRef}
            className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-2 w-full"
          >
            {filterOptions[activeFilter].map((opt, idx) => (
              <button
                key={idx}
                onClick={() =>
                  handleFilterChange(activeFilter, opt.value || opt)
                }
                className={`px-3 py-1 text-[10px] rounded-md border whitespace-nowrap ${
                  filters[activeFilter] === (opt.value || opt)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "text-orange-500 border-gray-300 bg-white"
                }`}
              >
                {opt.display || opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll(optionScrollRef, "right")}
            className="absolute right-0 z-10 bg-black/50 p-1 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default MobileFilters;









//====================>>>> old 2


// import { useState, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// function MobileFilters({ filters, handleFilterChange, cities, zones, locations, priceOptions, areaOptions, seatingOptions }) {
//   const [activeFilter, setActiveFilter] = useState(null);
//   const scrollRef = useRef(null);
//   const optionScrollRef = useRef(null);

//   // Scroll function
//   const scroll = (ref, direction) => {
//     if (ref.current) {
//       ref.current.scrollBy({
//         left: direction === "left" ? -150 : 150,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Filter definitions
//   const filterOptions = {
//     city: cities,
//     zone: zones,
//     locationOfProperty: locations,
//     priceRange: priceOptions.map((opt) => opt.display),
//     areaSqft: areaOptions.map((opt) => opt.display),
//     seatingCapacity: seatingOptions.map((opt) => opt.display),
//     furnishingLevel: ["Ready to Move", "Fully Furnished", "Semi Furnished"],
//   };

//   return (
//     <div className="mt-4 px-2 space-y-3">
//       {/* Main Filter Buttons */}
//       <div className="relative flex items-center">
//         <button
//           onClick={() => scroll(scrollRef, "left")}
//           className="absolute left-0 z-10 bg-white p-1 shadow-md rounded-full"
//         >
//           <ChevronLeft className="w-4 h-4 text-orange-500" />
//         </button>
//         <div
//           ref={scrollRef}
//           className="flex gap-2 overflow-x-auto no-scrollbar px-6"
//         >
//           {Object.keys(filterOptions).map((filterKey) => (
//             <button
//               key={filterKey}
//               onClick={() =>
//                 setActiveFilter(activeFilter === filterKey ? null : filterKey)
//               }
//               className={`px-3 py-1 border text-[10px] font-medium whitespace-nowrap ${
//                 activeFilter === filterKey
//                   ? "bg-orange-500 text-white border-orange-500"
//                   : "text-orange-500 border-gray-300 bg-white"
//               } rounded-md`}
//             >
//               {filterKey.replace(/([A-Z])/g, " $1")} {/* label format */}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={() => scroll(scrollRef, "right")}
//           className="absolute right-0 z-10 bg-white p-1 shadow-md rounded-full"
//         >
//           <ChevronRight className="w-4 h-4 text-orange-500" />
//         </button>
//       </div>

//       {/* Options Row */}
//       {activeFilter && (
//         <div className="relative flex items-center">
//           <button
//             onClick={() => scroll(optionScrollRef, "left")}
//             className="absolute left-0 z-10 bg-white p-1 shadow-md rounded-full"
//           >
//             <ChevronLeft className="w-4 h-4 text-orange-500" />
//           </button>
//           <div
//             ref={optionScrollRef}
//             className="flex gap-2 overflow-x-auto no-scrollbar px-6"
//           >
//             {filterOptions[activeFilter].map((opt, idx) => (
//               <button
//                 key={idx}
//                 onClick={() =>
//                   handleFilterChange(activeFilter, opt.value || opt)
//                 }
//                 className={`px-3 py-1 text-[10px] border whitespace-nowrap ${
//                   filters[activeFilter] === (opt.value || opt)
//                     ? "bg-orange-500 text-white border-orange-500"
//                     : "text-orange-500 border-gray-300 bg-white"
//                 } rounded-md`}
//               >
//                 {opt.display || opt}
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => scroll(optionScrollRef, "right")}
//             className="absolute right-0 z-10 bg-white p-1 shadow-md rounded-full"
//           >
//             <ChevronRight className="w-4 h-4 text-orange-500" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MobileFilters;









//===============>>>Old 



// import React, { useState } from "react";

// function MobileFilters({
//   filters,
//   handleFilterChange,
//   cities,
//   zones,
//   locations,
//   priceOptions,
//   areaOptions,
//   seatingOptions,
// }) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="sticky top-[80px] z-30 w-full px-4">
//       {/* Toggle Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full py-2 text-sm font-semibold text-white bg-orange-500 rounded-md shadow-md"
//       >
//         {isOpen ? "Close Filters" : "Open Filters"}
//       </button>

//       {/* Dropdown Filters */}
//       {isOpen && (
//         <div className="mt-3 p-3 bg-white rounded-lg shadow-lg space-y-4 max-h-[70vh] overflow-y-auto">
//           {/* City */}
//           <div>
//             <p className="mb-1 text-xs font-medium text-gray-800">City</p>
//             <select
//               value={filters.city}
//               onChange={(e) => handleFilterChange("city", e.target.value)}
//               className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md"
//             >
//               <option value="">Select City</option>
//               {cities.map((city, idx) => (
//                 <option key={idx} value={city}>
//                   {city}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Zone */}
//           <div>
//             <p className="mb-1 text-xs font-medium text-gray-800">Zone</p>
//             <select
//               value={filters.zone}
//               onChange={(e) => handleFilterChange("zone", e.target.value)}
//               className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md"
//               disabled={!filters.city}
//             >
//               <option value="">Select Zone</option>
//               {zones.map((zone, idx) => (
//                 <option key={idx} value={zone}>
//                   {zone}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Location */}
//           <div>
//             <p className="mb-1 text-xs font-medium text-gray-800">Location</p>
//             <select
//               value={filters.locationOfProperty}
//               onChange={(e) =>
//                 handleFilterChange("locationOfProperty", e.target.value)
//               }
//               className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md"
//               disabled={!filters.zone}
//             >
//               <option value="">Select Location</option>
//               {locations.map((loc, idx) => (
//                 <option key={idx} value={loc}>
//                   {loc}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Price */}
//           <div>
//             <p className="mb-1 text-xs font-medium text-gray-800">Price</p>
//             <select
//               value={filters.priceRange}
//               onChange={(e) => handleFilterChange("priceRange", e.target.value)}
//               className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md"
//             >
//               <option value="">Select Price Range</option>
//               {priceOptions.map((opt, idx) => (
//                 <option key={idx} value={opt.value}>
//                   {opt.display}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Area */}
//           <div>
//             <p className="mb-1 text-xs font-medium text-gray-800">Area (Sqft)</p>
//             <select
//               value={filters.areaSqft}
//               onChange={(e) => handleFilterChange("areaSqft", e.target.value)}
//               className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md"
//             >
//               <option value="">Select Area (Sqft)</option>
//               {areaOptions.map((opt, idx) => (
//                 <option key={idx} value={opt.value}>
//                   {opt.display}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Seating */}
//           <div>
//             <p className="mb-1 text-xs font-medium text-gray-800">Seating</p>
//             <select
//               value={filters.seatingCapacity}
//               onChange={(e) =>
//                 handleFilterChange("seatingCapacity", e.target.value)
//               }
//               className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md"
//             >
//               <option value="">Select Seating Capacity</option>
//               {seatingOptions.map((opt, idx) => (
//                 <option key={idx} value={opt.value}>
//                   {opt.display}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Furnishing */}
//           <div>
//             <p className="mb-1 text-xs font-medium text-gray-800">Furnishing</p>
//             <select
//               value={filters.furnishingLevel}
//               onChange={(e) =>
//                 handleFilterChange("furnishingLevel", e.target.value)
//               }
//               className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md"
//             >
//               <option value="">Select Furnishing</option>
//               <option value="Ready to Move">Ready to Move</option>
//               <option value="Fully Furnished">Fully Furnished</option>
//               <option value="Semi Furnished">Semi Furnished</option>
//             </select>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MobileFilters;
