import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import {
  useReceptionStore,
  useAuthStore,
  useCardStore
} from "../Store";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

export const Appointment = () => {
  const { deleteReception } = useReceptionStore();
  const { user, fetchUserData } = useAuthStore();
  const { regions, fetchData } = useCardStore();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchData(); // load majors, regions, and centers if needed
  }, []);

  const getRegionName = (regionId) => {
    const region = regions.find((r) => r.id === regionId);
    return region?.name || "Unknown region";
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await deleteReception(deleteTargetId);
    await fetchUserData();
    setOpenDeleteDialog(false);
  };

  const userAppointments = user?.data?.receptions || [];

  return (
    <div className="w-full pt-[10%] pb-[5%] flex flex-wrap justify-center gap-6">
      {userAppointments.map((rec) => (
        <div
          key={rec.id}
          className="w-80 bg-purple-50 border border-purple-200 rounded-xl p-4 shadow hover:shadow-lg transition"
        >
          <img
            src={`https://findcourse.net.uz/api/image/${rec.filial?.image}`}
            alt="Center"
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-bold text-purple-700 mb-1">
            {rec.center?.name}
          </h3>
          <p className="text-sm text-gray-700 mb-1">
            📍 <strong>Address:</strong> {rec.filial?.address},{" "}
            {getRegionName(rec.filial?.regionId)}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            📅 <strong>Visit:</strong>{" "}
            {new Date(rec.visitDate).toLocaleString()}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            🎓 <strong>Major:</strong> {rec.major?.name || "Unknown major"}
          </p>
          <p
            className={`text-sm font-semibold ${
              rec.status === "PENDING" ? "text-yellow-600" : "text-green-600"
            }`}
          >
            🔖 {rec.status}
          </p>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => handleDelete(rec.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FiTrash2 className="inline-block" /> Delete
            </button>
          </div>
        </div>
      ))}

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this appointment?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
