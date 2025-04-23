// import React, { useState, useEffect, useContext } from "react";
// import { FaSearch, FaBook, FaVideo, FaFilePdf, FaStar, FaDownload, FaTrash } from "react-icons/fa";
// import { MdComputer, MdBusiness } from "react-icons/md";
// import { useNavigate,Link } from "react-router-dom";
// import { useAuthStore } from "../Store";
// import { AuthContext } from "../context/auth";
// import { toast } from "sonner";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from 'framer-motion';
// const API_BASE_URL = "https://findcourse.net.uz/api/resources";
// const CATEGORIES_URL = "https://findcourse.net.uz/api/categories";

// export const Resources = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newResource, setNewResource] = useState({
//     categoryId: 1, // Default category
//     name: "",
//     description: "",
//     media: "",
//     image: "",
//   });
//   const [categories, setCategories] = useState([]);
//   const [resources, setResources] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     itemsPerPage: 9,
//     totalItems: 0
//   });
//   const navigate = useNavigate();
  
//   const { userData } = useContext(AuthContext);
//   const user = useAuthStore(state => state.user);
//   const currentUser = userData || user;

//   const isLoggedIn = !!localStorage.getItem("accessToken");

//   const handleAddResourceClick = () => {
//     if (!isLoggedIn) {
//       toast.error("Please login first to add resources!");
//       return;
//     }
//     setIsModalOpen(true);
//   };

//   const isUserResource = (resource) => {
//     if (!currentUser) return false;
//     return resource.userId === currentUser?.id;
//   };

//   // Fetch resources with pagination
//   const fetchResources = async (page = 1) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const { itemsPerPage } = pagination;
      
//       let url = `${API_BASE_URL}?page=${page}&limit=${itemsPerPage}`;
      
//       if (activeFilter === "myResources") {
//         url += `&userId=${currentUser?.id}`;
//       } else if (activeFilter !== "all") {
//         url += `&categoryId=${activeFilter}`;
//       }
      
