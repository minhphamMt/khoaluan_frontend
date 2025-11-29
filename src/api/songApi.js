import axiosClient from "./axiosClient.js";

const songApi = {
  searchSpotify: async (query) => {
    const { data } = await axiosClient.get("/search/spotify", {
      params: { q: query },
    });
    return data;
  },
  getSong: async (id) => {
    const { data } = await axiosClient.get(`/songs/${id}`);
    return data;
  },
  listen: async (songId) => {
    const { data } = await axiosClient.post("/interactions/listen", { songId });
    return data;
  },
  like: async (songId) => {
    const { data } = await axiosClient.post("/interactions/like", { songId });
    return data;
  },
};

export default songApi;
