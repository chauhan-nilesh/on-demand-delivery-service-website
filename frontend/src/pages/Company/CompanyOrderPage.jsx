import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import dateFormat from "dateformat";
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth';
import { Dialog, Transition } from '@headlessui/react';

function CompanyOrderPage() {

    const { id } = useParams()
    let [isOpen, setIsOpen] = useState(false);
    let [openAccept, setOpenAccept] = useState(false);
    const [order, setOrder] = useState({})
    const [status, setStatus] = useState("")
    const [orderStatusId, setOrderStatusId] = useState('');
    const [selectedOption, setSelectedOption] = useState(false);
    const [loading, setLoading] = useState(true)

    const getOrderData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-data/${id}`)

            if (response.ok) {
                const responseData = await response.json()
                setOrder(responseData.data)
                setStatus(responseData.data.orderStatus)
            }
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getOrderData()
    }, [])

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const changeOrderStatus = async (e) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/update-status/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "Delivered" })
            })

            const responseData = await response.json()
            if (response.ok) {
                closeModal()
                toast.success(responseData.message)
                getOrderData()
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <div className='h-full mx-3 lg:mx-5 my-5 lg:my-8 mb-20'>
            <h2 className='text-xl lg:text-2xl font-bold'>View order details</h2>
            <h3 className='lg:text-lg font-bold mt-6'>Delivery Details</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2 flex justify-between'>
                <div>
                    <p className='text-slate-950 font-bold text-lg'>{order?.customerName}</p>
                    <p className='text-gray-600'>{order?.deliveryAddress?.text}</p>
                    <p className='tracking-tight text-base mt-3 flex'><img src="/call.png" alt="Phone" className='h-5' /><span className='font-bold text-green-500 ml-2'>{order?.customerPhoneNo}</span></p>
                </div>
                {/* <Link to={"/"} className=''>
                    <img src="/map.png" alt="Location" className='h-16' />
                    <p className='text-base font-semibold'>Navigate</p>
                </Link> */}
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Pickup Address</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2 text-zinc-900'>
                <p className='tracking-tight text-sm font-normal'>{order?.pickupAddress?.text}</p>
            </div>
            <h3 className='lg:text-lg font-bold mt-4'>Shipment Details</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2'>
                <b className='tracking-tighter'>Internal Order Number: <span className='font-normal'>{order?.internalOrderId}</span></b><br />
                <b className='tracking-tighter'>No. of items: <span className='font-normal'>{order?.items}</span></b><br />
            </div>

            <h3 className='lg:text-lg font-bold mt-4'>Payment infomation</h3>
            <div className='border border-gray-400 rounded-lg p-4 mt-2'>
                <div className='flex justify-between lg:justify-normal'>
                    <b className='tracking-tighter'>Amount to be collected: </b>&nbsp;&nbsp;
                    <p className='text-base font-extrabold text-green-800'>Rs. {order?.amountToCollect}</p>
                </div>
                {order?.paymentMode === "cod" ?
                    <div className='flex text-zinc-700'>    
                        <p className='text-base font-bold'>{order?.paymentMode?.toUpperCase()} (Cash on Delivery)</p>&nbsp;&nbsp;•&nbsp;&nbsp;
                        {order?.orderStatus === "Delivered" ? <p className='tracking-tighter text-green-600 font-semibold'>Paid</p> : <p className='tracking-tighter text-yellow-600 font-semibold'>Unpaid</p> }
                    </div>
                    :
                    <div className='flex text-zinc-700'>
                        <p className='tracking-tighter text-green-700 font-semibold'>{order?.paymentMode?.toUpperCase()}</p>
                    </div>
                }
            </div>
            
        </div>
    )
}

export default CompanyOrderPage