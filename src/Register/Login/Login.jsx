import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";
import google from "/public/google.png";

const API_BASE = "http://3.37.19.181:4000/api/users";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        alert("Login successful!");
        navigate("/ndsdn");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post(`${API_BASE}/reset-password`, { email, otp, newPassword });
      alert("Password reset successfully.");
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white from-white to-purple-400">
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-white to-purple-100 items-center justify-center p-8 relative">
        <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
          F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />ndedu.uz
        </div>
        <div className="text-[#461773] text-center relative ml-6">
          <h2 className="text-4xl font-bold mb-10">Welcome Back!</h2>
          <img src={register} alt="Illustration" className="w-[500px] h-auto relative z-10" />
          <img className="z-0 absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 w-[400px] h-[90px]" src={purple} alt="Shadow Effect" />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center p-6 md:p-16 bg-gradient-to-b from-white to-purple-100">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">Login</h2>
          <form className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-3 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-3 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={loginUser} className="w-full p-3 bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition">Login</button>
          </form>
          <p className="text-m text-gray-600 mt-4 text-center">Don't have an account? <Link to="/" className="text-purple-600 font-semibold hover:underline">Register</Link></p>
          <Link to="/forget"><h2 className="text-m text-center mt-6 underline">Forgot Password?</h2></Link>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
