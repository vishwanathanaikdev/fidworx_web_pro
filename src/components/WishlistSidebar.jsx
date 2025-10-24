import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoIosContact } from "react-icons/io";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AuthModal from "../pages/websiteUser/component/AuthModal";
import { getWishlistData } from "../api/services/wishlistServise";
import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";

const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [visitorProfile, setVisitorProfile] = useState(null);
  const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const visitorId = Cookies.get("visitorId");
      setVisitorIdState(visitorId);

      if (visitorId) {
        try {
          const profileRes = await getVisitorProfileById(visitorId);
          if (profileRes.success) setVisitorProfile(profileRes.data);

          const wishlistRes = await getWishlistData(visitorId);
          setWishlist(wishlistRes.data || []);

          const notifRes = await getNotifications(visitorId);
          setNotifications(notifRes.data || []);
          setHasUnread(notifRes.data?.some((n) => !n.isRead));
        } catch (err) {
          console.error(err);
        }
      } else {
        setVisitorProfile(null);
        setWishlist([]);
        setNotifications([]);
        setHasUnread(false);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleLogout = () => {
    Cookies.remove("visitorId");
    setVisitorProfile(null);
    setWishlist([]);
    setNotifications([]);
    setVisitorIdState(null);
    onLogout?.();
  };

  const handleRequireLogin = () => {
    if (!visitorIdState) {
      setAuthOpen(true);
      setIsOpen(false);
      onLoginRequired?.();
    }
  };

  const handleNavigate = (property) => {
    if (!visitorIdState) handleRequireLogin();
    else {
      navigate(`/office/${property._id}?category=${property.type}`, {
        state: { relatedProperties: wishlist, city: property.location?.city },
      });
    }
  };

  const handleAuthSuccess = async (userData) => {
    const id = userData.visitorId || Cookies.get("visitorId");
    setVisitorIdState(id);
    setVisitorProfile(userData);
    setAuthOpen(false);
    setIsOpen(true);

    try {
      const wishlistRes = await getWishlistData(id);
      setWishlist(wishlistRes.data || []);
      const notificationsRes = await getNotifications(id);
      setNotifications(notificationsRes.data || []);
      setHasUnread(notificationsRes.data?.some((n) => !n.isRead));
    } catch (err) {
      console.error(err);
    }
  };
  

  const sidebarUI = (
    <div
      className={`fixed inset-0 z-[9999] flex transition-opacity duration-100 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Overlay: Black semi-transparent */}
      <div
        className="flex-1" // 🎨 dark overlay
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar: Dark glass */}
      <div
        className={`w-80 backdrop-blur-md bg-black/40 text-white shadow-2xl border-l border-gray-700 rounded-l-2xl p-5 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-right justify-between mb-3">
          <button
            onClick={() => setIsOpen(false)}
            className="text-md text-gray-300 hover:text-white transition"
          >
            ✕
          </button>
        </div>

   
{/* Profile Section */}
{visitorIdState && visitorProfile ? (
  <div className="flex flex-col items-center w-full mb-6 h-40"> {/* height reduced */}
    <div className="relative w-14 h-14 flex-shrink-0 mb-2"> {/* smaller avatar */}
      {/* Avatar Circle */}
      <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
        {visitorProfile.fullName?.[0] || "V"}
      </div>
      {/* Verified Badge */}
      {visitorProfile.verified && (
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">
          ✓
        </span>
      )}
    </div>

    {/* Name & Contact Info */}
    <div className="text-center w-full">
      <p className="font-semibold text-white-400 text-base truncate">
        {visitorProfile.fullName}
      </p>
      <p className="text-xs text-white-900 truncate">{visitorProfile.email}</p>
      <p className="text-xs text-white-900">{visitorProfile.mobile}</p>
    </div>

    {/* Logout Button */}
    <button
  onClick={handleLogout}
  className="mt-3 w-full bg-gradient-to-r from-pink-500 via-red-500 to-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
>
  Logout
</button>
  </div>
) : (
  <div className="mb-6 flex justify-center w-full">
  <button
    onClick={handleRequireLogin}
    className="px-4 py-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-xl text-sm font-medium text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
  >
    Login / Register
  </button>
</div>
)}


{/* Notifications */}
{visitorIdState && notifications.length > 0 && (
  <div className="mb-8">
    <h3 className="text-sm uppercase font-semibold text-white tracking-wider mb-3">
      Notifications
    </h3>
    <div className="h-[160px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
      {notifications.map((n) => {
        const time = n.createdAt
          ? new Date(n.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        const isUnread = !n.isRead;

        // Clean message text
        const shortMessage = n.message
          ?.replace(/^You have a new message from .*?:\s*/, "")
          ?.replace(/^"|"$/g, "")
          ?.trim();

        return (
          <div
            key={n._id}
            className={`
              flex flex-col gap-1 p-3 bg-black/20 backdrop-blur-md rounded-xl cursor-pointer
              border border-white/20 shadow-md
              ${
                isUnread
                  ? "shadow-[0_0_10px_rgba(72,187,120,0.6)]"
                  : "shadow-[0_0_6px_rgba(255,255,255,0.1)]"
              }
              hover:shadow-[0_0_12px_rgba(72,187,120,0.8)] transition-all duration-200
            `}
          >
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 mt-0.5 text-white/80" />
              <p className="text-sm flex-1 text-white font-medium leading-snug">
                {shortMessage}
              </p>
            </div>
            {time && (
              <span className="ml-8 text-xs text-white/60">{time}</span>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}


{/* Wishlist / Saved Spaces – White Card Standard Style */}
{visitorIdState && (
  <div className="mt-6">
    <h3 className="text-sm uppercase font-semibold text-white/80 tracking-wider mb-4">
      Saved Spaces
    </h3>

    {wishlist.length === 0 ? (
      <p className="text-white/70 text-sm italic">No saved spaces yet.</p>
    ) : (
      <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {wishlist.map(
          (item) =>
            item?.property && (
              <div
                key={item._id}
                onClick={() => handleNavigate(item.property)}
                className="flex items-center gap-3 p-3 bg-white rounded-xl backdrop-blur-sm cursor-pointer
                  border border-white/20 shadow-md
                  hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.property.images?.[0] || "/placeholder.png"}
                    alt={item.property.buildingName}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                  />
                </div>

                {/* Text Section */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                    {item.property.buildingName}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {item.property.location?.city},{" "}
                    {item.property.location?.locationOfProperty}
                  </p>
                  <button
                   onClick={() => handleNavigate(item.property)}
                    className="px-3 py-1 text-[11px] bg-gradient-to-r from-green-500/80 to-teal-500/80 
                      text-black font-medium rounded-full shadow-md hover:shadow-lg 
                      transition-all duration-200 backdrop-blur-sm"
                  >
                    View Details →
                  </button>

                </div>
              </div>
            )
        )}
      </div>
    )}
  </div>
)}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setAuthOpen(false);
        }}
        className="relative p-2 bg-gradient-to-tr from-slate-700 to-gray-800 rounded-full hover:from-blue-600 hover:to-indigo-600 shadow-md transition"
      >
        <IoIosContact className="w-6 h-6 text-white" />
        {hasUnread && (
          <span className="absolute w-2 h-2 bg-green-400 rounded-full top-1 right-1" />
        )}
      </button>
      {createPortal(sidebarUI, document.body)}
    </>
  );
};

export default WishlistSidebar;








//=======>> Final one


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { IoIosContact } from "react-icons/io";
// import { MessageCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import AuthModal from "../pages/websiteUser/component/AuthModal";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";

// const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
//   const [authOpen, setAuthOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const visitorId = Cookies.get("visitorId");
//       setVisitorIdState(visitorId);

//       if (visitorId) {
//         try {
//           const profileRes = await getVisitorProfileById(visitorId);
//           if (profileRes.success) setVisitorProfile(profileRes.data);

//           const wishlistRes = await getWishlistData(visitorId);
//           setWishlist(wishlistRes.data || []);

//           const notifRes = await getNotifications(visitorId);
//           setNotifications(notifRes.data || []);
//           setHasUnread(notifRes.data?.some((n) => !n.isRead));
//         } catch (err) {
//           console.error(err);
//         }
//       } else {
//         setVisitorProfile(null);
//         setWishlist([]);
//         setNotifications([]);
//         setHasUnread(false);
//       }
//     };
//     if (isOpen) fetchData();
//   }, [isOpen]);

//   const handleLogout = () => {
//     Cookies.remove("visitorId");
//     setVisitorProfile(null);
//     setWishlist([]);
//     setNotifications([]);
//     setVisitorIdState(null);
//     onLogout?.();
//   };

//   const handleRequireLogin = () => {
//     if (!visitorIdState) {
//       setAuthOpen(true);
//       setIsOpen(false);
//       onLoginRequired?.();
//     }
//   };

//   const handleNavigate = (property) => {
//     if (!visitorIdState) handleRequireLogin();
//     else {
//       navigate(`/office/${property._id}?category=${property.type}`, {
//         state: { relatedProperties: wishlist, city: property.location?.city },
//       });
//     }
//   };

//   const handleAuthSuccess = async (userData) => {
//     const id = userData.visitorId || Cookies.get("visitorId");
//     setVisitorIdState(id);
//     setVisitorProfile(userData);
//     setAuthOpen(false);
//     setIsOpen(true);

//     try {
//       const wishlistRes = await getWishlistData(id);
//       setWishlist(wishlistRes.data || []);
//       const notificationsRes = await getNotifications(id);
//       setNotifications(notificationsRes.data || []);
//       setHasUnread(notificationsRes.data?.some((n) => !n.isRead));
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   const extractSenderName = (message) => {
//     const match = message.match(/from (.*?):/);
//     return match ? match[1] : "Someone";
//   };
  

//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-100 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay: Black semi-transparent */}
//       <div
//         className="flex-1" // 🎨 dark overlay
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar: Dark glass */}
//       <div
//         className={`w-80 backdrop-blur-md bg-black/40 text-white shadow-2xl border-l border-gray-700 rounded-l-2xl p-5 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-right justify-between mb-3">
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-md text-gray-300 hover:text-white transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Profile */}
//       {/* Profile Section */}
// {/* Profile Section */}
// {visitorIdState && visitorProfile ? (
//   <div className="flex flex-col items-center w-full mb-6 h-40"> {/* height reduced */}
//     <div className="relative w-14 h-14 flex-shrink-0 mb-2"> {/* smaller avatar */}
//       {/* Avatar Circle */}
//       <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
//         {visitorProfile.fullName?.[0] || "V"}
//       </div>
//       {/* Verified Badge */}
//       {visitorProfile.verified && (
//         <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">
//           ✓
//         </span>
//       )}
//     </div>

//     {/* Name & Contact Info */}
//     <div className="text-center w-full">
//       <p className="font-semibold text-white-400 text-base truncate">
//         {visitorProfile.fullName}
//       </p>
//       <p className="text-xs text-white-900 truncate">{visitorProfile.email}</p>
//       <p className="text-xs text-white-900">{visitorProfile.mobile}</p>
//     </div>

//     {/* Logout Button */}
//     <button
//   onClick={handleLogout}
//   className="mt-3 w-full bg-gradient-to-r from-pink-500 via-red-500 to-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
// >
//   Logout
// </button>
//   </div>
// ) : (
//   <div className="mb-6 flex justify-center w-full">
//   <button
//     onClick={handleRequireLogin}
//     className="px-4 py-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-xl text-sm font-medium text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
//   >
//     Login / Register
//   </button>
// </div>
// )}


// {/* Notifications */}
// {visitorIdState && notifications.length > 0 && (
//   <div className="mb-8">
//     <h3 className="text-sm uppercase font-semibold text-white tracking-wider mb-3">
//       Notifications
//     </h3>
//     <div className="h-[200px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
//       {notifications.map((n) => {
//         const time = n.createdAt
//           ? new Date(n.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })
//           : "";

//         const isUnread = !n.isRead;

//         // Clean message text
//         const shortMessage = n.message
//           ?.replace(/^You have a new message from .*?:\s*/, "")
//           ?.replace(/^"|"$/g, "")
//           ?.trim();

//         return (
//           <div
//             key={n._id}
//             className={`
//               flex flex-col gap-1 p-3 bg-black/20 backdrop-blur-md rounded-xl cursor-pointer
//               border border-white/20 shadow-md
//               ${
//                 isUnread
//                   ? "shadow-[0_0_10px_rgba(72,187,120,0.6)]"
//                   : "shadow-[0_0_6px_rgba(255,255,255,0.1)]"
//               }
//               hover:shadow-[0_0_12px_rgba(72,187,120,0.8)] transition-all duration-200
//             `}
//           >
//             <div className="flex items-start gap-3">
//               <MessageCircle className="w-5 h-5 mt-0.5 text-white/80" />
//               <p className="text-sm flex-1 text-white font-medium leading-snug">
//                 {shortMessage}
//               </p>
//             </div>
//             {time && (
//               <span className="ml-8 text-xs text-white/60">{time}</span>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}





//         {/* Wishlist */}
//         {/* {visitorIdState && (
//           <div>
//             <h3 className="text-sm uppercase font-semibold text-white tracking-wider mb-3">
//               Saved Spaces
//             </h3>
//             {wishlist.length === 0 ? (
//               <p className="text-gray-300 text-sm">No saved spaces yet.</p>
//             ) : (
//               <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                 {wishlist.map(
//                   (item) =>
//                     item?.property && (
//                       <div
//                         key={item._id}
//                         onClick={() => handleNavigate(item.property)}
//                         className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
//                       >
//                         <img
//                           src={item.property.images?.[0] || "/placeholder.png"}
//                           alt={item.property.buildingName}
//                           className="object-cover w-16 h-16 rounded-lg border border-gray-300"
//                         />
//                         <div className="flex-1">
//                           <h3 className="text-sm font-semibold text-gray-900">
//                             {item.property.buildingName}
//                           </h3>
//                           <p className="text-xs text-gray-600">
//                             {item.property.location?.city},{" "}
//                             {item.property.location?.locationOfProperty}
//                           </p>
//                           <span className="text-[12px] text-blue-500 underline">
//                             View Details →
//                           </span>
//                         </div>
//                       </div>
//                     )
//                 )}
//               </div>
//             )}
//           </div>
//         )} */}
//         {/* Wishlist / Saved Spaces */}
// {/* {visitorIdState && (
//   <div className="mt-6">
//     <h3 className="text-sm uppercase font-semibold text-white/80 tracking-wider mb-3">
//       Saved Spaces
//     </h3>

//     {wishlist.length === 0 ? (
//       <p className="text-white/70 text-sm italic">No saved spaces yet.</p>
//     ) : (
//       <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//         {wishlist.map(
//           (item) =>
//             item?.property && (
//               <div
//                 key={item._id}
//                 onClick={() => handleNavigate(item.property)}
//                 className="group flex items-center gap-3 p-3 
//                   bg-white/5 backdrop-blur-md rounded-xl cursor-pointer 
//                   border border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.15)]
//                   hover:shadow-[0_0_15px_rgba(72,187,120,0.7)] 
//                   hover:border-green-400 transition-all duration-300"
//               >
//                 <img
//                   src={item.property.images?.[0] || '/placeholder.png'}
//                   alt={item.property.buildingName}
//                   className="object-cover w-16 h-16 rounded-lg border border-white/30 shadow-sm group-hover:shadow-[0_0_10px_rgba(72,187,120,0.6)] transition-all duration-300"
//                 />

//                 <div className="flex-1">
//                   <h3 className="text-sm font-semibold text-white mb-1">
//                     {item.property.buildingName}
//                   </h3>
//                   <p className="text-xs text-white/70 mb-1">
//                     {item.property.location?.city},{" "}
//                     {item.property.location?.locationOfProperty}
//                   </p>
//                   <span className="text-[12px] text-green-400 font-medium underline group-hover:text-green-300 transition">
//                     View Details →
//                   </span>
//                 </div>
//               </div>
//             )
//         )}
//       </div>
//     )}
//   </div>
// )} */}

// {/* Wishlist / Saved Spaces – White Card Standard Style */}
// {visitorIdState && (
//   <div className="mt-6">
//     <h3 className="text-sm uppercase font-semibold text-white/80 tracking-wider mb-4">
//       Saved Spaces
//     </h3>

//     {wishlist.length === 0 ? (
//       <p className="text-white/70 text-sm italic">No saved spaces yet.</p>
//     ) : (
//       <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//         {wishlist.map(
//           (item) =>
//             item?.property && (
//               <div
//                 key={item._id}
//                 onClick={() => handleNavigate(item.property)}
//                 className="flex items-center gap-3 p-3 bg-white rounded-xl backdrop-blur-sm cursor-pointer
//                   border border-white/20 shadow-md
//                   hover:shadow-lg transition-all duration-200"
//               >
//                 {/* Image */}
//                 <div className="flex-shrink-0">
//                   <img
//                     src={item.property.images?.[0] || "/placeholder.png"}
//                     alt={item.property.buildingName}
//                     className="w-16 h-16 rounded-lg object-cover border border-gray-300"
//                   />
//                 </div>

//                 {/* Text Section */}
//                 <div className="flex-1">
//                   <h3 className="text-sm font-semibold text-gray-900 leading-snug">
//                     {item.property.buildingName}
//                   </h3>
//                   <p className="text-xs text-gray-600 mb-1">
//                     {item.property.location?.city},{" "}
//                     {item.property.location?.locationOfProperty}
//                   </p>
//                   <button
//                    onClick={() => handleNavigate(item.property)}
//                     className="px-3 py-1 text-[11px] bg-gradient-to-r from-green-500/80 to-teal-500/80 
//                       text-black font-medium rounded-full shadow-md hover:shadow-lg 
//                       transition-all duration-200 backdrop-blur-sm"
//                   >
//                     View Details →
//                   </button>

//                 </div>
//               </div>
//             )
//         )}
//       </div>
//     )}
//   </div>
// )}
//       </div>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authOpen}
//         onClose={() => setAuthOpen(false)}
//         onAuthSuccess={handleAuthSuccess}
//       />
//     </div>
//   );

//   return (
//     <>
//       <button
//         onClick={() => {
//           setIsOpen(true);
//           setAuthOpen(false);
//         }}
//         className="relative p-2 bg-gradient-to-tr from-slate-700 to-gray-800 rounded-full hover:from-blue-600 hover:to-indigo-600 shadow-md transition"
//       >
//         <IoIosContact className="w-6 h-6 text-white" />
//         {hasUnread && (
//           <span className="absolute w-2 h-2 bg-green-400 rounded-full top-1 right-1" />
//         )}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;




//  onClick={() => setIsOpen(false)}



//========>> Okay with UI

// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { IoIosContact } from "react-icons/io";
// import { MessageCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import AuthModal from "../pages/websiteUser/component/AuthModal";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";

// const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
//   const [authOpen, setAuthOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const visitorId = Cookies.get("visitorId");
//       setVisitorIdState(visitorId);

//       if (visitorId) {
//         try {
//           const profileRes = await getVisitorProfileById(visitorId);
//           if (profileRes.success) setVisitorProfile(profileRes.data);

//           const wishlistRes = await getWishlistData(visitorId);
//           setWishlist(wishlistRes.data || []);

//           const notifRes = await getNotifications(visitorId);
//           setNotifications(notifRes.data || []);
//           setHasUnread(notifRes.data?.some((n) => !n.isRead));
//         } catch (err) {
//           console.error(err);
//         }
//       } else {
//         setVisitorProfile(null);
//         setWishlist([]);
//         setNotifications([]);
//         setHasUnread(false);
//       }
//     };
//     if (isOpen) fetchData();
//   }, [isOpen]);

//   const handleLogout = () => {
//     Cookies.remove("visitorId");
//     setVisitorProfile(null);
//     setWishlist([]);
//     setNotifications([]);
//     setVisitorIdState(null);
//     onLogout?.();
//   };

//   const handleRequireLogin = () => {
//     if (!visitorIdState) {
//       setAuthOpen(true);
//       setIsOpen(false);
//       onLoginRequired?.();
//     }
//   };

//   const handleNavigate = (property) => {
//     if (!visitorIdState) handleRequireLogin();
//     else {
//       navigate(`/office/${property._id}?category=${property.type}`, {
//         state: { relatedProperties: wishlist, city: property.location?.city },
//       });
//     }
//   };

//   const handleAuthSuccess = async (userData) => {
//     const id = userData.visitorId || Cookies.get("visitorId");
//     setVisitorIdState(id);
//     setVisitorProfile(userData);
//     setAuthOpen(false);
//     setIsOpen(true);

//     try {
//       const wishlistRes = await getWishlistData(id);
//       setWishlist(wishlistRes.data || []);
//       const notificationsRes = await getNotifications(id);
//       setNotifications(notificationsRes.data || []);
//       setHasUnread(notificationsRes.data?.some((n) => !n.isRead));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-100 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay: Black semi-transparent */}
//       <div
//         className="flex-1" // 🎨 dark overlay
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar: Dark glass */}
//       <div
//         className={`w-80 backdrop-blur-md bg-black-900/60 text-white shadow-2xl border-l border-gray-700 rounded-l-2xl p-5 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold tracking-wide text-white/90">
//             Your Dashboard
//           </h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-2xl text-gray-300 hover:text-white transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Profile */}
//         {visitorIdState && visitorProfile ? (
//           <div className="p-4 bg-white rounded-2xl shadow-md flex items-center gap-4 mb-6">
//             {/* Solid white card */}
//             <div className="relative w-14 h-14 flex-shrink-0">
//               <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
//                 {visitorProfile.fullName?.[0] || "V"}
//               </div>
//               {visitorProfile.verified && (
//                 <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">
//                   ✓
//                 </span>
//               )}
//             </div>
//             <div className="flex-1">
//               <p className="font-semibold text-gray-900">{visitorProfile.fullName}</p>
//               <p className="text-sm text-gray-600 truncate">{visitorProfile.email}</p>
//               <p className="text-sm text-gray-700">{visitorProfile.mobile}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 shadow-sm text-white"
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div className="mb-6 flex justify-center">
//             <button
//               onClick={handleRequireLogin}
//               className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-sm font-medium text-white hover:opacity-90 shadow-md"
//             >
//               Login / Register
//             </button>
//           </div>
//         )}

//         {/* Notifications */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-8">
//             <h3 className="text-sm uppercase font-semibold text-white/70 tracking-wider mb-3">
//               Notifications
//             </h3>
//             <div className="h-[200px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
//               {notifications.map((n) => {
//                 const time = n.createdAt
//                   ? new Date(n.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })
//                   : "";
//                 return (
//                   <div
//                     key={n._id}
//                     className="flex flex-col gap-1 p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
//                   >
//                     <div className="flex items-start gap-3">
//                       <MessageCircle className="w-5 h-5 mt-0.5 text-gray-700" />
//                       <p className="text-sm flex-1 text-gray-900 font-medium">
//                         {n.message}
//                       </p>
//                     </div>
//                     {time && (
//                       <span className="ml-8 text-xs text-gray-500">{time}</span>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Wishlist */}
//         {visitorIdState && (
//           <div>
//             <h3 className="text-sm uppercase font-semibold text-white/70 tracking-wider mb-3">
//               Saved Spaces
//             </h3>
//             {wishlist.length === 0 ? (
//               <p className="text-gray-300 text-sm">No saved spaces yet.</p>
//             ) : (
//               <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                 {wishlist.map(
//                   (item) =>
//                     item?.property && (
//                       <div
//                         key={item._id}
//                         onClick={() => handleNavigate(item.property)}
//                         className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
//                       >
//                         <img
//                           src={item.property.images?.[0] || "/placeholder.png"}
//                           alt={item.property.buildingName}
//                           className="object-cover w-16 h-16 rounded-lg border border-gray-300"
//                         />
//                         <div className="flex-1">
//                           <h3 className="text-sm font-semibold text-gray-900">
//                             {item.property.buildingName}
//                           </h3>
//                           <p className="text-xs text-gray-600">
//                             {item.property.location?.city},{" "}
//                             {item.property.location?.locationOfProperty}
//                           </p>
//                           <span className="text-[12px] text-blue-500 underline">
//                             View Details →
//                           </span>
//                         </div>
//                       </div>
//                     )
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authOpen}
//         onClose={() => setAuthOpen(false)}
//         onAuthSuccess={handleAuthSuccess}
//       />
//     </div>
//   );

//   return (
//     <>
//       <button
//         onClick={() => {
//           setIsOpen(true);
//           setAuthOpen(false);
//         }}
//         className="relative p-2 bg-gradient-to-tr from-slate-700 to-gray-800 rounded-full hover:from-blue-600 hover:to-indigo-600 shadow-md transition"
//       >
//         <IoIosContact className="w-6 h-6 text-white" />
//         {hasUnread && (
//           <span className="absolute w-2 h-2 bg-green-400 rounded-full top-1 right-1" />
//         )}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;



//=======>>> Final Editing UI


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react";
// import Cookies from "js-cookie";
// import AuthModal from "../pages/websiteUser/component/AuthModal";

// const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
//   const [authOpen, setAuthOpen] = useState(false);
//   const navigate = useNavigate();


//   // Fetch visitor profile, wishlist & notifications whenever sidebar opens
// useEffect(() => {
//   const fetchData = async () => {
//     const visitorId = Cookies.get("visitorId"); // get latest visitorId
//     setVisitorIdState(visitorId);

//     if (visitorId) {
//       try {
//         // Fetch visitor profile
//         const profileRes = await getVisitorProfileById(visitorId);
//         if (profileRes.success) setVisitorProfile(profileRes.data);

//         // Fetch wishlist
//         const wishlistRes = await getWishlistData(visitorId);
//         setWishlist(wishlistRes.data || []);

//         // Fetch notifications
//         const notifRes = await getNotifications(visitorId);
//         setNotifications(notifRes.data || []);
//         setHasUnread(notifRes.data?.some(n => !n.isRead));
//       } catch (err) {
//         console.error(err);
//       }
//     } else {
//       // If no visitorId, reset state
//       setVisitorProfile(null);
//       setWishlist([]);
//       setNotifications([]);
//       setHasUnread(false);
//     }
//   };

//   if (isOpen) fetchData(); // only fetch when sidebar opens
// }, [isOpen]);

// console.log("wwwwwww-------------------------wwwwwww", wishlist)
//   // Update visitorIdState if prop changes
//   useEffect(() => {
//     setVisitorIdState(initialVisitorId || Cookies.get("visitorId"));
//   }, [initialVisitorId]);

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorIdState) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorIdState?.visitorId || visitorIdState;
//           const res = await getVisitorProfileById(id);
//           if (res.success) setVisitorProfile(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorIdState]);

//   // Fetch wishlist & notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorIdState) {
//       const id = visitorIdState?.visitorId || visitorIdState;

//       getWishlistData(id)
//         .then(res => setWishlist(res.data || []))
//         .catch(err => console.error(err));

//       getNotifications(id)
//         .then(res => {
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some(n => !n.isRead));
//         })
//         .catch(err => console.error(err));
//     }
//   }, [isOpen, visitorIdState]);

//   // Logout handler
//   // const handleLogout = () => {
//   //   Cookies.remove("visitorId");
//   //   setVisitorProfile(null);
//   //   setWishlist([]);
//   //   setNotifications([]);
//   //   setVisitorIdState(null);
//   // };

//   const handleLogout = () => {
//     Cookies.remove("visitorId");
//     setVisitorProfile(null);
//     setWishlist([]);
//     setNotifications([]);
//     setVisitorIdState(null);

//     if (onLogout) onLogout(); // ✅ notify parent (MenuPage)
//   };

//   // Handle clicks requiring login

//   const handleRequireLogin = () => {
//     if (!visitorIdState) {
//       setAuthOpen(true);  // open AuthModal
//       setIsOpen(false);   // close sidebar
//       onLoginRequired?.();
//     }
//   };
  
  

//   // Navigate to property details
//   // const handleNavigate = (propertyId) => {
//   //   if (!visitorIdState) {
//   //     handleRequireLogin();
//   //   } else {
//   //     navigate(`/office/${propertyId}`);
//   //   }
//   // };

//   const handleNavigate = (property) => {
//     if (!visitorIdState) {
//       handleRequireLogin();
//     } else {
//       navigate(`/office/${property._id}?category=${property.type}`, {
//         state: {
//           relatedProperties: wishlist, // optional, for detail page
//           city: property.location?.city
//         }
//       });
//     }
//   };
  

//   // Auth success handler
//   // const handleAuthSuccess = (userData) => {
//   //   const id = userData.visitorId || Cookies.get("visitorId");
//   //   setVisitorIdState(id);
//   //   setVisitorProfile(userData);
//   //   setAuthOpen(false);
//   // };

//   const handleAuthSuccess = async (userData) => {
//     const id = userData.visitorId || Cookies.get("visitorId");
  
//     setVisitorIdState(id);       // update visitorId
//     setVisitorProfile(userData); // update profile
//     setAuthOpen(false);          // close AuthModal
//     setIsOpen(true);             // open sidebar
  
//     // Immediately fetch wishlist & notifications
//     try {
//       const wishlistRes = await getWishlistData(id);
//       setWishlist(wishlistRes.data || []);
  
//       const notificationsRes = await getNotifications(id);
//       setNotifications(notificationsRes.data || []);
//       setHasUnread(notificationsRes.data?.some(n => !n.isRead));
//     } catch (err) {
//       console.error(err);
//     }
//   };
  
  
  

//   // Sidebar UI
//   const sidebarUI = (
//     <div className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
//       <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
//       <div className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500 hover:text-gray-700">✕</button>
//         </div>

//         {visitorIdState && visitorProfile ? (
//   // ✅ Show visitor profile
//   <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//     <div className="relative w-14 h-14 flex-shrink-0">
//       <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//         {visitorProfile.fullName?.[0] || "V"}
//       </div>
//       {visitorProfile.verified && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
//     </div>

//     <div className="flex-1 flex flex-col justify-center">
//       <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//       <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//       <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//     </div>

//     <button onClick={handleLogout} className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition">Logout</button>
//   </div>
// ) : (
//   // ✅ Show login/register button
//   <div className="mb-6 p-4 flex justify-center">
//     <button
//       onClick={handleRequireLogin}
//       className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//     >
//       Login / Register
//     </button>
//   </div>
// )}


//         {/* Notifications */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h3>
//             <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//               {notifications.map((n) => {
//                 const isUnread = !n.isRead;
//                 const time = n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
//                 return (
//                   <div key={n._id} className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${isUnread ? "bg-green-50 border-green-400 hover:bg-green-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
//                     <div className="flex items-start gap-3">
//                       <MessageCircle className={`w-5 h-5 mt-0.5 ${isUnread ? "text-green-600" : "text-gray-500"}`} />
//                       <p className={`text-sm flex-1 ${isUnread ? "text-green-800 font-medium" : "text-gray-700"}`}>{n.message}</p>
//                     </div>
//                     {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Wishlist */}
//         {visitorIdState && (
//           <div className="mb-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>
//             {wishlist.length === 0 ? (
//               <p className="text-gray-500">No saved spaces yet.</p>
//             ) : (
//               <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                 {wishlist.map((item) => (
//                   item?.property && (
//                     <div
//                       key={item._id}
//                       // onClick={() => handleNavigate(item.property._id)}
//                       onClick={() => handleNavigate(item.property)}

//                       className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//                     >
//                       <img src={item.property.images?.[0] || "/placeholder.png"} alt={item.property.buildingName} className="object-cover w-16 h-16 rounded" />
//                       <div className="flex-1">
//                         <h3 className="text-sm font-semibold text-gray-800">{item.property.buildingName}</h3>
//                         <p className="text-xs text-gray-600">{item.property.location?.city}, {item.property.location?.locationOfProperty}</p>
//                         <span className="text-[12px] text-blue-600 underline">View Details →</span>
//                       </div>
//                     </div>
//                   )
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {/* AuthModal */}
//       <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
//     </div>
//   );

//   return (
//     <>
// <button
//   onClick={() => {
//     setIsOpen(true);    // open sidebar
//     setAuthOpen(false); // reset AuthModal
//   }}
//   className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
// >
//   <FiHeart className="w-5 h-5 text-[#16607B]" />
//   {hasUnread && <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />}
// </button>


//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//=============>>> Old one without Useparams


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react";
// import Cookies from "js-cookie";
// import AuthModal from "../pages/websiteUser/component/AuthModal";

// const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
//   const [authOpen, setAuthOpen] = useState(false);
//   const navigate = useNavigate();


//   // Fetch visitor profile, wishlist & notifications whenever sidebar opens
// useEffect(() => {
//   const fetchData = async () => {
//     const visitorId = Cookies.get("visitorId"); // get latest visitorId
//     setVisitorIdState(visitorId);

//     if (visitorId) {
//       try {
//         // Fetch visitor profile
//         const profileRes = await getVisitorProfileById(visitorId);
//         if (profileRes.success) setVisitorProfile(profileRes.data);

//         // Fetch wishlist
//         const wishlistRes = await getWishlistData(visitorId);
//         setWishlist(wishlistRes.data || []);

//         // Fetch notifications
//         const notifRes = await getNotifications(visitorId);
//         setNotifications(notifRes.data || []);
//         setHasUnread(notifRes.data?.some(n => !n.isRead));
//       } catch (err) {
//         console.error(err);
//       }
//     } else {
//       // If no visitorId, reset state
//       setVisitorProfile(null);
//       setWishlist([]);
//       setNotifications([]);
//       setHasUnread(false);
//     }
//   };

//   if (isOpen) fetchData(); // only fetch when sidebar opens
// }, [isOpen]);


//   // Update visitorIdState if prop changes
//   useEffect(() => {
//     setVisitorIdState(initialVisitorId || Cookies.get("visitorId"));
//   }, [initialVisitorId]);

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorIdState) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorIdState?.visitorId || visitorIdState;
//           const res = await getVisitorProfileById(id);
//           if (res.success) setVisitorProfile(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorIdState]);

//   // Fetch wishlist & notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorIdState) {
//       const id = visitorIdState?.visitorId || visitorIdState;

//       getWishlistData(id)
//         .then(res => setWishlist(res.data || []))
//         .catch(err => console.error(err));

//       getNotifications(id)
//         .then(res => {
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some(n => !n.isRead));
//         })
//         .catch(err => console.error(err));
//     }
//   }, [isOpen, visitorIdState]);

