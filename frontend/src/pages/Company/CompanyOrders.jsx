import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import CompanyOrdermobile from './CompanyOrdermobile';
import dateFormat from "dateformat";
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'

function CompanyOrders() {

    const { companyData, isLoading } = useAuth()
    const navigate = useNavigate();
    const [orders, setOrders] = useState([])

    const getAllOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-company-orders/${companyData._id}`, {
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
        }
    }

    useEffect(() => {
        if (companyData?._id) {
            getAllOrders()
        }
    }, [companyData])

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.text('Delivery Partner Order List', 14, 15);

        const tableColumn = [
            'Order ID',
            'Customer Name',
            'Earning',
            'Payment Mode',
            'Date',
            'Status'
        ];

        const tableRows = [];

        orders.forEach(order => {
            const orderData = [
                order._id,
                order.customerName,
                `Rs. ${order.deliveryCharges}`,
                order.paymentMode.toUpperCase(),
                order.createdAt.split("T")[0],
                order.orderStatus
            ];
            tableRows.push(orderData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8, cellWidth: 'wrap' },
            headStyles: { fillColor: [22, 160, 133] }, // teal header
        });

        doc.save('order-list.pdf');
    };

    if (isLoading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <>
            <section className='flex-grow min-h-dvh h-full lg:h-dvh lg:pb-0 pb-20'>
                <div className='lg:my-10 my-5 mx-3 lg:mx-5'>
                    <div className='flex justify-between lg:gap-5'>
                        <div className='flex justify-between lg:justify-start gap-5'>
                            <h2 className='text-xl lg:text-3xl text-slate-900 font-extrabold lg:ml-4 tracking-tight'>All Orders</h2>
                            <Link to="../create-order"><h2 className='text-sm lg:text-md font-bold bg-[#FFB500] text-slate-950 rounded-xl px-3 py-2 lg:py-3 tracking-tighter'>Create new order</h2></Link>
                        </div>
                        <button onClick={generatePDF} className="px-3 py-2 text-sm text-white font-bold rounded-lg bg-[#198c36]">Download PDF</button>
                    </div>
                </div>

                {orders.length === 0 ?

                    <div className='w-full mt-20'>
                        <div className='flex justify-center items-center'>
                            <img className='h-40 w-40' src="/order.png" alt="" />
                        </div>
                        <h1 className='text-center text-3xl font-semibold tracking-tighter text-gray-700 mt-3'>No orders yet!</h1>
                    </div>
                    :
                    <>
                        {/* Mobile View of Orders */}
                        < div className='mx-5 flex flex-row lg:hidden'>
                            <CompanyOrdermobile orders={orders} />
                        </div>

                        {/* Desktop View of Orders */}
                        <div className='px-5'>
                            <div className="overflow-x-auto mt-7 hidden lg:block">
                                <table className="min-w-full text-xs">
                                    <colgroup>
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                    </colgroup>
                                    <thead className="bg-gray-100">
                                        <tr className="text-left">
                                            <th className="p-3 text-base tracking-tighter">Order ID</th>
                                            <th className="p-3 text-base tracking-tighter">Date</th>
                                            <th className="p-3 text-base tracking-tighter">Items</th>
                                            <th className="p-3 text-base tracking-tighter">Payment Mode</th>
                                            <th className="p-3 text-base tracking-tighter">Amount to collect</th>
                                            <th className="p-3 text-base tracking-tighter">Delivery Charges</th>
                                            <th className="p-3 text-base tracking-tighter">Allotted</th>
                                            <th className="p-3 text-base tracking-tighter">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, idx) => (
                                            <tr key={idx} className="border-b border-opacity-20 border-gray-300 bg-white">
                                                <td className="p-3 text-base tracking-tight">
                                                    <Link to={"/company/orders/" + order?._id} className='underline font-semibold'>{"#" + order?._id}</Link>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p>{dateFormat(order?.createdAt, "mediumDate")}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p>{order?.items}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <span className="bg-green-200 px-2 text-green-700 font-bold tracking-tighter py-1">
                                                        <span>{order?.paymentMode?.toUpperCase()}</span>
                                                    </span>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p className='font-bold tracking-tight'>{"Rs. " + order?.amountToCollect}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p className='font-bold tracking-tight'>{"Rs. " + order?.deliveryCharges}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p className='font-bold tracking-tight'>{order?.isOrderAllotted ? "Yes" : "No"}</p>
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
                                                                : order?.orderStatus === 'rto' ?
                                                                    <p className='text-red-600 py-1 bg-red-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                                                    :
                                                                    <p className='text-green-600 py-1 bg-green-100 font-bold tracking-tighter text-center'>{order?.orderStatus}</p>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                }
            </section >
        </>
    )
}

export default CompanyOrders