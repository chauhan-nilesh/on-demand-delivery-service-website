import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const PartnerDetails = () => {
    const { id } = useParams()
    const [partner, setPartner] = useState(null);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPartnerDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/partner-details/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch partner details");
            }
            const data = await response.json();
            setPartner(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching partner data:", error);
        }
    };

    const updatePartnerStatus = async (statusData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/update-partner/${id}/status`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...statusData}),
            });
            const updatedPartner = await response.json();
            if (!response.ok) {
                toast.error(updatedPartner.message)
                throw new Error("Failed to update partner status");
            }
            fetchPartnerDetails()
            toast.success(updatedPartner.message)
        } catch (error) {
            console.error("Error updating partner status:", error);
        }
    };

    const handleApprove = async () => {
        await updatePartnerStatus({ isDocumentVerified: true });
    };

    const handleReject = async () => {
        if (note.trim()) {
            await updatePartnerStatus({ isDocumentVerified: false, rejected: true, rejectionNote: note });
        } else {
            toast.error("Please provide a rejection note.");
        }
    };

    const handleNoteChange = (e) => setNote(e.target.value);

    useEffect(() => {
        fetchPartnerDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-10 text-xl font-medium">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Delivery Partner Details
            </h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Partner Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <p><span className="font-medium">Email:</span> {partner.email}</p>
                        <p><span className="font-medium">Full Name:</span> {partner.fullName}</p>
                        <p><span className="font-medium">Mobile Number:</span> {partner.mobileNo}</p>
                        <p><span className="font-medium">Job Type:</span> {partner.jobType}</p>
                        <p><span className="font-medium">Address:</span> {partner.address}</p>
                        <p><span className="font-medium">Location:</span> {partner.city}, {partner.state}, {partner.area}</p>
                        <p><span className="font-medium">Earnings:</span> ₹{partner.earning}</p>
                        <p><span className="font-medium">Status:</span> {partner.status}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Uploaded Documents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        {partner.documentFile && (
                            <div className="bg-gray-100 rounded-lg p-2 shadow-md">
                                <p className="font-medium mb-2">Document File:</p>
                                <img src={"http://localhost:3000/"+partner.documentFile} alt="Document" className="rounded-lg w-full object-cover" />
                            </div>
                        )}
                        {partner.drivingLicense && (
                            <div className="bg-gray-100 rounded-lg p-2 shadow-md">
                                <p className="font-medium mb-2">Driving License:</p>
                                <img src={"http://localhost:3000/"+partner.drivingLicense} alt="Driving License" className="rounded-lg w-full object-cover" />
                            </div>
                        )}
                        {partner.personalPhoto && (
                            <div className="bg-gray-100 rounded-lg p-2 shadow-md">
                                <p className="font-medium mb-2">Personal Photo:</p>
                                <img src={"http://localhost:3000/"+partner.personalPhoto} alt="Personal Photo" className="rounded-lg w-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Verification Status</h2>
                    {partner.isDocumentVerified ? (
                        <p className="mt-4 text-green-600 font-medium">Documents are verified.</p>
                    ) : (
                        <div className="mt-4">
                            <p className="mb-2 text-yellow-600 font-medium">Documents are not verified.</p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                                    onClick={handleApprove}
                                >
                                    Approve
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                                    onClick={handleReject}
                                >
                                    Reject
                                </button>
                            </div>
                            <textarea
                                value={note}
                                onChange={handleNoteChange}
                                placeholder="Write a rejection note (visible to partner)"
                                className="mt-4 w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-red-500"
                            ></textarea>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerDetails;