//   // Logout handler
//   // const handleLogout = () => {
//   //   Cookies.remove("visitorId");
//   //   setVisitorProfile(null);
//   //   setWishlist([]);
//   //   setNotifications([]);
//   //   setVisitorIdState(null);
//   // };

//   const handleLogout = () => {
//     Cookies.remove("visitorId");
//     setVisitorProfile(null);
//     setWishlist([]);
//     setNotifications([]);
//     setVisitorIdState(null);

//     if (onLogout) onLogout(); // ✅ notify parent (MenuPage)
//   };

//   // Handle clicks requiring login

//   const handleRequireLogin = () => {
//     if (!visitorIdState) {
//       setAuthOpen(true);  // open AuthModal
//       setIsOpen(false);   // close sidebar
//       onLoginRequired?.();
//     }
//   };
  
  

//   // Navigate to property details
//   const handleNavigate = (propertyId) => {
//     if (!visitorIdState) {
//       handleRequireLogin();
//     } else {
//       navigate(`/office/${propertyId}`);
//     }
//   };

//   // Auth success handler
//   // const handleAuthSuccess = (userData) => {
//   //   const id = userData.visitorId || Cookies.get("visitorId");
//   //   setVisitorIdState(id);
//   //   setVisitorProfile(userData);
//   //   setAuthOpen(false);
//   // };

