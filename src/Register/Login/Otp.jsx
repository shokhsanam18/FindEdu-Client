import { Toaster as Sonner, toast } from "sonner";
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const API_BASE = "https://findcourse.net.uz/api/users";

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    if (!storedEmail) {
      toast.error("No email found for OTP verification");
      navigate("/register");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 5) {
      toast.error("Please enter a complete 5-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/verify-otp`, {
        email,
        otp: otpString,
      });

      toast.success("Account verified successfully!");
      localStorage.removeItem("otpEmail");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post(`${API_BASE}/resend-otp`, { email });
      toast.success("New OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#6d24b719] m-0">
      <Sonner theme="light" position="top-right" richColors />

      <Link to="/">
        <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold cursor-pointer">
          <p className="flex">
            F<img src={icon} alt="Logo" className="h-7 w-4 mx-1 mt-3" />
            ndedu.uz
          </p>
        </div>
      </Link>
      
      <div className="w-full flex items-center justify-center p-6 bg-gradient-to-b from-white to-purple-100 h-screen">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">
            Verify Email
          </h2>
          
          <p className="text-center text-gray-600 mb-8">
            Enter the 5-digit code sent to {email}
          </p>

          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-14 text-2xl text-center border-2 border-gray-300 rounded-lg 
                          focus:border-[#461773] focus:ring-2 focus:ring-[#46177333]"
              />
            ))}
          </div>

          <Button
            onClick={verifyOtp}
            disabled={otp.join("").length !== 5 || isLoading}
            className="cursor-pointer h-[50px] w-full bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <p className="text-m text-gray-600 mt-4 text-center">
            Didn't receive code?{" "}
            <button
              type="button"
              className="text-[#461773] font-semibold hover:underline"
              onClick={resendOtp}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Otp;