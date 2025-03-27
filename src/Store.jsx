import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("accessToken") || null, 

  setToken: (newToken) => {
    localStorage.setItem("accessToken", newToken); 
    set({ token: newToken }); 
  },

  removeToken: () => {
    localStorage.removeItem("accessToken"); 
    set({ token: null }); 
  },
}));