//   const handleAuthSuccess = async (userData) => {
//     const id = userData.visitorId || Cookies.get("visitorId");
  
//     setVisitorIdState(id);       // update visitorId
//     setVisitorProfile(userData); // update profile
//     setAuthOpen(false);          // close AuthModal
//     setIsOpen(true);             // open sidebar
  
//     // Immediately fetch wishlist & notifications
//     try {
//       const wishlistRes = await getWishlistData(id);
//       setWishlist(wishlistRes.data || []);
  
//       const notificationsRes = await getNotifications(id);
//       setNotifications(notificationsRes.data || []);
//       setHasUnread(notificationsRes.data?.some(n => !n.isRead));
//     } catch (err) {
//       console.error(err);
//     }
//   };
  
  
  

//   // Sidebar UI
//   const sidebarUI = (
//     <div className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
//       <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
//       <div className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500 hover:text-gray-700">✕</button>
//         </div>

//         {visitorIdState && visitorProfile ? (
//   // ✅ Show visitor profile
//   <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//     <div className="relative w-14 h-14 flex-shrink-0">
//       <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//         {visitorProfile.fullName?.[0] || "V"}
//       </div>
//       {visitorProfile.verified && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
//     </div>

//     <div className="flex-1 flex flex-col justify-center">
//       <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//       <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//       <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//     </div>

//     <button onClick={handleLogout} className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition">Logout</button>
//   </div>
// ) : (
//   // ✅ Show login/register button
//   <div className="mb-6 p-4 flex justify-center">
//     <button
//       onClick={handleRequireLogin}
//       className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//     >
//       Login / Register
//     </button>
//   </div>
// )}


//         {/* Notifications */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h3>
//             <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//               {notifications.map((n) => {
//                 const isUnread = !n.isRead;
//                 const time = n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
//                 return (
//                   <div key={n._id} className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${isUnread ? "bg-green-50 border-green-400 hover:bg-green-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
//                     <div className="flex items-start gap-3">
//                       <MessageCircle className={`w-5 h-5 mt-0.5 ${isUnread ? "text-green-600" : "text-gray-500"}`} />
//                       <p className={`text-sm flex-1 ${isUnread ? "text-green-800 font-medium" : "text-gray-700"}`}>{n.message}</p>
//                     </div>
//                     {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Wishlist */}
//         {visitorIdState && (
//           <div className="mb-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>
//             {wishlist.length === 0 ? (
//               <p className="text-gray-500">No saved spaces yet.</p>
//             ) : (
//               <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                 {wishlist.map((item) => (
//                   item?.property && (
//                     <div
//                       key={item._id}
//                       onClick={() => handleNavigate(item.property._id)}
//                       className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//                     >
//                       <img src={item.property.images?.[0] || "/placeholder.png"} alt={item.property.buildingName} className="object-cover w-16 h-16 rounded" />
//                       <div className="flex-1">
//                         <h3 className="text-sm font-semibold text-gray-800">{item.property.buildingName}</h3>
//                         <p className="text-xs text-gray-600">{item.property.location?.city}, {item.property.location?.locationOfProperty}</p>
//                         <span className="text-[12px] text-blue-600 underline">View Details →</span>
//                       </div>
//                     </div>
//                   )
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {/* AuthModal */}
//       <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
//     </div>
//   );

