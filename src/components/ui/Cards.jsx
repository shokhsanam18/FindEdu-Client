import { useEffect, useState } from "react";
import {
  ChevronDown,
  MapPinIcon,
  StarIcon,
  ArrowRight,
  PhoneIcon,
  X,
} from "lucide-react";
import axios from "axios";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import home from "/public/home.png";
import { Link } from "react-router-dom";
import { useLikedStore, useSearchStore } from "../../Store.jsx";
const MajorsApi = "https://findcourse.net.uz/api/major";
const RegionsApi = "https://findcourse.net.uz/api/regions/search";
const CentersApi = "https://findcourse.net.uz/api/centers";
const ImageApi = "https://findcourse.net.uz/api/image";

const Modal = ({
  isOpen,
  onClose,
  onSave,
  selectedMajors,
  setSelectedMajors,
  selectedRegions,
  setSelectedRegions,
  majors,
  regions,
}) => {
  const handleMajorSelect = (majorId) => {
    setSelectedMajors((prev) =>
      prev.includes(majorId)
        ? prev.filter((id) => id !== majorId)
        : [...prev, majorId]
    );
  };

  const handleRegionSelect = (regionId) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[800px] max-h-[80vh] overflow-y-auto px-8 py-8 bg-[#9B7AAB] text-white border border-[#6A4D7C] rounded-xl shadow-2xl z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-1">
            <label className="text-3xl font-semibold mb-4 text-[#F1F1F1]">
              Select Majors
            </label>
            <form className="text-lg flex flex-wrap gap-4">
              {majors.map((major) => (
                <label key={major.id} className="flex items-center gap-3 w-1/2">
                  <input
                    type="checkbox"
                    value={major.id}
                    checked={selectedMajors.includes(major.id)}
                    onChange={() => handleMajorSelect(major.id)}
                    className="w-5 h-5 accent-[#6A4D7C] transition-transform transform hover:scale-110"
                  />
                  <span className="text-lg">{major.name}</span>
                </label>
              ))}
            </form>
          </div>
          <div className="flex-1">
            <label className="text-3xl font-semibold mt-5 mb-4 text-[#F1F1F1]">
              Select Regions
            </label>
            <form className="text-lg flex flex-wrap gap-4">
              {regions.map((region) => (
                <label
                  key={region.id}
                  className="flex items-center gap-3 w-1/2"
                >
                  <input
                    type="checkbox"
                    value={region.id}
                    checked={selectedRegions.includes(region.id)}
                    onChange={() => handleRegionSelect(region.id)}
                    className="w-5 h-5 accent-[#6A4D7C] transition-transform transform hover:scale-110"
                  />
                  <span className="text-lg">{region.name}</span>
                </label>
              ))}
            </form>
          </div>
        </div>
        <div className="flex justify-center md:justify-between mt-8 gap-4">
          <button
            className="bg-[#7E4B99] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#6D3E85] transition duration-300 w-full md:w-auto"
            onClick={() => {
              onSave();
              onClose();
            }}
          >
            OK
          </button>
          <button
            className="bg-[#D08CBB] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#B476A6] transition duration-300 w-full md:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const Cards = () => {
  const [majors, setMajors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [allCenters, setAllCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  // const [likedCenters, setLikedCenters] = useState([]);
  const { toggleLike, isLiked, fetchLiked } = useLikedStore();
  useEffect(() => {
    fetchLiked(); // ← make sure likes are ready before rendering
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [majorsResponse, regionsResponse, centersResponse] =
          await Promise.all([
            axios.get(MajorsApi),
            axios.get(RegionsApi),
            axios.get(CentersApi),
          ]);

        setMajors(majorsResponse.data.data || []);
        setRegions(regionsResponse.data.data || []);

        const processedCenters =
          centersResponse.data.data?.map((center) => {
            const comments = center.comments || [];
            const avgRating =
              comments.length > 0
                ? comments.reduce((sum, c) => sum + c.star, 0) / comments.length
                : 0;

            return {
              ...center,
              imageUrl: center.image ? `${ImageApi}/${center.image}` : null,
              rating: avgRating,
            };
          }) || [];

        setAllCenters(processedCenters);
        setFilteredCenters(processedCenters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const filteredCenters = centers.filter((center) => {
  //   const term = searchTerm.toLowerCase();
  //   const nameMatch = center.name?.toLowerCase().includes(term);
  //   const addressMatch = center.address?.toLowerCase().includes(term);
  //   const majorMatch = center.majors?.some((major) =>
  //     major.name?.toLowerCase().includes(term)
  //   );
  //   return nameMatch || addressMatch || majorMatch;
  // });
  useEffect(() => {
    let filtered = allCenters;

    // ---------- FILTER BY MAJOR
    if (selectedMajors.length > 0) {
      filtered = filtered.filter((center) =>
        center.majors?.some((major) => selectedMajors.includes(major.id))
      );
    }

    //---------------------- FILTER BY REGION
    if (selectedRegions.length > 0) {
      filtered = filtered.filter((center) =>
        selectedRegions.includes(center.regionId)
      );
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((center) => {
        const nameMatch = center.name?.toLowerCase().includes(term);
        const addressMatch = center.address?.toLowerCase().includes(term);
        const majorMatch = center.majors?.some((major) =>
          major.name?.toLowerCase().includes(term)
        );
        return nameMatch || addressMatch || majorMatch;
      });
    }

    setFilteredCenters(filtered);
  }, [selectedMajors, selectedRegions, searchTerm, allCenters]);

  // const toggleLike = (centerId) => {
  //   setLikedCenters((prev) =>
  //     prev.includes(centerId)
  //       ? prev.filter((id) => id !== centerId)
  //       : [...prev, centerId]
  //   );
  // };

  const removeMajorFilter = (majorId) => {
    setSelectedMajors((prev) => prev.filter((id) => id !== majorId));
  };

  const removeRegionFilter = (regionId) => {
    setSelectedRegions((prev) => prev.filter((id) => id !== regionId));
  };

  const getMajorName = (id) => majors.find((m) => m.id === id)?.name || id;
  const getRegionName = (id) => regions.find((r) => r.id === id)?.name || id;

  return (
    <div className="mb-16 mt-36">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative py-25 flex items-center justify-center bg-cover bg-center mb-15 -z-20"
        style={{ backgroundImage: `url(${home})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative  mx-auto flex flex-col md:flex-row items-center  text-white">
          <div className="md:w-1/2 text-center md:text-left lg:pl-10">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl font-bold mt-2 leading-tight"
            >
              Empowering Students, <br /> One Search at a Time.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-gray-300 mt-4"
            >
              We help students discover the best courses, universities, and
              learning opportunities worldwide. With expert insights and real
              student reviews, we make your education journey effortless.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Filter controls */}
      <div className="flex flex-row ml-20 gap-4">
        <div className="flex flex-col gap-3">
          <div className="text-left">
            <h3 className="text-xl font-medium text-[#461773] mb-1">
              Find Your Program
            </h3>
            <p className="text-sm text-gray-600">Select course and region</p>
            <button
              className=" mt-5 group inline-flex items-center justify-center gap-2 bg-[#461773] hover:bg-[#3a1260] text-white font-medium px-6 py-2.5 rounded-xl border border-[#5e1b9e] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(90,29,153,0.2)]"
              onClick={() => setIsModalOpen(true)}
            >
              <span>Courses & Regions</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>
        </div>

        {/* Active filters display */}
        <div className="flex flex-wrap gap-2 h-10 mt-18">
          {selectedMajors.map((id) => (
            <div
              key={`major-${id}`}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
            >
              {getMajorName(id)}
              <button
                onClick={() => removeMajorFilter(id)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {selectedRegions.map((id) => (
            <div
              key={`region-${id}`}
              className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
            >
              {getRegionName(id)}
              <button
                onClick={() => removeRegionFilter(id)}
                className="ml-2 text-puple-600 hover:text-purple-800"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => setIsModalOpen(false)}
        selectedMajors={selectedMajors}
        setSelectedMajors={setSelectedMajors}
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
        majors={majors}
        regions={regions}
      />

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="Main_Cards flex flex-wrap justify-center xl:gap-20 gap-6 mt-10">
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center) => (

              <motion.div
                key={center.id}
                className="w-full max-w-sm overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow bg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }} >             
                <Link to={`/centers/${center.id}`} onClick={() => window.scrollTo(0, 0)}>
                <div className="relative h-48 overflow-hidden ">
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
                </div> </Link>
                <Link
              to={`/centers/${center.id}`}
            
              onClick={() => window.scrollTo(0, 0)}
            >
                <div className="px-4 py-7 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold truncate">
                      {center.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <div className="relative w-5 h-5">
                        {/* Gray base star (background) */}
                        <StarIcon className="absolute text-gray-300 w-5 h-5" />

                        {/* Yellow overlay with dynamic width */}
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
                  {/* // i changed */}
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <PhoneIcon className="h-4 w-4" />
                      <a href={`tel:${center.phone || "+15551234567"}`}>
                        <span>{center.phone || "+1 (555) 123-4567"}</span>
                      </a>
                    </div>

                  </div>
                </div> </Link>
              </motion.div> 
            ))
          ) : (
            <p className="text-center text-gray-600">
              No centers match your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
