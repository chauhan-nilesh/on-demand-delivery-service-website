import React from 'react'
import { Link, NavLink } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="px-4 divide-y bg-slate-900 text-gray-100">
            <div className='flex justify-center items-center p-8'>
                <div>
                    <div className='flex justify-center items-center'>
                    <img className='h-20' src="/logo.png" alt="logo" />
                    </div>
                    <div className='mt-10'>
                        {/* <Link to="about-us"><p className='text-center text-xl font-bold'>About Us</p></Link> */}
                        <Link to="/"><p className='text-center text-xl font-bold mt-2'>Home</p></Link>
                        <Link to="track"><p className='text-center text-xl font-bold mt-2'>Track Orders</p></Link>
                        <Link to="contact"><p className='text-center text-xl font-bold mt-2'>Contact Us</p></Link>

                    </div>
                </div>
            </div>
            <div className="py-6 text-sm text-center text-gray-200">©2024 Company Co. All rights reserved.</div>
        </footer>
    );
}
