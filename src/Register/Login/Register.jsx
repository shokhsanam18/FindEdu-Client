import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui/select";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
import register from "/public/register.png";
const API_BASE = "http://18.141.233.37:4000/api/users";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Required" }),
  lastName: z.string().min(2, { message: "Required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(12, { message: "Invalid phone" }),
  password: z.string().min(6, { message: "Min 6 characters" }),
  role: z.enum(["USER", "CEO", "Admin", "Super Admin"]),
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
      const { otp, ...userData } = values;
      await axios.post(`${API_BASE}/register`, { ...userData, image: "image.jpg" });
      alert("User registered successfully! Please check your email for OTP.");
      navigate("");
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post(`${API_BASE}/send-otp`, { email: form.getValues("email") });
      alert("OTP sent to email.");
    } catch (error) {
      console.error("OTP Send Error:", error.response?.data || error.message);
      alert("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${API_BASE}/verify-otp`, { email: form.getValues("email"), otp: form.getValues("otp") });
      alert("OTP Verified Successfully!");
      navigate("/login");
    } catch (error) {
      console.error("OTP Verification Error:", error.response?.data || error.message);
      alert("Invalid OTP.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-white from-white to-purple-400 w-full">
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-white to-purple-100 items-center justify-center p-2 relative  ">
   <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
     F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />ndedu.uz  </div>
        <div className="text-[#461773] text-center relative ml-20">
 <h2 className="text-4xl font-bold mb-10">Welcome to the page!</h2>
          <img src={register} alt="Illustration" className="w-[500px] h-auto relative z-10" />
          <img className="z-0 absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 w-[400px] h-[90px]" src={purple} alt="Shadow Effect" />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center p-6 md:p-16 md:flex bg-gradient-to-b from-white to-purple-100">
        
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md ml-6">
          <h2 className="text-4xl font-bold text-[#461773] mb-5 text-center">Create Account</h2> 
  
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
<div className="flex gap-4">
<FormField control={form.control} name="firstName" render={({ field }) => (
<FormItem className="w-1/2">
<FormControl><Input placeholder="First Name" {...field} /></FormControl>
<FormMessage /></FormItem>)} />
                
<FormField control={form.control} name="lastName" render={({ field }) => (
<FormItem className="w-1/2">
<FormControl><Input placeholder="Last Name" {...field} /></FormControl>
<FormMessage /> </FormItem>)} />
 </div>
  
 <FormField control={form.control} name="email" render={({ field }) => (
 <FormItem> <FormControl><Input placeholder="Email" {...field} /></FormControl>
 <FormMessage /> </FormItem>)} />
              
<FormField control={form.control} name="password" render={({ field }) => (
<FormItem> <FormControl><Input type="password" placeholder="Password" {...field} /></FormControl>
 <FormMessage /></FormItem>)} />
              
<FormField control={form.control} name="phone" render={({ field }) => (
<FormItem> <FormControl><Input placeholder="Phone Number" {...field} /></FormControl>
 <FormMessage /> </FormItem>)} />
  
 <FormField control={form.control} name="role" render={({ field }) => (
 <FormItem> <FormControl>
<Select value={field.value} onValueChange={(value) => form.setValue("role", value)}>
<SelectTrigger className="w-full">{field.value || "Select Role"}
</SelectTrigger> <SelectContent>
<SelectItem value="CEO">CEO</SelectItem>
 <SelectItem value="USER">User</SelectItem>
<SelectItem value="Admin">Admin</SelectItem>
<SelectItem value="Super">Super Admin</SelectItem>
 </SelectContent></Select>
 </FormControl>
 <FormMessage />
</FormItem>
              )} />
  <FormField control={form.control} name="image" render={({ field: { onChange, ...rest } }) => (
  <FormItem>
    <FormControl>
  <input  type="file" accept="image/*" className="border p-2 rounded-md w-full cursor-pointer" onChange={(e) => onChange(e.target.files[0])} {...rest} />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />
 <button type="submit" className="w-full bg-[#461773] text-white p-3 rounded-md font-semibold hover:bg-purple-900 cursor-pointer">Create Account</button>
<button type="button" onClick={sendOtp} className="w-full bg-gray-300 text-black p-3 rounded-md font-semibold hover:bg-gray-200 cursor-pointer">Send OTP</button>
  
<FormField control={form.control} name="otp" render={({ field }) => (
<FormItem>
<FormControl><Input placeholder="Enter OTP" {...field} /></FormControl>
<FormMessage /> </FormItem> )} />
  
<button type="button" onClick={verifyOtp} className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 cursor-pointer">Verify OTP</button>
</form>
</Form>
  
<p className="text-gray-600 mt-4 text-center">Already have an account? 
 <Link to="/login" className="text-purple-600 font-semibold hover:underline"> Login</Link>
 </p>
   </div>
      </div>
    </div>
  );
};

export default FormTry;
