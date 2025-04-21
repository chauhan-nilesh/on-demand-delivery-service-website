import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/auth';
import dateFormat from 'dateformat';

function PartnerPayments() {
    const { partnerData, isLoading } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [pendingPayout, setPendingPayout] = useState()

    const allTransactions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payout/get-partner-payouts/${partnerData._id}`, {
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
    
    const getWeeklyEarning = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get-week-earning/${partnerData._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();
                setPendingPayout(data.weeklyEarnings)
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (partnerData) {
            allTransactions()
            getWeeklyEarning()
        }
    }, [partnerData])

    if (isLoading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
            <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Payments</h2>
                <div className='p-3 mt-5 rounded-2xl bg-blue-950 text-white'>
                    <p>All payouts will be automatically settled to your bank account <span className='font-bold'>every week on Wednesday.</span></p>
                </div>
                <h3 className='mt-5 font-extrabold text-xl'>Current Week Details</h3>
                <div className='flex justify-between gap-3 mt-3'>
                    <div className='p-3 rounded-2xl w-full bg-yellow-400'>
                        <h3 className='font-semibold text-sm lg:text-base'>Pending Payout</h3>
                        <p className='font-bold text-xl lg:text-3xl mt-2'>&#8377; {pendingPayout}</p>
                    </div>
                    <div className='p-3 rounded-2xl w-full bg-green-400'>
                        <h3 className='font-semibold text-sm lg:text-base'>Payment Received</h3>
                        <p className='font-bold text-xl lg:text-3xl mt-2'>&#8377; 0</p>
                    </div>
                </div>
                {transactions?.length !== 0 ?
                    <>
                        <h3 className='mt-5 font-extrabold text-xl'>Payout History</h3>
                        <div className="lg:overflow-auto overflow-scroll mt-3">
                            <table className="min-w-full text-xs">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead className="bg-gray-100">
                                    <tr className="text-left">
                                        <th className="p-3 text-base tracking-tighter min-w-36">Payout Week</th>
                                        <th className="p-3 text-base tracking-tighter">Payment Method</th>
                                        <th className="p-3 text-base tracking-tighter">Transaction No.</th>
                                        <th className="p-3 text-base tracking-tighter min-w-36">Date</th>
                                        <th className="p-3 text-base tracking-tighter">Amount</th>
                                        <th className="p-3 text-base tracking-tighter">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction, index) => 
                                    // {
                                    //     if (transaction?.status === "pending") {
                                    //         return 
                                            (
                                                <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-white">
                                                    <td className="p-3 text-base tracking-tight">
                                                        <p>{dateFormat(transaction?.paymentWeekStart, "dd mmm") + " - " + dateFormat(transaction?.paymentWeekEnd, "dd mmm")}</p>
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
                                                        <p>{transaction?.status === "pending" ? <span className='text-orange-500 font-semibold'>Pending</span> : <span className='text-green-600 font-semibold'>Paid</span>}</p>
                                                    </td>
                                                </tr>
                                            )
                                    //     }
                                    // }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                    : <></>
                }

            </div>
        </section>
    )
}

export default PartnerPayments