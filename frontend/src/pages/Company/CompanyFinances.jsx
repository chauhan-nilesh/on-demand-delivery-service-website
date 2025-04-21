import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';

function CompanyFinances() {

    const { companyData, isLoading } = useAuth()
    const [wallet, setWallet] = useState({})
    const [transactions, setTransactions] = useState([])
    const navigate = useNavigate();
    const [amount, setAmount] = useState()

    useEffect(() => {
        if(companyData?._id){
        ; (async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company/get-wallet/${companyData._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })

                if (response.ok) {
                    const data = await response.json();
                    setWallet(data.data)
                    setTransactions(data.data?.transactions?.reverse())
                } else {
                    toast.error("Failed to fetch data")
                }
            } catch (error) {
                console.log(error)
                toast.error("Failed to fetch data")
            }
        })()
    }
    }, [companyData])

    if (isLoading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <>
            <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
                <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                    <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Finances</h2>
                    <div className='bg-white border-gray-200 border w-full h-90 mt-4 lg:mt-7 px-5 py-3 rounded-xl'>
                        <h2 className='text-2xl lg:text-2xl font-bold mb-3 tracking-tighter'>Wallet</h2>
                        <div className='grid grid-cols-2 mt-7 gap-5 lg:grid-cols-3 '>
                            <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
                                <div className='flex justify-between'>
                                    <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Available Balance</h3>
                                </div>
                                <h2 className='overflow-hidden text-2xl mt-4 lg:mt-20 lg:text-4xl font-extrabold'>&#8377;{wallet?.avlBalance}</h2>
                            </div>
                            <div className='bg-white border-gray-200 border w-auto rounded-xl p-4'>
                                <div className='flex justify-between'>
                                    <h3 className='lg:text-xl text-base font-bold overflow-hidden tracking-tighter'>Total Amount Spend</h3>
                                </div>
                                <h2 className='overflow-hidden text-2xl mt-4 lg:mt-20 lg:text-4xl font-extrabold'>&#8377;{wallet?.totalSpend}</h2>
                            </div>
                            <div className='bg-white  border-gray-200 border w-auto rounded-xl p-4 hidden lg:block'>
                                <div className='flex justify-between'>
                                    <h3 className='lg:text-xl text-lg font-bold overflow-hidden tracking-tighter'>Add money to Wallet</h3>
                                </div>
                                <input
                                    type='number'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className='w-full mt-3 p-3 rounded-md border border-gray-300 outline-slate-900'
                                    placeholder='Enter Amount'
                                />
                                <div className='mt-3 flex justify-center items-center w-full'>
                                    <button onClick={(e) => {
                                        if (!amount || Number(amount) === 0) {
                                            toast.error("Invalid amount")
                                            return
                                        }
                                        const queryString = new URLSearchParams({ amt: amount, companyId: companyData._id, wallet: wallet._id })
                                        navigate(`/company/add-fund?${queryString}`)
                                    }} className='bg-[#FFB930] hover:bg-slate-50 hover:border-2 hover:border-[#FFB930] text-lg text-center px-3 py-3 font-extrabold w-full rounded-full'>Add Funds</button>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white mt-4 border-gray-200 border w-auto rounded-xl p-4 lg:hidden block'>
                            <div className='flex justify-between'>
                                <h3 className='lg:text-xl text-lg font-bold overflow-hidden tracking-tighter'>Add money to Wallet</h3>
                            </div>

                            <input
                                type='number'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className='w-full mt-3 p-3 rounded-md border border-gray-300 outline-slate-900'
                                placeholder='Enter Amount'
                            />
                            <div className='mt-3 flex justify-center items-center w-full'>
                                <button onClick={(e) => {
                                    if (!amount || Number(amount) === 0) {
                                        toast.error("Invalid amount")
                                        return
                                    }
                                    const queryString = new URLSearchParams({ amt: amount, companyId: companyData._id, wallet: wallet._id })
                                    navigate(`/company/add-fund?${queryString}`)
                                }} className='bg-[#FFB930] hover:bg-slate-50 hover:border-2 hover:border-[#FFB930] text-lg text-center px-3 py-3 font-extrabold w-full rounded-full'>Add Funds</button>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white  border-gray-200 border w-full h-90 mt-4 lg:mt-7 p-5 rounded-xl'>
                        <h2 className='text-xl lg:text-2xl font-bold mb-3 tracking-tighter'>Transactions</h2>
                        {transactions?.length === 0 ?
                            <div className='w-full h-full flex items-center justify-center'>
                                <div className='mt-5 lg:mt-10'>
                                    <img className='h-20 w-20 ml-[70px]' src="/transaction.png" alt="" />
                                    <p className='font-bold mb-20'>Not made any transaction yet!</p>
                                </div>
                            </div>
                            :
                            <div className="lg:overflow-auto overflow-scroll mt-7">
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
                                            <th className="p-3 text-base tracking-tighter">Transaction Id</th>
                                            <th className="p-3 text-base tracking-tighter">Transaction Date</th>
                                            <th className="p-3 text-base tracking-tighter">Type</th>
                                            <th className="p-3 text-base tracking-tighter">Status</th>
                                            <th className="p-3 text-base tracking-tighter">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions?.map((transaction, index) =>
                                            <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-white">
                                                <td className="p-3 text-base tracking-tight">
                                                    <p>{transaction._id}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p>{transaction.createdAt?.split("T")[0]}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p>{transaction?.type}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p>{transaction.status === "fail" ? <span className='text-red-600 font-semibold'>Failed</span> : <span className='text-green-600 font-semibold'>Success</span>}</p>
                                                </td>
                                                <td className="p-3 text-base tracking-tight">
                                                    <p>Rs. {transaction.amount}</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </section >
        </>
    )
}

export default CompanyFinances