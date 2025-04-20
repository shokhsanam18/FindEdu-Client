// src/pages/Favorites.jsx

import { useEffect, useState } from "react";
import { useLikedStore, useSearchStore, useAuthStore } from "../Store";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import {
  HeartIcon as HeartOutline,
  HeartIcon as HeartSolid,
} from "@heroicons/react/24/solid";

const ImageApi = "https://findcourse.net.uz/api/image";

const Favorites = () => {
  const { isLiked, toggleLike, fetchLiked } = useLikedStore();
  const [allCenters, setAllCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const user = useAuthStore((state) => state.user);

  // 🧠 Function that now takes userId directly
  const fetchLikedCenters = async (userId) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token || !userId) {
        console.warn("⛔ No token or user ID, skipping fetch");
        setAllCenters([]);
        setLoading(false); // 🔧 Critical to avoid infinite spinner
        return;
      }

      const res = await axios.get("https://findcourse.net.uz/api/liked/query", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const likedData = res.data?.data || [];
      console.log("✅ Raw liked response from backend:", likedData);

      const userLikes = likedData.filter((like) => like.userId === userId);
      console.log("🔐 Filtered likes for user:", userLikes);

      const centerDetails = await Promise.all(
        userLikes.map(async (like) => {
          try {
            const res = await axios.get(
              `https://findcourse.net.uz/api/centers/${like.centerId}`
            );
            const center = res.data?.data;
            const avgRating =
              center.comments?.length > 0
                ? center.comments.reduce((sum, c) => sum + c.star, 0) / center.comments.length
                : 0;

            return {
              ...center,
              imageUrl: center.image ? `${ImageApi}/${center.image}` : null,
              rating: avgRating,
            };
          } catch (err) {
            console.error("❌ Error fetching center:", err);
            return null;
          }
        })
      );

      setAllCenters(centerDetails.filter(Boolean));
    } catch (err) {
      console.error("🚨 Error in fetchLikedCenters:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user and centers on mount
  useEffect(() => {
    const fetchAll = async () => {
      const authState = useAuthStore.getState();

      // 👇 Fetch user if not already loaded
      if (!authState.user?.data?.id) {
        await authState.fetchUserData();
      }

      const updatedUser = useAuthStore.getState().user;
      console.log("🧑🏻 User in store:", updatedUser);

      if (updatedUser?.data?.id) {
        await fetchLiked();
        await fetchLikedCenters(updatedUser.data.id);
      } else {
        console.warn("⚠️ Still no user after fetchUserData");
        setLoading(false); // don't forget this
      }
    };

    fetchAll();
  }, []);

  const handleLikeToggle = async (centerId) => {
    console.log("🔘 Toggling like for centerId:", centerId);
    await toggleLike(centerId);
    const currentUser = useAuthStore.getState().user;
    await fetchLikedCenters(currentUser?.data?.id);
  };

  const filteredFavorites = allCenters.filter((center) => {
    if (!center) return false;
    const term = searchTerm.toLowerCase();
    const nameMatch = center.name?.toLowerCase().includes(term);
    const addressMatch = center.address?.toLowerCase().includes(term);
    const majorMatch = center.majors?.some((major) =>
      major.name?.toLowerCase().includes(term)
    );
    return nameMatch || addressMatch || majorMatch;
  });

  return (
    <div className="mt-50 mb-20 mx-auto flex flex-col px-[5%]">
      <h1 className="text-4xl font-bold text-[#451774] text-center mb-12">
        Your Favorite Centers
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : allCenters.length === 0 ? (
        <p>You haven't liked any centers yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((center) => (
            <motion.div
              key={center.id}
              className="w-full max-w-sm overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-48 overflow-hidden">
                {center.imageUrl ? (
                  <img
                    className="w-full h-full object-cover"
                    src={center.imageUrl}
                    alt={center.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.classList.add("bg-gray-100");
                    }}
                  />
                ) : (
                  <div className="h-full bg-gray-100 flex items-center justify-center">
                    <MapPinIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}

                <motion.button
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLikeToggle(center.id)}
                >
                  {isLiked(center.id) ? (
                    <HeartSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartOutline className="h-5 w-5 text-red-500" />
                  )}
                </motion.button>
              </div>

              <div className="px-4 py-7 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold truncate">
                    {center.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="relative w-5 h-5">
                      <StarIcon className="absolute text-gray-300 w-5 h-5" />
                      <div
                        className="absolute overflow-hidden h-5"
                        style={{ width: `${(center.rating / 5) * 100}%` }}
                      >
                        <StarIcon className="text-yellow-500 w-5 h-5 fill-yellow-500" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {center.rating?.toFixed(1) || "4.8"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-1">
                  {center.address}
                </p>

                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{center.phone || "+1 (555) 123-4567"}</span>
                  </div>
                  <Link
                    to={`/centers/${center.id}`}
                    className="text-sm font-medium text-purple-800 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;