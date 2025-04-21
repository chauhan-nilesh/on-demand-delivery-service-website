import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';

function DeliveryChargesAdmin() {
    const { adminData, adminAuthentication, isLoading } = useAuth()
    // Initial state for delivery charges
    const [charges, setCharges] = useState([
        { weightRange: "Less than 1kg", charge: 0 },
        { weightRange: "1-3kg", charge: 0 },
        { weightRange: "3-5kg", charge: 0 },
        { weightRange: "More than 5kg", charge: 0 },
    ]);
    const [loadingBtn, setLoadingBtn] = useState(false)
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (adminData?.deliveryRates) {
            setCharges(adminData?.deliveryRates)
        }
    }, [adminData])
    // Handle input changes for charges
    const handleChange = (index, value) => {
        const updatedCharges = [...charges];
        updatedCharges[index].charge = value;
        setCharges(updatedCharges);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingBtn(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/set-delivery-rates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ charges, adminId: adminData._id })
            })

            const responseData = await response.json()
            if (response.ok) {
                adminAuthentication()
                toast.success("Delivery charges updated successfully!")
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            setLoadingBtn(false)
        }
    };

    return (
        <section className='bg-white flex-grow h-full lg:min-h-dvh lg:h-dvh lg:pb-8 pb-20'>
            <div className='lg:my-10 my-5 mx-3 lg:mx-5'>
                <div className="max-w-xl mx-auto mt-10 lg:px-6 py-6 bg-white lg:shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">Set Delivery Charges</h1>
                    {successMessage && (
                        <p className="text-green-600 text-center mb-4">{successMessage}</p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {charges.map((charge, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <label className="text-lg font-medium">{charge.weightRange}:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={charge.charge}
                                    onChange={(e) => handleChange(index, parseFloat(e.target.value))}
                                    className="w-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB500]"
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#FFB500] text-slate-900 font-bold rounded-md shadow-md hover:bg-[#FFB500] transition duration-200"
                        >
                            Save Charges
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default DeliveryChargesAdmin;
