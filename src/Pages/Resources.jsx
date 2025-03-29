import React, { useState } from "react";
import { FaSearch, FaBook, FaVideo, FaFilePdf, FaStar, FaDownload } from "react-icons/fa";
import { MdComputer, MdBusiness } from "react-icons/md";

export const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Sample resource data
  const resources = [
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
      downloadLink: "#"
    },
    {
      id: 2,
      title: "Classroom Management Techniques",
      type: "video",
      category: "teaching",
      author: "Education Excellence",
      rating: 4.6,
      downloads: 892,
      date: "2023-04-22",
      previewLink: "#",
      downloadLink: "#"
    },
    {
      id: 3,
      title: "Digital Tools for Educators",
      type: "pdf",
      category: "technology",
      author: "TechEd Solutions",
      rating: 4.9,
      downloads: 1567,
      date: "2023-06-10",
      previewLink: "#",
      downloadLink: "#"
    },
    {
      id: 4,
      title: "Curriculum Development Guide",
      type: "ebook",
      category: "teaching",
      author: "Global Education",
      rating: 4.7,
      downloads: 1021,
      date: "2023-03-18",
      previewLink: "#",
      downloadLink: "#"
    },
    {
      id: 5,
      title: "Marketing Your Learning Center",
      type: "pdf",
      category: "business",
      author: "EduMarketing Pros",
      rating: 4.5,
      downloads: 756,
      date: "2023-07-05",
      previewLink: "#",
      downloadLink: "#"
    },
    {
      id: 6,
      title: "Interactive Learning Apps Review",
      type: "video",
      category: "technology",
      author: "Digital Education",
      rating: 4.4,
      downloads: 689,
      date: "2023-02-28",
      previewLink: "#",
      downloadLink: "#"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || resource.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case "ebook": return <FaBook className="text-blue-500" />;
      case "video": return <FaVideo className="text-red-500" />;
      case "pdf": return <FaFilePdf className="text-red-600" />;
      default: return <FaBook className="text-gray-500" />;
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
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "all" ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                All Resources
              </button>
              <button
                onClick={() => setActiveFilter("teaching")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "teaching" ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <FaBook className="mr-2" /> Teaching
              </button>
              <button
                onClick={() => setActiveFilter("technology")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "technology" ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <MdComputer className="mr-2" /> Technology
              </button>
              <button
                onClick={() => setActiveFilter("business")}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeFilter === "business" ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <MdBusiness className="mr-2" /> Business
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl">
                        {getTypeIcon(resource.type)}
                      </div>
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
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      by {resource.author}
                    </p>
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

        {/* Pagination (would be dynamic in a real app) */}
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