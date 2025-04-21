import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import toast from "react-hot-toast";
import axios from "axios";

function BusinessForm() {
    const { companyData, isLoading } = useAuth()
    const [formData, setFormData] = useState({
        name: "",
        businessType: "",
        mobileNo: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pinCode: "",
    });

    useEffect(() => {
        if (!isLoading) {
            setFormData({
                name: companyData?.name,
                businessType: companyData?.businessType,
                mobileNo: companyData?.mobileNo,
                address1: companyData?.address1,
                address2: companyData?.address2,
                city: companyData?.city,
                state: companyData?.state,
                pinCode: companyData?.pinCode,
            })
        }
    }, [isLoading])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formdata = new FormData()
            formdata.append("companyId", companyData._id)
            formdata.append("name", formData.name)
            formdata.append("businessType", formData.businessType)
            formdata.append("mobileNo", formData.mobileNo)
            formdata.append("address1", formData.address1)
            formdata.append("address2", formData.address2)
            formdata.append("city", formData.city)
            formdata.append("state", formData.state)
            formdata.append("pinCode", formData.pinCode)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/company/update-company`, formdata, {
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
        <div className="min-h-screen flex items-center justify-center bg-white lg:bg-gray-100 px-4 py-4 lg:p-4 mb-20 lg:mb-0">
            <form
                className="bg-white lg:shadow-md rounded-lg  w-[500px] lg:p-8 space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">Business Details</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Business Type</label>
                    <input
                        type="text"
                        name="businessType"
                        value={formData.businessType}
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
                    <label className="block text-sm font-medium text-gray-700">Address 1</label>
                    <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address 2</label>
                    <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pin code</label>
                    <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FFB500] focus:border-[#FFB500]"
                    />
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

export default BusinessForm;