import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from 'react';

export default function Home() {
    const [track, setTrack] = useState(""); 
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/track/${track}`)
    };

    return (
        <div>
            <div className="mx-auto w-full max-w-7xl">
                <aside className="relative overflow-hidden text-slate-950 rounded-lg sm:mx-16 mx-2 lg:py-8 py-0">
                    <div className="relative z-10 max-w-screen-xl px-4 pb-20 pt-10 sm:py-24 lg:py-10 mx-auto sm:px-6 lg:px-8">
                        <div className="max-w-xl sm:mt-1 mt-80 space-y-8 text-center sm:text-right sm:ml-auto">
                            <h2 className="text-4xl font-bold sm:text-5xl tracking-tight">
                                India's Fastest Growing End-to-End Logistics Provider
                                <br />
                                <span className="mt-4 sm:block text-2xl lg:text-2xl font-normal font-sans tracking-tight">
                                    Your partner for seamless business
                                </span>
                                <span className="sm:block text-2xl lg:text-2xl font-normal font-sans">
                                    &nbsp;operations and dynamic growth
                                </span>
                            </h2>

                           
                            <div className="hidden lg:flex items-center lg:w-[100%] shadow-md bg-white h-24 lg:h-32 space-x-7 p-4 lg:p-8 rounded-[20px] lg:rounded-[30px] mt-4">
                                <input
                                    type="text"
                                    placeholder="Order ID"
                                    className="w-4/5 h-14 px-4 rounded-lg bg-white outline-none border-2 border-[#E2E5EA]"
                                    name="awbNumber"
                                    value={track}
                                    onChange={(e) => setTrack(e.target.value)}
                                />
                                <div className="flex justify-center items-center gap-2 lg:p-3 p-2 bg-theme-orange rounded-lg w-60 xl:w-56 cursor-pointer">
                                    <button
                                        className="font-bold rounded-lg px-3 py-3 bg-[#FFB500] text-[14px] xl:text-base"
                                        onClick={handleSubmit}
                                    >
                                        Track Shipment
                                    </button>
                                </div>
                            </div>

                          
                            <div className="lg:hidden flex">
                                <input
                                    type="text"
                                    value={track}
                                    onChange={(e) => setTrack(e.target.value)}
                                    placeholder="Order ID"
                                    className="lg:hidden text-xl flex w-full h-14 p-[10px] rounded-lg shadow-md outline-none text-[14px] public-sans"
                                    name="awbNumber"
                                />
                            </div>
                            <div className="lg:hidden flex justify-center items-center text-xl rounded-lg bg-[#FFB500] cursor-pointer mt-2 py-2">
                                <button
                                    onClick={handleSubmit}
                                    className="p-[10px] lg:hidden font-bold text[16px] text-theme-text"
                                >
                                    Track Shipment
                                </button>
                            </div>
                        </div>
                    </div>

                    
                    <div className="absolute inset-0 w-full h-full">
                        <img className="w-[400px]" src="/delivery-man.png" alt="image1" />
                    </div>
                </aside>
            </div>

           
            <div className="h-full w-full bg-yellow-200 py-8">
                <h3 className="font-bold text-lg text-yellow-800 lg:text-2xl text-center mb-8">
                    FEATURES
                </h3>
                <div className="flex justify-center items-center mx-auto">
                    <div className="h-full w-full mx-10 lg:mx-0 lg:flex justify-evenly items-center">
                        
                        <div className="bg-violet-50 h-full lg:w-80 p-8 rounded-2xl">
                            <div className="flex justify-center items-center">
                                <img className="h-40" src="/role-dashboard.png" alt="" />
                            </div>
                            <h3 className="text-center text-xl font-bold py-2">Role-Based Dashboard</h3>
                            <p className="text-justify font-semibold text-zinc-600">
                            Quick-Commerce can post and track delivery requests, while delivery partners can view and accept jobs through a user-friendly dashboard. This structured interface ensures smooth workflow management for both parties.
                            </p>
                        </div>

                        <div className="bg-violet-50 h-full lg:w-80 p-8 rounded-2xl lg:mt-0 mt-10">
                            <div className="flex justify-center items-center">
                                <img className="h-36" src="/notify.png" alt="" />
                            </div>
                            <h3 className="text-center text-xl font-bold py-2">Seamless Order Alert</h3>
                            <p className="text-justify font-semibold text-zinc-600">
                            Delivery partners receive instant WhatsApp notifications for new jobs, allowing them to view order details and accept or reject requests with a single click. This simplifies the process and eliminates the need for additional apps.
                            </p>
                        </div>

                        <div className="bg-violet-50 h-full lg:w-80 p-8 rounded-2xl lg:mt-0 mt-10">
                            <div className="flex justify-center items-center">
                                <img className="h-36" src="/real-time-order.png" alt="" />
                            </div>
                            <h3 className="text-center text-xl font-bold py-2">Real-Time Order Allocation</h3>
                            <p className="text-justify font-semibold text-zinc-600">
                            Quick-Commerce can instantly post delivery requests, and available delivery partners receive real-time notifications. The first partner to accept the request gets assigned the job, ensuring quick and efficient deliveries with minimal delays.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
