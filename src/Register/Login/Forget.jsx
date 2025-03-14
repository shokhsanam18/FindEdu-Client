import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";

const API_BASE = "http://18.141.233.37:4000/api/users";

const Forget = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post(`${API_BASE}/send-otp`, { email });
      alert("OTP sent to your email.");
      navigate("/verifyotp", { state: { email } });
    } catch (error) {
      console.error("OTP Request Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white from-white to-purple-400 m-0">
<div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
          F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />ndedu.uz
        </div>
      <div className="w-full  flex items-center justify-center p-6  bg-gradient-to-b from-white to-purple-100">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">Reset Password</h2>
          <form className="space-y-4">
            <input type="email" placeholder="Enter your email" className="w-full p-3 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="button" onClick={sendOtp} className="w-full p-3 bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition">Send Code</button>
          </form>
          <p className="text-m text-gray-600 mt-4 text-center">Remembered your password? <Link to="/login" className="text-purple-600 font-semibold hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Forget;
