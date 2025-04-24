import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useReceptionStore, useAuthStore } from "../Store";

export const Appointment = () => {
  const { fetchReceptions, receptions, deleteReception, updateReception } = useReceptionStore();
  const { user } = useAuthStore();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ visitDate: "" });

  useEffect(() => {
    fetchReceptions();
  }, []);

  const handleEdit = (reception) => {
    setEditingId(reception.id);
    setFormData({ visitDate: reception.visitDate.slice(0, 16) }); // YYYY-MM-DDTHH:mm
  };

  const handleUpdate = async (id) => {
    await updateReception(id, { visitDate: formData.visitDate });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      await deleteReception(id);
    }
  };

  const userAppointments = receptions.filter(
    (rec) => rec.userId === user?.data?.id
  );

  return (
    <div className="w-full min-h-screen pt-[10%] pb-[5%] flex flex-wrap justify-center gap-6">
      {userAppointments.map((rec) => (
        <div
          key={rec.id}
          className="w-80 bg-white border border-purple-200 rounded-xl p-6 shadow hover:shadow-lg transition"
        >
          {editingId === rec.id ? (
            <div>
              <label className="block text-sm mb-1">Visit Date</label>
              <input
                type="datetime-local"
                className="w-full border px-2 py-1 rounded mb-3"
                value={formData.visitDate}
                onChange={(e) =>
                  setFormData({ ...formData, visitDate: e.target.value })
                }
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(rec.id)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-purple-700 mb-2">
                Major ID: {rec.majorId}
              </h3>
              <p className="text-gray-700 text-sm mb-1">
                📍 Filial: {rec.filialId || "Main Branch"}
              </p>
              <p className="text-gray-700 text-sm">
                📅 {new Date(rec.visitDate).toLocaleString()}
              </p>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => handleEdit(rec)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit className="inline-block" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(rec.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="inline-block" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};