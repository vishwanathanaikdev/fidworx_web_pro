import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import Cookies from "js-cookie";

const LeadEnquiryModal = ({
  isOpen,
  onClose,
  onSubmit,
  leadMessage,
  setLeadMessage,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🆕 loading state

  if (!isOpen) return null;

  const visitorId = Cookies.get("visitorId");
  const leadCookieKey = `leadSent_${visitorId}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Prevent multiple clicks
    if (isSubmitting) return;

    setIsSubmitting(true);

    const success = await onSubmit();
    if (success) {
      if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
      setShowSuccess(true);
      setLeadMessage("");

      setTimeout(() => {
        setShowSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 3000);
    } else {
      // if submission failed, re-enable button
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    const leadAlreadySent = Cookies.get(leadCookieKey);

    if (!leadAlreadySent) {
      const messageToSend = leadMessage?.trim() ? leadMessage : "Looking for Space";
      await onSubmit(messageToSend);
      setLeadMessage("");
      if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleCancel}
          disabled={isSubmitting} // prevent closing while submitting
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold disabled:opacity-50"
        >
          ×
        </button>

        {/* ✅ Success View */}
        {showSuccess ? (
          <div className="text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Thank you for Reaching Out
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Our team will get back to you within 24 hours with your personalised quote.
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full h-[45px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* 📨 Lead Form View */}
            <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
              Send Your Enquiry
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Let us know your interest. Our team will reach out soon.
            </p>

            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="Enter your message (optional)"
                value={leadMessage}
                onChange={(e) => setLeadMessage(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-[90px] px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4 disabled:bg-gray-100"
              />

              <p className="text-[12px] text-gray-500 mb-4 leading-[18px]">
                After you submit, we may share your details with workspace providers who may contact you about your enquiry.
                Read our{" "}
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Privacy Policy
                </span>{" "}
                for more details.
              </p>

              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="w-1/2 h-[45px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-1/2 h-[45px] text-sm rounded-xl text-white transition ${
                    isSubmitting
                      ? "bg-orange-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadEnquiryModal;









//=====>> Fixing the issue  multiple triger


// import React, { useState } from "react";
  // import { CheckCircle } from "lucide-react";
  // import Cookies from "js-cookie"; // make sure you have js-cookie installed

  // const LeadEnquiryModal = ({
  //   isOpen,
  //   onClose,
  //   onSubmit,
  //   leadMessage,
  //   setLeadMessage,
  // }) => {
  //   const [showSuccess, setShowSuccess] = useState(false);

  //   if (!isOpen) return null;

  //   const visitorId = Cookies.get("visitorId"); // get visitorId from cookies
  //   const leadCookieKey = `leadSent_${visitorId}`; // unique key per visitor

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const success = await onSubmit(); // parent returns success boolean
  //     if (success) {
  //       // mark in cookie that lead info was sent
  //       if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
  //       setShowSuccess(true);
  //       setLeadMessage("");
  //       setTimeout(() => {
  //         setShowSuccess(false);
  //         onClose();
  //       }, 3000); // auto close after 3 seconds
  //     }
  //   };

  //   const handleCancel = async () => {
  //     const leadAlreadySent = Cookies.get(leadCookieKey);
    
  //     if (!leadAlreadySent) {
  //       // first-time cancel, send lead silently with default message
  //       const messageToSend = leadMessage?.trim() ? leadMessage : "Looking for Space";
  //       await onSubmit(messageToSend);
  //       setLeadMessage("");
  //       if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
  //     }
    
  //     onClose();
  //   };
    

  //   return (
  //     <div
  //       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
  //       onClick={handleCancel} // clicking outside triggers cancel
  //     >
  //       <div
  //         className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300"
  //         onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
  //       >
  //         {/* Close Button */}
  //         <button
  //           onClick={handleCancel}
  //           className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
  //         >
  //           ×
  //         </button>

  //         {/* ✅ Success View */}
  //         {showSuccess ? (
  //           <div className="text-center">
  //             <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
  //             <h2 className="text-2xl font-semibold text-gray-900 mb-3">
  //               Thank you for Reaching Out
  //             </h2>
  //             <p className="text-sm text-gray-600 leading-relaxed mb-6">
  //               Our team will get back to you within 24 hours with your
  //               personalised quote.
  //             </p>
  //             <button
  //               onClick={onClose}
  //               className="mt-4 w-full h-[45px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
  //             >
  //               Close
  //             </button>
  //           </div>
  //         ) : (
  //           <>
  //             {/* 📨 Lead Form View */}
  //             <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
  //               Send Your Enquiry123
  //             </h2>
  //             <p className="text-sm text-gray-500 text-center mb-5">
  //               Let us know your interest. Our team will reach out soon.
  //             </p>

  //             <form onSubmit={handleSubmit}>
  //               <textarea
  //                 placeholder="Enter your message (optional)"
  //                 value={leadMessage}
  //                 onChange={(e) => setLeadMessage(e.target.value)}
  //                 className="w-full h-[90px] px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4"
  //               />

  //               <p className="text-[12px] text-gray-500 mb-4 leading-[18px]">
  //                 After you submit, we may share your details with workspace
  //                 providers who may contact you about your enquiry. Read our{" "}
  //                 <span className="text-blue-600 cursor-pointer hover:underline">
  //                   Privacy Policy
  //                 </span>{" "}
  //                 for more details.
  //               </p>

  //               <div className="flex justify-between gap-4">
  //                 <button
  //                   type="button"
  //                   onClick={handleCancel}
  //                   className="w-1/2 h-[45px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
  //                 >
  //                   Cancel
  //                 </button>

  //                 <button
  //                   type="submit"
  //                   className="w-1/2 h-[45px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
  //                 >
  //                   Submit
  //                 </button>
  //               </div>
  //             </form>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // export default LeadEnquiryModal;








//============>>> Old one super 

// import React, { useState } from "react";
// import { CheckCircle } from "lucide-react";
// import Cookies from "js-cookie"; // make sure you have js-cookie installed

// const LeadEnquiryModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   leadMessage,
//   setLeadMessage,
// }) => {
//   const [showSuccess, setShowSuccess] = useState(false);

//   if (!isOpen) return null;

//   const visitorId = Cookies.get("visitorId"); // get visitorId from cookies
//   const leadCookieKey = `leadSent_${visitorId}`; // unique key per visitor

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await onSubmit(); // parent returns success boolean
//     if (success) {
//       // mark in cookie that lead info was sent
//       if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
//       setShowSuccess(true);
//       setLeadMessage("");
//       setTimeout(() => {
//         setShowSuccess(false);
//         onClose();
//       }, 3000); // auto close after 3 seconds
//     }
//   };

//   const handleCancel = async () => {
//     const leadAlreadySent = Cookies.get(leadCookieKey);

//     if (!leadAlreadySent) {
//       // first-time cancel, send lead silently
//       await onSubmit(); // submit lead
//       setLeadMessage(""); // clear message
//       if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
//     }
//     // always close modal
//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
//       onClick={handleCancel} // clicking outside triggers cancel
//     >
//       <div
//         className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300"
//         onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//       >
//         {/* Close Button */}
//         <button
//           onClick={handleCancel}
//           className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
//         >
//           ×
//         </button>

//         {/* ✅ Success View */}
//         {showSuccess ? (
//           <div className="text-center">
//             <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//               Thank you for Reaching Out
//             </h2>
//             <p className="text-sm text-gray-600 leading-relaxed mb-6">
//               Our team will get back to you within 24 hours with your
//               personalised quote.
//             </p>
//             <button
//               onClick={onClose}
//               className="mt-4 w-full h-[45px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
//             >
//               Close
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* 📨 Lead Form View */}
//             <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//               Send Your Enquiry
//             </h2>
//             <p className="text-sm text-gray-500 text-center mb-5">
//               Let us know your interest. Our team will reach out soon.
//             </p>

//             <form onSubmit={handleSubmit}>
//               <textarea
//                 placeholder="Enter your message (optional)"
//                 value={leadMessage}
//                 onChange={(e) => setLeadMessage(e.target.value)}
//                 className="w-full h-[90px] px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4"
//               />

//               <p className="text-[12px] text-gray-500 mb-4 leading-[18px]">
//                 After you submit, we may share your details with workspace
//                 providers who may contact you about your enquiry. Read our{" "}
//                 <span className="text-blue-600 cursor-pointer hover:underline">
//                   Privacy Policy
//                 </span>{" "}
//                 for more details.
//               </p>

//               <div className="flex justify-between gap-4">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="w-1/2 h-[45px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="w-1/2 h-[45px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeadEnquiryModal;









//====>> 100 % working 


// import React, { useState } from "react";
// import { CheckCircle } from "lucide-react";

// const LeadEnquiryModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   leadMessage,
//   setLeadMessage,
// }) => {
//   const [showSuccess, setShowSuccess] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await onSubmit(); // parent returns success boolean
//     if (success) {
//       setShowSuccess(true);
//       setLeadMessage("");
//       setTimeout(() => {
//         setShowSuccess(false);
//         onClose();
//       }, 3000); // auto close after 3 seconds
//     }
//   };

//   // ✅ Cancel now submits lead silently without showing success
//   const handleCancel = async () => {
//     await onSubmit(); // submit lead
//     setLeadMessage(""); // clear message
//     onClose(); // close modal
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
//       onClick={handleCancel} // optional: clicking outside also triggers cancel
//     >
//       <div
//         className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300"
//         onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//       >
//         {/* Close Button */}
//         <button
//           onClick={handleCancel}
//           className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
//         >
//           ×
//         </button>

//         {/* ✅ Success View */}
//         {showSuccess ? (
//           <div className="text-center">
//             <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//               Thank you for Reaching Out
//             </h2>
//             <p className="text-sm text-gray-600 leading-relaxed mb-6">
//               Our team will get back to you within 24 hours with your
//               personalised quote.
//             </p>
//             <button
//               onClick={onClose}
//               className="mt-4 w-full h-[45px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
//             >
//               Close
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* 📨 Lead Form View */}
//             <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//               Send Your Enquiry
//             </h2>
//             <p className="text-sm text-gray-500 text-center mb-5">
//               Let us know your interest. Our team will reach out soon.
//             </p>

//             <form onSubmit={handleSubmit}>
//               <textarea
//                 placeholder="Enter your message (optional)"
//                 value={leadMessage}
//                 onChange={(e) => setLeadMessage(e.target.value)}
//                 className="w-full h-[90px] px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4"
//               />

//               <p className="text-[12px] text-gray-500 mb-4 leading-[18px]">
//                 After you submit, we may share your details with workspace
//                 providers who may contact you about your enquiry. Read our{" "}
//                 <span className="text-blue-600 cursor-pointer hover:underline">
//                   Privacy Policy
//                 </span>{" "}
//                 for more details.
//               </p>

//               <div className="flex justify-between gap-4">
//                 <button
//                   type="button"
//                   onClick={handleCancel} // Trigger lead submit on Cancel
//                   className="w-1/2 h-[45px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="w-1/2 h-[45px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeadEnquiryModal;









//----Old working as good

// import React, { useState } from "react";
// import { CheckCircle } from "lucide-react";

// const LeadEnquiryModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   leadMessage,
//   setLeadMessage,
// }) => {
//   const [showSuccess, setShowSuccess] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await onSubmit(); // parent returns success boolean
//     if (success) {
//       setShowSuccess(true);
//       setLeadMessage("");
//       setTimeout(() => {
//         setShowSuccess(false);
//         onClose();
//       }, 3000); // auto close after 3 seconds
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300"
//         onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
//         >
//           ×
//         </button>

//         {/* ✅ Success View */}
//         {showSuccess ? (
//           <div className="text-center">
//             <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//               Thank you for Reaching Out
//             </h2>
//             <p className="text-sm text-gray-600 leading-relaxed mb-6">
//               Our team will get back to you within 24 hours with your
//               personalised quote.
//             </p>
//             <button
//               onClick={onClose}
//               className="mt-4 w-full h-[45px] bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
//             >
//               Close
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* 📨 Lead Form View */}
//             <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//               Send Your Enquiry123
//             </h2>
//             <p className="text-sm text-gray-500 text-center mb-5">
//               Let us know your interest. Our team will reach out soon.
//             </p>

//             <form onSubmit={handleSubmit}>
//               <textarea
//                 placeholder="Enter your message (optional)"
//                 value={leadMessage}
//                 onChange={(e) => setLeadMessage(e.target.value)}
//                 className="w-full h-[90px] px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4"
//               />

//               <p className="text-[12px] text-gray-500 mb-4 leading-[18px]">
//                 After you submit, we may share your details with workspace
//                 providers who may contact you about your enquiry. Read our{" "}
//                 <span className="text-blue-600 cursor-pointer hover:underline">
//                   Privacy Policy
//                 </span>{" "}
//                 for more details.
//               </p>

//               <div className="flex justify-between gap-4">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="w-1/2 h-[45px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="w-1/2 h-[45px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeadEnquiryModal;
