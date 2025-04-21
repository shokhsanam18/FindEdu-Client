import React, { useState, useEffect, useContext } from "react";
import {
  FaSearch,
  FaBook,
  FaVideo,
  FaFilePdf,
  FaStar,
  FaDownload,
  FaTrash,
  FaExclamationTriangle,
  FaLink,
  FaUpload,
} from "react-icons/fa";
import { MdComputer, MdBusiness } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store";
import { AuthContext } from "../context/auth";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_BASE_URL = "https://findcourse.net.uz/api/resources";
const CATEGORIES_URL = "https://findcourse.net.uz/api/categories";

export const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    categoryId: "",
    name: "",
    description: "",
    media: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0,
  });
  const [errors, setErrors] = useState({
    media: "",
    image: "",
    name: "",
    categoryId: "",
  });
  const [imageInputMode, setImageInputMode] = useState("upload");
  const navigate = useNavigate();

  const { userData } = useContext(AuthContext);
  const user = useAuthStore((state) => state.user);
  const currentUser = userData || user;
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const fetchResources = async (page = 1) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { itemsPerPage } = pagination;

      let url = `${API_BASE_URL}?page=${page}&limit=${itemsPerPage}`;

      if (activeFilter === "myResources") {
        url += `&userId=${currentUser?.id}`;
      } else if (activeFilter !== "all") {
        url += `&categoryId=${activeFilter}`;
      }

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResources(response.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalItems: response.data?.total || 0,
      }));
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(CATEGORIES_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const categoriesData = response.data.data.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.image,
      }));

      setCategories(categoriesData);

      if (categoriesData.length > 0 && !newResource.categoryId) {
        setNewResource((prev) => ({
          ...prev,
          categoryId: categoriesData[0].id.toString(),
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handlePageChange = (page) => {
    fetchResources(page);
  };

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, [activeFilter, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageInput = (e) => {
    if (imageInputMode === "upload") {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setNewResource({ ...newResource, image: file });
      }
    } else {
      const { value } = e.target;
      setNewResource({ ...newResource, image: value });
    }
  };

  const handleAddResourceClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login first to add resources!");
      return;
    }
    setIsModalOpen(true);
  };

  const isUserResource = (resource) => {
    return currentUser && resource.userId === currentUser?.id;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {
      media: "",
      image: "",
      name: "",
      categoryId: "",
    };
    let isValid = true;

    if (!newResource.categoryId) {
      newErrors.categoryId = "Please select a category";
      isValid = false;
    }

    if (!newResource.name.trim()) {
      newErrors.name = "Please enter a resource name";
      isValid = false;
    } else if (newResource.name.length > 100) {
      newErrors.name = "Name must be 100 characters or less";
      isValid = false;
    }

    if (!newResource.media) {
      newErrors.media = "Please enter a media URL";
      isValid = false;
    } else if (!isValidUrl(newResource.media)) {
      newErrors.media = "Please enter a valid URL";
      isValid = false;
    } else if (newResource.media.length > 200) {
      newErrors.media = "Media URL must be 200 characters or less";
      isValid = false;
    }

    if (imageInputMode === "url" && newResource.image) {
      if (!isValidUrl(newResource.image)) {
        newErrors.image = "Please enter a valid image URL";
        isValid = false;
      } else if (newResource.image.length > 200) {
        newErrors.image = "Image URL must be 200 characters or less";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login first!");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();

      // Append all fields
      formData.append("categoryId", newResource.categoryId);
      formData.append("name", newResource.name);
      formData.append("description", newResource.description || "");
      formData.append("media", newResource.media);

      // Handle image based on input mode
      if (imageInputMode === "upload" && newResource.image instanceof File) {
        formData.append("image", newResource.image);
      } else if (imageInputMode === "url" && newResource.image) {
        formData.append("image", newResource.image);
      }

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Resource added successfully!");
      setIsModalOpen(false);
      setNewResource({
        categoryId: categories.length > 0 ? categories[0].id.toString() : "",
        name: "",
        description: "",
        media: "",
        image: null,
      });
      setImagePreview("");
      setErrors({
        media: "",
        image: "",
        name: "",
        categoryId: "",
      });
      fetchResources();
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });

      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        let errorMessages = [];

        Object.keys(serverErrors).forEach((key) => {
          errorMessages.push(`${key}: ${serverErrors[key].join(", ")}`);
        });

        toast.error(`Validation errors: ${errorMessages.join("; ")}`);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to add resource. Please check your inputs."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResources(resources.filter((r) => r.id !== resourceId));
      toast.success("Resource deleted successfully");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error(error.response?.data?.message || "Failed to delete resource");
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = searchTerm
      ? resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "myResources"
        ? isUserResource(resource)
        : resource.categoryId?.toString() === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "ebook":
        return <FaBook className="text-blue-500" />;
      case "video":
        return <FaVideo className="text-red-500" />;
      case "pdf":
        return <FaFilePdf className="text-red-600" />;
      default:
        return <FaBook className="text-gray-500" />;
    }
  };

  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span
            key="start-ellipsis"
            className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 border border-gray-300 text-sm font-medium ${
            pagination.currentPage === i
              ? "bg-blue-100 text-blue-800"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span
            key="end-ellipsis"
            className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-21">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Educational Resources
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            High-quality materials for learning center administrators and
            educators
          </p>
        </div>

        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                All Resources
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => setActiveFilter("myResources")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === "myResources"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  My Resources
                </button>
              )}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id.toString())}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    activeFilter === category.id.toString()
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {category.name === "IT" ? (
                    <MdComputer className="mr-2" />
                  ) : (
                    <MdBusiness className="mr-2" />
                  )}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddResourceClick}
          className="px-4 py-2 bg-[#451774] text-white text-sm rounded-lg hover:bg-[#3a115a] transition duration-300 mx-auto block mb-8"
        >
          Add Resource
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-400 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Add New Resource</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={newResource.categoryId}
                    onChange={handleInputChange}
                    className={`block w-full p-2 border ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    } rounded`}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <div className="flex items-center mt-1">
                      <FaExclamationTriangle className="text-red-500 mr-1" />
                      <span className="text-sm text-red-500">
                        {errors.categoryId}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Resource Name"
                    value={newResource.name}
                    onChange={handleInputChange}
                    className={`block w-full p-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                    required
                  />
                  {errors.name && (
                    <div className="flex items-center mt-1">
                      <FaExclamationTriangle className="text-red-500 mr-1" />
                      <span className="text-sm text-red-500">
                        {errors.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={newResource.description}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Media URL *
                  </label>
                  <input
                    type="url"
                    name="media"
                    placeholder="Media URL (max 200 characters)"
                    value={newResource.media}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        handleInputChange(e);
                      }
                    }}
                    className={`block w-full p-2 border ${
                      errors.media ? "border-red-500" : "border-gray-300"
                    } rounded`}
                    required
                  />
                  <div className="flex items-center mt-1">
                    {errors.media && (
                      <>
                        <FaExclamationTriangle className="text-red-500 mr-1" />
                        <span className="text-sm text-red-500">
                          {errors.media}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                      {newResource.media.length}/200
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex mb-2">
                    <button
                      type="button"
                      onClick={() => setImageInputMode("upload")}
                      className={`flex items-center px-3 py-1 rounded-l-md ${
                        imageInputMode === "upload"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <FaUpload className="mr-1" /> Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode("url")}
                      className={`flex items-center px-3 py-1 rounded-r-md ${
                        imageInputMode === "url"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <FaLink className="mr-1" /> URL
                    </button>
                  </div>

                  {imageInputMode === "upload" ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageInput}
                        className="block w-full text-sm text-gray-500 mb-2
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <input
                      type="url"
                      name="image"
                      placeholder="Image URL"
                      value={
                        typeof newResource.image === "string"
                          ? newResource.image
                          : ""
                      }
                      onChange={handleImageInput}
                      className="block w-full p-2 border border-gray-300 rounded"
                    />
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
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
                        Uploading...
                      </>
                    ) : (
                      "Add Resource"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                {resource.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={resource.image}
                      alt={resource.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl">
                        {getTypeIcon(resource.type)}
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {resource.type || "Resource"}
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {resource.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                      {resource.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      by {resource.user?.firstName || "Unknown"}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {resource.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>
                        {resource.downloads?.toLocaleString() || "0"} downloads
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <a
                    href={resource.media}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#451774] hover:text-[#451774]"
                  >
                    Preview
                  </a>
                  <div className="flex space-x-2">
                    {isUserResource(resource) && (
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    )}
                    <a
                      href={resource.media}
                      download
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-[#451774] hover:bg-[#3a115a]"
                    >
                      <FaDownload className="mr-1" /> Download
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No resources found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.currentPage - 1))
                }
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(totalPages, pagination.currentPage + 1)
                  )
                }
                disabled={pagination.currentPage === totalPages}
                className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
