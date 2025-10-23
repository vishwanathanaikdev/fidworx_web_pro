// src/api/apiHelper.js
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;
const apiKey = import.meta.env.VITE_API_AUTH_KEY;

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  },
});

// Common GET
export const get = async (url, params = {}) => {
  try {
    const response = await instance.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("GET API Error:", error);
    throw error;
  }
};

// Common POST
export const post = async (url, data = {}) => {
  try {
    const response = await instance.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST API Error:", error);
    throw error;
  }
};



// Common DELETE (with request body)
export const del = async (url, data = {}) => {
  try {
    const response = await instance.delete(url, { data });
    return response.data;
  } catch (error) {
    console.error("DELETE API Error:", error);
    throw error;
  }
};









///======>>> Below is working base


// // src/api/apiHelper.js
// import axios from "axios";

// const baseURL = import.meta.env.VITE_BASE_URL;
// const apiKey = import.meta.env.VITE_API_AUTH_KEY;

// const instance = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     "x-api-key": apiKey,
//   },
// });

// // Common GET
// export const get = async (url, params = {}) => {
//   try {
//     const response = await instance.get(url, { params });
//     return response.data;
//   } catch (error) {
//     console.error("GET API Error:", error);
//     throw error;
//   }
// };

// // Common POST
// export const post = async (url, data = {}) => {
//   try {
//     const response = await instance.post(url, data);
//     return response.data;
//   } catch (error) {
//     console.error("POST API Error:", error);
//     throw error;
//   }
// };










//===================>>>> 2


// // src/api/apiHelper.js
// import axios from "axios";

// const baseUrl = import.meta.env.VITE_BASE_URL;
// const apiKey = import.meta.env.VITE_API_AUTH_KEY;

// // Create an axios instance
// const api = axios.create({
//   baseURL: baseUrl,
//   headers: {
//     "Content-Type": "application/json",
//     "x-api-key": apiKey,
//   },
// });

// // Common request function
// const request = async (endpoint, method = "GET", body = null, params = {}) => {
//   try {
//     const config = {
//       url: endpoint,
//       method,
//       params,  // query params
//       data: body, // request body
//     };

//     const response = await api(config);
//     return response.data?.data || response.data; // assuming { data: ... } structure
//   } catch (error) {
//     console.error("API Error:", error);
//     throw error.response?.data || error;
//   }
// };

// // ========== Managed Office APIs ==========
// export const getManagedOffices = (page = 1, size = 10, search = "") => {
//   const params = { page, size };
//   if (search) params.search = search;
//   return request("/api/coreManagedOfficeData", "GET", null, params);
// };

// export const getManagedOfficeById = (id) => {
//   return request("/api/getManagedOfficeDataWithId", "GET", null, { Id: id });
// };

// // ========== Co-Working Space APIs ==========
// export const getCoworkingSpaces = (page = 1, size = 10, search = "") => {
//   const params = { page, size };
//   if (search) params.search = search;
//   return request("/api/coreCoworkingData", "GET", null, params);
// };

// export const getCoworkingSpaceById = (id) => {
//   return request("/api/getCoworkingDataWithId", "GET", null, { Id: id });
// };

// // ========== Office Space APIs ==========
// export const getOfficeSpaces = (page = 1, size = 10, search = "") => {
//   const params = { page, size };
//   if (search) params.search = search;
//   return request("/api/coreOfficeSpaceData", "GET", null, params);
// };

// export const getOfficeSpaceById = (id) => {
//   return request("/api/getOfficeSpaceDataWithId", "GET", null, { Id: id });
// };









//========================>>>>>




// // src/api/apiHelper.js


// const baseUrl = process.env.VITE_BASE_URL;
// const apiKey = process.env.VITE_API_AUTH_KEY;

// // Common request function
// const request = async (endpoint, method = "GET", body = null, params = "") => {
//   try {
//     const url = `${baseUrl}${endpoint}${params ? `?${params}` : ""}`;
    
//     const response = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": apiKey,
//       },
//       body: body ? JSON.stringify(body) : null,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result.data || result; // assuming your backend always wraps in {data}
//   } catch (error) {
//     console.error("API Error:", error);
//     throw error;
//   }
// };

// // ========== Managed Office APIs ==========

// // Get managed offices (with optional search, page, size)
// export const getManagedOffices = (page = 1, size = 10, search = "") => {
//   let params = `page=${page}&size=${size}`;
//   if (search) params += `&search=${search}`;
//   return request("/api/coreManagedOfficeData", "GET", null, params);
// };

// // Get managed office by ID
// export const getManagedOfficeById = (id) => {
//   return request(`/api/getManagedOfficeDataWithId`, "GET", null, `Id=${id}`);
// };

// // ========== Co-Working Space APIs ==========
// export const getCoworkingSpaces = (page = 1, size = 10, search = "") => {
//   let params = `page=${page}&size=${size}`;
//   if (search) params += `&search=${search}`;
//   return request("/api/coreCoworkingData", "GET", null, params);
// };

// export const getCoworkingSpaceById = (id) => {
//   return request(`/api/getCoworkingDataWithId`, "GET", null, `Id=${id}`);
// };

// // ========== Office Space APIs ==========
// export const getOfficeSpaces = (page = 1, size = 10, search = "") => {
//   let params = `page=${page}&size=${size}`;
//   if (search) params += `&search=${search}`;
//   return request("/api/coreOfficeSpaceData", "GET", null, params);
// };

// export const getOfficeSpaceById = (id) => {
//   return request(`/api/getOfficeSpaceDataWithId`, "GET", null, `Id=${id}`);
// };
