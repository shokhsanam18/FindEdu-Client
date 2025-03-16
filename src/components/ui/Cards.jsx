
import { useEffect, useState } from "react";
import Img from "../assets/images/img.jpg";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const API = "http://18.141.233.37:4000/api/fields";

export const Cards = () => {


    // const defaultUsers = [
    //     { 
    //       title: "Najot Ta'lim", 
    //       paragraph: "Biz ilm va tajriba ulashamiz", 
    //       img: Img, rating: 4.7, 
    //       category: "IT" 
    //     },
    //     { 
    //       title: "Everest", 
    //       paragraph: "Dare to Dream, Strive to Achieve", 
    //       img: Img, rating: 4.6, 
    //       category: "IELTS" 
    //     },
    //     { 
    //       title: "West.uz", 
    //       paragraph: "Achieve more with education.", 
    //       img: Img, rating: 4.5, 
    //       category: "SAT" 
    //     },
    // ];

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [visibleCards, setVisibleCards] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    let filters = ["IT", "Marketing", "Toshkent", "IELTS", "SAT", "Internation"];

    

    useEffect(() => {
        filterItems();
    }, [selectedFilters, users]);



    const handleFilterBtnClick = (selectedCategory) => {
        setSelectedFilters((prev) =>
            prev.includes(selectedCategory) ? prev.filter((el) => el !== selectedCategory) : [...prev, selectedCategory]
        );
    };

    const filterItems = () => {
        if (selectedFilters.length > 0) {
            let filtered = users.filter((item) => selectedFilters.includes(item.category));
            setSelectedCards(filtered);
        } else {
            setSelectedCards(users);
        }
    };

    // const SaveUsers = () => {
    //     defaultUsers.forEach((user) => {
    //         axios.post(API, user)
    //             .then(() => {
    //                 console.log("User saved successfully");
    //             })
    //             .catch((error) => {
    //                 console.log("Error saving user", error);
    //             });
    //     });
    // };


    
    // const GetUsers = () => {
    //     setLoading(true);
    //     axios.get(API)
    //         .then((response) => {
    //             setUsers(response.data.length > 0 ? response.data : []);
    //         })
    //         .catch((error) => {
    //             console.log("Error fetching users", error);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // };

    // useEffect(() => {
    //     GetUsers();
    // }, []);


    // const [isModalOpen, setIsModalOpen] = useState(false)
    

    return (
        
        <div className="mt-10">
            <div className="flex items-center justify-center gap-5 flex-wrap">
                <h2 className="text-2xl pb-2 text-center"
                // onMouseEnter={() => setIsModalOpen(true)}
                // onMouseLeave={() => setIsModalOpen(false)}
                >Categories:</h2>
                {filters.map((filter, id) => (
                    <button key={id} className={`border-[1px] border-black px-5 py-1 rounded-full text-xl font-normal transition duration-200 ${
                        selectedFilters.includes(filter) ? "bg-violet-900 text-white" : "hover:bg-violet-900 hover:text-white"
                    }`} onClick={() => handleFilterBtnClick(filter)}>
                        {filter}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-center mt-10">Loading...</p>
            ) : selectedCards.length === 0 ? (
                <p className="text-center mt-10">Hech narsa topilmadi</p>
            ) : (
        <div className="relative border-r-[1px] border-violet-900 sm:mr-20 m mb-20">
        <div className={`w-8 h-8 bg-violet-900 rounded-full fixed sm:flex hidden top-[50%] xl:right-[4%] lg:right-[6%] md:right-[7%] sm:right-[9%] right-[11%] before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:top-2 before:left-2 before:rounded-full ${selectedCards.length !== 0 ? '' : "hidden"}`}></div>
                <div className="Main_Cards flex flex-wrap justify-center gap-6 mt-10">
                    {selectedCards.slice(0, visibleCards).map((card, index) => (
                        <Card key={index} className="relative w-80 h-72 rounded-xl">
                            <CardHeader>
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.paragraph}</CardDescription>
                            </CardHeader>
                            <h3 className="border-[1px] rounded-full border-black p-1 absolute top-5 right-7">
                                <Link to="/smth"><ArrowRight /></Link>
                            </h3>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <img className="w-28 h-28 absolute bottom-2 left-4" src={card.img} alt="Card" />
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
                    <button 
                        className="px-6 py-2 bg-violet-900 text-white rounded-full text-lg hover:bg-violet-700"
                        onClick={() => setVisibleCards(visibleCards + 10)}
                    >
                        Show More
                    </button>
                </div>
            )}

            {/* <div className="flex items-center justify-center mt-5 gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={SaveUsers}>Save Users</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md" onClick={GetUsers}>Get Users</button>
            </div> */}
            {/* <Modal isOpen={isModalOpen}/> */}
        </div>
    );
};


// const CategoriesAPI = 'https://crudcrud.com/api/98542cfcce3f45a1b3d0c57b603d23a9/categories'


// const Modal = ({isOpen}) => {

//     const PostCategories = () => {
//     axios.post(CategoriesAPI, category)
//     .then(() => {
//         console.log('Categories saved successfully');
//     }).catch(() => {
//         console.log('Error saving categories');
//     })
// }


// if(!isOpen) return null

//     return(
//         <div className="">
//         {isOpen && (
//          <div className="">
//             <h1 className="bg-rose-500">modal open</h1>
//          </div>
//         )}
// </div>
//     )
// }






