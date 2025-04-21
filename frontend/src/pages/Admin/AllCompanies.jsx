import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AllCompanies() {

    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const fetchAllCompanies = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-companies`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json()
            if (response.ok) {
                setCompanies(data.data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllCompanies()
    }, [])

    if (loading) {
        return <div className='flex h-dvh w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }

    return (
        <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
            <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>All Companies</h2>
                {companies?.length === 0 ?
                    <div className='w-full h-full flex items-center justify-center'>
                        <div className='flex justify-center mt-52'>
                            <div>
                                <img className='h-24 w-24 ml-[60px]' src="/transaction.png" alt="" />
                                <p className='font-bold mb-20'>No Company Registered Yet!</p>
                            </div>
                        </div>
                    </div>
                    :
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
                                <col />
                            </colgroup>
                            <thead className="bg-gray-100">
                                <tr className="text-left">
                                    <th className="p-3 text-base tracking-tighter">Name</th>
                                    <th className="p-3 text-base tracking-tighter">Email</th>
                                    <th className="p-3 text-base tracking-tighter">Mobile No.</th>
                                    <th className="p-3 text-base tracking-tighter">Business Type</th>
                                    <th className="p-3 text-base tracking-tighter">Email Verified</th>
                                    <th className="p-3 text-base tracking-tighter">Document Verified</th>
                                    <th className="p-3 text-base tracking-tighter">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company, index) =>
                                    <tr key={index} className="border-b border-opacity-20 border-gray-300 bg-white">
                                        <td className="p-3 text-base tracking-tight">
                                            <p>{company?.name}</p>
                                        </td>
                                        <td className="p-3 text-base tracking-tight">
                                            <p>{company?.email}</p>
                                        </td>
                                        <td className="p-3 text-base tracking-tight">
                                            <p>{company?.mobileNo}</p>
                                        </td>
                                        <td className="p-3 text-base tracking-tight">
                                            <p>{company?.businessType}</p>
                                        </td>
                                        <td className="p-3 text-base tracking-tight">
                                            <p>{company?.isEmailVerified ? <span className='text-green-600 font-semibold'>Yes</span> : <span className='text-red-600 font-semibold'>No</span>}</p>
                                        </td>
                                        <td className="p-3 text-base tracking-tight">
                                            <p>{company?.isDocumentVerified ? <span className='text-green-600 font-semibold'>Yes</span> : <span className='text-red-600 font-semibold'>No</span>}</p>
                                        </td>
                                        <td className="p-3 text-base tracking-tight">
                                            <p><button onClick={() => navigate(`/admin/companies/${company._id}`)} className='bg-yellow-400 font-semibold px-3 py-2 rounded-2xl shadow-md'>Details</button></p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </section>
    )
}

export default AllCompanies