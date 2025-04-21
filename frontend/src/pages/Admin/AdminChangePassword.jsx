import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from '../../store/auth';

function AdminChangePassword() {
    const { adminData, isLoading } = useAuth()
    const [changePassword, setChangePassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const adminToken = localStorage.getItem("adminToken")

    const handleInput = (e) => {
        const { name, value } = e.target;

        setChangePassword({
            ...changePassword,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (changePassword.oldPassword !== "" || changePassword.newPassword !== "") {
            if (changePassword.newPassword === changePassword.confirmPassword) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/update-password`, {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${adminToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ ...changePassword })
                    })

                    const responseData = await response.json();
                    if (response.ok) {
                        setChangePassword({
                            oldPassword: "",
                            newPassword: "",
                            confirmPassword: ""
                        })
                        toast.success(responseData.message)
                    } else {
                        toast.error(responseData.message)
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                toast.error("New password and confirm password is not matching");
            }
        }
        else {
            toast.error("All fields are required");
        }
    };

    return (
        <section className='bg-white flex-grow h-full pb-14 lg:pb-8'>
            <div className='lg:my-10 my-5 lg:mx-4 mx-3'>
                <h2 className='lg:text-3xl text-2xl text-zinc-900 font-extrabold tracking-tight'>Change Password</h2>
                <form className='grid grid-flow-row mt-6'>
                    <label className='font-semibold tracking-tight text-zinc-700 text-lg' htmlFor="oldPassword">Enter Old Password</label>
                    <input
                        type="text"
                        name='oldPassword'
                        id="oldPassword"
                        onChange={handleInput}
                        value={changePassword?.oldPassword}
                        placeholder="Old Password"
                        className="border px-3 py-3 rounded-lg outline-none text-black bg-transparent w-full max-w-xs"
                    />
                    <label className='font-semibold tracking-tight text-zinc-700 text-lg mt-5' htmlFor="newPassword">Enter New Password</label>
                    <input
                        type="text"
                        name='newPassword'
                        id="newPassword"
                        onChange={handleInput}
                        value={changePassword?.newPassword}
                        placeholder="New Password"
                        className="border px-3 py-3 rounded-lg outline-none text-black bg-transparent w-full max-w-xs"
                    />
                    <label className='font-semibold tracking-tight text-zinc-700 text-lg mt-5' htmlFor="newPassword">Confirm Password</label>
                    <input
                        type="text"
                        name='confirmPassword'
                        id="confirmPassword"
                        onChange={handleInput}
                        value={changePassword?.confirmPassword}
                        placeholder="Confirm Password"
                        className="border px-3 py-3 rounded-lg outline-none text-black bg-transparent w-full max-w-xs"
                    />
                    <button onClick={handleSubmit} className=" text-white py-3 rounded-lg tracking-tight hover:bg-zinc-800 bg-black text-base mt-6 mb-10 w-full lg:max-w-xs">Update Password</button>
                </form>
            </div>
        </section>
    )
}

export default AdminChangePassword