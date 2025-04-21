import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuth } from '../../store/auth';

function AdminRegister() {

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()
    const [loadingBtn, setLoadingBtn] = useState(false)

    const { storeAdminToken } = useAuth()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setUser({
            ...user,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(user.email === "" || user.password === "" || user.confirmPassword === ""){
            toast.error("All fields are required")
            return
        }
        if(user.password !== user.confirmPassword){
            toast.error("Password and confirm password is not matching")
            return
        }
        setLoadingBtn(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            setUser({
                email: "",
                password: "",
                confirmPassword: ""
            })

            const responseData = await response.json()
            if (response.ok) {
                toast.success(responseData.message)
                navigate("/admin-login")
            } else {
                toast.error(responseData.message)
            }
            setLoadingBtn(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-wrap justify-center items-center h-auto py-10'>
            <div className="w-96 mx-auto bg-white p-8 rounded-2xl shadow-none lg:shadow-md">
                <h1 className="text-3xl text-black font-bold mb-6 flex flex-wrap justify-center">Admin Register</h1>
                <h3 className="text-gray-700">Not registered? <Link className='font-bold text-[#FFB500]' to="/admin-login">Login</Link></h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-input mt-5 mb-6">
                        <label htmlFor="email">Email</label><br />
                        <input onChange={handleInput} value={user.email} className='w-full bg-gray-50 rounded-md px-3 py-3' type="email" name='email' id="email" placeholder=" " />
                    </div>
                    <div className="form-input mb-6">
                        <label htmlFor="password">Password</label><br />
                        <input onChange={handleInput} value={user.password} className='w-full bg-gray-50 rounded-md px-3 py-3' type="password" name="password" id="password" placeholder=" " />
                    </div>
                    <div className="form-input mb-6">
                            <label htmlFor="confirmPassword">Confirm Password</label><br />
                            <input onChange={handleInput} value={user.confirmPassword} className='w-full bg-gray-50 rounded-md px-3 py-3' type="password" name="confirmPassword" id="confirmPassword" placeholder=" " />
                        </div>
                    <button type="submit"
                        className="bg-[#FFB500] w-full text-xl font-bold text-white py-4 px-4 rounded-md hover:bg-yellow-500 transition duration-200">{!loadingBtn ? "Register" : <span className="loading loading-spinner loading-md"></span>}</button>
                </form>
            </div>
        </div>
    )
}

export default AdminRegister