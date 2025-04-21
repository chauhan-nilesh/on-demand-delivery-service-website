import React from 'react';
import { Link } from 'react-router-dom';

function CompanySettings() {
    return (

        <section className='bg-white flex-grow h-full min-h-dvh lg:h-dvh lg:pb-8 pb-20'>
            <div className='lg:my-10 my-5 mx-3 lg:mx-5'>
                <h2 className='text-3xl text-zinc-900 font-extrabold tracking-tightr'>Settings</h2>
                <div className='w-full grid grid-flow-row-dense lg:grid-cols-2 gap-4 mt-7'>
                    <Link to="/company/profile">
                        <div className='bg-gray-50 p-5'>
                            <div className='flex'>
                                <div className='flex justify-center items-center'>
                                    <img src="/person.png" alt="addresses" className='h-10' />
                                </div>
                                <div className='ml-4'>
                                    <h3 className='font-bold text-gray-800 text-xl'>Company Profile</h3>
                                    <p className='text-sm text-gray-500'>Add and manage stores address</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to="/company/addresses">
                        <div className='bg-gray-50 p-5'>
                            <div className='flex'>
                                <div className='flex justify-center items-center'>
                                    <img src="/address.png" alt="addresses" className='h-10' />
                                </div>
                                <div className='ml-4'>
                                    <h3 className='font-bold text-gray-800 text-xl'>Manage Store Address</h3>
                                    <p className='text-sm text-gray-500'>Add and manage stores address</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to="/company/change-password">
                        <div className='bg-gray-50 p-5'>
                            <div className='flex'>
                                <div className='flex justify-center items-center'>
                                    <img src="/change-password.png" alt="addresses" className='h-10' />
                                </div>
                                <div className='ml-4'>
                                <h3 className='font-bold text-gray-800 text-xl'>Change Password</h3>
                                <p className='text-sm text-gray-500'>Chnage Account passowrd</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to={"/logout"} className='mt-8 bg-red-600 text-center text-white py-3 font-semibold text-lg rounded-lg lg:hidden'>
                        Logout
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CompanySettings