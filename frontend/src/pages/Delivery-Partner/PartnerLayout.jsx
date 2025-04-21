import React from 'react'
import { Outlet } from 'react-router-dom'
import PartnerSidebar from '../../components/Delivery-Partner/PartnerSidebar'
import PartnerBottomNavBar from '../../components/Delivery-Partner/PartnerBottomNavBar'
import PartnerHeader from '../../components/Delivery-Partner/PartnerHeader'

function PartnerLayout() {
  return (
    <>
      <PartnerHeader />
      <div className='flex bg-white'>
        <aside className='h-screen sticky top-0 p-3 space-y-2 w-72 border-r border-zinc-100 bg-white text-zinc-900 hidden lg:block'>
          <PartnerSidebar />
        </aside>
        <main className='w-full bg-white h-full'>
          <Outlet />
        </main>
      </div>
      <PartnerBottomNavBar />
    </>
  )
}

export default PartnerLayout