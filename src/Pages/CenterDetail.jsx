// import { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Heart, Star, ChevronLeft, MessageSquare, MapPin, Phone, Mail, Clock, Users, BookOpen } from "lucide-react";
// import { toast } from "sonner";

// const CenterDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [center, setCenter] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [rating, setRating] = useState(0);
//   const [stats, setStats] = useState({
//     students: 0,
//     courses: 0,
//     rating: 0
//   });

//   useEffect(() => {
//     const fetchCenterData = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
//         const [
//           centerRes, 
//           commentsRes, 
//           statsRes
//         ] = await Promise.all([
//           axios.get(`http://18.141.233.37:4000/api/centers/${id}`, { headers }),
//           axios.get(`http://18.141.233.37:4000/api/comments?centerId=${id}`, { headers }),
//           axios.get(`http://18.141.233.37:4000/api/centers/${id}/stats`, { headers })
//         ]);

//         setCenter({
//           ...centerRes.data,
//           imageUrl: centerRes.data.image 
//             ? `http://18.141.233.37:4000/api/image/${centerRes.data.image}`
//             : null
//         });
//         setComments(commentsRes.data);
//         setStats(statsRes.data);
//       } catch (err) {
//         toast.error("Failed to load center data");
//         navigate("/");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCenterData();
//   }, [id, navigate]);

//   const handleLike = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         toast.error("Please login to like centers");
//         navigate("/login");
//         return;
//       }

//       await axios.post(
//         `http://18.141.233.37:4000/api/centers/${id}/like`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setCenter(prev => ({
//         ...prev,
//         likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
//         isLiked: !prev.isLiked
//       }));
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to like center");
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         toast.error("Please login to post comments");
//         navigate("/login");
//         return;
//       }

//       const response = await axios.post(
//         "http://18.141.233.37:4000/api/comments",
//         { centerId: id, content: newComment, rating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setComments([response.data, ...comments]);
//       setNewComment("");
//       setRating(0);
//       toast.success("Comment posted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to post comment");
//     }
//   };

//   const handleRating = async (newRating) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         toast.error("Please login to rate centers");
//         navigate("/login");
//         return;
//       }

//       await axios.patch(
//         `http://18.141.233.37:4000/api/centers/${id}/rate`,
//         { rating: newRating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setCenter(prev => ({
//         ...prev,
//         rating: newRating,
//         ratingCount: prev.ratingCount + 1
//       }));
//       toast.success("Rating submitted");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit rating");
//     }
//   };

