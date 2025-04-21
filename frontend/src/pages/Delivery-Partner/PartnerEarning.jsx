import React, { useEffect, useState } from 'react'
import { useAuth } from '../../store/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import axios from "axios";

function PartnerEarning() {

    const { partnerData, isLoading } = useAuth()
    const [activeTab, setActiveTab] = useState("today")
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    const [todayEarning, setTodayEarning] = useState(0)
    const [weeklyEarning, setWeeklyEarning] = useState(0)
    const [monthlyEarning, setMonthlyEarning] = useState(0)
    const [dates, setDates] = useState({})

    const currentDate = new Date();
    const day = currentDate.getDate(); // Day of the month (1-31)
    const month = currentDate.getMonth() + 1; // Month (0-11, adding 1 for 1-12)
    const year = currentDate.getFullYear(); // Year (e.g., 2025)
    const dayOfWeek = currentDate.toLocaleString("default", { weekday: "long" }); // Full name of the day (e.g., "Monday")

    const [barData, setBarData] = useState([
        { name: "Jan", performance: 50 },
        { name: "Feb", performance: 78 },
        { name: "Mar", performance: 85 },
        { name: "Apr", performance: 90 },
        { name: "May", performance: 70 },
        { name: "Jun", performance: 88 },
    ]);

    const [weekBarData, setWeekBarData] = useState([])

    const getOrdersByDate = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-partner-date/${partnerData._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();
                setData(data)
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getEarnings = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/partner/today-earning/${partnerData._id}`)
            if(response.statusText === "OK"){
                setTodayEarning(response.data.todayEarning)
                setWeeklyEarning(response.data.weeklyEarnings)
                setMonthlyEarning(response.data.monthlyEarnings)
                setDates({
                    weekRange: response.data.weekRange, 
                    monthRange: response.data.monthRange
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (month > 6) {
            setBarData([
                { name: "Jul", performance: 76 },
                { name: "Aug", performance: 84 },
                { name: "Sep", performance: 84 },
                { name: "Oct", performance: 84 },
                { name: "Nov", performance: 84 },
                { name: "Dec", performance: 84 },
            ])
        }

        setWeekBarData([
            { name: "Sun", performance: 50 },
            { name: "Mon", performance: 78 },
            { name: "Tue", performance: 85 },
            { name: "Wed", performance: 90 },
            { name: "Thr", performance: 88 },
            { name: "Fri", performance: 70 },
            { name: "Sat", performance: 88 },
        ])
    }, []);

    useEffect(() => {
        if (partnerData._id) {
            getOrdersByDate()
            getEarnings()
        }
    }, [partnerData])

    if (isLoading || loading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <>
            <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
                <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                    <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Earnings</h2>
                    <div className='flex lg:gap-3 bg-gray-100 p-3 mt-5 rounded-lg'>
                        <div onClick={(e) => setActiveTab("today")} className={`${activeTab === "today" ? "bg-black text-white" : "text-zinc-800"} px-4 py-2 cursor-pointer font-semibold rounded-xl`}>Today</div>
                        <div onClick={(e) => setActiveTab("week")} className={`${activeTab === "week" ? "bg-black text-white" : "text-zinc-800"} px-4 py-2 cursor-pointer font-semibold rounded-xl`}>Week</div>
                        <div onClick={(e) => setActiveTab("month")} className={`${activeTab === "month" ? "bg-black text-white" : "text-zinc-800"} px-4 py-2 cursor-pointer font-semibold rounded-xl`}>Month</div>
                        <div onClick={(e) => setActiveTab("allTime")} className={`${activeTab === "allTime" ? "bg-black text-white" : "text-zinc-800"} px-4 py-2 cursor-pointer font-semibold rounded-xl`}>All time</div>
                    </div>

                    {activeTab === "today" ?
                        <>
                            <h3 className='font-extrabold p-3 mt-5 text-2xl'>Today - {day + "/" + month + "/" + year}</h3>
                            <div className='p-3 mt-3 rounded-2xl bg-gray-100'>
                                <h3>Earnings</h3>
                                <p className='font-bold text-3xl'>&#8377; {todayEarning}</p>
                            </div>
                        </>
                        :
                        null}

                    {activeTab === "week" ?
                        <>
                         <h3 className='font-extrabold p-3 mt-5 text-2xl'>Week - {dates.weekRange}</h3>
                            <div className='p-3 mt-5 rounded-2xl bg-gray-100'>
                                <h3>Earnings</h3>
                                <p className='font-bold text-3xl'>&#8377; {weeklyEarning}</p>
                            </div>
                            {/* <div className='mt-10'>
                                <h3 className='text-2xl font-bold mb-7 lg:ml-5'>Year: {year}</h3>
                                <div
                                    style={{
                                        marginBottom: "20px",
                                        overflowX: "auto", // Enable horizontal scrolling
                                        maxWidth: "100%" // Ensure container fits screen width
                                    }}
                                    className='md:hidden block'
                                >
                                    <div style={{ minWidth: "200px" }}>
                                        <BarChart width={400} height={300} data={weekBarData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="performance" name="Earning (in Rs.)" fill="#FFB500" />
                                        </BarChart>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginBottom: "20px",
                                        overflowX: "auto", // Enable horizontal scrolling
                                        maxWidth: "100%" // Ensure container fits screen width
                                    }}
                                    className='hidden md:block'
                                >
                                    <div style={{ minWidth: "200px" }}>
                                        <BarChart width={500} height={300} data={weekBarData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="performance" name="Earning (in Rs.)" fill="#FFB500" />
                                        </BarChart>
                                    </div>
                                </div>
                            </div> */}
                        </>
                        : null}


                    {activeTab === "month" ?
                        <>
                         <h3 className='font-extrabold p-3 mt-5 text-2xl'>Month - {dates.monthRange}</h3>
                            <div className='p-3 mt-5 rounded-2xl bg-gray-100'>
                                <h3>Earnings</h3>
                                <p className='font-bold text-3xl'>&#8377; {monthlyEarning}</p>
                            </div>
                            {/* <div className='mt-10'>
                                <h3 className='text-2xl font-bold mb-7 lg:ml-5'>Year: {year}</h3>
                                <div
                                    style={{
                                        marginBottom: "20px",
                                        overflowX: "auto", // Enable horizontal scrolling
                                        maxWidth: "100%" // Ensure container fits screen width
                                    }}
                                    className='md:hidden block'
                                >
                                    <div style={{ minWidth: "200px" }}>
                                        <BarChart width={400} height={300} data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="performance" name="Earning (in Rs.)" fill="#FFB500" />
                                        </BarChart>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginBottom: "20px",
                                        overflowX: "auto", // Enable horizontal scrolling
                                        maxWidth: "100%" // Ensure container fits screen width
                                    }}
                                    className='hidden md:block'
                                >
                                    <div style={{ minWidth: "200px" }}>
                                        <BarChart width={500} height={300} data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="performance" name="Earning (in Rs.)" fill="#FFB500" />
                                        </BarChart>
                                    </div>
                                </div>
                            </div> */}
                        </>
                        : null}

                    {activeTab === "allTime" && <>
                        <div className='p-3 mt-5 rounded-2xl bg-gray-100'>
                            <h3>Earnings</h3>
                            <p className='font-bold text-3xl'>&#8377; {partnerData?.earning}</p>
                        </div>
                        <div className='mt-6 lg:mt-8'>
                            <div className='p-3 mt-2 lg:mt-5 bg-zinc-100 flex justify-between items-center'>
                                <div>
                                    <p className='font-semibold mt-2 text-lg'>No. of order</p>
                                    <p className='font-semibold mt-2 text-lg'>Pending</p>
                                    <p className='font-semibold mt-2 text-lg'>Delivered</p>
                                </div>
                                <div>
                                    <p className='font-bold mt-2 text-lg'>{data?.today?.todayOrders}</p>
                                    <p className='font-bold mt-2 text-lg'>{data?.today?.todayPendingOrders}</p>
                                    <p className='font-bold mt-2 text-lg'>{data?.today?.todayDeliveredOrders}</p>
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
            </section >
        </>
    )
}

export default PartnerEarning