import { createContext, useContext, useEffect, useState } from "react"
import isTokenExpired from "../Hooks/verifyJwtToken";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)

    const [adminId, setAdminId] = useState('')
    const [partnerId, setPartnerId] = useState('')
    const [companyId, setCompanyId] = useState('')

    const [adminData, setAdminData] = useState({})
    const [partnerData, setPartnerData] = useState({})
    const [companyData, setCompanyData] = useState({})

    const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"))
    const [partnerToken, setPartnerToken] = useState(localStorage.getItem("partnerToken"))
    const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken"))

    const storeAdminToken = (serverToken) => {
        setAdminToken(serverToken)
        return localStorage.setItem("adminToken", serverToken)
    }

    const storePartnerToken = (serverToken) => {
        setPartnerToken(serverToken)
        return localStorage.setItem("partnerToken", serverToken)
    }

    const storeCompanyToken = (serverToken) => {
        setCompanyToken(serverToken)
        return localStorage.setItem("companyToken", serverToken)
    }

    const adminAuthentication = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/current-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                setAdminData(data.data)
            }

        } catch (error) {
            console.log("Error while fetching user data")
        } finally {
            setIsLoading(false)
        }
    }

    const companyAuthentication = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company/current-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${companyToken}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                setCompanyData(data.data)
            }
        } catch (error) {
            console.log("Error while fetching user data")
        } finally {
            setIsLoading(false)
        }
    }

    const partnerAuthentication = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partner/current-user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${partnerToken}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                setPartnerData(data.data)
            }
        } catch (error) {
            console.log("Error while fetching user data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (adminToken) {
            if (isTokenExpired(adminToken)) {
                localStorage.clear()
            }
            adminAuthentication()
        }
        if (partnerToken) {
            if (isTokenExpired(partnerToken)) {
                localStorage.clear()
            }
            partnerAuthentication()
        }
        if (companyToken) {
            if (isTokenExpired(companyToken)) {
                localStorage.clear()
            }
            companyAuthentication()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ storeAdminToken, storeCompanyToken, storePartnerToken, adminData, partnerData, companyData, adminAuthentication, partnerAuthentication, companyAuthentication, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider")
    }
    return authContextValue;
}