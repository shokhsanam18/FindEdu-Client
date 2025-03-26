import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronDown } from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card.jsx";

const API = "http://18.141.233.37:4000/api/centers";
const MajorsApi = "http://18.141.233.37:4000/api/major";
const FieldsAPI = 'http://18.141.233.37:4000/api/fields';

export const Modal = ({ isOpen, onClose, onSave, selectedMajors, setSelectedMajors }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(FieldsAPI);
        setFields(response.data.data || []);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };
    fetchFields();
  }, []);

  const handleMajorSelect = (major) => {
    setSelectedMajors((prev) =>
      prev.includes(major.name)
        ? prev.filter((m) => m !== major.name)
        : [...prev, major.name]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black bg-opacity-60 fixed inset-0 flex items-center justify-center">
      <div className="w-[35%] px-5 py-5 bg-gray-200 border border-black">
        {fields.map((category) => (
          <div key={category.id} className="flex flex-col items-start">
            <label className="text-2xl font-medium">{category.name}</label>
            <form className="majors text-xl flex flex-wrap gap-2">
              {category.majors?.map((major) => (
                <label key={major.id} className="flex gap-1">
                  <input type="checkbox" value={major.name} checked={selectedMajors.includes(major.name)} onChange={() => handleMajorSelect(major)}
                  />
                  {major.name}
                </label>
              ))}
            </form>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <button className="bg-green-600 text-white px-4 py-1 rounded-lg" onClick={() => onSave(selectedMajors)}>
            OK
          </button>
          <button className="bg-rose-600 text-white px-4 py-1 rounded-lg" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


export const Cards = ({ SaveCategories, categories }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMajors, setSelectedMajors] = useState([]); 

  const GetCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      if (Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setSelectedCards(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCards();
  }, []);

  const onSaveMajors = (selectedMajors) => {
    setIsModalOpen(false);
    setSelectedMajors(selectedMajors); 
    setSelectedFilters(selectedMajors); 
  };

  const GetMajors = () => {
    axios.get(MajorsApi)
    .then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error.data);
    })
  }

  const Filter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((el) => el !== filter) : [...prev, filter]
    );
  };

  

  return (
    <div className="my-16">
      <div className="flex items-center justify-center gap-5 flex-wrap">
        <h2 className="text-2xl text-center hover:cursor-pointer bg-blue-500 rounded-xl w-auto h-auto px-3 py-1 pb-2 text-white border-2 border-blue-500 hover:bg-white hover:text-blue-500 transition duration-500 focus:shadow-xl shadow-blue-500 flex items-center justify-center" onClick={() => setIsModalOpen(true)}>Choose
          <ChevronDown className="mt-2" />
        </h2>
        <h2 className="text-2xl text-gray-800 font-semibold">Categories:</h2>
        {selectedMajors.map((filter, id) => (
        <button key={id} className={`border-[1px] border-black px-5 py-1 rounded-full text-xl font-normal transition duration-200 bg-white text-black hover:bg-violet-900 hover:text-white`}
        onClick={() => Filter(filter)}>{filter}
        </button>
        ))}
      </div>
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : selectedCards.length === 0 ? (
        <p className="text-center mt-10">Hech narsa topilmadi</p>
      ) : (
        <div className="relative border-r-[1px] border-violet-900 sm:mr-20 mb-20">
           <div className={`w-8 h-8 bg-violet-900 rounded-full fixed sm:flex hidden top-[50%] xl:right-[4%] lg:right-[6%] md:right-[7%] sm:right-[9%] right-[11%] before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:top-2 before:left-2 before:rounded-full ${selectedCards.length !== 0 ? '' : "hidden"}`}></div>
          <div className="Main_Cards flex flex-wrap justify-center xl:gap-8 gap-6 mt-10">
            {users.map((card) => (
              <Card key={card.id} className="relative xl:w-80 w-[270px] xl:h-72 h-60 rounded-xl">
                <CardHeader>
                  <CardTitle>{card.name}</CardTitle>
                </CardHeader>
                <h3 className="border-[1px] rounded-full border-black p-1 absolute top-5 right-7">
                  <Link to="/smth">
                    <ArrowRight />
                  </Link>
                </h3>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <img className="w-28 h-28 absolute bottom-2 left-4" src={card.image} alt="Card" />
                    <h3 className="flex text-yellow-400 font-semibold items-center gap-1 absolute bottom-7 right-7">
                      <Star fill="yellow" color="yellow" /> {card.rating}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {visibleCards < selectedCards.length && (
        <div className="flex items-center justify-center mt-5">
          <button className="px-6 py-2 bg-violet-900 text-white rounded-full text-lg hover:bg-violet-700" onClick={() => setVisibleCards(visibleCards + 10)}>
            Show More
          </button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onSaveMajors} selectedMajors={selectedMajors} setSelectedMajors={setSelectedMajors} />
    </div>
  );
};
