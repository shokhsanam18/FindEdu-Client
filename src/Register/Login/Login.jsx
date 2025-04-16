import { motion } from "framer-motion";
import { toast } from "sonner";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../../Store";
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
import { Eye, EyeOff } from "lucide-react";

const API_BASE = "https://findcourse.net.uz";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Min 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginUser = async (values) => {
    setIsLoading(true);
    const login = useAuthStore.getState().login;

    try {
      const result = await login(values);

      if (result.success) {
        const role = result.role ? result.role.toUpperCase() : "USER";
        
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          if (role === "USER") navigate("/");
          else if (role === "CEO") navigate("/ceo");
          else if (role === "ADMIN") navigate("/");
          else toast.error("Unknown role, please contact support.");
        }, 1500);
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#6d24b719]">
      
      <Link to="/">
        <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold cursor-pointer">
          <p className="flex">
            F<img src={icon} alt="Logo" className="h-7 w-4 mx-1 mt-3" />
            ndedu.uz
          </p>
        </div>
      </Link>

      <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-white to-purple-100 items-center justify-center p-8 relative">
        <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
          <Link to="/">
            <p className="flex">
              F<img src={icon} alt="Logo" className="h-7 w-4 mx-1 mt-3" />
              ndedu.uz
            </p>
          </Link>
        </div>
        <div className="text-[#461773] text-center relative ml-20 cursor-pointer">
          <h2 className="text-4xl font-bold mb-20">Welcome Back!</h2>
          <motion.img
            src={register}
            alt="Illustration"
            className="w-[500px] h-auto relative z-10"
            whileHover={{ y: -20 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
          <img
            className="z-0 absolute bottom-[-32px] left-1/15 transform w-[400px] h-[90px]"
            src={purple}
            alt="Shadow Effect"
          />
        </div>
      </div>

      <div className="w-full md:w-2/3 flex items-center justify-center p-6 md:p-16 bg-gradient-to-b from-white to-purple-100 h-screen">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">
            Login
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(loginUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-9 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className="h-5 w-5 text-green-500" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#461773] text-white font-bold rounded-md hover:bg-purple-700 transition h-[50px] cursor-pointer ${
                  isLoading ? "opacity-70" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <p className="text-m text-gray-600 mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
          <Link to="/forget">
            <h2 className="text-m text-center mt-6 underline cursor-pointer">
              Forgot Password?
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;