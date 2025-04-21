import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useAuth } from "../../store/auth";

const COLORS = ["#00C49F", "#FFBB28", "#0088FE"];

const CompanyReport = () => {
    const { companyData, isLoading } = useAuth();
    const [barData, setBarData] = useState([
        { day: "Sun", count: 50 },
        { day: "Mon", count: 78 },
        { day: "Tue", count: 85 },
        { day: "Wed", count: 90 },
        { day: "Thr", count: 70 },
        { day: "Fri", count: 88 },
        { day: "Sat", count: 84 },
    ]);
    const [lineData, setLineData] = useState([
        { month: "Jan", count: 50 },
        { month: "Feb", count: 60 },
        { month: "Mar", count: 75 },
        { month: "Apr", count: 80 },
        { month: "May", count: 65 },
        { month: "Jun", count: 85 },
    ]);
    // const [pieData, setPieData] = useState([
    //     { name: "Delivered", value: 50 },
    //     { name: "RTO", value: 30 },
    // ]);

    // const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    //     const RADIAN = Math.PI / 180;
    //     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    //     const x = cx + radius * Math.cos(-midAngle * RADIAN);
    //     const y = cy + radius * Math.sin(-midAngle * RADIAN);

    //     return (
    //         <text
    //             x={x}
    //             y={y}
    //             fill="white"
    //             textAnchor={x > cx ? "start" : "end"}
    //             dominantBaseline="central"
    //             style={{ fontWeight: "bold", fontSize: "12px" }}
    //         >
    //             {`${(percent * 100).toFixed(0)}%`}
    //         </text>
    //     );
    // };

    const getOrdersOfCurrentWeek = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-orders-current-week/${companyData?._id}`)

            if (response.ok) {
                const responseData = await response.json()
                setBarData(responseData.data)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch data")
        }
    }

    const getOrdersLastSixMonthsByCompany = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-orders-of-months/${companyData?._id}`)

            if (response.ok) {
                const responseData = await response.json()
                setLineData(responseData.data)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch data")
        }
    }

    console.log(lineData)

    useEffect(() => {
        if (companyData?._id) {
            getOrdersOfCurrentWeek()
            getOrdersLastSixMonthsByCompany()
        }
    }, [companyData])

    return (
        <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
            <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Reports</h2>
                {/* For Desktop Screen */}
                <div className='lg:grid grid-cols-1 mt-7 gap-5 lg:grid-cols-2 hidden'>
                    <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
                        <div className='flex items-center justify-between'>
                            {/* Bar Chart */}
                            <div style={{ marginBottom: "20px" }}>
                                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10'>Daily Orders</h3>
                                <BarChart width={500} height={300} data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" name="No. of orders" fill="#8884d8" />
                                </BarChart>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
                        <div className='flex items-center justify-between'>
                            {/* Line Chart */}
                            <div style={{ marginBottom: "20px" }}>

                                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10'>Month Wise Orders</h3>
                                <LineChart width={500} height={300} data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" name="No. of orders" stroke="#82ca9d" />
                                </LineChart>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='lg:grid grid-cols-1 mt-7 gap-5 lg:grid-cols-2 hidden'>
                    <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
                        <div className='flex items-center justify-between'>
                            
                            <div style={{ marginBottom: "20px" }}>
                                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10'>Daily Orders Delivery Performance</h3>
                                <PieChart width={500} height={300}>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label={renderCustomLabel}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: "#fff", color: "#000", borderRadius: "8px" }} />
                                </PieChart>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
                        <div className='flex items-center justify-between'>
                            
                            <div style={{ marginBottom: "20px" }}>
                                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10'>Wallet Spends</h3>
                                <LineChart width={500} height={300} data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="metric" name="Money Spends (in Rs.)" stroke="#fd9c15" />
                                </LineChart>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* For Mobile Screen */}
                <div className='grid grid-cols-1 mt-7 gap-5 lg:hidden'>
                    <div className='bg-white border-gray-200 border w-auto rounded-xl py-4'>
                        <div className='flex items-center justify-between'>
                            {/* Bar Chart */}
                            <div style={{ marginBottom: "20px" }}>
                                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10 mx-5'>Daily Orders</h3>
                                <BarChart width={350} height={300} data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" name="No. of orders" fill="#8884d8" />
                                </BarChart>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white border-gray-200 border w-auto rounded-xl py-4'>
                        <div className='flex items-center justify-between'>
                            {/* Line Chart */}
                            <div style={{ marginBottom: "20px" }}>

                                <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10 mx-5'>Month Wise Orders</h3>
                                <LineChart width={350} height={300} data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="metric" name="No. of orders" stroke="#82ca9d" />
                                </LineChart>
                            </div>
                        </div>
                    </div>
                </div>
            {/* <div className='grid grid-cols-1 mt-7 gap-5 lg:hidden'>
                <div className='bg-white border-gray-200 border w-auto rounded-xl py-4'>
                    <div className='flex items-center justify-between'>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10 mx-5'>Daily Orders Delivery Performance</h3>
                            <PieChart width={350} height={300}>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label={renderCustomLabel}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "#fff", color: "#000", borderRadius: "8px" }} />
                            </PieChart>
                        </div>
                    </div>
                </div>
                <div className='bg-white border-gray-200 border w-auto rounded-xl py-4'>
                    <div className='flex items-center justify-between'>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter mb-10 mx-5'>Wallet Spends</h3>
                            <LineChart width={350} height={300} data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="metric" name="Money Spends (in Rs.)" stroke="#fd9c15" />
                            </LineChart>
                        </div>
                    </div>
                </div>
            </div> */}
            </div>
        </section>
    );
};

export default CompanyReport;
