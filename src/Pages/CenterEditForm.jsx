// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { ArrowLeftIcon, MapPinIcon } from "@heroicons/react/24/outline";

// const API_BASE = "https://findcourse.net.uz/api";
// const ImageApi = `${API_BASE}/image`;

// const CenterEditForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [center, setCenter] = useState(null);
//   const [newData, setNewData] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     email: "",
//     website: "",
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE}/centers/${id}`);
//         const centerData = res.data?.data;

//         const comments = centerData.comments || [];
//         const avgRating =
//           comments.length > 0
//             ? comments.reduce((sum, c) => sum + c.star, 0) / comments.length
//             : 0;

//         setCenter({
//           ...centerData,
//           rating: avgRating,
//           imageUrl: centerData.image ? `${ImageApi}/${centerData.image}` : null,
//         });

//         setNewData({
//           name: centerData.name || "",
//           address: centerData.address || "",
//           phone: centerData.phone || "",
//         });
//       } catch (err) {
//         setError("Failed to load center info");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let uploadedImageFilename = null;
  
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       if (!accessToken) {
//         toast.error("You must be logged in to update a center.");
//         return;
//       }
  
//       // console.log("Access token:", accessToken);
  
//       // 1. Upload image if selected
//       if (imageFile) {
//         const formData = new FormData();
//         formData.append("image", imageFile);
  
//         // console.log("Uploading image:", imageFile.name);
  
//         const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
  
//         uploadedImageFilename = uploadRes.data?.data;
//         // console.log("Uploaded image filename:", uploadedImageFilename);
//       }
  
//       // 2. Build payload with only allowed fields
//       const allowedFields = {};
// if (newData.name !== center.name) {
//   allowedFields.name = newData.name;
// }
//   if (newData.address !== center.address) {
//           allowedFields.address = newData.address;
//         }
//       if (newData.phone !== center.phone) {
//         allowedFields.phone = newData.phone;
//       }
//       if (uploadedImageFilename) {
//         allowedFields.image = uploadedImageFilename;
//       }
      
  
//       // console.log("Final payload being sent:", allowedFields);
  
//       // 3. Send PATCH request
//       const res = await axios.patch(`${API_BASE}/centers/${id}`, allowedFields, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
  
//       // console.log("Update response:", res.data);
//       toast.success("Center updated successfully!");
//       navigate(`/centers/${id}`);
//     } catch (err) {
//       console.error("Error updating center:", err);
//       if (err.response) {
//         console.error("Response data:", err.response.data);
//         console.error("Status code:", err.response.status);
//       }
//       toast.error("Failed to update center.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 mt-20">
//       <div className="container mx-auto px-4 mt-8 text-xl">
//         <Link
//           to={`/centers/${id}`}
//           className="inline-flex items-center text-[#441774] hover:text-purple-800"
//         >
//           <ArrowLeftIcon className="h-5 w-5 mr-2" />
//           Back to Center Details
//         </Link>
//       </div>

//       <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex rounded-xl shadow-lg overflow-hidden flex-col md:flex-row w-full bg-white"
//         >
//           <div className="md:w-2/5 flex flex-col">
//             <div className="relative h-100 w-100 overflow-hidden">
//               {center.imageUrl ? (
//                 <img
//                   src={center.imageUrl}
//                   alt={center.name}
//                   className="w-full h-full object-cover overflow-hidden"
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                     e.target.parentElement.classList.add("bg-gray-200");
//                   }}
//                 />
//               ) : (
//                 <div className="h-full bg-gray-200 flex items-center justify-center">
//                   <MapPinIcon className="h-16 w-16 text-gray-400" />
//                 </div>
//               )}
//               <div className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md">
//                 <input
//                   type="file"
//                   onChange={handleImageChange}
//                   className="cursor-pointer"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="md:w-2/3 p-6 md:p-8">
//             <div className="flex flex-col space-y-4">
//               {["name", "address", "phone"].map((field) => (
//                 <div key={field}>
//                   <label
//                     htmlFor={field}
//                     className="block text-sm font-medium text-gray-600"
//                   >
//                     {field.charAt(0).toUpperCase() + field.slice(1)}
//                   </label>
//                   <input
//                     type="text"
//                     id={field}
//                     name={field}
//                     value={newData[field]}
//                     onChange={handleChange}
//                     className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//               ))}

//               <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 className="mt-6 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default CenterEditForm;









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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (centerData.image) {
          setPreviewUrl(`${ImageApi}/${centerData.image}`);
        }
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
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let uploadedImageFilename = null;
  
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You must be logged in to update a center.");
        setIsSubmitting(false);
        return;
      }

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        uploadedImageFilename = uploadRes.data?.data;
      }

      // Build payload with only changed fields
      const payload = {};
      if (newData.name !== center.name) payload.name = newData.name;
      if (newData.address !== center.address) payload.address = newData.address;
      if (newData.phone !== center.phone) payload.phone = newData.phone;
      if (uploadedImageFilename) payload.image = uploadedImageFilename;

      // Only send request if there are changes
      if (Object.keys(payload).length > 0) {
       
        await axios.patch(`${API_BASE}/centers/${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success("Center updated successfully!");
      } else {
        toast.info("No changes detected.");
      }

      navigate(`/centers/${id}`);
    } catch (err) {
      console.error("Error updating center:", err);
      let errorMessage = "Failed to update center.";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to={`/centers/${id}`}
            className="inline-flex items-center text-[#441774] hover:text-purple-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Center Details
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section - Wider on larger screens */}
            <div className="lg:w-2/5 xl:w-1/2 relative">
              <div className="h-64 lg:h-full w-full">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={center.name}
                    className="w-full h-full object-cover"
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
              </div>
              
              <div className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:w-3/5 xl:w-1/2 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Center Information</h2>
              
              <form className="space-y-4">
                {["name", "address", "phone"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "phone" ? "tel" : "text"}
                      id={field}
                      name={field}
                      value={newData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                      isSubmitting
                        ? "bg-[#441774] cursor-not-allowed"
                        : "bg-[#441774] hover:bg-purple-800"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CenterEditForm;