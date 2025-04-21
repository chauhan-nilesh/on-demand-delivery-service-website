import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';

const fetchOrderDetails = async (orderId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/get-data/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch order details");
    }
};

const AcceptOrder = () => {
    const { id } = useParams()
    const { partnerData, isLoading } = useAuth()
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const navigate = useNavigate()
    const [viewOrderBtn, setViewOrderBtn] = useState(false);

    useEffect(() => {
        fetchOrderDetails(id)
            .then(data => {
                setOrder(data.data);
                if (data.data?.isOrderAllotted) {
                    setStatusMessage("Order is already accepted by another partner.");
                    if (data.data?.partner === partnerData._id) {
                        setViewOrderBtn(true)
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch order details");
                setLoading(false);
            });
    }, [isLoading]);

    const handleOrder = async (status) => {
        if (order?.isOrderAllotted) {
            setStatusMessage("Order is already accepted by another partner.");
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/order/accept-order`, {
                orderId: id,
                partnerId: partnerData._id,
                status
            });
            if (response.statusText === "OK") {
                setStatusMessage(response.data.message);
                toast.success(response.data.message)
                fetchOrderDetails(id).then(data => {
                    setOrder(data.data);
                    if (data.data?.isOrderAllotted) {
                        setStatusMessage("Order is already accepted by another partner.");
                        if (data.data?.partner === partnerData._id) {
                            setViewOrderBtn(true)
                        }
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError("Failed to fetch order details");
                    setLoading(false);
                });
            } else {
                setStatusMessage(response.data.message);
                toast.success(response.data.message)
            }
        } catch (err) {
            setStatusMessage(`Error ${status === "Accepted" ? "accepting" : "rejecting"} order.`);
        };
    };

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-2xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-2xl font-semibold text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className='flex justify-center items-center '>
            <div className="container mx-auto bg-white rounded-lg p-8 space-y-6 mb-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Order Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div><strong>Order ID:</strong> #{order._id}</div>
                    <div><strong>Internal Order ID:</strong> {order.internalOrderId}</div>
                    <div><strong>Company:</strong> {order.company?.name}</div>
                    <div><strong>Items:</strong> {order.items}</div>
                    <div><strong>Weight:</strong> {order.weight}</div>
                    <div><strong>Amount to Collect:</strong> ₹{order.amountToCollect}</div>
                    <div><strong>Earning:</strong> ₹{order.deliveryCharges}</div>
                    <div><strong>Payment Mode:</strong> {order.paymentMode}</div>
                    <div><strong>Pickup Address:</strong> {order.pickupAddress?.text}</div>
                    <div><strong>Delivery Address:</strong> {order.deliveryAddress?.text}</div>
                    <div><strong>Pin Code:</strong> {order.pinCode}</div>
                    <div><strong>Customer Name:</strong> {order.customerName}</div>
                    <div><strong>Customer Phone No:</strong> {order.customerPhoneNo}</div>
                    <div><strong>Order Status: </strong>
                        <span className={`font-bold ${order.orderStatus === 'Accepted' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {order.orderStatus}
                        </span>
                    </div>
                </div>

                {!viewOrderBtn && (
                <div className="flex justify-center gap-6 mt-6">
                    <button
                        onClick={() => handleOrder("Accepted")}
                        disabled={order.orderStatus === "Accepted" || order.isOrderAllotted}
                        className={`px-8 py-3 font-medium text-white rounded-lg transition-all duration-200 ${order.orderStatus === "Accepted" || order.isOrderAllotted ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        Accept Order
                    </button>

                    <button
                        onClick={() => handleOrder("Rejected")}
                        disabled={order.orderStatus === "Accepted"}
                        className={`px-8 py-3 font-medium text-white rounded-lg transition-all duration-200 ${order.orderStatus === "Accepted" ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        Reject Order
                    </button>
                </div>
                )}

                {viewOrderBtn && (
                    <div className='w-full flex justify-center mt-6'>
                    <button
                        onClick={() => navigate(`/partner/orders/${order._id}`)}
                        className={`px-8 py-3 text-slate-800 font-bold rounded-lg transition-all duration-200 bg-[#FFB500] hover:bg-yellow-400`}
                    >
                        View Order Details
                    </button>
                    </div>
                )}

                {statusMessage && !viewOrderBtn && (
                    <div className="text-center mt-4 font-semibold text-lg text-gray-800">
                        <p>{statusMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptOrder;
