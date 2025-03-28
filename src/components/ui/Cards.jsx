import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle } from "./card.jsx";
import { motion } from "framer-motion";
import home from "/public/home.png";

const MajorsApi = "http://18.141.233.37:4000/api/major";
const RegionsApi = "http://18.141.233.37:4000/api/regions/search"; 

export const Modal = ({
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
      className="bg-black bg-opacity-60 fixed inset-0 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-[35%] px-5 py-5 bg-gray-200 border border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-start">
          <label className="text-2xl font-medium">Select Majors</label>
          <form className="majors text-xl flex flex-wrap gap-2">
            {majors.map((major) => (
              <label key={major.id} className="flex gap-1">
                <input
                  type="checkbox"
                  value={major.id}
                  checked={selectedMajors.includes(major.id)}
                  onChange={() => handleMajorSelect(major.id)}
                />
                {major.name}
              </label>
            ))}
          </form>

          <label className="text-2xl font-medium mt-4">Select Regions</label>
          <form className="regions text-xl flex flex-wrap gap-2">
            {regions.map((region) => (
              <label key={region.id} className="flex gap-1">
                <input
                  type="checkbox"
                  value={region.id}
                  checked={selectedRegions.includes(region.id)}
                  onChange={() => handleRegionSelect(region.id)}
                />
                {region.name}
              </label>
            ))}
          </form>
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="bg-green-600 text-white px-4 py-1 rounded-lg"
            onClick={() => {
              onSave();
              onClose();
            }}
          >
            OK
          </button>
          <button
            className="bg-rose-600 text-white px-4 py-1 rounded-lg"
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
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [majorsResponse, regionsResponse] = await Promise.all([
          axios.get(MajorsApi),
          axios.get(RegionsApi),
        ]);
        setMajors(majorsResponse.data.data || []);
        setRegions(regionsResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMajors.length === 0 && selectedRegions.length === 0) {
      setCenters([]);
      return;
    }

    const filteredCenters = majors
      .filter(
        (major) =>
          selectedMajors.includes(major.id) ||
          (major.centers &&
            major.centers.some((center) =>
              selectedRegions.includes(center.regionId)
            ))
      )
      .flatMap((major) =>
        major.centers
          ? major.centers.filter((center) =>
              selectedRegions.length > 0
                ? selectedRegions.includes(center.regionId)
                : true
            )
          : []
      );

    setCenters(filteredCenters);
  }, [selectedMajors, selectedRegions, majors]);

  return (
    <div className="mb-16 mt-[11%]">
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

      <div className="flex items-center justify-center gap-5 flex-wrap">
        <h2
          className="text-2xl text-center hover:cursor-pointer bg-blue-500 rounded-xl w-auto h-auto px-3 py-1 pb-2 text-white border-2 border-blue-500 hover:bg-white hover:text-blue-500 transition duration-500 focus:shadow-xl shadow-blue-500 flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          Majors & Regions
          <ChevronDown className="mt-2" />
        </h2>
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : (
        <div className="Main_Cards flex flex-wrap justify-center xl:gap-8 gap-6 mt-10">
          {centers.length > 0 ? (
            centers.map((center) => (
              <Card
                key={center.id}
                className="relative xl:w-80 w-[270px] xl:h-72 h-60 rounded-xl"
              >
                <CardHeader>
                  <CardTitle>{center.name}</CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600">No centers found.</p>
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
    </div>
  );
};
