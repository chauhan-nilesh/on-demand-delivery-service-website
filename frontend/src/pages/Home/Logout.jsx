import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function Logout() {

    useEffect(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("partnerToken");
        localStorage.removeItem("companyToken");
    }, [])

    return (
        <Navigate to="/" />
    )
}

export default Logout