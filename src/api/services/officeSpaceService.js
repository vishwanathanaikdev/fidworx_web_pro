// src/services/managedOfficeService.js
import { get } from "../apiHelper";

// Fetch managed office list (with pagination + search)
export const getOfficeSpaces = async (page = 1, size = 10, search = "") => {
  try {
    const result = await get("/api/coreOfficeSpaceData", {
      page,
      size,
      search,
    });
    return result?.data || [];
  } catch (err) {
    console.error("Office Space Service Error:", err);
    return [];
  }
};

// Fetch single office by ID
export const getOfficeSpaceById = async (id) => {
  try {
    const result = await get("/api/getOfficeSpaceDataWithId", { Id: id });
    return result?.data || null;
  } catch (err) {
    console.error("Managed Office By ID Service Error:", err);
    return null;
  }
};



export const searchOfficeSpaces = async (page = 1, size = 10, filters = {}) => {
  try {
    const params = {
      page,
      size,
      ...filters, // city, zone, location, facilityType, seatingCapacity, etc.
    };

    const result = await get("/api/searchOfficeSpaceData", params);

    return result?.data || [];
  } catch (err) {
    console.error("Office Space Service Error:", err);
    return [];
  }
};