import { Toaster as Sonner, toast } from "sonner";
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import purple from "/public/purple.png";
import icon from "/public/icon.png";
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

const API_BASE = "http://18.141.233.37:4000/api/users";

const formSchema = z.object({
  otp: z.string().min(4, { message: "OTP must be at least 4 digits" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
    },
  });

  const resetPassword = async (values) => {
    try {
      await axios.post(`${API_BASE}/reset-password`, {
        email: state.email,
        ...values,
      });
      toast.success("Password reset successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Invalid OTP or error resetting password."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#6d24b719]">
      <Sonner theme="light" position="top-right" richColors />

<Link to="/">
 <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold cursor-pointer">
<p className="flex"> F<img src={icon} alt="Logo" className="h-7 w-4 mx-1 mt-3" />ndedu.uz</p>
</div>
</Link>

 <div className="w-full flex items-center justify-center p-6 bg-gradient-to-b from-white to-purple-100  h-screen">
<div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
 <h2 className="text-4xl font-bold text-[#461773] mb-6 text-center"> Verify OTP
 </h2>

<Form {...form}>
<form
onSubmit={form.handleSubmit(resetPassword)}
className="space-y-4">
<FormField control={form.control} name="otp" render={({ field }) => (
<FormItem>
<FormControl>
<Input placeholder="Enter OTP" {...field} />
</FormControl>
 <FormMessage />
 </FormItem>)}/>

<FormField
control={form.control} name="newPassword" render={({ field }) => (<FormItem>
<FormControl>
<Input type="password"  placeholder="Enter new password" {...field}/>
</FormControl>
<FormMessage />
</FormItem>)}/>

 <Button  type="submit" className=" cursor-pointer h-[50px] w-full bg-[#461773] text-white font-semibold rounded-md hover:bg-purple-700 transition">Reset Password
</Button>
</form>
</Form>
</div>
      </div>
    </div>
  );
};

export default VerifyOtp;
