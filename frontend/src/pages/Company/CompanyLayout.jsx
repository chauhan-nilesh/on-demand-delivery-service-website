import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import CompanyHeader from '../../components/Company/CompanyHeader'
import CompanySidebar from '../../components/Company/CompanySidebar'
import CompanyBottomNavBar from '../../components/Company/CompanyBottomNavBar'
import isTokenExpired from '../../Hooks/verifyJwtToken'

function CompanyLayout() {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (localStorage.getItem('companyToken')) {
      const token = localStorage.getItem('companyToken');
      if (isTokenExpired(token)) {
        localStorage.removeItem('companyToken');
        navigate('/company-login');
      }
    } else {
      navigate('/company-login');
    }
  }, []);
  return (
    <>
      <CompanyHeader />
      <div className='flex bg-white'>
        <aside className='h-screen sticky top-0 p-3 space-y-2 w-72 border-r border-zinc-100 bg-white text-zinc-900 hidden lg:block'>
          <CompanySidebar />
        </aside>
        <main className='w-full bg-white h-full'>
          <Outlet />
        </main>
      </div>
      <CompanyBottomNavBar />
    </>
  )
}

export default CompanyLayout