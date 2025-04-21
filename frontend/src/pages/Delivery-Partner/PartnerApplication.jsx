import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";

const PartnerApplication = () => {
    const { partnerData, isLoading } = useAuth()
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPartnerApplication = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partner/application-details/${partnerData._id}`);
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

    useEffect(() => {
        if (partnerData) {
            fetchPartnerApplication();
        }
    }, [isLoading]);

    if (isLoading || loading) {
        return <div className="text-center mt-10 text-xl font-medium">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                My Application
            </h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Application Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <p><span className="font-medium">Email:</span> {partner.email}</p>
                        <p><span className="font-medium">Full Name:</span> {partner.fullName}</p>
                        <p><span className="font-medium">Mobile Number:</span> {partner.mobileNo}</p>
                        <p><span className="font-medium">Job Type:</span> {partner.jobType}</p>
                        <p><span className="font-medium">Address:</span> {partner.address}</p>
                        <p><span className="font-medium">Location:</span> {partner.city}, {partner.state}, {partner.area}</p>
                        <p><span className="font-medium">Status:</span> {partner.status === "active" ? "Active" : "Inactive"}</p>
                        <p><span className="font-medium">Document Verification:</span> {partner.isDocumentVerified ? "Verified" : "Not Verified"}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Uploaded Documents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        {partner.documentFile && (
                            <div className="bg-gray-100 rounded-lg p-2 shadow-md">
                                <p className="font-medium mb-2">Document File:</p>
                                <img src={"http://localhost:3000/" + partner.documentFile} alt="Document File" className="rounded-lg w-full object-cover" />
                            </div>
                        )}
                        {partner.drivingLicense && (
                            <div className="bg-gray-100 rounded-lg p-2 shadow-md">
                                <p className="font-medium mb-2">Driving License:</p>
                                <img src={"http://localhost:3000/" + partner.drivingLicense} alt="Driving License" className="rounded-lg w-full object-cover" />
                            </div>
                        )}
                        {partner.personalPhoto && (
                            <div className="bg-gray-100 rounded-lg p-2 shadow-md">
                                <p className="font-medium mb-2">Personal Photo:</p>
                                <img src={"http://localhost:3000/" + partner.personalPhoto} alt="Personal Photo" className="rounded-lg w-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
                {partner.isDocumentVerified === false && partner.rejectionNote && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-red-600">Rejection Note</h2>
                        <p className="mt-2 bg-red-100 text-red-700 p-4 rounded-lg">{partner.rejectionNote}</p>
                    </div>
                )}
                {partner.isDocumentVerified && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-green-600">Your application is approved!</h2>
                        <p className="mt-2 text-green-700">Congratulations! You can now start taking orders.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerApplication;
