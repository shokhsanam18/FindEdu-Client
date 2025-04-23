import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export const Appointment = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("RegisterData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  // 🗑️ DELETE FUNCTION
  const handleDelete = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1); // remove 1 item at index
    setData(updatedData);
    localStorage.setItem("RegisterData", JSON.stringify(updatedData));
  };

  // ✏️ EDIT FUNCTION
  const handleEdit = (index) => {
    const editedMajor = prompt("Edit major name:", data[index].majorName);
    const editedAddress = prompt("Edit address:", data[index].address);
    const editedDate = prompt("Edit visit date:", data[index].visitDate);

    if (editedMajor && editedAddress && editedDate) {
      const updatedData = [...data];
      updatedData[index] = {
        ...updatedData[index],
        majorName: editedMajor,
        address: editedAddress,
        visitDate: editedDate,
      };
      setData(updatedData);
      localStorage.setItem("RegisterData", JSON.stringify(updatedData));
    }
  };

  return (
    <div className="w-full h-full pt-[20%] pb-[10%] flex items-center justify-center gap-5 flex-wrap">
      {data.map((center, index) => (
        <div
          key={index}
          className="w-80 p-6 bg-gradient-to-br from-white via-purple-50 to-purple-100 border border-purple-200 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-purple-700 mb-1 tracking-wide">
              {center.majorName}
            </h1>
            <p className="text-gray-700 text-sm mb-1">
              📍 <span className="font-semibold">Address:</span> {center.address}
            </p>
            <p className="text-gray-700 text-sm">
              📅 <span className="font-semibold">Visit:</span>{" "}
              {new Date(center.visitDate).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
              title="Edit"
              onClick={() => handleEdit(index)}
            >
              <FiEdit className="text-lg" />
              Edit
            </button>
            <button
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition"
              title="Delete"
              onClick={() => handleDelete(index)}
            >
              <FiTrash2 className="text-lg" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
