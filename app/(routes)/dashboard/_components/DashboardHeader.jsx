"use client"

import React from 'react'
import { Search, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function DashboardHeader() {
  const { user, loading } = useAuth();

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className='premium-header'>
      {/* Left - Title */}
      <div>
        <h2 className='header-title'>Expense Tracker</h2>
      </div>

      {/* Center - Search */}
      <div className='header-search hidden md:flex'>
        <Search className='w-4 h-4 text-slate-400' />
        <input
          type="text"
          placeholder="Search transactions, budgets..."
          className='flex-1'
        />
      </div>

      {/* Right - Actions */}
      <div className='flex items-center gap-3'>
        <div className='header-icon-btn'>
          <Bell className='w-5 h-5' />
        </div>
        <div className='header-avatar' title={user?.name || 'User'}>
          {loading ? '...' : getInitials(user?.name)}
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader


