import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";

const API_BASE = "http://18.141.233.37:4000/api/users";

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    try {
      await axios.post(`${API_BASE}/reset-password`, { email: state.email, otp, newPassword });
      alert("Password reset successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid OTP or error resetting password.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white from-white to-purple-400 m-0">
      <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
        F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />ndedu.uz
      </div>
      <div className="w-full flex items-center justify-center p-6 bg-gradient-to-b from-white to-purple-100">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">Verify OTP</h2>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Enter OTP" 
              className="w-full p-3 border rounded-md" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Enter new password" 
              className="w-full p-3 border rounded-md" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
            <button 
              type="button" 
              onClick={resetPassword} 
              className="w-full p-3 bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;