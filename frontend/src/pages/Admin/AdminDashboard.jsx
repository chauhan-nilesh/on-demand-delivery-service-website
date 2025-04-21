import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import isTokenExpired from '../../Hooks/verifyJwtToken';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';
import AdminQuicktable from '../../components/Admin/Quicktable';

function AdminDashboard() {

  const { adminData, isLoading } = useAuth()
  const [data, setData] = useState({})
  const navigate = useNavigate();

  const getNumberOfData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/data-numbers`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json"
        }
      })

      const responseData = await response.json()
      if (response.ok) {
        setData(responseData?.data)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getNumberOfData()
  }, []);

  if (isLoading) {
    return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  return (
    <>
      <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
        <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
          <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Admin Dashboard</h2>
          
          <div className='grid grid-cols-2 mt-7 gap-5 lg:grid-cols-4 text-zinc-950'>
            <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>No. of Order Received</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.countOrders}</h2>
            </div>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Total Delivery Partners</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.countPartners}</h2>
            </div>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Total Companies</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.countCompanies}</h2>
            </div>
            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4'>
              <div className='flex justify-between'>
                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Operating Cities</h3>
              </div>
              {/* <p className='text-sm text-gray-500 tracking-tighter'>Last 30 days</p> */}
              <h2 className='overflow-hidden text-2xl mt-4 lg:text-4xl font-extrabold'>{data?.countOperatingCities}</h2>
            </div>
          </div>
          {/* <div className='grid grid-rows-2 grid-cols-none lg:grid-rows-none lg:grid-cols-2 gap-5 mt-8'> */}

          <div className='bg-white border-gray-200 border w-full h-90 mt-4 p-5 rounded-xl'>
            <h2 className='text-xl lg:text-3xl font-bold mb-3 tracking-tighter'>Recent Orders</h2>
            {"" === 0 ?
              <div className='w-full h-full flex justify-center'>
                <div className='mt-5 lg:mt-10'>
                  <img className='h-20 w-20 ml-2' src="/order.png" alt="" />
                  <p className='font-bold'>No orders yet</p>
                </div>
              </div>
              :
              <AdminQuicktable />
            }
          </div>
        </div>
      </section >
    </>
  )
}

export default AdminDashboard