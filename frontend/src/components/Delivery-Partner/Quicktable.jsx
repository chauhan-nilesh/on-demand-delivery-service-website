import React, { useEffect, useState } from 'react'
import { useAuth } from '../../store/auth'
import { Link } from 'react-router-dom'
import dateFormat from "dateformat";

function PartnerQuicktable() {
    const { partnerData, isLoading } = useAuth()
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])

    const getAllOrders = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-partner-orders/${partnerData._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();
                setOrders(data.data)
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isLoading) {
            if (partnerData._id) {
                getAllOrders()
            }
        }
    }, [isLoading])

    if (isLoading) {
        return <div className='flex h-full w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    if (loading) {
        return <div className='flex h-full w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className="overflow-x-auto">
            {orders.length > 0 ?
                <table className='table'>
                    <thead>
                        <tr>
                            <th className='text-slate-900'>Order ID</th>
                            <th className='text-slate-900 min-w-32'>Order Date</th>
                            <th className='text-slate-900'>Payment Method</th>
                            <th className='text-slate-900 min-w-20'>Delivery Charges</th>
                            <th className='text-slate-900 min-w-20'>Status</th>
                            <th className='text-slate-900'>Details</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {orders.map((order, index) => {
                            if (index < 4) {
                                return <tr key={index}>
                                    <td>
                                        <p>{order._id}</p>
                                    </td>
                                    <td>
                                        <p>{dateFormat(order?.createdAt, "mediumDate")}</p>
                                    </td>
                                    <td>
                                        <span className="bg-green-100 px-2 text-green-500 font-bold tracking-tighter py-1">
                                            <span>{order?.paymentMode?.toUpperCase()}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <p className='font-bold tracking-tight'>{"Rs. " + order?.deliveryCharges}</p>
                                    </td>
                                    <td className="p-3 text-base tracking-tight">
                                        {order?.orderStatus === 'Waiting' ?
                                            <p className='text-orange-600 py-1 bg-orange-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                            :
                                            order?.orderStatus === 'Accepted' ?
                                                <p className='text-yellow-600 py-1 bg-yellow-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                                :
                                                order?.orderStatus === 'Picked' ?
                                                    <p className='text-violet-800 py-1 bg-violet-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                                    : order?.orderStatus === 'Rejected' ?
                                                        <p className='text-red-600 py-1 bg-red-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                                        :
                                                        <p className='text-green-600 py-1 bg-green-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                        }
                                    </td>
                                    <td>
                                        <Link to={"/partner/orders/" + order?._id} className='p-2 rounded-lg font-bold text-slate-800 bg-[#FFB500] tracking-wide'>Details</Link>
                                    </td>
                                </tr>
                            }
                        })}
                    </tbody>
                </table>
                :
                <div className='flex justify-center items-center'>
                    <h3>No order received yet!</h3>
                </div>
            }
        </div>
    )
}

export default PartnerQuicktable