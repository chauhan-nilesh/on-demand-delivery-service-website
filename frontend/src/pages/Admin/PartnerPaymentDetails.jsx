import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dateFormat from "dateformat";
import toast from "react-hot-toast";

const PartnerPaymentDetails = () => {
    const { id } = useParams()
    const [partnerDetails, setPartnerDetails] = useState(null);
    const [transaction, setTransaction] = useState({})
    const [paymentMethod, setPaymentMethod] = useState("");
    const [transactionNo, setTransactionNo] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch partner details based on id (simulate API call)
        const fetchPartnerDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/get-transaction-details/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch partner details");
                }
                const data = await response.json();
                setTransaction(data.data)
                setPartnerDetails(data.data?.deliveryPartner);
                setPaymentMethod(data.data?.deliveryPartner?.paymentDetails?.type)
                setTransactionNo(data.data?.paymentTransactionNo)
            } catch (error) {
                console.error("Error fetching partner details:", error);
            }
        };

        fetchPartnerDetails();
    }, [id]);

    const handleSave = async () => {
        if (!paymentMethod || !transactionNo) {
            toast.error("Please enter transaction number.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/payment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    paymentMethod,
                    transactionNo,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update partner payment details");
            }

            toast.success("Payment details updated successfully!");
            navigate("/admin/payments")
        } catch (error) {
            console.error("Error updating payment details:", error);
        }
    };

    if (!partnerDetails) {
        return <div className="text-center mt-10 text-xl font-medium">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Partner Payment Details</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Partner Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <p><span className="font-medium">Name:</span> {partnerDetails.fullName}</p>
                        <p><span className="font-medium">Email:</span> {partnerDetails.email}</p>
                        <p><span className="font-medium">Mobile Number:</span> {partnerDetails.mobileNo}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Partner Payment Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <p><span className="font-medium">Payment Method:</span> {partnerDetails.paymentDetails?.type?.toUpperCase()}</p>
                        {partnerDetails?.paymentDetails?.type === 'upi' ?
                            <p><span className="font-medium">UPI ID:</span> {partnerDetails.paymentDetails?.upiId}</p>
                            :
                            <>
                                <p><span className="font-medium">Bank Name:</span> {partnerDetails.paymentDetails?.bankName}</p>
                                <p><span className="font-medium">IFSC:</span> {partnerDetails.paymentDetails?.ifsc}</p>
                                <p><span className="font-medium">Account Number:</span> {partnerDetails.paymentDetails?.accountNo}</p>
                                <p><span className="font-medium">Account Holder Name:</span> {partnerDetails.paymentDetails?.accountHolderName}</p>
                            </>
                        }
                        <p><span className="font-medium">Payout Week:</span> {dateFormat(transaction?.paymentWeekStart, "dd mmm") + " - " + dateFormat(transaction?.paymentWeekEnd, "dd mmm")}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Update Payment Details</h2>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <label htmlFor="paymentMethod" className="font-medium text-gray-900">Payment Method</label>
                        <select
                            id="paymentMethod"
                            name="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            disabled
                        >
                            <option value="">Select Payment Method</option>
                            <option value="bankTransfer">Bank Transfer</option>
                            <option value="upi">UPI</option>
                        </select>

                        <label htmlFor="transactionNo" className="font-medium text-gray-900">Transaction Number</label>
                        <input
                            type="text"
                            id="transactionNo"
                            name="transactionNo"
                            value={transactionNo}
                            onChange={(e) => setTransactionNo(e.target.value)}
                            placeholder="Enter Transaction Number"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none"
                        />
                    </div>
                </div>
                <div className="mt-4 mb-8 lg:mb-0">
                    <button
                        onClick={handleSave}
                        className="bg-[#FFB500] hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerPaymentDetails;
