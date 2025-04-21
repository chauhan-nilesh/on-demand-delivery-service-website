import React, { useEffect, useState } from 'react'
import { useAuth } from '../../store/auth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function CreateOrder() {
    const { companyData, isLoading } = useAuth()
    const navigate = useNavigate()
    const [addresses, setAddresses] = useState([])
    const [charges, setCharges] = useState([])
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState("cod")
    const [order, setOrder] = useState({
        internalOrderId: "",
        pickupAddressIndex: "",
        pickupAddress: "",
        pickupAddressZone: "",
        deliveryAddress: "",
        pinCode: "",
        customerName: "",
        customerPhoneNo: "",
        items: "",
        paymentMode: "",
        amountToCollect: "",
        weight: "",
        weightRange: "",
        deliveryCharges: 0
    })
    const [pickupAddressCoords, setPickupAddressCoords] = useState(null)
    const [deliveryAddressCoords, setDeliveryAddressCoords] = useState(null)

    const getDeliveryCharges = async (req, res) => {
        try {

            const data = await fetch(`${import.meta.env.VITE_API_URL}/api/company/get-charges`)

            if (data.ok) {
                const chargesData = await data.json()
                setCharges(chargesData.data)
            } else {
                toast.error("Failed to load weight and delivery rate")
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getDeliveryCharges()
        if (companyData) {
            setAddresses(companyData?.pickupAddresses)
        }
    }, [companyData])

    const handleInput = (e) => {
        const { name, value } = e.target;

        if (name === "weight") {
            setOrder({
                ...order,
                [name]: value,
                ["weightRange"]: charges[value].weightRange,
                ["deliveryCharges"]: charges[value].charge
            })
        } else if (name === "pickupAddressIndex") {
            console.log(addresses[value])
            setOrder({
                ...order,
                [name]: value,
                ["pickupAddress"]: addresses[value].address,
                ["pickupAddressZone"]: addresses[value].zone,
            })
            setPickupAddressCoords(addresses[value].coords)
        } else {
            setOrder({
                ...order,
                [name]: value,
            })
        }
    }

    const handleGeocode = async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    order.deliveryAddress
                )}`
            );
            const data = await response.json();

            if (data.length > 0) {
                setDeliveryAddressCoords({
                    lat: data[0].lat,
                    lng: data[0].lon,
                });
                return {
                    lat: data[0].lat,
                    lng: data[0].lon,
                }
            } else {
                toast.error("Address not found. Please try again.");
            }
        } catch (error) {
            console.error("Error during geocoding:", error);
            toast.error("An error occurred while fetching coordinates.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const deliveryCoords = await handleGeocode()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...order, weight: order.weightRange, companyId: companyData._id, paymentMode: type, pickupAddressCoords, deliveryAddressCoords: deliveryCoords,
                })
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success(responseData.message)
                navigate("/company/orders")
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while placing order")
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className="bg-white lg:bg-gray-100 px-2 py-4 lg:p-10 lg:min-h-screen h-full lg:mb-0 mb-10">
            <div className="max-w-3xl mx-auto p-2 lg:p-6 bg-white lg:shadow-md rounded-md">
                <h2 className="text-3xl font-extrabold mb-4">New order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="internalOrderId">Internal order no <span className="text-red-500">*</span></label>
                        <input
                            data-theme="light"
                            type="text"
                            id="internalOrderId"
                            name='internalOrderId'
                            onChange={handleInput}
                            value={order.internalOrderId}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            placeholder="Internal order number"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="pickupAddress">Pickup address <span className="text-red-500">*</span></label>
                        <select
                            onChange={handleInput}
                            value={order.pickupAddressIndex}
                            id="pickupAddressIndex"
                            name="pickupAddressIndex"
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-transparent border border-gray-300 rounded-md"
                        >
                            <option value="" disabled selected>Select pickup address</option>
                            {addresses?.map((address, index) => (
                                <option value={index} key={index}>{address.address}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="deliveryAddress">Delivery address <span className="text-red-500">*</span></label>
                        <input
                            data-theme="light"
                            type="text"
                            id="deliveryAddress"
                            name='deliveryAddress'
                            onChange={handleInput}
                            value={order.deliveryAddress}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            placeholder="Delivery address"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="pinCode">Delivery Pin code <span className="text-red-500">*</span></label>
                        <input
                            data-theme="light"
                            type="text"
                            id="pinCode"
                            name='pinCode'
                            onChange={handleInput}
                            value={order.pinCode}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            placeholder="Delivery Pin code"
                            required
                        />
                    </div>
                    <h3 className="text-lg tracking-tight font-bold mb-2">Customer details</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="customerName">Customer name <span className="text-red-500">*</span></label>
                            <input
                                data-theme="light"
                                type="text"
                                id="customerName"
                                name='customerName'
                                value={order.customerName}
                                onChange={handleInput}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                placeholder="Enter customer name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="customerPhoneNo">Customer phone no. <span className="text-red-500">*</span></label>
                            <input
                                data-theme="light"
                                type="tel"
                                id="customerPhoneNo"
                                name='customerPhoneNo'
                                onChange={handleInput}
                                value={order.customerPhoneNo}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                placeholder="Enter customer phone no."
                                required
                            />
                        </div>
                    </div>

                    <h3 className="text-lg tracking-tight font-bold mb-2">Order details</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="items">Number of items <span className="text-red-500">*</span></label>
                            <input
                                data-theme="light"
                                type="text"
                                id="items"
                                name='items'
                                onChange={handleInput}
                                value={order.items}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                placeholder="No. of items"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="weight">Weight (in kg)<span className="text-red-500">*</span></label>
                            <select
                                data-theme="light"
                                id="weight"
                                name='weight'
                                onChange={handleInput}
                                value={order.weight}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required>
                                <option value={""} disabled selected>Select order weight</option>
                                {charges?.map((charge, index) => (
                                    <option value={index} key={index}>{charge.weightRange}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h3 className="text-lg tracking-tight font-bold mb-2">Money operation</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="uses-per-customer">Type <span className="text-red-500">*</span></label>
                        <select
                            data-theme="light"
                            id="uses-per-customer"
                            name='type'
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        >
                            <option value="cod">Collect cash on delivery</option>
                            <option value="paid">Already Paid</option>
                        </select>
                    </div>
                    {type === "cod" ?
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="amountToCollect">Amount to collect <span className="text-red-500">*</span></label>
                            <input
                                data-theme="light"
                                type="number"
                                id="amountToCollect"
                                name='amountToCollect'
                                onChange={handleInput}
                                value={order.amountToCollect}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                placeholder="₹ Enter amount"
                                required
                            />
                        </div>
                        :
                        null
                    }
                    <div className="mb-4 grid grid-cols-2 gap-4">

                        <div>
                            <p className="w-full mt-6 font-semibold rounded-lg">Delivery charges</p>
                            <b className="w-full text-3xl font-bold rounded-lg">₹{order.deliveryCharges}</b>
                        </div>
                        <button type="submit" className="w-full py-3 px-2 mt-6 bg-[#FFB500] text-slate-900 font-bold rounded-full hover:bg-yellow-400">
                            {isLoading ? <span className="loading loading-spinner loading-md"></span> : "Create order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateOrder