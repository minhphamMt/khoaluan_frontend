import { create } from "zustand";
import authApi from "../api/authApi.js";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
  setToken: (token) => set({ token }),
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authApi.login(credentials);
      localStorage.setItem("token", token);
      set({ token, user });
      return user;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Login failed" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authApi.register(payload);
      localStorage.setItem("token", token);
      set({ token, user });
      return user;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Register failed" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  loadUser: async () => {
    const token = get().token;
    if (!token) return null;
    try {
      const user = await authApi.me();
      set({ user });
      return user;
    } catch (error) {
      console.error("Failed to load user", error);
      localStorage.removeItem("token");
      set({ token: null, user: null });
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
