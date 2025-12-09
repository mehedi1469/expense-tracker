"use client"
import React from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { ExpenseProvider } from '@/context/ExpenseContext'
import { AuthProvider } from '@/context/AuthContext'

function DashboardLayout({ children }) {

  return (
    <AuthProvider>
      <ExpenseProvider>
        <div className='flex min-h-screen'>
          {/* Sidebar */}
          <div className='fixed w-[280px] hidden md:block z-10'>
            <SideNav />
          </div>
          {/* Main Content */}
          <div className='flex-1 md:ml-[280px]'>
            <DashboardHeader />
            <main className='dashboard-bg'>
              {children}
            </main>
          </div>
        </div>
      </ExpenseProvider>
    </AuthProvider>
  )
}

export default DashboardLayout


