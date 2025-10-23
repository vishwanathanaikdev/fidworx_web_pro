// src/services/managedOfficeService.js
import { get } from "../apiHelper";


//pagination work
export const searchManagedOffices = async (page = 1, size = 10, filters = {}) => {
  const params = { page, size, ...filters };
  const result = await get("/api/searchManageOfficeData", params);

  if (result?.data) {
    return {
      data: result.data,
      total: result.total || 0,
      page: result.page || page,
      size: result.size || size,
      ...filters
    };
  }
  return { data: [], total: 0, page, size };
};


//main API to get all data and also with search get data
// export const searchManagedOffices = async (page = 1, size = 5, filters = {}) => {
//   try {
//     const params = {
//       page,
//       size,
//       ...filters, // city, zone, location, facilityType, seatingCapacity, etc.
//     };

//     const result = await get("/api/searchManageOfficeData", params);

//     return result?.data || [];
//   } catch (err) {
//     console.error("Managed Office Service Error:", err);
//     return [];
//   }
// };

// Fetch managed office list (with pagination + search)
export const getManagedOffices = async (page = 1, size = 5, search = "") => {
  try {
    const result = await get("/api/coreManagedOfficeData", {
      page,
      size,
      search,
    });
    return result?.data || [];
  } catch (err) {
    console.error("Managed Office Service Error:", err);
    return [];
  }
};

// Fetch single office by ID
export const getManagedOfficeById = async (id) => {
  try {
    const result = await get("/api/getManagedOfficeDataWithId", { Id: id });
    return result?.data || null;
  } catch (err) {
    console.error("Managed Office By ID Service Error:", err);
    return null;
  }
};




// Fetch managed office list (with pagination + search)
// export const searchManagedOffices = async (page = 1, size = 10, search = "") => {
//   try {
//     const result = await get("/api/searchManageOfficeData", {
//       page,
//       size,
//       search,
//     });
//     return result?.data || [];
//   } catch (err) {
//     console.error("Managed Office Service Error:", err);
//     return [];
//   }
// };

//=============>>.Below habba
// src/api/services/managedOfficeService.js





/// Below is working 
// export const searchManagedOffices = async (
//     page = 1,
//     size = 10,
//     city = "",
//     zone = "",
//     location = ""
//   ) => {
//     try {
//       const result = await get("/api/searchManageOfficeData", {
//         page,
//         size,
//         city,
//         zone,
//         location,
//       });
//       return result?.data || [];
//     } catch (err) {
//       console.error("Managed Office Service Error:", err);
//       return [];
//     }
//   };
  









//====================>>> old base working


// // src/services/managedOfficeService.js
// import { get } from "../apiHelper";

// // Fetch managed office list (with pagination + search)
// export const getManagedOffices = async (page = 1, size = 10, search = "") => {
//   try {
//     const result = await get("/api/coreManagedOfficeData", {
//       page,
//       size,
//       search,
//     });
//     return result?.data || [];
//   } catch (err) {
//     console.error("Managed Office Service Error:", err);
//     return [];
//   }
// };

// // Fetch single office by ID
// export const getManagedOfficeById = async (id) => {
//   try {
//     const result = await get("/api/getManagedOfficeDataWithId", { Id: id });
//     return result?.data || null;
//   } catch (err) {
//     console.error("Managed Office By ID Service Error:", err);
//     return null;
//   }
// };

