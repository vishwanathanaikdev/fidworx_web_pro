import { get } from "../apiHelper";


export const getUserDataById = async (id) => {
  try {
    const result = await get("/api/getUsersDataWithId", { Id: id });
    return result?.data || null;
  } catch (err) {
    console.error("Get User By ID Service Error:", err);
    return null;
  }
};



// Get User Data by Id
// export const getUserDataById = async (id) => {
//   try {
//     const response = await get("/api/getUsersDataWithId", {
//       params: { Id: id },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user data by id:", error);
//     throw error;
//   }
// };
