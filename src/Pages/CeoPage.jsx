import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const centerSchema = z.object({
  name: z.string().min(3, "Center name is required"),
  regionId: z.string().min(1, "Region is required"),
  address: z.string().min(5, "Address is required"),
  image: z.any(),
  majorsId: z.array(z.string()).nonempty("At least one major is required"),
  phone: z.string().min(10, "Phone number is required"),
});

export default function CeoPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(centerSchema),
  });

  const [regions, setRegions] = useState([]);
  const [majors, setMajors] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    axios
      .get("http://18.141.233.37:4000/api/regions/search?page=1&limit=500", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setRegions(res.data.data));
    axios
      .get("http://18.141.233.37:4000/api/major", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setMajors(res.data.data));
  }, []);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("regionId", data.regionId);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      data.majorsId.forEach((id) => formData.append("majorsId[]", id));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("http://18.141.233.37:4000/api/centers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      alert("Learning Center added successfully!");
    } catch (error) {
      console.error("Error adding Learning Center:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Create Learning Center
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700">
              Center Name
            </label>
            <Input placeholder="Enter center name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Region</label>
            <select
              {...register("regionId")}
              className="w-full p-2 border rounded bg-white focus:ring focus:ring-blue-300"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            {errors.regionId && (
              <p className="text-red-500 text-sm">{errors.regionId.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Address</label>
            <Input placeholder="Enter address" {...register("address")} />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700 border rounded-lg cursor-pointer"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              Phone Number
            </label>
            <Input placeholder="Enter phone number" {...register("phone")} />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Majors</label>
            <select
              multiple
              {...register("majorsId")}
              className="w-full p-2 border rounded bg-white focus:ring focus:ring-blue-300"
            >
              {majors.map((major) => (
                <option key={major.id} value={major.id}>
                  {major.name}
                </option>
              ))}
            </select>
            {errors.majorsId && (
              <p className="text-red-500 text-sm">{errors.majorsId.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg"
          >
            Add Center
          </Button>
        </form>
      </div>
    </div>
  );
}
