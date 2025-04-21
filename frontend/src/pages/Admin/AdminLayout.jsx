import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../../components/Admin/AdminHeader'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminBottomNavBar from '../../components/Admin/AdminBottomNavBar'

function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <div className='flex bg-white'>
        <aside className='h-screen sticky top-0 p-3 space-y-2 w-72 border-r border-zinc-100 bg-white text-zinc-900 hidden lg:block'>
          <AdminSidebar/>
        </aside>
        <main className='w-full bg-white h-full'>
          <Outlet />
        </main>
      </div>
      <AdminBottomNavBar />
    </>
  )
}

export default AdminLayout