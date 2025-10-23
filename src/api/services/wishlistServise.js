// src/services/wishlistService.js
import { post, get, del } from "../apiHelper";

// API to add property to wishlist
export const postWishlistData = async (data) => {
  try {
    const response = await post("/api/postWishlistData", data);
    return response;
  } catch (error) {
    console.error("Wishlist Service Error (POST):", error);
    throw error;
  }
};

// API to get wishlist by visitorId
export const getWishlistData = async (visitorId) => {
  try {
    const response = await get(`/api/getWishlistData?visitorId=${visitorId}`);
    return response;
  } catch (error) {
    console.error("Wishlist Service Error (GET):", error);
    throw error;
  }
};

// API to delete property from wishlist
// export const deleteWishlistData = async (data) => {
//   try {
//     const response = await post("/api/deleteWishlistData", data);
//     return response;
//   } catch (error) {
//     console.error("Wishlist Service Error (DELETE):", error);
//     throw error;
//   }
// };



export const deleteWishlistData = async (data) => {
    return await del("/api/deleteWishlistData", data);
  };








//============>>> Old


// // src/services/wishlistService.js
// import { post } from "../apiHelper";

// // API to add property to wishlist
// export const postWishlistData = async (data) => {
//   try {
//     const response = await post("/api/postWishlistData", data);
//     return response;
//   } catch (error) {
//     console.error("Wishlist Service Error:", error);
//     throw error;
//   }
// };
