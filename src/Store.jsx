import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { createJSONStorage, persist } from "zustand/middleware";
const API_BASE = "http://18.141.233.37:4000/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  profileImageUrl: null,

  fetchUserData: async () => {
    try {
      const token = await get().refreshTokenFunc(false); // don't logout immediately on missing token
      if (!token) return null;

      const { data } = await axios.get(`${API_BASE}/users/mydata`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let role = data?.role;
      if (!role && token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          role = decoded?.role || "USER";
        } catch {
          role = "USER";
        }
      }

      const userData = { ...data, role };
      set({ user: userData });
      // console.log(userData);
      return userData;
    } catch (error) {
      console.warn(
        "Failed to fetch user data:",
        error?.response?.data || error
      );
      return null;
    }
  },

  login: async (values) => {
    try {
      const res = await axios.post(`${API_BASE}/users/login`, values);
      const { accessToken, refreshToken } = res.data;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({ accessToken, refreshToken });

        const user = await get().fetchUserData();
        toast.success("Login successful!");
        return { success: true, role: user?.role };
      }

      toast.error("Invalid credentials");
      return { success: false };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, message: error.response?.data?.message };
    }
  },

  refreshTokenFunc: async (shouldLogout = true) => {
    const refreshToken = get().refreshToken;

    if (!refreshToken) {
      if (shouldLogout) get().logout();
      return null;
    }

    try {
      const { data } = await axios.post(`${API_BASE}/users/refreshToken`, {
        refreshToken,
      });

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        set({ accessToken: data.accessToken });
        return data.accessToken;
      }

      if (shouldLogout) get().logout();
      return null;
    } catch (error) {
      if (shouldLogout) get().logout();
      return null;
    }
  },

  isLoggedIn: () => !!get().user?.isActive,

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      profileImageUrl: null,
    });
  },

  deleteAccount: async () => {
    try {
      const { user, refreshTokenFunc, logout } = get();
      const token = await refreshTokenFunc();
      const userId = user?.data?.id;

      if (!token || !userId) return toast.error("User not authenticated");

      await axios.delete(`${API_BASE}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    }
  },

  autoRefreshToken: () => {
    const scheduleRefresh = () => {
      const token = get().accessToken;
      if (!token) return;

      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        const timeUntilExpiry = exp * 1000 - Date.now() - 30000;

        setTimeout(
          () => {
            get().refreshTokenFunc();
          },
          timeUntilExpiry > 0 ? timeUntilExpiry : 0
        );
      } catch {
        get().logout();
      }
    };

    scheduleRefresh();
  },

  fetchProfileImage: async (filename) => {
    if (!filename) {
      set({ profileImageUrl: null });
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/image/${filename}`, {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(res.data);
      set({ profileImageUrl: blobUrl });
    } catch {
      set({ profileImageUrl: null });
    }
  },
}));

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  fetchCategories: async ({
    name = "",
    page = 1,
    limit = 10,
    sortOrder = "ASC",
  } = {}) => {
    set({ loading: true, error: null });

    try {
      const params = {
        ...(name && { name }),
        page,
        limit,
        sortOrder,
      };

      const { data } = await axios.get(`${API_BASE}/categories`, { params });
      console.log(data);

      set({
        categories: data.data || [],
        pagination: {
          page,
          limit,
          total: data.total || 0,
        },
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
      set({ error, loading: false });
    }
  },
}));

export const useSearchStore = create((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));

export const useSidebarStore = create((set) => ({
  side: false,
  closeSidebar: () => set(() => ({ side: false })),
  openSidebar: () => set(() => ({ side: true })),
}));



export const useLikedStore = create((set, get) => ({
  likedItems: [], // Array of { centerId, id (likeId) }
  loading: false,

  fetchLiked: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE}/liked/query`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const liked = res.data?.data || [];

      // Save both centerId and the likeId (id) from the backend
      const likedItems = liked.map((item) => ({
        centerId: item.centerId,
        id: item.id,
      }));

      set({ likedItems });
    } catch (err) {
      console.error("Failed to fetch liked centers", err);
    } finally {
      set({ loading: false });
    }
  },

  toggleLike: async (centerId) => {
    const { likedItems } = get();
    const token = localStorage.getItem("accessToken");

    const existing = likedItems.find((item) => item.centerId === centerId);

    try {
      if (existing) {
        // Unlike using `likeId` (not centerId)
        await axios.delete(`${API_BASE}/liked/${existing.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({
          likedItems: likedItems.filter((item) => item.centerId !== centerId),
        });
      } else {
        // Like
        const res = await axios.post(
          `${API_BASE}/liked`,
          { centerId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newLike = res.data?.data;
        if (newLike?.id) {
          set({
            likedItems: [...likedItems, { centerId, id: newLike.id }],
          });
        }
      }
    } catch (err) {
      console.error("Toggle like error", err);
    }
  },

  isLiked: (centerId) =>
    get().likedItems.some((item) => item.centerId === centerId),
}));
