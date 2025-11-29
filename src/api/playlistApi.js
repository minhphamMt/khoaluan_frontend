import axiosClient from "./axiosClient.js";

const playlistApi = {
  getMine: async () => {
    const { data } = await axiosClient.get("/playlists/mine");
    return data;
  },
  create: async (payload) => {
    const { data } = await axiosClient.post("/playlists", payload);
    return data;
  },
  getById: async (id) => {
    const { data } = await axiosClient.get(`/playlists/${id}`);
    return data;
  },
  addSong: async (id, songId) => {
    const { data } = await axiosClient.post(`/playlists/${id}/add`, { songId });
    return data;
  },
  removeSong: async (id, songId) => {
    const { data } = await axiosClient.delete(`/playlists/${id}/remove`, {
      data: { songId },
    });
    return data;
  },
};

export default playlistApi;
