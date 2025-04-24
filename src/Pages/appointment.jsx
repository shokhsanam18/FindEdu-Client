import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

export const Appointment = () => {
  const { deleteReception } = useReceptionStore();
  const { user, fetchUserData } = useAuthStore();
  const { regions, fetchData } = useCardStore();
  const { t } = useTranslation();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchData();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getRegionName = (regionId) => {
    const region = regions.find((r) => r.id === regionId);
    return region?.name || t("appointments.unknownRegion");
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteReception(deleteTargetId);
      await fetchUserData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const userAppointments = user?.data?.receptions || [];

  if (loading && userAppointments.length === 0) {
    return <div className="text-center py-20">{t("common.loading")}</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col md:flex-row justify-between items-center md:items-center p-6 min-h-[50vh] text-[#2d0e4e] bg-cover bg-center mt-20"
        style={{ backgroundImage: "url('/aboutus.png')" }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-2xl px-3 text-center md:px-6 md:text-start mt-2 md:mt-8"
        >
          <p className="text-lg md:text-xl mt-6 md:mt-0 font-light">
            {t("appointment.hero.subtitle")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 md:mt-4 bg-clip-text text-[#34115a]">
            {t("appointment.hero.title")}
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex gap-2 ml-6 md:mr-10 text-xl mt-4 md:mt-0"
        >
          <Link to="/" className="hover:underline text-white">{t("appointment.hero.homeLink")}</Link>
          <span>|</span>
          <Link to="/appointment" className="hover:underline text-[#2d0e4e]">{t("appointment.hero.favoritesLink")}</Link>
        </motion.div>
      </motion.div>

      <div className="w-full pt-[10%] pb-[5%] flex flex-wrap justify-center gap-6">
        {userAppointments.length === 0 ? (
          <div className="text-center py-20 w-full">
            <p className="text-xl text-gray-600">{t("appointments.noAppointments")}</p>

          </div>
        ) : (
          userAppointments.map((rec) => (
            <div
              key={rec.id}
              className="w-80 bg-purple-50 border border-purple-200 rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={`https://findcourse.net.uz/api/image/${rec.filial?.image}`}
                alt={rec.center?.name || t("appointments.centerImageAlt")}
                className="w-full h-40 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <h3 className="text-xl font-bold text-purple-700 mb-1">
                {rec.center?.name || t("appointments.unknownCenter")}
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                📍 <strong>{t("appointments.address")}:</strong> {rec.filial?.address || t("appointments.unknownAddress")},{" "}
                {getRegionName(rec.filial?.regionId)}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                📅 <strong>{t("appointments.visitDate")}:</strong>{" "}
                {rec.visitDate ? formatDate(rec.visitDate) : t("appointments.unknownDate")}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                🎓 <strong>{t("appointments.major")}:</strong> {rec.major?.name || t("appointments.unknownMajor")}
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
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  aria-label={t("appointments.deleteAppointment")}
                  disabled={loading}
                >
                  <FiTrash2 /> {t("common.delete")}
                </button>
              </div>
            </div>
          ))
        )}

        <Dialog open={openDeleteDialog} handler={() => !loading && setOpenDeleteDialog(false)}>
          <DialogHeader>{t("appointments.confirmDelete")}</DialogHeader>
          <DialogBody>
            {t("appointments.deleteConfirmationMessage")}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? t("common.deleting") : t("common.delete")}
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};