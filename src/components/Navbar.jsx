

import React, { useEffect } from "react";
import { Button as Buton } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartIcon } from "@heroicons/react/24/outline";
import logo from "../../public/logo.png";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  PowerIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  ChartBarIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { useAuthStore, useSearchStore } from "../Store";
import { useSidebarSt } from "@/Store";
import { AlignJustify } from "lucide-react";
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";
export default function Navbar() {
  const { t, i18n } = useTranslation();
  const toggleSidebar = useSidebarSt((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => !!state.user?.data?.isActive);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const fetchImage = useAuthStore((state) => state.fetchProfileImage);
  const navigate = useNavigate();
  const profileImageUrl = useAuthStore((state) => state.profileImageUrl);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  const closeMenu = () => setIsMenuOpen(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => {
        localStorage.setItem('i18nextLng', lng);
      })
      .catch((err) => {
        console.error('Error changing language:', err);
      });
  };

  useEffect(() => {
    useAuthStore.getState().fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.data?.image) {
      fetchImage(user.data.image);
    }
  }, [user, fetchImage]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate("/Login");
  };

  const handleSearchTextChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const profileMenuItems = [
    ...(user?.role === "CEO"
      ? [
        {
          label: t('navbar.my_centers'),
          icon: BuildingOffice2Icon,
          link: "/MyCenters",
        },
      ]
      : user?.role === "USER"
        ? [
          {
            label: t('navbar.my_appointments'),
            icon: CalendarIcon,
            link: "/Appointment",
          },
        ]
        : []),
    {
      label: t('navbar.sign_out'),
      icon: PowerIcon,
    },
  ];

  const languageMenuItems = [
    {
      code: 'uz',
      name: t('navbar.languages.uz'),
      flag: <ReactCountryFlag countryCode="UZ" svg style={{ width: '1.5em', height: '1.5em' }} />
    },
    {
      code: 'ru',
      name: t('navbar.languages.ru'),
      flag: <ReactCountryFlag countryCode="RU" svg style={{ width: '1.5em', height: '1.5em' }} />
    },
    {
      code: 'en',
      name: t('navbar.languages.en'),
      flag: <ReactCountryFlag countryCode="GB" svg style={{ width: '1.5em', height: '1.5em' }} />
    },


  ];

  return (
    <nav className="fixed top-0 left-0 py-4 px-[2%] flex flex-col gap-7 w-full z-40 bg-white shadow-md backdrop-blur-md">
      <div className="bg-white items-center justify-between flex">
        <div className="md:w-52 w-48 text-[#461773] lg:flex items-center hidden">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="lg:hidden">
          <button
            className="hover:text-slate-600"
            onClick={toggleSidebar}
          >
            <AlignJustify />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-4 xl:gap-6 px-6 py-3">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300 relative group"
            onClick={() => window.scrollTo(0, 0)}
          >
            {t('navbar.home')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#461773] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/About"
            className="text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300 relative group"
            onClick={() => window.scrollTo(0, 0)}
          >
            {t('navbar.about')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#461773] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/Resources"
            className="text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300 relative group"
            onClick={() => window.scrollTo(0, 0)}
          >
            {t('navbar.resources')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#461773] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/Favorites"
            className="text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300 flex items-center gap-2 relative group"
            onClick={() => window.scrollTo(0, 0)}
          >
            <HeartIcon className="h-5 w-5 transition-colors duration-300 group-hover:fill-[#461773] group-hover:stroke-[#461773]" />
            {t('navbar.favorites')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#461773] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {user?.role === "USER" && (
            <Link
              to="/Appointment"
              className="flex items-center gap-1 text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300 relative group"
              onClick={() => window.scrollTo(0, 0)}
            >
              <CalendarIcon className="h-5 w-5" />
              {t('navbar.appointments')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#461773] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}

          {user?.role === "CEO" && (
            <div className="flex gap-4">
              <Link
                to="/Appointment"
                className="flex items-center gap-1 text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300 relative group"
                onClick={() => window.scrollTo(0, 0)}
              >
                <CalendarIcon className="h-5 w-5" />
                {t('navbar.appointments')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#461773] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="relative group">

                <button className="flex items-center gap-1 text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300">
                  {t('navbar.ceo_dashboard')}
                  <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    to="/Ceo"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#efd8ff] hover:text-[#461773]"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <PlusCircleIcon className="h-4 w-4" />
                    {t('navbar.create_center')}
                  </Link>
                  <Link
                    to="/MyCenters"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#efd8ff] hover:text-[#461773]"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <BuildingOffice2Icon className="h-4 w-4" />
                    {t('navbar.my_centers')}
                  </Link>
                </div>
              </div> </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
        <div className="relative group mt-1.5">
  <button className="flex items-center gap-1 text-gray-600 hover:text-[#461773] font-medium transition-colors duration-300">
    {i18n.language === 'en' && (
      <ReactCountryFlag
        countryCode="GB"
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
          marginRight: '8px'
        }}
      />
    )}
    {i18n.language === 'ru' && (
      <ReactCountryFlag
        countryCode="RU"
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
          marginRight: '8px'
        }}
      />
    )}
    {i18n.language === 'uz' && (
      <ReactCountryFlag
        countryCode="UZ"
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
          marginRight: '8px'
        }}
      />
    )}
    {t(`navbar.languages.${i18n.language}`)}
    <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
  </button>
  <div className="absolute left-8 w-22 bg-white rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
    {languageMenuItems.map(({ code, name, flag }) => (
      <button
        key={code}
        onClick={() => changeLanguage(code)}
        className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-center justify-center ${
          i18n.language === code 
            ? 'bg-[#efd8ff] text-[#461773]' 
            : 'text-gray-700 hover:bg-[#efd8ff] hover:text-[#461773]'
        }`}
      >
        <span className="text-xl">{flag}</span>
        {name}
      </button>
    ))}
  </div>
</div>
          {isLoggedIn ? (
            <div className="relative group">
              <button className="p-0 flex items-center hover:bg-[#efd8ff] focus:bg-[#efd8ff] active:bg-[#efd8ff] gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto">
                <Avatar
                  variant="circular"
                  size="sm"
                  alt="User profile"
                  className="border border-purple-900 p-0.5"
                  src={
                    profileImageUrl ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJKOCxJ4PWSjccLHucBQ-AlNhpiVx2ASk10lFfiNrG-QBOwwYkSGolTVZuKMZd7VcaKNk&usqp=CAU"
                  }
                />
                <motion.p className="">
                  {user?.data?.firstName} {user?.data?.lastName}
                </motion.p>
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`h-3 w-3 transition-transform group-hover:rotate-180`}
                />
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-2 px-4">
                  <Typography variant="small" className="font-semibold text-[#290a3f]">
                    {user?.data?.firstName} {user?.data?.lastName}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 text-xs">
                    {user?.data?.email}
                  </Typography>
                  <Link to="/profile">
                    <button
                      className="flex items-center gap-1 mt-2 text-[#461773] hover:bg-[#efd8ff] w-full px-2 py-2 rounded text-sm"
                    >
                      <PencilIcon className="h-3 w-3" />
                      {t('navbar.edit_profile')}
                    </button>
                  </Link>
                </div>

                {profileMenuItems.map(({ label, icon, link }, key) => {
                  const isLastItem = key === profileMenuItems.length - 1;
                  if (!isLastItem) return null;

                  return (
                    <div key={label} className="border-t border-gray-100 px-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
                      >
                        {React.createElement(icon, {
                          className: "h-4 w-4",
                          strokeWidth: 2,
                        })}
                        {label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex gap-3 md:gap-4">
              <Buton
                variant="outline"
                className="relative overflow-hidden border-[#461773] text-[#461773] hover:text-white text-sm md:text-base font-medium px-5 py-2 md:px-6 md:py-3 rounded-full transition-all duration-300 group"
                asChild
              >
                <Link to="/Login">
                  <span className="relative z-10">{t('navbar.login')}</span>
                  <span className="absolute inset-0 bg-[#461773] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full z-0"></span>
                </Link>
              </Buton>

              <Buton
                asChild
                className="relative overflow-hidden bg-[#461773] hover:bg-[#3a1260] text-white text-sm md:text-base font-medium px-5 py-2 md:px-6 md:py-3 rounded-full shadow-lg hover:shadow-[0_4px_15px_rgba(70,23,115,0.3)] transition-all duration-300"
              >
                <Link to="/Register">
                  <span className="relative z-10">{t('navbar.register')}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#5a1d99] to-[#461773] opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                </Link>
              </Buton>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}