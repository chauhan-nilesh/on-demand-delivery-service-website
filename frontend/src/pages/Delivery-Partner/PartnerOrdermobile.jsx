import React from 'react'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'

function PartnerOrdermobile({ orders, partnerData }) {

    return (
        <div className='w-full'>
            {orders.map((order, idx) => (
                <div key={idx} className='bg-gray-50 shadow-md py-3 px-1 w-full rounded-md mt-3'>
                    <Link to={"/partner/orders/" + order?._id}>
                        <div className='flex mb-3 justify-between'>
                            <div className='p-2 max-w-40'>
                                <h3 className='font-semibold text-base text-wrap tracking-tighter'>#{order._id}</h3>
                                {/* <p className='text-gray-600 text-xs'></p> */}
                                <p className='text-gray-600 text-sm'>Pickup: {order?.pickupAddress?.text}</p>
                                <p className='text-gray-600 text-sm'>Delivery: {order?.deliveryAddress?.text}</p>
                            </div>
                            <div className='p-2'>
                                <p className='font-bold text-lg tracking-tighter text-right mb-4'>Delivery: &#8377;{order.deliveryCharges}</p>
                                {order?.orderStatus === 'Waiting' ?
                                    <p className='text-orange-600 p-1 bg-orange-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                    :
                                    order?.orderStatus === 'Accepted' ?
                                        <p className='text-yellow-600 py-1 bg-yellow-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                        :
                                        order?.orderStatus === 'Picked' ?
                                            <p className='text-violet-800 py-1 bg-violet-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                            :
                                            order?.orderStatus === 'Rejected' ?
                                                <p className='text-red-600 py-1 bg-red-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                                :
                                                <p className='text-green-600 py-1 bg-green-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                }
                            </div>
                        </div>
                        <div className='flex justify-between items-center border-zinc-300 border-t-2 pt-2 px-2'>
                            <div className='flex'>
                                <h3 className='font-semibold text-gray-500 tracking-tighter'>{dateFormat(order.createdAt, "mediumDate")}&nbsp;&nbsp;•&nbsp;&nbsp;</h3>
                                <h3 className='font-semibold text-gray-500 tracking-tighter'>{order?.paymentMode?.toUpperCase()}</h3>
                            </div>
                            <Link to={`/partner/navigate/${partnerData._id}/${order._id}`} className='flex justify-center items-center'>
                                <img src="/navigate.png" alt="navigate" className='h-4' />
                                <span className='font-bold text-red-600 ml-2'>Navigate</span>
                            </Link>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default PartnerOrdermobile