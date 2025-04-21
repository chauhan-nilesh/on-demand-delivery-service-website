import React, { useState } from "react";
import { useEffect } from "react";
import toast from 'react-hot-toast';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
    });

    useEffect(()=> {
        window.scrollTo(0, 0);
    }, [])
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partner/submit-contact-form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const responseData = await response.json();
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    subject: "",
                    message: "",
                })
                toast.success(responseData.message)
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 my-8 bg-white bg-transparent rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Contact us</h2>
            <p className="text-center text-gray-600 mb-6">
                Our team is happy to answer your questions. Fill out the form and we’ll
                be in touch as soon as possible.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Enter subject"
                        className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter your message"
                        className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#FFB500] text-white py-2 rounded-lg hover:bg-[#FFB500] focus:outline-none focus:ring focus:ring-[#FFB500]"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
