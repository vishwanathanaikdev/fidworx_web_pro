// import { useRef, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function GroupsScroller({ groups }) {
//   const scrollContainerRef = useRef(null);
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);

//   const scrollLeft = () => {
//     const el = scrollContainerRef.current;
//     if (el) {
//       const groupWidth = el.clientWidth; // 444px
//       el.scrollBy({ left: -groupWidth, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     const el = scrollContainerRef.current;
//     if (el) {
//       const groupWidth = el.clientWidth;
//       el.scrollBy({ left: groupWidth, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const el = scrollContainerRef.current;
//     if (!el) return;
//     setShowLeftButton(el.scrollLeft > 0);
//     setShowRightButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
//   };

//   useEffect(() => {
//     handleScroll(); // run once on mount
//   }, []);

//   return (
//     <div className="relative flex items-center">
//       {/* Left scroll button */}
//       {showLeftButton && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // 🚫 prevent nav
//             scrollLeft();
//           }}
//           className="absolute left-0 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//           aria-label="Scroll left"
//         >
//           <ChevronLeft className="w-5 h-5 text-white" />
//         </button>
//       )}

//       {/* Scrollable container */}
//       <div
//         ref={scrollContainerRef}
//         onScroll={handleScroll}
//         className="w-full  h-[80px] bg-[#16607B] mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent snap-x snap-mandatory scroll-smooth"
//       >
//         <div className="flex w-max flex-nowrap">
//           {groups.map((group, idx) => (
//             <div
//               key={idx}
//               className="flex-none w-[444px] h-[80px] snap-center flex"
//             >
//               {group}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right scroll button */}
//       {showRightButton && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // 🚫 prevent nav
//             scrollRight();
//           }}
//           className="absolute right-0  p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//           aria-label="Scroll right"
//         >
//           <ChevronRight className="w-5 h-5 text-white" />
//         </button>
//       )}
//     </div>
//   );
// }








//===========================>>> Updating fro mobile

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GroupsScroller({ groups }) {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scrollLeft = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const groupWidth = el.clientWidth; // 444px
      el.scrollBy({ left: -groupWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const groupWidth = el.clientWidth;
      el.scrollBy({ left: groupWidth, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftButton(el.scrollLeft > 0);
    setShowRightButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    handleScroll(); // run once on mount
  }, []);

  return (
    <div className="relative flex items-center">
      {/* Left scroll button */}
      {showLeftButton && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🚫 prevent nav
            scrollLeft();
          }}
          className="absolute left-0 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-[444px] h-[80px] bg-[#16607B] mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent snap-x snap-mandatory scroll-smooth"
      >
        <div className="flex w-max flex-nowrap">
          {groups.map((group, idx) => (
            <div
              key={idx}
              className="flex-none w-[444px] h-[80px] snap-center flex"
            >
              {group}
            </div>
          ))}
        </div>
      </div>

      {/* Right scroll button */}
      {showRightButton && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🚫 prevent nav
            scrollRight();
          }}
          className="absolute right-0  p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
}









//=======+Old one


// import { useRef, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function GroupsScroller({ groups }) {
//   const scrollContainerRef = useRef(null);
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);

//   const scrollLeft = () => {
//     const el = scrollContainerRef.current;
//     if (el) {
//       const groupWidth = el.clientWidth; // 444px
//       el.scrollBy({ left: -groupWidth, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     const el = scrollContainerRef.current;
//     if (el) {
//       const groupWidth = el.clientWidth;
//       el.scrollBy({ left: groupWidth, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const el = scrollContainerRef.current;
//     if (!el) return;
//     setShowLeftButton(el.scrollLeft > 0);
//     setShowRightButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
//   };

//   useEffect(() => {
//     handleScroll(); // run once on mount
//   }, []);

//   return (
//     <div className="relative flex items-center">
//       {/* Left scroll button */}
//       {showLeftButton && (
//         <button
//           onClick={scrollLeft}
//           className="absolute left-0 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//           aria-label="Scroll left"
//         >
//           <ChevronLeft className="w-5 h-5 text-white" />
//         </button>
//       )}

//       {/* Scrollable container */}
//       <div
//         ref={scrollContainerRef}
//         onScroll={handleScroll}
//         className="w-[444px] h-[80px] bg-[#16607B] mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent snap-x snap-mandatory scroll-smooth"
//       >
//         <div className="flex w-max flex-nowrap">
//           {groups.map((group, idx) => (
//             <div
//               key={idx}
//               className="flex-none w-[444px] h-[80px] snap-center flex"
//             >
//               {group}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right scroll button */}
//       {showRightButton && (
//         <button
//           onClick={scrollRight}
//           className="absolute right-0 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//           aria-label="Scroll right"
//         >
//           <ChevronRight className="w-5 h-5 text-white" />
//         </button>
//       )}
//     </div>
//   );
// }









//================>>>>

// import { useRef, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function GroupsScroller({office}) {
//   const scrollContainerRef = useRef(null);
//   const [showLeftButton, setShowLeftButton] = useState(false);
//   const [showRightButton, setShowRightButton] = useState(true);

//   const scrollLeft = () => {
//     const el = scrollContainerRef.current;
//     if (el) {
//       const groupWidth = el.clientWidth; // 444px
//       el.scrollBy({ left: -groupWidth, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     const el = scrollContainerRef.current;
//     if (el) {
//       const groupWidth = el.clientWidth; // 444px
//       el.scrollBy({ left: groupWidth, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const el = scrollContainerRef.current;
//     if (!el) return;

//     setShowLeftButton(el.scrollLeft > 0);
//     setShowRightButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
//   };

//   useEffect(() => {
//     handleScroll(); // check once on mount
//   }, []);

//   return (
//     <div className="relative flex items-center">
//       {/* Left scroll button */}
//       {showLeftButton && (
//         <button
//           onClick={scrollLeft}
//           className="absolute left-0 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//           aria-label="Scroll left"
//         >
//           <ChevronLeft className="w-5 h-5 text-white" />
//         </button>
//       )}

//       {/* Content container */}
//       <div
//         ref={scrollContainerRef}
//         onScroll={handleScroll}
//         className="w-[444px] h-[80px] bg-[#16607B] mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent snap-x snap-mandatory scroll-smooth"
//       >
//         <div className="flex w-max flex-nowrap">
//           {/* Group 1 */}
//           <div className="flex-none w-[444px] h-[80px] snap-center flex items-center justify-center text-white text-xl font-bold">
//            11111
//           </div>

//           {/* Group 2 */}
//           <div className="flex-none w-[444px] h-[80px] snap-center flex items-center justify-center text-white text-xl font-bold">
//             22222
//           </div>

//           {/* Group 3 */}
//           <div className="flex-none w-[444px] h-[80px] snap-center flex items-center justify-center text-white text-xl font-bold">
//             33333
//           </div>
//         </div>
//       </div>

//       {/* Right scroll button */}
//       {showRightButton && (
//         <button
//           onClick={scrollRight}
//           className="absolute right-0 z-10 p-1 bg-[#16607B] rounded-full shadow-md hover:bg-[#0f4a60] transition-colors"
//           aria-label="Scroll right"
//         >
//           <ChevronRight className="w-5 h-5 text-white" />
//         </button>
//       )}
//     </div>
//   );
// }
