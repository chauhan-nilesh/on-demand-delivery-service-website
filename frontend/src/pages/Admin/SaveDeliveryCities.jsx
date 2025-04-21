import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth';

const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
];

const SaveDeliveryCities = () => {
    const { adminData, adminAuthentication, isLoading } = useAuth()
    const [addresses, setAddresses] = useState([]);

    const [isModalVisible, setModalVisible] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [loadingBtn, setLoadingBtn] = useState(false)

    useEffect(() => {
        if (adminData) {
            setAddresses(adminData?.cities)
        }
    }, [adminData])

    const addAddress = async (e) => {
        e.preventDefault()
        if (newLabel && newAddress) {
            const newAddressItem = {
                id: Date.now().toString(),
                label: newLabel,
                address: newAddress,
            };
            setLoadingBtn(true)
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-delivery-cities`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        state: newLabel,
                        city: newAddress,
                        adminId: adminData._id
                    })
                })

                const responseData = await response.json()
                if (response.ok) {
                    setNewLabel('');
                    setNewAddress('');
                    setModalVisible(false);
                    toast.success(responseData.message)
                    adminAuthentication()
                } else {
                    toast.error("Something went wrong")
                }
            } catch (error) {
                console.log(error)
                toast.error("Something went wrong")
            } finally {
                setLoadingBtn(false)
            }
        }
    };

    const renderAddressItem = (item, index) => (
        <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <h3 className="font-bold mb-1">{item.city}</h3>
            <p className="text-gray-600">{item.state}</p>
        </div>
    );


    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <h1 className="text--xl lg:text-2xl font-bold mb-6">Currently Operating Cities</h1>

            <div>
                {addresses?.map(renderAddressItem)}
            </div>

            <button
                className="mt-6 bg-[#FFB500] text-slate-950 font-bold py-2 px-4 rounded-lg hover:bg-[#FFB500]"
                onClick={() => setModalVisible(true)}
            >
                Add New City
            </button>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New City</h2>
                        <select
                            id="state"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="" disabled>
                                -- Select a state --
                            </option>
                            {states.map((state, index) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="City Name"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />

                        <div className="flex justify-between">
                            <button
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#FFB500] text-slate-950 font-semibold py-2 px-4 rounded-lg hover:bg-[#FFB500]"
                                onClick={addAddress}
                            >
                                {!loadingBtn ? "Add" : <span className="loading loading-spinner loading-md"></span>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveDeliveryCities;
