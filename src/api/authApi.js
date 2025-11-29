import axiosClient from "./axiosClient.js";

const authApi = {
  login: async (credentials) => {
    const { data } = await axiosClient.post("/auth/login", credentials);
    return data;
  },
  register: async (payload) => {
    const { data } = await axiosClient.post("/auth/register", payload);
    return data;
  },
  me: async () => {
    const { data } = await axiosClient.get("/auth/me");
    return data;
  },
};

export default authApi;
