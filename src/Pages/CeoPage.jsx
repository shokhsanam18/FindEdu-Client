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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(centerSchema),
  });

  const [regions, setRegions] = useState([]);
  const [majors, setMajors] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get("http://18.141.233.37:4000/api/regions/search?page=1&limit=500", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRegions(res.data.data));

    axios
      .get("http://18.141.233.37:4000/api/major", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMajors(res.data.data));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Please select a valid image file!");
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "http://18.141.233.37:4000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "default.jpg";

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const formData = {
        name: data.name,
        regionId: data.regionId,
        address: data.address,
        phone: data.phone,
        majorsId: data.majorsId,
        image: imageUrl,
      };

      const token = localStorage.getItem("accessToken");

      await axios.post("http://18.141.233.37:4000/api/centers", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Learning Center added successfully!");
    } catch (error) {
      console.error("Error adding Learning Center:", error);
      alert("Failed to add Learning Center");
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
            <input
              placeholder="Enter center name"
              {...register("name")}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Region</label>
            <select
              {...register("regionId")}
              className="w-full p-2 border rounded bg-white"
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
            <input
              placeholder="Enter address"
              {...register("address")}
              className="w-full p-2 border rounded"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex justify-center p-1 w-full text-sm text-gray-700 border rounded-sm h-8  cursor-pointer"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              placeholder="Enter phone number"
              {...register("phone")}
              className="w-full p-2 border rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Majors</label>
            <select
              multiple
              {...register("majorsId")}
              className="w-full p-2 border rounded bg-white"
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
          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg"
          >
            Add Center
          </button>
        </form>
      </div>
    </div>
  );
}
