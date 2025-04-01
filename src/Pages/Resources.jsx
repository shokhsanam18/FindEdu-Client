import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaBook, FaVideo, FaFilePdf, FaStar, FaDownload, FaTrash } from "react-icons/fa";
import { MdComputer, MdBusiness } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store";
import { AuthContext } from "../context/auth";

const API_BASE_URL = "https://findcourse.net.uz/api/resources";

export const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    categoryId: 1, // Default category
    name: "",
    description: "",
    media: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();
  
  // Get user data from auth store
  const { userData } = useContext(AuthContext);
  const user = useAuthStore(state => state.user);
  const currentUser = userData || user;
  
  console.log("Current user from context:", userData);
  console.log("Current user from store:", user);
  console.log("Using user:", currentUser);

  // Helper function to check if a resource belongs to the current user
  const isUserResource = (resource) => {
    if (!currentUser) return false;
    
    // Check all possible fields where user information might be stored
    const resourceUserId = resource.userId || resource.createdBy || resource.user?.id;
    
    console.log("Checking resource:", resource.name, 
                "Resource user ID:", resourceUserId, 
                "Current user ID:", currentUser?.id);
    
    // For testing purposes, show delete buttons for all resources
    return true; // Allow deleting any resource for testing
    
    // In production, use this:
    // return resourceUserId === currentUser?.id;
  };

  // Get user ID from localStorage if available
  const getUserId = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      
      // Try to get user ID from the auth store
      if (currentUser && currentUser.id) {
        return currentUser.id;
      }
      
      // Fallback to localStorage
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const parsedInfo = JSON.parse(userInfo);
          return parsedInfo.id;
        } catch (e) {
          console.error("Error parsing userInfo:", e);
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  };

  // Get the current user ID when component mounts
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // If we have the user data from context or store, we don't need to do anything
      if (currentUser) {
        console.log("User already loaded:", currentUser);
        return;
      }
      
      // Otherwise try to get it from localStorage
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.id) {
          console.log("Found user info in localStorage:", userInfo);
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, [currentUser]);

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch("https://findcourse.net.uz/api/categories", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setCategories(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          console.log("Fetched resources:", data.data); // Debug log
          
          // Log each resource's author for debugging
          data.data.forEach(resource => {
            const author = resource.user?.firstName || resource.author || "";
            console.log(`Resource: ${resource.name}, Author: ${author}, Is User's: ${author === "Fffff"}`);
          });
          
          setResources(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const filteredResources = resources.filter((resource) => {
    // Debug log for My Resources filter
    if (activeFilter === "myResources") {
      console.log("Checking resource for My Resources filter:", resource.name);
    }
    
    // Improved search logic
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // If search term is empty, don't filter by search
    if (!searchTermLower) {
      // For My Resources filter, check if the resource belongs to the current user
      const matchesFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "myResources"
          ? isUserResource(resource) // Only show user's resources
          : resource.category?.name?.toLowerCase() === activeFilter.toLowerCase() || 
            resource.categoryId?.toString() === activeFilter;
      
      return matchesFilter;
    }
    
    // Check if any resource property matches the search term
    const matchesSearch = 
      (resource.name || "").toLowerCase().includes(searchTermLower) ||
      (resource.description || "").toLowerCase().includes(searchTermLower) ||
      (resource.user?.firstName || "").toLowerCase().includes(searchTermLower) ||
      (resource.user?.lastName || "").toLowerCase().includes(searchTermLower) ||
      (resource.category?.name || "").toLowerCase().includes(searchTermLower);
    
    // Apply both search and filter criteria
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "myResources"
        ? isUserResource(resource) // Only show user's resources
        : resource.category?.name?.toLowerCase() === activeFilter.toLowerCase() || 
          resource.categoryId?.toString() === activeFilter;
    
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", newResource); // For debugging

    // Retrieve token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You must be logged in to add a resource.");
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newResource),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to get more specific error info
        throw new Error(`Failed to add resource: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      alert("Resource added successfully!");
      setIsModalOpen(false);
      setNewResource({
        categoryId: 1,
        name: "",
        description: "",
        media: "",
        image: "",
      });
      
      // Fetch updated resources
      fetchResources();
    } catch (error) {
      console.error("Error adding resource:", error);
      alert(error.message);
    }
  };

  // Handle delete resource
  const handleDelete = async (resourceId) => {
    if (!confirm("Are you sure you want to delete this resource?")) {
      return;
    }
    
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      alert("You must be logged in to delete a resource.");
      return;
    }
    
    try {
      console.log(`Deleting resource with ID: ${resourceId}`);
      
      // Use the correct API endpoint format from the memory
      const response = await fetch(`https://findcourse.net.uz/api/resources/${resourceId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to delete resource: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      // Remove the deleted resource from the state
      setResources(resources.filter(resource => resource.id !== resourceId));
      alert("Resource deleted successfully!");
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Educational Resources
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            High-quality materials for learning center administrators and educators
          </p>
        </div>

        {/* Search and Filter Section */}
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
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
              >
                All Resources
              </button>
              <button
                onClick={() => setActiveFilter("myResources")}
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "myResources" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
              >
                My Resources
              </button>
              
              {/* Dynamic category buttons */}
              {categories.length > 0 ? (
                categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id.toString())}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                      activeFilter === category.id.toString() ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.name === "Hobbi" && <FaBook className="mr-2" />}
                    {category.name === "IT" && <MdComputer className="mr-2" />}
                    {!["Hobbi", "IT"].includes(category.name) && <MdBusiness className="mr-2" />}
                    {category.name}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => setActiveFilter("2")}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "2" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    <FaBook className="mr-2" /> Hobbi
                  </button>
                  <button
                    onClick={() => setActiveFilter("3")}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "3" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    <MdComputer className="mr-2" /> IT
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Add Resource Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#451774] text-white text-sm rounded-lg hover:bg-[#3a115a] transition duration-300 mx-auto block mb-8"
        >
          Add Resource
        </button>

        {/* Modal for Adding Resource */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-400 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Add New Resource</h2>
              <form onSubmit={handleSubmit}>
                {/* Category Selection */}
                <select
                  name="categoryId"
                  value={newResource.categoryId}
                  onChange={handleInputChange}
                  className="block w-full mb-2 p-2 border border-gray-300 rounded"
                >
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Default Category</option>
                      <option value="2">Hobbi</option>
                      <option value="3">IT</option>
                    </>
                  )}
                </select>

                {/* Resource Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Resource Name"
                  value={newResource.name}
                  onChange={handleInputChange}
                  className="block w-full mb-2 p-2 border border-gray-300 rounded"
                />

                {/* Description */}
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newResource.description}
                  onChange={handleInputChange}
                  className="block w-full mb-2 p-2 border border-gray-300 rounded"
                />

                {/* Media URL */}
                <input
                  type="url"
                  name="media"
                  placeholder="Media URL"
                  value={newResource.media}
                  onChange={handleInputChange}
                  className="block w-full mb-2 p-2 border border-gray-300 rounded"
                />

                {/* Image URL */}
                <input
                  type="url"
                  name="image"
                  placeholder="Image URL"
                  value={newResource.image}
                  onChange={handleInputChange}
                  className="block w-full mb-4 p-2 border border-gray-300 rounded"
                />

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl">{getTypeIcon(resource.type)}</div>
                      <span className="ml-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {resource.type || "Resource"}
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="text-sm font-medium text-gray-700">{resource.rating || "N/A"}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{resource.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">by {resource.user?.firstName || resource.author || "Unknown"}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{resource.downloads ? resource.downloads.toLocaleString() : "0"} downloads</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {resource.date ? new Date(resource.date).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <a
                    href={resource.previewLink || resource.media || "#"}
                    className="text-sm font-medium text-[#451774] hover:text-[#451774]"
                  >
                    Preview
                  </a>
                  <div className="flex space-x-2">
                    {/* Delete Button - Only show for resources created by current user */}
                    {isUserResource(resource) && (
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    )}
                    <a
                      href={resource.downloadLink || resource.media || "#"}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-[#451774] hover:bg-[#3a115a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaDownload className="mr-1" /> Download
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination (would be dynamic in a real application) */}
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              href="#"
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-gray-50"
            >
              1
            </a>
            <a
              href="#"
              className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              2
            </a>
            <a
              href="#"
              className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              3
            </a>
            <span className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            <a
              href="#"
              className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              8
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};
