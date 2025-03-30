import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSidebarSt } from "@/Store";
import icon from "/public/icon.png";

export const Sidebar = () => {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebarSt();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 720) closeSidebar();
    };
  
    window.addEventListener("resize", handleResize);
    handleResize(); 
  
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSidebar]);


  const pages = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About Us",
      href: "/About",
    },
    {
      title: "Resources",
      href: "/Resources",
    },
    {
      title: "Favorites",
      href: "/Favorites",
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
        aria-hidden={!isOpen}
      />

      <div
        className={`fixed top-0 left-0 w-64 h-full p-6 bg-white shadow-lg z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Sidebar"
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 text-black rounded hover:text-slate-600"
          aria-label="Close sidebar"
        >
          <X />
        </button>

        <div className="text-2xl font-bold flex text-violet-800">
          <Link to="/" className="flex items-center">
            F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />
            ndedu.uz
          </Link>
        </div>

        <ul className="mt-12 text-lg text-gray-700 flex flex-col gap-1">
          {pages.map((page) => (
            <li key={page.title} className="relative group">
              <Link
              onClick={closeSidebar}
                to={page.href}
                className="hover:text-violet-800 font-semibold"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
