import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_BASE = "http://18.141.233.37:4000/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  profileImageUrl: null,

  // Fetch user data (GET /users/mydata)
  fetchUserData: async () => {
    try {
      // 🔄 Always refresh token before calling /mydata
      let token = await get().refreshTokenFunc();
      if (!token) {
        console.warn("❌ No access token after refresh.");
        return null;
      }

      
      const { data } = await axios.get(`${API_BASE}/users/mydata`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      let role = data?.role; // Check if API response has role

      // 🛠 Extract role from JWT token if missing from API
      if (!role && token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          role = decoded?.role || "USER"; 
        } catch (error) {
          console.warn("❌ Failed to decode token:", error);
        }
      }

      if (!role) {
        console.warn("❌ Role still missing. Defaulting to USER.");
        role = "USER"; // Fallback role
      }

      const userData = { ...data, role }; // Attach extracted role to user data
      set({ user: userData });

      console.log(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user:", error?.response?.data || error);
      return null;
    }
  },

  // Login (POST /users/login)
  login: async (values) => {
    try {
      const response = await axios.post(`${API_BASE}/users/login`, values);
      const data = response.data;

      

      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        set({ accessToken: data.accessToken, refreshToken: data.refreshToken });

        const user = await get().fetchUserData();

        toast.success("Login successful!");
        return { success: true, role: user?.role };
      } else {
        toast.error("Invalid credentials");
        return { success: false };
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Refresh token (POST /users/refreshToken)
  refreshTokenFunc: async () => {
    try {
      const refreshToken = get().refreshToken;

      if (!refreshToken) {
        console.warn("❌ No refresh token available. Logging out.");
        return get().logout();
      }

      const { data } = await axios.post(`${API_BASE}/users/refreshToken`, {
        refreshToken,
      });

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        set({ accessToken: data.accessToken });
        return data.accessToken;
      } else {
        console.warn("❌ Refresh response missing accessToken. Logging out.");
        get().logout();
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error?.response?.data || error);
      get().logout();
    }
  },

  isLoggedIn: () => {
    const user = get().user;
    return !!user && user.isActive;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null });
  },

  // Auto-refresh setup
  autoRefreshToken: () => {
    const checkTokenExpiry = () => {
      const token = get().accessToken;
      if (!token) return;

      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = exp * 1000 - Date.now() - 30000;

        if (expiryTime > 0) {
          setTimeout(() => get().refreshTokenFunc(), expiryTime);
        } else {
          get().refreshTokenFunc();
        }
      } catch {
        console.warn("❌ Token could not be decoded, logging out.");
        get().logout();
      }
    };

    checkTokenExpiry();
  },


  // 🔥 Fetch profile image by filename and store as blob URL
  fetchProfileImage: async (filename) => {
    try {
      const response = await axios.get(`http://18.141.233.37:4000/api/image/${filename}`, {
        responseType: "blob",
      });

      // console.log("Fetched image blob:", response.data);

      const blobUrl = URL.createObjectURL(response.data);
      set({ profileImageUrl: blobUrl });
    } catch (error) {
      console.error("🛑 Failed to fetch profile image:", error);
      set({ profileImageUrl: null });
    }
  },
}));
