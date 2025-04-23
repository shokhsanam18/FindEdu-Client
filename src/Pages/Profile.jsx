// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store";
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

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const updateUser = useAuthStore((state) => state.updateUser);
  // const deleteUser = useAuthStore((state) => state.deleteUser);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user.data.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setEditMode(false);
      fetchUserData(); // Refresh user data
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
        
        // Upload the image
        const response = await uploadImage(formData);
        const imageFilename = response.data;
        
        // Update the user with the new image filename
        await updateUser(user.data.id, { image: imageFilename });
        
        // Update local state
        setFormData(prev => ({
          ...prev,
          image: imageFilename
        }));
        
        // Fetch the new image
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
      // If the image is a URL (from placeholder or just uploaded)
      if (formData.image.startsWith("http")) {
        return formData.image;
      }
      // If we have a profileImageUrl from the store
      if (profileImageUrl) {
        return profileImageUrl;
      }
      // Otherwise construct the URL from the filename
      return `/api/image/${formData.image}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h3" color="blue-gray">
            My Profile
          </Typography>
          {!editMode && (
            <Button
              variant="gradient"
              color="purple"
              className="flex items-center gap-2 bg-[#441774] text-white"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              Edit Profile
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
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                </label>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  First Name
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
                  Last Name
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
                  Email
                </Typography>
                <Typography>{formData.email}</Typography>
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Phone
                </Typography>
                {editMode ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <Typography>{formData.phone || "Not provided"}</Typography>
                )}
              </div>

              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Role
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
                  Save Changes
                </Button>
                <Button
                  color="red"
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    // Reset form data to original user data
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
                  Cancel
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
              Delete Account
            </Button>
          </div>
        )}
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)}>
        <DialogHeader>Confirm Account Deletion</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently removed.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 bg-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            Delete Account
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}