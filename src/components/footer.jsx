import React from "react";
import { Facebook, Instagram, Send, Youtube } from "lucide-react";
import icon from "/public/icon.png";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="bg-purple-900 text-white py-8 px-20 lg:px-36">
      <div className="text-2xl font-bold flex">
        <Link to="/" className="flex items-center">
          {" "}
          F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />
          ndedu.uz
        </Link>
      </div>
      <div className="max-w-6xl mx-auto flex flex-row md:flex-row justify-start  space-x-18">
        <div className="flex flex-col md:flex-row md:space-x-6 gap-4">
          <div className="mb-6 md:mb-0">
            <ul className="mt-4 space-y-4 ">
              <li>
                <a href="#" className="hover:underline">
                  Asosiy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  O‘quv markazlar
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Loyiha haqida
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-6 md:mb-0">
            <ul className=" mt-4 space-y-4">
              <li>
                <a href="#" className="hover:underline">
                  Bog‘lanish
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Izoh qoldirish
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Boshqa loyihalar
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="mb-6 md:mb-0">
          <ul className="mt-4 space-y-4 ">
            <li>
              <a href="#" className="hover:underline">
                Asosiy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                O‘quv markazlar
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Loyiha haqida
              </a>
            </li>
          </ul>
        </div>

        <div className="mb-6 md:mb-0">
          <ul className=" mt-4 space-y-4">
            <li>
              <a href="#" className="hover:underline">
                Bog‘lanish
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Izoh qoldirish
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Boshqa loyihalar
              </a>
            </li>
          </ul>
        </div> */}

        <div className="flex flex-col md:flex-row md:space-x-6 gap-4">
          <div className="mb-6 md:mb-0">
            <ul className="space-y-4 text-sm opacity-75">
              <li>
                <a href="#" className="hover:underline">
                  IT
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Matematika
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Marketing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  SAT
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-4 text-sm opacity-75">
              <li>
                <a href="#" className="hover:underline">
                  Ingliz tili
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  SMM
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Dizayn
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Kimyo
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-sm opacity-75">
        <div className="flex space-x-4 mt-4 md:mt-0">
          <p className="text-center md:text-left">
            © 2025 Findedu. All Rights Reserved. Best IT girls
          </p>
        </div>
        <div className="flex gap-5 mt-4 md:mt-0">
          <a href="/" className="hover:text-gray-300">
            <Facebook size={24} />
          </a>
          <a href="/" className="hover:text-gray-300">
            <Instagram size={24} />
          </a>
          <a href="/" className="hover:text-gray-300">
            <Send size={24} />
          </a>
          <a href="/" className="hover:text-gray-300">
            <Youtube size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};