//   return (
//     <>
// <button
//   onClick={() => {
//     setIsOpen(true);    // open sidebar
//     setAuthOpen(false); // reset AuthModal
//   }}
//   className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
// >
//   <FiHeart className="w-5 h-5 text-[#16607B]" />
//   {hasUnread && <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />}
// </button>


//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//=============+>>> Fixing login succes profile


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react";
// import Cookies from "js-cookie";
// import AuthModal from "../pages/websiteUser/component/AuthModal";

// const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
//   const [authOpen, setAuthOpen] = useState(false);
//   const navigate = useNavigate();

//   // Update visitorIdState if prop changes
//   useEffect(() => {
//     setVisitorIdState(initialVisitorId || Cookies.get("visitorId"));
//   }, [initialVisitorId]);

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorIdState) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorIdState?.visitorId || visitorIdState;
//           const res = await getVisitorProfileById(id);
//           if (res.success) setVisitorProfile(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorIdState]);

//   // Fetch wishlist & notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorIdState) {
//       const id = visitorIdState?.visitorId || visitorIdState;

//       getWishlistData(id)
//         .then(res => setWishlist(res.data || []))
//         .catch(err => console.error(err));

//       getNotifications(id)
//         .then(res => {
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some(n => !n.isRead));
//         })
//         .catch(err => console.error(err));
//     }
//   }, [isOpen, visitorIdState]);

//   // Logout handler
//   // const handleLogout = () => {
//   //   Cookies.remove("visitorId");
//   //   setVisitorProfile(null);
//   //   setWishlist([]);
//   //   setNotifications([]);
//   //   setVisitorIdState(null);
//   // };

//   const handleLogout = () => {
//     Cookies.remove("visitorId");
//     setVisitorProfile(null);
//     setWishlist([]);
//     setNotifications([]);
//     setVisitorIdState(null);

//     if (onLogout) onLogout(); // ✅ notify parent (MenuPage)
//   };

//   // Handle clicks requiring login

//   const handleRequireLogin = () => {
//     if (!visitorIdState) {
//       setAuthOpen(true);  // open AuthModal
//       setIsOpen(false);   // close sidebar
//       onLoginRequired?.();
//     }
//   };
  
  

//   // Navigate to property details
//   const handleNavigate = (propertyId) => {
//     if (!visitorIdState) {
//       handleRequireLogin();
//     } else {
//       navigate(`/office/${propertyId}`);
//     }
//   };

//   // Auth success handler
//   const handleAuthSuccess = (userData) => {
//     const id = userData.visitorId || Cookies.get("visitorId");
//     setVisitorIdState(id);
//     setVisitorProfile(userData);
//     setAuthOpen(false);
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
//       <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
//       <div className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500 hover:text-gray-700">✕</button>
//         </div>

//         {/* Visitor Profile / Login */}
//         {visitorIdState && visitorProfile ? (
//           <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//             <div className="relative w-14 h-14 flex-shrink-0">
//               <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//                 {visitorProfile.fullName?.[0] || "V"}
//               </div>
//               {visitorProfile.verified && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
//             </div>

//             <div className="flex-1 flex flex-col justify-center">
//               <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//               <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//               <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//             </div>

//             <button onClick={handleLogout} className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition">Logout</button>
//           </div>
//         ) : (
//           <div className="mb-6 p-4 flex justify-center">
//            <div className="mb-6 p-4 flex justify-center">
//   <button
//     onClick={handleRequireLogin} // ✅ triggers AuthModal
//     className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//   >
//     Login / Register
//   </button>
// </div>

//           </div>
//         )}

//         {/* Notifications */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h3>
//             <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//               {notifications.map((n) => {
//                 const isUnread = !n.isRead;
//                 const time = n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
//                 return (
//                   <div key={n._id} className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${isUnread ? "bg-green-50 border-green-400 hover:bg-green-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
//                     <div className="flex items-start gap-3">
//                       <MessageCircle className={`w-5 h-5 mt-0.5 ${isUnread ? "text-green-600" : "text-gray-500"}`} />
//                       <p className={`text-sm flex-1 ${isUnread ? "text-green-800 font-medium" : "text-gray-700"}`}>{n.message}</p>
//                     </div>
//                     {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Wishlist */}
//         {visitorIdState && (
//           <div className="mb-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>
//             {wishlist.length === 0 ? (
//               <p className="text-gray-500">No saved spaces yet.</p>
//             ) : (
//               <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                 {wishlist.map((item) => (
//                   item?.property && (
//                     <div
//                       key={item._id}
//                       onClick={() => handleNavigate(item.property._id)}
//                       className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//                     >
//                       <img src={item.property.images?.[0] || "/placeholder.png"} alt={item.property.buildingName} className="object-cover w-16 h-16 rounded" />
//                       <div className="flex-1">
//                         <h3 className="text-sm font-semibold text-gray-800">{item.property.buildingName}</h3>
//                         <p className="text-xs text-gray-600">{item.property.location?.city}, {item.property.location?.locationOfProperty}</p>
//                         <span className="text-[12px] text-blue-600 underline">View Details →</span>
//                       </div>
//                     </div>
//                   )
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {/* AuthModal */}
//       <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
//     </div>
//   );

//   return (
//     <>
// <button
//   onClick={() => {
//     setIsOpen(true);    // open sidebar
//     setAuthOpen(false); // reset AuthModal
//   }}
//   className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
// >
//   <FiHeart className="w-5 h-5 text-[#16607B]" />
//   {hasUnread && <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />}
// </button>


//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//=========>> Old fixxing issue
// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react";
// import Cookies from "js-cookie";
// import AuthModal from "../pages/websiteUser/component/AuthModal";

// const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
//   const [authOpen, setAuthOpen] = useState(false);
//   const navigate = useNavigate();

//   // Update visitorIdState if prop changes
//   useEffect(() => {
//     setVisitorIdState(initialVisitorId || Cookies.get("visitorId"));
//   }, [initialVisitorId]);

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorIdState) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorIdState?.visitorId || visitorIdState;
//           const res = await getVisitorProfileById(id);
//           if (res.success) setVisitorProfile(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorIdState]);

//   // Fetch wishlist & notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorIdState) {
//       const id = visitorIdState?.visitorId || visitorIdState;

//       getWishlistData(id)
//         .then(res => setWishlist(res.data || []))
//         .catch(err => console.error(err));

//       getNotifications(id)
//         .then(res => {
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some(n => !n.isRead));
//         })
//         .catch(err => console.error(err));
//     }
//   }, [isOpen, visitorIdState]);

//   // Logout handler
//   // const handleLogout = () => {
//   //   Cookies.remove("visitorId");
//   //   setVisitorProfile(null);
//   //   setWishlist([]);
//   //   setNotifications([]);
//   //   setVisitorIdState(null);
//   // };

//   const handleLogout = () => {
//     Cookies.remove("visitorId");
//     setVisitorProfile(null);
//     setWishlist([]);
//     setNotifications([]);
//     setVisitorIdState(null);

//     if (onLogout) onLogout(); // ✅ notify parent (MenuPage)
//   };

//   // Handle clicks requiring login
//   const handleRequireLogin = () => {
//     if (!visitorIdState) {
//       setIsOpen(false); // ✅ close wishlist sidebar
//       setAuthOpen(true); // ✅ open AuthModal
//       onLoginRequired?.();
//     }
//   };

//   // Navigate to property details
//   const handleNavigate = (propertyId) => {
//     if (!visitorIdState) {
//       handleRequireLogin();
//     } else {
//       navigate(`/office/${propertyId}`);
//     }
//   };

//   // Auth success handler
//   const handleAuthSuccess = (userData) => {
//     const id = userData.visitorId || Cookies.get("visitorId");
//     setVisitorIdState(id);
//     setVisitorProfile(userData);
//     setAuthOpen(false);
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
//       <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
//       <div className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500 hover:text-gray-700">✕</button>
//         </div>

//         {/* Visitor Profile / Login */}
//         {visitorIdState && visitorProfile ? (
//           <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//             <div className="relative w-14 h-14 flex-shrink-0">
//               <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//                 {visitorProfile.fullName?.[0] || "V"}
//               </div>
//               {visitorProfile.verified && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
//             </div>

//             <div className="flex-1 flex flex-col justify-center">
//               <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//               <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//               <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//             </div>

//             <button onClick={handleLogout} className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition">Logout</button>
//           </div>
//         ) : (
//           <div className="mb-6 p-4 flex justify-center">
//             <button
//               onClick={handleRequireLogin}
//               className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               Login / Register
//             </button>
//           </div>
//         )}

//         {/* Notifications */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h3>
//             <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//               {notifications.map((n) => {
//                 const isUnread = !n.isRead;
//                 const time = n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
//                 return (
//                   <div key={n._id} className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${isUnread ? "bg-green-50 border-green-400 hover:bg-green-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
//                     <div className="flex items-start gap-3">
//                       <MessageCircle className={`w-5 h-5 mt-0.5 ${isUnread ? "text-green-600" : "text-gray-500"}`} />
//                       <p className={`text-sm flex-1 ${isUnread ? "text-green-800 font-medium" : "text-gray-700"}`}>{n.message}</p>
//                     </div>
//                     {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Wishlist */}
//         {visitorIdState && (
//           <div className="mb-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>
//             {wishlist.length === 0 ? (
//               <p className="text-gray-500">No saved spaces yet.</p>
//             ) : (
//               <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                 {wishlist.map((item) => (
//                   item?.property && (
//                     <div
//                       key={item._id}
//                       onClick={() => handleNavigate(item.property._id)}
//                       className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//                     >
//                       <img src={item.property.images?.[0] || "/placeholder.png"} alt={item.property.buildingName} className="object-cover w-16 h-16 rounded" />
//                       <div className="flex-1">
//                         <h3 className="text-sm font-semibold text-gray-800">{item.property.buildingName}</h3>
//                         <p className="text-xs text-gray-600">{item.property.location?.city}, {item.property.location?.locationOfProperty}</p>
//                         <span className="text-[12px] text-blue-600 underline">View Details →</span>
//                       </div>
//                     </div>
//                   )
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {/* AuthModal */}
//       <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
//     </div>
//   );

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)} className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300">
//         <FiHeart className="w-5 h-5 text-[#16607B]" />
//         {hasUnread && <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//======>> Old good

// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications, getVisitorProfileById } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react";
// import Cookies from "js-cookie";

// const WishlistSidebar = ({ visitorId: initialVisitorId, onLoginRequired }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId"));
//   const navigate = useNavigate();

//   // Update visitorIdState if prop changes
//   useEffect(() => {
//     setVisitorIdState(initialVisitorId || Cookies.get("visitorId"));
//   }, [initialVisitorId]);

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorIdState) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorIdState?.visitorId || visitorIdState;
//           const res = await getVisitorProfileById(id);
//           if (res.success) setVisitorProfile(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorIdState]);

//   // Fetch wishlist & notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorIdState) {
//       const id = visitorIdState?.visitorId || visitorIdState;

//       getWishlistData(id)
//         .then(res => setWishlist(res.data || []))
//         .catch(err => console.error(err));

//       getNotifications(id)
//         .then(res => {
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some(n => !n.isRead));
//         })
//         .catch(err => console.error(err));
//     }
//   }, [isOpen, visitorIdState]);

//   // Logout handler
//   const handleLogout = () => {
//     Cookies.remove("visitorId");
//     setVisitorProfile(null);
//     setWishlist([]);
//     setNotifications([]);
//     setVisitorIdState(null);
//   };

//   // Handle clicks requiring login
//   const handleRequireLogin = () => {
//     if (!visitorIdState) {
//       onLoginRequired?.();
//     }
//   };

//   // Navigate to property details
//   const handleNavigate = (propertyId) => {
//     if (!visitorIdState) {
//       handleRequireLogin();
//     } else {
//       navigate(`/office/${propertyId}`);
//     }
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
//       <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
//       <div className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500 hover:text-gray-700">✕</button>
//         </div>

//         {/* Visitor Profile / Login */}
//         {visitorIdState && visitorProfile ? (
//           <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//             <div className="relative w-14 h-14 flex-shrink-0">
//               <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//                 {visitorProfile.fullName?.[0] || "V"}
//               </div>
//               {visitorProfile.verified && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
//             </div>

//             <div className="flex-1 flex flex-col justify-center">
//               <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//               <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//               <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//             </div>

