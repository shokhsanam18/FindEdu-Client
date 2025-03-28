import React, { useEffect, useState } from "react";
import { Button as Buton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Spinner,
  // Card,
  // IconButton,
} from "@material-tailwind/react";
import {
  // CubeTransparentIcon,
  UserCircleIcon,
  // CodeBracketSquareIcon,
  // Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  // InboxArrowDownIcon,
  // LifebuoyIcon,
  PowerIcon,
  // RocketLaunchIcon,
  // Bars2Icon,
} from "@heroicons/react/24/solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "../Store";

// profile menu component
const profileMenuItems = [
  // {
  //   label: "My Profile",
  //   icon: UserCircleIcon,
  //   link: '/MyProfile'
  // },
  {
    label: "Sign Out",
    icon: PowerIcon,
    // link: '/MyProfile'
  },
];

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => !!state.user?.data?.isActive);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const fetchImage = useAuthStore((state) => state.fetchProfileImage);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    useAuthStore.getState().fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.data?.image) {
      fetchImage(user.data.image);
    }
  }, [user]);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear tokens + user state
    navigate("/Login"); // Redirect to login
  };

  const profileImageUrl = useAuthStore((state) => state.profileImageUrl);
  console.log("Profile image URL:", profileImageUrl);

  const [region, setRegion] = useState("");
  const [level, setLevel] = useState("");
  const [studyType, setStudyType] = useState("");
  const [direction, setDirection] = useState("");
  const [price, setPrice] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleRegionChange = (value) => {
    setRegion(value);
    console.log("Selected Region:", value);
    // Implement your filtering logic here
  };

  const handleLevelChange = (value) => {
    setLevel(value);
    console.log("Selected Level:", value);
    // Implement your filtering logic here
  };

  const handleStudyTypeChange = (value) => {
    setStudyType(value);
    console.log("Selected Study Type:", value);
    // Implement your filtering logic here
  };

  const handleDirectionChange = (value) => {
    setDirection(value);
    console.log("Selected Direction:", value);
    // Implement your filtering logic here
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    console.log("Selected Price:", value);
    // Implement your filtering logic here
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
    console.log("Search Text:", e.target.value);
    // Implement your search logic here (could be debounced)
  };

  const regions = [
    { value: "", label: "Mintaqa →" },
    { value: "tashkent", label: "Tashkent" },
    { value: "samarkand", label: "Samarkand" },
  ];
  const levels = [
    { value: "", label: "Darajasi →" },
    { value: "beginner", label: "Beginner" },
    { value: "advanced", label: "Advanced" },
  ];
  const studyTypes = [
    { value: "", label: "O'qish turi →" },
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
  ];
  const directions = [
    { value: "", label: "Yo'nalish →" },
    { value: "it", label: "IT" },
    { value: "marketing", label: "Marketing" },
    { value: "sat", label: "SAT" },
    { value: "IELTS", label: "IELTS" },
  ];
  const prices = [
    { value: "", label: "Narxi →" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
  ];

  return (
    <nav className="fixed top-0 left-0 py-4 px-[5%] flex flex-col gap-7 w-full z-50 bg-white shadow-md backdrop-blur-md">
      {/* Top Navigation */}
      <div className="bg-white flex items-center justify-between ">
        <div className="md:w-52 w-48  text-[#461773] flex items-center">
          <Link to="/" className="flex items-center">
            <img src="./logo.png" />
          </Link>
        </div>

        <div className="flex gap-4 md:gap-8 text-gray-700 font-semibold text-lg md:text-xl">
          <a href="#" className="hover:text-[#461773]">
            Learning Centers
          </a>
          <Link to="/About" className="hover:text-[#461773]">
            About Us
          </Link>
        </div>
        {isLoggedIn ? (
          <Menu
            open={isMenuOpen}
            handler={setIsMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center hover:bg-[#efd8ff] focus:bg-[#efd8ff] active:bg-[#efd8ff] gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
              >
                <Avatar
                  variant="circular"
                  size="sm"
                  alt="User profile"
                  className="border border-purple-900 p-0.5"
                  src={
                    profileImageUrl ||
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                  } // fallback if image fails
                />
                <motion.p className="text-[#290a3f]">
                  {user?.data?.firstName} {user?.data?.lastName}
                </motion.p>
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`h-3 w-3 text-[#290a3f] transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </MenuHandler>
            {/* <MenuList className="p-1">
              {profileMenuItems.map(({ label, icon, link }, key) => {
                const isLastItem = key === profileMenuItems.length - 1;
                return (
                  <Link to={`${isLastItem ? "#" : link}`} key={label}>
                    <MenuItem
                      onClick={isLastItem ? handleLogout : closeMenu}
                      className={`flex items-center  gap-2 rounded ${
                        isLastItem
                          ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                          : "hover:bg-[#efd8ff] focus:bg-[#efd8ff] active:bg-[#efd8ff]"
                      }`}
                    >
                      {React.createElement(icon, {
                        className: `h-4 w-4 ${
                          isLastItem ? "text-red-500" : "text-[#290a3f]"
                        }`,
                        strokeWidth: 2,
                      })}
                      <Typography
                        as="span"
                        variant="small"
                        className={`font-normal ${
                          isLastItem ? "text-red-500" : "text-[#290a3f]"
                        }`}
                      >
                        {label}
                      </Typography>
                    </MenuItem>
                  </Link>
                );
              })}
            </MenuList> */}
          </Menu>
        ) : (
          <div className="flex gap-2 md:gap-6">
            <Buton
              variant="outline"
              className="border-[#461773] text-[#461773] text-sm md:text-xl p-2 md:p-4 rounded-full"
              asChild
            >
              <Link to="/Login">Login</Link>
            </Buton>
            <Buton
              className="bg-[#461773] text-white text-sm md:text-xl p-2 md:p-4 rounded-full"
              asChild
            >
              <Link to="/Register">Register</Link>
            </Buton>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white flex justify-center items-center">
        <div className="container  flex items-center rounded-full border-2 border-[#461773] text-[#000000]">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Kasb, fan yoki o'quv markaz nomini kiriting..."
              value={searchText}
              onChange={handleSearchTextChange}
              className="border-0 rounded-l-full md:rounded-l-md shadow-none focus-visible:ring-0 pl-2 md:pl-4"
              style={{ color: "#000000" }}
            />
          </div>
          <div className="flex items-center">
            <div className="border-l border-[#000000]">
              <Select onValueChange={handleRegionChange} value={region}>
                <SelectTrigger
                  className="w-[80px] md:w-[120px] lg:w-[160px] border-none bg-transparent text-left rounded-none focus-visible:ring-0 pl-2 md:pl-4"
                  style={{ color: "#000000" }}
                >
                  <SelectValue placeholder="Mintaqa →" />
                </SelectTrigger>
                <SelectContent>
                  {regions
                    .filter((item) => item.value !== "")
                    .map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-l border-[#000000]">
              <Select onValueChange={handleLevelChange} value={level}>
                <SelectTrigger
                  className="w-[80px] md:w-[100px] lg:w-[140px] border-none bg-transparent text-left rounded-none focus-visible:ring-0 pl-2 md:pl-4"
                  style={{ color: "#000000" }}
                >
                  <SelectValue placeholder="Darajasi →" />
                </SelectTrigger>
                <SelectContent>
                  {levels
                    .filter((item) => item.value !== "")
                    .map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-l border-[#000000]">
              <Select onValueChange={handleStudyTypeChange} value={studyType}>
                <SelectTrigger
                  className="w-[90px] md:w-[120px] lg:w-[160px] border-none bg-transparent text-left rounded-none focus-visible:ring-0 pl-2 md:pl-4"
                  style={{ color: "#000000" }}
                >
                  <SelectValue placeholder="O'qish turi →" />
                </SelectTrigger>
                <SelectContent>
                  {studyTypes
                    .filter((item) => item.value !== "")
                    .map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-l border-[#000000]">
              <Select onValueChange={handleDirectionChange} value={direction}>
                <SelectTrigger
                  className="w-[80px] md:w-[100px] lg:w-[140px] border-none bg-transparent text-left rounded-none focus-visible:ring-0 pl-2 md:pl-4"
                  style={{ color: "#000000" }}
                >
                  <SelectValue placeholder="Yo'nalish →" />
                </SelectTrigger>
                <SelectContent>
                  {directions
                    .filter((item) => item.value !== "")
                    .map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-l border-[#000000]">
              <Select onValueChange={handlePriceChange} value={price}>
                <SelectTrigger
                  className="w-[60px] md:w-[80px] lg:w-[100px] border-none bg-transparent text-left rounded-none focus-visible:ring-0 pl-2 md:pl-4"
                  style={{ color: "#000000" }}
                >
                  <SelectValue placeholder="Narxi →" />
                </SelectTrigger>
                <SelectContent>
                  {prices
                    .filter((item) => item.value !== "")
                    .map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
