import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const CompanyDetails = () => {
    const { id } = useParams()
    const [company, setCompany] = useState(null);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchCompanyDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/company-details/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch company details");
            }
            const data = await response.json();
            setCompany(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching company data:", error);
        }
    };

    const updateCompanyStatus = async (statusData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/update-company/${id}/status`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...statusData }),
            });
            const updatedCompany = await response.json();
            if (!response.ok) {
                toast.error(updatedCompany.message)
                throw new Error("Failed to update company status");
            }
            fetchCompanyDetails()
            toast.success(updatedCompany.message)
        } catch (error) {
            console.error("Error updating company status:", error);
        }
    };

    const handleApprove = async () => {
        await updateCompanyStatus({ isDocumentVerified: true });
    };

    const handleReject = async () => {
        if (note.trim()) {
            await updateCompanyStatus({ isDocumentVerified: false, rejected: true, rejectionNote: note });
        } else {
            toast.error("Please provide a rejection note.");
        }
    };

    const handleNoteChange = (e) => setNote(e.target.value);

    useEffect(() => {
        fetchCompanyDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-10 text-xl font-medium">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Company Details
            </h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Company Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <p><span className="font-medium">Email:</span> {company.email}</p>
                        <p><span className="font-medium">Name:</span> {company.name}</p>
                        <p><span className="font-medium">Business Type:</span> {company.businessType}</p>
                        <p><span className="font-medium">Mobile Number:</span> {company.mobileNo}</p>
                        <p><span className="font-medium">Address Line 1:</span> {company.address1}</p>
                        <p><span className="font-medium">Address Line 2:</span> {company.address2}</p>
                        <p><span className="font-medium">City:</span> {company.city}</p>
                        <p><span className="font-medium">State:</span> {company.state}</p>
                        <p><span className="font-medium">PIN Code:</span> {company.pinCode}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Documents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {company.gstCertificate && (
                            <div className="bg-gray-100 rounded-lg p-2 shadow-md">
                                <p className="font-medium mb-2">GST Certificate:</p>
                                <img
                                    src={"http://localhost:3000/"+company.gstCertificate}
                                    alt="GST Certificate"
                                    className="rounded-lg h-60 object-cover"
                                />
                            </div>
                        )}
                        <p><span className="font-medium">GST Number:</span> {company.gstNumber}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Approval Status</h2>
                    {company.isDocumentVerified ? (
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
                                placeholder="Write a rejection note (visible to company)"
                                className="mt-4 w-full p-3 outline-none rounded border border-gray-300 focus:ring-2 focus:ring-red-500"
                            ></textarea>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
