import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth';
import { Link } from 'react-router-dom';

const SetDeliveryZones = () => {
    const { adminData,adminAuthentication, isLoading } = useAuth()
    const [zones, setZones] = useState([]);
    const [cities, setCities] = useState([]);

    const [newLabel, setNewLabel] = useState('');
    const [city, setCity] = useState('')
    const [addresses, setAddresses] = useState([{ id: 1, value: '' }]);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (adminData) {
            setCities(adminData?.cities)
            setZones(adminData?.zones)
        }
    }, [adminData])

    const handleAddressChange = (id, value) => {
        setAddresses(addresses.map(addr => (addr.id === id ? { ...addr, value } : addr)));
    };

    const addNewAddressField = () => {
        const newId = addresses.length > 0 ? addresses[addresses.length - 1].id + 1 : 1;
        setAddresses([...addresses, { id: newId, value: '' }]);
    };

    const addAddress = async () => {
        console.log({ label: newLabel, city, addresses });
        setLoadingBtn(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-delivery-zone`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    zoneName: newLabel,
                    city: city,
                    pinCodes: addresses,
                    adminId: adminData._id
                })
            })

            const responseData = await response.json()
            if (response.ok) {
                setLoadingBtn(false);
                setModalVisible(false);
                setNewLabel('')
                setAddresses([{ id: 1, value: '' }])
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
    };

    const renderAddressItem = (item, index) => (
        <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <h3 className="font-bold mb-1 text-lg">{item.zoneName} ({item.city})</h3>
            <p className="text-yellow-600 font-bold">Pin code:</p>
            {item?.pinCodes.map((pinCode, item) => (
                <p className="text-gray-600">{pinCode.value}</p>
            ))}
        </div>
    );


    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <div className='flex justify-between lg:justify-start lg:gap-5'>
                <h2 className='text-2xl lg:text-3xl text-slate-900 font-extrabold lg:ml-4 tracking-tight'>All Zones</h2>
                <button
                    className="bg-[#FFB500] text-slate-950 font-bold py-2 px-4 rounded-lg hover:bg-[#FFB500]"
                    onClick={() => setModalVisible(true)}
                >
                    Add New Zone
                </button>
            </div>

            <div className='mt-5'>
                {zones?.map(renderAddressItem)}
            </div>

            {modalVisible ?
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Zone</h2>
                        <input
                            type="text"
                            placeholder="Label (e.g., Zone 1, Zone 2)"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                        />
                        <select
                            id="state"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="" disabled>
                                -- Select a city --
                            </option>
                            {cities.map((data, index) => (
                                <option key={index} value={data.city}>
                                    {data.city}
                                </option>
                            ))}
                        </select>

                        <div className="mb-4">
                            {addresses.map((address, index) => (
                                <div key={address.id} className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder={`Pincode ${index + 1}`}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        value={address.value}
                                        onChange={(e) => handleAddressChange(address.id, e.target.value)}
                                    />
                                    <button
                                        className="bg-[#FFB500] text-white p-2 rounded-full flex items-center justify-center hover:bg-[#FFB500]"
                                        onClick={addNewAddressField}
                                    >
                                        <span className="font-bold text-lg">+</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
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
                : null
            }
        </div>
    );
};

export default SetDeliveryZones;
