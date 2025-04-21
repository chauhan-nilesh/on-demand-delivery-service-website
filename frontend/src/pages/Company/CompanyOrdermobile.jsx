import React from 'react'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'

function CompanyOrdermobile({ orders }) {

    return (
        <div className='w-full'>
            {orders.map((order, idx) => (
                <div key={idx} className='bg-gray-50 shadow-md p-4 w-full rounded-md mt-3'>
                    <Link to={"/company/orders/" + order?._id}>
                        <div className='flex mb-3 justify-between'>
                            <div className='p-2'>
                                <h3 className='font-semibold text-base text-wrap tracking-tighter truncate'>#{order._id}</h3>
                                <p className='text-gray-600 text-xs'>Order date: {dateFormat(order.createdAt, "mediumDate")}</p>
                                <p className='text-gray-600 text-sm'>Items: {order.items}</p>
                                <p className='text-gray-600 text-sm'>Amount to collect:  &#8377;{order.amountToCollect}</p>
                            </div>
                            <div className='p-2'>
                                <p className='font-bold text-lg tracking-tighter text-right'>Delivery: &#8377;{order.deliveryCharges}</p>
                                <div className='mt-4'>
                                    <h3 className='font-bold tracking-tight px-2 py-1 rounded-full bg-green-400 text-green-800 text-center'>{order?.paymentMode?.toUpperCase()}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between border-zinc-300 border-t-2 pt-2 px-2'>
                            {order?.orderStatus === 'Waiting' ?
                                <p className='text-orange-600 font-bold tracking-tighter'>{order?.orderStatus}</p>
                                :
                                order?.orderStatus === 'Accepted' ?
                                    <p className='text-yellow-600 font-bold tracking-tighter'>{order?.orderStatus}</p>
                                    :
                                    order?.orderStatus === 'Picked' ?
                                        <p className='text-violet-800 font-bold tracking-tighter'>{order?.orderStatus}</p>
                                        :
                                        order?.orderStatus === 'rto' ?
                                            <p className='text-red-600 font-bold tracking-tighter'>{order?.orderStatus}</p>
                                            :
                                            <p className='text-green-600 font-bold tracking-tighter'>{order?.orderStatus}</p>
                            }
                            {order?.isOrderAllotted ?
                                <h3 className='font-bold tracking-tight px-2 bg-green-400 text-slate-900'>Allotted</h3>
                                :
                                <h3 className='font-bold tracking-tight px-2 bg-yellow-400 text-slate-900'>Not Allotted</h3>
                            }
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default CompanyOrdermobile