// src/components/AuthModal.jsx
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [step, setStep] = useState("enterEmail"); // enterEmail | otp
  const [email, setEmail] = useState("");
  const [isNewVisitor, setIsNewVisitor] = useState(null);
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown for resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resetState = () => {
    setStep("enterEmail");
    setEmail("");
    setOtp("");
    setFullName("");
    setMobile("");
    setCity("");
    setIsNewVisitor(null);
    setError("");
    setInfo("");
    setLoading(false);
    setResendCooldown(0);
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setInfo("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await sendEmailOtp(email);
      if (res?.success) {
        setIsNewVisitor(Boolean(res.isNewVisitor));
        setStep("otp");
        setInfo("OTP sent to your email address.");
        setResendCooldown(50); // 🔹 50 seconds cooldown
      } else {
        setError(res?.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP (only when user presses Enter or clicks Verify)
  const handleVerify = async (e) => {
    e?.preventDefault();
    setError("");
    setInfo("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    const payload = isNewVisitor
      ? { email, otp, fullName, mobile, city }
      : { email, otp };

    try {
      setLoading(true);
      const res = await verifyEmailOtp(payload);

      if (res?.success && res?.data?._id) {
        Cookies.set("visitorId", res.data._id, { expires: 7 });
        resetState();
        onClose?.();
        onAuthSuccess?.(res.data);
      } else {
        setError(res?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Verification failed. Try again.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setInfo("");

    try {
      setLoading(true);
      const res = await sendEmailOtp(email);
      if (res?.success) {
        setInfo("OTP resent to your email.");
        setResendCooldown(50); // 🔹 again set 50s cooldown
      } else {
        setError(res?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) resetState();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={() => {
            onClose?.();
            resetState();
          }}
        >
          ✕
        </button>

        {/* Step 1: Email input */}
        {step === "enterEmail" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Sign in / Register
            </h3>
            <p className="text-sm text-gray-500">
              Enter your email address. We’ll send an OTP to verify your account.
            </p>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {info && <p className="text-sm text-green-600">{info}</p>}

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  resetState();
                }}
                className="px-4 py-2 bg-gray-200 text-sm rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP + Registration */}
        {step === "otp" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isNewVisitor ? "Complete Registration" : "Verify OTP"}
            </h3>
            <p className="text-sm text-gray-500">
              OTP sent to <strong>{email}</strong>
            </p>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {info && <p className="text-sm text-green-600">{info}</p>}

            {/* OTP Input */}
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              maxLength={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {isNewVisitor && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className={`text-sm ${
                  resendCooldown > 0
                    ? "text-gray-400"
                    : "text-blue-600 hover:underline"
                }`}
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("enterEmail");
                    setOtp("");
                    setError("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-sm rounded-lg hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading
                    ? "Verifying..."
                    : isNewVisitor
                    ? "Register"
                    : "Verify"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}









//========>> Old



// // src/components/AuthModal.jsx
// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { sendEmailOtp, verifyEmailOtp } from "../api/services/visitorService";

// export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
//   const [step, setStep] = useState("enterEmail"); // enterEmail | otp
//   const [email, setEmail] = useState("");
//   const [isNewVisitor, setIsNewVisitor] = useState(null);
//   const [otp, setOtp] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [city, setCity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(""); // show OTP error in red
//   const [info, setInfo] = useState(""); // any informational messages (OTP sent, etc.)
//   const [resendCooldown, setResendCooldown] = useState(0);

//   // optionally add a simple resend cooldown
//   React.useEffect(() => {
//     let t;
//     if (resendCooldown > 0) {
//       t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
//     }
//     return () => clearTimeout(t);
//   }, [resendCooldown]);

//   const resetState = () => {
//     setStep("enterEmail");
//     setEmail("");
//     setOtp("");
//     setFullName("");
//     setMobile("");
//     setCity("");
//     setIsNewVisitor(null);
//     setError("");
//     setInfo("");
//     setLoading(false);
//     setResendCooldown(0);
//   };

//   // Called when user enters email and clicks Send OTP
//   const handleSendOtp = async (e) => {
//     e?.preventDefault?.();
//     setError("");
//     setInfo("");
//     if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
//       setError("Please enter a valid email.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await sendEmailOtp(email);
//       // expected res: { success: true, message: "...", isNewVisitor: true|false }
//       if (res?.success) {
//         setIsNewVisitor(Boolean(res.isNewVisitor));
//         setStep("otp");
//         setInfo("OTP has been sent to your email.");
//         setResendCooldown(60); // 30s cooldown for resend
//       } else {
//         setError(res?.message || "Failed to send OTP.");
//       }
//     } catch (err) {
//       setError("Failed to send OTP. Try again.");
//       console.error(err);
//     } finally {
//     }
//   };

//   // Called when user submits OTP (and registration fields if new)
//   const handleVerify = async (e) => {
//     e?.preventDefault?.();
//     setError("");
//     setInfo("");
//     if (!otp) {
//       setError("Please enter the OTP.");
//       return;
//     }

//     // build payload depending on new/existing user
//     const payload = isNewVisitor
//       ? { email, otp, fullName, mobile, city }
//       : { email, otp };

//     try {
//       setLoading(true);
//       const res = await verifyEmailOtp(payload);
//       // success -> set cookie and call onAuthSuccess
//       if (res?.success && res?.data?._id) {
//         const visitorId = res.data._id;
//         Cookies.set("visitorId", visitorId, { expires: 7 });
//         // clear local modal state
//         resetState();
//         onClose?.();
//         onAuthSuccess?.(res.data); // let parent update UI
//       } else {
//         // show invalid otp or backend message in red
//         setError(res?.message || "Verification failed.");
//       }
//     } catch (err) {
//       // If backend returned non-2xx, post wrapper may throw; inspect err.response
//       const msg = err?.response?.data?.message || "Verification failed. Please try again.";
//       setError(msg);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     if (resendCooldown > 0) return;
//     setError("");
//     setInfo("");
//     try {
//       setLoading(true);
//       const res = await sendEmailOtp(email);
//       if (res?.success) {
//         setInfo("OTP resent to your email.");
//         setResendCooldown(30);
//       } else {
//         setError(res?.message || "Could not resend OTP");
//       }
//     } catch (err) {
//       setError("Could not resend OTP. Try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Close cleanup
//   React.useEffect(() => {
//     if (!isOpen) resetState();
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
//         <button
//           className="text-gray-400 hover:text-gray-700 float-right"
//           onClick={() => { onClose?.(); resetState(); }}
//         >
//           ✕
//         </button>

//         {step === "enterEmail" && (
//           <form onSubmit={handleSendOtp} className="space-y-4">
//             <h3 className="text-lg font-semibold">Sign in / Register</h3>
//             <p className="text-sm text-gray-500">
//               Enter your email. We will send an OTP to continue.
//             </p>

//             {error && <div className="text-sm text-red-600">{error}</div>}
//             {info && <div className="text-sm text-green-600">{info}</div>}

//             <input
//               type="email"
//               className="w-full border rounded px-3 py-2"
//               placeholder="your@email.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => { onClose?.(); resetState(); }}
//                 className="px-4 py-2 bg-gray-200 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {loading ? "Sending..." : "Send OTP"}
//               </button>
//             </div>
//           </form>
//         )}

//         {step === "otp" && (
//           <form onSubmit={handleVerify} className="space-y-4">
//             <h3 className="text-lg font-semibold">
//               {isNewVisitor ? "Complete Registration" : "Enter OTP"}
//             </h3>
//             <p className="text-sm text-gray-500">OTP sent to <strong>{email}</strong></p>

//             {error && <div className="text-sm text-red-600">{error}</div>}
//             {info && <div className="text-sm text-green-600">{info}</div>}

//             {/* OTP input */}
//             <input
//               type="text"
//               inputMode="numeric"
//               className="w-full border rounded px-3 py-2"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.trim())}
//               maxLength={6}
//               required
//             />

//             {/* If new visitor show registration fields */}
//             {isNewVisitor && (
//               <>
//                 <input
//                   type="text"
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Full name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="tel"
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Mobile number"
//                   value={mobile}
//                   onChange={(e) => setMobile(e.target.value)}
//                 />
//                 <input
//                   type="text"
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="City"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                 />
//               </>
//             )}

//             <div className="flex items-center justify-between">
//               <div className="text-sm">
//                 <button
//                   type="button"
//                   onClick={handleResend}
//                   disabled={resendCooldown > 0 || loading}
//                   className={`text-sm ${resendCooldown > 0 ? "text-gray-400" : "text-blue-600 underline"}`}
//                 >
//                   {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
//                 </button>
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => { setStep("enterEmail"); setOtp(""); setError(""); }}
//                   className="px-4 py-2 bg-gray-200 rounded"
//                 >
//                   Back
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   {loading ? "Verifying..." : (isNewVisitor ? "Register" : "Verify")}
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
