import { Toaster as Sonner, toast } from "sonner";
import React, { useState } from "react";
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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

const Forget = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const sendOtp = async (values) => {
    try {
      await axios.post(`${API_BASE}/send-otp`, values);
      toast.success("OTP sent to your email.");
      setTimeout(
        () => navigate("/verifyotp", { state: { email: values.email } }),
        2000
      );
    } catch (error) {
      console.error(
        "OTP Request Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to send OTP.");
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
      <div className="w-full flex items-center justify-center p-6 bg-gradient-to-b from-white to-purple-100  h-screen">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">
            Reset Password
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(sendOtp)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="cursor-pointer h-[50px] w-full bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition"
              >
                Send Code
              </Button>
            </form>
          </Form>

          <p className="text-m text-gray-600 mt-4 text-center">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forget;