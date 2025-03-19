import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Navbar() {
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
    <nav className="flex flex-col w-full shadow-md">
      {/* Top Navigation */}
      <div className="bg-white h-16 md:h-20 p-4 pl-6 md:pl-12 flex items-center justify-between ml-4 mr-4 md:ml-6 md:mr-6 lg:ml-10 lg:mr-10 xl:ml-16 xl:mr-16">
        <div className="text-2xl md:text-4xl font-bold text-[#461773] flex items-center">
          <a href="/" className="flex items-center">
            F <span className="text-yellow-500 text-2xl md:text-4xl">i</span>
            ndedu.uz
          </a>
        </div>

        <div className="hidden md:flex gap-4 md:gap-8 text-gray-700 font-semibold text-lg md:text-xl">
          <a href="#" className="hover:text-[#461773]">
            O‘quv markazlar
          </a>
          <a href="#" className="hover:text-[#461773]">
            Loyiha haqida
          </a>
        </div>

        <div className="flex gap-2 md:gap-6">
          <Button
            variant="outline"
            className="border-[#461773] text-[#461773] text-sm md:text-xl p-2 md:p-4 rounded-full"
            asChild
          >
            <a href="../Login">Kirish</a>
          </Button>
          <Button
            className="bg-[#461773] text-white text-sm md:text-xl p-2 md:p-4 rounded-full"
            asChild
          >
            <a href="../Register">Ro‘yhatdan o‘tish</a>
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white flex items-center py-2 md:py-4">
        <div className="container  flex items-center rounded-full border-2 border-[#461773] mx-4 md:mx-6 lg:mx-10 xl:mx-20 px-2 md:px-4 py-1 md:py-2 text-[#000000]">
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
            <div className="border-l border-r border-[#000000]">
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
