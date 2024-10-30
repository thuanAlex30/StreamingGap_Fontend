import axios from "axios";

export const BASE_URL = "http://localhost:1010";


export const registerAPI = async (payload) => {
   const { data } = await axios.post(`${BASE_URL}/auth/register`, payload);
   return data;
};