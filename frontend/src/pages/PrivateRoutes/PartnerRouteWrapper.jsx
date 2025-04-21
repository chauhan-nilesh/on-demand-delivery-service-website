import React, { useEffect } from 'react'
import isTokenExpired from '../../Hooks/verifyJwtToken';
import { useNavigate } from 'react-router-dom';

function PartnerRouteWrapper({ children }) {
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('partnerToken')) {
            const token = localStorage.getItem('partnerToken');
            if (isTokenExpired(token)) {
                localStorage.removeItem('partnerToken');
                navigate('/partner-login');
            }
        } else {
            navigate('/partner-login');
        }
    }, [])
    return children
}

export default PartnerRouteWrapper