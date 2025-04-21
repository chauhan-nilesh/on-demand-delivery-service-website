import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statesWithCities = {
  AndhraPradesh: ["Visakhapatnam", "Vijayawada", "Guntur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  Delhi: ["New Delhi", "Delhi Cantt", "Rohini"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
  UttarPradesh: ["Lucknow", "Kanpur", "Varanasi"],
  WestBengal: ["Kolkata", "Howrah", "Darjeeling"],
};

const CompanyForm = () => {
  const { companyData } = useAuth()
  const [currentSection, setCurrentSection] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessDetails: {
      businessName: "",
      businessType: "",
      mobileNumber: "",
    },
    businessAddress: {
      address1: "",
      address2: "",
      state: "",
      city: "",
      pinCode: "",
    },
    documents: {
      gstNumber: "",
      gstCertificate: null,
    },
  });
  const navigate = useNavigate()

  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("companyToken")) {
      navigate("/company-login")
    }
  }, [])

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    setCurrentSection((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.businessDetails.businessName === "" || formData.businessDetails.businessType === "" || formData.businessDetails.mobileNumber === "" || formData.businessAddress.address1 === "" || formData.businessAddress.address2 === "" || formData.businessAddress.city === "" || formData.businessAddress.state === "" || formData.businessAddress.pinCode === "" || formData.documents.gstNumber === "" || formData.documents.gstCertificate === null) {
      toast.error("All feilds are required")
      return
    }
    try {
      setIsLoading(true)
      const formdata = new FormData()
      formdata.append("companyId", companyData._id)
      formdata.append("name", formData.businessDetails.businessName)
      formdata.append("businessType", formData.businessDetails.businessType)
      formdata.append("mobileNo", formData.businessDetails.mobileNumber)
      formdata.append("address1", formData.businessAddress.address1)
      formdata.append("address2", formData.businessAddress.address2)
      formdata.append("city", formData.businessAddress.city)
      formdata.append("state", formData.businessAddress.state)
      formdata.append("pinCode", formData.businessAddress.pinCode)
      formdata.append("gstNumber", formData.documents.gstNumber)
      formdata.append("gstCertificate", formData.documents.gstCertificate)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/company/store-details`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      setFormData({
        businessDetails: {
          businessName: "",
          businessType: "",
          mobileNumber: "",
        },
        businessAddress: {
          address1: "",
          address2: "",
          state: "",
          city: "",
          pinCode: "",
        },
        documents: {
          gstNumber: "",
          gstCertificate: null,
        },
      })
      toast.success(response.data.message)
      navigate("/company/dashboard")
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="h-full lg:bg-gray-100 flex justify-center items-center py-6 lg:py-16">
      <div className="bg-white lg:shadow-lg rounded-lg p-8 lg:max-w-[450px] w-full">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 mb-8 text-center">Company Registration</h2>

        {currentSection === 1 && (
          <form>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Business Details
            </h3>

            <div className="mb-4">
              <label
                htmlFor="businessName"
                className="block text-gray-600 mb-2 font-semibold"
              >
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessDetails.businessName}
                onChange={(e) =>
                  handleInputChange(
                    "businessDetails",
                    "businessName",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="businessType"
                className="block text-gray-600 mb-2 font-semibold"
              >
                Business Type
              </label>
              <select
                id="businessType"
                value={formData.businessDetails.businessType}
                onChange={(e) =>
                  handleInputChange(
                    "businessDetails",
                    "businessType",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              >
                <option value="">Select Type</option>
                <option value="store">Physical Store</option>
                <option value="online">Online Store</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="mobileNumber"
                className="block text-gray-600 mb-2 font-semibold"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobileNumber"
                value={formData.businessDetails.mobileNumber}
                onChange={(e) =>
                  handleInputChange(
                    "businessDetails",
                    "mobileNumber",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="bg-[#FFB500] w-full text-xl font-bold text-white py-3 px-4 rounded-md hover:bg-yellow-500 transition duration-200"
            >
              Save & Continue
            </button>
          </form>
        )}

        {currentSection === 2 && (
          <form>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Business Address
            </h3>

            <div className="mb-4">
              <label
                htmlFor="address1"
                className="block text-gray-600 mb-2 font-semibold"
              >
                Address 1
              </label>
              <input
                type="text"
                id="address1"
                value={formData.businessAddress.address1}
                onChange={(e) =>
                  handleInputChange(
                    "businessAddress",
                    "address1",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="address2"
                className="block text-gray-600 mb-2 font-semibold"
              >
                Address 2
              </label>
              <input
                type="text"
                id="address2"
                value={formData.businessAddress.address2}
                onChange={(e) =>
                  handleInputChange(
                    "businessAddress",
                    "address2",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-gray-600 mb-2 font-semibold"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.businessAddress.city}
                onChange={(e) =>
                  handleInputChange(
                    "businessAddress",
                    "city",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="state"
                className="block text-gray-600 mb-2 font-semibold"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                value={formData.businessAddress.state}
                onChange={(e) =>
                  handleInputChange(
                    "businessAddress",
                    "state",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="pinCode"
                className="block text-gray-600 mb-2 font-semibold"
              >
                Pin code
              </label>
              <input
                type="text"
                id="pinCode"
                value={formData.businessAddress.pinCode}
                onChange={(e) =>
                  handleInputChange(
                    "businessAddress",
                    "pinCode",
                    e.target.value
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="bg-[#FFB500] w-full text-xl font-bold text-white py-3 px-4 rounded-md hover:bg-yellow-500 transition duration-200"
            >
              Save & Continue
            </button>
          </form>
        )}

        {currentSection === 3 && (
          <form>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Documents
            </h3>

            <div className="mb-4">
              <label
                htmlFor="gstNumber"
                className="block text-gray-600 mb-2 font-semibold"
              >
                GST Number
              </label>
              <input
                type="text"
                id="gstNumber"
                value={formData.documents.gstNumber}
                onChange={(e) =>
                  handleInputChange("documents", "gstNumber", e.target.value)
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="gstCertificate"
                className="block text-gray-600 mb-2 font-semibold"
              >
                GST Certificate
              </label>
              <input
                type="file"
                id="gstCertificate"
                onChange={(e) =>
                  handleInputChange(
                    "documents",
                    "gstCertificate",
                    e.target.files[0]
                  )
                }
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#FFB500] w-full text-xl font-bold text-white py-3 px-4 rounded-md hover:bg-yellow-500 transition duration-200"
            >
              {isLoading ? <span className="loading loading-spinner loading-md"></span> : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanyForm;
