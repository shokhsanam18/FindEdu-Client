import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_BASE = "http://18.141.233.37:4000/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,

  // Fetch user data (GET /users/me)
  fetchUserData: async () => {
    try {
      // Step 4: Always refresh token before calling /me
      let token = await get().refreshTokenFunc();
      if (!token) {
        console.warn("No access token after refresh.");
        return null;
      }

      // Step 1 & 2: Log token and headers
      console.log("Using token for /mydata:", token);
      console.log("GET", `${API_BASE}/users/mydata`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data } = await axios.get(`${API_BASE}/users/mydata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: data });
      return data;
    } catch (error) {
      console.error("❌ Error fetching user:", error?.response?.data || error);
      return null;
    }
  },

  // Login (POST /users/login)
  login: async (values) => {
    try {
      const response = await axios.post(`${API_BASE}/users/login`, values);
      const data = response.data;

      // Step 3: Log raw response
      console.log("🟢 Login response data:", data);

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
      console.error("❌ Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  },

  // Refresh token (POST /users/refreshToken)
  refreshTokenFunc: async () => {
    try {
      console.log("🔄 Refreshing token...");
      const refreshToken = get().refreshToken;

      if (!refreshToken) {
        console.warn("No refresh token available. Logging out.");
        return get().logout();
      }

      const { data } = await axios.post(`${API_BASE}/users/refreshToken`, {
        refreshToken,
      });

      if (data.accessToken) {
        console.log("✅ Token refreshed:", data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        set({ accessToken: data.accessToken });
        return data.accessToken;
      } else {
        console.warn("Refresh response missing accessToken. Logging out.");
        get().logout();
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error?.response?.data || error);
      get().logout();
    }
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
        console.warn("Token could not be decoded, logging out.");
        get().logout();
      }
    };

    checkTokenExpiry();
  },
}));
