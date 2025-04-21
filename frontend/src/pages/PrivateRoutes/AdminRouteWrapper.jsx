import React, { useEffect } from 'react'
import isTokenExpired from '../../Hooks/verifyJwtToken';
import { useNavigate } from 'react-router-dom';

function AdminRouteWrapper({ children }) {
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('adminToken')) {
            const token = localStorage.getItem('adminToken');
            if (isTokenExpired(token)) {
                localStorage.removeItem('adminToken');
                navigate('/admin-login');
            }
        } else {
            navigate('/admin-login');
        }
    }, [])
    return children
}

export default AdminRouteWrapper