import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import Cookies from "js-cookie";

const MobileLeadEnquiryModal = ({ isOpen, onClose, onSubmit, leadMessage, setLeadMessage }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const visitorId = Cookies.get("visitorId");
  const leadCookieKey = `leadSent_${visitorId}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(leadMessage);
    if (success) {
      if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
      setShowSuccess(true);
      setLeadMessage("");
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2500); // auto close after 2.5s
    }
  };

  const handleCancel = async () => {
    const leadAlreadySent = Cookies.get(leadCookieKey);

    if (!leadAlreadySent) {
      // first-time cancel, send lead silently with default message
      const messageToSend = leadMessage?.trim() ? leadMessage : "Looking for Space";
      await onSubmit(messageToSend);
      setLeadMessage("");
      if (visitorId) Cookies.set(leadCookieKey, "InfoSent", { expires: 7 });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={handleCancel} // outside click triggers cancel
    >
      <div
        className="bg-white rounded-xl w-full max-w-sm p-5 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-lg font-bold"
        >
          ×
        </button>

        {/* Success View */}
        {showSuccess ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Thank you for Reaching Out
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Our team will get back to you within 24 hours with your personalized quote.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full h-10 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Lead Form View */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Send Your Enquiry
            </h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Let us know your interest. Our team will reach out soon.
            </p>

            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="Enter your message (optional)"
                value={leadMessage}
                onChange={(e) => setLeadMessage(e.target.value)}
                className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-orange-400  resize-none mb-3"
              />

              <p className="text-xs text-gray-500 mb-3 leading-[16px]">
                After you submit, your details may be shared with workspace providers who may contact you. Read our{" "}
                <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span> for more info.
              </p>

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 h-10 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 h-10 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileLeadEnquiryModal;
