import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Phone, ArrowLeft, Clock, Mail, Globe, Map } from "lucide-react";
import { useTranslation } from 'react-i18next';

const BranchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://findcourse.net.uz/api/filials/${id}`);
        setBranch(response.data?.data);
        
        if (response.data?.data?.regionId) {
          try {
            const regionResponse = await axios.get(`https://findcourse.net.uz/api/regions/${response.data.data.regionId}`);
            setRegion(regionResponse.data?.data);
          } catch (regionErr) {
            console.error("Failed to load region information:", regionErr);
          }
        }

        if (response.data?.data?.image) {
          try {
            const imgResponse = await axios.get(`https://findcourse.net.uz/api/image/${response.data.data.image}`, {
              responseType: 'blob'
            });
            const imageObjectUrl = URL.createObjectURL(imgResponse.data);
            setImageUrl(imageObjectUrl);
          } catch (imgErr) {
            console.error("Failed to load image:", imgErr);
            setImageError(true);
          }
        }
      } catch (err) {
        setError("Failed to load branch information");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {t("branchDetail.goBack")}
        </button>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="container mx-auto p-4 mt-8 text-center">
        <p>{t("branchDetail.notFound")}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {t("branchDetail.goBack")}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl mt-28">
      <Link 
        to={`/centers/${branch.centerId || ''}`} 
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        {t("branchDetail.backButton")}
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Branch Image - Wider and taller */}
        {imageUrl && !imageError ? (
          <div className="w-full h-96 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={`${branch.name || branch.region?.name} branch`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            {imageError ? (
              <p className="text-gray-500">{t("branchDetail.imageNotAvailable")}</p>
            ) : (
              <p className="text-gray-500">{t("branchDetail.noImage")}</p>
            )}
          </div>
        )}

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            {branch.name || `Branch ${id}`}
          </h1>

          {(region || branch.region) && (
            <div className="flex items-center text-gray-600 mb-4">
              <Map className="h-5 w-5 mr-2 text-purple-600" />
              <span>{region?.name || branch.region?.name}</span>
            </div>
          )}
          
          {branch.description && (
            <p className="text-gray-600 mb-6">{branch.description}</p>
          )}

          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-700">{t("branchDetail.addressLabel")}</h3>
                <p className="text-gray-600">{branch.address || t("branchDetail.addressNotSpecified")}</p>
              </div>
            </div>

            {/* Phone */}
            {branch.phone && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">{t("branchDetail.phoneLabel")}</h3>
                  <a 
                    href={`tel:${branch.phone}`} 
                    className="text-purple-600 hover:underline"
                  >
                    {branch.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {branch.email && (
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">{t("branchDetail.emailLabel")}</h3>
                  <a 
                    href={`mailto:${branch.email}`} 
                    className="text-purple-600 hover:underline"
                  >
                    {branch.email}
                  </a>
                </div>
              </div>
            )}

            {/* Website */}
            {branch.website && (
              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">{t("branchDetail.websiteLabel")}</h3>
                  <a 
                    href={branch.website.startsWith('http') ? branch.website : `https://${branch.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline break-all"
                  >
                    {branch.website}
                  </a>
                </div>
              </div>
            )}

            {/* Working Hours */}
            {branch.workingHours && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">{t("branchDetail.workingHoursLabel")}</h3>
                  <p className="text-gray-600">{branch.workingHours}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;