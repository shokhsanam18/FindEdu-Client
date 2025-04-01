import React, { useState } from "react";
import { FaSearch, FaBook, FaVideo, FaFilePdf, FaStar, FaDownload } from "react-icons/fa";
import { MdComputer, MdBusiness } from "react-icons/md";

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

  // Simulate the current logged-in user's ID
  const currentUserId = 1;

  // Sample resource data (replace with actual data fetching later)
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Modern Teaching Methodologies",
      type: "ebook",
      category: "teaching",
      author: "Dr. Sarah Johnson",
      rating: 4.8,
      downloads: 1243,
      date: "2023-05-15",
      previewLink: "#",
      downloadLink: "#",
      createdBy: 1,
    },
    {
      id: 2,
      title: "Business Strategies",
      type: "pdf",
      category: "business",
      author: "John Doe",
      rating: 4.2,
      downloads: 903,
      date: "2023-06-10",
      previewLink: "#",
      downloadLink: "#",
      createdBy: 2,
    },
  ]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "myResources"
        ? resource.createdBy === currentUserId
        : resource.category === activeFilter;
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
    const token = localStorage.getItem("token"); // Assuming the token is stored under the key 'token'

    if (!token) {
      alert("You must be logged in to add a resource.");
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add Authorization header with Bearer token
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
      // In a real application, you would likely refetch the resources here
      // or update the local state to include the new resource.
      setResources([...resources, { id: Date.now(), createdBy: currentUserId, ...newResource }]); // Basic local update
    } catch (error) {
      console.error("Error adding resource:", error);
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
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
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
              <button
                onClick={() => setActiveFilter("teaching")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "teaching" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
              >
                <FaBook className="mr-2" /> Teaching
              </button>
              <button
                onClick={() => setActiveFilter("technology")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "technology" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
              >
                <MdComputer className="mr-2" /> Technology
              </button>
              <button
                onClick={() => setActiveFilter("business")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "business" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
              >
                <MdBusiness className="mr-2" /> Business
              </button>
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
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
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
                  <option value="1">Category 1</option>
                  <option value="2">Category 2</option>
                  <option value="3">Category 3</option>
                  {/* You should replace these with actual category options fetched from your backend */}
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
                        {resource.type}
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{resource.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">by {resource.author}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{resource.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(resource.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <a
                    href={resource.previewLink}
                    className="text-sm font-medium text-[#451774] hover:text-[#451774]"
                  >
                    Preview
                  </a>
                  <a
                    href={resource.downloadLink}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-[#451774] hover:bg-[#451774] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaDownload className="mr-1" /> Download
                  </a>
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
