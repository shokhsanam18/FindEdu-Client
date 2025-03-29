// import { useEffect, useState } from "react";
// import { ChevronDown, Heart, ArrowRight } from "lucide-react";
// import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "./card.jsx";
// import { motion } from "framer-motion";
// import home from "/public/home.png";
// import { Link } from "react-router-dom";
// const MajorsApi = "http://18.141.233.37:4000/api/major";
// const RegionsApi = "http://18.141.233.37:4000/api/regions/search";
// const CentersApi = "http://18.141.233.37:4000/api/centers";

// export const Modal = ({
//   isOpen,
//   onClose,
//   onSave,
//   selectedMajors,
//   setSelectedMajors,
//   selectedRegions,
//   setSelectedRegions,
//   majors,
//   regions,
// }) => {
//   const handleMajorSelect = (majorId) => {
//     setSelectedMajors((prev) =>
//       prev.includes(majorId)
//         ? prev.filter((id) => id !== majorId)
//         : [...prev, majorId]
//     );
//   };

//   const handleRegionSelect = (regionId) => {
//     setSelectedRegions((prev) =>
//       prev.includes(regionId)
//         ? prev.filter((id) => id !== regionId)
//         : [...prev, regionId]
//     );
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       onClick={onClose}
//     >
//       <div
//         className="w-[40%] max-w-[500px] max-h-[80vh] overflow-y-auto px-6 py-6 bg-[#A88CC0] text-white border border-white rounded-lg shadow-lg z-50"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex flex-col">
//           <label className="text-2xl font-semibold mb-2">Select Majors</label>
//           <form className="text-lg flex flex-wrap gap-3">
//             {majors.map((major) => (
//               <label key={major.id} className="flex items-center gap-2 w-1/2">
//                 <input
//                   type="checkbox"
//                   value={major.id}
//                   checked={selectedMajors.includes(major.id)}
//                   onChange={() => handleMajorSelect(major.id)}
//                   className="w-5 h-5 accent-[#4B2E64]"
//                 />
//                 {major.name}
//               </label>
//             ))}
//           </form>

//           <label className="text-2xl font-semibold mt-5 mb-2">
//             Select Regions
//           </label>
//           <form className="text-lg flex flex-wrap gap-3">
//             {regions.map((region) => (
//               <label key={region.id} className="flex items-center gap-2 w-1/2">
//                 <input
//                   type="checkbox"
//                   value={region.id}
//                   checked={selectedRegions.includes(region.id)}
//                   onChange={() => handleRegionSelect(region.id)}
//                   className="w-5 h-5 accent-[#4B2E64]"
//                 />
//                 {region.name}
//               </label>
//             ))}
//           </form>
//         </div>

//         <div className="flex justify-between mt-5">
//           <button
//             className="bg-[#9270B0] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#7C5B99]"
//             onClick={() => {
//               onSave();
//               onClose();
//             }}
//           >
//             OK
//           </button>
//           <button
//             className="bg-[#C47FB6] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#A96DA4]"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const Cards = () => {
//   const [majors, setMajors] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedMajors, setSelectedMajors] = useState([]);
//   const [selectedRegions, setSelectedRegions] = useState([]);
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [majorsResponse, regionsResponse, centersResponse] =
//           await Promise.all([
//             axios.get(MajorsApi),
//             axios.get(RegionsApi),
//             axios.get(CentersApi),
//           ]);

//         setMajors(majorsResponse.data.data || []);
//         setRegions(regionsResponse.data.data || []);
//         setCenters(centersResponse.data.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (selectedMajors.length === 0 && selectedRegions.length === 0) {
//       axios
//         .get(CentersApi)
//         .then((response) => setCenters(response.data.data || []))
//         .catch((error) =>
//           console.error("Error loading default centers:", error)
//         );
//       return;
//     }

