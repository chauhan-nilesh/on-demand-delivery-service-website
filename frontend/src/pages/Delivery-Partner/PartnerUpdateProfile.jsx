import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import toast from "react-hot-toast";
import axios from "axios";

function PartnerUpdateProfile() {
    const { partnerData, isLoading } = useAuth()
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNo: "",
        address: "",
        jobType: "",
        zone: ""
    });

    useEffect(() => {
        if (partnerData) {
            setFormData({
                fullName: partnerData?.fullName,
                mobileNo: partnerData?.mobileNo,
                address: partnerData?.address,
                jobType: partnerData?.jobType,
                zone: partnerData?.area
            })
        }
    }, [partnerData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formdata = new FormData()
            formdata.append("partnerId", partnerData._id)
            formdata.append("fullName", formData.fullName)
            formdata.append("mobileNo", formData.mobileNo)
            formdata.append("address", formData.address)
            formdata.append("jobType", formData.jobType)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/partner/update-partner`, formdata, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            toast.success(response.data.message)
        } catch (error) {
            console.log(error);

        }
    };

    return (
        <div className="lg:min-h-screen flex items-center justify-center bg-white lg:bg-gray-100 px-4 py-4 lg:p-4 mb-20 lg:mb-0">
            <form
                className="bg-white lg:shadow-md rounded-lg  w-[500px] lg:p-8 space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">Partner Details</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                    <input
                        type="tel"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Zone</label>
                    <input
                        type="text"
                        name="zone"
                        value={formData.zone}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                        disabled
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-600 mb-2 font-semibold" htmlFor="jobType">Job Type</label>
                    <select
                        id="jobType"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className='w-full bg-gray-50 rounded-md px-3 py-3'
                    >
                        <option value="">Select Job Type</option>
                        <option value="fullTime">Full Time</option>
                        <option value="partTime">Part Time</option>
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFB500] hover:bg-[#ffcc4d] text-slate-950 font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB500]"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PartnerUpdateProfile