//             <button onClick={handleLogout} className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition">Logout</button>
//           </div>
//         ) : (
//           <div className="mb-6 p-4 flex justify-center">
//             <button
//               onClick={handleRequireLogin}
//               className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               Login / Register
//             </button>
//           </div>
//         )}

//         {/* Notifications */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h3>
//             <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//               {notifications.map((n) => {
//                 const isUnread = !n.isRead;
//                 const time = n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
//                 return (
//                   <div key={n._id} className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${isUnread ? "bg-green-50 border-green-400 hover:bg-green-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
//                     <div className="flex items-start gap-3">
//                       <MessageCircle className={`w-5 h-5 mt-0.5 ${isUnread ? "text-green-600" : "text-gray-500"}`} />
//                       <p className={`text-sm flex-1 ${isUnread ? "text-green-800 font-medium" : "text-gray-700"}`}>{n.message}</p>
//                     </div>
//                     {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Wishlist */}
//         {visitorIdState && (
//           <div className="mb-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>
//             {wishlist.length === 0 ? (
//               <p className="text-gray-500">No saved spaces yet.</p>
//             ) : (
//               <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                 {wishlist.map((item) => (
//                   item?.property && (
//                     <div
//                       key={item._id}
//                       onClick={() => handleNavigate(item.property._id)}
//                       className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//                     >
//                       <img src={item.property.images?.[0] || "/placeholder.png"} alt={item.property.buildingName} className="object-cover w-16 h-16 rounded" />
//                       <div className="flex-1">
//                         <h3 className="text-sm font-semibold text-gray-800">{item.property.buildingName}</h3>
//                         <p className="text-xs text-gray-600">{item.property.location?.city}, {item.property.location?.locationOfProperty}</p>
//                         <span className="text-[12px] text-blue-600 underline">View Details →</span>
//                       </div>
//                     </div>
//                   )
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//       </div>
//     </div>
//   );

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)} className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300">
//         <FiHeart className="w-5 h-5 text-[#16607B]" />
//         {hasUnread && <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;









///======>> Updating with props

// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// // import AuthModal from "../components/AuthModal";
// import AuthModal from "../pages/websiteUser/component/AuthModal";
// import { getNotifications } from "../api/services/visitorService";
// import {getVisitorProfileById} from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon
// import Cookies from "js-cookie";

// const WishlistSidebar = ({ visitorId: initialVisitorId, userId ,onLoginRequired}) => {
//   const [authOpen, setAuthOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
  
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId")); // ✅ track visitorId in state
//   const navigate = useNavigate();
//   const [enquiryOpen, setEnquiryOpen] = useState(false);
// const [selectedOfficeId, setSelectedOfficeId] = useState(null);


//   // Update visitorIdState if prop changes
//   useEffect(() => {
//     setVisitorIdState(initialVisitorId || Cookies.get("visitorId"));
//   }, [initialVisitorId]);

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorIdState) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorIdState?.visitorId || visitorIdState;
//           const res = await getVisitorProfileById(id);
//           if (res.success) setVisitorProfile(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorIdState]);

//   // Fetch wishlist & notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorIdState) {
//       const id = visitorIdState?.visitorId || visitorIdState;

//       getWishlistData(id)
//         .then(res => setWishlist(res.data || []))
//         .catch(err => console.error(err));

//       getNotifications(id)
//         .then(res => {
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some(n => !n.isRead));
//         })
//         .catch(err => console.error(err));
//     }
//   }, [isOpen, visitorIdState]);

//   // Logout handler
//   const handleLogout = () => {
//     Cookies.remove("visitorId");         // Remove cookie
//     setVisitorProfile(null);             // Clear profile
//     setWishlist([]);                     // Clear wishlist
//     setNotifications([]);                // Clear notifications
//     setVisitorIdState(null);             // ✅ Update state to trigger UI
//   };

//   // Login/Register handler
//   const handleLogin = () => setAuthOpen(true);
  

//   const handleAuthSuccess = (userData) => {
//     const id = userData.visitorId || Cookies.get("visitorId");
//     setVisitorIdState(id);        // updates sidebar immediately
//     setVisitorProfile(userData);  // shows profile
//     setAuthOpen(false);
    
//     if (selectedOfficeId) {
//       setEnquiryOpen(true);       // optional: open enquiry if needed
//     }
//   };
  
  
  

//   const handleOpenEnquiry = (officeId) => {
//     if (!visitorIdState) {
//       // if not logged in, open auth first
//       setAuthOpen(true);
//       setSelectedOfficeId(officeId); // store the officeId for later
//     } else {
//       setSelectedOfficeId(officeId);
//       setEnquiryOpen(true);
//     }
//   };
  

//   // Sidebar UI
//   const sidebarUI = (
//     <div className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
//       <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
//       <div className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500 hover:text-gray-700">✕</button>
//         </div>

//         {/* Visitor Profile / Login */}
//         {visitorIdState && visitorProfile ? (
//           <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//             {/* Avatar */}
//             <div className="relative w-14 h-14 flex-shrink-0">
//               <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//                 {visitorProfile.fullName?.[0] || "V"}
//               </div>
//               {visitorProfile.verified && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
//             </div>

//             {/* Info */}
//             <div className="flex-1 flex flex-col justify-center">
//               <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//               <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//               <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//             </div>

//             {/* Logout Button */}
//             <button onClick={handleLogout} className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition">Logout</button>
//           </div>
//         ) : (
//           <div className="mb-6 p-4 flex justify-center">
// <button
//   onClick={() => setAuthOpen(true)}
//   className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
// >
//   Login / Register
// </button>


// <AuthModal
//   isOpen={authOpen}
//   onClose={() => setAuthOpen(false)}
//   onAuthSuccess={handleAuthSuccess}
// />

//           </div>
//         )}
// {enquiryOpen && (
//   <EnquiryModal
//     isOpen={enquiryOpen}
//     onClose={() => setEnquiryOpen(false)}
//     officeId={selectedOfficeId}
//     userId={visitorProfile?._id} // optional if you want to assign agent or user
//   />
// )}

//         {/* Notifications & Wishlist Sections */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-6">
//             {/* Notifications code here */}
//             {notifications.length > 0 && (
//   <div className="mb-6">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">
//       Notifications
//     </h3>

//     {/* Scrollable notifications container */}
//     <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {(() => {
//         // find the latest notification
//         const newestTime = notifications.reduce((max, n) => {
//           const t = new Date(n.createdAt).getTime();
//           return t > max ? t : max;
//         }, 0);

//         return notifications.map((n) => {
//           const notificationTime = new Date(n.createdAt).getTime();
//           const isNewest = notificationTime === newestTime;
//           const isUnread = !n.isRead;

//           const time = n.createdAt
//             ? new Date(n.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           // Decide color based on newest/unread
//           let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
//           let textClass = "text-gray-700";
//           let iconClass = "text-gray-500";

//           if (isNewest) {
//             bgClass = "bg-blue-50 border-blue-400 hover:bg-blue-100";
//             textClass = "text-blue-800 font-medium";
//             iconClass = "text-blue-600";
//           } else if (isUnread) {
//             bgClass = "bg-green-50 border-green-400 hover:bg-green-100";
//             textClass = "text-green-800 font-medium";
//             iconClass = "text-green-600";
//           }

//           return (
//             <div
//               key={n._id}
//               className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${bgClass}`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Icon with unread/new dot */}
//                 <div className="relative">
//                   <MessageCircle className={`w-5 h-5 mt-0.5 ${iconClass}`} />
//                   {isUnread && !isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
//                   )}
//                   {isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
//                   )}
//                 </div>

//                 {/* Message */}
//                 <p className={`text-sm leading-snug flex-1 ${textClass}`}>
//                   {n.message}
//                 </p>
//               </div>

//               {/* Time */}
//               {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//             </div>
//           );
//         });
//       })()}
//     </div>
//   </div>
// )}
//           </div>
//         )}
//         {visitorIdState && wishlist.length > 0 && (
//           <div className="mb-4">
//             {/* Wishlist code here */}
//             {wishlist.length === 0 ? (
//   <p className="text-gray-500">No saved spaces yet.</p>
// ) : (
//   <div className="mb-4">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>

//     {/* Scrollable wishlist container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {wishlist.map((item) => {
//         if (!item?.property) return null; // skip broken entries
//         return (
//           <div
//             key={item._id}
//             onClick={() =>
//               handleNavigate(item.property._id, item.property.type)
//             }
//             className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//           >
//             <img
//               src={item?.property?.images?.[0] || "/placeholder.png"}
//               alt={item.property.buildingName}
//               className="object-cover w-16 h-16 rounded"
//             />
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-800">
//                 {item.property.buildingName}
//               </h3>
//               <p className="text-xs text-gray-600">
//                 {item.property.location?.city},{" "}
//                 {item.property.location?.locationOfProperty}
//               </p>
//               <span className="text-[12px] text-blue-600 underline">
//                 View Details →
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)} className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300">
//         <FiHeart className="w-5 h-5 text-[#16607B]" />
//         {hasUnread && <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//================================>>>> Old one 


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import AuthModal from "../components/AuthModal";
// import { getNotifications } from "../api/services/visitorService";
// import {getVisitorProfileById} from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon
// import Cookies from "js-cookie";

// const WishlistSidebar = ({ visitorId: initialVisitorId, userId }) => {
//   const [authOpen, setAuthOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null);
//   const [visitorIdState, setVisitorIdState] = useState(initialVisitorId || Cookies.get("visitorId")); // ✅ track visitorId in state
//   const navigate = useNavigate();

//   // Update visitorIdState if prop changes
//   useEffect(() => {
//     setVisitorIdState(initialVisitorId || Cookies.get("visitorId"));
//   }, [initialVisitorId]);

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorIdState) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorIdState?.visitorId || visitorIdState;
//           const res = await getVisitorProfileById(id);
//           if (res.success) setVisitorProfile(res.data);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorIdState]);

//   // Fetch wishlist & notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorIdState) {
//       const id = visitorIdState?.visitorId || visitorIdState;

//       getWishlistData(id)
//         .then(res => setWishlist(res.data || []))
//         .catch(err => console.error(err));

//       getNotifications(id)
//         .then(res => {
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some(n => !n.isRead));
//         })
//         .catch(err => console.error(err));
//     }
//   }, [isOpen, visitorIdState]);

//   // Logout handler
//   const handleLogout = () => {
//     Cookies.remove("visitorId");         // Remove cookie
//     setVisitorProfile(null);             // Clear profile
//     setWishlist([]);                     // Clear wishlist
//     setNotifications([]);                // Clear notifications
//     setVisitorIdState(null);             // ✅ Update state to trigger UI
//   };

//   // Login/Register handler
//   const handleLogin = () => setAuthOpen(true);

//   // Callback after login/register
//   const handleAuthSuccess = (userData) => {
//     console.log("Logged in user:", userData);
//     setVisitorIdState(userData.visitorId || Cookies.get("visitorId")); // Update state after login
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
//       <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
//       <div className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500 hover:text-gray-700">✕</button>
//         </div>

//         {/* Visitor Profile / Login */}
//         {visitorIdState && visitorProfile ? (
//           <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//             {/* Avatar */}
//             <div className="relative w-14 h-14 flex-shrink-0">
//               <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//                 {visitorProfile.fullName?.[0] || "V"}
//               </div>
//               {visitorProfile.verified && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
//             </div>

//             {/* Info */}
//             <div className="flex-1 flex flex-col justify-center">
//               <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//               <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//               <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//             </div>

//             {/* Logout Button */}
//             <button onClick={handleLogout} className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition">Logout</button>
//           </div>
//         ) : (
//           <div className="mb-6 p-4 flex justify-center">
//             <button onClick={handleLogin} className="px-3 py-2 bg-blue-600 text-white rounded">Login / Register</button>
//             <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
//           </div>
//         )}

//         {/* Notifications & Wishlist Sections */}
//         {visitorIdState && notifications.length > 0 && (
//           <div className="mb-6">
//             {/* Notifications code here */}
//             {notifications.length > 0 && (
//   <div className="mb-6">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">
//       Notifications
//     </h3>

//     {/* Scrollable notifications container */}
//     <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {(() => {
//         // find the latest notification
//         const newestTime = notifications.reduce((max, n) => {
//           const t = new Date(n.createdAt).getTime();
//           return t > max ? t : max;
//         }, 0);

//         return notifications.map((n) => {
//           const notificationTime = new Date(n.createdAt).getTime();
//           const isNewest = notificationTime === newestTime;
//           const isUnread = !n.isRead;

//           const time = n.createdAt
//             ? new Date(n.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           // Decide color based on newest/unread
//           let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
//           let textClass = "text-gray-700";
//           let iconClass = "text-gray-500";

//           if (isNewest) {
//             bgClass = "bg-blue-50 border-blue-400 hover:bg-blue-100";
//             textClass = "text-blue-800 font-medium";
//             iconClass = "text-blue-600";
//           } else if (isUnread) {
//             bgClass = "bg-green-50 border-green-400 hover:bg-green-100";
//             textClass = "text-green-800 font-medium";
//             iconClass = "text-green-600";
//           }

