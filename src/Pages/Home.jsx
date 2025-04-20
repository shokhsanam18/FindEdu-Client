import { useEffect, useState } from "react";
import {
  ChevronDown,
  MapPinIcon,
  StarIcon,
  ArrowRight,
  PhoneIcon,
  X,
  SearchIcon
} from "lucide-react";
import axios from "axios";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import home from "/public/home.png";
import { useLikedStore, useSearchStore, useAuthStore, useMyCentersStore } from "../Store.jsx";

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
  
  const location = useLocation();
  const navigate = useNavigate();
  const isMyCentersPage = location.pathname === "/MyCenters";
  
  const { searchTerm, setSearchTerm } = useSearchStore();
  const { toggleLike, isLiked, fetchLiked } = useLikedStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user && useLikedStore.getState().likedItems.length === 0) {
      fetchLiked();
    }
  }, [user]);


  const {
    myCenters,
    loading: myCentersLoading,
    fetchMyCenters,
  } = useMyCentersStore();
  
    // Fetch likes on login
    useEffect(() => {
      if (user) fetchLiked();
    }, [user]);
  
    // Initial data fetch
    useEffect(() => {
      const fetchAll = async () => {
        setLoading(true);
  
        if (isMyCentersPage) {
          await fetchMyCenters();
        } else {
          try {
            const [majorsRes, regionsRes, centersRes] = await Promise.all([
              axios.get(MajorsApi),
              axios.get(RegionsApi),
              axios.get(CentersApi),
            ]);
  
            const centers = centersRes.data.data?.map((center) => {
              const comments = center.comments || [];
              const avgRating =
                comments.length > 0
                  ? comments.reduce((sum, c) => sum + c.star, 0) / comments.length
                  : 0;
  
              return {
                ...center,
                rating: avgRating,
                imageUrl: center.image ? `${ImageApi}/${center.image}` : null,
              };
            }) || [];
  
            setMajors(majorsRes.data.data || []);
            setRegions(regionsRes.data.data || []);
            setAllCenters(centers);
            setFilteredCenters(centers);
          } catch (err) {
            console.error("Fetch all data error:", err);
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchAll();
    }, [isMyCentersPage]);
  
    // Handle myCenters load separately
    useEffect(() => {
      if (isMyCentersPage && myCenters.length > 0) {
        setAllCenters(myCenters);
        setFilteredCenters(myCenters);
        setLoading(false);
      }
    }, [isMyCentersPage, myCenters]);
  
    // Filtering logic
    useEffect(() => {
      let filtered = [...allCenters];
  
      if (selectedMajors.length > 0) {
        filtered = filtered.filter((center) =>
          center.majors?.some((m) => selectedMajors.includes(m.id))
        );
      }
  
      if (selectedRegions.length > 0) {
        filtered = filtered.filter((center) =>
          selectedRegions.includes(center.regionId)
        );
      }
  
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter((center) => {
          const name = center.name?.toLowerCase() || "";
          const address = center.address?.toLowerCase() || "";
          const majorMatch = center.majors?.some((m) =>
            m.name?.toLowerCase().includes(term)
          );
          return (
            name.includes(term) || address.includes(term) || majorMatch
          );
        });
      }
  
      setFilteredCenters(filtered);
    }, [selectedMajors, selectedRegions, searchTerm, allCenters]);
  
    const getMajorName = (id) => majors.find((m) => m.id === id)?.name || id;
    const getRegionName = (id) => regions.find((r) => r.id === id)?.name || id;
  
    const removeMajorFilter = (id) => {
      setSelectedMajors((prev) => prev.filter((i) => i !== id));
    };
    const removeRegionFilter = (id) => {
      setSelectedRegions((prev) => prev.filter((i) => i !== id));
    };

    return (
      <div className="mb-16 mt-20 ">
        {!isMyCentersPage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative py-25 flex items-center justify-center bg-cover bg-center mb-15 -z-20"
            style={{ backgroundImage: `url(${home})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    
            <div className="relative mx-auto flex flex-col md:flex-row items-center text-white">
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
        )}

      {isMyCentersPage && (
      <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col md:flex-row justify-between items-center md:items-center p-6 min-h-[50vh] text-white bg-cover bg-center mt-20 mb-30"
      style={{ backgroundImage: "url('/ceopage.png')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 max-w-sm px-3 text-center md:px-6 md:text-start mt-2 md:mt-8 text-sm"
      >
        <p className="text-l md:text-xl  mt-6 md:mt-0">
          {" "}
          You can edit your Education Center
        </p>

        <h1 className="text-4xl md:text-7xl font-bold "> CEO Page</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 flex flex-col md:flex-row gap-1 md:gap-2 ml-6 md:mr-10 md:text-xl  mt-4 md:mt-0"
      >
        <div className="flex gap-2">
          <Link to="/" className="no-underline hover:underline text-white">
            {" "}
            Home
          </Link>
          <p>|</p>
          <Link
            to="/MyCenters"
            className="text-[#bbbbbb] no-underline hover:underline"
          >
            My centers{" "}
          </Link>
        </div>
      </motion.div>
    </motion.div>
                  )}
     
      {/* MODIFIED SEARCH DESIGN - ONLY THIS PART CHANGED */}
      {!isMyCentersPage && (
      <div className="flex flex-col items-center w-full px-4 mb-15">
  {/* Search bar with filters row */}
  <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-4">
    {/* Search input */}
    <div className="relative w-full md:w-auto md:flex-1 max-w-2xl">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Enter profession, subject, or educational center name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-10 py-3 border border-[#461773] rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6A4D7C] focus:border-transparent"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>

    {/* Filter button */}
    <button
      className="group inline-flex items-center justify-center gap-2 bg-[#461773] hover:bg-[#3a1260] text-white font-medium px-6 py-3 rounded-xl border border-[#5e1b9e] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(90,29,153,0.2)] whitespace-nowrap"
      onClick={() => setIsModalOpen(true)}
    >
      <span>Courses & Regions</span>
      <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
    </button>
  </div>

  {/* Active filters chips */}
  {(selectedMajors.length > 0 || selectedRegions.length > 0) && (
    <div className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-6xl">
      {selectedMajors.map((id) => (
        <div
          key={`major-${id}`}
          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          {getMajorName(id)}
          <button
            onClick={() => removeMajorFilter(id)}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {selectedRegions.map((id) => (
        <div
          key={`region-${id}`}
          className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
        >
          {getRegionName(id)}
          <button
            onClick={() => removeRegionFilter(id)}
            className="ml-2 text-purple-600 hover:text-purple-800"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}
</div> 
      )}



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
                className="w-full max-w-sm overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Link
                    to={`/centers/${center.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
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
                  </Link>

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

                  {isMyCentersPage && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute p-2 rounded-full top-3 right-3 mt-10 flex text-center items-center justify-center bg-white/70 backdrop-blur-sm"
                    >
                      <button
                       onClick={() => {
                        navigate(`/ceo/edit/${center.id}`);
                        window.scrollTo(0, 0);
                      }}
                        className="flex items-center text-sm h-5 w-5 text-yellow-600"
                      >
                        <PencilSquareIcon className="w-4 h-4 ml-[2px]" />
                      </button>
                    </motion.div>
                  )}
                </div>

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