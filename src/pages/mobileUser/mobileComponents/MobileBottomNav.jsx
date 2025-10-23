import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCompass, FaInfoCircle } from "react-icons/fa";

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/menu", label: "Explore", icon: <FaCompass /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#16607B] text-white shadow-lg border-t border-gray-700 z-50">
      <div className="flex justify-around items-center py-1.5">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center text-[10px] transition-all duration-300 ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full mb-[2px] transition-all duration-300 ${
                  isActive ? "bg-white/25 shadow-md" : ""
                }`}
              >
                <span className="text-base">{item.icon}</span>
              </div>
              <span className="font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;









//=======>> 2

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FaHome, FaCompass, FaInfoCircle } from "react-icons/fa";

// const MobileBottomNav = () => {
//   const location = useLocation();
//   const currentPath = location.pathname;

//   const navItems = [
//     { path: "/", label: "Home", icon: <FaHome /> },
//     { path: "/menu", label: "Explore", icon: <FaCompass /> },
//     { path: "/about", label: "About", icon: <FaInfoCircle /> },
//   ];

//   return (
//     <nav className="fixed bottom-0 inset-x-0 bg-[#16607B] text-white shadow-lg border-t border-gray-700 z-50">
//       <div className="flex justify-around items-center py-2">
//         {navItems.map((item) => {
//           const isActive = currentPath === item.path;

//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex flex-col items-center text-xs transition-all duration-300 ${
//                 isActive
//                   ? "text-white"
//                   : "text-white/70 hover:text-white"
//               }`}
//             >
//               <div
//                 className={`flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-all duration-300 ${
//                   isActive ? "bg-white/25 shadow-md" : ""
//                 }`}
//               >
//                 <span className="text-lg">{item.icon}</span>
//               </div>
//               <span className="font-medium">{item.label}</span>
//             </Link>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };

// export default MobileBottomNav;









//=======>> Old with transition


// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FaHome, FaCompass, FaInfoCircle } from "react-icons/fa";

// const MobileBottomNav = () => {
//   const location = useLocation();
//   const currentPath = location.pathname;

//   const navItems = [
//     { path: "/", label: "Home", icon: <FaHome /> },
//     { path: "/menu", label: "Explore", icon: <FaCompass /> },
//     { path: "/about", label: "About", icon: <FaInfoCircle /> },
//   ];

//   return (
//     <nav className="fixed bottom-0 inset-x-0 bg-[#16607B] text-white shadow-lg border-t border-red-700">
//       <div className="flex justify-around items-center py-2">
//         {navItems.map((item) => {
//           const isActive = currentPath === item.path;

//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex flex-col items-center text-xs transition-all duration-300 ${
//                 isActive
//                   ? "text-white"
//                   : "text-white/70 hover:text-white"
//               }`}
//             >
//               <div
//                 className={`flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-all duration-300 ${
//                   isActive ? "bg-white/25 shadow-md" : ""
//                 }`}
//               >
//                 <span className="text-lg">{item.icon}</span>
//               </div>
//               <span className="font-medium">{item.label}</span>
//             </Link>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };

// export default MobileBottomNav;
