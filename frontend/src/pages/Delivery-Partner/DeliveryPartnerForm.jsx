import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';
import axios from 'axios'

const statesWithCities = {
  Maharashtra: ["Mumbai", "Navi Mumbai", "Pune", "Nagpur"],
  Delhi: ["New Delhi", "Delhi Cantt", "Rohini"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  AndhraPradesh: ["Visakhapatnam", "Vijayawada", "Guntur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
  UttarPradesh: ["Lucknow", "Kanpur", "Varanasi"],
  WestBengal: ["Kolkata", "Howrah", "Darjeeling"],
};

const RegistrationForm = () => {
  const { partnerData } = useAuth()
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    personalDetails: {
      fullName: '',
      address: '',
      mobileNumber: '',
    },
    workDetails: {
      state: '',
      city: '',
      area: '',
      jobType: '',
    },
    documents: {
      documentType: '',
      documentFile: null,
      drivingLicense: null,
      personalPhoto: null,
    },
  });
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [availableCities, setAvailableCities] = useState([]);
  const [zones, setZones] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem("partnerToken")) {
      // navigate("/partner-login")
    }

    ; (async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company/get-zones`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })

        if (response.ok) {
          const data = await response.json();
          setZones(data.data)
        } else {
          toast.error("Failed to fetch zones")
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch zones")
      }
    })()
  }, [])

  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });

    if (field === "state") {
      const cities = statesWithCities[value] || [];
      setAvailableCities(cities);
      setFormData((prev) => ({
        ...prev,
        workDetails: { ...prev.workDetails, city: "" },
      }));
    }
  };

  const handleNext = () => {
    setCurrentSection((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.personalDetails.fullName === "" || formData.personalDetails.address === "" || formData.personalDetails.mobileNo === "" || formData.workDetails.state === "" || formData.workDetails.city === "" || formData.workDetails.area === "" || formData.workDetails.jobType === "" || formData.documents.documentType === "") {
      toast.error("All feilds are required")
      return
    }
    setLoadingBtn(true)
    const formdata = new FormData()
    formdata.append("partnerId", partnerData._id)
    formdata.append('fullName', formData.personalDetails.fullName)
    formdata.append('address', formData.personalDetails.address)
    formdata.append('mobileNo', formData.personalDetails.mobileNumber)
    formdata.append('state', formData.workDetails.state)
    formdata.append('city', formData.workDetails.city)
    formdata.append('area', formData.workDetails.area)
    formdata.append('jobType', formData.workDetails.jobType)
    formdata.append('documentFile', formData.documents.documentFile)
    formdata.append('documentType', formData.documents.documentType)
    formdata.append('drivingLicense', formData.documents.drivingLicense)
    formdata.append('personalPhoto', formData.documents.personalPhoto)

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/partner/store-details`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success(response.data.message)
    navigate("/partner/dashboard")

    setFormData({
      personalDetails: {
        fullName: '',
        address: '',
        mobileNumber: '',
      },
      workDetails: {
        state: '',
        city: '',
        area: '',
        jobType: '',
      },
      documents: {
        documentType: '',
        documentFile: null,
        drivingLicense: null,
        personalPhoto: null,
      },
    })
    setLoadingBtn(false)
  };

  return (
    <div className="h-full lg:bg-gray-100 flex justify-center items-center py-6 lg:py-16">
      <div className="bg-white lg:shadow-lg rounded-lg p-8 lg:max-w-[450px] w-full">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 mb-8 text-center">Delivery Partner Registration</h2>

        {currentSection === 1 && (
          <form>
            <h3 className="text-xl font-bold text-gray-700 mb-4">Personal Details</h3>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={formData.personalDetails.fullName}
                onChange={(e) => handleInputChange('personalDetails', 'fullName', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="fullName">Address</label>
              <input
                type="text"
                id="address"
                placeholder="Enter your current address"
                value={formData.personalDetails.address}
                onChange={(e) => handleInputChange('personalDetails', 'address', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            {/* Mobile Number */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                placeholder="Enter your mobile number"
                value={formData.personalDetails.mobileNumber}
                onChange={(e) => handleInputChange('personalDetails', 'mobileNumber', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            {/* Next Button */}
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
            <h3 className="text-xl font-bold text-gray-700 mb-4">Work Details</h3>
            {/* Select State */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="state">Select State</label>
              <select
                id="state"
                value={formData.workDetails.state}
                onChange={(e) => handleInputChange('workDetails', 'state', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              >
                <option value="">Select State</option>
                {Object.keys(statesWithCities).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Select City */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="city">Select City</label>
              <select
                id="city"
                value={formData.workDetails.city}
                onChange={(e) => handleInputChange('workDetails', 'city', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
                disabled={!availableCities.length}
              >
                <option value="">Select City</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Select Zone */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="area">Select Zone</label>
              <select
                id="area"
                value={formData.workDetails.area}
                onChange={(e) => handleInputChange('workDetails', 'area', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              >
                <option value="" disabled>
                  -- Select a zone --
                </option>
                {zones.map((zone, index) => (
                  <option key={index} value={zone.zoneName}>
                    {zone.zoneName} ({zone.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="jobType">Job Type</label>
              <select
                id="jobType"
                value={formData.workDetails.jobType}
                onChange={(e) => handleInputChange('workDetails', 'jobType', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              >
                <option value="">Select Job Type</option>
                <option value="fullTime">Full Time</option>
                <option value="partTime">Part Time</option>
              </select>
            </div>

            {/* Next Button */}
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
            <h3 className="text-xl font-bold text-gray-700 mb-4">Documents</h3>
            {/* Document Type Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="documentType">Document Type</label>
              <select
                id="documentType"
                value={formData.documents.documentType}
                onChange={(e) => handleInputChange('documents', 'documentType', e.target.value)}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              >
                <option value="">Select Document</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="passport">Passport</option>
                <option value="voterId">Voter ID</option>
              </select>
            </div>

            {/* Document Upload */}
            {formData.documents.documentType && (
              <div className="mb-4">
                <label className="block text-gray-600 mb-2 font-semibold" htmlFor="documentUpload">
                  Upload {formData.documents.documentType === 'aadhar' ? 'Aadhar Card' : formData.documents.documentType === 'passport' ? 'Passport' : 'Voter ID'}
                </label>
                <input
                  type="file"
                  id="documentUpload"
                  onChange={(e) => handleInputChange('documents', 'documentFile', e.target.files[0])}
                  className='w-full bg-gray-50 rounded-md px-3 py-3'
                />
              </div>
            )}

            {/* Driving License */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="drivingLicense">Driving License</label>
              <input
                type="file"
                id="drivingLicense"
                onChange={(e) => handleInputChange('documents', 'drivingLicense', e.target.files[0])}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            {/* Personal Photo */}
            <div className="mb-6">
              <label className="block text-gray-600 mb-2 font-semibold" htmlFor="personalPhoto">Personal Photo / Selfie</label>
              <input
                type="file"
                id="personalPhoto"
                onChange={(e) => handleInputChange('documents', 'personalPhoto', e.target.files[0])}
                className='w-full bg-gray-50 rounded-md px-3 py-3'
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#FFB500] w-full text-xl font-bold text-white py-3 px-4 rounded-md hover:bg-yellow-500 transition duration-200"
            >
              {!loadingBtn ? "Submit" : <span className="loading loading-spinner loading-md"></span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
