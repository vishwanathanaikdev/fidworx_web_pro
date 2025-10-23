import React, { useState } from "react";
import Cookies from "js-cookie";
import { postLeadData } from "../../../api/services/visitorService";

const EnquiryModal = ({ isOpen, onClose, officeId, userId }) => {
  const [leadMessage, setLeadMessage] = useState("");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // ================== HANDLERS ==================
 
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const visitorId = Cookies.get("visitorId");
    if (!visitorId) {
      alert("Visitor not found, please login first.");
      return;
    }
    try {
      const leadData = {
        propertyId: officeId,
        visitorId: visitorId,
        assignedAgentId: userId,
        message: leadMessage,
      };
  
      await postLeadData(leadData);
  
      // Close lead modal and show success modal
      setIsLeadModalOpen(false);
      setIsSuccessModalOpen(true);
      setLeadMessage("");
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Something went wrong while submitting lead.");
    }
  };

  const handleCancel = () => {
    handleLeadSubmit(true); // submit silently on cancel
    setIsLeadModalOpen(false);
    onClose?.();
  };

  // ================== UI ==================
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
        <div className="relative z-10">
          {isLeadModalOpen && (
            <>
              <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
                Send Your Enquiry11111
              </h2>
              <p className="text-sm text-gray-500 text-center mb-5">
                Let us know your interest. Our team will reach out soon.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLeadSubmit(); // normal submit
                }}
              >
                <textarea
                  placeholder="Enter your message (optional)"
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  className="w-full h-[60px] px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 resize-none"
                />

                <div className="flex justify-between gap-4">      
          <button
            type="button"
            onClick={() => {
              handleLeadSubmit(); // Trigger submit even on Cancel
              handleCancel();
            }}
            className="w-1/2 h-[50px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
          >
            Cancel-updated
          </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 h-[50px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </>
          )}

          {isSuccessModalOpen && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Thank You for Reaching Out
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Our team will get back to you soon.
              </p>
              <button
                onClick={onClose}
                className="w-full h-[50px] bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;








//===================>>>> Old one 


// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { postLeadData } from "../../../api/services/visitorService";

// const EnquiryModal = ({ isOpen, onClose, officeId, userId }) => {
//   const [leadMessage, setLeadMessage] = useState("");
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(true);
//   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   if (!isOpen) return null;

//   // ================== HANDLERS ==================
//   // const handleLeadSubmit = async (skipSuccess = false) => {
//   //   const visitorId = Cookies.get("visitorId");
//   //   if (!visitorId) {
//   //     alert("Visitor not found, please login first.");
//   //     return;
//   //   }

//   //   try {
//   //     const leadData = {
//   //       propertyId: officeId,
//   //       visitorId: visitorId,
//   //       assignedAgentId: userId,
//   //       message: leadMessage || "Visitor closed enquiry without message",
//   //     };

//   //     setIsLoading(true);
//   //     await postLeadData(leadData);
//   //     setIsLoading(false);

//   //     if (!skipSuccess) {
//   //       setIsLeadModalOpen(false);
//   //       setIsSuccessModalOpen(true); // only show success on normal submit
//   //       setLeadMessage("");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting lead:", error);
//   //     alert("Something went wrong while submitting lead.");
//   //     setIsLoading(false);
//   //   }
//   // };

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
  
//       await postLeadData(leadData);
  
//       // Close lead modal and show success modal
//       setIsLeadModalOpen(false);
//       setIsSuccessModalOpen(true);
//       setLeadMessage("");
//     } catch (error) {
//       console.error("Error submitting lead:", error);
//       alert("Something went wrong while submitting lead.");
//     }
//   };

//   const handleCancel = () => {
//     handleLeadSubmit(true); // submit silently on cancel
//     setIsLeadModalOpen(false);
//     onClose?.();
//   };

//   // ================== UI ==================
//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
//         <div className="relative z-10">
//           {isLeadModalOpen && (
//             <>
//               <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//                 Send Your Enquiry11111
//               </h2>
//               <p className="text-sm text-gray-500 text-center mb-5">
//                 Let us know your interest. Our team will reach out soon.
//               </p>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleLeadSubmit(); // normal submit
//                 }}
//               >
//                 <textarea
//                   placeholder="Enter your message (optional)"
//                   value={leadMessage}
//                   onChange={(e) => setLeadMessage(e.target.value)}
//                   className="w-full h-[60px] px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 resize-none"
//                 />

//                 <div className="flex justify-between gap-4">
//                   {/* <button
//                     type="button"
//                     // onClick={handleCancel}  
//                     onClick={() => {
//                         handleLeadSubmit(); // Trigger submit even on Cancel
//                         handleCancel();
//                       }}
//                     className="w-1/2 h-[50px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//                   >
//                     Cancel
//                   </button> */}
                     
//           <button
//             type="button"
//             onClick={() => {
//               handleLeadSubmit(); // Trigger submit even on Cancel
//               handleCancel();
//             }}
//             className="w-1/2 h-[50px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//           >
//             Cancel-updated
//           </button>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-1/2 h-[50px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//                   >
//                     {isLoading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}

//           {isSuccessModalOpen && (
//             <div className="text-center">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//                 Thank You for Reaching Out
//               </h2>
//               <p className="text-sm text-gray-600 leading-relaxed mb-6">
//                 Our team will get back to you soon.
//               </p>
//               <button
//                 onClick={onClose}
//                 className="w-full h-[50px] bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//               >
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnquiryModal;








///old 2

// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { postLeadData } from "../../../api/services/visitorService";

// const EnquiryModal = ({ isOpen, onClose, officeId, userId }) => {
//   const [step, setStep] = useState("auth"); // auth | lead | success
//   const [leadMessage, setLeadMessage] = useState("");
//   const [visitorEmail, setVisitorEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   if (!isOpen) return null;

//   // ================== HANDLERS ==================

//   const handleAuthSuccess = () => {
//     setStep("lead");
//   };

//   // Refactored lead submission to be callable without event
//   const handleLeadSubmit = async (e) => {
//     if (e?.preventDefault) e.preventDefault();

//     const visitorId = Cookies.get("visitorId");
//     if (!visitorId) {
//       alert("Visitor not found, please login first.");
//       return;
//     }

//     try {
//       const leadData = {
//         propertyId: officeId,
//         visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       setIsLoading(true);
//       await postLeadData(leadData);
//       setIsLoading(false);
//       setLeadMessage("");
//       setStep("success");
//     } catch (error) {
//       console.error("Lead submission error:", error);
//       alert("Something went wrong. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   // Cancel button now also submits lead before closing
//   const handleCancel = () => {
//     handleLeadSubmit(); // submit lead even if cancelled
//     onClose?.();
//   };

//   // ================== UI ==================

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
//         {/* Close on outside click */}
//         <div
//           className="absolute inset-0"
//           onClick={handleCancel} // ensure lead is submitted
//           style={{ cursor: "pointer", zIndex: 0 }}
//         />

//         <div className="relative z-10">
//           {/* AUTH STEP */}
//           {step === "auth" && (
//             <div className="text-center">
//               <h2 className="text-xl font-semibold mb-2">Sign Up or Continue</h2>
//               <p className="text-sm text-gray-500 mb-6">
//                 Enter your email to get started.
//               </p>
//               <input
//                 type="email"
//                 value={visitorEmail}
//                 onChange={(e) => setVisitorEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="w-full h-[50px] px-4 text-sm border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
//               />
//               <button
//                 onClick={handleAuthSuccess}
//                 className="w-full h-[50px] bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//               >
//                 Continue
//               </button>
//             </div>
//           )}

//           {/* LEAD STEP */}
//           {step === "lead" && (
//             <div>
//               <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//                 Send Your Enquiry
//               </h2>
//               <p className="text-sm text-gray-500 text-center mb-5">
//                 Let us know your interest. Our team will reach out soon.
//               </p>

//               <form onSubmit={handleLeadSubmit}>
//                 <textarea
//                   placeholder="Enter your message (optional)"
//                   value={leadMessage}
//                   onChange={(e) => setLeadMessage(e.target.value)}
//                   className="w-full h-[60px] px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 resize-none"
//                 />

//                 <p className="text-[13px] text-gray-500 mb-4 leading-[18px]">
//                   By submitting this enquiry, you agree that workspace providers
//                   may contact you. Read our{" "}
//                   <span className="text-blue-600 cursor-pointer hover:underline">
//                     Privacy Policy
//                   </span>{" "}
//                   for details.
//                 </p>

//                 <div className="flex justify-between gap-4">
//                   <button
//                     type="button"
//                     // onClick={handleCancel}
//                     onClick={() => {
//                         handleLeadSubmit(); // Trigger submit even on Cancel
//                         handleCancel;
//                       }}
//                     className="w-1/2 h-[45px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-1/2 h-[45px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//                   >
//                     {isLoading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* SUCCESS STEP */}
//           {step === "success" && (
//             <div
//               className="text-center cursor-pointer"
//               onClick={onClose}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//                 Thank You for Reaching Out
//               </h2>
//               <p className="text-sm text-gray-600 leading-relaxed mb-6">
//                 Our team will get back to you within 24 hours with your personalised quote.
//               </p>
//               <button className="w-full h-[50px] bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnquiryModal;









//============>>> Old one

// import React, { useState } from "react";
// import Cookies from "js-cookie";
// // import { postLeadData } from "../../services/LeadService";
// import { postLeadData } from "../../../api/services/visitorService";

// const EnquiryModal = ({ isOpen, onClose, officeId, userId }) => {
//   const [step, setStep] = useState("auth"); // auth | lead | success
//   const [leadMessage, setLeadMessage] = useState("");
//   const [visitorEmail, setVisitorEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  

//   if (!isOpen) return null;

//   // ================== HANDLERS ==================

//   const handleAuthSuccess = () => {
//     setStep("lead");
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
//         visitorId,
//         assignedAgentId: userId,
//         message: leadMessage,
//       };
//       setIsLoading(true);
//       await postLeadData(leadData);
//       setIsLoading(false);
//       setLeadMessage("");
//       setStep("success");
//     } catch (error) {
//       console.error("Lead submission error:", error);
//       alert("Something went wrong. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   // ================== UI ==================

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-[480px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
//         {/* Close on outside click */}
//         <div
//           className="absolute inset-0"
//           onClick={onClose}
//           style={{ cursor: "pointer", zIndex: 0 }}
//         />

//         <div className="relative z-10">
//           {/* AUTH STEP */}
//           {step === "auth" && (
//             <div className="text-center">
//               <h2 className="text-xl font-semibold mb-2">
//                 Sign Up or Continue
//               </h2>
//               <p className="text-sm text-gray-500 mb-6">
//                 Enter your email to get started.
//               </p>
//               <input
//                 type="email"
//                 value={visitorEmail}
//                 onChange={(e) => setVisitorEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="w-full h-[50px] px-4 text-sm border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
//               />
//               <button
//                 onClick={handleAuthSuccess}
//                 className="w-full h-[50px] bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//               >
//                 Continue
//               </button>
//             </div>
//           )}

//           {/* LEAD STEP */}
//           {step === "lead" && (
//             <div>
//               <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
//                 Send Your Enquiry
//               </h2>
//               <p className="text-sm text-gray-500 text-center mb-5">
//                 Let us know your interest. Our team will reach out soon.
//               </p>

//               <form onSubmit={handleLeadSubmit}>
//                 <textarea
//                   placeholder="Enter your message (optional)"
//                   value={leadMessage}
//                   onChange={(e) => setLeadMessage(e.target.value)}
//                   className="w-full h-[60px] px-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 resize-none"
//                 />

//                 <p className="text-[13px] text-gray-500 mb-4 leading-[18px]">
//                   By submitting this enquiry, you agree that workspace providers
//                   may contact you. Read our{" "}
//                   <span className="text-blue-600 cursor-pointer hover:underline">
//                     Privacy Policy
//                   </span>{" "}
//                   for details.
//                 </p>

//                 <div className="flex justify-between gap-4">
//                   <button
//                     type="button"
//                     onClick={onClose}
//                     className="w-1/2 h-[45px] text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-1/2 h-[45px] text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
//                   >
//                     {isLoading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* SUCCESS STEP */}
//           {step === "success" && (
//             <div
//               className="text-center cursor-pointer"
//               onClick={onClose}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-3">
//                 Thank You for Reaching Out
//               </h2>
//               <p className="text-sm text-gray-600 leading-relaxed mb-6">
//                 Our team will get back to you within 24 hours with your personalised quote.
//               </p>
//               <button className="w-full h-[50px] bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnquiryModal;
