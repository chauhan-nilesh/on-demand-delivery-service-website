import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import dateFormat from "dateformat";

const TrackingDetails = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})

    const getOrderDetails = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-tracking-details/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();
                setData(data.data)
            } else {
                toast.error("Invalid Order ID")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getOrderDetails()
    }, []);

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className="h-full bg-gray-100 p-4 flex justify-center">
            <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
                {Object.keys(data).length !== 0 ?
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tracking Details</h1>
                        <div className="border-l-4 border-yellow-500 pl-[15px] space-y-4">

                            <div className="relative pb-6">
                                <div className={`absolute -left-6 w-4 h-4 rounded-full ${'bg-green-500'}`} />
                                <h2 className="font-bold text-gray-800 text-lg">Order Created</h2>
                                <p className="text-gray-600 text-md">{`Order Placed By ${data?.company?.name}`}</p>
                                <p className="font-semibold text-gray-600">{dateFormat(data?.createdAt, "d mmm yyyy, h:MM TT")}</p>
                            </div>

                            {data.orderStatus === "Waiting" ?
                                <div className="relative pb-6">
                                    <div className={`absolute -left-6 w-4 h-4 rounded-full ${data.orderStatus === "Waiting" || "Accepted" || "Picked" || "Delivered" ? 'bg-green-500' : 'bg-orange-500'}`} />
                                    <h2 className="font-bold text-gray-800 text-lg">Waiting</h2>
                                    <p className="text-gray-500 text-md font-semibold">{"Delivery Partner not assigned yet!"}</p>
                                </div>
                                :
                                <div className="relative pb-6">
                                    <div className={`absolute -left-6 w-4 h-4 rounded-full ${data.orderStatus === "Accepted" || "Picked" || "Delivered" ? 'bg-green-500' : 'bg-orange-500'}`} />
                                    <h2 className="font-bold text-gray-800 text-lg">Accepted</h2>
                                    {data.orderStatus === "Accepted" ?
                                        <p className="text-gray-600 text-md">{"Delivery Partner Assigned"}</p>
                                        : null
                                    }
                                </div>
                            }
                            <div className="relative pb-6">
                                <div className={`absolute -left-6 w-4 h-4 rounded-full ${data.orderStatus === "Picked" || data.orderStatus === "Delivered" ? 'bg-green-500' : 'bg-orange-500'}`} />
                                <h2 className="font-bold text-gray-800 text-lg">Picked</h2>
                                {data.orderStatus === "Picked" ?
                                    <p className="text-gray-600 text-md">{"Order is picked from pickup address"}</p>
                                    : null}
                            </div>

                            <div className="relative pb-6">
                                <div className={`absolute -left-6 w-4 h-4 rounded-full ${data.orderStatus === "Delivered" ? 'bg-green-500' : 'bg-orange-500'}`} />
                                <h2 className="font-bold text-gray-800 text-lg">Delivered</h2>
                                {data.orderStatus === "Delivered" ? <p className="font-semibold text-gray-600">{dateFormat(data?.updatedAt, "d mmm yyyy, h:MM TT")}</p> : null}
                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex justify-center items-center h-[400px]">
                        <p className="text-2xl">Order not found!</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default TrackingDetails;
