import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner"; // If you're using Sonner for notifications
import { ArrowLeftIcon } from "@heroicons/react/24/outline"; // Correct icon import
import { MapPinIcon } from "@heroicons/react/24/outline"; // Correct icon import
const API_BASE = "https://findcourse.net.uz/api";
const ImageApi = `${API_BASE}/api/image`;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch the existing center data
        const centerRes = await axios.get(`${API_BASE}/api/centers/${id}`);
        const centerData = centerRes.data?.data;

        setCenter({
          ...centerData,
          rating: avgRating,
          imageUrl: centerData.image ? `${ImageApi}/${centerData.image}` : null,
        });
        
        setNewData({
          name: centerData.name,
          address: centerData.address,
          phone: centerData.phone,
          email: centerData.email,
          website: centerData.website,
        });
      } catch (err) {
        setError("Failed to load center info");
        console.error(err);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newData.name);
    formData.append("address", newData.address);
    formData.append("phone", newData.phone);
    formData.append("email", newData.email);
    formData.append("website", newData.website);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put(`${API_BASE}/api/centers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Center updated successfully!");
      navigate(`/centers/${id}`);
    } catch (err) {
      toast.error("Failed to update center.");
      console.error("Error updating center", err);
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
    <div className="min-h-screen bg-gray-100 mt-42 md:mt-36">
      {/* Back button */}
      <div className="container mx-auto px-4 mt-8 text-xl">
        <Link
          to={`/centers/${id}`}
          className="inline-flex items-center text-[#441774] hover:text-purple-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Center Details
        </Link>
      </div>

      {/* Edit form */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex rounded-xl shadow-lg overflow-hidden flex-col md:flex-row w-full bg-white"
        >
          {/* Left column with image and branches */}
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

          {/* Right column with editable form fields */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex flex-col">
              {/* Center Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Center Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newData.name}
                  onChange={handleChange}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Center Address */}
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-600"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newData.address}
                  onChange={handleChange}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-600"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newData.phone}
                  onChange={handleChange}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newData.email}
                  onChange={handleChange}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Website */}
              <div className="mb-4">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-600"
                >
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={newData.website}
                  onChange={handleChange}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="mt-6 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>

              <button
                type="delete"
                onClick={handleDelete}
                className="mt-6 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CenterEditForm;
