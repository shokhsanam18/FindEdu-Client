import { useEffect, useState } from "react";
import { useLikedStore, useSearchStore, useAuthStore } from "../Store";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import {
  HeartIcon as HeartOutline,
  HeartIcon as HeartSolid,
} from "@heroicons/react/24/solid";
import { useTranslation } from 'react-i18next';

const ImageApi = "https://findcourse.net.uz/api/image";

const Favorites = () => {
  const { isLiked, toggleLike, fetchLiked } = useLikedStore();
  const [allCenters, setAllCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchLikedCenters = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token || !userId) {
        setAllCenters([]);
        setLoading(false);
        return;
      }

      const res = await axios.get("https://findcourse.net.uz/api/liked/query", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const likedData = res.data?.data || [];
      const userLikes = likedData.filter((like) => like.userId === userId);

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
            return null;
          }
        })
      );

      setAllCenters(centerDetails.filter(Boolean));
    } catch (err) {
      console.error("Error fetching liked centers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const authState = useAuthStore.getState();
      if (!authState.user?.data?.id) {
        await authState.fetchUserData();
      }

      const updatedUser = useAuthStore.getState().user;

      if (updatedUser?.data?.id) {
        await fetchLiked();
        await fetchLikedCenters(updatedUser.data.id);
      } else {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleLikeToggle = async (centerId) => {
    await toggleLike(centerId);
    const currentUser = useAuthStore.getState().user;
    await fetchLikedCenters(currentUser?.data?.id);
  };

  const filteredFavorites = allCenters.filter((center) => {
    if (!center) return false;
    const term = searchTerm.toLowerCase();
    return (
      center.name?.toLowerCase().includes(term) ||
      center.address?.toLowerCase().includes(term) ||
      center.majors?.some((major) =>
        major.name?.toLowerCase().includes(term)
      )
    );
  });

  return (
    <div>
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
          <p className="text-lg md:text-xl mt-6 md:mt-0 font-light">
            {t("favorites.hero.subtitle")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 md:mt-4 bg-clip-text text-[#34115a]">
            {t("favorites.hero.title")}
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex gap-2 ml-6 md:mr-10 text-xl mt-4 md:mt-0"
        >
          <Link to="/" className="hover:underline text-white">{t("favorites.hero.homeLink")}</Link>
          <span>|</span>
          <Link to="/favorites" className="hover:underline text-[#2d0e4e]">  {t("favorites.hero.favoritesLink")}</Link>
        </motion.div>
      </motion.div>

      <div className="min-h-[150px] py-10 mx-auto flex flex-col px-[5%] mb-1 mt-10">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600 text-lg"> {t("favorites.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {filteredFavorites.map((center) => (
              <motion.div
                key={center.id}
                className="w-full max-w-sm overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/centers/${center.id}`} onClick={() => window.scrollTo(0, 0)}>
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
                      onClick={(e) => {
                        e.preventDefault();
                        handleLikeToggle(center.id);
                      }}
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
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${center.phone}`;
                          }}
                          className="cursor-pointer"
                        >
                          {center.phone || "+1 (555) 123-4567"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;