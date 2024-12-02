import axios from "axios";

export const BASE_URL = "https://streaminggap.onrender.com";


export const registerAPI = async (payload) => {
   const { data } = await axios.post(`${BASE_URL}/auth/register`, payload);
   return data;
};
