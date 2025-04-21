import React from 'react'
import { Link } from 'react-router-dom'

function PartnerHeader() {
    return (
        <header className="py-2 px-1 lg:px-4 top-0 sticky text-slate-950 border-b border-gray-200 bg-white lg:hidden">
            <div className="container flex justify-between h-[55px]">
                <Link to="/partner/dashboard" className="flex items-center">
                    <img className='h-12' src="/logo.png" alt="Dashboard" />
                </Link>
            </div>
        </header>
    )
}

export default PartnerHeader