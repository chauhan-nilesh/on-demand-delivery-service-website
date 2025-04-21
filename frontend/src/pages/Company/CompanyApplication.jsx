import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";

const CompanyApplication = () => {
    const { companyData, isLoading } = useAuth()
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCompanyApplication = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company/application-details/${companyData._id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch application details");
            }
            const data = await response.json();
            setCompany(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching company application:", error);
        }
    };

    useEffect(() => {
        if (companyData?._id) {
            fetchCompanyApplication();
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
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Application Details</h2>
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
                        <p><span className="font-medium">Total Spend:</span> ₹{company.totalSpend || 0}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Uploaded Documents</h2>
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
                    <h2 className="text-2xl font-semibold text-gray-700">Application Status</h2>
                    {company.isDocumentVerified ? (
                        <p className="mt-4 text-green-600 font-medium">Your documents are verified!</p>
                    ) : (
                        <div className="mt-4">
                            <p className="text-yellow-600 font-medium">Documents not verified yet.</p>
                            {company.rejectionNote && (
                                <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg">
                                    <p className="font-medium">Rejection Note:</p>
                                    <p>{company.rejectionNote}</p>
                                </div>
                            )}
                        </div>
                    )}
                    {company.isEmailVerified ? (
                        <p className="mt-4 text-green-600 font-medium">Email is verified.</p>
                    ) : (
                        <p className="mt-4 text-yellow-600 font-medium">Email is not verified.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyApplication;
