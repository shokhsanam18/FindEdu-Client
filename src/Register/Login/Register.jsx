// import React from "react";

// import purple from "/public/purple.png"
// import icon from "/public/icon.png"
// import register from "/public/register.png"
// import google from "/public/google.png"

// const Register = () => {
//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-white  from-white to-purple-400">
//       {/* Left Side - Illustration */}
//       <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-white to-purple-100 items-center justify-center p-8 relative">
//         {/* Logo */}
//         <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
//           F
//           <img src={icon} alt="Logo" className="h-7 w-4 mx-1" />
//           ndedu.uz
//         </div>

//         <div className="text-[#461773] text-center relative ml-6">
//           <h2 className="text-4xl font-bold mb-10">Welcome to the page!</h2>
//           {/* Illustration Image */}
//           <img src={register} alt="Illustration" className="w-[500px] h-auto relative z-10" />
//           {/* Shadow Effect */}
//           <div className="">
//   <img 
//     className="z-0 absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 w-[400px] h-[90px]" 
//     src={purple} 
//     alt="Shadow Effect" 
//   />
// </div>
//         </div>
//       </div>

//       {/* Right Side - Form */}
//       <div className="w-full md:w-2/3 flex items-center justify-center p-6 md:p-16 md:flex bg-gradient-to-b from-white to-purple-100 ">
//   <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
//     <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">Create Account</h2>
//     <form className="space-y-4">
//       <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
//         <input
//           type="text"
//           placeholder="First Name"
//           className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none"
//         />
//         <input
//           type="text"
//           placeholder="Last Name"
//           className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none"
//         />
//       </div>
//       <input
//         type="email"
//         placeholder="Email"
//         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none"
//       />
//       <input
//         type="tel"
//         placeholder="Phone Number"
//         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none"
//       />
//       <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none">
//         <option value="">Select Role</option>
//         <option value="CEO">CEO</option>
//         <option value="Admin">Admin</option>
//         <option value="User">User</option>
//       </select>
//       <input
//         type="file"
//         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none"
//       />
//       <button
//         type="submit"
//         className="w-full p-3 bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300"
//       >
//         Create Account
//       </button>
//     </form>
//     <p className="text-m text-gray-600 mt-4 text-center">
//       Already have an account? {" "}
//       <a href="/login" className="text-purple-600 font-semibold hover:underline">Login</a>
//     </p>
//     <div className="flex items-center my-6">
//       <hr className="flex-grow border-gray-300" />
//       <span className="px-4 text-gray-500">or</span>
//       <hr className="flex-grow border-gray-300" />
//     </div>
//     <div className="flex justify-center">
//       <button className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-100 transition">
//         <img src={google} alt="Google" className="w-6" />
//         <span>Sign up with Google</span>
//       </button>
//     </div>
//   </div>
// </div>


//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";
import google from "/public/google.png";

const API_BASE = "http://3.37.19.181:4000/api/users";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("CEO");
  const [image, setImage] = useState(null);

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/register`, { firstName, lastName, email, phone, password, role, image: "image.jpg" });
      alert("User registered successfully! Please check your email for OTP.");
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post(`${API_BASE}/sentt-otp`, { email });
      alert("OTP sent to email.");
    } catch (error) {
      console.error("OTP Send Error:", error.response?.data || error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${API_BASE}/verify-otp`, { email, otp });
      alert("OTP Verified Successfully!");
    } catch (error) {
      console.error("OTP Verification Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white from-white to-purple-400">
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-white to-purple-100 items-center justify-center p-8 relative">
        <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
          F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />ndedu.uz
        </div>
        <div className="text-[#461773] text-center relative ml-6">
          <h2 className="text-4xl font-bold mb-10">Welcome to the page!</h2>
          <img src={register} alt="Illustration" className="w-[500px] h-auto relative z-10" />
          <img className="z-0 absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 w-[400px] h-[90px]" src={purple} alt="Shadow Effect" />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center p-6 md:p-16 md:flex bg-gradient-to-b from-white to-purple-100">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">Create Account</h2>
          <form className="space-y-4" onSubmit={registerUser}>
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              <input type="text" placeholder="First Name" className="w-full md:w-1/2 p-3 border rounded-md" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input type="text" placeholder="Last Name" className="w-full md:w-1/2 p-3 border rounded-md" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <input type="email" placeholder="Email" className="w-full p-3 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-3 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-md" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select className="w-full p-3 border rounded-md" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CEO">CEO</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <input
        type="file"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 outline-none"
      />
            <button type="submit" className="w-full p-3 bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition">Create Account</button>
          </form>
          <button onClick={sendOtp} className="w-full p-3 mt-4 bg-gray-300 text-black font-semibold rounded-md">Send OTP</button>
          <input type="text" placeholder="Enter OTP" className="w-full p-3 border rounded-md mt-2" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp} className="w-full p-3 bg-green-600 text-white font-semibold rounded-md mt-2">Verify OTP</button>
          <p className="text-m text-gray-600 mt-4 text-center">Already have an account? <Link to="/login" className="text-purple-600 font-semibold hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
