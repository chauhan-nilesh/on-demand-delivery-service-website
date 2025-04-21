import { Fragment, useState } from 'react'
import {
    Dialog,
    DialogPanel,
    PopoverGroup,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../store/auth'

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    const { adminToken, partnerToken, companyToken } = useAuth()

    return (
        <header className="bg-white shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <img className="h-12 w-auto" src="/logo.png" alt="" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#FFB500]"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <NavLink to="/" className={({ isActive }) => `text-base font-semibold leading-6 ${isActive ? "text-[#FFB500]" : " text-zinc-900"}`}>
                        Home
                    </NavLink>
                    <NavLink to="track" className={({ isActive }) => `text-base font-semibold leading-6 ${isActive ? "text-[#FFB500]" : " text-zinc-900"}`}>
                        Track
                    </NavLink>
                    <NavLink to="contact" className={({ isActive }) => `text-base font-semibold leading-6 ${isActive ? "text-[#FFB500]" : " text-zinc-900"}`}>
                        Contact Us
                    </NavLink>
                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn">Login</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                                <Link to="/partner-login" className="text-sm font-semibold leading-6">
                                    Delivery Partner Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/company-login" className="text-sm font-semibold leading-6">
                                    Company Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin-login" className="text-sm font-semibold leading-6">
                                    Admin Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-yellow-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-10 w-auto"
                                src="/logo.png"
                                alt=""
                            />
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-[#FFB500]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-[#FFB500]/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    to="pricing"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-yellow-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Pricing</button>
                                </Link>
                                <Link
                                    to="terms-and-conditions"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-yellow-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>Terms & Conditions</button>
                                </Link>
                                <Link
                                    to="about-us"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-yellow-50"
                                >
                                    <button onClick={() => setMobileMenuOpen(false)}>About Us</button>
                                </Link>
                            </div>
                            <div className="py-6">
                                {adminToken ?
                                    <Link
                                        to="/seller/dashboard"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-yellow-50"
                                    >
                                        <button onClick={() => setMobileMenuOpen(false)}>
                                            Account
                                        </button>
                                    </Link>
                                    : <>
                                        {/* Registration Dropdown */}
                                        <div className="mb-4">
                                            <button
                                                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                                                className="flex justify-between w-full py-2 text-left text-base font-semibold bg-white rounded-lg focus:outline-none"
                                            >
                                                Register
                                                <span
                                                    className={`transform ${isCompanyOpen ? "rotate-180" : ""
                                                        } transition-transform`}
                                                >
                                                    ▼
                                                </span>
                                            </button>
                                            {isCompanyOpen && (
                                                <div className="mt-2 space-y-2 pl-4">
                                                    <div>
                                                        <Link to="/partner-register" className="text-sm font-semibold leading-6">
                                                            Delivery Partner
                                                        </Link>
                                                    </div>
                                                    <div>
                                                        <Link to="/company-register" className="text-sm font-semibold leading-6">
                                                            Company
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* Logins Dropdown */}
                                        <div className="mb-4">
                                            <button
                                                onClick={() => setIsServicesOpen(!isServicesOpen)}
                                                className="flex justify-between w-full py-2 text-left text-base font-semibold bg-white rounded-lg focus:outline-none"
                                            >
                                                Login
                                                <span
                                                    className={`transform ${isServicesOpen ? "rotate-180" : ""
                                                        } transition-transform`}
                                                >
                                                    ▼
                                                </span>
                                            </button>
                                            {isServicesOpen && (
                                                <div className="mt-2 space-y-2 pl-4">
                                                    <div>
                                                        <Link to="/partner-login" className="text-sm font-semibold leading-6">
                                                            Delivery Partner Login
                                                        </Link>
                                                    </div>
                                                    <div>
                                                        <Link to="/company-login" className="text-sm font-semibold leading-6">
                                                            Company Login
                                                        </Link>
                                                    </div>
                                                    <div>
                                                        <Link to="/admin-login" className="text-sm font-semibold leading-6">
                                                            Admin Login
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default Header;