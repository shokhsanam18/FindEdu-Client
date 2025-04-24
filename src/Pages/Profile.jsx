// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../Store";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Input,
  Button,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const updateUser = useAuthStore((state) => state.updateUser);
  const fetchImage = useAuthStore((state) => state.fetchProfileImage);
  const profileImageUrl = useAuthStore((state) => state.profileImageUrl);
  const uploadImage = useAuthStore((state) => state.uploadImage);
  const navigate = useNavigate();
  const deleteAccount = useAuthStore((state) => state.deleteAccount);

  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (user?.data) {
      setFormData({
        firstName: user.data.firstName || "",
        lastName: user.data.lastName || "",
        email: user.data.email || "",
        phone: user.data.phone || "",
        image: user.data.image || "",
      });
      
      if (user.data.image) {
        fetchImage(user.data.image);
      }
    }
  }, [user, fetchImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleaned = value;
  
    // Remove all spaces for phone
    if (name === "phone") {
      cleaned = value.replace(/\s+/g, '');
    } else {
      // Trim for everything else
      cleaned = value.trimStart(); // Remove spaces from the beginning
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: cleaned,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user.data.id, {
  firstName: formData.firstName.trim(),
  lastName: formData.lastName.trim(),
  phone: formData.phone.replace(/\s+/g, '')
});
      setEditMode(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(user.data.id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        const response = await uploadImage(formData);
        const imageFilename = response.data;
        await updateUser(user.data.id, { image: imageFilename });
        setFormData(prev => ({
          ...prev,
          image: imageFilename
        }));
        fetchImage(imageFilename);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const getImageUrl = () => {
    if (formData.image) {
      if (formData.image.startsWith("http")) {
        return formData.image;
      }
      if (profileImageUrl) {
        return profileImageUrl;
      }
      return `/api/image/${formData.image}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <div className="container mx-auto px-4 mt-5 mb-3 text-xl">
        <Link
          to="/"
          className="inline-flex items-center text-[#441774] hover:text-purple-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t("profile.backToHome")}
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h3" color="blue-gray">
            {t("profile.title")}
          </Typography>
          {!editMode && (
            <Button
              variant="gradient"
              color="purple"
              className="flex items-center gap-2 bg-[#441774] text-white"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              {t("profile.editButton")}
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <Avatar
              src={getImageUrl()}
              alt="Profile"
              size="xxl"
              className="mb-4 border-2 border-gray-300 p-1"
            />
            {editMode && (
              <div className="mt-2">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="profileImage"
                  className={`text-sm ${isUploading ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'} cursor-pointer`}
                >
                  {isUploading ? t("profile.uploading") : t("profile.changePhoto")}
                </label>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  {t("profile.firstName")}
                </Typography>
                {editMode ? (
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <Typography>{formData.firstName}</Typography>
                )}
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  {t("profile.lastName")}
                </Typography>
                {editMode ? (
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <Typography>{formData.lastName}</Typography>
                )}
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  {t("profile.email")}
                </Typography>
                <Typography>{formData.email}</Typography>
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  {t("profile.phone")}
                </Typography>
                {editMode ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t("profile.phone")}
                  />
                ) : (
                  <Typography>{formData.phone || t("profile.notProvided")}</Typography>
                )}
              </div>

              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  {t("profile.role")}
                </Typography>
                <Typography className="capitalize">
                  {user?.role?.toLowerCase()}
                </Typography>
              </div>
            </div>

            {editMode && (
              <div className="flex gap-3 mt-8">
                <Button
                  type="submit"
                  color="green"
                  className="flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  {t("profile.saveButton")}
                </Button>
                <Button
                  color="red"
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    if (user?.data) {
                      setFormData({
                        firstName: user.data.firstName || "",
                        lastName: user.data.lastName || "",
                        email: user.data.email || "",
                        phone: user.data.phone || "",
                        image: user.data.image || "",
                      });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  {t("profile.cancelButton")}
                </Button>
              </div>
            )}
          </form>
        </div>

        {!editMode && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outlined"
              color="red"
              className="flex items-center gap-2"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <TrashIcon className="h-4 w-4" />
              {t("profile.deleteAccount")}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)}>
        <DialogHeader>{t("profile.deleteDialog.title")}</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            {t("profile.deleteDialog.message")}
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            {t("profile.deleteDialog.cancel")}
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 bg-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            {t("profile.deleteDialog.confirm")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}