//   if (loading) return <div className="text-center py-20">Loading center details...</div>;
//   if (!center) return <div className="text-center py-20">Center not found</div>;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <Link to="/" className="flex items-center text-purple-700 mb-6 hover:text-purple-900 transition">
//         <ChevronLeft className="mr-1" /> Back to Centers
//       </Link>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Hero Section */}
//         <div className="relative">
//           {center.imageUrl && (
//             <img
//               src={center.imageUrl}
//               alt={center.name}
//               className="w-full h-64 object-cover"
//               onError={(e) => {
//                 e.target.src = "/placeholder-center.jpg";
//                 e.target.className = "w-full h-64 object-cover bg-gray-200";
//               }}
//             />
//           )}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
//           <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
//             <div>
//               <h1 className="text-3xl font-bold text-white">{center.name}</h1>
//               <div className="flex items-center mt-2">
//                 <div className="flex mr-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       size={20}
//                       fill={star <= center.rating ? "#F59E0B" : "none"}
//                       color="#F59E0B"
//                     />
//                   ))}
//                 </div>
//                 <span className="text-white text-sm">
//                   ({center.ratingCount || 0} reviews)
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLike}
//               className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
//               aria-label={center.isLiked ? "Unlike center" : "Like center"}
//             >
//               <Heart
//                 size={24}
//                 fill={center.isLiked ? "red" : "none"}
//                 color={center.isLiked ? "red" : "currentColor"}
//               />
//               <span className="sr-only">Likes</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Bar */}
//         <div className="grid grid-cols-3 divide-x divide-gray-200 bg-purple-50 text-center py-4">
//           <div className="px-4">
//             <div className="flex items-center justify-center gap-2">
//               <Users className="text-purple-600" size={18} />
//               <span className="font-medium">{stats.students || 0}</span>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Students</p>
//           </div>
//           <div className="px-4">
//             <div className="flex items-center justify-center gap-2">
//               <BookOpen className="text-purple-600" size={18} />
//               <span className="font-medium">{stats.courses || 0}</span>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Courses</p>
//           </div>
//           <div className="px-4">
//             <div className="flex items-center justify-center gap-2">
//               <Star className="text-purple-600" size={18} fill="#F59E0B" />
//               <span className="font-medium">{stats.rating?.toFixed(1) || 0}</span>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Avg Rating</p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Left Column */}
//             <div className="md:col-span-2">
//               <section className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center">
//                   <MapPin className="text-purple-600 mr-2" size={20} />
//                   Location & Contact
//                 </h2>
//                 <div className="space-y-3">
//                   <p className="flex items-start">
//                     <span className="inline-block w-24 text-gray-500">Address:</span>
//                     <span>{center.address}</span>
//                   </p>
//                   <p className="flex items-start">
//                     <span className="inline-block w-24 text-gray-500">Phone:</span>
//                     <span>{center.phone}</span>
//                   </p>
//                   {center.email && (
//                     <p className="flex items-start">
//                       <span className="inline-block w-24 text-gray-500">Email:</span>
//                       <a href={`mailto:${center.email}`} className="text-purple-600 hover:underline">
//                         {center.email}
//                       </a>
//                     </p>
//                   )}
//                   {center.website && (
//                     <p className="flex items-start">
//                       <span className="inline-block w-24 text-gray-500">Website:</span>
//                       <a 
//                         href={center.website.startsWith('http') ? center.website : `https://${center.website}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-purple-600 hover:underline"
//                       >
//                         {center.website}
//                       </a>
//                     </p>
//                   )}
//                   {center.schedule && (
//                     <p className="flex items-start">
//                       <span className="inline-block w-24 text-gray-500">Hours:</span>
//                       <span>{center.schedule}</span>
//                     </p>
//                   )}
//                 </div>
//               </section>

