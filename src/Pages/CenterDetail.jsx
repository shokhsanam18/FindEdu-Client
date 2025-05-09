import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
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
import { useLikedStore, useCommentStore, useAuthStore, useReceptionStore } from "../Store";
import { useTranslation } from "react-i18next";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

const API_BASE = "https://findcourse.net.uz";
const ImageApi = `${API_BASE}/api/image`;

const CenterDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, fetchUserData } = useAuthStore();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);

  const [showReservationModal, setShowReservationModal] = useState(false);
  const [visitDay, setVisitDay] = useState("");
  const [visitHour, setVisitHour] = useState("");
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const { createReception } = useReceptionStore();
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
  const isMobile = useIsMobile();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const centerRes = await axios.get(`${API_BASE}/api/centers/${id}`);
        const centerData = centerRes.data?.data;
        console.log(centerData)

        const majorsRes = await axios.get(`${API_BASE}/api/major/query`);
        const majorsData = majorsRes.data?.data || [];
        console.log(majorsData)

        const filialRes = await axios.get(`${API_BASE}/api/filials`, {
          params: { centerId: centerData.id },
        });
        const filials = filialRes.data?.data || [];
        console.log(filials)

        let dynamicBranches = filials.map((filial) => {
          const regionName = filial.region?.name || `Region ${filial.regionId}`;
          const isMainBranch = filial.name?.toLowerCase().includes("main branch");

          return {
            id: filial.id,
            name: isMainBranch
              ? `${centerData.name} - ${regionName} Main branch`
              : `${centerData.name} - ${regionName} branch`,
            address: filial.address,
            region: filial.region,
          };
        });

        dynamicBranches = [
          ...dynamicBranches.filter((b) => b.name?.toLowerCase().includes("main")),
          ...dynamicBranches.filter((b) => !b.name?.toLowerCase().includes("main")),
        ];

        const comments = centerData.comments || [];
        const avgRating =
          comments.length > 0
            ? comments.reduce((sum, c) => sum + c.star, 0) / comments.length
            : 0;

        setCenter({
          ...centerData,
          rating: avgRating,
          imageUrl: centerData.image ? `${ImageApi}/${centerData.image}` : null,
          majors: centerData.majors || [],
        });

        console.log(centerData)

        setBranches(dynamicBranches);
        setSelectedBranch(dynamicBranches[0]);
        setSelectedMajor(centerData.majors?.[0] || null);

        await fetchCommentsByCenter(id);
        const latestComments = useCommentStore.getState().comments;
        const updatedRating = calculateAverageRating(latestComments);
        setCenter((prev) => ({ ...prev, rating: updatedRating }));
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
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowReservationModal(false);
        setReservationError(null);
        setReservationSuccess(false);
      }
    };

    if (showReservationModal) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showReservationModal]);

  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user && useLikedStore.getState().likedItems.length === 0) {
      fetchLiked();
    }
  }, [user]);

  const handleBranchClick = (branch) => {
    if (branch.id === "main") {
      setSelectedBranch(branch);
    } else {
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
      await postComment({
        text: newComment.text.trimEnd(),
        star: newComment.star,
        centerId: Number(id),
      });
      setNewComment({ text: "", star: 5 });

      await fetchCommentsByCenter(id);
      const latestComments = useCommentStore.getState().comments;
      const updatedRating = calculateAverageRating(latestComments);
      setCenter((prev) => ({ ...prev, rating: updatedRating }));
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
        text: editCommentText.trimEnd(),
        star: editCommentStar,
      });

      await fetchCommentsByCenter(id);
      const latestComments = useCommentStore.getState().comments;
      const updatedRating = calculateAverageRating(latestComments);
      setCenter((prev) => ({ ...prev, rating: updatedRating }));
      cancelEditing();
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const calculateAverageRating = (commentsArray) => {
    if (!commentsArray.length) return 0;
    const total = commentsArray.reduce((sum, c) => sum + c.star, 0);
    return total / commentsArray.length;
  };


  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteComment = async () => {
    try {
      await deleteComment(commentToDelete);
      await fetchCommentsByCenter(id);
      const latestComments = useCommentStore.getState().comments;
      const updatedRating = calculateAverageRating(latestComments);
      setCenter((prev) => ({ ...prev, rating: updatedRating }));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
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

  const PostRegisteration = async (finalVisitDate) => {
    const parsedFilialId = parseInt(selectedBranch?.id, 10);

    const result = await createReception({
      centerId: center.id,
      filialId: Number.isInteger(parsedFilialId) ? parsedFilialId : null,
      majorId: selectedMajor?.id,
      visitDate: `${visitDay}T${visitHour}`,
    });

    console.log("🧾 Submitting reception with:", {
      centerId: center.id,
      filialId: Number.isInteger(parsedFilialId) ? parsedFilialId : null,
      majorId: selectedMajor?.id,
      visitDate: `${visitDay}T${visitHour}`,
    });

    if (result.success) {
      await fetchUserData();
      setReservationSuccess(true);
    } else {
      setReservationError("Failed to register. Please try again.");
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 mt-22 md:mt-20">
      <div className="container mx-auto px-4 mt-8 text-xl">
        <Link
          to="/"
          className="inline-flex items-center text-[#441774] hover:text-purple-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t("centerDetail.backToCenters")}
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row  ">
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex rounded-xl shadow-lg overflow-hidden flex-col md:flex-row w-full bg-white"
          >
            <div className="md:w-2/5 flex flex-col px-4 ">
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
                        <a href={`tel:${center.phone.replace(/\s+/g, '')}`}
                          className="hover:text-purple-500"
                        >
                          {center.phone.replace(/\s+/g, '')}
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
              </div>
            </div>

            <div className="md:w-2/3 p-6 md:p-8">
              <div className="flex flex-col">


                <div className=" bg-white border-t">
                  <h3 className="font-medium text-xl mt-5 mb-3">{t("centerDetail.ourBranches")}</h3>
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
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    {t("centerDetail.availableCourses")}
                  </h2>

                  <div className="gap-2 flex flex-row flex-wrap">
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
                  <div className="mt-5">
                    <button
                      onClick={() => {
                        if (!user || !user?.data?.id) {
                          toast.warning(t("centerDetail.loginToRegister"));
                          return;
                        }
                        setShowReservationModal(true);
                      }}
                      className="px-[20px] py-3 text-lg justify-center bg-[#441774] text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-md"
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      {t("centerDetail.registerForClass")}
                    </button>
                  </div>
                </div>


                <div className="mt-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {t("centerDetail.comments")} ({comments.length})
                  </h2>

                  <form onSubmit={handleCommentSubmit} className="mt-4">
                    <div className="flex flex-col space-y-2">
                      <textarea
                        value={newComment.text}
                        onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit(e);
                          }
                        }}
                        placeholder={t("centerDetail.shareThoughts")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        disabled={isCommenting}
                      />
                      <div className="flex items-center">
                        <span className="mr-2">{t("centerDetail.rating")}</span>
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
                        {isCommenting ? t("centerDetail.posting") : t("centerDetail.postComment")}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 space-y-4">
                    {comments.length === 0 ? (
                      <p className="text-gray-500">{t("centerDetail.noComments")}</p>

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
                                          onClick={() => handleDeleteClick(comment.id)}
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex rounded-xl shadow-lg overflow-hidden flex-col md:flex-row w-full bg-white"
          >
            <div className="md:w-2/5 flex flex-col ">
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

              <div className="p-4 bg-white border-t">
                <h3 className="font-medium text-xl mb-3">{t("centerDetail.ourBranches")}</h3>
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
                  {t("centerDetail.availableCourses")}
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
                        toast.warning(t("centerDetail.loginToRegister"));
                        return;
                      }
                      setShowReservationModal(true);
                    }}
                    className="px-[20px] py-3 text-lg justify-center bg-[#441774] text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-md"
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    {t("centerDetail.registerForClass")}
                  </button>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-6 md:p-8">
              <div className="flex flex-col">
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
                          <a href={`tel:${center.phone.replace(/\s+/g, '')}`}
                            className="hover:text-purple-500"
                          >
                            {center.phone.replace(/\s+/g, '')}
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
                </div>

                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {t("centerDetail.comments")} ({comments.length})
                  </h2>

                  <form onSubmit={handleCommentSubmit} className="mt-4">
                    <div className="flex flex-col space-y-2">
                      <textarea
                        value={newComment.text}
                        onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit(e);
                          }
                        }}
                        placeholder={t("centerDetail.shareThoughts")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        disabled={isCommenting}
                      />
                      <div className="flex items-center">
                        <span className="mr-2">{t("centerDetail.rating")}</span>
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
                        {isCommenting ? t("centerDetail.posting") : t("centerDetail.postComment")}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 space-y-4">
                    {comments.length === 0 ? (
                      <p className="text-gray-500">{t("centerDetail.noComments")}</p>

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
                                          onClick={() => handleDeleteClick(comment.id)}
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
        )}
      </div>

      {showReservationModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowReservationModal(false);
            setReservationError(null);
            setReservationSuccess(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="p-6 bg-[#441774] text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{t("centerDetail.classRegistration")}</h3>
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
                  {t("centerDetail.selectDateTime")}
                </p>
              </div>

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
                      <p className="text-sm font-medium">{t("centerDetail.selectedBranch")}</p>
                      <p className="text-sm text-gray-600">
                        {selectedBranch?.name}, {selectedBranch?.address}
                      </p>
                      <p className="text-sm font-medium mt-2">
                        {t("centerDetail.selectedMajor")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedMajor?.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {t("centerDetail.selectBranch")}
                        </label>                        <select
                          value={selectedBranch?.id}
                          onChange={(e) => {
                            const selected = branches.find((b) => b.id.toString() === e.target.value);
                            setSelectedBranch(selected);
                          }}
                          className="w-full mt-1 px-3 py-2 border rounded-lg"
                        >
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.address}, {branch.region?.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">
                          {t("centerDetail.selectMajor")}
                        </label>                        <select
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
                        <div>
                          <label htmlFor="visitDay" className="block text-sm font-medium text-gray-700 mb-1">
                            {t("centerDetail.selectDate")}
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

                        <div>

                          <label htmlFor="visitHour" className="block text-sm font-medium text-gray-700 mb-1">
                            {t("centerDetail.selectTime")}
                          </label>
                          <select
                            id="visitHour"
                            value={visitHour}
                            onChange={(e) => setVisitHour(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="" disabled={visitHour !== ""}>Select time</option>
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
                          {t("centerDetail.cancel")}
                        </button>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();

                            if (!visitDay || !visitHour) {
                              setReservationError("Please select both a date and a valid 2-hour interval.");
                              return;
                            }

                            setReservationError(null);
                            setIsSubmittingReservation(true);

                            const parsedFilialId = parseInt(selectedBranch?.id, 10);

                            const result = await createReception({
                              centerId: center.id,
                              filialId: Number.isInteger(parsedFilialId) ? parsedFilialId : null,
                              majorId: selectedMajor?.id,
                              visitDate: `${visitDay}T${visitHour}`,
                            });


                            console.log("🧾 Submitting reception with:", {
                              centerId: center.id,
                              filialId: Number.isInteger(parsedFilialId) ? parsedFilialId : null,
                              majorId: selectedMajor?.id,
                              visitDate: `${visitDay}T${visitHour}`,
                            });

                            setIsSubmittingReservation(false);

                            if (result.success) {
                              await fetchUserData();
                              setReservationSuccess(true);
                            } else {
                              setReservationError("Failed to register. Please try again.");
                            }
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

      <Dialog open={deleteDialogOpen} handler={() => setDeleteDialogOpen(false)}>
        <DialogHeader>Delete Comment</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to delete this comment? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteDialogOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmDeleteComment}
            className="flex items-center bg-red-500 gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default CenterDetail;
