import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth';

const SavedAddressesScreen = () => {
    const { companyData, companyAuthentication, isLoading } = useAuth()
    const [addresses, setAddresses] = useState([]);
    const [zones, setZones] = useState([])

    const [isModalVisible, setModalVisible] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [zone, setZone] = useState('');
    const [coords, setCoords] = useState(null)
    const [loadingBtn, setLoadingBtn] = useState(false)

    useEffect(() => {
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

    useEffect(() => {
        if (companyData) {
            setAddresses(companyData?.pickupAddresses)
        }
    }, [companyData])

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

                const generateAddressCoords = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        newAddress
                    )}`
                );
                const coordsData = await generateAddressCoords.json();

                if (coordsData.length > 0) {
                    setCoords({
                        lat: coordsData[0].lat,
                        lng: coordsData[0].lon,
                    });
                } else {
                    toast.error("Address not found. Please try again.");
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company/add-pickup-address`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        label: newLabel,
                        zone: zone,
                        address: newAddress,
                        coords: {
                            lat: coordsData[0].lat,
                            lng: coordsData[0].lon,
                        },
                        companyId: companyData._id
                    })
                })

                const responseData = await response.json()
                if (response.ok) {
                    setNewLabel('');
                    setNewAddress('');
                    setModalVisible(false);
                    toast.success(responseData.message)
                    companyAuthentication()
                } else {
                    toast.error(responseData.message)
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
            <h3 className="font-bold mb-1">{item.label}</h3>
            <p className="text-gray-600">{item.address}</p>
        </div>
    );


    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Saved Addresses</h1>

            <div>
                {addresses?.map(renderAddressItem)}
            </div>

            <button
                className="mt-6 bg-[#FFB500] text-slate-950 font-bold py-2 px-4 rounded-lg hover:bg-[#FFB500]"
                onClick={() => setModalVisible(true)}
            >
                Add New Address
            </button>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Address</h2>

                        <input
                            type="text"
                            placeholder="Label (e.g., Home, Work)"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                        />
                        <select
                            id="zone"
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            required
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
                        <input
                            type="text"
                            placeholder="Address"
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

export default SavedAddressesScreen;
