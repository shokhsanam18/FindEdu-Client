import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeftIcon, MapPinIcon, TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";

const API_BASE = "https://findcourse.net.uz/api";
const ImageApi = `${API_BASE}/image`;

const CenterEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Center state
  const [center, setCenter] = useState(null);
  const [newCenterData, setNewCenterData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualBranchName, setIsManualBranchName] = useState(false);

  // Branches state
  const [branches, setBranches] = useState([]);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [branchFormData, setBranchFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: null
  });
  const [branchPreviewUrl, setBranchPreviewUrl] = useState(null);
  const [branchImageFile, setBranchImageFile] = useState(null);

  // Fetch center and branches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        // Fetch center data
        const centerRes = await axios.get(`${API_BASE}/centers/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const centerData = centerRes.data?.data;

        const comments = centerData.comments || [];
        const avgRating = comments.length > 0
          ? comments.reduce((sum, c) => sum + c.star, 0) / comments.length
          : 0;

        setCenter({
          ...centerData,
          rating: avgRating,
          imageUrl: centerData.image ? `${ImageApi}/${centerData.image}` : null,
        });

        setNewCenterData({
          name: centerData.name || "",
          address: centerData.address || "",
          phone: centerData.phone || "",
        });

        if (centerData.image) {
          setPreviewUrl(`${ImageApi}/${centerData.image}`);
        }

        // Fetch branches for this center
        const branchesRes = await axios.get(`${API_BASE}/filials`, {
          params: { centerId: id },
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setBranches(branchesRes.data?.data || []);

      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  useEffect(() => {
  if (showBranchForm && !isManualBranchName && branchFormData.regionId && center?.name) {
    const regionName = regions.find(r => r.id === Number(branchFormData.regionId))?.name || "";
    setBranchFormData((prev) => ({
      ...prev,
      name: regionName ? `${center.name} - ${regionName}` : center.name,
    }));
  }
}, [branchFormData.regionId, center?.name, isManualBranchName, showBranchForm]);

  // Center image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Center form handlers
  const handleCenterChange = (e) => {
    const { name, value } = e.target;
    setNewCenterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCenterSubmit = async (e) => {
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
      if (newCenterData.name !== center.name) payload.name = newCenterData.name;
      if (newCenterData.address !== center.address) payload.address = newCenterData.address;
      if (newCenterData.phone !== center.phone) payload.phone = newCenterData.phone;
      if (uploadedImageFilename) payload.image = uploadedImageFilename;

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

  // Branch image handler
  const handleBranchImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setBranchImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBranchPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Branch form handlers
  const handleBranchChange = (e) => {
    const { name, value } = e.target;

    setBranchFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "regionId" && !isManualBranchName) {
        const regionName = regions.find(r => r.id === Number(value))?.name || "";
        updated.name = regionName ? `${center.name} - ${regionName} branch` : `${center.name} branch`;
      }

      return updated;
    });
  };

  const handleNewBranchClick = () => {
    const defaultRegionId = regions.length > 0 ? regions[0].id : "";
    const defaultRegionName = regions.find(r => r.id === defaultRegionId)?.name || "";
  
    const autoName = !isManualBranchName && center?.name
  ? defaultRegionName
    ? `${center.name} - ${defaultRegionName} branch`
    : `${center.name} branch`
  : "";
  
    setShowBranchForm(true);
    setEditingBranchId(null);
    setBranchFormData({
      name: autoName,
      phone: "",
      address: "",
      image: null,
    });
    setBranchPreviewUrl(null);
    setBranchImageFile(null);
  };

  const handleEditBranchClick = (branch) => {
    setShowBranchForm(true);
    setEditingBranchId(branch.id);
    setBranchFormData({
      name: branch.name || "",
      phone: branch.phone || "",
      address: branch.address || "",
      image: branch.image || null
    });
    setBranchPreviewUrl(branch.image ? `${ImageApi}/${branch.image}` : null);
    setBranchImageFile(null);
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let uploadedImageFilename = null;

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You must be logged in to manage branches.");
        setIsSubmitting(false);
        return;
      }

      // Upload image if selected
      if (branchImageFile) {
        const formData = new FormData();
        formData.append("image", branchImageFile);

        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        uploadedImageFilename = uploadRes.data?.data;
      }

      // Prepare branch data
      const branchData = {
        name: branchFormData.name,
        phone: branchFormData.phone,
        address: branchFormData.address
      };

      if (uploadedImageFilename) {
        branchData.image = uploadedImageFilename;
      }

      if (editingBranchId) {
        // Update existing branch
        await axios.patch(`${API_BASE}/filials/${editingBranchId}`, branchData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success("Branch updated successfully!");
      } else {
        // Create new branch - include centerId
        await axios.post(`${API_BASE}/filials`, {
          ...branchData,
          centerId: id
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success("Branch created successfully!");
      }

      // Refresh branches list
      const branchesRes = await axios.get(`${API_BASE}/filials`, {
        params: { centerId: id },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setBranches(branchesRes.data?.data || []);

      // Reset form
      setShowBranchForm(false);
      setEditingBranchId(null);

    } catch (err) {
      console.error("Error managing branch:", err);
      let errorMessage = editingBranchId
        ? "Failed to update branch."
        : "Failed to create branch.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 404) {
          errorMessage = "Learning center not found.";
        } else if (err.response.status === 422) {
          errorMessage = "Validation error. Please check your inputs.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) {
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You must be logged in to delete a branch.");
        return;
      }

      await axios.delete(`${API_BASE}/filials/${branchId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("Branch deleted successfully!");

      // Refresh branches list
      const branchesRes = await axios.get(`${API_BASE}/filials`, {
        params: { centerId: id },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setBranches(branchesRes.data?.data || []);

    } catch (err) {
      console.error("Error deleting branch:", err);
      let errorMessage = "Failed to delete branch.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      toast.error(errorMessage);
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
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 mt-8">
          <Link
            to={`/centers/${id}`}
            className="inline-flex items-center text-[#441774] hover:text-purple-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Center Details
          </Link>
        </div>

        {/* Center Edit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
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
                      value={newCenterData[field]}
                      onChange={handleCenterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    type="submit"
                    onClick={handleCenterSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${isSubmitting
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

        {/* Branches Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Branches</h2>
              <button
                onClick={handleNewBranchClick}
                className="flex items-center px-4 py-2 bg-[#441774] text-white rounded-lg hover:bg-purple-800 transition"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Branch
              </button>
            </div>

            {/* Branch Form (Conditional) */}
            {showBranchForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 p-6 bg-gray-50 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  {editingBranchId ? "Edit Branch" : "Add New Branch"}
                </h3>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                      <input
                        type="text"
                        name="name"
                        value={branchFormData.name}
                        onChange={handleBranchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        readOnly={!isManualBranchName}
                      />
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="manualBranchEdit"
                          checked={isManualBranchName}
                          onChange={() => setIsManualBranchName(prev => !prev)}
                        />
                        <label htmlFor="manualBranchEdit" className="text-sm text-gray-600">
                          Let me enter branch name manually
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={branchFormData.phone}
                        onChange={handleBranchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={branchFormData.address}
                        onChange={handleBranchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Image</label>
                    <div className="flex items-center space-x-4">
                      {branchPreviewUrl && (
                        <div className="w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={branchPreviewUrl}
                            alt="Branch preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          onChange={handleBranchImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <span className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                          {branchPreviewUrl ? "Change Image" : "Upload Image"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBranchForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleBranchSubmit}
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition ${isSubmitting
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
                        editingBranchId ? "Update Branch" : "Create Branch"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Branches List */}
            {branches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No branches found for this center.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {branches.map((branch) => (
                  <div key={branch.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition min-w-[250px] flex-1 max-w-[400px]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{branch.name}</h3>
                        <p className="text-gray-600">{branch.address}</p>
                        <p className="text-gray-600">{branch.phone}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBranchClick(branch)}
                          className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full transition"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(branch.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {branch.image && (
                      <div className="mt-3 w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={`${ImageApi}/${branch.image}`}
                          alt={branch.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.classList.add("bg-gray-200");
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CenterEditForm;