import React, { useEffect } from 'react'
import isTokenExpired from '../../Hooks/verifyJwtToken';
import { useNavigate } from 'react-router-dom';

function CompanyRouteWrapper({ children }) {
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('companyToken')) {
            const token = localStorage.getItem('companyToken');
            if (isTokenExpired(token)) {
                localStorage.removeItem('companyToken');
                navigate('/company-login');
            }
        } else {
            navigate('/company-login');
        }
    }, [])
    return children
}

export default CompanyRouteWrapper