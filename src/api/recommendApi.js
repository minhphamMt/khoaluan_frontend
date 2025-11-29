import axiosClient from "./axiosClient.js";

const recommendApi = {
  trending: async () => {
    const { data } = await axiosClient.get("/recommend/trending");
    return data;
  },
  home: async () => {
    const { data } = await axiosClient.get("/recommend/home");
    return data;
  },
  contentBased: async (songId) => {
    const { data } = await axiosClient.get(
      `/recommend/content-based/${songId}`
    );
    return data;
  },
  userBased: async () => {
    const { data } = await axiosClient.get("/recommend/user-based");
    return data;
  },
  smartShuffle: async (playlistId) => {
    const { data } = await axiosClient.get(
      `/recommend/smart-shuffle/${playlistId}`
    );
    return data;
  },
};

export default recommendApi;
