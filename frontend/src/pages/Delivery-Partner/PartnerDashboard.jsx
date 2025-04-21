import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import PartnerQuicktable from '../../components/Delivery-Partner/Quicktable';

function PartnerDashboard() {

  const { partnerData, isLoading } = useAuth()
  const partnerToken = localStorage.getItem('partnerToken')
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [orderStatusCount, setOrderStatusCount] = useState({})
  const [status, setStatus] = useState(false)

  const getOrderStatusCount = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-partner-count/${id}`)

      const data = await response.json();
      if (response.ok) {
        setOrderStatusCount(data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (partnerData?._id) {
      getOrderStatusCount(partnerData._id)
      setStatus(partnerData?.status === "active" ? true : false)
    }
  }, [partnerData])

  const updateStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partner/update-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${partnerToken}`
        },
        body: JSON.stringify({
          status: !status
        })
      })
      if (response.ok) {
        const data = await response.json();
        setStatus(data.data.status === "active" ? true : false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  if (loading) {
    return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  return (
    <>
      <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
        <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
          <div className='flex justify-between'>
            <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Partner Dashboard</h2>
            <input
              data-theme='light'
              id='status'
              name='status'
              type="checkbox"
              className="toggle toggle-success text-red-600 mt-2"
              onChange={() => {
                setStatus(!status)
                updateStatus()
              }}
              checked={status}
            />
          </div>

          {partnerData?.rejected ?
            <div role="alert" className="alert mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Your application is <span className='text-red-700 font-bold'>Rejected</span></span>
              <Link to={"/partner/application"}>
                <button className="btn btn-sm btn-primary">View Application</button>
              </Link>
            </div>
            : partnerData?.isDocumentVerified ?
              null
              :
              <div data-theme="light" role="alert" className="alert mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Your account verification is under review. It will take 1 to 4 business days to be verified.</span>
                <Link to={"/partner/application"}>
                  <button className="bg-blue-600 text-white px-2 py-1 rounded font-semibold">View Status</button>
                </Link>
              </div>
          }

          <div className='grid grid-cols-2 mt-7 gap-5 lg:grid-cols-4 '>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Orders Received</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{partnerData?.orders?.length}</h2>
            </div>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Orders Pending</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{orderStatusCount?.pendingOrders}</h2>
            </div>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Orders Delivered</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{orderStatusCount?.deliveredOrders}</h2>
            </div>
            <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Total Earnings</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>&#8377;{partnerData?.earning}</h2>
            </div>
          </div>
          {/* <div className='grid grid-rows-2 grid-cols-none lg:grid-rows-none lg:grid-cols-2 gap-5 mt-8'> */}

          <div className='bg-white  border-gray-200 border w-full h-90 mt-4 lg:mt-7 p-5 rounded-xl'>
            <h2 className='text-xl lg:text-2xl font-bold mb-3 tracking-tighter'>Recent Orders</h2>
            {partnerData?.orders === 0 ?
              <div className='w-full h-full flex justify-center'>
                <div className='mt-5 lg:mt-10'>
                  <img className='h-20 w-20 ml-4' src="/order.png" alt="" />
                  <p className='font-bold'>No orders yet!</p>
                </div>
              </div>
              :
              <PartnerQuicktable />
            }
          </div>
        </div>
      </section >
    </>
  )
}

export default PartnerDashboard