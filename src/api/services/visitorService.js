// src/services/visitorService.js
import { get, post } from "../apiHelper";

// API to create visitor
export const postVisitorData = async (data) => {
  try {
    const response = await post("/api/postVisitUsersData", data);
    return response;
  } catch (error) {
    console.error("Visitor Service Error:", error);
    throw error;
  }
};



export const postLeadData = async (leadData) => {
    try {
      const response = await post("/api/postLeadData", leadData);
      return response;
    } catch (error) {
      console.error("Lead Service Error:", error);
      throw error;
    }
  };


  // ✅ API to get notifications
export const getNotifications = async (userId) => {
  try {
    const response = await get("/api/notifications", { userId });
    return response;
  } catch (error) {
    console.error("Notification Service Error:", error);
    throw error;
  }
};


// API to get visitor profile by ID ✅
export const getVisitorProfileById = async (id) => {
  try {
    const response = await get("/api/getVisitUsersDataWithId", { Id: id });
    return response;
  } catch (error) {
    console.error("Visitor Profile Service Error:", error);
    throw error;
  }
};

//new apis
// Send OTP to email
export const sendEmailOtp = async (email) => {
  try {
    // backend expects raw body with email
    const response = await post("/api/send-email-otp", { email });
    return response;
  } catch (error) {
    console.error("sendEmailOtp error:", error);
    throw error;
  }
};

// Verify OTP (login or registration)
export const verifyEmailOtp = async (payload) => {
  try {
    // payload: { email, otp } OR { email, otp, fullName, mobile, city }
    const response = await post("/api/verify-email-otp", payload);
    return response;
  } catch (error) {
    console.error("verifyEmailOtp error:", error);
    throw error;
  }
};









//=======>>> Updating for the new login flow.



// // src/services/visitorService.js
// import { get, post } from "../apiHelper";

// // API to create visitor
// export const postVisitorData = async (data) => {
//   try {
//     const response = await post("/api/postVisitUsersData", data);
//     return response;
//   } catch (error) {
//     console.error("Visitor Service Error:", error);
//     throw error;
//   }
// };



// export const postLeadData = async (leadData) => {
//     try {
//       const response = await post("/api/postLeadData", leadData);
//       return response;
//     } catch (error) {
//       console.error("Lead Service Error:", error);
//       throw error;
//     }
//   };


//   // ✅ API to get notifications
// export const getNotifications = async (userId) => {
//   try {
//     const response = await get("/api/notifications", { userId });
//     return response;
//   } catch (error) {
//     console.error("Notification Service Error:", error);
//     throw error;
//   }
// };


// // API to get visitor profile by ID ✅
// export const getVisitorProfileById = async (id) => {
//   try {
//     const response = await get("/api/getVisitUsersDataWithId", { Id: id });
//     return response;
//   } catch (error) {
//     console.error("Visitor Profile Service Error:", error);
//     throw error;
//   }
// };








//======OLd visitor profile servise updating



// // src/services/visitorService.js
// import { get, post } from "../apiHelper";

// // API to create visitor
// export const postVisitorData = async (data) => {
//   try {
//     const response = await post("/api/postVisitUsersData", data);
//     return response;
//   } catch (error) {
//     console.error("Visitor Service Error:", error);
//     throw error;
//   }
// };



// export const postLeadData = async (leadData) => {
//     try {
//       const response = await post("/api/postLeadData", leadData);
//       return response;
//     } catch (error) {
//       console.error("Lead Service Error:", error);
//       throw error;
//     }
//   };


//   // ✅ API to get notifications
// export const getNotifications = async (userId) => {
//   try {
//     const response = await get("/api/notifications", { userId });
//     return response;
//   } catch (error) {
//     console.error("Notification Service Error:", error);
//     throw error;
//   }
// };