//           return (
//             <div
//               key={n._id}
//               className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${bgClass}`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Icon with unread/new dot */}
//                 <div className="relative">
//                   <MessageCircle className={`w-5 h-5 mt-0.5 ${iconClass}`} />
//                   {isUnread && !isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
//                   )}
//                   {isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
//                   )}
//                 </div>

//                 {/* Message */}
//                 <p className={`text-sm leading-snug flex-1 ${textClass}`}>
//                   {n.message}
//                 </p>
//               </div>

//               {/* Time */}
//               {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//             </div>
//           );
//         });
//       })()}
//     </div>
//   </div>
// )}

//           </div>
//         )}

//         {visitorIdState && wishlist.length > 0 && (
//           <div className="mb-4">
//             {/* Wishlist code here */}
//             {wishlist.length === 0 ? (
//   <p className="text-gray-500">No saved spaces yet.</p>
// ) : (
//   <div className="mb-4">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>

//     {/* Scrollable wishlist container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {wishlist.map((item) => {
//         if (!item?.property) return null; // skip broken entries
//         return (
//           <div
//             key={item._id}
//             onClick={() =>
//               handleNavigate(item.property._id, item.property.type)
//             }
//             className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//           >
//             <img
//               src={item?.property?.images?.[0] || "/placeholder.png"}
//               alt={item.property.buildingName}
//               className="object-cover w-16 h-16 rounded"
//             />
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-800">
//                 {item.property.buildingName}
//               </h3>
//               <p className="text-xs text-gray-600">
//                 {item.property.location?.city},{" "}
//                 {item.property.location?.locationOfProperty}
//               </p>
//               <span className="text-[12px] text-blue-600 underline">
//                 View Details →
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)} className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300">
//         <FiHeart className="w-5 h-5 text-[#16607B]" />
//         {hasUnread && <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//====>> Old 2



// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import AuthModal from "../components/AuthModal";
// import { getNotifications } from "../api/services/visitorService";
// import {getVisitorProfileById} from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon
// import Cookies from "js-cookie";

// const WishlistSidebar = ({ visitorId, userId }) => {
//   const [authOpen, setAuthOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null); // ✅ new state
//   const navigate = useNavigate();


//    // Check login on component mount

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorId) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId;
//           const res = await getVisitorProfileById(id);
//           if (res.success) {
//             setVisitorProfile(res.data);
//           }
//         } catch (error) {
//           console.error("Error fetching visitor profile:", error);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorId]);

//   // Fetch wishlist when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const fetchWishlist = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId;
//           const res = await getWishlistData(id);
//           setWishlist(res.data || []);
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       };
//       fetchWishlist();
//     }
//   }, [isOpen, visitorId]);

//   // Fetch notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const id = visitorId?.visitorId || visitorId;
//       const fetchNotifications = async () => {
//         try {
//           const res = await getNotifications(id);
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some((n) => !n.isRead));
//         } catch (error) {
//           console.error("Error fetching notifications:", error);
//         }
//       };
//       fetchNotifications();
//     }
//   }, [isOpen, visitorId]);


//   // Logout handler
// // const handleLogout = () => {
// //   Cookies.remove("visitorId");       // ✅ Remove visitorId from cookies
// //   setVisitorProfile(null);           // ✅ Clear profile state
// //   setWishlist([]);                   // ✅ Clear wishlist
// //   setNotifications([]);              // ✅ Clear notifications
// //   setIsOpen(false);                  // ✅ Close sidebar
// //   navigate("/");                     // ✅ Redirect to home page
// // };


// const handleLogout = () => {
//   Cookies.remove("visitorId"); // remove visitorId from cookies
//   setVisitorProfile(null); // clear profile from state
//   // optional: close sidebar or redirect
//   // navigate("/login"); 
// };

// const handleLogin = () => {
//   // navigate("/login"); // redirect to login page
// };

//   // Navigate to office detail
//   const handleNavigate = (propertyId, type) => {
//     setIsOpen(false);
//     navigate(`/office/${propertyId}?category=${type}`);
//   };

//    // callback when login/register success
//    const handleAuthSuccess = (userData) => {
//     // e.g., update visitor profile state, re-fetch wishlist, etc.
//     console.log("Logged in user:", userData);
//     // you can trigger fetch of profile and wishlist here
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="flex-1 bg-black bg-opacity-50"
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar */}
//       <div
//         className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-xl text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>


// {/* Visitor Profile */}
// {visitorId || Cookies.get("visitorId") ? (
//   visitorProfile && (
//     <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//       {/* Avatar */}
//       <div className="relative w-14 h-14 flex-shrink-0">
//         <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//           {visitorProfile.fullName?.[0] || "V"}
//         </div>
//         {visitorProfile.verified && (
//           <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">
//             ✓
//           </span>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex-1 flex flex-col justify-center">
//         <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//         <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//         <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//       </div>

//       {/* Logout Button */}
//       <button
//         onClick={handleLogout}
//         className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition"
//       >
//         Logout
//       </button>
//     </div>
//   )
// ) : (
//   <div className="mb-6 p-4 flex justify-center">
//     {/* <button
//       onClick={handleLogin}
//       className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm shadow-md transition"
//     >
//       Login
//     </button> */}
//      <button onClick={() => setAuthOpen(true)} className="px-3 py-2 bg-blue-600 text-white rounded">
//         Login / Register
//       </button>

//       <AuthModal
//         isOpen={authOpen}
//         onClose={() => setAuthOpen(false)}
//         onAuthSuccess={handleAuthSuccess}
//       />
//   </div>
// )}



//         {/* Notifications Section */}
//   {/* Notifications Section */}
// {notifications.length > 0 && (
//   <div className="mb-6">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">
//       Notifications
//     </h3>

//     {/* Scrollable notifications container */}
//     <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {(() => {
//         // find the latest notification
//         const newestTime = notifications.reduce((max, n) => {
//           const t = new Date(n.createdAt).getTime();
//           return t > max ? t : max;
//         }, 0);

//         return notifications.map((n) => {
//           const notificationTime = new Date(n.createdAt).getTime();
//           const isNewest = notificationTime === newestTime;
//           const isUnread = !n.isRead;

//           const time = n.createdAt
//             ? new Date(n.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           // Decide color based on newest/unread
//           let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
//           let textClass = "text-gray-700";
//           let iconClass = "text-gray-500";

//           if (isNewest) {
//             bgClass = "bg-blue-50 border-blue-400 hover:bg-blue-100";
//             textClass = "text-blue-800 font-medium";
//             iconClass = "text-blue-600";
//           } else if (isUnread) {
//             bgClass = "bg-green-50 border-green-400 hover:bg-green-100";
//             textClass = "text-green-800 font-medium";
//             iconClass = "text-green-600";
//           }

//           return (
//             <div
//               key={n._id}
//               className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${bgClass}`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Icon with unread/new dot */}
//                 <div className="relative">
//                   <MessageCircle className={`w-5 h-5 mt-0.5 ${iconClass}`} />
//                   {isUnread && !isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
//                   )}
//                   {isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
//                   )}
//                 </div>

//                 {/* Message */}
//                 <p className={`text-sm leading-snug flex-1 ${textClass}`}>
//                   {n.message}
//                 </p>
//               </div>

//               {/* Time */}
//               {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//             </div>
//           );
//         });
//       })()}
//     </div>
//   </div>
// )}



//         {/* Wishlist Items */}
//       {/* Wishlist Items */}
// {wishlist.length === 0 ? (
//   <p className="text-gray-500">No saved spaces yet.</p>
// ) : (
//   <div className="mb-4">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>

//     {/* Scrollable wishlist container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {wishlist.map((item) => {
//         if (!item?.property) return null; // skip broken entries
//         return (
//           <div
//             key={item._id}
//             onClick={() =>
//               handleNavigate(item.property._id, item.property.type)
//             }
//             className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//           >
//             <img
//               src={item?.property?.images?.[0] || "/placeholder.png"}
//               alt={item.property.buildingName}
//               className="object-cover w-16 h-16 rounded"
//             />
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-800">
//                 {item.property.buildingName}
//               </h3>
//               <p className="text-xs text-gray-600">
//                 {item.property.location?.city},{" "}
//                 {item.property.location?.locationOfProperty}
//               </p>
//               <span className="text-[12px] text-blue-600 underline">
//                 View Details →
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
//       >
//         <FiHeart className="w-5 h-5 text-[#16607B]" />
//         {hasUnread && (
//           <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />
//         )}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//=====>> Old alla re working as expected 


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import AuthModal from "../components/AuthModal";
// import { getNotifications } from "../api/services/visitorService";
// import {getVisitorProfileById} from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon
// import Cookies from "js-cookie";

// const WishlistSidebar = ({ visitorId, userId }) => {
//   const [authOpen, setAuthOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null); // ✅ new state
//   const navigate = useNavigate();


//    // Check login on component mount

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorId) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId;
//           const res = await getVisitorProfileById(id);
//           if (res.success) {
//             setVisitorProfile(res.data);
//           }
//         } catch (error) {
//           console.error("Error fetching visitor profile:", error);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorId]);

//   // Fetch wishlist when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const fetchWishlist = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId;
//           const res = await getWishlistData(id);
//           setWishlist(res.data || []);
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       };
//       fetchWishlist();
//     }
//   }, [isOpen, visitorId]);

//   // Fetch notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const id = visitorId?.visitorId || visitorId;
//       const fetchNotifications = async () => {
//         try {
//           const res = await getNotifications(id);
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some((n) => !n.isRead));
//         } catch (error) {
//           console.error("Error fetching notifications:", error);
//         }
//       };
//       fetchNotifications();
//     }
//   }, [isOpen, visitorId]);


//   // Logout handler
// // const handleLogout = () => {
// //   Cookies.remove("visitorId");       // ✅ Remove visitorId from cookies
// //   setVisitorProfile(null);           // ✅ Clear profile state
// //   setWishlist([]);                   // ✅ Clear wishlist
// //   setNotifications([]);              // ✅ Clear notifications
// //   setIsOpen(false);                  // ✅ Close sidebar
// //   navigate("/");                     // ✅ Redirect to home page
// // };


// const handleLogout = () => {
//   Cookies.remove("visitorId"); // remove visitorId from cookies
//   setVisitorProfile(null); // clear profile from state
//   // optional: close sidebar or redirect
//   // navigate("/login"); 
// };

// const handleLogin = () => {
//   // navigate("/login"); // redirect to login page
// };

//   // Navigate to office detail
//   const handleNavigate = (propertyId, type) => {
//     setIsOpen(false);
//     navigate(`/office/${propertyId}?category=${type}`);
//   };

//    // callback when login/register success
//    const handleAuthSuccess = (userData) => {
//     // e.g., update visitor profile state, re-fetch wishlist, etc.
//     console.log("Logged in user:", userData);
//     // you can trigger fetch of profile and wishlist here
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="flex-1 bg-black bg-opacity-50"
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar */}
//       <div
//         className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-xl text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>


// {/* Visitor Profile */}
// {visitorId || Cookies.get("visitorId") ? (
//   visitorProfile && (
//     <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//       {/* Avatar */}
//       <div className="relative w-14 h-14 flex-shrink-0">
//         <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//           {visitorProfile.fullName?.[0] || "V"}
//         </div>
//         {visitorProfile.verified && (
//           <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">
//             ✓
//           </span>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex-1 flex flex-col justify-center">
//         <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//         <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//         <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//       </div>

//       {/* Logout Button */}
//       <button
//         onClick={handleLogout}
//         className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition"
//       >
//         Logout
//       </button>
//     </div>
//   )
// ) : (
//   <div className="mb-6 p-4 flex justify-center">
//     {/* <button
//       onClick={handleLogin}
//       className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm shadow-md transition"
//     >
//       Login
//     </button> */}
//      <button onClick={() => setAuthOpen(true)} className="px-3 py-2 bg-blue-600 text-white rounded">
//         Login / Register
//       </button>

//       <AuthModal
//         isOpen={authOpen}
//         onClose={() => setAuthOpen(false)}
//         onAuthSuccess={handleAuthSuccess}
//       />
//   </div>
// )}



//         {/* Notifications Section */}
//   {/* Notifications Section */}
// {notifications.length > 0 && (
//   <div className="mb-6">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">
//       Notifications
//     </h3>

//     {/* Scrollable notifications container */}
//     <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {(() => {
//         // find the latest notification
//         const newestTime = notifications.reduce((max, n) => {
//           const t = new Date(n.createdAt).getTime();
//           return t > max ? t : max;
//         }, 0);

//         return notifications.map((n) => {
//           const notificationTime = new Date(n.createdAt).getTime();
//           const isNewest = notificationTime === newestTime;
//           const isUnread = !n.isRead;

