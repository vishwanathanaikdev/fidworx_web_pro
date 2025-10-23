// src/services/managedOfficeService.js
import { get } from "../apiHelper";

// Fetch managed office list (with pagination + search)
export const getCoWorkingSpaceData = async (page = 1, size = 10, search = "") => {
  try {
    const result = await get("/api/coreCoWorkingSpaceData", {
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
export const getCoWorkingSpaceById = async (id) => {
  try {
    const result = await get("/api/getCoWorkingSpaceDataWithId", { Id: id });
    return result?.data || null;
  } catch (err) {
    console.error("Managed Office By ID Service Error:", err);
    return null;
  }
};


//Searching

export const searchCoWorkingSpaceData = async (page = 1, size = 10, filters = {}) => {
  try {
    const params = {
      page,
      size,
      ...filters, // city, zone, location, facilityType, seatingCapacity, etc.
    };

    const result = await get("/api/searchCoWorkingSpaceData", params);

    return result?.data || [];
  } catch (err) {
    console.error("Co-working Space Service Error:", err);
    return [];
  }
};