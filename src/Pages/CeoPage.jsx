import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import ceo from "/public/ceo.png";
import icon from "/public/icon.png";
import { motion } from "framer-motion";
import { useMyCentersStore } from "../Store";
import { useTranslation } from 'react-i18next';

const centerSchema = z.object({
  name: z.string()
    .min(3, "Center name is required")
    .transform((val) => val.trimEnd()),

  regionId: z.string().min(1, "Region is required"),

  address: z.string()
    .min(5, "Address is required")
    .transform((val) => val.trimEnd()),

  image: z.any().refine((file) => file !== null, "Image is required"),

  majorsId: z.array(z.string()).nonempty("At least one major is required"),

  phone: z.string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => /^\+998\d{9}$/.test(val), {
      message: "Phone number must be in +998XXXXXXXXX format",
    }),

});

const filialSchema = z.object({
  name: z.string()
    .optional()
    .transform((val) => val?.trimEnd()),

  phone: z.string()
    .regex(/^\+998\d{9}$/, "Phone number must be in +998XXXXXXXXX format")
    .transform((val) => val.replace(/\s+/g, '')),

  regionId: z.string().min(1, "Region is required"),

  address: z.string()
    .min(5, "Address is required")
    .transform((val) => val.trimEnd()),

  image: z.any().refine((file) => file !== null, "Image is required"),
});

