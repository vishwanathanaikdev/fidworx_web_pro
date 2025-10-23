import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
// import { sendEmailOtp, verifyEmailOtp } from "../../api/services/visitorService";
import { sendEmailOtp, verifyEmailOtp } from "../../../api/services/visitorService";
// import { BREAKPOINTS } from "../../lib/device";

const MobileAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [authStep, setAuthStep] = useState("email");
  const [otp, setOtp] = useState("");
  const [isNewVisitor, setIsNewVisitor] = useState(false);
  const [authError, setAuthError] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [formData, setFormData] = useState({ mobile: "", city: "" });
  const [otpTimer, setOtpTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  // OTP countdown
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    } else {
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
      setOtp("");
      setOtpTimer(59);
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
      onSuccess?.(res.data);
      onClose();
    } catch (err) {
      setAuthError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-5 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        {/* Email Step */}
        {authStep === "email" && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Login to Continue
            </h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Get the best offers on top workspace
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
              className="w-full h-12 border text-black border-gray-300 rounded-lg px-4 text-sm placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {authError && <p className="text-red-500 text-xs mb-3 text-center">{authError}</p>}

            <div className="flex justify-between gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-12 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOtp}
                className="flex-1 h-12 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {/* OTP Step */}
        {authStep === "otp" && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {isNewVisitor ? "Sign Up" : "Enter OTP"}
            </h2>

            <p className="text-sm text-orange-500 mb-4 text-center">
              OTP sent to <span className="font-medium">{visitorEmail}</span>{" "}
              <span className="ml-2 text-blue-600 cursor-pointer underline" onClick={() => setAuthStep("email")}>
                Edit
              </span>
            </p>

            {/* New Visitor Fields */}
            {isNewVisitor && (
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full h-10 border text-black border-gray-300 rounded-lg px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full h-10 border text-black border-gray-300 rounded-lg px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-10 border text-black border-gray-300 rounded-lg px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 mb-3">
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
                    if (val && idx < 5) document.getElementById(`otp-${idx}`)?.nextSibling?.focus();
                  }}
                  id={`otp-${idx}`}
                  className="w-8 h-10 text-center  text-black text-base border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              ))}
            </div>

            {otpTimer > 0 && <p className="text-xs text-gray-500 text-center mb-2">OTP expires in {otpTimer}s</p>}
            {authError && <p className="text-red-500 text-center text-xs mb-2">{authError}</p>}

            <p className="text-xs text-gray-500 text-center mb-3">
              Didn't receive OTP?{" "}
              <span
                className={`cursor-pointer underline ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
                onClick={() => !resendDisabled && handleSendOtp()}
              >
                Resend
              </span>
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-11 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 h-11 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition"
              >
                Verify OTP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileAuthModal;
