import { useEffect, useState } from "react";
// import Img from "../assets/images/img.jpg";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronDown } from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card.jsx";

const API = "http://18.141.233.37:4000/api/centers";
const MajorsApi = "http://18.141.233.37:4000/api/major";
const CategoriesAPI = 'http://18.141.233.37:4000/api/categories';

const SaveMajors = () => {
    axios.post(MajorsApi, { selectedMajor })
        .then(() => {
            console.log("Major saved successfully");
        })
        .catch(() => {
            console.log("Error fetching major");
        });
};

export const Modal = ({ isOpen, onClose, onSave }) => {
    const [selectedMajors, setSelectedMajors] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedMajors")) || [];
});


const handleMajorSelect = (major) => {
    if (selectedMajors.includes(major)) {
        setSelectedMajors(selectedMajors.filter(m => m !== major));
    } else {
        setSelectedMajors([...selectedMajors, major]);
}};
    
useEffect(() => {
    axios.get(MajorsApi)
    .then((response) => {
        const fetchedMajors = response.data.selectedMajors || [];
    setSelectedMajors(fetchedMajors);
        })
    .catch(() => console.log("Error getting majors"));
}, []);

useEffect(() => {
    localStorage.setItem("selectedMajors", JSON.stringify(selectedMajors));
}, [selectedMajors]);

if (!isOpen) return null;

const Filter = () => {
    return [
        { field: "IT", 
            majors: [
                "Frontend Development", 
                "Backend Development", 
                "Mobile Development"
            ] },
        { field: "Business", 
            majors: [
                "Digital Marketing", 
                "Sales & E-commerce", 
                "Public Relations"]
             },
        { field: "Engineering", 
            majors: [
                "Mechanical Engineering", 
                "Robotics", 
                "Chemical Engineering"
        ] }]
    }

const save = () => {
    axios.post(MajorsApi, { selectedMajors }, 
        { 
            headers: { "Content-Type": "application/json" } 
        })
        .then(() => {
            console.log("Majors saved successfully");
            localStorage.setItem("selectedMajors", JSON.stringify(selectedMajors));
            onSave(selectedMajors); 
            onClose(); 
        })
        .catch(() => console.log("Error fetching majors"));
    };

    if (!isOpen) return null;


    const handleClose = () => {
        setSelectedMajors([]); 
        onClose();
    }

    return (
        <div className="bg-black bg-opacity-60 w-full h-full z-[1000000] fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center">
        <div className=" lg:w-1/3 md:w-1/2 w-7/12 h-auto px-5 py-5 bg-gray-200 border border-black z-50"> {Filter().map((category, index) => (
            <div className="Branches" key={index}>
                <h2 className="text-2xl font-semibold">{category.field}</h2>
                <form className="majors text-lg flex flex-wrap gap-2">
                    {category.majors.map((major, id) => (
                <label key={id} className="flex gap-1">
                <input type="checkbox" name={`major-${index}-${id}`}
                    value={major} checked={selectedMajors.includes(major)}
                    onChange={() => handleMajorSelect(major)}/>{major}</label>
            ))}
    </form>
</div>
))}

<div className="flex items-center justify-between">
   <button onClick={save} className="bg-green-600 text-white px-4 py-1 text-lg rounded-lg font-normal mt-4">OK</button>
   <button className="bg-rose-600 text-white px-4 py-1 text-lg rounded-lg font-normal mt-4" onClick={handleClose}>Cancel</button>
    </div>
  </div>
</div>
)}

export const Cards = ({ checkedItems, selectedMajors, setSelectedMajors  }) => {

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [visibleCards, setVisibleCards] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    
    // const filterItems = () => {
    //     if (selectedFilters.length > 0) {
    //         let filtered = card.filter((item) => selectedFilters.includes(item.category));
    //         setSelectedCards(filtered);
    //     } else {
    //         setSelectedCards([...Cards, ...card]);
    //     }
    // };

    // useEffect(() => {
    //     filterItems();
    // }, [selectedFilters, users]);

    const handleFilterBtnClick = (selectedCategory) => {
        setSelectedFilters((prev) =>
            prev.includes(selectedCategory) ? prev.filter((el) => el !== selectedCategory) : [...prev, selectedCategory]
        );
    };

    const GetUsers = () => {
        setLoading(true);
        axios.get(API)
            .then((response) => {
            setUsers(response.data);
            setSelectedCards(response.data);
            console.log("Users fetched successfully");
            })
            .catch((error) => {
                console.log("Error fetching users", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        GetUsers();
    }, []);


    const [isModalOpen, setIsModalOpen] = useState(false)

    const [values, setValues] = useState([]);

    const onSaveMajors = (majors) => {
        console.log("Saved majors:", majors); 
        setIsModalOpen(false);
        setValues(majors);
    };    

return (
    <div className="my-16">
        <div className="flex items-center justify-center gap-5 flex-wrap">
            <h2 className="text-2xl text-center hover:cursor-pointer bg-blue-500 rounded-xl w-auto h-auto px-3 py-1 pb-2 text-white border-2 border-blue-500 hover:bg-white hover:text-blue-500 transition duration-500 focus:shadow-xl shadow-blue-500 flex items-center justify-center" onClick={() => setIsModalOpen(true)}>Choose<ChevronDown className="mt-2"/></h2>
            <h2 className="text-2xl text-gray-800 font-semibold">Categories:</h2>
                {values.map((filter, id) => (
            <button key={id} className={`border-[1px] border-black px-5 py-1 rounded-full text-xl font-normal transition duration-200 ${
                selectedFilters.includes(filter) ? "bg-violet-900 text-white" : "hover:bg-violet-900 hover:text-white"
            }`} onClick={() => handleFilterBtnClick(filter)}>{typeof filter === "object" ? JSON.stringify(filter) : filter}
        </button>
    ))}
</div>
{/* {loading ? (
    <p className="text-center mt-10">Loading...</p>
        ) : selectedCards.length === 0 ? (
    <p className="text-center mt-10">Hech narsa topilmadi</p>
        ) : (
    <div className="relative border-r-[1px] border-violet-900 sm:mr-20 m mb-20">
       <div className={`w-8 h-8 bg-violet-900 rounded-full fixed sm:flex hidden top-[50%] xl:right-[4%] lg:right-[6%] md:right-[7%] sm:right-[9%] right-[11%] before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:top-2 before:left-2 before:rounded-full ${selectedCards.length !== 0 ? '' : "hidden"}`}></div>
        <div className="Main_Cards flex flex-wrap justify-center gap-6 mt-10">
            {selectedCards.slice(0, visibleCards).map((card, index) => (
    <Card key={index} className="relative w-80 h-72 rounded-xl hover:">
    <CardHeader>
        <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.paragraph}</CardDescription>
            </CardHeader>
            <h3 className="border-[1px] rounded-full border-black p-1 absolute top-5 right-7"><Link to="/smth"><ArrowRight /></Link></h3>
            <CardContent>
            <div className="flex items-center justify-between">
              <img className="w-28 h-28 absolute bottom-2 left-4" src={card.img} alt="Card" />
            <h3 className="flex text-yellow-400 font-semibold items-center gap-1 absolute bottom-7 right-7"><Star fill="yellow" color="yellow" /> {card.rating}</h3>
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
)}*/}
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onSaveMajors}    selectedMajors={values} setSelectedMajors={setValues}/> 
  </div>
)}

