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
import { useLikedStore, useSearchStore, useCardStore, useModalStore } from "../../Store.jsx";
// const MajorsApi = "http://18.141.233.37:4000/api/major";
// const RegionsApi = "http://18.141.233.37:4000/api/regions/search";
// const CentersApi = "http://18.141.233.37:4000/api/centers";
// const ImageApi = "http://18.141.233.37:4000/api/image";

const Modal = () => {

  const {
    majors,
    regions,
    selectedMajors,
    selectedRegions,
    setSelectedMajors,
    setSelectedRegions,
    filterCenters,
  } = useCardStore();

  const { isModalOpen, closeModal } = useModalStore();

  
  
  
  const handleMajorSelect = (majorId) => {
    const updated = selectedMajors.includes(majorId)
      ? selectedMajors.filter((id) => id !== majorId)
      : [...selectedMajors, majorId];
    setSelectedMajors(updated);
  };

  const handleRegionSelect = (regionId) => {
    const updated = selectedRegions.includes(regionId)
      ? selectedRegions.filter((id) => id !== regionId)
      : [...selectedRegions, regionId];
    setSelectedRegions(updated);
  };
  
  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="w-[40%] max-w-[500px] max-h-[80vh] overflow-y-auto px-6 py-6 bg-[#A88CC0] text-white border border-white rounded-lg shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <label className="text-2xl font-semibold mb-2">Select Majors</label>
          <form className="text-lg flex flex-wrap gap-3">
            {(majors || []).map((major) => (
              <label key={major.id} className="flex items-center gap-2 w-1/2">
                <input
                  type="checkbox"
                  value={major.id}
                  checked={selectedMajors.includes(major.id)}
                  onChange={() => handleMajorSelect(major.id)}
                  className="w-5 h-5 accent-[#4B2E64]"
                />
                {major.name}
              </label>
            ))}
          </form>

          <label className="text-2xl font-semibold mt-5 mb-2">
            Select Regions
          </label>
          <form className="text-lg flex flex-wrap gap-3">
            {(regions || []).map((region) => (
              <label key={region.id} className="flex items-center gap-2 w-1/2">
                <input
                  type="checkbox"
                  value={region.id}
                  checked={selectedRegions.includes(region.id)}
                  onChange={() => handleRegionSelect(region.id)}
                  className="w-5 h-5 accent-[#4B2E64]"
                />
                {region.name}
              </label>
            ))}
          </form>
        </div>

        <div className="flex justify-between mt-5">
          <button
            className="bg-[#9270B0] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#7C5B99]"
            onClick={() => {
              filterCenters();  // <- manual filtering
              closeModal();
            }}
          >
            OK
          </button>
          <button
            className="bg-[#C47FB6] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#A96DA4]"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const Cards = () => {
  const { toggleLike, isLiked, fetchLiked } = useLikedStore();
  useEffect(() => {
    fetchLiked(); // ← make sure likes are ready before rendering
  }, []);

  const {
    majors,
    regions,
    filteredCenters,
    allCenters,
    loading,
    fetchData,
    selectedMajors,
    selectedRegions,
    setSelectedMajors,
    setSelectedRegions,
    removeMajor,
    removeRegion,
  } = useCardStore();

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const searchTerm = useSearchStore((state) => state.searchTerm);

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    useCardStore.getState().filterCenters();
  }, [searchTerm]);
  
  console.log("Fetched centers:", filteredCenters);
  console.log("Fetched centers:", allCenters);
  const getRegionName = (id) => regions?.find((r) => r.id === id)?.name || id;
const getMajorName = (id) => majors?.find((m) => m.id === id)?.name || id;


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
          <div className="md:w-1/2 text-center md:text-left pl-10">
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
              onClick={openModal}
            >
              <span>Courses & Regions</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>
        </div>

        {/* Active filters display */}
        <div className="flex flex-wrap gap-2 h-10 mt-18">
          {(selectedMajors || []).map((id) => (
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
          {(selectedRegions || []).map((id) => (
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

      <Modal/>

      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : (
        <div className="Main_Cards flex flex-wrap justify-center xl:gap-20 gap-6 mt-10">
          {Array.isArray(filteredCenters) && filteredCenters.length > 0  ? (
            filteredCenters.map((center) => (
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

                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{center.phone || "+1 (555) 123-4567"}</span>
                    </div>
                    <Link
                      to={`/centers/${center.id}`}
                      className="text-sm font-medium text-purple-800 hover:underline"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Details
                    </Link>
                  </div>
                </div>
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
