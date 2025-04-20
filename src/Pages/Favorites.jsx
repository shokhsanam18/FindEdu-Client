import { useEffect, useState } from "react";
import { useLikedStore, useSearchStore } from "../Store";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Star, Loader2 } from "lucide-react";
import { Heart as HeartSolid } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "https://findcourse.net.uz";
const ImageApi = `${API_BASE}/api/image`;

const Favorites = () => {
  const {
    likedItems,
    isLiked,
    toggleLike,
    loading: likesLoading,
  } = useLikedStore();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchTerm = useSearchStore((state) => state.searchTerm);

  useEffect(() => {
    const fetchLikedCenters = async () => {
      try {
        setLoading(true);

        if (likedItems.length === 0) {
          setCenters([]);
          return;
        }

        // Fetch all liked centers details
        const centersData = await Promise.all(
          likedItems.map(async (item) => {
            try {
              const res = await axios.get(
                `${API_BASE}/api/centers/${item.centerId}`
              );
              const center = res.data?.data;

              // Calculate average rating
              const comments = center.comments || [];
              const avgRating =
                comments.length > 0
                  ? comments.reduce((sum, c) => sum + c.star, 0) /
                    comments.length
                  : 0;

              return {
                ...center,
                imageUrl: center.image ? `${ImageApi}/${center.image}` : null,
                rating: avgRating,
              };
            } catch (err) {
              console.error(`Failed to fetch center ${item.centerId}`, err);
              return null;
            }
          })
        );

        // Filter out any failed requests
        setCenters(centersData.filter((center) => center !== null));
      } catch (err) {
        console.error("Failed to fetch liked centers", err);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedCenters();
  }, [likedItems]);

  const handleLikeToggle = async (centerId) => {
    try {
      await toggleLike(centerId);

      if (isLiked(centerId)) {
        setCenters((prev) => prev.filter((center) => center.id !== centerId));
      }
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  const filteredFavorites = centers.filter((center) => {
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
    <div className="mt-20 mb-20 mx-auto flex flex-col px-[5%]">
      <h1 className="text-4xl font-bold text-[#451774] text-center mb-12">
        Your Favorite Centers
      </h1>

      {loading || likesLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="animate-spin h-12 w-12 text-purple-500" />
        </div>
      ) : centers.length === 0 ? (
        <div className="text-center py-12">
          <HeartSolid className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg text-gray-600">
            You haven't liked any centers yet.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium"
          >
            Browse Centers
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            No favorites match your search.
          </p>
        </div>
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
                    <MapPin className="h-10 w-10 text-gray-400" />
                  </div>
                )}

                <motion.button
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLikeToggle(center.id)}
                >
                  <HeartSolid
                    className={`h-5 w-5 ${
                      isLiked(center.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </motion.button>
              </div>

              <div className="px-4 py-7 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold truncate">
                    {center.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="relative w-5 h-5">
                      <Star className="absolute text-gray-300 w-5 h-5" />
                      <div
                        className="absolute overflow-hidden h-5"
                        style={{ width: `${(center.rating / 5) * 100}%` }}
                      >
                        <Star className="text-yellow-500 w-5 h-5 fill-yellow-500" />
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
                    <Phone className="h-4 w-4" />
                    <span>{center.phone || "Not provided"}</span>
                  </div>
                  <Link
                    to={`/centers/${center.id}`}
                    className="text-sm font-medium text-purple-800 hover:underline"
                  >
                    View Details
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
