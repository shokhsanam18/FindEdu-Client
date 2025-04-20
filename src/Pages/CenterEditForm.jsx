import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeftIcon, MapPinIcon } from "@heroicons/react/24/outline";

const API_BASE = "https://findcourse.net.uz/api";
const ImageApi = `${API_BASE}/image`;

const CenterEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [center, setCenter] = useState(null);
  const [newData, setNewData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/centers/${id}`);
        const centerData = res.data?.data;

        const comments = centerData.comments || [];
        const avgRating =
          comments.length > 0
            ? comments.reduce((sum, c) => sum + c.star, 0) / comments.length
            : 0;

        setCenter({
          ...centerData,
          rating: avgRating,
          imageUrl: centerData.image ? `${ImageApi}/${centerData.image}` : null,
        });

        setNewData({
          name: centerData.name || "",
          address: centerData.address || "",
          phone: centerData.phone || "",
        });
      } catch (err) {
        setError("Failed to load center info");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedImageFilename = null;
  
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You must be logged in to update a center.");
        return;
      }
  
      // console.log("Access token:", accessToken);
  
      // 1. Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
  
        // console.log("Uploading image:", imageFile.name);
  
        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        uploadedImageFilename = uploadRes.data?.data;
        // console.log("Uploaded image filename:", uploadedImageFilename);
      }
  
      // 2. Build payload with only allowed fields
      const allowedFields = {};
if (newData.name !== center.name) {
  allowedFields.name = newData.name;
}
  if (newData.address !== center.address) {
          allowedFields.address = newData.address;
        }
      if (newData.phone !== center.phone) {
        allowedFields.phone = newData.phone;
      }
      if (uploadedImageFilename) {
        allowedFields.image = uploadedImageFilename;
      }
      
  
      // console.log("Final payload being sent:", allowedFields);
  
      // 3. Send PATCH request
      const res = await axios.patch(`${API_BASE}/centers/${id}`, allowedFields, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // console.log("Update response:", res.data);
      toast.success("Center updated successfully!");
      navigate(`/centers/${id}`);
    } catch (err) {
      console.error("Error updating center:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Status code:", err.response.status);
      }
      toast.error("Failed to update center.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 mt-8 text-xl">
        <Link
          to={`/centers/${id}`}
          className="inline-flex items-center text-[#441774] hover:text-purple-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Center Details
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex rounded-xl shadow-lg overflow-hidden flex-col md:flex-row w-full bg-white"
        >
          <div className="md:w-2/5 flex flex-col">
            <div className="relative h-100 w-100 overflow-hidden">
              {center.imageUrl ? (
                <img
                  src={center.imageUrl}
                  alt={center.name}
                  className="w-full h-full object-cover overflow-hidden"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.classList.add("bg-gray-200");
                  }}
                />
              ) : (
                <div className="h-full bg-gray-200 flex items-center justify-center">
                  <MapPinIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex flex-col space-y-4">
              {["name", "address", "phone"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-600"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={newData[field]}
                    onChange={handleChange}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}

              <button
                type="submit"
                onClick={handleSubmit}
                className="mt-6 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CenterEditForm;