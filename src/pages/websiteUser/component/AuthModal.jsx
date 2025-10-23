import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { sendEmailOtp, verifyEmailOtp } from "../../../api/services/visitorService";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [authStep, setAuthStep] = useState("email");
  const [otp, setOtp] = useState("");
  const [isNewVisitor, setIsNewVisitor] = useState(false);
  const [authError, setAuthError] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [formData, setFormData] = useState({ mobile: "", city: "" });
  const [otpTimer, setOtpTimer] = useState(0); // seconds
  const [resendDisabled, setResendDisabled] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    } else if (otpTimer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setAuthError("");
    try {
      const res = await sendEmailOtp(visitorEmail);
      setIsNewVisitor(res.isNewVisitor);
      setAuthStep("otp");
      setOtp(""); // clear OTP input
      setOtpTimer(59); // start 59 sec timer
      setResendDisabled(true);
    } catch (err) {
      setAuthError(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setAuthError("");
    if (!otp) return setAuthError("OTP is required");

    try {
      let payload = { email: visitorEmail, otp };
      if (isNewVisitor) {
        if (!visitorName || !formData.mobile || !formData.city) {
          return setAuthError("All fields are required for new visitors");
        }
        payload = { ...payload, fullName: visitorName, mobile: formData.mobile, city: formData.city };
      }

      const res = await verifyEmailOtp(payload);
      Cookies.set("visitorId", res.data._id, { expires: 7 });
    // Pass the user data to parent
    onSuccess?.(res.data); // <-- Pass userData
    onClose();
    } catch (err) {
      setAuthError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        {/* Email Step */}
        {authStep === "email" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Please login to continue
            </h2>
            <p className="text-lg text-gray-500 mb-6 text-center">
              Get started to grab the best offers on top workspace
            </p>

            <input
              type="email"
              placeholder="Please enter your email"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
              className="w-full h-[64px] border border-gray-300 rounded-xl px-5 text-[16px] placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {authError && <p className="text-red-500 text-sm mb-3 text-center">{authError}</p>}

            <p className="text-[14px] text-gray-600 text-center mb-6 leading-[20px]">
              By proceeding, you agree to Fidelitus Corp{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Terms and Conditions
              </span>{" "}
              and that you have read our{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Privacy Policy
              </span>.
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={onClose}
                className="w-1/2 h-[60px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOtp}
                className="w-1/2 h-[60px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {/* OTP Step */}
        {authStep === "otp" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              {isNewVisitor ? "Sign Up" : "Enter OTP"}
            </h2>

            <p className="text-md text-orange-500 mb-4 text-center">
              Please enter OTP sent on <span className="font-medium">{visitorEmail}</span>{" "}
              <span
                className="ml-2 text-blue-600 cursor-pointer underline"
                onClick={() => setAuthStep("email")}
              >
                Edit
              </span>
            </p>

            {/* New Visitor Fields */}
            {isNewVisitor && (
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 my-4">
              {[...Array(6)].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    let newOtp = otp.split("");
                    newOtp[idx] = val;
                    setOtp(newOtp.join(""));
                    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
                  }}
                  id={`otp-${idx}`}
                  className="w-10 h-12 text-center text-lg border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              ))}
            </div>

           {/* OTP Timer */}
            {otpTimer > 0 && (
              <p className="text-sm text-gray-500 text-center mb-4">
                OTP will expire in <span className="font-medium">{otpTimer}s</span>
              </p>
            )}

            {/* Invalid OTP Error */}
            {authError && <p className="text-red-500 text-center text-sm mb-4">{authError}</p>}

            {/* Resend OTP */}
            <p className="text-sm text-gray-500 text-center mb-4">
              Didn't receive OTP?{" "}
              <span
                className={`cursor-pointer underline ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
                onClick={() => {
                  if (!resendDisabled) handleSendOtp();
                }}
              >
                Resend OTP
              </span>
            </p>
            {/* Terms */}
            <p className="text-[10px] text-gray-600 text-center mb-3 leading-[20px]">
              By submitting your enquiry, your details may be shared with workspace providers who may contact you. Please review our{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>{" "}
              and{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Terms and Conditions</span>{" "}
              for how we handle your information.
            </p>
            {/* Buttons */}
            <div className="flex justify-between gap-4">
              <button onClick={onClose} className="w-1/2 h-[55px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition">
                Cancel
              </button>
              <button onClick={handleVerifyOtp} className="w-1/2 h-[55px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition">
                Verify OTP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;








//=========>>> Fixing issues


// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { sendEmailOtp, verifyEmailOtp } from "../../../api/services/visitorService";

// const AuthModal = ({ isOpen, onClose, onSuccess }) => {
//   const [authStep, setAuthStep] = useState("email");
//   const [otp, setOtp] = useState("");
//   const [isNewVisitor, setIsNewVisitor] = useState(false);
//   const [authError, setAuthError] = useState("");
//   const [visitorEmail, setVisitorEmail] = useState("");
//   const [visitorName, setVisitorName] = useState("");
//   const [formData, setFormData] = useState({ mobile: "", city: "" });
//   const [otpTimer, setOtpTimer] = useState(0); // seconds
//   const [resendDisabled, setResendDisabled] = useState(false);

//   // Countdown timer effect
//   useEffect(() => {
//     let interval;
//     if (otpTimer > 0) {
//       interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
//     } else if (otpTimer === 0) {
//       setResendDisabled(false);
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer]);

//   if (!isOpen) return null;

//   const handleSendOtp = async () => {
//     setAuthError("");
//     try {
//       const res = await sendEmailOtp(visitorEmail);
//       setIsNewVisitor(res.isNewVisitor);
//       setAuthStep("otp");
//       setOtp(""); // clear OTP input
//       setOtpTimer(59); // start 59 sec timer
//       setResendDisabled(true);
//     } catch (err) {
//       setAuthError(err.message || "Failed to send OTP");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setAuthError("");
//     if (!otp) return setAuthError("OTP is required");

//     try {
//       let payload = { email: visitorEmail, otp };
//       if (isNewVisitor) {
//         if (!visitorName || !formData.mobile || !formData.city) {
//           return setAuthError("All fields are required for new visitors");
//         }
//         payload = { ...payload, fullName: visitorName, mobile: formData.mobile, city: formData.city };
//       }

//       const res = await verifyEmailOtp(payload);
//       Cookies.set("visitorId", res.data._id, { expires: 7 });
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       setAuthError(err.response?.data?.message || "Invalid OTP");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
//         >
//           ×
//         </button>

//         {/* Email Step */}
//         {authStep === "email" && (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//               Please login to continue
//             </h2>
//             <p className="text-lg text-gray-500 mb-6 text-center">
//               Get started to grab the best offers on top workspace
//             </p>

//             <input
//               type="email"
//               placeholder="Please enter your email"
//               value={visitorEmail}
//               onChange={(e) => setVisitorEmail(e.target.value)}
//               className="w-full h-[64px] border border-gray-300 rounded-xl px-5 text-[16px] placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             {authError && <p className="text-red-500 text-sm mb-3 text-center">{authError}</p>}

//             <p className="text-[14px] text-gray-600 text-center mb-6 leading-[20px]">
//               By proceeding, you agree to Fidelitus Corp{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">
//                 Terms and Conditions
//               </span>{" "}
//               and that you have read our{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">
//                 Privacy Policy
//               </span>.
//             </p>

//             <div className="flex justify-between gap-4">
//               <button
//                 onClick={onClose}
//                 className="w-1/2 h-[60px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSendOtp}
//                 className="w-1/2 h-[60px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
//               >
//                 Send OTP
//               </button>
//             </div>
//           </>
//         )}

//         {/* OTP Step */}
//         {authStep === "otp" && (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//               {isNewVisitor ? "Sign Up" : "Enter OTP"}
//             </h2>

//             <p className="text-md text-orange-500 mb-4 text-center">
//               Please enter OTP sent on <span className="font-medium">{visitorEmail}</span>{" "}
//               <span
//                 className="ml-2 text-blue-600 cursor-pointer underline"
//                 onClick={() => setAuthStep("email")}
//               >
//                 Edit
//               </span>
//             </p>

//             {/* New Visitor Fields */}
//             {isNewVisitor && (
//               <div className="space-y-3 mb-6">
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={visitorName}
//                   onChange={(e) => setVisitorName(e.target.value)}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Mobile Number"
//                   value={formData.mobile}
//                   onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//               </div>
//             )}

//             {/* OTP Inputs */}
//             <div className="flex justify-center gap-3 my-4">
//               {[...Array(6)].map((_, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   maxLength={1}
//                   value={otp[idx] || ""}
//                   onChange={(e) => {
//                     const val = e.target.value.replace(/[^0-9]/g, "");
//                     let newOtp = otp.split("");
//                     newOtp[idx] = val;
//                     setOtp(newOtp.join(""));
//                     if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
//                   }}
//                   id={`otp-${idx}`}
//                   className="w-10 h-12 text-center text-lg border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//               ))}
//             </div>

//             {/* OTP Timer */}
//             {otpTimer > 0 && (
//               <p className="text-sm text-gray-500 text-center mb-4">
//                 OTP will expire in <span className="font-medium">{otpTimer}s</span>
//               </p>
//             )}

//             {/* Invalid OTP Error */}
//             {authError && <p className="text-red-500 text-center text-sm mb-4">{authError}</p>}

//             {/* Resend OTP */}
//             <p className="text-sm text-gray-500 text-center mb-4">
//               Didn't receive OTP?{" "}
//               <span
//                 className={`cursor-pointer underline ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
//                 onClick={() => {
//                   if (!resendDisabled) handleSendOtp();
//                 }}
//               >
//                 Resend OTP
//               </span>
//             </p>

//             {/* Terms */}
//             <p className="text-[10px] text-gray-600 text-center mb-3 leading-[20px]">
//               By submitting your enquiry, your details may be shared with workspace providers who may contact you. Please review our{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>{" "}
//               and{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">Terms and Conditions</span>{" "}
//               for how we handle your information.
//             </p>

//             {/* Buttons */}
//             <div className="flex justify-between gap-4">
//               <button onClick={onClose} className="w-1/2 h-[55px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition">
//                 Cancel
//               </button>
//               <button onClick={handleVerifyOtp} className="w-1/2 h-[55px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition">
//                 Verify OTP
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;









//===========>>> Old one 3



// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { sendEmailOtp, verifyEmailOtp } from "../../../api/services/visitorService";

// const AuthModal = ({ isOpen, onClose, onSuccess }) => {
//   const [authStep, setAuthStep] = useState("email");
//   const [otp, setOtp] = useState("");
//   const [isNewVisitor, setIsNewVisitor] = useState(false);
//   const [authError, setAuthError] = useState("");
//   const [visitorEmail, setVisitorEmail] = useState("");
//   const [visitorName, setVisitorName] = useState("");
//   const [formData, setFormData] = useState({ mobile: "", city: "" });

//   if (!isOpen) return null;

//   const handleSendOtp = async () => {
//     setAuthError("");
//     try {
//       const res = await sendEmailOtp(visitorEmail);
//       setIsNewVisitor(res.isNewVisitor);
//       setAuthStep("otp");
//     } catch (err) {
//       setAuthError(err.message || "Failed to send OTP");
//     }
//   };



//   const handleVerifyOtp = async () => {
//     setAuthError("");
//     if (!otp) return setAuthError("OTP is required");
  
//     try {
//       // Base payload
//       let payload = {
//         email: visitorEmail,
//         otp: otp,
//       };
  
//       // Add extra fields if new visitor
//       if (isNewVisitor) {
//         if (!visitorName || !formData.mobile || !formData.city) {
//           return setAuthError("All fields are required for new visitors");
//         }
//         payload = {
//           ...payload,
//           fullName: visitorName,
//           mobile: formData.mobile,
//           city: formData.city,
//         };
//       }
  
//       const res = await verifyEmailOtp(payload);
  
//       // Save visitorId in cookie
//       const visitorId = res.data._id;
//       Cookies.set("visitorId", visitorId, { expires: 7 });
  
//       // Close Auth modal
//       setIsModalOpen(false);
  
//       // Open lead modal
//       // setIsLeadModalOpen(true);
  
//       console.log("Visitor logged in successfully:", res.data);
//     } catch (err) {
//       setAuthError(err.response?.data?.message || "Invalid OTP");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
//         >
//           ×
//         </button>

//         {/* STEP 1: Email Entry */}
//         {authStep === "email" && (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//               Please login to continue
//             </h2>
//             <p className="text-lg text-gray-500 mb-6 text-center">
//               Get started to grab the best offers on top workspace
//             </p>

//             <input
//               type="email"
//               placeholder="Please enter your email"
//               value={visitorEmail}
//               onChange={(e) => setVisitorEmail(e.target.value)}
//               className="w-full h-[64px] border border-gray-300 rounded-xl px-5 text-[16px] placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             {authError && (
//               <p className="text-red-500 text-sm mb-3 text-center">{authError}</p>
//             )}

//             <p className="text-[14px] text-gray-600 text-center mb-6 leading-[20px]">
//               By proceeding, you agree to Fidelitus Corp{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">
//                 Terms and Conditions
//               </span>{" "}
//               and that you have read our{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">
//                 Privacy Policy
//               </span>.
//             </p>

//             <div className="flex justify-between gap-4">
//               <button
//                 onClick={onClose}
//                 className="w-1/2 h-[60px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSendOtp}
//                 className="w-1/2 h-[60px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
//               >
//                 Send OTP
//               </button>
//             </div>
//           </>
//         )}

//         {/* STEP 2: OTP Entry */}
//         {authStep === "otp" && (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//               {isNewVisitor ? "Sign Up" : "Enter OTP"}
//             </h2>

//             {/* Email info with edit */}
//             <p className="text-md text-orange-500 mb-4 text-center">
//               Please enter OTP sent on <span className="font-medium">{visitorEmail}</span>{" "}
//               <span
//                 className="ml-2 text-blue-600 cursor-pointer underline"
//                 onClick={() => setAuthStep("email")}
//               >
//                 Edit
//               </span>
//             </p>

//             {/* New Visitor: Name, Mobile, City */}
//             {isNewVisitor && (
//               <div className="space-y-3 mb-6">
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={visitorName}
//                   onChange={(e) => setVisitorName(e.target.value)}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Mobile Number"
//                   value={formData.mobile}
//                   onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//               </div>
//             )}

//             {/* OTP Inputs */}
//             <div className="flex justify-center gap-3 my-4">
//               {[...Array(6)].map((_, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   maxLength={1}
//                   value={otp[idx] || ""}
//                   onChange={(e) => {
//                     const val = e.target.value.replace(/[^0-9]/g, "");
//                     let newOtp = otp.split("");
//                     newOtp[idx] = val;
//                     setOtp(newOtp.join(""));
//                     if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
//                   }}
//                   id={`otp-${idx}`}
//                   className="w-10 h-12 text-center text-lg border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 />
//               ))}
//             </div>

//             {/* Invalid OTP Error */}
//             {authError && (
//               <p className="text-red-500 text-center text-sm mb-4">
//                 {authError}
//               </p>
//             )}

//             {/* Resend OTP */}
//             <p className="text-sm text-gray-500 text-center mb-4">
//               Didn't receive OTP?{" "}
//               <span
//                 className="text-blue-600 cursor-pointer underline"
//                 onClick={() => {
//                   handleSendOtp();
//                   setOtp("");
//                 }}
//               >
//                 Resend OTP
//               </span>
//             </p>

//             {/* Terms & Privacy */}
//             <p className="text-[10px] text-gray-600 text-center mb-3 leading-[20px]">
//               By submitting your enquiry, your details may be shared with workspace providers who may contact you. Please review our{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">
//                 Privacy Policy
//               </span>{" "}
//               and{" "}
//               <span className="text-blue-600 cursor-pointer hover:underline">
//                 Terms and Conditions
//               </span>{" "}
//               for how we handle your information.
//             </p>

//             {/* Buttons */}
//             <div className="flex justify-between gap-4">
//               <button
//                 onClick={onClose}
//                 className="w-1/2 h-[55px] bg-gray-200 text-gray-700 text-[16px] font-medium rounded-xl hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleVerifyOtp}
//                 className="w-1/2 h-[55px] bg-orange-500 text-white text-[16px] font-semibold rounded-xl hover:bg-orange-600 transition"
//               >
//                 Verify OTP
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;










//===============>>> Old one

// import React, { useState } from "react";
// import Cookies from "js-cookie";
// // import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
// import { sendEmailOtp, verifyEmailOtp } from "../../../api/services/visitorService";

// const AuthModal = ({ isOpen, onClose, onSuccess }) => {
//   const [authStep, setAuthStep] = useState("email");
//   const [otp, setOtp] = useState("");
//   const [isNewVisitor, setIsNewVisitor] = useState(false);
//   const [authError, setAuthError] = useState("");
//   const [visitorEmail, setVisitorEmail] = useState("");
//   const [visitorName, setVisitorName] = useState("");
//   const [formData, setFormData] = useState({ mobile: "", city: "" });

//   if (!isOpen) return null;

//   const handleSendOtp = async () => {
//     setAuthError("");
//     try {
//       const res = await sendEmailOtp(visitorEmail);
//       setIsNewVisitor(res.isNewVisitor);
//       setAuthStep("otp");
//     } catch (err) {
//       setAuthError(err.message || "Failed to send OTP");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setAuthError("");
//     if (!otp) return setAuthError("OTP is required");

//     try {
//       let payload = { email: visitorEmail, otp };
//       if (isNewVisitor) {
//         if (!visitorName || !formData.mobile || !formData.city) {
//           return setAuthError("All fields are required for new visitors");
//         }
//         payload = { ...payload, fullName: visitorName, mobile: formData.mobile, city: formData.city };
//       }

//       const res = await verifyEmailOtp(payload);
//       Cookies.set("visitorId", res.data._id, { expires: 7 });
//       onSuccess?.(); // callback after successful login
//       onClose();
//     } catch (err) {
//       setAuthError(err.response?.data?.message || "Invalid OTP");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-[500px] max-w-[95%] p-8 shadow-2xl relative transition-all duration-300">
//         {authStep === "email" && (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//               Please login to continue
//             </h2>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={visitorEmail}
//               onChange={(e) => setVisitorEmail(e.target.value)}
//               className="w-full h-[64px] border border-gray-300 rounded-xl px-5 text-[16px] mb-6"
//             />
//             {authError && <p className="text-red-500 text-sm mb-3 text-center">{authError}</p>}
//             <div className="flex justify-between gap-4">
//               <button onClick={onClose} className="w-1/2 h-[60px] bg-gray-200 rounded-xl">Cancel</button>
//               <button onClick={handleSendOtp} className="w-1/2 h-[60px] bg-orange-500 text-white rounded-xl">Send OTP</button>
//             </div>
//           </>
//         )}
//         {authStep === "otp" && (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//               {isNewVisitor ? "Sign Up" : "Enter OTP"}
//             </h2>
//             {isNewVisitor && (
//               <div className="space-y-3 mb-6">
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={visitorName}
//                   onChange={(e) => setVisitorName(e.target.value)}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Mobile"
//                   value={formData.mobile}
//                   onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4"
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   className="w-full h-[50px] border border-gray-300 rounded-xl px-4"
//                 />
//               </div>
//             )}
//             <div className="flex justify-center gap-3 my-4">
//               {[...Array(6)].map((_, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   maxLength={1}
//                   value={otp[idx] || ""}
//                   onChange={(e) => {
//                     const val = e.target.value.replace(/[^0-9]/g, "");
//                     let newOtp = otp.split("");
//                     newOtp[idx] = val;
//                     setOtp(newOtp.join(""));
//                     if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
//                   }}
//                   id={`otp-${idx}`}
//                   className="w-10 h-12 text-center border border-orange-400 rounded-lg"
//                 />
//               ))}
//             </div>
//             {authError && <p className="text-red-500 text-center text-sm mb-4">{authError}</p>}
//             <div className="flex justify-between gap-4">
//               <button onClick={onClose} className="w-1/2 h-[55px] bg-gray-200 rounded-xl">Cancel</button>
//               <button onClick={handleVerifyOtp} className="w-1/2 h-[55px] bg-orange-500 text-white rounded-xl">Verify OTP</button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;