//           const time = n.createdAt
//             ? new Date(n.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           // Decide color based on newest/unread
//           let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
//           let textClass = "text-gray-700";
//           let iconClass = "text-gray-500";

//           if (isNewest) {
//             bgClass = "bg-blue-50 border-blue-400 hover:bg-blue-100";
//             textClass = "text-blue-800 font-medium";
//             iconClass = "text-blue-600";
//           } else if (isUnread) {
//             bgClass = "bg-green-50 border-green-400 hover:bg-green-100";
//             textClass = "text-green-800 font-medium";
//             iconClass = "text-green-600";
//           }

//           return (
//             <div
//               key={n._id}
//               className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${bgClass}`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Icon with unread/new dot */}
//                 <div className="relative">
//                   <MessageCircle className={`w-5 h-5 mt-0.5 ${iconClass}`} />
//                   {isUnread && !isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
//                   )}
//                   {isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
//                   )}
//                 </div>

//                 {/* Message */}
//                 <p className={`text-sm leading-snug flex-1 ${textClass}`}>
//                   {n.message}
//                 </p>
//               </div>

//               {/* Time */}
//               {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//             </div>
//           );
//         });
//       })()}
//     </div>
//   </div>
// )}



//         {/* Wishlist Items */}
//       {/* Wishlist Items */}
// {wishlist.length === 0 ? (
//   <p className="text-gray-500">No saved spaces yet.</p>
// ) : (
//   <div className="mb-4">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>

//     {/* Scrollable wishlist container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {wishlist.map((item) => {
//         if (!item?.property) return null; // skip broken entries
//         return (
//           <div
//             key={item._id}
//             onClick={() =>
//               handleNavigate(item.property._id, item.property.type)
//             }
//             className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//           >
//             <img
//               src={item?.property?.images?.[0] || "/placeholder.png"}
//               alt={item.property.buildingName}
//               className="object-cover w-16 h-16 rounded"
//             />
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-800">
//                 {item.property.buildingName}
//               </h3>
//               <p className="text-xs text-gray-600">
//                 {item.property.location?.city},{" "}
//                 {item.property.location?.locationOfProperty}
//               </p>
//               <span className="text-[12px] text-blue-600 underline">
//                 View Details →
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
//       >
//         <FiHeart className="w-5 h-5 text-[#16607B]" />
//         {hasUnread && (
//           <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />
//         )}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;








//==================================>>>> implementing login flow


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications } from "../api/services/visitorService";
// import {getVisitorProfileById} from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon
// import Cookies from "js-cookie";

// const WishlistSidebar = ({ visitorId, userId }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [visitorProfile, setVisitorProfile] = useState(null); // ✅ new state
//   const navigate = useNavigate();


//    // Check login on component mount

//   // Fetch visitor profile
//   useEffect(() => {
//     if (visitorId) {
//       const fetchVisitorProfile = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId;
//           const res = await getVisitorProfileById(id);
//           if (res.success) {
//             setVisitorProfile(res.data);
//           }
//         } catch (error) {
//           console.error("Error fetching visitor profile:", error);
//         }
//       };
//       fetchVisitorProfile();
//     }
//   }, [visitorId]);

//   // Fetch wishlist when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const fetchWishlist = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId;
//           const res = await getWishlistData(id);
//           setWishlist(res.data || []);
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       };
//       fetchWishlist();
//     }
//   }, [isOpen, visitorId]);

//   // Fetch notifications when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const id = visitorId?.visitorId || visitorId;
//       const fetchNotifications = async () => {
//         try {
//           const res = await getNotifications(id);
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some((n) => !n.isRead));
//         } catch (error) {
//           console.error("Error fetching notifications:", error);
//         }
//       };
//       fetchNotifications();
//     }
//   }, [isOpen, visitorId]);


//   // Logout handler
// // const handleLogout = () => {
// //   Cookies.remove("visitorId");       // ✅ Remove visitorId from cookies
// //   setVisitorProfile(null);           // ✅ Clear profile state
// //   setWishlist([]);                   // ✅ Clear wishlist
// //   setNotifications([]);              // ✅ Clear notifications
// //   setIsOpen(false);                  // ✅ Close sidebar
// //   navigate("/");                     // ✅ Redirect to home page
// // };


// const handleLogout = () => {
//   Cookies.remove("visitorId"); // remove visitorId from cookies
//   setVisitorProfile(null); // clear profile from state
//   // optional: close sidebar or redirect
//   // navigate("/login"); 
// };

// const handleLogin = () => {
//   // navigate("/login"); // redirect to login page
// };

//   // Navigate to office detail
//   const handleNavigate = (propertyId, type) => {
//     setIsOpen(false);
//     navigate(`/office/${propertyId}?category=${type}`);
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="flex-1 bg-black bg-opacity-50"
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar */}
//       <div
//         className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-xl text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>


// {/* Visitor Profile */}
// {visitorId || Cookies.get("visitorId") ? (
//   visitorProfile && (
//     <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md flex items-center gap-4">
//       {/* Avatar */}
//       <div className="relative w-14 h-14 flex-shrink-0">
//         <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
//           {visitorProfile.fullName?.[0] || "V"}
//         </div>
//         {visitorProfile.verified && (
//           <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] font-bold">
//             ✓
//           </span>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex-1 flex flex-col justify-center">
//         <p className="text-md font-semibold text-gray-800">{visitorProfile.fullName}</p>
//         <p className="text-sm text-gray-500 truncate">{visitorProfile.email}</p>
//         <p className="text-sm text-gray-500">{visitorProfile.mobile}</p>
//       </div>

//       {/* Logout Button */}
//       <button
//         onClick={handleLogout}
//         className="ml-auto text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm shadow-md transition"
//       >
//         Logout
//       </button>
//     </div>
//   )
// ) : (
//   <div className="mb-6 p-4 flex justify-center">
//     <button
//       onClick={handleLogin}
//       className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm shadow-md transition"
//     >
//       Login
//     </button>
//   </div>
// )}



//         {/* Notifications Section */}
//   {/* Notifications Section */}
// {notifications.length > 0 && (
//   <div className="mb-6">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">
//       Notifications
//     </h3>

//     {/* Scrollable notifications container */}
//     <div className="h-[200px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {(() => {
//         // find the latest notification
//         const newestTime = notifications.reduce((max, n) => {
//           const t = new Date(n.createdAt).getTime();
//           return t > max ? t : max;
//         }, 0);

//         return notifications.map((n) => {
//           const notificationTime = new Date(n.createdAt).getTime();
//           const isNewest = notificationTime === newestTime;
//           const isUnread = !n.isRead;

//           const time = n.createdAt
//             ? new Date(n.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           // Decide color based on newest/unread
//           let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
//           let textClass = "text-gray-700";
//           let iconClass = "text-gray-500";

//           if (isNewest) {
//             bgClass = "bg-blue-50 border-blue-400 hover:bg-blue-100";
//             textClass = "text-blue-800 font-medium";
//             iconClass = "text-blue-600";
//           } else if (isUnread) {
//             bgClass = "bg-green-50 border-green-400 hover:bg-green-100";
//             textClass = "text-green-800 font-medium";
//             iconClass = "text-green-600";
//           }

//           return (
//             <div
//               key={n._id}
//               className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${bgClass}`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Icon with unread/new dot */}
//                 <div className="relative">
//                   <MessageCircle className={`w-5 h-5 mt-0.5 ${iconClass}`} />
//                   {isUnread && !isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
//                   )}
//                   {isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
//                   )}
//                 </div>

//                 {/* Message */}
//                 <p className={`text-sm leading-snug flex-1 ${textClass}`}>
//                   {n.message}
//                 </p>
//               </div>

//               {/* Time */}
//               {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//             </div>
//           );
//         });
//       })()}
//     </div>
//   </div>
// )}



//         {/* Wishlist Items */}
//       {/* Wishlist Items */}
// {wishlist.length === 0 ? (
//   <p className="text-gray-500">No saved spaces yet.</p>
// ) : (
//   <div className="mb-4">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>

//     {/* Scrollable wishlist container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {wishlist.map((item) => {
//         if (!item?.property) return null; // skip broken entries
//         return (
//           <div
//             key={item._id}
//             onClick={() =>
//               handleNavigate(item.property._id, item.property.type)
//             }
//             className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//           >
//             <img
//               src={item?.property?.images?.[0] || "/placeholder.png"}
//               alt={item.property.buildingName}
//               className="object-cover w-16 h-16 rounded"
//             />
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-800">
//                 {item.property.buildingName}
//               </h3>
//               <p className="text-xs text-gray-600">
//                 {item.property.location?.city},{" "}
//                 {item.property.location?.locationOfProperty}
//               </p>
//               <span className="text-[12px] text-blue-600 underline">
//                 View Details →
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
//       >
//         <FiHeart className="w-5 h-5 text-[#16607B]" />
//         {hasUnread && (
//           <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />
//         )}
//       </button>
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;









//==========>>> Both wishlist and notification scroll done working on profile 





// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon

// const WishlistSidebar = ({ visitorId, userId }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const navigate = useNavigate();

//   // Fetch wishlist when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const fetchWishlist = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId; // ✅ ensure string
//           const res = await getWishlistData(id);
//           setWishlist(res.data || []);
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       };
//       fetchWishlist();
//     }
//   }, [isOpen, visitorId]);

//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const id = visitorId?.visitorId || visitorId;
//       const fetchNotifications = async () => {
//         try {
//           const res = await getNotifications(id);
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some((n) => !n.isRead));
//         } catch (error) {
//           console.error("Error fetching notifications:", error);
//         }
//       };
//       fetchNotifications();
//     }
//   }, [isOpen, visitorId]); // ✅ instead of userId
  

//   // Navigate to office detail with type as category
//   const handleNavigate = (propertyId, type) => {
//     setIsOpen(false); // close sidebar
//     navigate(`/office/${propertyId}?category=${type}`);
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="flex-1 bg-black bg-opacity-50"
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar */}
//       <div
//         className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces123</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-xl text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

// {/* Notifications Section */}
// {notifications.length > 0 && (
//   <div className="mb-6">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">
//       Notifications
//     </h3>

//     {/* Scrollable notifications container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {(() => {
//         // find the latest notification
//         const newestTime = notifications.reduce((max, n) => {
//           const t = new Date(n.createdAt).getTime();
//           return t > max ? t : max;
//         }, 0);

//         return notifications.map((n) => {
//           const notificationTime = new Date(n.createdAt).getTime();
//           const isNewest = notificationTime === newestTime;
//           const isUnread = !n.isRead;

//           const time = n.createdAt
//             ? new Date(n.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           // Decide color based on newest/unread
//           let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
//           let textClass = "text-gray-700";
//           let iconClass = "text-gray-500";

//           if (isNewest) {
//             bgClass = "bg-blue-50 border-blue-400 hover:bg-blue-100";
//             textClass = "text-blue-800 font-medium";
//             iconClass = "text-blue-600";
//           } else if (isUnread) {
//             bgClass = "bg-green-50 border-green-400 hover:bg-green-100";
//             textClass = "text-green-800 font-medium";
//             iconClass = "text-green-600";
//           }

//           return (
//             <div
//               key={n._id}
//               className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${bgClass}`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Icon with unread/new dot */}
//                 <div className="relative">
//                   <MessageCircle className={`w-5 h-5 mt-0.5 ${iconClass}`} />
//                   {isUnread && !isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
//                   )}
//                   {isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
//                   )}
//                 </div>

//                 {/* Message */}
//                 <p className={`text-sm leading-snug flex-1 ${textClass}`}>
//                   {n.message}
//                 </p>
//               </div>

//               {/* Time */}
//               {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//             </div>
//           );
//         });
//       })()}
//     </div>
//   </div>
// )}



//         {/* Wishlist Items */}
//       {/* Wishlist Items */}
// {wishlist.length === 0 ? (
//   <p className="text-gray-500">No saved spaces yet.</p>
// ) : (
//   <div className="mb-4">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>

//     {/* Scrollable wishlist container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {wishlist.map((item) => {
//         if (!item?.property) return null; // skip broken entries
//         return (
//           <div
//             key={item._id}
//             onClick={() =>
//               handleNavigate(item.property._id, item.property.type)
//             }
//             className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//           >
//             <img
//               src={item?.property?.images?.[0] || "/placeholder.png"}
//               alt={item.property.buildingName}
//               className="object-cover w-16 h-16 rounded"
//             />
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-800">
//                 {item.property.buildingName}
//               </h3>
//               <p className="text-xs text-gray-600">
//                 {item.property.location?.city},{" "}
//                 {item.property.location?.locationOfProperty}
//               </p>
//               <span className="text-[12px] text-blue-600 underline">
//                 View Details →
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}

//       </div>
//     </div>
//   );

//   return (
//     <>
//     {/* User Button in Header */}
//     <button
//       onClick={() => setIsOpen(true)}
//       className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
//     >
//       <FiHeart className="w-5 h-5 text-[#16607B]" /> {/* 👈 smaller, clean heart icon */}
//       {hasUnread && (
//         <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />
//       )}
//     </button>

