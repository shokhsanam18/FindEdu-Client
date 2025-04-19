// src/pages/Favorites.jsx

import { useEffect, useState } from "react";
import { useLikedStore, useSearchStore } from "../Store";
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
  const { likedItems, isLiked, toggleLike, fetchLiked } = useLikedStore();
  const [allCenters, setAllCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchTerm = useSearchStore((state) => state.searchTerm);

  useEffect(() => {
    fetchLiked();
  }, []);

  useEffect(() => {
    const fetchLikedCenters = async () => {
      try {
        setLoading(true);
        await fetchLiked(); // Ensure we have the latest liked items

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setAllCenters([]);
          return;
        }

        const res = await axios.get(
          "https://findcourse.net.uz/api/liked/query",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const likedData = res.data?.data || [];

        // Get detailed info for liked centers
        const centerDetails = await Promise.all(
          likedData.map(async (like) => {
            try {
              const res = await axios.get(
                `https://findcourse.net.uz/api/centers/${like.centerId}`
              );
              const center = res.data?.data;
              const avgRating =
                center.comments?.length > 0
                  ? center.comments.reduce((sum, c) => sum + c.star, 0) /
                    center.comments.length
                  : 0;
              return {
                ...center,
                imageUrl: center.image ? `${ImageApi}/${center.image}` : null,
                rating: avgRating,
              };
            } catch (err) {
              console.error("Failed to fetch center details", err);
              return null;
            }
          })
        );

        // Filter out any null values from failed requests
        setAllCenters(centerDetails.filter(center => center !== null));
      } catch (err) {
        console.error("Failed to fetch liked centers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedCenters();
  }, [fetchLiked]);

  const handleLikeToggle = async (centerId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      if (isLiked(centerId)) {
        // Unlike the center
        await axios.delete(
          `https://findcourse.net.uz/api/liked/${centerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Like the center
        await axios.post(
          `https://findcourse.net.uz/api/liked/${centerId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Toggle in local state
      toggleLike(centerId);

      // Update the centers list by removing the unliked center
      setAllCenters(prev => 
        isLiked(centerId) 
          ? prev.filter(center => center.id !== centerId)
          : prev
      );
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
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