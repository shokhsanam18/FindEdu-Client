import axios from "axios";
import { createContext, useEffect, useState } from "react";

const API_BASE = "https://findcourse.net.uz/";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/users/mydata`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUserData(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      fetchUserData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        fetchUserData,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