export default function CeoPage() {
  const {
    register: registerCenter,
    handleSubmit: handleSubmitCenter,
    setValue: setCenterValue,
    watch: watchCenter,
    formState: { errors: centerErrors, isValid: isCenterValid, isSubmitting: isCenterSubmitting },
    reset: resetCenterForm,
  } = useForm({
    resolver: zodResolver(centerSchema),
    mode: "onChange",
  });
  const { t } = useTranslation();
  const {
    register: registerFilial,
    handleSubmit: handleSubmitFilial,
    setValue: setFilialValue,
    watch: watchFilial,
    formState: { errors: filialErrors, isValid: isFilialValid, isSubmitting: isFilialSubmitting },
    reset: resetFilialForm,
  } = useForm({
    resolver: zodResolver(filialSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [majors, setMajors] = useState([]);
  const [centerImageFile, setCenterImageFile] = useState(null);
  const [filialImageFile, setFilialImageFile] = useState(null);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [filials, setFilials] = useState([]);
  const [isManualBranchName, setIsManualBranchName] = useState(false);

  const { myCenters, fetchMyCenters } = useMyCentersStore();
  const [selectedCenterId, setSelectedCenterId] = useState(null);
  const updateSelectedCenter = async (centerId) => {
    await fetchMyCenters();
    setSelectedCenterId(centerId);
    fetchFilials(centerId);
  };

  useEffect(() => {
    const updateCenters = async () => {
      await fetchMyCenters();
      const updated = useMyCentersStore.getState().myCenters;
      if (updated.length > 0) {
        setSelectedCenterId(updated[0].id);
      } else {
        setSelectedCenterId(null);
      }
    };

    updateCenters();

    window.addEventListener("focus", updateCenters);

    return () => {
      window.removeEventListener("focus", updateCenters);
    };
  }, []);


  useEffect(() => {
    if (selectedCenterId) {
      fetchFilials(selectedCenterId);
    }
  }, [selectedCenterId]);


  useEffect(() => {
    if (myCenters.length === 0) {
      setFilialValue("name", "", { shouldValidate: true });
      setSelectedCenterId(null);
    }
  }, [myCenters]);



  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [regionsRes, majorsRes] = await Promise.all([
          axios.get(
            "https://findcourse.net.uz/api/regions/search?page=1&limit=500",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get("https://findcourse.net.uz/api/major", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setRegions(regionsRes.data.data);
        setMajors(majorsRes.data.data);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [navigate]);

  const centerName = watchCenter("name");
  const filialRegionId = watchFilial("regionId");

  useEffect(() => {
    if (isManualBranchName) return;

    const selectedCenter = myCenters.find(c => c.id === Number(selectedCenterId));
    const regionName = regions.find(r => String(r.id) === String(filialRegionId))?.name;

    if (selectedCenter && regionName) {
      setFilialValue("name", `${selectedCenter.name} - ${regionName} branch`, { shouldValidate: true });
    } else if (selectedCenter) {
      setFilialValue("name", selectedCenter.name, { shouldValidate: true });
    }
  }, [selectedCenterId, filialRegionId, regions, isManualBranchName, myCenters]);

  const handleCenterImageChange = (e) => {
    const file = e.target.files[0];
    setCenterImageFile(file);
    setCenterValue("image", file, { shouldValidate: true });
  };

  const handleFilialImageChange = (e) => {
    const file = e.target.files[0];
    setFilialImageFile(file);
    setFilialValue("image", file, { shouldValidate: true });
  };

  const onSubmitCenter = async (data) => {
    const token = localStorage.getItem("accessToken");

    if (!centerImageFile) {
      toast.error("Please upload an image");
      return;
    }

    let imageUrl = "";
    let centerId = null;

    try {
      const uploadData = new FormData();
      uploadData.append("image", centerImageFile);

      const imageRes = await axios.post(
        "https://findcourse.net.uz/api/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      imageUrl = imageRes.data.data;

    } catch (uploadErr) {
      console.error("❌ Image upload failed:", uploadErr);
      toast.error("Image upload failed. Please try again.");
      return;
    }

    try {
      const centerData = {
        name: data.name.trimEnd(),
        regionId: data.regionId,
        address: data.address.trimEnd(),
        phone: data.phone.replace(/\s+/g, ''),
        majorsId: data.majorsId,
        image: imageUrl,
      };
      console.log(centerData)

      const centerRes = await axios.post(
        "https://findcourse.net.uz/api/centers",
        centerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      centerId = centerRes.data.data.id;
      await updateSelectedCenter(centerId);



    } catch (centerErr) {
      console.error("❌ Center creation failed:", centerErr);
      const message =
        centerErr.response?.data?.message || "Failed to create center.";
      toast.error(`Center Error: ${message}`);
      return;
    }

    try {
      console.log("Filial Payload", {
        name: `${data.name} ${regions.find(r => r.id === Number(data.regionId))?.name || 'Unknown region'}`,
        phone: data.phone,
        regionId: Number(data.regionId),
        centerId: Number(centerId),
        address: data.address,
        image: imageUrl,
      });
      await axios.post(
        "https://findcourse.net.uz/api/filials",
        {
          name: `${data.name} - ${regions.find(r => r.id === Number(data.regionId))?.name || 'Unknown region'} Main branch`,
          phone: data.phone,
          regionId: Number(data.regionId),
          centerId: Number(centerId),
          address: data.address,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Center and main branch created successfully!");
      resetCenterForm();
      setCenterImageFile(null);
      setSelectedMajors([]);


      await updateSelectedCenter(centerId);

    } catch (filialErr) {
      console.error("❌ Filial creation failed:", filialErr);
      if (filialErr.response) {
        console.error("📥 Response data:", filialErr.response.data);
      }
      const message =
        filialErr.response?.data?.message || "Failed to create main branch.";
      toast.error(`Branch Error: ${message}`);
    }
  };


  const onSubmitFilial = async (data) => {
    if (!selectedCenterId) {
      toast.error("Please create a center first");
      return;
    }

    try {
      if (!filialImageFile) {
        toast.error("Please upload an image");
        return;
      }

      const formData = {
        name: data.name?.trimEnd() || "",
        phone: data.phone.replace(/\s+/g, ''),
        regionId: Number(data.regionId),
        centerId: Number(selectedCenterId),
        address: data.address.trimEnd(),
        image: imageUrl,
      };
      const regionName = regions.find(r => r.id === Number(data.regionId))?.name || 'Unknown region';
      const centerName = myCenters.find(c => c.id === Number(selectedCenterId))?.name || 'Center';
      formData.name = `${centerName} - ${regionName} branch`;

      try {
        const uploadData = new FormData();
        uploadData.append("image", filialImageFile);

        const response = await axios.post(
          "https://findcourse.net.uz/api/upload",
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        formData.image = response.data.data;
      } catch (uploadError) {
        console.warn("Image upload failed, proceeding without image");
        formData.image = "default.jpg";
      }

      await axios.post("https://findcourse.net.uz/api/filials", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      toast.success("Branch added successfully!");
      resetFilialForm();
      setFilialImageFile(null);
      fetchFilials(Number(selectedCenterId));
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to create branch. Please try again."
      );
    }
  };

  const fetchFilials = async (centerId) => {
    try {
      const response = await axios.get(`https://findcourse.net.uz/api/filials?centerId=${centerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const allFilials = response.data.data || [];

      const sorted = allFilials.sort((a, b) => {
        const isMainA = a.name?.toLowerCase().includes("main branch");
        const isMainB = b.name?.toLowerCase().includes("main branch");

        if (isMainA && !isMainB) return -1;
        if (!isMainA && isMainB) return 1;
        return 0;
      });

      setFilials(sorted);

    } catch (error) {
      console.error("Failed to load branches:", error);
      toast.error("Failed to load branches");
      setFilials([]);
    }
  };

  return (
    <div className="bg-white h-full">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col md:flex-row justify-between items-center md:items-center p-6 min-h-[50vh] text-[#2d0e4e] bg-cover bg-center mt-20 "
        style={{ backgroundImage: "url('/aboutus.png')" }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-sm px-3 text-center md:px-6 md:text-start mt-2 md:mt-8 text-sm"
        >
          <p className="text-l md:text-2xl  mt-6 md:mt-0">
            {" "}
            {t("ceoPage.hero.subtitle")}
          </p>
          <p className="text-l md:text-l  mt-20 md:mt-0">
            {t("ceoPage.hero.description")}
          </p>
          <h1 className="text-3xl md:text-6xl font-bold ">  {t("ceoPage.hero.title")}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex flex-col md:flex-row gap-1 md:gap-2 ml-6 md:mr-10 md:text-xl  mt-4 md:mt-0"
        >
          <div className="flex gap-2 text-lg">
            <Link to="/" className="no-underline hover:underline text-white">
              {" "}
              {t("ceoPage.hero.homeLink")}
            </Link>
            <p>|</p>
            <Link
              to="/ceo"
              className="text-[#2d0e4e] no-underline hover:underline"
            >
              {t("ceoPage.hero.ceoLink")}{" "}
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <div className="flex flex-col md:flex-row w-full  gap-8  justify-center items-center p-4 md:p-0 n md:my-30">
        <div className="hidden md:flex h-screen justify-center items-center ">
          <motion.img
            src={ceo}
            alt="Our Mission"
            className="max-w-[250px] md:max-w-[450px] max-h-[1000px] object-contain cursor-pointer ml-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.9, ease: "easeInOut" },
            }}
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full h-full ">
          <Toaster theme="light" position="top-right" richColors />

          <div className="flex flex-col gap-6 w-full max-w-3xl border-y-green-900">
            <div className="bg-white shadow-lg rounded-lg p-7 w-full mb-8">
              <h2 className="text-4xl font-bold text-center text-purple-900 mb-6">
                {t("ceoPage.centerForm.title")}
              </h2>
              <form onSubmit={handleSubmitCenter(onSubmitCenter)} className="space-y-2">
                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.centerForm.labels.name")}
                  </label>
                  <Input placeholder="Enter center name" {...registerCenter("name")} />
                  {centerErrors.name && (
                    <p className="text-red-500 text-sm">{centerErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.centerForm.labels.region")}
                  </label>
                  <select
                    {...registerCenter("regionId")}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {centerErrors.regionId && (
                    <p className="text-red-500 text-sm">
                      {centerErrors.regionId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.centerForm.labels.address")}
                  </label>
                  <Input placeholder={t("ceoPage.centerForm.placeholders.address")} {...registerCenter("address")} />
                  {centerErrors.address && (
                    <p className="text-red-500 text-sm">
                      {centerErrors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    {t("ceoPage.centerForm.labels.image")} <span className="text-red-500">*</span>
                  </label>

                  {centerImageFile ? (
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(centerImageFile)}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCenterImageFile(null);
                            setCenterValue("image", null, { shouldValidate: true });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {centerImageFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(centerImageFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <div
                        className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${centerErrors.image
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                          }`}
                      >
                        <svg
                          className="mx-auto h-8 w-12 text-gray-400 mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {t("ceoPage.centerForm.imageUpload.clickToUpload")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("ceoPage.centerForm.imageUpload.fileTypes")}
                        </p>
                        <input
                          type="file"
                          onChange={handleCenterImageChange}
                          className="hidden"
                          accept="image/png, image/jpeg, image/jpg"
                        />
                      </div>
                    </label>
                  )}

                  {centerErrors.image && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {centerErrors.image.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.centerForm.labels.phone")}
                  </label>
                  <Input
                    placeholder={t("ceoPage.centerForm.placeholders.phone")}
                    type="tel"
                    value={
                      watchCenter("phone")?.startsWith("+998")
                        ? watchCenter("phone")
                        : `+998${watchCenter("phone") || ""}`
                    }
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\s+/g, '');
                      setCenterValue("phone", cleaned, { shouldValidate: true });
                    }}
                    {...registerCenter("phone")}
                  />
                  {centerErrors.phone && (
                    <p className="text-red-500 text-sm">{centerErrors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.centerForm.labels.majors")}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {majors.map((major) => (
                      <div key={major.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`major-${major.id}`}
                          value={String(major.id)}
                          checked={selectedMajors.includes(String(major.id))}
                          onChange={(e) => {
                            const value = e.target.value;
                            let newSelectedMajors;

                            if (e.target.checked) {
                              newSelectedMajors = [...selectedMajors, value];
                            } else {
                              newSelectedMajors = selectedMajors.filter((id) => id !== value);
                            }

                            setSelectedMajors(newSelectedMajors);
                            setCenterValue("majorsId", newSelectedMajors, { shouldValidate: true });
                          }}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`major-${major.id}`} className="ml-2 text-sm text-gray-700">
                          {major.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {centerErrors.majorsId && (
                    <p className="mt-1 text-sm text-red-600">
                      {centerErrors.majorsId.message}
                    </p>
                  )}
                  {selectedMajors.length > 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      Selected: {selectedMajors.length} major(s)
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-900 hover:bg-blue-900 text-white py-2 rounded-lg cursor-pointer"
                  disabled={!isCenterValid || isCenterSubmitting}
                >
                  {isCenterSubmitting ? t("ceoPage.centerForm.creating") : t("ceoPage.centerForm.submitButton")}
                </Button>
              </form>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-7 w-full mb-8">
              <h2 className="text-4xl font-bold text-center text-purple-900 mb-6">
                {Number(selectedCenterId) ? "Add Branch" : "Branches"}
              </h2>

              <form onSubmit={handleSubmitFilial(onSubmitFilial)} className="space-y-2 mb-6">

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.branchForm.labels.selectCenter")}
                  </label>
                  <select
                    className="w-full p-2 border rounded bg-white mb-2"
                    value={selectedCenterId || ''}
                    onChange={(e) => setSelectedCenterId(e.target.value)}
                  >
                    {myCenters.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.branchForm.labels.name")}
                  </label>
                  <Input
                    placeholder={t("ceoPage.branchForm.placeholders.name")}
                    {...registerFilial("name")}
                    readOnly={!isManualBranchName}
                  />
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="manualBranch"
                      checked={isManualBranchName}
                      onChange={(e) => setIsManualBranchName(e.target.checked)}
                    />
                    <label htmlFor="manualBranch" className="text-sm text-gray-600">
                      {t("ceoPage.branchForm.labels.manualName")}
                    </label>
                  </div>
                  {filialErrors.name && (
                    <p className="text-red-500 text-sm">{filialErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.branchForm.labels.phone")}
                  </label>
                  <Input
                    placeholder={t("ceoPage.branchForm.placeholders.phone")}
                    type="tel"
                    value={
                      watchFilial("phone")?.startsWith("+998")
                        ? watchFilial("phone")
                        : `+998${watchFilial("phone") || ""}`
                    }
                    onChange={(e) => {
                      const numbers = e.target.value.replace(/\D/g, "");
                      const fullNumber = numbers.startsWith("998")
                        ? `+${numbers.slice(0, 12)}`
                        : `+998${numbers.slice(0, 9)}`;
                      setFilialValue("phone", fullNumber, { shouldValidate: true });
                    }}
                    {...registerFilial("phone")}
                  />
                  {filialErrors.phone && (
                    <p className="text-red-500 text-sm">{filialErrors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.branchForm.labels.region")}
                  </label>
                  <select
                    {...registerFilial("regionId")}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {filialErrors.regionId && (
                    <p className="text-red-500 text-sm">
                      {filialErrors.regionId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    {t("ceoPage.branchForm.labels.address")}
                  </label>
                  <Input placeholder={t("ceoPage.branchForm.placeholders.address")} {...registerFilial("address")} />
                  {filialErrors.address && (
                    <p className="text-red-500 text-sm">
                      {filialErrors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    {t("ceoPage.branchForm.labels.image")} <span className="text-red-500">*</span>
                  </label>

                  {filialImageFile ? (
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(filialImageFile)}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFilialImageFile(null);
                            setFilialValue("image", null, { shouldValidate: true });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {filialImageFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(filialImageFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <div
                        className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${filialErrors.image
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                          }`}
                      >
                        <svg
                          className="mx-auto h-8 w-12 text-gray-400 mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {t("ceoPage.branchForm.imageUpload.clickToUpload")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("ceoPage.branchForm.imageUpload.fileTypes")}
                        </p>
                        <input
                          type="file"
                          onChange={handleFilialImageChange}
                          className="hidden"
                          accept="image/png, image/jpeg, image/jpg"
                        />
                      </div>
                    </label>
                  )}

                  {filialErrors.image && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {filialErrors.image.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-900 hover:bg-blue-900 text-white py-2 rounded-lg cursor-pointer"
                  disabled={!selectedCenterId || !isFilialValid || isFilialSubmitting}
                >
                  {isFilialSubmitting ? t("ceoPage.branchForm.adding") : t("ceoPage.branchForm.submitButton")}
                </Button>
              </form>

              {!!selectedCenterId && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-purple-900 mb-4"> {t("ceoPage.branchForm.branchesTitle")}</h3>
                  {filials.length > 0 ? (
                    <div className="space-y-4">
                      {filials.map((filial) => (
                        <div key={filial.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{filial.name}</h4>
                            <p className="text-sm text-gray-600">{filial.address}</p>
                            <p className="text-sm text-gray-600">{filial.phone}</p>
                          </div>
                          {filial.image && filial.image !== "default.jpg" && (
                            <img
                              src={`https://findcourse.net.uz/api/image/${filial.image}`}
                              alt={filial.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4"> {t("ceoPage.branchForm.noBranches")}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}