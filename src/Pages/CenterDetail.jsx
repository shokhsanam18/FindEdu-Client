import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import {
  MapPin,
  Star,
  Phone,
  ArrowLeft,
  Heart,
  MessageSquare,
  User,
  Calendar,
  Trash2,
  BookOpen,
  GraduationCap,
  Clock,
  Users,
  Globe,
  X,
  ChevronDown,
  Briefcase,
  Bookmark,
  PencilLine,
} from "lucide-react";
import { useLikedStore, useCommentStore, useAuthStore } from "../Store";

const API_BASE = "https://findcourse.net.uz";
const ImageApi = `${API_BASE}/api/image`;

const CenterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [branches, setBranches] = useState([]);
  const [majors, setMajors] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);

  // Registration modal state
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitDay, setVisitDay] = useState(""); // YYYY-MM-DD
  const [visitHour, setVisitHour] = useState(""); // HH:MM
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const { toggleLike, isLiked, fetchLiked } = useLikedStore();
  const liked = isLiked(Number(id));

  const {
    comments,
    fetchCommentsByCenter,
    postComment,
    updateComment,
    deleteComment,
    loading: commentLoading,
    error: commentError,
  } = useCommentStore();

  const [newComment, setNewComment] = useState({ text: "", star: 5 });
  const [isCommenting, setIsCommenting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentStar, setEditCommentStar] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch center
        const centerRes = await axios.get(`${API_BASE}/api/centers/${id}`);
        const centerData = centerRes.data?.data;
        console.log(centerData)

        // Fetch majors
        const majorsRes = await axios.get(`${API_BASE}/api/major/query`);
        const majorsData = majorsRes.data?.data || [];
        console.log(majorsData)

        // Fetch branches (filials)
        const filialRes = await axios.get(`${API_BASE}/api/filials`, {
          params: { centerId: centerData.id },
        });
        const filials = filialRes.data?.data || [];
        console.log(filials)

        // Construct dynamic branch list
        const dynamicBranches = [
          {
            id: "main",
            name: "Main Branch",
            address: centerData.address,
          },
          ...filials.map((filial) => ({
            id: filial.id,
            name: filial.region?.name || `Region ${filial.regionId}`,
            address: filial.address,
          })),
        ];

        // Calculate avg rating
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

        console.log(centerData)

        setBranches(dynamicBranches);
        setSelectedBranch(dynamicBranches[0]);
        setMajors(majorsData);
        setSelectedMajor(majorsData[0]);

        await fetchCommentsByCenter(id);
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

  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user && useLikedStore.getState().likedItems.length === 0) {
      fetchLiked();
    }
  }, [user]);

  const handleBranchClick = (branch) => {
    if (branch.id === "main") {
      // If it's the main branch, stay on the same page
      setSelectedBranch(branch);
    } else {
      // Navigate to the branch detail page
      navigate(`/branches/${branch.id}`);
    }
  };
  const isValidTwoHourInterval = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.getMinutes() === 0 && date.getHours() % 2 === 0;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.text.trim()) return;

    setIsCommenting(true);
    try {
      await postComment({ ...newComment, centerId: Number(id) });
      setNewComment({ text: "", star: 5 });
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!editCommentText.trim()) return;
    try {
      await updateComment({
        id: editingCommentId,
        text: editCommentText,
        star: editCommentStar,
      });
      cancelEditing();
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text || comment.content);
    setEditCommentStar(comment.star);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText("");
    setEditCommentStar(5);
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h3 className="font-bold">Error Loading Center</h3>
          <p>{error}</p>
          <p className="mt-2 text-sm">You will be redirected shortly...</p>
        </div>
        <Link
          to="/"
          className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
        >
          <ArrowLeft className="h-5 w-5 inline mr-1" />
          Back to Home
        </Link>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-xl">Center not found</div>
      </div>
    );
  }

  const PostRegisteration = (finalVisitDate) => {
    const existingData = JSON.parse(localStorage.getItem("RegisterData")) || [];

    const newRegister = {
      id: id,
      branch: selectedBranch.name,
      address: center.address,
      majorId: selectedMajor.id,
      majorName: center.name,
      visitDate: finalVisitDate, // <-- now using correct value
    };

    const index = existingData.findIndex((item) => item.id === id);

    if (index !== -1) {
      existingData[index] = newRegister;
    } else {
      existingData.push(newRegister);
    }

    localStorage.setItem("RegisterData", JSON.stringify(existingData));
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-22 md:mt-20">
      {/* Back button */}
      <div className="container mx-auto px-4 mt-8 text-xl">
        <Link
          to="/"
          className="inline-flex items-center text-[#441774] hover:text-purple-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Centers
        </Link>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row  ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex rounded-xl shadow-lg overflow-hidden flex-col md:flex-row w-full bg-white"
        >
          {/* Left column with image and branches */}
          <div className="md:w-2/5 flex flex-col ">
            {/* Center image */}
            <div className="relative w-full h-64 sm:h-100 overflow-hidden">
              {center.imageUrl ? (
                <img
                  src={center.imageUrl}
                  alt={center.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.classList.add("bg-gray-200");
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-gray-400" />
                </div>
              )}

              <motion.button
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLike(Number(id))}
              >
                {liked ? (
                  <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="h-6 w-6 text-red-500" />
                )}
              </motion.button>
            </div>

            {/* Branches section */}
            <div className="p-4 bg-white border-t">
              <h3 className="font-medium text-xl mb-3">Our Branches</h3>
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors  ${selectedBranch?.id === branch.id
                        ? "bg-purple-100 border border-purple-300"
                        : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    onClick={() => handleBranchClick(branch)}
                  >
                    <h4 className="font-medium">{branch.name}</h4>
                    <p className="text-sm text-gray-600">{branch.address}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 mb-10">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6 px-5">
                <GraduationCap className="h-5 w-5 mr-2" />
                Available Courses
              </h2>

              <div className="gap-2 px-5 flex flex-row flex-wrap">
                {center.majors.map(
                  (major) =>
                    major.name.length > 0 && (
                      <motion.div
                        key={major.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${selectedMajor?.id === major.id
                            ? "ring-2 ring-purple-500"
                            : ""
                          }`}
                        onClick={() => setSelectedMajor(major)}
                      >
                        <div className="p-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg text-purple-600">
                              <Bookmark className="h-4 w-4" />
                            </div>
                            <div className="ml-2 flex-1 cursor-pointer">
                              <h3 className="text-lg font-semibold text-gray-900 mr-1">
                                {major.name}
                              </h3>
                              <p className="mt-1 text-gray-600">
                                {major.description || ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                )}
              </div>
              <div className="mt-5 px-5">
                <button
                  onClick={() => {
                    if (!user || !user?.data?.id) {
                      toast.warning("Please login to register for a class.");
                      return;
                    }
                    setShowReservationModal(true);
                  }}
                  className="px-[20px] py-3 text-lg justify-center bg-[#441774] text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-md"
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Register for a Class
                </button>
              </div>
            </div>
          </div>

          {/* Right column with details */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex flex-col">
              {/* Main info */}
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {center.name}
                  </h1>
                  <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-medium">
                      {center.rating?.toFixed(1) || "4.8"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{center.address}</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-lg font-medium flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      {center.phone ? (
                        <a
                          href={`tel:${center.phone.replace(/[^\d+]/g, "")}`}
                          className="hover:text-purple-500"
                        >
                          {center.phone}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                  {center.website && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Website
                      </h3>
                      <a
                        href={center.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-lg font-medium text-purple-600 hover:underline"
                      >
                        {center.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900">About</h2>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {center.description ||
                      "No description available for this center."}
                  </p>
                </div>
              </div>

              {/* Comments section */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments ({comments.length})
                </h2>

                {/* Comment form */}
                <form onSubmit={handleCommentSubmit} className="mt-4">
                  <div className="flex flex-col space-y-2">
                    <textarea
                      value={newComment.text}
                      onChange={(e) =>
                        setNewComment({ ...newComment, text: e.target.value })
                      }
                      placeholder="Share your thoughts about this center..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      disabled={isCommenting}
                    />
                    <div className="flex items-center">
                      <span className="mr-2">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewComment({ ...newComment, star })}
                          className="focus:outline-none "
                        >
                          <Star
                            className={`h-5 w-5 ${star <= newComment.star
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                    {commentError && (
                      <p className="text-red-500 text-sm">{commentError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={!newComment.text.trim() || isCommenting}
                      className="self-end px-4 py-2 bg-[#441774] text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
                    >
                      {isCommenting ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>

                {/* Comments list */}
                <div className="mt-6 space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-500">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    comments
                      .slice()
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editCommentText}
                                onChange={(e) =>
                                  setEditCommentText(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                rows={3}
                              />
                              <div className="flex items-center">
                                <span className="mr-2">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() => setEditCommentStar(star)}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`h-5 w-5 ${star <= editCommentStar
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                        }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleUpdateComment}
                                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="flex items-center flex-wrap gap-2">
                                  <User className="h-5 w-5 text-gray-400" />
                                  <span className="font-medium text-sm sm:text-base break-words max-w-full">
                                    {comment.user?.firstName &&
                                      comment.user?.lastName
                                      ? `${comment.user.firstName} ${comment.user.lastName}`
                                      : "Anonymous"}
                                  </span>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < comment.star
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-gray-300"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 flex-shrink-0" />
                                  <span className="whitespace-nowrap">
                                    {new Date(
                                      comment.createdAt ||
                                      comment.updatedAt ||
                                      Date.now()
                                    ).toLocaleDateString()}
                                  </span>
                                  {user?.data?.id === comment.user?.id && (
                                    <div className="flex items-center gap-2 ml-1">
                                      <button
                                        onClick={() =>
                                          startEditingComment(comment)
                                        }
                                        className="text-blue-500 hover:text-blue-700 whitespace-nowrap "
                                      >
                                        <PencilLine className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="mt-2 text-gray-700 text-sm sm:text-base break-words">
                                {comment.text || comment.content}
                              </p>
                            </>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Registration Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="relative">
              {/* Modal header */}
              <div className="p-6 bg-[#441774] text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Class Registration</h3>
                  <button
                    onClick={() => {
                      setShowReservationModal(false);
                      setReservationError(null);
                      setReservationSuccess(false);
                    }}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="mt-1 text-sm opacity-90">
                  Select your preferred date and time
                </p>
              </div>

              {/* Modal body */}
              <div className="p-6">
                {reservationSuccess ? (
                  <div className="text-center py-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Registration Confirmed!
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Your class has been scheduled for{" "}
                      {new Date(`${visitDay}T${visitHour}`).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, 
                      })}
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Selected Branch:</p>
                      <p className="text-sm text-gray-600">
                        {selectedBranch?.name}, {selectedBranch?.address}
                      </p>
                      <p className="text-sm font-medium mt-2">
                        Selected Major:
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedMajor?.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="space-y-6">
                      {/* Branch Dropdown */}
                      <div>
                        <label className="text-sm font-medium text-gray-700">Select Branch</label>
                        <select
                          value={selectedBranch?.id}
                          onChange={(e) => {
                            const selected = branches.find((b) => b.id.toString() === e.target.value);
                            setSelectedBranch(selected);
                          }}
                          className="w-full mt-1 px-3 py-2 border rounded-lg"
                        >
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}, {branch.address}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Major Dropdown */}
                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">Select Major</label>
                        <select
                          value={selectedMajor?.id}
                          onChange={(e) => {
                            const selected = center.majors.find((m) => m.id.toString() === e.target.value);
                            setSelectedMajor(selected);
                          }}
                          className="w-full mt-1 px-3 py-2 border rounded-lg"
                        >
                          {center.majors.map((major) => (
                            <option key={major.id} value={major.id}>
                              {major.name}
                            </option>
                          ))}
                        </select>
                      </div>


                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date Picker */}
                        <div>
                          <label htmlFor="visitDay" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Date
                          </label>
                          <input
                            type="date"
                            id="visitDay"
                            value={visitDay}
                            onChange={(e) => setVisitDay(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>

                        {/* Time Picker */}
                        <div>
                          <label htmlFor="visitHour" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Time (Every 2 hrs)
                          </label>
                          <select
                            id="visitHour"
                            value={visitHour}
                            onChange={(e) => setVisitHour(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="">Select time</option>
                            {[10, 12, 14, 16, 18].map((hour) => {
                              const formatted = hour.toString().padStart(2, "0");
                              return (
                                <option key={formatted} value={`${formatted}:00`}>
                                  {formatted}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {reservationError && (
                        <div className="text-red-500 text-sm text-center py-2">
                          {reservationError}
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReservationModal(false);
                            setReservationError(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();

                            if (!visitDay || !visitHour) {
                              setReservationError("Please select both a date and a valid 2-hour interval.");
                              return;
                            }

                            const combinedDateTime = `${visitDay}T${visitHour}`;
                            setReservationError(null);

                            // Pass directly to PostRegisteration
                            PostRegisteration(combinedDateTime);

                            setReservationSuccess(true);
                          }}
                          type="submit"
                          disabled={isSubmittingReservation || !visitDay || !visitHour}
                          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#441774] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-colors"
                        >
                          {isSubmittingReservation ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                            </>
                          ) : (
                            "Confirm Registration"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CenterDetail;