//     const filteredCenters = majors.flatMap(
//       (major) =>
//         major.centers?.filter(
//           (center) =>
//             (selectedMajors.length === 0 ||
//               selectedMajors.includes(major.id)) &&
//             (selectedRegions.length === 0 ||
//               selectedRegions.includes(center.regionId))
//         ) || []
//     );

//     setCenters(filteredCenters);
//   }, [selectedMajors, selectedRegions]);

//   return (
//     <div className="mb-16 mt-[11%]">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1, ease: "easeOut" }}
//         className="relative py-25 flex items-center justify-center bg-cover bg-center mb-15 -z-20"
//         style={{ backgroundImage: `url(${home})` }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//         <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 text-white">
//           <div className="md:w-1/2 text-center md:text-left">
//             <motion.h1
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1, delay: 0.3 }}
//               className="text-5xl font-bold mt-2 leading-tight"
//             >
//               Empowering Students, <br /> One Search at a Time.
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 1, delay: 0.6 }}
//               className="text-gray-300 mt-4"
//             >
//               {" "}
//               We help students discover the best courses, universities,
//               andlearning opportunities worldwide. With expert insights and real
//               student reviews, we make your education journey effortless.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.9 }}
//               className="mt-6 flex justify-center md:justify-start items-center gap-4"
//             >
//               <Link to="/">
//                 {" "}
//                 <button className="flex items-center text-white px-6 py-3 rounded-full font-semibold shadow-lg bg-[#461773] hover:bg-[#533d75] transition">
//                   <span className="text-xl font-bold mr-2">+</span> EXPLORE
//                   COURSES
//                 </button>
//               </Link>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//       <div className="flex items-center justify-center gap-5 flex-wrap">
//         <h2
//           className="text-2xl text-center hover:cursor-pointer bg-blue-500 rounded-xl w-auto h-auto px-3 py-1 pb-2 text-white border-2 border-blue-500 hover:bg-white hover:text-blue-500 transition duration-500 focus:shadow-xl shadow-blue-500 flex items-center justify-center"
//           onClick={() => setIsModalOpen(true)}
//         >
//           Majors & Regions
//           <ChevronDown className="mt-2" />
//         </h2>
//       </div>
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={() => {
//           setIsModalOpen(false);
//           console.log("Saved selections:", { selectedMajors, selectedRegions });
//         }}
//         selectedMajors={selectedMajors}
//         setSelectedMajors={setSelectedMajors}
//         selectedRegions={selectedRegions}
//         setSelectedRegions={setSelectedRegions}
//         majors={majors}
//         regions={regions}
//       />
//       {loading ? (
//         <p className="text-center mt-10">Loading...</p>
//       ) : (
//         <div className="Main_Cards flex flex-wrap justify-center xl:gap-8 gap-6 mt-10">
//           {centers.length > 0 ? (
//             centers.map((center) => (
//               <Card
//                 key={center.id}
//                 className="relative xl:w-80 w-[270px] xl:h-72 h-60 rounded-xl"
//               >
//                 <CardHeader>
//                   <CardTitle>{center.name}</CardTitle>
//                 </CardHeader>
//                 <h3 className="border-[1px] rounded-full border-black p-1 absolute top-5 right-7">
//                   <Link to="/smth">
//                     <ArrowRight />
//                   </Link>
//                 </h3>
//                 <CardContent>
//                   <div className="flex items-center justify-between">
//                     <img
//                       className="w-28 h-28 absolute bottom-2 left-4"
//                       src={center.image}
//                       alt="Card"
//                     />
//                     <h3 className="flex text-yellow-400 font-semibold items-center gap-1 absolute bottom-7 right-7">
//                       <Heart color="gray" /> {center.rating}
//                     </h3>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <p className="text-center text-gray-600">No centers found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// import { useEffect, useState } from "react";
// import { ChevronDown, Heart, ArrowRight } from "lucide-react";
// import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "./card.jsx";
// import { motion } from "framer-motion";
// import home from "/public/home.png";
// import { Link } from "react-router-dom";

// const MajorsApi = "http://18.141.233.37:4000/api/major";
// const RegionsApi = "http://18.141.233.37:4000/api/regions/search";
// const CentersApi = "http://18.141.233.37:4000/api/centers";
// const ImageApi = "http://18.141.233.37:4000/api/image"; // Base image API URL

// export const Modal = ({
//   isOpen,
//   onClose,
//   onSave,
//   selectedMajors,
//   setSelectedMajors,
//   selectedRegions,
//   setSelectedRegions,
//   majors,
//   regions,
// }) => {
//   const handleMajorSelect = (majorId) => {
//     setSelectedMajors((prev) =>
//       prev.includes(majorId)
//         ? prev.filter((id) => id !== majorId)
//         : [...prev, majorId]
//     );
//   };

//   const handleRegionSelect = (regionId) => {
//     setSelectedRegions((prev) =>
//       prev.includes(regionId)
//         ? prev.filter((id) => id !== regionId)
//         : [...prev, regionId]
//     );
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       onClick={onClose}
//     >
//       <div
//         className="w-[40%] max-w-[500px] max-h-[80vh] overflow-y-auto px-6 py-6 bg-[#A88CC0] text-white border border-white rounded-lg shadow-lg z-50"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex flex-col">
//           <label className="text-2xl font-semibold mb-2">Select Majors</label>
//           <form className="text-lg flex flex-wrap gap-3">
//             {majors.map((major) => (
//               <label key={major.id} className="flex items-center gap-2 w-1/2">
//                 <input
//                   type="checkbox"
//                   value={major.id}
//                   checked={selectedMajors.includes(major.id)}
//                   onChange={() => handleMajorSelect(major.id)}
//                   className="w-5 h-5 accent-[#4B2E64]"
//                 />
//                 {major.name}
//               </label>
//             ))}
//           </form>

//           <label className="text-2xl font-semibold mt-5 mb-2">
//             Select Regions
//           </label>
//           <form className="text-lg flex flex-wrap gap-3">
//             {regions.map((region) => (
//               <label key={region.id} className="flex items-center gap-2 w-1/2">
//                 <input
//                   type="checkbox"
//                   value={region.id}
//                   checked={selectedRegions.includes(region.id)}
//                   onChange={() => handleRegionSelect(region.id)}
//                   className="w-5 h-5 accent-[#4B2E64]"
//                 />
//                 {region.name}
//               </label>
//             ))}
//           </form>
//         </div>

//         <div className="flex justify-between mt-5">
//           <button
//             className="bg-[#9270B0] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#7C5B99]"
//             onClick={() => {
//               onSave();
//               onClose();
//             }}
//           >
//             OK
//           </button>
//           <button
//             className="bg-[#C47FB6] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#A96DA4]"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const Cards = () => {
//   const [majors, setMajors] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedMajors, setSelectedMajors] = useState([]);
//   const [selectedRegions, setSelectedRegions] = useState([]);
//   const [likedCenters, setLikedCenters] = useState([]);

//   // Function to toggle like status
//   const toggleLike = (centerId) => {
//     setLikedCenters(prev =>
//       prev.includes(centerId)
//         ? prev.filter(id => id !== centerId)
//         : [...prev, centerId]
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [majorsResponse, regionsResponse, centersResponse] =
//           await Promise.all([
//             axios.get(MajorsApi),
//             axios.get(RegionsApi),
//             axios.get(CentersApi),
//           ]);

//         setMajors(majorsResponse.data.data || []);
//         setRegions(regionsResponse.data.data || []);

//         // Process centers to include full image URL
//         const processedCenters = centersResponse.data.data?.map(center => ({
//           ...center,
//           imageUrl: center.image ? `${ImageApi}/${center.image}` : null
//         })) || [];

//         setCenters(processedCenters);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (selectedMajors.length === 0 && selectedRegions.length === 0) {
//       axios
//         .get(CentersApi)
//         .then((response) => {
//           const processedCenters = response.data.data?.map(center => ({
//             ...center,
//             imageUrl: center.image ? `${ImageApi}/${center.image}` : null
//           })) || [];
//           setCenters(processedCenters);
//         })
//         .catch((error) =>
//           console.error("Error loading default centers:", error)
//         );
//       return;
//     }

//     const filteredCenters = majors.flatMap(
//       (major) =>
//         major.centers?.filter(
//           (center) =>
//             (selectedMajors.length === 0 ||
//               selectedMajors.includes(major.id)) &&
//             (selectedRegions.length === 0 ||
//               selectedRegions.includes(center.regionId))
//         )?.map(center => ({
//           ...center,
//           imageUrl: center.image ? `${ImageApi}/${center.image}` : null
//         })) || []
//     );

//     setCenters(filteredCenters);
//   }, [selectedMajors, selectedRegions, majors]);

//   return (
//     <div className="mb-16 mt-[11%]">
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1, ease: "easeOut" }}
//       className="relative py-25 flex items-center justify-center bg-cover bg-center mb-15 -z-20"
//       style={{ backgroundImage: `url(${home})` }}
//     >
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 text-white">
//         <div className="md:w-1/2 text-center md:text-left">
//           <motion.h1
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1, delay: 0.3 }}
//             className="text-5xl font-bold mt-2 leading-tight"
//           >
//             Empowering Students, <br /> One Search at a Time.
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.6 }}
//             className="text-gray-300 mt-4"
//           >
//             {" "}
//             We help students discover the best courses, universities,
//             andlearning opportunities worldwide. With expert insights and real
//             student reviews, we make your education journey effortless.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, delay: 0.9 }}
//             className="mt-6 flex justify-center md:justify-start items-center gap-4"
//           >
//             <Link to="/">
//               {" "}
//               <button className="flex items-center text-white px-6 py-3 rounded-full font-semibold shadow-lg bg-[#461773] hover:bg-[#533d75] transition">
//                 <span className="text-xl font-bold mr-2">+</span> EXPLORE
//                 COURSES
//               </button>
//             </Link>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//       <div className="flex items-center justify-center gap-5 flex-wrap">
//         <h2
//           className="text-2xl text-center hover:cursor-pointer bg-blue-500 rounded-xl w-auto h-auto px-3 py-1 pb-2 text-white border-2 border-blue-500 hover:bg-white hover:text-blue-500 transition duration-500 focus:shadow-xl shadow-blue-500 flex items-center justify-center"
//           onClick={() => setIsModalOpen(true)}
//         >
//           Majors & Regions
//           <ChevronDown className="mt-2" />
//         </h2>
//       </div>
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={() => {
//           setIsModalOpen(false);
//           console.log("Saved selections:", { selectedMajors, selectedRegions });
//         }}
//         selectedMajors={selectedMajors}
//         setSelectedMajors={setSelectedMajors}
//         selectedRegions={selectedRegions}
//         setSelectedRegions={setSelectedRegions}
//         majors={majors}
//         regions={regions}
//       />

//       {/* Centers cards with image and like functionality */}
//       {loading ? (
//         <p className="text-center mt-10">Loading...</p>
//       ) : (
//         <div className="Main_Cards flex flex-wrap justify-center xl:gap-8 gap-6 mt-10">

// {centers.length > 0 ? (
//   centers.map((center) => (
//     <Card
//       key={center.id}
//       className="relative xl:w-80 w-[270px] xl:h-72 h-60 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
//     >
//       <Link to={`/centers/${center.id}`} className="block h-full">
//         <CardHeader>
//           <CardTitle>{center.name}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between h-full">
//             {center.imageUrl && (
//               <img
//                 className="w-28 h-28 absolute bottom-2 left-4 object-cover rounded-lg"
//                 src={center.imageUrl}
//                 alt={center.name}
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                 }}
//               />
//             )}
//             <div className="absolute bottom-7 right-7">
//               <div
//                 className="flex text-yellow-400 font-semibold items-center gap-1 cursor-pointer"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   toggleLike(center.id);
//                 }}
//               >
//                 <Heart
//                   color={likedCenters.includes(center.id) ? "red" : "gray"}
//                   fill={likedCenters.includes(center.id) ? "red" : "none"}
//                 />
//                 {center.rating}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Link>
//     </Card>
//   ))
// ) : (
//   <p className="text-center text-gray-600">No centers found.</p>
// )}
//         </div>
//       )}
//     </div>
//   );
// };

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
import { useSearchStore } from "../../Store.jsx";
const MajorsApi = "http://18.141.233.37:4000/api/major";
const RegionsApi = "http://18.141.233.37:4000/api/regions/search";
const CentersApi = "http://18.141.233.37:4000/api/centers";
const ImageApi = "http://18.141.233.37:4000/api/image";

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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="w-[40%] max-w-[500px] max-h-[80vh] overflow-y-auto px-6 py-6 bg-[#A88CC0] text-white border border-white rounded-lg shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <label className="text-2xl font-semibold mb-2">Select Majors</label>
          <form className="text-lg flex flex-wrap gap-3">
            {majors.map((major) => (
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
            {regions.map((region) => (
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
              onSave();
              onClose();
            }}
          >
            OK
          </button>
          <button
            className="bg-[#C47FB6] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#A96DA4]"
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
  const [likedCenters, setLikedCenters] = useState([]);

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
          centersResponse.data.data?.map((center) => ({
            ...center,
            imageUrl: center.image ? `${ImageApi}/${center.image}` : null,
            rating: center.rating || 0,
          })) || [];

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

  const filteredCenters = centers.filter((center) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = center.name?.toLowerCase().includes(term);
    const addressMatch = center.address?.toLowerCase().includes(term);
    const majorMatch = center.majors?.some((major) =>
      major.name?.toLowerCase().includes(term)
    );
    return nameMatch || addressMatch || majorMatch;
  });

  useEffect(() => {
    if (selectedMajors.length === 0 && selectedRegions.length === 0) {
      setFilteredCenters(allCenters);
      return;
    }

    const filtered = allCenters.filter((center) => {
      const matchesMajor =
        selectedMajors.length === 0 || selectedMajors.includes(center.majorId);
      const matchesRegion =
        selectedRegions.length === 0 ||
        selectedRegions.includes(center.regionId);
      return matchesMajor && matchesRegion;
    });

    setFilteredCenters(filtered);
  }, [selectedMajors, selectedRegions, allCenters]);

  const toggleLike = (centerId) => {
    setLikedCenters((prev) =>
      prev.includes(centerId)
        ? prev.filter((id) => id !== centerId)
        : [...prev, centerId]
    );
  };

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

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 text-white">
          <div className="md:w-1/2 text-center md:text-left">
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
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-5 flex-wrap">
          <h2
            className="text-xl text-center hover:cursor-pointer bg-[#451774] rounded-xl w-auto h-auto px-9 py-3 pb-4 border-[#924bda] text-white border-2  hover:bg-white hover:text-purple-500 transition duration-500 focus:shadow-xl shadow-blue-500 flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            Majors & Regions
            <ChevronDown className="mt-2" />
          </h2>
        </div>

        {/* Active filters display */}
        <div className="flex flex-wrap gap-2 justify-center">
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
              className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full"
            >
              {getRegionName(id)}
              <button
                onClick={() => removeRegionFilter(id)}
                className="ml-2 text-green-600 hover:text-green-800"
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
        <p className="text-center mt-10">Loading...</p>
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
                    {likedCenters.includes(center.id) ? (
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
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">
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
                      className="text-sm font-medium text-blue-600 hover:underline"
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