//     {/* Render Sidebar in portal */}
//     {createPortal(sidebarUI, document.body)}
//   </>
//   );
// };

// export default WishlistSidebar;








//====================================>>>>> All are good and updated 


// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon

// const WishlistSidebar = ({ visitorId, userId }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const navigate = useNavigate();

//   // Fetch wishlist when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const fetchWishlist = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId; // ✅ ensure string
//           const res = await getWishlistData(id);
//           setWishlist(res.data || []);
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       };
//       fetchWishlist();
//     }
//   }, [isOpen, visitorId]);

//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const id = visitorId?.visitorId || visitorId;
//       const fetchNotifications = async () => {
//         try {
//           const res = await getNotifications(id);
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some((n) => !n.isRead));
//         } catch (error) {
//           console.error("Error fetching notifications:", error);
//         }
//       };
//       fetchNotifications();
//     }
//   }, [isOpen, visitorId]); // ✅ instead of userId
  

//   // Navigate to office detail with type as category
//   const handleNavigate = (propertyId, type) => {
//     setIsOpen(false); // close sidebar
//     navigate(`/office/${propertyId}?category=${type}`);
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="flex-1 bg-black bg-opacity-50"
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar */}
//       <div
//         className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces123</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-xl text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

// {/* Notifications Section */}
// {notifications.length > 0 && (
//   <div className="mb-6">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">
//       Notifications
//     </h3>

//     {/* Scrollable notifications container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {(() => {
//         // find the latest notification
//         const newestTime = notifications.reduce((max, n) => {
//           const t = new Date(n.createdAt).getTime();
//           return t > max ? t : max;
//         }, 0);

//         return notifications.map((n) => {
//           const notificationTime = new Date(n.createdAt).getTime();
//           const isNewest = notificationTime === newestTime;
//           const isUnread = !n.isRead;

//           const time = n.createdAt
//             ? new Date(n.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           // Decide color based on newest/unread
//           let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
//           let textClass = "text-gray-700";
//           let iconClass = "text-gray-500";

//           if (isNewest) {
//             bgClass = "bg-blue-50 border-blue-400 hover:bg-blue-100";
//             textClass = "text-blue-800 font-medium";
//             iconClass = "text-blue-600";
//           } else if (isUnread) {
//             bgClass = "bg-green-50 border-green-400 hover:bg-green-100";
//             textClass = "text-green-800 font-medium";
//             iconClass = "text-green-600";
//           }

//           return (
//             <div
//               key={n._id}
//               className={`flex flex-col gap-1 p-3 border rounded-lg shadow-sm transition cursor-pointer ${bgClass}`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* Icon with unread/new dot */}
//                 <div className="relative">
//                   <MessageCircle className={`w-5 h-5 mt-0.5 ${iconClass}`} />
//                   {isUnread && !isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
//                   )}
//                   {isNewest && (
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
//                   )}
//                 </div>

//                 {/* Message */}
//                 <p className={`text-sm leading-snug flex-1 ${textClass}`}>
//                   {n.message}
//                 </p>
//               </div>

//               {/* Time */}
//               {time && <span className="ml-8 text-xs text-gray-400 self-start">{time}</span>}
//             </div>
//           );
//         });
//       })()}
//     </div>
//   </div>
// )}



//         {/* Wishlist Items */}
//       {/* Wishlist Items */}
// {wishlist.length === 0 ? (
//   <p className="text-gray-500">No saved spaces yet.</p>
// ) : (
//   <div className="mb-4">
//     <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Spaces</h3>

//     {/* Scrollable wishlist container */}
//     <div className="h-[300px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//       {wishlist.map((item) => {
//         if (!item?.property) return null; // skip broken entries
//         return (
//           <div
//             key={item._id}
//             onClick={() =>
//               handleNavigate(item.property._id, item.property.type)
//             }
//             className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
//           >
//             <img
//               src={item?.property?.images?.[0] || "/placeholder.png"}
//               alt={item.property.buildingName}
//               className="object-cover w-16 h-16 rounded"
//             />
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-800">
//                 {item.property.buildingName}
//               </h3>
//               <p className="text-xs text-gray-600">
//                 {item.property.location?.city},{" "}
//                 {item.property.location?.locationOfProperty}
//               </p>
//               <span className="text-[12px] text-blue-600 underline">
//                 View Details →
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// )}

//       </div>
//     </div>
//   );

//   return (
//     <>
//     {/* User Button in Header */}
//     <button
//       onClick={() => setIsOpen(true)}
//       className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
//     >
//       <FiHeart className="w-5 h-5 text-[#16607B]" /> {/* 👈 smaller, clean heart icon */}
//       {hasUnread && (
//         <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />
//       )}
//     </button>

//     {/* Render Sidebar in portal */}
//     {createPortal(sidebarUI, document.body)}
//   </>
//   );
// };

// export default WishlistSidebar;








//----------------->> Updating new 




// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FiHeart } from "react-icons/fi"; // 👈 add this
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon

// const WishlistSidebar = ({ visitorId, userId }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const navigate = useNavigate();

//   // Fetch wishlist when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const fetchWishlist = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId; // ✅ ensure string
//           const res = await getWishlistData(id);
//           setWishlist(res.data || []);
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       };
//       fetchWishlist();
//     }
//   }, [isOpen, visitorId]);

//   // Fetch notifications when sidebar opens
//   // useEffect(() => {
//   //   if (isOpen && visitorId) {
//   //     const id = visitorId?.visitorId || visitorId; 
//   //     const fetchNotifications = async () => {
//   //       try {
//   //         const res = await getNotifications(id);
//   //         setNotifications(res.data || []);
//   //         setHasUnread(res.data?.some((n) => !n.isRead));
//   //       } catch (error) {
//   //         console.error("Error fetching notifications:", error);
//   //       }
//   //     };
//   //     fetchNotifications();
//   //   }
//   // }, [isOpen, userId]);

//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const id = visitorId?.visitorId || visitorId;
//       const fetchNotifications = async () => {
//         try {
//           const res = await getNotifications(id);
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some((n) => !n.isRead));
//         } catch (error) {
//           console.error("Error fetching notifications:", error);
//         }
//       };
//       fetchNotifications();
//     }
//   }, [isOpen, visitorId]); // ✅ instead of userId
  

//   // Navigate to office detail with type as category
//   const handleNavigate = (propertyId, type) => {
//     setIsOpen(false); // close sidebar
//     navigate(`/office/${propertyId}?category=${type}`);
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="flex-1 bg-black bg-opacity-50"
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar */}
//       <div
//         className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces123</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-xl text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Notifications Section */}
//         {notifications.length > 0 && (
//           <div className="mb-6 space-y-2">
//             <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
//             {notifications.map((n) => (
//               <div
//                 key={n._id}
//                 className="flex items-center gap-3 p-3 bg-green-100 rounded-lg shadow-sm"
//               >
//                 <MessageCircle className="w-5 h-5 text-green-600" />
//                 <p className="text-sm text-gray-800">{n.message}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Wishlist Items */}
//         {wishlist.length === 0 ? (
//           <p className="text-gray-500">No saved spaces yet.</p>
//         ) : (
//           <div className="space-y-4">
//         {wishlist.map((item) => {
//   if (!item?.property) return null; // skip broken entries
//   return (
//     <div
//       key={item._id}
//       onClick={() =>
//         handleNavigate(item.property._id, item.property.type)
//       }
//       className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50"
//     >
//       <img
//         src={item?.property?.images?.[0] || "/placeholder.png"}
//         alt={item.property.buildingName}
//         className="object-cover w-16 h-16 rounded"
//       />
//       <div className="flex-1">
//         <h3 className="text-sm font-semibold text-gray-800">
//           {item.property.buildingName}
//         </h3>
//         <p className="text-xs text-gray-600">
//           {item.property.location?.city},{" "}
//           {item.property.location?.locationOfProperty}
//         </p>
//         <span className="text-[12px] text-blue-600 underline">
//           View Details →
//         </span>
//       </div>
//     </div>
//   );
// })}

//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//     {/* User Button in Header */}
//     <button
//       onClick={() => setIsOpen(true)}
//       className="relative p-1.5 bg-gray-200 rounded-full hover:bg-gray-300"
//     >
//       <FiHeart className="w-5 h-5 text-[#16607B]" /> {/* 👈 smaller, clean heart icon */}
//       {hasUnread && (
//         <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />
//       )}
//     </button>

//     {/* Render Sidebar in portal */}
//     {createPortal(sidebarUI, document.body)}
//   </>
//   );
// };

// export default WishlistSidebar;








//=========>>> Old



// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate } from "react-router-dom";
// import { getWishlistData } from "../api/services/wishlistServise";
// import { getNotifications } from "../api/services/visitorService";
// import { MessageCircle } from "lucide-react"; // chat icon

// const WishlistSidebar = ({ visitorId, userId }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [wishlist, setWishlist] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const navigate = useNavigate();

//   // Fetch wishlist when sidebar opens
//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const fetchWishlist = async () => {
//         try {
//           const id = visitorId?.visitorId || visitorId; // ✅ ensure string
//           const res = await getWishlistData(id);
//           setWishlist(res.data || []);
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       };
//       fetchWishlist();
//     }
//   }, [isOpen, visitorId]);

//   // Fetch notifications when sidebar opens
//   // useEffect(() => {
//   //   if (isOpen && visitorId) {
//   //     const id = visitorId?.visitorId || visitorId; 
//   //     const fetchNotifications = async () => {
//   //       try {
//   //         const res = await getNotifications(id);
//   //         setNotifications(res.data || []);
//   //         setHasUnread(res.data?.some((n) => !n.isRead));
//   //       } catch (error) {
//   //         console.error("Error fetching notifications:", error);
//   //       }
//   //     };
//   //     fetchNotifications();
//   //   }
//   // }, [isOpen, userId]);

//   useEffect(() => {
//     if (isOpen && visitorId) {
//       const id = visitorId?.visitorId || visitorId;
//       const fetchNotifications = async () => {
//         try {
//           const res = await getNotifications(id);
//           setNotifications(res.data || []);
//           setHasUnread(res.data?.some((n) => !n.isRead));
//         } catch (error) {
//           console.error("Error fetching notifications:", error);
//         }
//       };
//       fetchNotifications();
//     }
//   }, [isOpen, visitorId]); // ✅ instead of userId
  

//   // Navigate to office detail with type as category
//   const handleNavigate = (propertyId, type) => {
//     setIsOpen(false); // close sidebar
//     navigate(`/office/${propertyId}?category=${type}`);
//   };

//   // Sidebar UI
//   const sidebarUI = (
//     <div
//       className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${
//         isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//     >
//       {/* Overlay */}
//       <div
//         className="flex-1 bg-black bg-opacity-50"
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar */}
//       <div
//         className={`w-80 bg-white rounded-l-2xl shadow-2xl p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Saved Spaces</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-xl text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Notifications Section */}
//         {notifications.length > 0 && (
//           <div className="mb-6 space-y-2">
//             <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
//             {notifications.map((n) => (
//               <div
//                 key={n._id}
//                 className="flex items-center gap-3 p-3 bg-green-100 rounded-lg shadow-sm"
//               >
//                 <MessageCircle className="w-5 h-5 text-green-600" />
//                 <p className="text-sm text-gray-800">{n.message}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Wishlist Items */}
//         {wishlist.length === 0 ? (
//           <p className="text-gray-500">No saved spaces yet.</p>
//         ) : (
//           <div className="space-y-4">
//         {wishlist.map((item) => {
//   if (!item?.property) return null; // skip broken entries
//   return (
//     <div
//       key={item._id}
//       onClick={() =>
//         handleNavigate(item.property._id, item.property.type)
//       }
//       className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:shadow-md hover:bg-gray-50"
//     >
//       <img
//         src={item?.property?.images?.[0] || "/placeholder.png"}
//         alt={item.property.buildingName}
//         className="object-cover w-16 h-16 rounded"
//       />
//       <div className="flex-1">
//         <h3 className="text-sm font-semibold text-gray-800">
//           {item.property.buildingName}
//         </h3>
//         <p className="text-xs text-gray-600">
//           {item.property.location?.city},{" "}
//           {item.property.location?.locationOfProperty}
//         </p>
//         <span className="text-[12px] text-blue-600 underline">
//           View Details →
//         </span>
//       </div>
//     </div>
//   );
// })}

//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* User Button in Header */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="relative p-2 bg-gray-200 rounded-full hover:bg-gray-300"
//       >
//         👤
//         {hasUnread && (
//           <span className="absolute w-2 h-2 bg-green-500 rounded-full top-1 right-1" />
//         )}
//       </button>

//       {/* Render Sidebar in portal */}
//       {createPortal(sidebarUI, document.body)}
//     </>
//   );
// };

// export default WishlistSidebar;