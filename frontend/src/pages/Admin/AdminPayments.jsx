import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/auth';
import dateFormat from "dateformat";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AdminPayments() {
    const { partnerData, isLoading } = useAuth()
    const [transactions, setTransactions] = useState([])
    const navigate = useNavigate()

    const allTransactions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/get-all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();
                setTransactions(data.data)
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!isLoading) {
            allTransactions()
        }
    }, [isLoading])

    if (isLoading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
            <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Payments</h2>
                {transactions?.length === 0 ?
                    <div className='w-full h-full flex items-center justify-center'>
                    <div className='flex justify-center mt-52'>
                        <div>
                            <img className='h-24 w-24 ml-[40px]' src="/transaction.png" alt="" />
                            <p className='font-bold mb-20'>No Payment Made Yet!</p>
                        </div>
                    </div>
                </div>
                    :
                    <>
                        <div className="lg:overflow-auto overflow-scroll mt-4">
                            <table className="min-w-full text-xs">
                                <colgroup>
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
                                        <th className="p-3 text-xs lg:text-base tracking-tighter min-w-32">Payout Week</th>
                                        <th className="p-3 text-xs lg:text-base tracking-tighter">Delivery Partner</th>
                                        <th className="p-3 text-xs lg:text-base tracking-tighter">Payment Method</th>
                                        <th className="p-3 text-xs lg:text-base tracking-tighter">Transaction No.</th>
                                        <th className="p-3 text-xs lg:text-base tracking-tighter min-w-28">Date</th>
                                        <th className="p-3 text-xs lg:text-base tracking-tighter">Amount</th>
                                        <th className="p-3 text-xs lg:text-base tracking-tighter">Status</th>
                                        <th className="p-3 text-xs lg:text-base tracking-tighter">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction, index) =>
                                        <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-white">
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{dateFormat(transaction?.paymentWeekStart, "dd mmm")+" - "+dateFormat(transaction?.paymentWeekEnd, "dd mmm")}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.deliveryPartner?._id}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.paymentMethod ? transaction?.paymentMethod?.toUpperCase() : "----"}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.paymentTransactionNo ? transaction?.paymentTransactionNo : "----"}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{dateFormat(transaction?.updatedAt, "mediumDate")}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>Rs. {transaction?.amount}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                                <p>{transaction?.status === 'pending' ? <span className='text-orange-500 font-semibold'>Pending</span> : <span className='text-green-600 font-semibold'>Completed</span>}</p>
                                            </td>
                                            <td className="p-3 text-base tracking-tight">
                                            <p><button onClick={() => navigate(`/admin/partner-payment/${transaction?._id}`)} className='bg-yellow-400 font-semibold px-5 py-2 rounded-2xl'>{transaction?.status === 'pending' ? "Pay" : "View" }</button></p>
                                        </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                }

            </div>
        </section>
    )
}

export default AdminPayments