import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";
import { Eye, EyeOff } from "lucide-react"; 
const API_BASE = "https://findcourse.net.uz/api";

const formSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z.string().trim().email({ message: "Invalid email" }),
  phone: z.string().trim().min(12, { message: "Invalid phone" }),
  password: z.string().trim().min(6, { message: "Min 6 characters" }),
  role: z.enum(["USER", "CEO"]),
  image: z.any().optional(),
});

const FormTry = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "USER",
      image: null,
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      let imageFilename = "default.jpg";

      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const uploadResponse = await axios.post(
          `${API_BASE}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageFilename = uploadResponse.data?.data;
      }

      const { image, ...userData } = values;

      // Register user
      await axios.post(`${API_BASE}/users/register`, {
        ...userData,
        image: imageFilename,
      });

      // Send OTP
      await axios.post(`${API_BASE}/users/send-otp`, {
        email: userData.email,
      });

      // Store email in localStorage for OTP verification
      localStorage.setItem("otpEmail", userData.email);

      toast.success("Registration successful! Please verify your email with OTP.");
      navigate("/otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="h-full w-full bg-[#6d24b719]">
  {/* Header */}
  <div className="w-full px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 py-5 sm:py-6 md:py-7 
        flex items-center justify-center md:justify-start
        text-[#461773] text-2xl xs:text-3xl sm:text-[32px] font-bold cursor-pointer ">
    <Link to="/">
      <p className="flex">
        F<img src={icon} alt="Logo" className="h-7 w-4 mx-1 mt-1" />
        ndedu.uz
      </p>
    </Link>
  </div>

  {/* Main Content */}
  <div className="flex flex-col-reverse md:flex-row w-full min-h-[calc(100vh-80px)] justify-center gap-10">
    {/* Registration Form - Always visible */}
    <div className="w-full flex items-center justify-center p-4 md:w-1/2 lg:w-2/5 ">
      <div className="w-full md:w-[700px]   items-cente rounded-lg shadow-lg px-4 sm:p-6 bg-white h-[630px] justify-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#461773] mb-7 text-center mt-5">
          Create Account
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      {...form.register("phone")}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d]/g, "");
                        if (!value.startsWith("998")) {
                          value = "998" + value.replace(/^998/, "");
                        }
                        form.setValue("phone", `+${value}`);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value}
                    onValueChange={(value) => form.setValue("role", value)}
                  >
                    <SelectTrigger className="w-full">
                      {field.value || "Select Role"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Controller
                      name="image"
                      control={form.control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <input
                          type="file"
                          className="w-full h-10 p-2 border border-gray-300 rounded-md"
                          onChange={(e) => onChange(e.target.files[0])}
                          {...rest}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#461773] text-white p-3 rounded-md font-semibold hover:bg-purple-700 cursor-pointer disabled:opacity-70 transition-colors duration-200"
            >
              {isSubmitting ? "Processing..." : "Create Account"}
            </button>
          </form>
        </Form>

        <p className="text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>

    {/* Illustration - Hidden on mobile */}
    <div className="hidden md:flex md:w-1/2 lg:w-2/5 items-center justify-center p-8 ">
      <div className="text-[#461773] text-center max-w-lg">
        <h2 className="text-4xl lg:text-4xl font-bold mb-8 lg:mb-12">Welcome to the page!</h2>
        <div className="relative">
  {/* Animated main image */}
  <motion.div
    whileHover={{ y: -20 }}
    transition={{ type: "spring", stiffness: 50, damping: 20 }}
    className="relative z-10"
  >
    <img
      src={register}
      alt="Illustration"
      className="w-full max-w-[400px] h-auto "
    />
  </motion.div>

  {/* Static shadow image */}
  <img
    className="z-0 absolute bottom-[-32px]  left-5/5 transform -translate-x-1/2 w-[100%] ] h-[90px]"
    src={purple}
    alt="Shadow Effect"
  />
</div>
      </div>
    </div>
  </div>
  <Toaster position="top-right" richColors />
</div>
  );
};

export default FormTry;