//               <section className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center">
//                   <BookOpen className="text-purple-600 mr-2" size={20} />
//                   Courses Offered
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {center.courses?.length > 0 ? (
//                     center.courses.map(course => (
//                       <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//                         <h3 className="font-medium">{course.name}</h3>
//                         <div className="flex items-center text-sm text-gray-600 mt-2">
//                           <Clock size={14} className="mr-1" />
//                           <span>{course.duration}</span>
//                         </div>
//                         <p className="text-sm mt-2 line-clamp-2">{course.description}</p>
//                         <div className="mt-3 text-sm font-medium text-purple-600">
//                           {course.price ? `$${course.price}` : "Free"}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No courses listed</p>
//                   )}
//                 </div>
//               </section>
//             </div>

//             {/* Right Column */}
//             <div>
//               <section className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4">About This Center</h2>
//                 <div className="prose max-w-none">
//                   {center.description || (
//                     <p className="text-gray-500">No description available</p>
//                   )}
//                 </div>
//               </section>

//               <section className="border-t border-gray-200 pt-6">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center">
//                   <MessageSquare className="text-purple-600 mr-2" size={20} />
//                   Reviews ({comments.length})
//                 </h2>

//                 <form onSubmit={handleCommentSubmit} className="mb-6">
//                   <div className="mb-4">
//                     <textarea
//                       placeholder="Share your experience..."
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <span className="mr-2 text-sm">Your rating:</span>
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <button
//                             key={star}
//                             type="button"
//                             onClick={() => setRating(star)}
//                             className="focus:outline-none"
//                           >
//                             <Star
//                               size={20}
//                               fill={star <= rating ? "#F59E0B" : "none"}
//                               color="#F59E0B"
//                             />
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
//                       disabled={!newComment || rating === 0}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>

//                 <div className="space-y-4">
//                   {comments.length > 0 ? (
//                     comments.map(comment => (
//                       <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
//                         <div className="flex justify-between items-start mb-2">
//                           <h4 className="font-medium">{comment.user?.name || "Anonymous"}</h4>
//                           <div className="flex">
//                             {[1, 2, 3, 4, 5].map(star => (
//                               <Star
//                                 key={star}
//                                 size={16}
//                                 fill={star <= comment.rating ? "#F59E0B" : "none"}
//                                 color="#F59E0B"
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <p className="text-gray-700">{comment.content}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {new Date(comment.createdAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 text-center py-4">No reviews yet. Be the first!</p>
//                   )}
//                 </div>
//               </section>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CenterDetailPage;
















// import { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Heart, Star, ChevronLeft, MessageSquare, MapPin, Phone, Mail, Clock, Users, BookOpen } from "lucide-react";
// import { toast } from "sonner";

// const CenterDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [center, setCenter] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [rating, setRating] = useState(0);
//   const [stats, setStats] = useState({
//     students: 0,
//     courses: 0,
//     rating: 0
//   });

//   useEffect(() => {
//     let isMounted = true;

//     const fetchCenterData = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
//         const [centerRes, commentsRes, statsRes] = await Promise.all([
//           axios.get(`http://18.141.233.37:4000/api/centers/${id}`, { headers }),
//           axios.get(`http://18.141.233.37:4000/api/comments?centerId=${id}`, { headers }),
//           axios.get(`http://18.141.233.37:4000/api/centers/${id}/stats`, { headers })
//         ]);

//         if (isMounted) {
//           setCenter({
//             ...centerRes.data,
//             imageUrl: centerRes.data.image 
//               ? `http://18.141.233.37:4000/api/image/${centerRes.data.image}`
//               : null
//           });
//           setComments(commentsRes.data || []);
//           setStats(statsRes.data || {
//             students: 0,
//             courses: 0,
//             rating: 0
//           });
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err.message);
//           toast.error("Failed to load center details");
//           navigate("/", { replace: true });
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchCenterData();

//     return () => {
//       isMounted = false;
//     };
//   }, [id, navigate]);

//   const handleLike = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         toast.error("Please login to like centers");
//         navigate("/login");
//         return;
//       }

//       await axios.post(
//         `http://18.141.233.37:4000/api/centers/${id}/like`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setCenter(prev => ({
//         ...prev,
//         likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
//         isLiked: !prev.isLiked
//       }));
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to like center");
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         toast.error("Please login to post comments");
//         navigate("/login");
//         return;
//       }

//       const response = await axios.post(
//         "http://18.141.233.37:4000/api/comments",
//         { centerId: id, content: newComment, rating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setComments([response.data, ...comments]);
//       setNewComment("");
//       setRating(0);
//       toast.success("Comment posted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to post comment");
//     }
//   };

//   const handleRating = async (newRating) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         toast.error("Please login to rate centers");
//         navigate("/login");
//         return;
//       }

//       await axios.patch(
//         `http://18.141.233.37:4000/api/centers/${id}/rate`,
//         { rating: newRating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setCenter(prev => ({
//         ...prev,
//         rating: newRating,
//         ratingCount: prev.ratingCount + 1
//       }));
//       toast.success("Rating submitted");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit rating");
//     }
//   };


//   if (loading) return (
//     <div className="text-center py-20">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
//       <p className="mt-4">Loading center details...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="text-center py-20 text-red-500">
//       <p>Error loading center details</p>
//       <button 
//         onClick={() => window.location.reload()}
//         className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//       >
//         Try Again
//       </button>
//     </div>
//   );

//   if (!center) return (
//     <div className="text-center py-20">
//       <p>Center not found</p>
//       <Link 
//         to="/" 
//         className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//       >
//         Back to Centers
//       </Link>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <button 
//         onClick={() => navigate(-1)}
//         className="flex items-center text-purple-700 mb-6 hover:text-purple-900 transition"
//       >
//         <ChevronLeft className="mr-1" /> Back to Centers
//       </button>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Hero Section */}
//         <div className="relative">
//           {center.imageUrl && (
//             <img
//               src={center.imageUrl}
//               alt={center.name}
//               className="w-full h-64 object-cover"
//               onError={(e) => {
//                 e.target.src = "/placeholder-center.jpg";
//                 e.target.className = "w-full h-64 object-cover bg-gray-200";
//               }}
//             />
//           )}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
//           <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
//             <div>
//               <h1 className="text-3xl font-bold text-white">{center.name}</h1>
//               <div className="flex items-center mt-2">
//                 <div className="flex mr-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       size={20}
//                       fill={star <= center.rating ? "#F59E0B" : "none"}
//                       color="#F59E0B"
//                     />
//                   ))}
//                 </div>
//                 <span className="text-white text-sm">
//                   ({center.ratingCount || 0} reviews)
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLike}
//               className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
//               aria-label={center.isLiked ? "Unlike center" : "Like center"}
//             >
//               <Heart
//                 size={24}
//                 fill={center.isLiked ? "red" : "none"}
//                 color={center.isLiked ? "red" : "currentColor"}
//               />
//               <span className="sr-only">Likes</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Bar */}
//         <div className="grid grid-cols-3 divide-x divide-gray-200 bg-purple-50 text-center py-4">
//           <div className="px-4">
//             <div className="flex items-center justify-center gap-2">
//               <Users className="text-purple-600" size={18} />
//               <span className="font-medium">{stats.students || 0}</span>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Students</p>
//           </div>
//           <div className="px-4">
//             <div className="flex items-center justify-center gap-2">
//               <BookOpen className="text-purple-600" size={18} />
//               <span className="font-medium">{stats.courses || 0}</span>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Courses</p>
//           </div>
//           <div className="px-4">
//             <div className="flex items-center justify-center gap-2">
//               <Star className="text-purple-600" size={18} fill="#F59E0B" />
//               <span className="font-medium">{stats.rating?.toFixed(1) || 0}</span>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Avg Rating</p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Left Column */}
//             <div className="md:col-span-2">
//               <section className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center">
//                   <MapPin className="text-purple-600 mr-2" size={20} />
//                   Location & Contact
//                 </h2>
//                 <div className="space-y-3">
//                   <p className="flex items-start">
//                     <span className="inline-block w-24 text-gray-500">Address:</span>
//                     <span>{center.address}</span>
//                   </p>
//                   <p className="flex items-start">
//                     <span className="inline-block w-24 text-gray-500">Phone:</span>
//                     <span>{center.phone}</span>
//                   </p>
//                   {center.email && (
//                     <p className="flex items-start">
//                       <span className="inline-block w-24 text-gray-500">Email:</span>
//                       <a href={`mailto:${center.email}`} className="text-purple-600 hover:underline">
//                         {center.email}
//                       </a>
//                     </p>
//                   )}
//                   {center.website && (
//                     <p className="flex items-start">
//                       <span className="inline-block w-24 text-gray-500">Website:</span>
//                       <a 
//                         href={center.website.startsWith('http') ? center.website : `https://${center.website}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-purple-600 hover:underline"
//                       >
//                         {center.website}
//                       </a>
//                     </p>
//                   )}
//                   {center.schedule && (
//                     <p className="flex items-start">
//                       <span className="inline-block w-24 text-gray-500">Hours:</span>
//                       <span>{center.schedule}</span>
//                     </p>
//                   )}
//                 </div>
//               </section>

//               <section className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center">
//                   <BookOpen className="text-purple-600 mr-2" size={20} />
//                   Courses Offered
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {center.courses?.length > 0 ? (
//                     center.courses.map(course => (
//                       <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//                         <h3 className="font-medium">{course.name}</h3>
//                         <div className="flex items-center text-sm text-gray-600 mt-2">
//                           <Clock size={14} className="mr-1" />
//                           <span>{course.duration}</span>
//                         </div>
//                         <p className="text-sm mt-2 line-clamp-2">{course.description}</p>
//                         <div className="mt-3 text-sm font-medium text-purple-600">
//                           {course.price ? `$${course.price}` : "Free"}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No courses listed</p>
//                   )}
//                 </div>
//               </section>
//             </div>

//             {/* Right Column */}
//             <div>
//               <section className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4">About This Center</h2>
//                 <div className="prose max-w-none">
//                   {center.description || (
//                     <p className="text-gray-500">No description available</p>
//                   )}
//                 </div>
//               </section>

//               <section className="border-t border-gray-200 pt-6">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center">
//                   <MessageSquare className="text-purple-600 mr-2" size={20} />
//                   Reviews ({comments.length})
//                 </h2>

//                 <form onSubmit={handleCommentSubmit} className="mb-6">
//                   <div className="mb-4">
//                     <textarea
//                       placeholder="Share your experience..."
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <span className="mr-2 text-sm">Your rating:</span>
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <button
//                             key={star}
//                             type="button"
//                             onClick={() => setRating(star)}
//                             className="focus:outline-none"
//                           >
//                             <Star
//                               size={20}
//                               fill={star <= rating ? "#F59E0B" : "none"}
//                               color="#F59E0B"
//                             />
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
//                       disabled={!newComment || rating === 0}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>

//                 <div className="space-y-4">
//                   {comments.length > 0 ? (
//                     comments.map(comment => (
//                       <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
//                         <div className="flex justify-between items-start mb-2">
//                           <h4 className="font-medium">{comment.user?.name || "Anonymous"}</h4>
//                           <div className="flex">
//                             {[1, 2, 3, 4, 5].map(star => (
//                               <Star
//                                 key={star}
//                                 size={16}
//                                 fill={star <= comment.rating ? "#F59E0B" : "none"}
//                                 color="#F59E0B"
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <p className="text-gray-700">{comment.content}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {new Date(comment.createdAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 text-center py-4">No reviews yet. Be the first!</p>
//                   )}
//                 </div>
//               </section>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CenterDetailPage;






import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Star, ChevronLeft, MessageSquare, MapPin, Phone, Mail, Clock, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";

const CenterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    rating: 0
  });

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchCenterData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { 
          Authorization: `Bearer ${token}`,
          signal: controller.signal
        } : { signal: controller.signal };
        
        const [centerRes, commentsRes, statsRes] = await Promise.all([
          axios.get(`http://18.141.233.37:4000/api/centers/${id}`, headers),
          axios.get(`http://18.141.233.37:4000/api/comments?centerId=${id}`, headers),
          axios.get(`http://18.141.233.37:4000/api/centers/${id}/stats`, headers)
        ]);

        if (isMounted) {
          setCenter({
            ...centerRes.data,
            imageUrl: centerRes.data.image 
              ? `http://18.141.233.37:4000/api/image/${centerRes.data.image}`
              : null
          });
          setComments(commentsRes.data || []);
          setStats(statsRes.data || {
            students: 0,
            courses: 0,
            rating: 0
          });
        }
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          setError(err.message);
          toast.error("Failed to load center details");
          navigate("/centers", { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCenterData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, navigate]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to like centers");
        navigate("/login");
        return;
      }

      // Optimistic update
      setCenter(prev => ({
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked
      }));

      await axios.post(
        `http://18.141.233.37:4000/api/centers/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // Revert on error
      setCenter(prev => ({
        ...prev,
        likes: prev.isLiked ? prev.likes + 1 : prev.likes - 1,
        isLiked: !prev.isLiked
      }));
      toast.error(err.response?.data?.message || "Failed to like center");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to post comments");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://18.141.233.37:4000/api/comments",
        { centerId: id, content: newComment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([response.data, ...comments]);
      setNewComment("");
      setRating(0);
      toast.success("Comment posted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post comment");
    }
  };

  const handleRating = async (newRating) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to rate centers");
        navigate("/login");
        return;
      }

      // Optimistic update
      setCenter(prev => ({
        ...prev,
        rating: newRating,
        ratingCount: prev.ratingCount + 1
      }));

      await axios.patch(
        `http://18.141.233.37:4000/api/centers/${id}/rate`,
        { rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Rating submitted");
    } catch (err) {
      // Revert on error
      setCenter(prev => ({
        ...prev,
        rating: prev.rating,
        ratingCount: prev.ratingCount - 1
      }));
      toast.error(err.response?.data?.message || "Failed to submit rating");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Center</h2>
          <p className="mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold mb-4">Center Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
        >
          Back to Centers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <ChevronLeft className="mr-1" /> Back to Centers
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Hero Section */}
        <div className="relative">
          {center.imageUrl ? (
            <img
              src={center.imageUrl}
              alt={center.name}
              className="w-full h-64 sm:h-80 object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-center.jpg';
                e.target.className = 'w-full h-64 sm:h-80 object-cover bg-gray-200';
              }}
            />
          ) : (
            <div className="w-full h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{center.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        fill={star <= Math.round(center.rating) ? "#F59E0B" : "none"}
                        color="#F59E0B"
                      />
                    ))}
                  </div>
                  <span className="text-white/90 text-sm">
                    ({center.ratingCount || 0} reviews)
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLike}
                className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label={center.isLiked ? "Unlike center" : "Like center"}
              >
                <Heart
                  size={24}
                  fill={center.isLiked ? "red" : "none"}
                  color={center.isLiked ? "red" : "currentColor"}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 bg-purple-50 text-center py-4">
          <div className="px-4">
            <div className="flex items-center justify-center gap-2">
              <Users className="text-purple-600" size={18} />
              <span className="font-medium">{stats.students.toLocaleString() || 0}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Students</p>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="text-purple-600" size={18} />
              <span className="font-medium">{stats.courses || 0}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Courses</p>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-center gap-2">
              <Star className="text-purple-600" size={18} fill="#F59E0B" />
              <span className="font-medium">{stats.rating?.toFixed(1) || 0}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Avg Rating</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4">About This Center</h2>
                <div className="prose max-w-none">
                  {center.description || (
                    <p className="text-gray-500 italic">No description available</p>
                  )}
                </div>
              </section>

              {/* Contact Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="text-purple-600 mr-2" size={20} />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin className="text-purple-500 mt-0.5 mr-2" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-500">Address</h3>
                      <p>{center.address || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="text-purple-500 mt-0.5 mr-2" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-500">Phone</h3>
                      <p>{center.phone || "Not specified"}</p>
                    </div>
                  </div>
                  {center.email && (
                    <div className="flex items-start">
                      <Mail className="text-purple-500 mt-0.5 mr-2" size={18} />
                      <div>
                        <h3 className="font-medium text-gray-500">Email</h3>
                        <a 
                          href={`mailto:${center.email}`} 
                          className="text-purple-600 hover:underline break-all"
                        >
                          {center.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {center.website && (
                    <div className="flex items-start">
                      <BookOpen className="text-purple-500 mt-0.5 mr-2" size={18} />
                      <div>
                        <h3 className="font-medium text-gray-500">Website</h3>
                        <a 
                          href={center.website.startsWith('http') ? center.website : `https://${center.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline break-all"
                        >
                          {center.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Courses Section */}
              {center.courses?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <BookOpen className="text-purple-600 mr-2" size={20} />
                    Offered Courses
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {center.courses.map(course => (
                      <div 
                        key={course.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-lg">{course.name}</h3>
                        {course.duration && (
                          <div className="flex items-center text-gray-600 mt-1">
                            <Clock size={14} className="mr-1" />
                            <span className="text-sm">{course.duration}</span>
                          </div>
                        )}
                        {course.description && (
                          <p className="text-gray-700 mt-2 text-sm line-clamp-2">
                            {course.description}
                          </p>
                        )}
                        <div className="mt-3 font-medium text-purple-600">
                          {course.price ? `$${course.price}` : "Free"}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Reviews */}
            <div className="space-y-8">
              <section className="border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MessageSquare className="text-purple-600 mr-2" size={20} />
                  Reviews ({comments.length})
                </h2>

                {/* Review Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <textarea
                      placeholder="Share your experience with this center..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">Your rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={20}
                              fill={star <= rating ? "#F59E0B" : "none"}
                              color="#F59E0B"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                      disabled={!newComment || rating === 0}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div 
                        key={comment.id} 
                        className="border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">
                            {comment.user?.name || "Anonymous"}
                          </h4>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={16}
                                fill={star <= comment.rating ? "#F59E0B" : "none"}
                                color="#F59E0B"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDetailPage;