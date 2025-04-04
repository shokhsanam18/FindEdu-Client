import { motion } from "framer-motion";
// import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
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
const API_BASE = " https://findcourse.net.uz/api/users";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Required" }),
  lastName: z.string().min(2, { message: "Required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(12, { message: "Invalid phone" }),
  password: z.string().min(6, { message: "Min 6 characters" }),
  role: z.enum(["USER", "CEO"]),
  image: z.any().optional(),
});

const FormTry = () => {
  const navigate = useNavigate();
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
    try {
      let imageFilename = "default.jpg";

      // Step 1: Upload image if present
      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const uploadResponse = await axios.post(
          "https://findcourse.net.uz/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageFilename = uploadResponse.data?.data; // just the filename string
      }

      const { image, otp, ...userData } = values;

      // Step 2: Register user
      await axios.post(`${API_BASE}/register`, {
        ...userData,
        image: imageFilename,
      });

      // Step 3: Send OTP to user's email
      await axios.post(`${API_BASE}/send-otp`, {
        email: userData.email,
      });

      // Show success message
      toast.success(
        "User registered successfully! Please check your email for OTP.",
        {
          style: { backgroundColor: "#4CAF50", color: "white" },
        }
      );

      // Optional: navigate to OTP verification page (or stay)
      // navigate("/login");
    } catch (error) {
      console.error("❌ Registration Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
        {
          style: { backgroundColor: "#D32F2F", color: "white" },
        }
      );
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post(`${API_BASE}/send-otp`, {
        email: form.getValues("email"),
      });
      toast.info("OTP sent to email.", {
        style: { backgroundColor: "#1976D2", color: "white" },
      });
    } catch (error) {
      toast.error("Failed to send OTP.", {
        style: { backgroundColor: "#D32F2F", color: "white" },
      });
    }
  };
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  // Reference to input fields
  const inputRefs = useRef([]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Only allow numbers

    // Update OTP state with the new value
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if the current input is filled
    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  // const verifyOtp = async () => {
  //   const otpString = otp.join(""); // Join the OTP array into a single string
  //   try {
  //     await axios.post(`${API_BASE}/verify-otp`, {
  //       email: form.getValues("email"),
  //       otp: otpString,
  //     });
  //     toast.success("OTP Verified Successfully!", {
  //       style: { backgroundColor: "#4CAF50", color: "white" },
  //     });
  //     navigate("/login");
  //   } catch (error) {
  //     toast.error("Invalid OTP.", {
  //       style: { backgroundColor: "#D32F2F", color: "white" },
  //     });
  //   }
  // };
  const verifyOtp = async () => {
    const otpString = otp.join(""); // Join the OTP array into a single string
    try {
      await axios.post(`${API_BASE}/verify-otp`, {
        email: form.getValues("email"),
        otp: otpString,
      });
      // Show success toast
      toast.success("OTP Verified Successfully!", {
        style: { backgroundColor: "#4CAF50", color: "white" },
      });

      // Delay navigation to allow the toast to be visible
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Adjust the delay (in milliseconds) as needed (2 seconds here)
    } catch (error) {
      toast.error("Invalid OTP.", {
        style: { backgroundColor: "#D32F2F", color: "white" },
      });
    }
  };

  // bg-indigo-200
  return (
    <div className="h-full  bg-[#6d24b719]">
      <div className=" mx-10 py-7 md:mx-20 md:mb-[-30px] flex items-center text-[#461773] text-[32px] font-bold cursor-pointer">
        <Link to="/">
          <p className="flex">
            F<img src={icon} alt="Logo" className="h-7  w-4 mx-1 mt-3 " />
            ndedu.uz
          </p>
        </Link>
      </div>
      <div className="flex flex-row gap-20">
        <div className="flex flex-col md:flex-row w-full h-screen">
          <Sonner theme="light" position="top-right" richColors />

          <div className="hidden md:flex  h-[100%]  items-center justify-center">
            <div className=" text-[#461773] text-center relative ml-20 cursor-pointer  ">
              <h2 className="text-4xl font-bold mb-20">Welcome to the page!</h2>

              <motion.img
                src={register}
                alt="Illustration"
                className="w-[500px] h-auto relative z-10 1 "
                whileHover={{ y: -20 }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
              {/* -translate-x-1/2 */}
              <img
                className="z-0 absolute bottom-[-32px] left-1/15  transform  w-[400px] h-[90px]"
                src={purple}
                alt="Shadow Effect"
              />
            </div>
          </div>
        </div>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 w-full px-4">
          <div
            className="w-full max-w-[90%] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[650px] xl:max-w-[640px] 
h-auto min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] xl:min-h-[85vh] 
flex flex-col justify-center bg-white rounded-lg shadow-lg p-6 sm:p-10 md:p-9 mr-4 lg:mr-24 "
          >
            <h2 className="text-4xl font-bold text-[#461773] mb-5 text-center ">
              Create Account
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
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
                      <FormItem className="w-1/2">
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
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
                      {" "}
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
                          {...form.register("phone")}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d]/g, ""); // Remove non-numeric characters
                            if (!value.startsWith("998")) {
                              value = "998" + value.replace(/^998/, "");
                            }
                            form.setValue("phone", `+${value}`); // Ensures "+998" always stays
                          }}
                        />
                      </FormControl>
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            form.setValue("role", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            {field.value || "Select Role"}
                          </SelectTrigger>{" "}
                          <SelectContent>
                            <SelectItem value="CEO">CEO</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormControl>
                        <Controller
                          name="image"
                          control={form.control}
                          defaultValue={null}
                          render={({ field }) => (
                            <input
                              type="file"
                              className=" h-10 p-2 border-gray-100 border-2 rounded"
                              onChange={(e) =>
                                field.onChange(e.target.files[0])
                              }
                            />
                          )}
                        />{" "}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="w-full bg-[#461773] text-white p-3 rounded-md font-semibold hover:bg-purple-700 cursor-pointer"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full bg-gray-300 text-black p-3 rounded-md font-semibold hover:bg-gray-200 cursor-pointer"
                >
                  Send OTP
                </button>

                {/* Your other JSX code */}

                {/* OTP Section */}
                <div className="flex gap-4">
                  {otp.map((digit, index) => (
                    <FormItem key={index} className="w-15 ">
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          placeholder={""}
                          className="text-center px-4 py-6  border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ))}

                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="w-full md:w-1/2 bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 cursor-pointer"
                  >
                    Verify OTP
                  </button>
                </div>
              </form>
            </Form>

            <p className="text-gray-600 mt-4 text-center">
              Already have an account?
              <Link
                to="/login"
                className="text-purple-600 font-semibold hover:underline"
              >
                {" "}
                Login
              </Link>
            </p>
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default FormTry;