//       if (searchTerm) {
//         url += `&search=${searchTerm}`;
//       }

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setResources(data.data || []);
//         setPagination(prev => ({
//           ...prev,
//           currentPage: page,
//           totalItems: data.total || 0
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching resources:", error);
//       toast.error("Failed to load resources");
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await fetch(CATEGORIES_URL, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setCategories(data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Failed to load categories");
//     }
//   };

//   // Handle page change
//   const handlePageChange = (page) => {
//     fetchResources(page);
//   };

//   useEffect(() => {
//     fetchResources();
//     fetchCategories();
//   }, [activeFilter, searchTerm]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewResource({ ...newResource, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!isLoggedIn) {
//       toast.error("Please login first!");
//       return;
//     }

//     if (!newResource.categoryId) {
//       toast.error("Please select a category");
//       return;
//     }

//     if (!newResource.name.trim()) {
//       toast.error("Please enter a resource name");
//       return;
//     }

//     if (!newResource.media) {
//       toast.error("Please enter a media URL");
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await fetch(API_BASE_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify(newResource),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add resource");
//       }

//       const data = await response.json();
//       toast.success("Resource added successfully!");
//       setIsModalOpen(false);
//       setNewResource({
//         categoryId: 1,
//         name: "",
//         description: "",
//         media: "",
//         image: "",
//       });
//       fetchResources();
//     } catch (error) {
//       console.error("Error adding resource:", error);
//       toast.error(error.message || "Failed to add resource");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDelete = async (resourceId) => {
//     if (!confirm("Are you sure you want to delete this resource?")) return;
    
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await fetch(`${API_BASE_URL}/${resourceId}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete resource");
//       }

//       setResources(resources.filter(r => r.id !== resourceId));
//       toast.success("Resource deleted successfully");
//     } catch (error) {
//       console.error("Error deleting resource:", error);
//       toast.error(error.message);
//     }
//   };

//   // Filter resources client-side for additional filtering
//   const filteredResources = resources.filter(resource => {
//     const matchesSearch = searchTerm 
//       ? resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
//       : true;

//     const matchesFilter = 
//       activeFilter === "all" ? true :
//       activeFilter === "myResources" ? isUserResource(resource) :
//       resource.categoryId?.toString() === activeFilter;

//     return matchesSearch && matchesFilter;
//   });

//   const getTypeIcon = (type) => {
//     switch (type) {
//       case "ebook": return <FaBook className="text-blue-500" />;
//       case "video": return <FaVideo className="text-red-500" />;
//       case "pdf": return <FaFilePdf className="text-red-600" />;
//       default: return <FaBook className="text-gray-500" />;
//     }
//   };

//   // Generate pagination buttons
//   const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
//   const renderPaginationButtons = () => {
//     const buttons = [];
//     const maxVisibleButtons = 5;
//     let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisibleButtons / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

//     if (endPage - startPage + 1 < maxVisibleButtons) {
//       startPage = Math.max(1, endPage - maxVisibleButtons + 1);
//     }

//     if (startPage > 1) {
//       buttons.push(
//         <button
//           key={1}
//           onClick={() => handlePageChange(1)}
//           className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//         >
//           1
//         </button>
//       );
//       if (startPage > 2) {
//         buttons.push(
//           <span key="start-ellipsis" className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//             ...
//           </span>
//         );
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`px-3 py-2 border border-gray-300 text-sm font-medium ${
//             pagination.currentPage === i ? "bg-blue-100 text-blue-800" : "bg-white text-gray-500 hover:bg-gray-50"
//           }`}
//         >
//           {i}
//         </button>
//       );
//     }

//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         buttons.push(
//           <span key="end-ellipsis" className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//             ...
//           </span>
//         );
//       }
//       buttons.push(
//         <button
//           key={totalPages}
//           onClick={() => handlePageChange(totalPages)}
//           className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//         >
//           {totalPages}
//         </button>
//       );
//     }

//     return buttons;
//   };

//   return (
//     <div className="">
// <motion.div
//   initial={{ opacity: 0, y: -50 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.8 }}
//   className="relative flex flex-col md:flex-row justify-between items-center md:items-center p-6 min-h-[50vh] text-[#2d0e4e] bg-cover bg-center mt-20"
//   style={{ backgroundImage: "url('/aboutus.png')" }}
// >
//   <div className="absolute inset-0 bg-white bg-opacity-70"></div>

//   <motion.div
//     initial={{ opacity: 0, x: -50 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ duration: 0.8, delay: 0.3 }}
//     className="relative z-10 max-w-2xl px-3 text-center md:px-6 md:text-start mt-2 md:mt-8"
//   >
//     <p className="text-xl md:text-xl mt-6 md:mt-0">
//       Discover Teaching Resources
//     </p>
//     <p className="text-lg md:text-l mt-4 md:mt-2">
//       Access high-quality materials to enhance your educational programs.
//     </p>
//     <h1 className="text-4xl md:text-5xl font-bold mt-2 md:mt-4">Educational Resources</h1>
//   </motion.div>

//   <motion.div
//     initial={{ opacity: 0, x: 50 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ duration: 0.8, delay: 0.6 }}
//     className="relative z-10 flex flex-col md:flex-row gap-1 md:gap-2 ml-6 md:mr-10 md:text-xl mt-4 md:mt-0"
//   >
//     <div className="flex gap-2">
//       <Link to="/" className="no-underline hover:underline text-white">
//         Home
//       </Link>
//       <p>|</p>
//       <Link
//         to="/resources"
//         className="text-[#2d0e4e] no-underline hover:underline"
//       >
//         Resources
//       </Link>
//     </div>
//   </motion.div>
// </motion.div>

//     <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8 mt-5">
//       <div className="max-w-7xl mx-auto">
//         {/* Page Header */}


//         {/* Search and Filter Section */}
//         <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="relative flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="Search resources..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
//               <button
//                 onClick={() => setActiveFilter("all")}
//                 className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
//               >
//                 All Resources
//               </button>
//               {isLoggedIn && (
//                 <button
//                   onClick={() => setActiveFilter("myResources")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "myResources" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
//                 >
//                   My Resources
//                 </button>
//               )}
              
//               {categories.map(category => (
//                 <button
//                   key={category.id}
//                   onClick={() => setActiveFilter(category.id.toString())}
//                   className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
//                     activeFilter === category.id.toString() ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {category.name === "IT" ? <MdComputer className="mr-2" /> : <MdBusiness className="mr-2" />}
//                   {category.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Add Resource Button */}
//         <button
//           onClick={handleAddResourceClick}
//           className="px-4 py-2 bg-[#451774] text-white text-sm rounded-lg hover:bg-[#3a115a] transition duration-300 mx-auto block mb-8"
//         >
//           Add Resource
//         </button>

//         {/* Modal for Adding Resource */}
//         {isModalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-400 bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-semibold mb-4">Add New Resource</h2>
//               <form onSubmit={handleSubmit}>
//                 {/* Category Selection */}
//                 <select
//                   name="categoryId"
//                   value={newResource.categoryId}
//                   onChange={handleInputChange}
//                   className="block w-full mb-2 p-2 border border-gray-300 rounded"
//                   required
//                 >
//                   {categories.length > 0 ? (
//                     categories.map(category => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))
//                   ) : (
//                     <>
//                       <option value="1">Default Category</option>
//                       <option value="2">Hobbi</option>
//                       <option value="3">IT</option>
//                     </>
//                   )}
//                 </select>

//                 {/* Resource Name */}
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Resource Name"
//                   value={newResource.name}
//                   onChange={handleInputChange}
//                   className="block w-full mb-2 p-2 border border-gray-300 rounded"
//                   required
//                 />

//                 {/* Description */}
//                 <textarea
//                   name="description"
//                   placeholder="Description"
//                   value={newResource.description}
//                   onChange={handleInputChange}
//                   className="block w-full mb-2 p-2 border border-gray-300 rounded"
//                 />

//                 {/* Media URL */}
//                 <input
//                   type="url"
//                   name="media"
//                   placeholder="Media URL"
//                   value={newResource.media}
//                   onChange={handleInputChange}
//                   className="block w-full mb-2 p-2 border border-gray-300 rounded"
//                   required
//                 />

//                 {/* Image URL */}
//                 <input
//                   type="url"
//                   name="image"
//                   placeholder="Image URL"
//                   value={newResource.image}
//                   onChange={handleInputChange}
//                   className="block w-full mb-4 p-2 border border-gray-300 rounded"
//                 />

//                 {/* Buttons */}
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                     disabled={isUploading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
//                     disabled={isUploading}
//                   >
//                     {isUploading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Uploading...
//                       </>
//                     ) : (
//                       "Add Resource"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Resources Grid */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredResources.length > 0 ? (
//             filteredResources.map((resource) => (
//               <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
//                 {resource.image && (
//                   <div className="h-48 overflow-hidden">
//                     <img 
//                       src={resource.image} 
//                       alt={resource.name} 
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 )}
//                 <div className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className="text-2xl">{getTypeIcon(resource.type)}</div>
//                       <span className="ml-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {resource.type || "Resource"}
//                       </span>
//                     </div>
//                     <div className="flex items-center text-yellow-500">
//                       <FaStar className="mr-1" />
//                       <span className="text-sm font-medium text-gray-700">{resource.rating || "N/A"}</span>
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{resource.name}</h3>
//                     <p className="mt-1 text-sm text-gray-500">by {resource.user?.firstName || "Unknown"}</p>
//                     <p className="mt-2 text-sm text-gray-600 line-clamp-3">{resource.description}</p>
//                   </div>
//                   <div className="mt-6 flex items-center justify-between">
//                     <div className="flex items-center text-sm text-gray-500">
//                       <span>{resource.downloads?.toLocaleString() || "0"} downloads</span>
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {new Date(resource.createdAt).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-6 py-4 flex justify-between">
//                   <a
//                     href={resource.media}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm font-medium text-[#451774] hover:text-[#451774]"
//                   >
//                     Preview
//                   </a>
//                   <div className="flex space-x-2">
//                     {isUserResource(resource) && (
//                       <button
//                         onClick={() => handleDelete(resource.id)}
//                         className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
//                       >
//                         <FaTrash className="mr-1" /> Delete
//                       </button>
//                     )}
//                     <a
//                       href={resource.media}
//                       download
//                       className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-[#451774] hover:bg-[#3a115a]"
//                     >
//                       <FaDownload className="mr-1" /> Download
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-3 py-12 text-center">
//               <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
//               <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="mt-12 flex justify-center">
//             <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//               <button
//                 onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
//                 disabled={pagination.currentPage === 1}
//                 className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               {renderPaginationButtons()}
//               <button
//                 onClick={() => handlePageChange(Math.min(totalPages, pagination.currentPage + 1))}
//                 disabled={pagination.currentPage === totalPages}
//                 className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>
//     </div>     </div>
//   );
// };















import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaBook, FaVideo, FaFilePdf, FaStar, FaDownload, FaTrash } from "react-icons/fa";
import { MdComputer, MdBusiness } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../Store";
import { AuthContext } from "../context/auth";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';

const API_BASE_URL = "https://findcourse.net.uz/api/resources";
const CATEGORIES_URL = "https://findcourse.net.uz/api/categories";
const UPLOAD_URL = "https://findcourse.net.uz/api/upload";
const IMAGE_BASE_URL = "https://findcourse.net.uz/api/image";

export const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    categoryId: 1,
    name: "",
    description: "",
    media: "",
    image: "",
    imageFile: null,
  });
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0
  });
  const navigate = useNavigate();
  
  const { userData } = useContext(AuthContext);
  const user = useAuthStore(state => state.user);
  const currentUser = userData || user;

  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleAddResourceClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login first to add resources!");
      return;
    }
    setIsModalOpen(true);
  };

  const isUserResource = (resource) => {
    if (!currentUser) return false;
    return resource.userId === currentUser?.id;
  };

  // Fetch resources with pagination
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

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResources(data.data || []);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalItems: data.total || 0
        }));
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(CATEGORIES_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ensure category images use the correct API endpoint
        const categoriesWithImages = data.data.map(category => ({
          ...category,
          image: category.image ? `${IMAGE_BASE_URL}/${category.image}` : null
        }));
        setCategories(categoriesWithImages || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Handle page change
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewResource(prev => ({ 
        ...prev, 
        imageFile: file,
        image: "" // Clear the URL when a file is selected
      }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();
      return data.data; // Returns the filename
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error("Please login first!");
      return;
    }

    if (!newResource.categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!newResource.name.trim()) {
      toast.error("Please enter a resource name");
      return;
    }

    if (!newResource.media) {
      toast.error("Please enter a media URL");
      return;
    }

    // Validate that either image URL or file is provided, but not both
    if (!newResource.image && !newResource.imageFile) {
      toast.error("Please provide either an image URL or upload an image file");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = newResource.image;
      
      // If image file is provided, upload it and get the URL
      if (newResource.imageFile) {
        const filename = await uploadImage(newResource.imageFile);
        imageUrl = `${IMAGE_BASE_URL}/${filename}`;
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: newResource.categoryId,
          name: newResource.name,
          description: newResource.description,
          media: newResource.media,
          image: imageUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add resource");
      }

      const data = await response.json();
      toast.success("Resource added successfully!");
      setIsModalOpen(false);
      setNewResource({
        categoryId: 1,
        name: "",
        description: "",
        media: "",
        image: "",
        imageFile: null,
      });
      fetchResources();
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error(error.message || "Failed to add resource");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/${resourceId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      setResources(resources.filter(r => r.id !== resourceId));
      toast.success("Resource deleted successfully");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error(error.message);
    }
  };

  // Filter resources client-side for additional filtering
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm 
      ? resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilter = 
      activeFilter === "all" ? true :
      activeFilter === "myResources" ? isUserResource(resource) :
      resource.categoryId?.toString() === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "ebook": return <FaBook className="text-blue-500" />;
      case "video": return <FaVideo className="text-red-500" />;
      case "pdf": return <FaFilePdf className="text-red-600" />;
      default: return <FaBook className="text-gray-500" />;
    }
  };

  // Generate pagination buttons
  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisibleButtons / 2));
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
          <span key="start-ellipsis" className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
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
            pagination.currentPage === i ? "bg-blue-100 text-blue-800" : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
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
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col md:flex-row justify-between items-center md:items-center p-6 min-h-[50vh] text-[#2d0e4e] bg-cover bg-center mt-20"
        style={{ backgroundImage: "url('/aboutus.png')" }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-2xl px-3 text-center md:px-6 md:text-start mt-2 md:mt-8"
        >
          <p className="text-xl md:text-xl mt-6 md:mt-0">
            Discover Teaching Resources
          </p>
          <p className="text-lg md:text-l mt-4 md:mt-2">
            Access high-quality materials to enhance your educational programs.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 md:mt-4">Educational Resources</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex flex-col md:flex-row gap-1 md:gap-2 ml-6 md:mr-10 md:text-xl mt-4 md:mt-0"
        >
          <div className="flex gap-2">
            <Link to="/" className="no-underline hover:underline text-white">
              Home
            </Link>
            <p>|</p>
            <Link
              to="/resources"
              className="text-[#2d0e4e] no-underline hover:underline"
            >
              Resources
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-5">
        <div className="max-w-7xl mx-auto">
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
            </div>

            {/* Categories Filter - Full card size images */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* All Resources Button */}
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`flex flex-col items-center p-0 rounded-lg overflow-hidden ${activeFilter === "all" ? "ring-2 ring-blue-500" : ""} hover:shadow-md transition-all`}
                >
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <FaSearch className="text-gray-500 text-4xl" />
                  </div>
                  <span className="text-sm font-medium p-2">All Resources</span>
                </button>

                {/* My Resources Button (if logged in) */}
                {isLoggedIn && (
                  <button
                    onClick={() => setActiveFilter("myResources")}
                    className={`flex flex-col items-center p-0 rounded-lg overflow-hidden ${activeFilter === "myResources" ? "ring-2 ring-blue-500" : ""} hover:shadow-md transition-all`}
                  >
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <FaStar className="text-yellow-500 text-4xl" />
                    </div>
                    <span className="text-sm font-medium p-2">My Resources</span>
                  </button>
                )}

                {/* Category Buttons */}
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id.toString())}
                    className={`flex flex-col items-center p-0 rounded-lg overflow-hidden ${activeFilter === category.id.toString() ? "ring-2 ring-blue-500" : ""} hover:shadow-md transition-all`}
                  >
                    {category.image ? (
                      <div className="w-full h-32 bg-gray-100">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                        {category.name === "IT" ? (
                          <MdComputer className="text-gray-500 text-4xl" />
                        ) : (
                          <MdBusiness className="text-gray-500 text-4xl" />
                        )}
                      </div>
                    )}
                    <span className="text-sm font-medium p-2">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add Resource Button */}
          <button
            onClick={handleAddResourceClick}
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
                    required
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
                    required
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
                    required
                  />

                  {/* Image Upload - URL or File */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL or File)</label>
                    <input
                      type="url"
                      name="image"
                      placeholder="Image URL"
                      value={newResource.image}
                      onChange={(e) => {
                        handleInputChange(e);
                        // Clear file if URL is entered
                        if (e.target.value) {
                          setNewResource(prev => ({ ...prev, imageFile: null }));
                        }
                      }}
                      className="block w-full mb-2 p-2 border border-gray-300 rounded"
                      disabled={!!newResource.imageFile}
                    />
                    <p className="text-xs text-gray-500 mb-2">- OR -</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {newResource.imageFile && (
                      <div className="mt-2 text-sm text-green-600">
                        Selected file: {newResource.imageFile.name}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
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
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
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
                      <p className="mt-1 text-sm text-gray-500">by {resource.user?.firstName || "Unknown"}</p>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{resource.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{resource.downloads?.toLocaleString() || "0"} downloads</span>
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
                <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, pagination.currentPage + 1))}
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
    </div>
  );
};