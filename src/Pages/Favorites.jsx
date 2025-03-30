// src/pages/Favorites.jsx

import { useEffect, useState } from "react";
import { useLikedStore  } from "../Store"; // or where your favorite store is
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import {
  HeartIcon as HeartOutline,
  HeartIcon as HeartSolid,
} from "@heroicons/react/24/solid"; // or outline if needed


const CentersApi = "http://18.141.233.37:4000/api/centers";
const ImageApi = "http://18.141.233.37:4000/api/image";

const Favorites = () => {
  const { likedItems, isLiked, toggleLike, fetchLiked } = useLikedStore();
  const [allCenters, setAllCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiked();
  }, []);

  useEffect(() => {
    const fetchLikedCenters = async () => {
      try {
        setLoading(true);
        await fetchLiked(); // fetch likedItems first
  
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://18.141.233.37:4000/api/liked/query", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const likedData = res.data?.data || [];
  
        // Get detailed info for liked centers
        const centerDetails = await Promise.all(
          likedData.map(async (like) => {
            const res = await axios.get(`http://18.141.233.37:4000/api/centers/${like.centerId}`);
            const center = res.data?.data;
            return {
              ...center,
              imageUrl: center.image ? `${ImageApi}/${center.image}` : null,
            };
          })
        );
  
        setAllCenters(centerDetails);
      } catch (err) {
        console.error("Failed to fetch liked centers", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLikedCenters();
  }, []);

  // const favoriteCenters = allCenters.filter((center) =>
  //   isLiked(center.id)
  // );

  return (
    <div className="mt-40 mb-20 mx-auto flex flex-col px-[5%]">
      <h1 className="text-3xl font-bold text-[#451774] text-center mb-6">Your Favorite Centers</h1>

      {loading ? (
        <p>Loading...</p>
      ) : allCenters.length === 0 ? (
        <p>You haven’t liked any centers yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCenters.map((center) => (
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
                  onClick={() => toggleLike(center.id)}
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
                  <h3 className="text-xl font-semibold truncate">{center.name}</h3>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {center.rating?.toFixed(1) || "4.8"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-1">{center.address}</p>

                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{center.phone || "+1 (555) 123-4567"}</span>
                  </div>
                  <Link
                    to={`/centers/${center.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
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
